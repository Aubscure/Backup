<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CoursePlan;
use App\Models\Certificate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index()
    {
        $mentorId = Auth::id();

        // Get all courses for this mentor
        $courses = Course::where('user_id', $mentorId)
            ->with(['coursePlans', 'category', 'certificate'])
            ->get();

        // Calculate metrics
        $totalCourses = $courses->count();
        $publishedCourses = $courses->where('draft_status', 'published')->count();
        $draftCourses = $courses->where('draft_status', 'draft')->count();

        // Course breakdown by type
        $paidIndividualCourses = $courses->filter(function ($course) {
            return !$course->is_free && $course->coursePlans->contains('type', 'individual');
        })->count();

        $paidOrganizationCourses = $courses->filter(function ($course) {
            return !$course->is_free && $course->coursePlans->contains('type', 'organization');
        })->count();

        $freeCourses = $courses->where('is_free', true)->count();

        // Calculate revenue (placeholder - will need enrollment/payment system)
        $totalRevenue = 0;
        $individualRevenue = 0;
        $organizationRevenue = 0;

        foreach ($courses as $course) {
            foreach ($course->coursePlans as $plan) {
                // This is placeholder - actual revenue would come from enrollments
                // For now, we'll calculate potential revenue based on course plans
                if ($plan->type === 'individual') {
                    $individualRevenue += (float) $plan->price;
                } elseif ($plan->type === 'organization') {
                    $organizationRevenue += (float) $plan->price;
                }
            }
        }
        $totalRevenue = $individualRevenue + $organizationRevenue;

        // Get certificates
        $certificates = Certificate::whereHas('course', function ($query) use ($mentorId) {
            $query->where('user_id', $mentorId);
        })->get();

        $totalCertificates = $certificates->count();

        // Course performance data
        $coursePerformance = $courses->map(function ($course) {
            $coursePlans = $course->coursePlans;
            $individualPlan = $coursePlans->firstWhere('type', 'individual');
            $organizationPlan = $coursePlans->firstWhere('type', 'organization');

            $type = 'Free';
            if (!$course->is_free) {
                if ($individualPlan && $organizationPlan) {
                    $type = 'Paid (Both)';
                } elseif ($individualPlan) {
                    $type = 'Paid (Individual)';
                } elseif ($organizationPlan) {
                    $type = 'Paid (Organization)';
                }
            }

            // Calculate revenue for this course (placeholder)
            $revenue = 0;
            if ($individualPlan) {
                $revenue += (float) $individualPlan->price;
            }
            if ($organizationPlan) {
                $revenue += (float) $organizationPlan->price;
            }

            return [
                'id' => $course->id,
                'title' => $course->title,
                'type' => $type,
                'enrollments' => 0, // Placeholder - will come from enrollment system
                'completion_rate' => 0, // Placeholder
                'rating' => 0, // Placeholder
                'rating_count' => 0, // Placeholder
                'revenue' => $revenue,
                'certificates_issued' => $course->certificate ? 1 : 0,
                'trend' => 'up', // Placeholder
            ];
        })->sortByDesc('revenue')->take(5)->values();

        // Monthly enrollment trends (placeholder data structure)
        $enrollmentTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $enrollmentTrends[] = [
                'month' => $date->format('M'),
                'graduated' => 0, // Placeholder
                'ongoing' => 0, // Placeholder
                'pending' => 0, // Placeholder
            ];
        }

        // Status breakdown (placeholder)
        $statusBreakdown = [
            'ongoing' => 0,
            'pending' => 0,
            'graduated' => 0,
            'inactive' => 0,
        ];

        // Rating trend (placeholder)
        $ratingTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $ratingTrend[] = [
                'month' => $date->format('M'),
                'rating' => 4.5, // Placeholder
            ];
        }

        // Calculate courses this month
        $coursesThisMonth = $courses->filter(function ($course) {
            return $course->created_at->isCurrentMonth();
        })->count();

        return Inertia::render('Mentor/Analytics/Index', [
            'metrics' => [
                'total_courses' => $totalCourses,
                'published_courses' => $publishedCourses,
                'draft_courses' => $draftCourses,
                'courses_this_month' => $coursesThisMonth,
                'paid_individual_courses' => $paidIndividualCourses,
                'paid_organization_courses' => $paidOrganizationCourses,
                'free_courses' => $freeCourses,
                'total_enrollees' => 0, // Placeholder
                'enrollees_this_month' => 0, // Placeholder
                'enrollees_change_percent' => 0, // Placeholder
                'ongoing_enrollees' => 0, // Placeholder
                'pending_enrollees' => 0, // Placeholder
                'graduated_enrollees' => 0, // Placeholder
                'total_revenue' => $totalRevenue,
                'individual_revenue' => $individualRevenue,
                'organization_revenue' => $organizationRevenue,
                'revenue_this_month' => 0, // Placeholder
                'revenue_change_percent' => 0, // Placeholder
                'mentor_rating' => 0, // Placeholder
                'rating_change' => 0, // Placeholder
                'total_reviews' => 0, // Placeholder
                'completion_rate' => 0, // Placeholder
                'completion_rate_change' => 0, // Placeholder
                'revenue_per_learner' => 0, // Placeholder
                'revenue_per_learner_change' => 0, // Placeholder
                'average_order_value' => 0, // Placeholder
                'repeat_organizations' => 0, // Placeholder
                'repeat_organizations_count' => 0, // Placeholder
                'total_organizations' => 0, // Placeholder
                'certificates_issued' => $totalCertificates,
                'certificates_this_week' => 0, // Placeholder
                'certificate_download_rate' => 0, // Placeholder
                'completion_certificate_rate' => 0, // Placeholder
                'certificates_per_organization' => 0, // Placeholder
                'linkedin_share_rate' => 0, // Placeholder
            ],
            'course_performance' => $coursePerformance,
            'enrollment_trends' => $enrollmentTrends,
            'status_breakdown' => $statusBreakdown,
            'rating_trend' => $ratingTrend,
            'insights' => [], // Placeholder for smart insights
            'organization_insights' => [], // Placeholder for B2B insights
        ]);
    }
}


