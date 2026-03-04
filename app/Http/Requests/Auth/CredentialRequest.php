<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CredentialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Logic is handled by middleware in the controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'profession' => ['required', 'string', 'max:255'],

            // Educations — level and field_of_study accept both enum suggestions and freeform input
            'educations'                   => ['nullable', 'array'],
            'educations.*.level'           => ['sometimes', 'required', 'string', 'max:255'],
            'educations.*.field_of_study'  => ['sometimes', 'required', 'string', 'max:255'],

            // Employments
            'employments'                  => ['nullable', 'array'],
            'employments.*.company_name'   => ['sometimes', 'required', 'string', 'max:255'],
            'employments.*.position'       => ['sometimes', 'required', 'string', 'max:255'],
            'employments.*.start_date'     => ['nullable', 'date'],
            'employments.*.end_date'       => [
                'nullable',
                'date',
                'after_or_equal:employments.*.start_date',
            ],
            'employments.*.is_current_role' => ['boolean'],

            // Licenses — name accepts both enum suggestions and freeform input
            'licenses_and_certifications'             => ['nullable', 'array'],
            'licenses_and_certifications.*.type'      => [
                'sometimes',
                'required',
                'string',
                Rule::in(['license', 'certification']),
            ],
            'licenses_and_certifications.*.name'               => ['sometimes', 'required', 'string', 'max:255'],
            'licenses_and_certifications.*.credential_id_number' => ['nullable', 'string', 'max:100'],

            // User Links
            'user_links'              => ['nullable', 'array'],
            'user_links.*.platform_id' => ['nullable', 'integer', 'exists:platforms,id'],
            'user_links.*.url'         => ['sometimes', 'required', 'url', 'max:255'],
        ];
    }

    /**
     * Custom error messages for specific fields.
     */
    public function messages(): array
    {
        return [
            'employments.*.end_date.after_or_equal' => 'The end date must be after the start date.',
            'user_links.*.platform_id.exists'        => 'The selected platform is not supported.',
            'user_links.*.url.url'                   => 'Please enter a valid URL (e.g., https://linkedin.com/in/you).',
        ];
    }

    /**
     * Custom attribute names for cleaner error messages.
     */
    public function attributes(): array
    {
        return [
            'educations.*.level'                     => 'education level',
            'educations.*.field_of_study'            => 'field of study',
            'employments.*.company_name'             => 'company name',
            'employments.*.position'                 => 'position',
            'licenses_and_certifications.*.name'     => 'license/certificate name',
            'user_links.*.url'                       => 'profile URL',
        ];
    }

    /**
     * Normalize URLs before validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('user_links')) {
            $links = $this->input('user_links');

            foreach ($links as $key => $link) {
                if (
                    isset($link['url']) &&
                    !empty($link['url']) &&
                    !preg_match("~^(?:f|ht)tps?://~i", $link['url'])
                ) {
                    $links[$key]['url'] = 'https://' . $link['url'];
                }
            }

            $this->merge(['user_links' => $links]);
        }
    }
}
