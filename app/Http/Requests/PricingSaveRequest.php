<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PricingSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_free' => ['nullable', 'boolean'],
            'individual_free' => ['nullable', 'boolean'],
            'individual_price' => ['nullable', 'numeric', 'min:0'],
            'individual_on_sale' => ['nullable', 'boolean'],
            'individual_access_type' => ['required', 'string', 'in:lifetime,limited'],
            'individual_duration_amount' => ['nullable', 'required_if:individual_access_type,limited', 'numeric', 'min:1'],
            'individual_duration_unit' => ['nullable', 'required_if:individual_access_type,limited', 'string', 'in:days,weeks,months,years'],
            'organization_free' => ['nullable', 'boolean'],
            'organization_price' => ['nullable', 'numeric', 'min:0'],
            'organization_bulk_buying' => ['nullable', 'boolean'],
            'organization_access_type' => ['required', 'string', 'in:lifetime,limited'],
            'organization_duration_amount' => ['nullable', 'required_if:organization_access_type,limited', 'numeric', 'min:1'],
            'organization_duration_unit' => ['nullable', 'required_if:organization_access_type,limited', 'string', 'in:days,weeks,months,years'],
            'is_draft' => ['nullable', 'boolean'],
            'next_step' => ['nullable', 'boolean'],
        ];
    }
}


