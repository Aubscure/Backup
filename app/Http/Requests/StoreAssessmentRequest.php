<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssessmentRequest extends FormRequest
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
            'title' => 'required|string|max:225',
            'description' => 'nullable|string|max:999',
            'course_id' => 'required|exists:courses,id',
            'assessmentable_id' => 'required|integer',
            'assessmentable_type' => 'required|string|in:syllabus,lesson',
            'is_draft' => 'boolean',
            'passing_grade' => 'required|integer|min:0|max:100',
            'has_time_limit' => 'boolean',
            'time_limit_hrs' => 'required_if:has_time_limit,true|integer|min:0|max:23',
            'time_limit_mins' => 'required_if:has_time_limit,true|integer|min:0|max:59',
            'time_limit_secs' => 'required_if:has_time_limit,true|integer|min:0|max:59',
            'is_randomized' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|string|in:multiple choice,true or false,sequence',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.order' => 'required|integer',
            'questions.*.data.question_text' => 'required|string|max:2000',
            'questions.*.data.answer' => 'required_unless:questions.*.type,sequence',
            'questions.*.data.options' => 'required_if:questions.*.type,multiple choice|array|min:2',
            'questions.*.data.options.*' => 'required|string|min:1|max:500',
            'questions.*.data.items' => 'required_if:questions.*.type,sequence|array|min:1',
        ];
    }
}
