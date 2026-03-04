<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Syllabus;
use App\Models\Lesson;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CourseSyllabusController extends Controller
{
    public function __construct(private readonly CourseService $courseService) {}

    // ── GET /courses/{course}/syllabus ────────────────────────────────────────

    public function show(Course $course): InertiaResponse
    {
        $this->authorize('manage', $course);

        $course->load(['syllabuses.lessons']);

        return Inertia::render('Mentor/Courses/Syllabus', [
            'course' => $course,
        ]);
    }

    // ── POST /courses/{course}/syllabus/save ──────────────────────────────────

    public function save(Request $request, Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        $request->validate([
            'modules'                        => ['nullable', 'array'],
            'modules.*.id'                   => ['nullable', 'integer'],
            'modules.*.title'                => ['required', 'string', 'max:255'],
            'modules.*.description'          => ['nullable', 'string'],
            'modules.*.lessons'              => ['nullable', 'array'],
            'modules.*.lessons.*.id'         => ['nullable', 'integer'],
            'modules.*.lessons.*.title'      => ['required', 'string', 'max:255'],
            'modules.*.lessons.*.description'=> ['nullable', 'string'],
            'is_draft'                       => ['nullable', 'boolean'],
            'next_step'                      => ['nullable', 'boolean'],
            'from_edit'                      => ['nullable', 'boolean'],
            'redirect_to'                    => ['nullable', 'string'],
        ]);

        $isDraft  = $request->boolean('is_draft', true);
        $nextStep = $request->boolean('next_step', false);

        DB::transaction(fn () =>
            $this->courseService->syncSyllabusTree(
                $course,
                $request->input('modules', []),
                $isDraft
            )
        );
        if ($request->boolean('from_edit')) {
            return redirect()
                ->route('mentor.courses.edit', $course)
                ->with('success', 'Syllabus updated successfully.');
        }

        if ($request->input('redirect_to') === 'index') {
            return redirect()->route('mentor.courses.index')->with('success', 'Syllabus saved as draft.');
        }

        if ($nextStep) {
            return redirect()
                ->route('mentor.courses.media-content', $course)
                ->with('success', 'Syllabus saved. Proceeding to Media Content.');
        }

        return redirect()
            ->route('mentor.courses.syllabus', $course)
            ->with('success', 'Syllabus saved.');
    }
}
