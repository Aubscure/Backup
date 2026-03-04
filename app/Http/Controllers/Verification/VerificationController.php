<?php

namespace App\Http\Controllers\Verification;

use App\Http\Controllers\Controller;
use App\Http\Requests\Verification\CredentialRequest;
use App\Http\Requests\Verification\DocumentUploadRequest;
use App\Http\Requests\Verification\UserDetailRequest;
use App\Models\Platform;
use App\Services\Verification\VerificationService;
use App\Support\Enums\CompanyNames;
use App\Support\Enums\EducationFields;
use App\Support\Enums\JobPositions;
use App\Support\Enums\PhilippineLicenses;
use App\Support\Enums\Professions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationController extends Controller
{
    public function __construct(
        private readonly VerificationService $verification
    ) {}

    // ── Step 1: Personal Details ──────────────────────────────────────────────

    public function step1(Request $request): Response|RedirectResponse
    {
        if ($request->user()->is_verified) {
            return redirect()->route('dashboard');
        }

        // No extra props needed — personal fields come from auth.user
        return Inertia::render('Mentor/Verification/Step1');
    }

    public function storeStep1(UserDetailRequest $request): RedirectResponse
    {
        $this->verification->saveUserDetails(
            $request->user(),
            $request->toUserDetailData()
        );

        return redirect()->back()->with('success', 'Step 1 completed.');
    }

    // ── Step 2: Credentials ───────────────────────────────────────────────────

    public function step2(Request $request): Response|RedirectResponse
    {
        if ($request->user()->is_verified) {
            return redirect()->route('dashboard');
        }

        /**
         * All dropdown/enum data lives here — not in HandleInertiaRequests.
         * These only load when Step 2 is actually visited.
         * Platform is the only DB query; the enums are pure PHP arrays.
         */
        return Inertia::render('Mentor/Verification/Step2', [
            'educationLevels' => EducationFields::getLevels(),
            'educationFields' => EducationFields::getFields(),
            'companyNames'    => CompanyNames::get(),
            'jobPositions'    => JobPositions::get(),
            'licenses'        => PhilippineLicenses::get(),
            'professions'     => Professions::get(),
            'platforms'       => Platform::select('id', 'name', 'icon_key', 'base_url')->get(),
        ]);
    }

    public function storeStep2(CredentialRequest $request): RedirectResponse
    {
        $this->verification->saveCredentials(
            $request->user(),
            $request->validated()
        );

        return redirect()->back()->with('success', 'Step 2 completed.');
    }

    // ── Step 3: Documents ─────────────────────────────────────────────────────

    public function step3(Request $request): Response|RedirectResponse
    {
        if ($request->user()->is_verified) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Mentor/Verification/Step3');
    }

    public function storeStep3(DocumentUploadRequest $request): RedirectResponse
    {
        $this->verification->saveDocuments(
            $request->user(),
            $request->toUploadedFiles()
        );

        return redirect()
            ->route('dashboard')
            ->with('success', 'Documents submitted! Please allow up to 24 hours for review.');
    }
}
