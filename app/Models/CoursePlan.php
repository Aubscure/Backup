<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CoursePlan extends Model
{
    protected $fillable = [
        'course_id',
        'type',
        'name',
        'price',
        'duration',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}


