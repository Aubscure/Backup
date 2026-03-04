<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Category;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    // List
    // -------------------------------------------------------------------------

    public function index(Request $request): InertiaResponse
    {
        $user = Auth::user();

        // Unverified mentors see an empty shell + verification nudge.
        if (! $user->is_verified) {
            return Inertia::render('Mentor/Courses/Index', [
                'courses'               => [],
                'categories'            => Category::select('id', 'name')->get(),
                'filters'               => $request->only(['search', 'status', 'sort']),
                'verificationSubmitted' => $this->courseService->hasSubmittedVerification($user->id),
            ]);
        }

        $courses = Course::query()
            ->where('user_id', $user->id)
            ->with([
                'category',
                'certificate',
                'coursePlans',
                'syllabuses.lessons.materials',
                'syllabuses.lessons.videos',
                'syllabuses.assessments',
                'syllabuses.lessons.assessments',
            ])
            ->when($request->input('search'), function ($q, $v) {
                $q->where(function ($sub) use ($v) {
                    $sub->where('title', 'like', "%{$v}%")
                        ->orWhereHas('category', fn ($cat) => $cat->where('name', 'like', "%{$v}%"));
                });
            })
            ->when($request->input('status'), fn ($q, $v) => $q->where('draft_status', $v))
            ->orderByRaw("CASE WHEN draft_status = 'archived' THEN 1 ELSE 0 END")
            ->tap(fn ($q) => $this->applySortOrder($q, $request->input('sort', 'newest')))
            ->paginate(12);

        $courses->getCollection()->transform(function (Course $course) {
            $this->courseService->decorateCourse($course);

            [$materialsCount, $videosCount, $totalDuration, $assessmentsCount] = [0, 0, 0, 0];

            foreach ($course->syllabuses as $syllabus) {
                $assessmentsCount += $syllabus->assessments->count();

                foreach ($syllabus->lessons as $lesson) {
                    $materialsCount   += $lesson->materials->count();
                    $videosCount      += $lesson->videos->count();
                    $totalDuration    += $lesson->materials->sum('duration_seconds');
                    $assessmentsCount += $lesson->assessments->count();
                }
            }

            $course->resources_count   = $materialsCount + $videosCount;
            $course->assessments_count = $assessmentsCount;
            $course->duration_label    = $totalDuration > 0
                ? $this->courseService->formatDuration($totalDuration)
                : ($course->duration ?? null);
            $course->category_name     = $course->category?->name;

            $course->coursePlans->transform(function ($plan) {
                $plan->access_duration_label = $this->courseService->resolveAccessDurationLabel($plan);
                return $plan;
            });

            $course->updated_at_label     = $course->updated_at?->diffForHumans();
            $course->updated_at_formatted = $course->updated_at?->format('M d, Y');

            return $course;
        });

        return Inertia::render('Mentor/Courses/Index', [
            'courses'               => $courses->items(),
            'categories'            => Category::select('id', 'name')->get(),
            'filters'               => $request->only(['search', 'status', 'sort']),
            'verificationSubmitted' => $this->courseService->hasSubmittedVerification($user->id),
            'pagination'            => [
                'current_page' => $courses->currentPage(),
                'last_page'    => $courses->lastPage(),
                'per_page'     => $courses->perPage(),
                'total'        => $courses->total(),
            ],
        ]);
    }

    // -------------------------------------------------------------------------
    // Create
    // -------------------------------------------------------------------------

    public function create(): InertiaResponse|RedirectResponse
    {
        $user = Auth::user();

        if (! $user->is_verified) {
            if ($this->courseService->hasSubmittedVerification($user->id)) {
                return redirect()
                    ->route('dashboard')
                    ->with('info', 'Verification already submitted. Please wait for admin approval.');
            }

            return redirect()->route('verification.step1');
        }

        return Inertia::render('Mentor/Courses/Create', [
            'categories' => Category::all(),
        ]);
    }

    // -------------------------------------------------------------------------
    // Store
    // -------------------------------------------------------------------------

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('course_thumbnail')) {
            $validated['course_thumbnail_url'] = $request->file('course_thumbnail')
                ->store('thumbnails', 'public');
        }

        $course = Course::create(array_merge($validated, [
            'user_id'      => Auth::id(),
            'draft_status' => $request->boolean('is_draft') ? 'draft' : 'published',
        ]));

        if ($request->input('redirect_to') === 'index') {
            return redirect()->route('mentor.courses.index')->with('success', 'Course saved as draft.');
        }

        return redirect()
            ->route('mentor.courses.syllabus', $course)
            ->with('success', 'Course details saved. Proceed to syllabus.');
    }

    // -------------------------------------------------------------------------
    // Show
    // -------------------------------------------------------------------------

    public function show(Course $course): InertiaResponse|RedirectResponse
    {
        $this->authorize('manage', $course);

        if ($course->draft_status === 'archived') {
            return redirect()->route('mentor.courses.index')->with('info', 'This course has been archived.');
        }

        $course->load([
            'category',
            'user',
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
            'syllabuses.assessments.questions',
            'syllabuses.lessons.assessments.questions',
            'coursePlans',
            'certificate',
        ]);

        $this->courseService->decorateCourse($course);

        return Inertia::render('Mentor/Courses/Show', [
            'course'   => $course,
            'mentor'   => $course->user,
            'students' => [],
            'ratings'  => [],
        ]);
    }

    // -------------------------------------------------------------------------
    // Edit
    // -------------------------------------------------------------------------

    public function edit(Course $course): InertiaResponse|RedirectResponse
    {
        $this->authorize('manage', $course);

        if ($course->draft_status === 'archived') {
            return redirect()->route('mentor.courses.index')->with('info', 'Archived courses cannot be edited.');
        }

        $course->load([
            'category',
            'syllabuses.assessments',
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
            'syllabuses.lessons.assessments',
            'coursePlans',
        ]);

        $course->course_thumbnail_url = $this->courseService->resolveThumbnailUrl($course);

        return Inertia::render('Mentor/Courses/Edit', [
            'course'     => $course,
            'categories' => Category::all(),
        ]);
    }

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        $validated = $request->validated();
        $updates   = [];

        if (! empty($validated['title']))       $updates['title']       = $validated['title'];
        if (! empty($validated['description'])) $updates['description'] = $validated['description'];

        if (array_key_exists('duration', $validated)) {
            $updates['duration'] = ! empty($validated['duration']) ? $validated['duration'] : null;
        }

        if (! empty($validated['category_id'])) {
            $updates['category_id']     = $validated['category_id'];
            $updates['custom_category'] = null;
        } elseif (! empty($validated['custom_category'])) {
            $updates['category_id']     = null;
            $updates['custom_category'] = $validated['custom_category'];
        }

        if ($request->hasFile('course_thumbnail')) {
            $updates['course_thumbnail_url'] = $this->courseService->replaceThumbnail(
                $course,
                $request->file('course_thumbnail'),
            );
        }

        if (! empty($updates)) {
            $course->update($updates);
        }

        if ($request->boolean('save_as_draft')) {
            return redirect()->route('mentor.courses.index')->with('success', 'Course saved as draft.');
        }

        return redirect()->route('mentor.courses.show', $course)->with('success', 'Course updated successfully.');
    }

    // -------------------------------------------------------------------------
    // Publish
    // -------------------------------------------------------------------------

    public function publish(Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        $course->load([
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
            'coursePlans',
            'certificate',
        ]);

        // Hard gate — policy checks all 5 publish requirements.
        $this->authorize('publish', $course);

        $course->update(['draft_status' => 'published']);

        return redirect()
            ->route('mentor.courses.index')
            ->with('success', 'Course published successfully! It is now live.');
    }

    // -------------------------------------------------------------------------
    // Archive (soft-delete)
    // -------------------------------------------------------------------------

    public function archive(Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        $course->update(['draft_status' => 'archived']);

        return redirect()
            ->route('mentor.courses.index')
            ->with('success', 'Course archived. It is no longer visible in the main list.');
    }

    // -------------------------------------------------------------------------
    // Destroy (hard-delete)
    // -------------------------------------------------------------------------

    public function destroy(Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        // Clean up thumbnail.
        if ($course->course_thumbnail_url) {
            Storage::disk('public')->delete($course->course_thumbnail_url);
        }

        $course->load([
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
            'certificate',
            'coursePlans',
            'assessments',
        ]);

        // Delete stored files before touching DB records.
        foreach ($course->syllabuses as $syllabus) {
            foreach ($syllabus->lessons as $lesson) {
                foreach ($lesson->materials as $material) {
                    if ($material->file_path) {
                        Storage::disk('public')->delete($material->file_path);
                    }
                }
                $lesson->materials()->delete();
                $lesson->videos()->delete();
            }
            $syllabus->lessons()->delete();
        }

        $course->syllabuses()->delete();
        $course->coursePlans()->delete();
        $course->assessments()->delete();
        $course->certificate?->delete();
        $course->delete();

        return redirect()
            ->route('mentor.courses.index')
            ->with('success', 'Course and all its content have been permanently deleted.');
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

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
