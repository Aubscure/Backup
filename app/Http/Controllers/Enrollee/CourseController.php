<?php

namespace App\Http\Controllers\Enrollee;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrolleeCoursesIndexRequest;
use App\Http\Requests\EnrolleeRecordPaymentRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseEnrollment;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CourseController extends Controller
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    // -------------------------------------------------------------------------
    // Browse all published courses
    // -------------------------------------------------------------------------

    public function index(EnrolleeCoursesIndexRequest $request): InertiaResponse
    {
        $validated = $request->validated();

        $courses = Course::query()
            ->where('draft_status', 'published')
            ->with([
                'user',
                'category',
                'coursePlans',
                'syllabuses.lessons.materials',
                'syllabuses.lessons.videos',
                'certificate',
                'assessments',
                'enrollments',
            ])
            ->when($validated['search'] ?? null, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('category', fn ($cat) => $cat->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($validated['type'] ?? null, function ($q, $type) {
                // Extend with type-mapping logic as needed.
            })
            ->tap(fn ($q) => $this->applySortOrder($q, $validated['sort'] ?? 'newest'))
            ->get()
            ->map(fn (Course $course) => $this->decorateForEnrollee($course));

        return Inertia::render('Enrollee/Courses/Index', [
            'courses'    => $courses,
            'categories' => Category::select('id', 'name')->get(),
            'filters'    => [
                'search' => $validated['search'] ?? null,
                'type'   => $validated['type']   ?? null,
                'sort'   => $validated['sort']   ?? 'newest',
            ],
        ]);
    }

    // -------------------------------------------------------------------------
    // Show a single published course (free = full access; paid = lock overlay)
    // -------------------------------------------------------------------------

// -------------------------------------------------------------------------
    // Show a single published course (free = full access; paid = lock overlay)
    // -------------------------------------------------------------------------

public function show(Course $course): InertiaResponse
    {
        abort_if($course->draft_status !== 'published', 404, 'Course not found.');

        // Update the eager loading to count the mentor's published courses
        $course->load([
            'category',
            'user' => function ($query) {
                $query->withCount(['courses' => function ($q) {
                    $q->where('draft_status', 'published');
                }]);
            },
            'coursePlans',
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
            'certificate',
        ]);

        $course = $this->decorateForEnrollee($course);

        [$isFree, $coursePrice] = $this->resolvePricing($course);

        $enrollment = CourseEnrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        $hasAccess = $isFree || ($enrollment && $enrollment->paid_at !== null);

        return Inertia::render('Enrollee/Courses/Show', [
            'course'      => $course,
            'hasAccess'   => $hasAccess,
            'isFree'      => $isFree,
            'coursePrice' => $coursePrice,
            'enrollment'  => $enrollment ? [
                'id'          => $enrollment->id,
                'amount_paid' => $enrollment->amount_paid,
                'paid_at'     => $enrollment->paid_at?->toIso8601String(),
            ] : null,
        ]);
    }

    // -------------------------------------------------------------------------
    // Record manual payment → grant access
    // -------------------------------------------------------------------------

    public function recordPayment(Course $course, EnrolleeRecordPaymentRequest $request): RedirectResponse
    {
        abort_if($course->draft_status !== 'published', 404, 'Course not found.');

        $course->load('coursePlans');

        [$isFree] = $this->resolvePricing($course);

        if ($isFree) {
            return redirect()
                ->route('enrollee.courses.show', $course)
                ->with('info', 'This course is free; no payment needed.');
        }

        $validated = $request->validated();

        $enrollment = CourseEnrollment::firstOrCreate(
            ['user_id' => Auth::id(), 'course_id' => $course->id],
            ['amount_paid' => null, 'paid_at' => null]
        );

        $enrollment->update([
            'amount_paid' => $validated['amount_paid'],
            'paid_at'     => now(),
        ]);

        return redirect()
            ->route('enrollee.courses.show', $course)
            ->with('success', 'Payment recorded. You now have access to this course.');
    }

    // -------------------------------------------------------------------------
    // Start a course → enroll if needed → redirect to first lesson
    // -------------------------------------------------------------------------

    public function start(Course $course): RedirectResponse
    {
        abort_if($course->draft_status !== 'published', 404, 'Course not found.');

        $course->load(['coursePlans', 'syllabuses.lessons']);

        [$isFree] = $this->resolvePricing($course);

        $enrollment = CourseEnrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        $hasAccess = $isFree || ($enrollment && $enrollment->paid_at !== null);

        if (! $hasAccess) {
            return redirect()
                ->route('enrollee.courses.show', $course)
                ->with('info', 'Please complete payment to access this course.');
        }

        // Auto-enroll for free courses.
        if (! $enrollment) {
            $enrollment = CourseEnrollment::create([
                'user_id'     => Auth::id(),
                'course_id'   => $course->id,
                'amount_paid' => null,
                'paid_at'     => $isFree ? now() : null,
            ]);
        }

        $firstLesson = $this->courseService->getOrderedLessonsForCourse($course)->first();

        if (! $firstLesson) {
            return redirect()
                ->route('enrollee.courses.show', $course)
                ->with('info', 'This course has no lessons yet.');
        }

        return redirect()->route('enrollee.courses.lessons.show', [$course, $firstLesson]);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Attach computed display fields to a course for enrollee views.
     */
private function decorateForEnrollee(Course $course): Course
{
    if ($course->course_thumbnail_url) {
        $course->course_thumbnail_url = Storage::url($course->course_thumbnail_url);
    }

    $filesCount       = 0;
    $totalDuration    = 0;
    $assessmentsCount = 0;

    foreach ($course->syllabuses as $syllabus) {
        $assessmentsCount += $syllabus->assessments->count();

        foreach ($syllabus->lessons as $lesson) {
            $filesCount       += $lesson->materials->count();
            $totalDuration    += $lesson->materials->sum('duration_seconds');
            $assessmentsCount += $lesson->assessments->count();
        }
    }

    $course->files_count       = $filesCount;
    $course->assessments_count = $assessmentsCount;

    $course->students_count = $course->enrollments ? $course->enrollments->count() : 0;
    $course->ratings_count  = $course->ratings     ? $course->ratings->count()     : 0;

    $course->duration_label = $totalDuration > 0
        ? $this->courseService->formatDuration($totalDuration)
        : ($course->duration ?? '0h');

    $course->updated_at_diff = $course->updated_at?->diffForHumans();

    if ($course->relationLoaded('coursePlans')) {
        $course->coursePlans->transform(function ($plan) {
            $plan->access_duration_label = $this->courseService->resolveAccessDurationLabel($plan);
            return $plan;
        });
    }

    // ── NEW: has the authenticated user already paid for this course? ──────
    // Uses the already-loaded `enrollments` collection (zero extra queries).
    $userId = Auth::id();
    $course->is_enrolled = $course->relationLoaded('enrollments')
        ? $course->enrollments
              ->where('user_id', $userId)
              ->whereNotNull('paid_at')
              ->isNotEmpty()
        : false;

    return $course;
}

    /**
     * Determine whether a course is free and return its price.
     *
     * @return array{bool, float}  [isFree, coursePrice]
     */
    private function resolvePricing(Course $course): array
    {
        $isFree         = (bool) $course->is_free;
        $individualPlan = $course->coursePlans->firstWhere('type', 'individual');

        if (! $isFree && $individualPlan && (float) $individualPlan->price <= 0) {
            $isFree = true;
        }

        $coursePrice = $individualPlan ? (float) $individualPlan->price : 0.0;

        return [$isFree, $coursePrice];
    }

    private function applySortOrder(\Illuminate\Database\Eloquent\Builder $query, string $sort): void
    {
        match ($sort) {
            'oldest'     => $query->oldest(),
            'title_asc'  => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default      => $query->latest(),
        };
    }


    public function myCourses(): InertiaResponse
        {
            $courses = Course::query()
                ->where('draft_status', 'published')
                ->whereHas('enrollments', fn ($q) => $q->where('user_id', Auth::id()))
                ->with([
                    'user', 
                    'category', 
                    'coursePlans', 
                    'syllabuses.lessons.materials', 
                    'syllabuses.lessons.videos', 
                    'certificate', 
                    'assessments', 
                    'enrollments',
                ])
                ->latest()
                ->get()
                ->map(fn ($course) => $this->decorateForEnrollee($course)); // Updated decorator

            return Inertia::render('Enrollee/Courses/Index', [
                'courses'    => $courses,
                'categories' => Category::select('id', 'name')->get(),
                'filters'    => [
                    'search'   => null,
                    'category' => null,
                    'type'     => null,
                    'sort'     => 'newest',
                ],
                'pageTitle'  => 'My Courses',
            ]);
        }




}
