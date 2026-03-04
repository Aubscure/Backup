<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnrolleeRecordPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount_paid' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount_paid.required' => 'Please enter the amount paid.',
            'amount_paid.numeric' => 'Amount must be a number.',
            'amount_paid.min' => 'Amount cannot be negative.',
        ];
    }
}
