<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Handles individual enrollee profile views for the Mentor side.
 *
 * ── Current behaviour ────────────────────────────────────────────────────────
 * When the `users` table exists but has no enrollment-related relationships yet,
 * `show()` passes `userdata: null` and the React component falls back to
 * STATIC_ENROLLEES seed data (matched by route `{id}`).
 *
 * ── Future wiring (one step) ─────────────────────────────────────────────────
 * Once the `certificates`, `enrollments`, and `syllabuses` relationships are
 * defined on the User model, replace the `User::find($id)` call with:
 *
 *   $user = User::with([
 *       'certificates',
 *       'enrollments.course',
 *       'enrollments.course.syllabuses',
 *   ])->findOrFail($id);
 *
 * The React components already consume the exact same keys
 * (certificates, top_courses, course_performance) — no frontend changes needed,
 * just map your Eloquent relationships to those keys in the User model or a
 * dedicated API resource.
 *
 * ── Security note ────────────────────────────────────────────────────────────
 * The route is currently PUBLIC (no auth middleware) so mentors can share
 * direct links. Before going to production, consider adding:
 *   - `auth` middleware to the route, OR
 *   - policy / gate check: `$this->authorize('viewEnrolleeProfile', $user)`
 */
class EnrolleeController extends Controller
{
    public function show(int $id): InertiaResponse
    {
        // ── Phase 1: DB not yet ready ─────────────────────────────────────────
        // Returns null → React falls back to STATIC_ENROLLEES by id.
        // Remove the null-coalesce and add eager loads once the DB is wired.
        // $user = User::find($id);  // safe — returns null when not found

        return Inertia::render('Mentor/Enrollees/ShowEnrollee', [
            'userdata'   => null,
            'enrolleeId' => $id,   // ← always pass so React never needs to parse the URL
        ]);
    }
}
