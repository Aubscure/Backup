<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class DocumentUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Files: Max 5MB, allowed: jpg, png, pdf
            'government_id'       => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'degree_certificate'  => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'proof_of_profession' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],

            // The Checkbox
            'acknowledgement'     => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'government_id.required'   => 'A valid government ID is required.',
            'acknowledgement.accepted' => 'You must acknowledge the terms and certify the information is correct.',
        ];
    }
}
