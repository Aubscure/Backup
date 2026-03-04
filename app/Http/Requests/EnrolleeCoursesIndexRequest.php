<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnrolleeCoursesIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'category' => 'nullable|exists:categories,id',
            'type' => 'nullable|string|in:all,role-based,career-growth,skill-gap,in-demand,manager-recommended,day-to-day',
            'sort' => 'nullable|string|in:newest,oldest,title_asc,title_desc',
        ];
    }

    public function prepareForValidation(): void
    {
        // Set default sort if not provided
        if (!$this->has('sort')) {
            $this->merge(['sort' => 'newest']);
        }
    }
}

