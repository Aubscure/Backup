<?php

namespace App\Http\Controllers\Mentor\Courses;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonVideo;
use App\Services\VimeoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseLessonVideoController extends Controller
{
    /**
     * Step 1: Get a Vimeo TUS upload ticket.
     */
    public function getUploadTicket(Request $request, VimeoService $vimeo): JsonResponse
    {
        $request->validate([
            'file_size' => 'required|integer|min:1',
            'title'     => 'nullable|string|max:255',
        ]);

        $ticket = $vimeo->createUploadTicket(
            $request->input('file_size'),
            $request->input('title', 'Lesson Video')
        );

        return response()->json($ticket);
    }

    /**
     * Step 2: Save the video record after TUS upload completes.
     * Accepts an optional client-extracted thumbnail (JPEG blob).
     */
    public function store(
        Request $request,
        Course  $course,
        Lesson  $lesson,
        VimeoService $vimeo
    ): RedirectResponse {
        $request->validate([
            'vimeo_id'  => 'required|string',
            'duration'  => 'nullable|integer|min:0',
            'thumbnail' => 'nullable|file|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        $vimeoId       = $request->input('vimeo_id');
        $thumbnailPath = null;
        $thumbnailUrl  = null;

        // --- Store the client-extracted thumbnail (preferred) ---
        if ($request->hasFile('thumbnail') && $request->file('thumbnail')->isValid()) {
            $filename      = 'video-thumbs/' . Str::uuid() . '.jpg';
            $thumbnailPath = $request->file('thumbnail')
                ->storeAs('video-thumbs', Str::uuid() . '.jpg', 'public');
        }

        // --- Vimeo CDN URL as fallback (best-effort, may be null if still processing) ---
        if (! $thumbnailPath) {
            $thumbnailUrl = $vimeo->getVideoThumbnail($vimeoId);
        }

        LessonVideo::create([
            'lesson_id'      => $lesson->id,
            'vimeo_id'       => $vimeoId,
            'duration'       => $request->input('duration'),
            'thumbnail_path' => $thumbnailPath,
            'thumbnail_url'  => $thumbnailUrl,
        ]);

        return back()->with('success', 'Lesson video saved successfully.');
    }

    public function destroy(LessonVideo $lessonVideo): RedirectResponse
    {
        // Clean up local thumbnail on deletion
        if ($lessonVideo->thumbnail_path) {
            Storage::disk('public')->delete($lessonVideo->thumbnail_path);
        }

        $lessonVideo->delete();

        return back()->with('success', 'Lesson video removed.');
    }


}
