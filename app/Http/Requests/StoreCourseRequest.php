<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = $this->input('data', []);
        if (! empty($data)) {
            $this->merge($data);
        }

        // Build duration from duration_value + duration_unit when form sends those instead of duration
        if (empty($this->input('duration'))) {
            $val = $this->input('duration_value');
            $unit = $this->input('duration_unit', 'hours');
            if ($val !== null && $val !== '' && is_numeric($val) && (float) $val > 0) {
                $num = (float) $val;
                $this->merge(['duration' => ($unit === 'minutes' ? "{$num}m" : "{$num}h")]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => 'nullable|exists:categories,id',
            'custom_category' => 'nullable|required_without:category_id|string|max:60',
            'title' => 'required|string|max:60',
            'description' => 'required|string',
            'duration' => 'nullable|string|max:50',
            'duration_value' => 'nullable',
            'duration_unit' => 'nullable|string|in:hours,minutes',
            'course_thumbnail' => 'nullable|image|max:5120',
            'is_draft' => 'boolean',
            'redirect_to' => 'nullable|string|in:next,index',
        ];
    }
}
