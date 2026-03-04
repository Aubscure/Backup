<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\CourseService;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Handles the Review (publish-readiness) step of the course creation wizard.
 * Extracted from CourseController to keep each class focused.
 */
class CourseReviewController extends Controller
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    public function show(Course $course): InertiaResponse
    {
        $this->authorize('manage', $course);

        $course->load([
            'category',
            'coursePlans',
            'syllabuses.lessons.materials',
            'syllabuses.lessons.videos',
            'user',
            'certificate',
        ]);

        $course->course_thumbnail_url = $this->courseService->resolveThumbnailUrl($course);
        $this->courseService->decorateCourse($course);

        $reviewData = $this->courseService->buildReviewChecklist($course);

        return Inertia::render('Mentor/Courses/Review', array_merge(
            ['course' => $course, 'mentor' => $course->user],
            $reviewData,
        ));
    }
}
