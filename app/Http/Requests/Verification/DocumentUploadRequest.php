<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class DocumentUploadRequest extends FormRequest
{
    private const ALLOWED_MIMES = 'pdf,jpg,jpeg,png,webp';
    private const MAX_SIZE_KB   = 10240; // 10 MB

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'government_id'       => ['required', 'file', 'mimes:' . self::ALLOWED_MIMES, 'max:' . self::MAX_SIZE_KB],
            'degree_certificate'  => ['nullable', 'file', 'mimes:' . self::ALLOWED_MIMES, 'max:' . self::MAX_SIZE_KB],
            'proof_of_profession' => ['nullable', 'file', 'mimes:' . self::ALLOWED_MIMES, 'max:' . self::MAX_SIZE_KB],
            'acknowledgement'     => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'government_id.required'      => 'A valid government ID is required.',
            'government_id.mimes'         => 'Government ID must be a PDF, JPG, PNG, or WEBP file.',
            'government_id.max'           => 'Government ID must not exceed 10 MB.',
            'degree_certificate.mimes'    => 'Degree certificate must be a PDF, JPG, PNG, or WEBP file.',
            'degree_certificate.max'      => 'Degree certificate must not exceed 10 MB.',
            'proof_of_profession.mimes'   => 'Proof of profession must be a PDF, JPG, PNG, or WEBP file.',
            'proof_of_profession.max'     => 'Proof of profession must not exceed 10 MB.',
            'acknowledgement.required'    => 'You must acknowledge the terms before submitting.',
            'acknowledgement.accepted'    => 'You must accept the terms and conditions to proceed.',
        ];
    }

    /**
     * Returns only the file inputs for the service to process.
     */
    public function toUploadedFiles(): array
    {
        return $this->only([
            'government_id',
            'degree_certificate',
            'proof_of_profession',
        ]);
    }
}
