<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // These must exactly match the id values in PALETTES and TEMPLATES
        // in MentorCertificateContent.jsx
        $validPalettes = [
            'sunset', 'sapphire', 'jade', 'lavender', 'copper',
            'arctic', 'olive', 'plum', 'lagoon', 'scarlet',
            'indigo', 'mint', 'espresso', 'ruby', 'skyline',
            'violet', 'pine', 'coral', 'storm', 'honey',
        ];

        $validLayouts = ['classic', 'modern', 'minimal', 'elegant'];

        return [
            'design_layout' => ['required', 'string', 'in:' . implode(',', $validLayouts)],
            'color_palette' => ['required', 'string', 'in:' . implode(',', $validPalettes)],
            'course_ids'    => ['required', 'array', 'min:1'],
            'course_ids.*'  => ['integer', 'exists:courses,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'design_layout.required' => 'Please select a certificate template.',
            'design_layout.in'       => 'Invalid certificate template selected.',
            'color_palette.required' => 'Please select a color palette.',
            'color_palette.in'       => 'Invalid color palette selected.',
            'course_ids.required'    => 'Please select at least one course.',
            'course_ids.min'         => 'Please select at least one course to assign the certificate to.',
            'course_ids.*.exists'    => 'One or more selected courses do not exist.',
        ];
    }
}
