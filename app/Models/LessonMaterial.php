<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonMaterial extends Model
{
    protected $fillable = [
        'lesson_id',
        'type',
        'title',
        'file_path',
        'original_name',
        'mime_type',
        'size_bytes',
        'duration_seconds',
    ];

    protected $appends = [
        'url',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function getUrlAttribute(): ?string
    {
        if (!$this->file_path) return null;
        return \Illuminate\Support\Facades\Storage::url($this->file_path);
    }
}


