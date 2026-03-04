<?php

namespace App\Http\Controllers\Enrollee;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Models\Lesson;
use App\Models\LessonVideoCompletion;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class LessonController extends Controller
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    // -------------------------------------------------------------------------
    // Show lesson (video + materials). Enforces sequential video completion.
    // -------------------------------------------------------------------------

    public function show(Course $course, Lesson $lesson): InertiaResponse|RedirectResponse
    {
        abort_if($course->draft_status !== 'published', 404, 'Course not found.');

        $course->load([
            'category',
            'user',
            'coursePlans',
            'syllabuses'              => fn ($q) => $q->orderBy('id'),
            'syllabuses.lessons'      => fn ($q) => $q->orderBy('sort_order'),
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
        ]);

        // Guard: lesson must belong to this course.
        abort_if((int) $lesson->syllabus->course_id !== (int) $course->id, 404, 'Lesson not found.');

        $enrollment = $this->resolveEnrollment($course);

        if (! $this->hasAccess($course, $enrollment)) {
            return redirect()
                ->route('enrollee.courses.show', $course)
                ->with('info', 'Please complete payment to access this course.');
        }

        $orderedLessons    = $this->courseService->getOrderedLessonsForCourse($course);
        $currentIndex      = $orderedLessons->search(fn ($l) => (int) $l->id === (int) $lesson->id);

        abort_if($currentIndex === false, 404, 'Lesson not found.');

        $completedVideoIds = $enrollment->lessonVideoCompletions()->pluck('lesson_video_id')->all();
        $isUnlocked        = $this->buildUnlockChecker($orderedLessons, $completedVideoIds);

        // Redirect to the furthest unlocked lesson if the user tries to skip ahead.
        if (! $isUnlocked($currentIndex)) {
            $redirectLesson = $this->lastUnlockedLesson($orderedLessons, $isUnlocked);

            return redirect()
                ->route('enrollee.courses.lessons.show', [$course, $redirectLesson])
                ->with('info', 'Finish the previous lesson\'s video(s) to unlock this lesson.');
        }

        // canProceed: all videos in the current lesson are watched.
        $lessonVideoIds = $lesson->videos->pluck('id')->all();
        $canProceed     = empty($lessonVideoIds)
            || count(array_intersect($lessonVideoIds, $completedVideoIds)) === count($lessonVideoIds);

        $allLessonsForNav = $orderedLessons
            ->map(fn ($l, $i) => [
                'id'             => $l->id,
                'title'          => $l->title,
                'syllabus_id'    => $l->syllabus_id,
                'syllabus_title' => $l->syllabus->title ?? 'Module',
                'index'          => $i + 1,
                'total'          => $orderedLessons->count(),
                'unlocked'       => $isUnlocked($i),
            ])
            ->values()
            ->all();

        if ($course->course_thumbnail_url) {
            $course->course_thumbnail_url = Storage::url($course->course_thumbnail_url);
        }

        return Inertia::render('Enrollee/Courses/Lesson', [
            'course'            => $course,
            'lesson'            => $lesson->load('materials', 'videos'),
            'syllabus'          => $lesson->syllabus,
            'lessonNumber'      => $currentIndex + 1,
            'totalLessons'      => $orderedLessons->count(),
            'allLessonsForNav'  => $allLessonsForNav,
            'currentIndex'      => $currentIndex,
            'completedVideoIds' => $completedVideoIds,
            'canProceed'        => $canProceed,
        ]);
    }

    // -------------------------------------------------------------------------
    // Mark a video as completed
    // -------------------------------------------------------------------------

    public function completeVideo(Course $course, Lesson $lesson, Request $request): RedirectResponse
    {
        abort_if($course->draft_status !== 'published', 404, 'Course not found.');

        $lesson->load('syllabus', 'videos');

        abort_if((int) $lesson->syllabus->course_id !== (int) $course->id, 404, 'Lesson not found.');

        $lessonVideoId = (int) $request->input('lesson_video_id');

        if (! $lessonVideoId || ! $lesson->videos->contains('id', $lessonVideoId)) {
            return redirect()->back()->with('error', 'Invalid video.');
        }

        $enrollment = CourseEnrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if (! $enrollment) {
            return redirect()->route('enrollee.courses.show', $course);
        }

        LessonVideoCompletion::firstOrCreate(
            [
                'enrollment_id'   => $enrollment->id,
                'lesson_video_id' => $lessonVideoId,
            ],
            ['completed_at' => now()]
        );

        return redirect()->back()->with('success', 'Video marked complete.');
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Resolve or auto-create enrollment for free courses.
     */
    private function resolveEnrollment(Course $course): CourseEnrollment
    {
        $isFree         = (bool) $course->is_free;
        $individualPlan = $course->coursePlans->firstWhere('type', 'individual');

        if (! $isFree && $individualPlan && (float) $individualPlan->price <= 0) {
            $isFree = true;
        }

        return CourseEnrollment::firstOrCreate(
            ['user_id' => Auth::id(), 'course_id' => $course->id],
            ['amount_paid' => null, 'paid_at' => $isFree ? now() : null]
        );
    }

    /**
     * Check whether the authenticated user has paid (or the course is free).
     */
    private function hasAccess(Course $course, CourseEnrollment $enrollment): bool
    {
        $isFree         = (bool) $course->is_free;
        $individualPlan = $course->coursePlans->firstWhere('type', 'individual');

        if (! $isFree && $individualPlan && (float) $individualPlan->price <= 0) {
            $isFree = true;
        }

        return $isFree || $enrollment->paid_at !== null;
    }

    /**
     * Returns a closure that answers "is lesson at $index unlocked?".
     * A lesson is unlocked only when every preceding lesson's videos are complete.
     *
     * @param  \Illuminate\Support\Collection  $orderedLessons
     * @param  array                           $completedVideoIds
     * @return \Closure(int): bool
     */
    private function buildUnlockChecker(
        \Illuminate\Support\Collection $orderedLessons,
        array $completedVideoIds
    ): \Closure {
        return function (int $index) use ($orderedLessons, $completedVideoIds): bool {
            if ($index === 0) {
                return true;
            }

            for ($j = 0; $j < $index; $j++) {
                $prevVideoIds = $orderedLessons[$j]->videos->pluck('id')->all();

                if (
                    ! empty($prevVideoIds) &&
                    count(array_intersect($prevVideoIds, $completedVideoIds)) !== count($prevVideoIds)
                ) {
                    return false;
                }
            }

            return true;
        };
    }

    /**
     * Walk forward through lessons and return the last one that is still unlocked.
     *
     * @param  \Illuminate\Support\Collection  $orderedLessons
     * @param  \Closure(int): bool             $isUnlocked
     */
    private function lastUnlockedLesson(
        \Illuminate\Support\Collection $orderedLessons,
        \Closure $isUnlocked
    ): Lesson {
        $lastUnlockedIndex = 0;

        for ($k = 0; $k < $orderedLessons->count(); $k++) {
            if ($isUnlocked($k)) {
                $lastUnlockedIndex = $k;
            } else {
                break;
            }
        }

        return $orderedLessons[$lastUnlockedIndex];
    }
}
