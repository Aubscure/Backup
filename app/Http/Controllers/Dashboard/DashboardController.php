<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Platform;
use App\Models\VerificationDocument;
use App\Support\Enums\CompanyNames;
use App\Support\Enums\EducationFields;
use App\Support\Enums\JobPositions;
use App\Support\Enums\PhilippineLicenses;
use App\Support\Enums\Professions;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->fresh(['courses']);

        $verificationSubmitted = VerificationDocument::query()
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        // ---------- Course-dependent data ----------
        $courses    = $user->courses ?? collect();

        // Any course exists (draft, published, or unpublished) — used for checklist step 3
        $hasCourse = $courses->isNotEmpty();

        // At least one published course — used for checklist step 4
        $hasPublishedCourse = $courses->where('draft_status', 'published')->isNotEmpty();

        // Shows the full DashboardOverview only once verified AND has a published course.
        // A draft alone keeps the user on the checklist so they can see step 3 tick off
        // and then step 4 (Publish & Earn) before the overview replaces the checklist.
        $hasCourses = $user->is_verified && $hasPublishedCourse;

        $publishedCourseCount = $courses->where('draft_status', 'published')->count();

        $stats = $hasCourses ? [
            [
                'title'   => 'TOTAL COURSES',
                'value'   => (string) $courses->count(),
                'change'  => '+' . $courses->filter(fn ($c) => $c->created_at->month === now()->month)->count() . ' this month',
                'footer'  => $courses->where('draft_status', 'published')->count() . ' Published | ' . $courses->where('draft_status', 'draft')->count() . ' Drafts',
                'iconKey' => 'GraduationCap',
            ],
            [
                'title'   => 'ACTIVE ENROLLEES',
                'value'   => '0',
                'change'  => 'No enrollees yet',
                'footer'  => 'Enrollments coming soon',
                'iconKey' => 'Users',
            ],
            [
                'title'   => 'TOTAL EARNINGS',
                'value'   => '₱0',
                'change'  => 'No earnings yet',
                'footer'  => 'Payments coming soon',
                'iconKey' => 'PhilippinePeso',
            ],
        ] : null;

        return Inertia::render('Dashboard', [

            // ── Core props ─────────────────────────────────────────────────
            'hasCourses'         => $hasCourses,
            'hasCourse'          => $hasCourse,           // NEW: any course created
            'hasPublishedCourse' => $hasPublishedCourse,  // NEW: published course exists
            'courseCount'        => $publishedCourseCount,
            'stats'              => $stats,

            // ── Verification props ─────────────────────────────────────────
            'verification_documents_count' => fn () => $user->verificationDocuments()->count(),
            'initialStep'             => fn () => $user->getCurrentVerificationStep(),
            'verificationSubmitted'   => $verificationSubmitted,
            'openVerification'        => $request->boolean('open_verification'),
            'currentVerificationStep' => $user->getCurrentVerificationStep(),

            // ── Chart / table data (lazy) ──────────────────────────────────
            'revenueTrends'  => Inertia::lazy(fn () => $this->getRevenueTrends()),
            'topCourses'     => Inertia::lazy(fn () => $this->getTopCourses($user)),
            'recentActivity' => Inertia::lazy(fn () => []),

            // ── Verification modal props (lazy) ────────────────────────────
            'educationLevels' => Inertia::lazy(fn () => EducationFields::getLevels()),
            'educationFields' => Inertia::lazy(fn () => EducationFields::getFields()),
            'companyNames'    => Inertia::lazy(fn () => CompanyNames::get()),
            'jobPositions'    => Inertia::lazy(fn () => JobPositions::get()),
            'licenses'        => Inertia::lazy(fn () => PhilippineLicenses::get()),
            'professions'     => Inertia::lazy(fn () => Professions::get()),
            'platforms'       => Inertia::lazy(fn () => Platform::select('id', 'name', 'icon_key', 'base_url')->get()),
        ]);
    }


    // ── Private helpers ────────────────────────────────────────────────────

    private function getRevenueTrends(): array
    {
        return [
            ['name' => 'Feb 1',  'revenue' => 0, 'enrollments' => 0],
            ['name' => 'Feb 5',  'revenue' => 0, 'enrollments' => 0],
            ['name' => 'Feb 10', 'revenue' => 0, 'enrollments' => 0],
            ['name' => 'Feb 15', 'revenue' => 0, 'enrollments' => 0],
            ['name' => 'Feb 20', 'revenue' => 0, 'enrollments' => 0],
            ['name' => 'Feb 25', 'revenue' => 0, 'enrollments' => 0],
        ];
    }

    private function getTopCourses($user): array
    {
        return $user->courses()
            ->orderByDesc('created_at')
            ->take(4)
            ->get()
            ->values()
            ->map(fn ($course, $i) => [
                'rank'      => '#' . ($i + 1),
                'title'     => $course->title,
                'category'  => $course->category?->name ?? $course->custom_category ?? 'General',
                'enrollees' => 0,
                'revenue'   => '₱0',
            ])
            ->toArray();
    }
}