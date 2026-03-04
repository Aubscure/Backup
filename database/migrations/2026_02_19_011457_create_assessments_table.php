<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->morphs('assessmentable');
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('description')->nullable();
            $table->boolean('is_draft')->default(true);
            $table->unsignedInteger('passing_grade')->default(70);
            $table->boolean('has_time_limit')->default(false);
            $table->unsignedInteger('time_limit_hrs')->default(0);
            $table->unsignedInteger('time_limit_mins')->default(0);
            $table->unsignedInteger('time_limit_secs')->default(0);
            $table->boolean('is_randomized')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
