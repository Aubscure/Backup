<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Course extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'custom_category',
        'title',
        'description',
        'duration',
        'course_thumbnail_url',
        'draft_status',
        'is_free',
    ];

    protected $casts = [
        'is_free' => 'boolean',
    ];

    // Accessor to get the display name easily
    public function getCategoryNameAttribute()
    {
        return $this->category ? $this->category->name : $this->custom_category;
    }

    // --- FIX: Add this method ---
    // This allows $course->load('user') to work in your Controller
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    // ----------------------------

    // You can keep this alias if you use $course->mentor elsewhere in your app
    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function syllabuses(): HasMany
    {
        return $this->hasMany(Syllabus::class);
    }

    public function coursePlans(): HasMany
    {
        return $this->hasMany(CoursePlan::class)->orderBy('id');
    }

    public function certificate(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Certificate::class);
    }

    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(Lesson::class, Syllabus::class);
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }


}
