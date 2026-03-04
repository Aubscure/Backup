<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class UserDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'middlename'   => ['nullable', 'string', 'max:100'],
            'suffix'       => ['nullable', 'string', 'in:None,Jr.,Sr.,III'],
            'birthdate'    => ['required', 'date', 'before:today'],
            'gender'       => ['required', 'in:male,female'],
            'phone_number' => ['required', 'string', 'max:20'],
            'address'      => ['required', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'birthdate.required' => 'Date of birth is required.',
            'birthdate.before'   => 'Date of birth must be in the past.',
            'gender.required'    => 'Please select a gender.',
            'gender.in'          => 'Gender must be male or female.',
            'phone_number.required' => 'Phone number is required.',
            'address.required'   => 'Current address is required.',
        ];
    }

    /**
     * Returns only the user_details fillable fields,
     * deliberately excluding firstname/lastname which live on the users table.
     */
    public function toUserDetailData(): array
    {
        return $this->only([
            'middlename',
            'suffix',
            'birthdate',
            'gender',
            'phone_number',
            'address',
        ]);
    }
}
