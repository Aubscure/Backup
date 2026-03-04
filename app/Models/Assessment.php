<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Assessment extends Model
{
    protected $fillable = [
        'title',
        'description',
        'course_id',
        'assessmentable_id',
        'assessmentable_type',
        'is_draft',
        'passing_grade',
        'has_time_limit',
        'time_limit_hrs',
        'time_limit_mins',
        'time_limit_secs',
        'is_randomized',
    ];

    public function assessmentable(): MorphTo
    {
        return $this->morphTo();
    }

    // public function assessmentQuestions(): HasMany
    // {
    //     return $this->hasMany(AssessmentQuestion::class);
    // }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'assessment_questions')
            ->withPivot('points', 'pivot_order');
            // ->orderBy('pivot_order');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
