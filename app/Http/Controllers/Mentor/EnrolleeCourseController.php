<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrolleeCoursesIndexRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Services\CourseService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Displays the course catalogue for enrollees.
 *
 * ⚠️  BUG FIX NOTE:
 * The original `enrolleeIndex()` in CourseController queried courses by
 * `user_id = Auth::id()`, which returns the *mentor's own* courses —
 * not the enrollee's enrolled courses. This is almost certainly wrong.
 *
 * This class has been refactored to show ALL published courses
 * (the typical enrollee catalogue). Once an `enrollments` table exists,
 * swap the `->where('draft_status', 'published')` scope for:
 *
 *   ->whereHas('enrollments', fn ($q) => $q->where('user_id', Auth::id()))
 */
class EnrolleeCourseController extends Controller
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    public function index(EnrolleeCoursesIndexRequest $request): InertiaResponse
    {
        $validated = $request->validated();

        $courses = Course::query()
            ->where('draft_status', 'published')          // Show only live courses.
            ->with(['category', 'coursePlans', 'syllabuses.lessons.materials'])
            ->when($validated['search'] ?? null, fn ($q, $v) =>
                $q->where(fn ($inner) =>
                    $inner->where('title', 'like', "%{$v}%")
                          ->orWhere('description', 'like', "%{$v}%")
                ))
            ->when($validated['category'] ?? null, fn ($q, $v) => $q->where('category_id', $v))
            ->tap(fn ($q) => $this->applySortOrder($q, $validated['sort'] ?? 'newest'))
            ->get()
            ->map(fn ($course) => $this->courseService->decorateCourse($course));

        return Inertia::render('Enrollee/Courses/Index', [
            'courses'    => $courses,
            'categories' => Category::select('id', 'name')->get(),
            'filters'    => [
                'search'   => $validated['search']   ?? null,
                'category' => $validated['category'] ?? null,
                'type'     => $validated['type']     ?? null,
                'sort'     => $validated['sort']     ?? 'newest',
            ],
            'pageTitle'  => null,
        ]);
    }

    /**
     * List courses the current user has enrolled in (My Courses).
     */
    public function myCourses(): InertiaResponse
    {
        $courses = Course::query()
            ->where('draft_status', 'published')
            ->whereHas('enrollments', fn ($q) => $q->where('user_id', Auth::id()))
            ->with(['category', 'coursePlans', 'syllabuses.lessons.materials'])
            ->latest()
            ->get()
            ->map(fn ($course) => $this->courseService->decorateCourse($course));

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

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function applySortOrder(\Illuminate\Database\Eloquent\Builder $query, string $sort): void
    {
        match ($sort) {
            'oldest'     => $query->oldest(),
            'title_asc'  => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default      => $query->latest(),
        };
    }
}
