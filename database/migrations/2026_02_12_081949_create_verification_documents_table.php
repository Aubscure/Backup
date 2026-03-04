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
        Schema::create('verification_documents', function (Blueprint $table) {
            $table->id();

            // Foreign Key to Users
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade'); // If user is deleted, delete their docs

            // The specific type of document uploaded
            // Values: 'government_id', 'degree_certificate', 'proof_of_profession'
            $table->string('document_type');

            // The secured file path (NOT a public URL)
            $table->string('file_path');

            // Status per document
            // Values: 'pending', 'approved', 'rejected'
            $table->string('status')->default('pending');

            // Optional: Reason if the admin rejects a specific document
            $table->string('remarks')->nullable();

            // The date the admin actually verifies/checks this specific doc
            $table->timestamp('date_verified')->nullable();

            $table->timestamps();

            // Composite unique index ensures a user doesn't upload
            // multiple 'pending' documents of the same type accidentally
            // (They must delete/replace the old one)
            // $table->unique(['user_id', 'document_type']);
            // Note: Uncomment above only if you want strictly one row per type.
            // usually keeping history is better, so I will leave it commented out for now.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verification_documents');
    }
};
