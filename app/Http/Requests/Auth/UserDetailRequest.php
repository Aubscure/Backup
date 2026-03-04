<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserDetailRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow strictly authenticated users
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'middlename'   => ['nullable', 'string', 'max:255'],
            'suffix'       => ['nullable', 'string', 'max:20'],
            'birthdate'    => ['required', 'date', 'before:today'],
            'gender'       => ['required', 'string', Rule::in(['male', 'female', 'non-binary'])],
            'phone_number' => ['required', 'string', 'max:20'], // You might want regex here for PH numbers
            'address'      => ['required', 'string', 'max:500'],
        ];
    }
}
