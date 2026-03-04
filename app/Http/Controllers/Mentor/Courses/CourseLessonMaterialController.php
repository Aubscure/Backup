<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonMaterialRequest;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonMaterial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class CourseLessonMaterialController extends Controller
{
    // ── POST /courses/{course}/lessons/{lesson}/materials ─────────────────────

    public function store(
        StoreLessonMaterialRequest $request,
        Course $course,
        Lesson $lesson
    ): RedirectResponse {
        $this->authorize('manage', $course);

        // Ensure the lesson actually belongs to this course
        abort_if(
            (int) $lesson->syllabus->course_id !== (int) $course->id,
            403
        );

        $file = $request->file('file');

        LessonMaterial::create([
            'lesson_id'        => $lesson->id,
            'type'             => 'file',
            'title'            => $request->input('title'),
            'file_path'        => $file->store('lesson_materials', 'public'),
            'original_name'    => $file->getClientOriginalName(),
            'mime_type'        => $file->getMimeType(),
            'size_bytes'       => $file->getSize(),
            'duration_seconds' => $request->input('duration_seconds') ?: null,
        ]);

        return back()->with('success', 'Material uploaded successfully.');
    }

    // ── DELETE /courses/{course}/materials/{material} ─────────────────────────

    public function destroy(Course $course, LessonMaterial $material): RedirectResponse
    {
        $this->authorize('manage', $course);

        // Ensure the material belongs to a lesson inside this course
        $material->load('lesson.syllabus');
        abort_if(
            (int) $material->lesson->syllabus->course_id !== (int) $course->id,
            403
        );

        Storage::disk('public')->delete($material->file_path);
        $material->delete();

        return back()->with('success', 'Material removed.');
    }
}
