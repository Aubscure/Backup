<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonVideoCompletion extends Model
{
    protected $fillable = [
        'enrollment_id',
        'lesson_video_id',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(CourseEnrollment::class, 'enrollment_id');
    }

    public function lessonVideo(): BelongsTo
    {
        return $this->belongsTo(LessonVideo::class);
    }
}
