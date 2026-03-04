<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    protected $fillable = ['question_text', 'type', 'options', 'answer'];

    protected $casts = [
        'options' => 'array',
        'answer' => 'array',
    ];

    // public function assessmentQuestions(): HasMany
    // {
    //     return $this->hasMany(AssessmentQuestion::class);
    // }

    public function assessments()
    {
        return $this->belongsToMany(Assessment::class, 'assessment_questions')
            ->withPivot('points', 'pivot_order')
            ->withTimestamps();
    }
}
