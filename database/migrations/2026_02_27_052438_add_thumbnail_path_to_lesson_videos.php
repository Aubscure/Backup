// database/migrations/xxxx_add_thumbnail_path_to_lesson_videos.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('lesson_videos', function (Blueprint $table) {
            // Keep thumbnail_url for Vimeo CDN fallback, add local path
            $table->string('thumbnail_path')->nullable()->after('thumbnail_url');
        });
    }

    public function down(): void
    {
        Schema::table('lesson_videos', function (Blueprint $table) {
            $table->dropColumn('thumbnail_path');
        });
    }
};
