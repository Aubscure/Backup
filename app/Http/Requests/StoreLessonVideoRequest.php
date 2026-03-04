<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonVideoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
        // Later: replace with policy check (lesson ownership)
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            // Actual video file uploaded to Vimeo
            'video' => [
                'required',
                'file',
                'mimetypes:video/mp4,video/*',  // ✅ wildcard matches all video types
                'max:512000', // 500MB (Vimeo-friendly for dev)
            ],

            // Optional metadata
            'duration' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Optional: customize validation messages
     */
    public function messages(): array
    {
        return [
            'lesson_id.exists' => 'The selected lesson does not exist.',
            'video.mimetypes' => 'The uploaded file must be a valid video format.',
        ];
    }
}