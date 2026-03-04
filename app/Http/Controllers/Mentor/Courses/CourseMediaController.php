<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Http\Requests\MediaContentSaveRequest;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Syllabus;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Handles the Media Content step of the course creation wizard.
 * Extracted from CourseController to keep each class focused.
 */
class CourseMediaController extends Controller
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    public function show(Course $course): InertiaResponse
    {
        $this->authorize('manage', $course);

        $this->ensureMediaScaffolding($course);

        $course->load(['category', 'syllabuses.lessons.materials', 'syllabuses.lessons.videos']);
        $course->course_thumbnail_url = $this->courseService->resolveThumbnailUrl($course);

        return Inertia::render('Mentor/Courses/MediaContent', ['course' => $course]);
    }

    public function save(MediaContentSaveRequest $request, Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        if ($request->boolean('from_edit')) {
            return redirect()->route('mentor.courses.edit', $course)->with('success', 'Media content updated.');
        }

        if ($request->boolean('next_step')) {
            return redirect()->route('mentor.courses.pricing', $course)->with('success', 'Media content saved. Proceeding to Pricing.');
        }

        return redirect()->route('mentor.courses.media-content', $course)->with('success', 'Changes saved.');
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    /**
     * Ensure every module has at least one lesson so the media page renders.
     * Creates a placeholder module + lesson if the course has no syllabuses yet.
     */
    private function ensureMediaScaffolding(Course $course): void
    {
        if (! $course->syllabuses()->exists()) {
            $syllabus = Syllabus::create([
                'course_id'    => $course->id,
                'title'        => 'Module 1: Introduction',
                'description'  => 'Add an overview for this module in Step 2 (Syllabus).',
                'draft_status' => 'draft',
            ]);

            Lesson::create(['syllabus_id' => $syllabus->id, 'title' => 'Lesson 1: Getting Started', 'sort_order' => 1]);

            return;
        }

        $course->syllabuses()->each(function (Syllabus $syllabus) {
            if (! $syllabus->lessons()->exists()) {
                Lesson::create(['syllabus_id' => $syllabus->id, 'title' => 'Lesson 1', 'sort_order' => 1]);
            }
        });
    }
}
