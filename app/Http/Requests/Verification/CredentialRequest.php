<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class CredentialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'profession' => ['required', 'string', 'max:150'],

            // Education
            'educations'                  => ['nullable', 'array'],
            'educations.*.level'          => ['nullable', 'string', 'max:100'],
            'educations.*.field_of_study' => ['nullable', 'string', 'max:150'],

            // Employment
            'employments'                  => ['nullable', 'array'],
            'employments.*.company_name'   => ['nullable', 'string', 'max:150'],
            'employments.*.position'       => ['nullable', 'string', 'max:150'],
            'employments.*.start_date'     => ['nullable', 'date'],
            'employments.*.end_date'       => ['nullable', 'date', 'after_or_equal:employments.*.start_date'],
            'employments.*.is_current_role' => ['nullable', 'boolean'],

            // Licenses & Certifications
            'licenses_and_certifications'                        => ['nullable', 'array'],
            'licenses_and_certifications.*.type'                 => ['nullable', 'in:license,certification'],
            'licenses_and_certifications.*.name'                 => ['nullable', 'string', 'max:200'],
            'licenses_and_certifications.*.credential_id_number' => ['nullable', 'string', 'max:100'],

            // User Links
            'user_links'       => ['nullable', 'array'],
            'user_links.*.url' => ['nullable', 'url', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'profession.required'                      => 'Please select or enter your profession.',
            'user_links.*.url.url'                     => 'Each link must be a valid URL (e.g. https://linkedin.com/in/...).',
            'employments.*.end_date.after_or_equal'    => 'End date must be on or after the start date.',
        ];
    }
}
