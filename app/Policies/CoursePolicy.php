<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function manage(User $user, Course $course): bool
    {
        return (int) $user->id === (int) $course->user_id;
    }

    public function create(User $user): bool
    {
        return (bool) $user->fresh()->is_verified;
    }

    /**
     * A course may only be published when ALL five conditions are met:
     *   1. Has title, description, and a category (basic info)
     *   2. Has at least one module with at least one lesson (curriculum)
     *   3. Every module has at least one media resource (content)
     *   4. Has a pricing plan configured (or is marked free)
     *   5. Has a certificate designed
     *
     * The course must already be loaded with:
     *   syllabuses.lessons.materials, syllabuses.lessons.videos, coursePlans, certificate
     */
    public function publish(User $user, Course $course): bool
    {
        if ((int) $user->id !== (int) $course->user_id) {
            return false;
        }

        // 1. Basic info
        $hasBasicInfo = ! empty($course->title)
            && ! empty($course->description)
            && ($course->category_id || $course->custom_category);

        if (! $hasBasicInfo) {
            return false;
        }

        // 2. Curriculum — at least one module with at least one lesson
        $syllabuses  = $course->relationLoaded('syllabuses') ? $course->syllabuses : $course->load('syllabuses.lessons')->syllabuses;
        $lessonCount = $syllabuses->sum(fn ($s) => $s->lessons->count());

        if ($syllabuses->isEmpty() || $lessonCount === 0) {
            return false;
        }

        // 3. Every module must have at least one media file or video
        foreach ($syllabuses as $syllabus) {
            $moduleHasMedia = false;

            foreach ($syllabus->lessons as $lesson) {
                $hasMaterials = $lesson->relationLoaded('materials') && $lesson->materials->isNotEmpty();
                $hasVideos    = $lesson->relationLoaded('videos')    && $lesson->videos->isNotEmpty();

                if ($hasMaterials || $hasVideos) {
                    $moduleHasMedia = true;
                    break;
                }
            }

            if (! $moduleHasMedia) {
                return false;
            }
        }

        // 4. Pricing
        $hasPlans   = $course->relationLoaded('coursePlans') ? $course->coursePlans->isNotEmpty() : $course->coursePlans()->exists();
        $hasPricing = $course->is_free || $hasPlans;

        if (! $hasPricing) {
            return false;
        }

        // 5. Certificate — the hard gate
        $hasCertificate = $course->relationLoaded('certificate')
            ? $course->certificate !== null
            : $course->certificate()->exists();

        return $hasCertificate;
    }
}