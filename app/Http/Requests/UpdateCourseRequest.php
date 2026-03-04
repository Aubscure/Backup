<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id'    => 'nullable|exists:categories,id',
            'custom_category'=> 'nullable|string|max:60',
            'title'          => 'nullable|string|max:60',
            'description'    => 'nullable|string',
            'course_thumbnail'=> 'nullable|image|max:5120',
            'duration'       => 'nullable|string|max:50',
            'save_as_draft'   => 'nullable|boolean',
        ];
    }
}
