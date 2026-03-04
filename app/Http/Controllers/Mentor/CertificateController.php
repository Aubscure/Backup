<?php
// app/Http/Controllers/CertificateController.php
namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCertificateRequest;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\VerificationDocument;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(  Request $request): Response
    {
        $mentor = Auth::user();


        $courses = Course::where('user_id', $mentor->id)
            ->where('draft_status', '!=', 'archived') // ✅ hide archived
            ->select('id', 'title', 'draft_status')
            ->orderBy('title')
            ->get();

        $certificates = Certificate::whereHas('course', function ($q) use ($mentor) {
            $q->where('user_id', $mentor->id)
            ->where('draft_status', '!=', 'archived'); // ✅ hide archived
        })
            ->with([
                'course:id,title,user_id,draft_status',
                'course.user:id,firstname,lastname',
            ])
            ->latest()
            ->get();

        return Inertia::render('Mentor/Certificates/Index', [
            'courses'        => $courses,
            'certificates'   => $certificates,
            'mentorName'     => $mentor->name,
            'mentorVerified' => (bool) $mentor->is_verified,
            'verification_documents_count' => fn () => $request->user()->verificationDocuments()->count(),


        ]);
    }

    public function store(StoreCertificateRequest $request): RedirectResponse
    {
        if (! Auth::user()->is_verified) {
            abort(403, 'Your account must be verified before you can assign certificates.');
        }

        $validated = $request->validated();

        $ownedIds = Course::where('user_id', Auth::id())
            ->whereIn('id', $validated['course_ids'])
            ->pluck('id')
            ->toArray();

        if (count($ownedIds) !== count($validated['course_ids'])) {
            abort(403, 'You can only assign certificates to your own courses.');
        }

        foreach ($validated['course_ids'] as $courseId) {
            Certificate::updateOrCreate(
                ['course_id' => $courseId],
                [
                    'design_layout' => $validated['design_layout'],
                    'color_palette' => $validated['color_palette'],
                    'date_issued'   => now()->toDateString(),
                ]
            );
        }

        return redirect()
            ->route('certificates.index')
            ->with('success', 'Certificate design saved and assigned to the selected course(s).');
    }

    public function destroy(Certificate $certificate): RedirectResponse
    {
        $certificate->load('course');
        if ((int) $certificate->course?->user_id !== (int) Auth::id()) {
            abort(403);
        }

        $certificate->delete();

        return redirect()
            ->route('certificates.index')
            ->with('success', 'Certificate removed.');
    }
}
