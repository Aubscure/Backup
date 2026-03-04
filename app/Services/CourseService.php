<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CoursePlan;
use App\Models\Lesson;
use App\Models\LessonMaterial;
use App\Models\Syllabus;
use Illuminate\Support\Facades\Storage;

/**
 * Centralises all repeated course-related business logic that was previously
 * copy-pasted across index(), show(), review(), and enrolleeIndex().
 */
class CourseService
{
    // ── Thumbnail ─────────────────────────────────────────────────────────────

    /**
     * Resolve a stored thumbnail path to a full public URL.
     * Returns null when no thumbnail is set so callers can test truthiness.
     */
    public function resolveThumbnailUrl(Course $course): ?string
    {
        $raw = $course->getRawOriginal('course_thumbnail_url');

        return $raw ? Storage::url($raw) : null;
    }

    /**
     * Replace old thumbnail on disk and return the new storage path.
     * The caller is responsible for persisting the returned path.
     */
    public function replaceThumbnail(Course $course, \Illuminate\Http\UploadedFile $file): string
    {
        $raw = $course->getRawOriginal('course_thumbnail_url');

        if ($raw) {
            Storage::disk('public')->delete($raw);
        }

        return $file->store('thumbnails', 'public');
    }

    // ── Duration / Stats ──────────────────────────────────────────────────────

    /**
     * Aggregate materials count and total video duration (seconds) from an
     * already-loaded `syllabuses.lessons.materials` relationship tree.
     *
     * Returns ['files_count' => int, 'total_duration_seconds' => int]
     */
    public function aggregateCourseStats(Course $course): array
    {
        $filesCount    = 0;
        $totalDuration = 0;

        foreach ($course->syllabuses as $syllabus) {
            foreach ($syllabus->lessons as $lesson) {
                $filesCount    += $lesson->materials->count();
                $totalDuration += $lesson->materials->sum('duration_seconds');
            }
        }

        return [
            'files_count'            => $filesCount,
            'total_duration_seconds' => $totalDuration,
        ];
    }

    /**
     * Format a raw duration in seconds to a human-readable label such as
     * "2h 15m", "45m", or "3h". Falls back to $course->duration when present.
     */
    public function formatDurationLabel(Course $course, int $totalSeconds): string
    {
        // Prefer the manually-entered course duration string when set.
        if (! empty($course->duration)) {
            return $course->duration;
        }

        if ($totalSeconds <= 0) {
            return '0h';
        }

        $hours = intdiv($totalSeconds, 3600);
        $mins  = intdiv($totalSeconds % 3600, 60);

        return match (true) {
            $hours > 0 && $mins > 0 => "{$hours}h {$mins}m",
            $hours > 0              => "{$hours}h",
            default                 => "{$mins}m",
        };
    }

    /**
     * Decorate a Course model with `files_count`, `duration_label`, and a
     * resolved `course_thumbnail_url`. Mutates and returns the same instance.
     */
    public function decorateCourse(Course $course): Course
    {
        $stats = $this->aggregateCourseStats($course);

        $course->files_count         = $stats['files_count'];
        $course->duration_label      = $this->formatDurationLabel($course, $stats['total_duration_seconds']);
        $course->course_thumbnail_url = $this->resolveThumbnailUrl($course);

        return $course;
    }

    // ── Syllabus ──────────────────────────────────────────────────────────────

    /**
     * Upsert a full syllabus tree (modules + lessons) inside a DB transaction.
     * Orphaned syllabuses and lessons are pruned automatically.
     */
    public function syncSyllabusTree(Course $course, array $modules, bool $isDraft): void
    {
        $keptSyllabusIds = [];

        foreach ($modules as $index => $moduleData) {
            $syllabusId = $moduleData['id'] ?? null;

            $syllabus = $syllabusId
                ? Syllabus::where('course_id', $course->id)->find($syllabusId)
                : null;

            $syllabusPayload = [
                'title'       => $moduleData['title'],
                'description' => $moduleData['description'] ?? null,
            ];

            if ($syllabus) {
                // Only force-draft when the flag is set; never auto-publish.
                if ($isDraft) {
                    $syllabusPayload['draft_status'] = 'draft';
                }
                $syllabus->update($syllabusPayload);
            } else {
                $syllabus = Syllabus::create(array_merge($syllabusPayload, [
                    'course_id'    => $course->id,
                    'draft_status' => $isDraft ? 'draft' : 'published',
                ]));
            }

            $keptSyllabusIds[] = $syllabus->id;

            $keptLessonIds = [];

            foreach (($moduleData['lessons'] ?? []) as $lessonIndex => $lessonData) {
                $lessonId = $lessonData['id'] ?? null;

                $lesson = $lessonId
                    ? Lesson::where('syllabus_id', $syllabus->id)->find($lessonId)
                    : null;

                $lessonPayload = [
                    'title'       => $lessonData['title'],
                    'description' => $lessonData['description'] ?? null,
                    'sort_order'  => $lessonIndex + 1,
                ];

                if ($lesson) {
                    $lesson->update($lessonPayload);
                } else {
                    $lesson = Lesson::create(array_merge($lessonPayload, ['syllabus_id' => $syllabus->id]));
                }

                $keptLessonIds[] = $lesson->id;
            }

            // Prune removed lessons within this module.
            Lesson::where('syllabus_id', $syllabus->id)
                ->whereNotIn('id', $keptLessonIds)
                ->delete();
        }

        // Prune removed modules.
        Syllabus::where('course_id', $course->id)
            ->whereNotIn('id', $keptSyllabusIds)
            ->delete();
    }

    // ── Pricing ───────────────────────────────────────────────────────────────

    /**
     * Build a human-readable duration string from access-type fields.
     * Returns "Lifetime" for lifetime plans.
     */
    public function buildPlanDuration(string $accessType, ?int $amount, ?string $unit): string
    {
        if ($accessType !== 'limited' || ! $amount || ! $unit) {
            return 'Lifetime';
        }

        return "{$amount} " . ucfirst($unit);
    }

    /**
     * Upsert both pricing plans for a course in one call.
     */
    public function syncPricingPlans(Course $course, array $validated): void
    {
        $isFree = $validated['is_free'] ?? false;
        $course->update(['is_free' => $isFree]);

        $plans = [
            'individual' => [
                'name'     => 'Individual',
                'price'    => ($isFree || ($validated['individual_free'] ?? false))
                    ? 0
                    : ($validated['individual_price'] ?? 0),
                'duration' => $this->buildPlanDuration(
                    $validated['individual_access_type'] ?? 'lifetime',
                    $validated['individual_duration_amount'] ?? null,
                    $validated['individual_duration_unit']   ?? null,
                ),
            ],
            'organization' => [
                'name'     => 'Organization',
                'price'    => ($isFree || ($validated['organization_free'] ?? false))
                    ? 0
                    : ($validated['organization_price'] ?? 0),
                'duration' => $this->buildPlanDuration(
                    $validated['organization_access_type'] ?? 'lifetime',
                    $validated['organization_duration_amount'] ?? null,
                    $validated['organization_duration_unit']   ?? null,
                ),
            ],
        ];

        foreach ($plans as $type => $data) {
            CoursePlan::updateOrCreate(
                ['course_id' => $course->id, 'type' => $type],
                $data,
            );
        }

        // Remove any legacy plan types that no longer belong.
        CoursePlan::where('course_id', $course->id)
            ->whereNotIn('type', array_keys($plans))
            ->delete();
    }

    // ── Verification ──────────────────────────────────────────────────────────

    /**
     * Whether the given user has a pending verification document on file.
     */
    public function hasSubmittedVerification(int $userId): bool
    {
        return \App\Models\VerificationDocument::where('user_id', $userId)
            ->where('status', 'pending')
            ->exists();
    }

    // ── Checklist (Review page) ───────────────────────────────────────────────

    /**
     * Compute the publish-readiness checklist for the Review page.
     * Requires `syllabuses.lessons.materials` to be loaded on $course.
     */
public function buildReviewChecklist(Course $course): array
    {
        $hasBasicInfo = ! empty($course->title)
            && ! empty($course->description)
            && ($course->category_id || $course->custom_category);

        $syllabusCount = $course->syllabuses->count();
        $lessonCount   = $course->syllabuses->sum(fn ($s) => $s->lessons->count());
        $hasCurriculum = $syllabusCount > 0 && $lessonCount > 0;

        $mediaCount          = 0; // Total count of both files and videos
        $totalDuration       = 0;
        $modulesWithoutMedia = [];

        foreach ($course->syllabuses as $syllabus) {
            $moduleHasMedia = false;

            foreach ($syllabus->lessons as $lesson) {
                $materialCount = $lesson->materials->count();
                $videoCount    = $lesson->videos->count(); // Now checking videos as well

                if ($materialCount > 0 || $videoCount > 0) {
                    $moduleHasMedia = true;
                }

                $mediaCount    += ($materialCount + $videoCount);
                $totalDuration += $lesson->materials->sum('duration_seconds') + $lesson->videos->sum('duration');
            }

            if (! $moduleHasMedia) {
                $modulesWithoutMedia[] = $syllabus->title;
            }
        }

        $hasMedia   = $syllabusCount > 0 && count($modulesWithoutMedia) === 0;
        $hasPricing = $course->is_free || $course->coursePlans->isNotEmpty();

        $hasCertificate = $course->certificate !== null;

        $steps = [$hasBasicInfo, $hasCurriculum, $hasMedia, $hasPricing, $hasCertificate];
        $completedSteps = count(array_filter($steps));
        $progress       = round(($completedSteps / count($steps)) * 100);

        return [
            'checklist' => [
                'has_basic_info'        => $hasBasicInfo,
                'has_curriculum'        => $hasCurriculum,
                'syllabus_count'        => $syllabusCount,
                'lesson_count'          => $lessonCount,
                'has_media'             => $hasMedia,
                'media_count'           => $mediaCount,
                'total_duration'        => $totalDuration,
                'modules_without_media' => $modulesWithoutMedia,
                'has_pricing'           => $hasPricing,
                'has_certificate'       => $hasCertificate,
            ],
            'completeness_progress' => $progress,
        ];
    }

    // ── Enrollee lesson order ───────────────────────────────────────────────────

    /**
     * Get lessons for a course in display order (syllabuses by id, lessons by sort_order).
     */
    public function getOrderedLessonsForCourse(Course $course): \Illuminate\Support\Collection
    {
        $course->load(['syllabuses' => fn ($q) => $q->orderBy('id')]);
        $course->load(['syllabuses.lessons' => fn ($q) => $q->orderBy('sort_order')]);

        $lessons = collect();
        foreach ($course->syllabuses as $syllabus) {
            foreach ($syllabus->lessons as $lesson) {
                $lessons->push($lesson);
            }
        }
        return $lessons;
    }

    public function resolveAccessDurationLabel(CoursePlan $plan): string
    {
        // Priority 1: numeric days column (most precise)
        if (! empty($plan->access_duration_days)) {
            return match (true) {
                $plan->access_duration_days >= 36500 => 'Lifetime',
                $plan->access_duration_days >= 365   => floor($plan->access_duration_days / 365) . ' Year',
                $plan->access_duration_days >= 30    => floor($plan->access_duration_days / 30)  . ' Months',
                default                              => $plan->access_duration_days . ' Days',
            };
        }

        // Priority 2: enum string column written by older code paths
        if (! empty($plan->access_duration)) {
            return match ($plan->access_duration) {
                'lifetime' => 'Lifetime',
                '2_years'  => '2 Years',
                '1_year'   => '1 Year',
                '6_months' => '6 Months',
                '3_months' => '3 Months',
                '1_month'  => '1 Month',
                default    => 'Lifetime',
            };
        }

        // Priority 3: human-readable string written by syncPricingPlans->buildPlanDuration
        // e.g. "Lifetime", "3 Months", "1 Year"
        if (! empty($plan->duration)) {
            return $plan->duration;
        }

        return 'Lifetime';
    }

    public function formatDuration(int $totalSeconds): string
    {
        if ($totalSeconds <= 0) {
            return '0h';
        }

        $hours = intdiv($totalSeconds, 3600);
        $mins  = intdiv($totalSeconds % 3600, 60);

        return match (true) {
            $hours > 0 && $mins > 0 => "{$hours}h {$mins}m",
            $hours > 0              => "{$hours}h",
            default                 => "{$mins}m",
        };
    }
}
