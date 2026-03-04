<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Http\Requests\PricingSaveRequest;
use App\Models\Course;
use App\Services\CourseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CoursePricingController extends Controller
{
    public function __construct(private readonly CourseService $courseService)
    {
    }

    public function show(Course $course): InertiaResponse
    {
        $this->authorize('manage', $course);

        // Refresh ensures we always get the latest DB state (not a stale
        // model that was bound before the most recent save).
        $course->refresh();
        $course->load(['category', 'coursePlans']);

        $course->course_thumbnail_url = $this->courseService->resolveThumbnailUrl($course);

        // Mirror the same decoration that CourseController::index() applies
        // so the frontend receives access_duration_label on every plan.
        $course->coursePlans->transform(function ($plan) {
            $plan->access_duration_label = $this->courseService->resolveAccessDurationLabel($plan);
            return $plan;
        });

        return Inertia::render('Mentor/Courses/Pricing', ['course' => $course]);
    }

    public function save(PricingSaveRequest $request, Course $course): RedirectResponse
    {
        $this->authorize('manage', $course);

        DB::transaction(fn () => $this->courseService->syncPricingPlans($course, $request->validated()));

        if ($request->boolean('from_edit')) {
            return redirect()->route('mentor.courses.edit', $course)->with('success', 'Pricing updated.');
        }

        if ($request->boolean('next_step')) {
            return redirect()->route('mentor.courses.review', $course)->with('success', 'Pricing saved. Please review your course.');
        }

        return redirect()->route('mentor.courses.pricing', $course)->with('success', 'Pricing saved.');
    }
}
