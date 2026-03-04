<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Allow null if user types a custom category
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');

            // Stores the custom text if category_id is null
            $table->string('custom_category')->nullable();

            $table->string('title');
            $table->text('description');
            $table->string('duration', 50)->nullable();
            $table->string('course_thumbnail_url')->nullable();
            $table->string('draft_status')->default('draft');
            $table->boolean('is_free')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
