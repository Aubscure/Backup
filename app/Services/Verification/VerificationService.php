<?php

namespace App\Services\Verification;

use App\Models\Credential;
use App\Models\Platform;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\VerificationDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class VerificationService
{
    private const STORAGE_DISK    = 'local';
    private const STORAGE_FOLDER  = 'verification_documents';
    private const DOCUMENT_TYPES  = ['government_id', 'degree_certificate', 'proof_of_profession'];

    // ── Step 1: Personal Details ──────────────────────────────────────────────

    public function saveUserDetails(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            UserDetail::updateOrCreate(['user_id' => $user->id], $data);
            $user->setVerificationStep(2);
        });
    }

    // ── Step 2: Credentials ───────────────────────────────────────────────────

    public function saveCredentials(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $credential = Credential::updateOrCreate(
                ['user_id' => $user->id],
                ['profession' => $data['profession']]
            );

            $this->syncEducations($credential, $data['educations'] ?? []);
            $this->syncEmployments($credential, $data['employments'] ?? []);
            $this->syncLicenses($credential, $data['licenses_and_certifications'] ?? []);
            $this->syncUserLinks($credential, $data['user_links'] ?? []);

            $user->setVerificationStep(3);
        });
    }

    // ── Step 3: Documents ─────────────────────────────────────────────────────

    public function saveDocuments(User $user, array $files): void
    {
        DB::transaction(function () use ($user, $files): void {
            foreach (self::DOCUMENT_TYPES as $type) {
                if (isset($files[$type]) && $files[$type] instanceof UploadedFile) {
                    VerificationDocument::create([
                        'user_id'       => $user->id,
                        'document_type' => $type,
                        'file_path'     => $files[$type]->store(self::STORAGE_FOLDER, self::STORAGE_DISK),
                        'status'        => 'pending',
                    ]);
                }
            }
        });
    }

    // ── Private sync helpers ──────────────────────────────────────────────────

    private function syncEducations(Credential $credential, array $items): void
    {
        $records = collect($items)
            ->reject(fn (array $e) => empty($e['level']) && empty($e['field_of_study']))
            ->map(fn (array $e) => [
                'level'          => $e['level'],
                'field_of_study' => $e['field_of_study'],
            ])
            ->all();

        if (empty($records)) {
            return;
        }

        $credential->educationalBackgrounds()->delete();
        $credential->educationalBackgrounds()->createMany($records);
    }

    private function syncEmployments(Credential $credential, array $items): void
    {
        $records = collect($items)
            ->reject(fn (array $e) => empty($e['company_name']))
            ->map(fn (array $e) => [
                'company_name'    => $e['company_name'],
                'position'        => $e['position']        ?? null,
            ])
            ->all();

        if (empty($records)) {
            return;
        }

        $credential->employmentHistories()->delete();
        $credential->employmentHistories()->createMany($records);
    }

    private function syncLicenses(Credential $credential, array $items): void
    {
        $records = collect($items)
            ->reject(fn (array $l) => empty($l['name']))
            ->map(fn (array $l) => [
                'type'                 => $l['type'],
                'name'                 => $l['name'],
                'credential_id_number' => $l['credential_id_number'] ?? null,
            ])
            ->all();

        if (empty($records)) {
            return;
        }

        $credential->licensesAndCertifications()->delete();
        $credential->licensesAndCertifications()->createMany($records);
    }

    private function syncUserLinks(Credential $credential, array $items): void
    {
        $platforms = Platform::all();

        $records = collect($items)
            ->reject(fn (array $l) => empty($l['url']))
            ->map(fn (array $l) => [
                'platform_id' => $this->resolvePlatformId($l['url'], $platforms),
                'url'         => $l['url'],
            ])
            ->reject(fn (array $r) => $r['platform_id'] === null)
            ->all();

        if (empty($records)) {
            return;
        }

        $credential->userLinks()->delete();
        $credential->userLinks()->createMany($records);
    }

    private function resolvePlatformId(string $url, Collection $platforms): ?int
    {
        foreach ($platforms as $platform) {
            if (empty($platform->base_url)) {
                continue;
            }

            $cleanBase = rtrim(preg_replace('#^https?://#', '', $platform->base_url), '/');

            if (str_contains(strtolower($url), strtolower($cleanBase))) {
                return $platform->id;
            }
        }

        return $platforms->firstWhere('name', 'Portfolio / Website')?->id
            ?? $platforms->first()?->id;
    }
}
