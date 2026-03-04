<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class LessonVideo extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'lesson_id',
        'vimeo_id',
        'duration',
        'thumbnail_url',
        'thumbnail_path',
    ];

    protected $appends = ['resolved_thumbnail_url'];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function getResolvedThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail_path) {
            return Storage::disk('public')->url($this->thumbnail_path);
        }

        return $this->thumbnail_url ?: null;
    }
}
