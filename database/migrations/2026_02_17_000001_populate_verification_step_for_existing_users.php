<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
    {
        // Set verification_step for existing users based on their progress
        DB::statement('
            UPDATE users SET verification_step = CASE
                WHEN is_verified = true THEN NULL
                WHEN EXISTS (SELECT 1 FROM verification_documents WHERE user_id = users.id AND status IN ("pending", "verified"))
                    THEN 3
                WHEN EXISTS (SELECT 1 FROM credentials WHERE user_id = users.id)
                    THEN 3
                WHEN EXISTS (SELECT 1 FROM user_details WHERE user_id = users.id)
                    THEN 2
                ELSE 1
            END
            WHERE verification_step IS NULL AND is_verified = false
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set all users back to NULL
        DB::table('users')
            ->where('is_verified', false)
            ->update(['verification_step' => null]);
    }
};
