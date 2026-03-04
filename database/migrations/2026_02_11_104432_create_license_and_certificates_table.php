<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
// database/migrations/xxxx_xx_xx_create_licenses_and_certifications_table.php

    public function up(): void
    {
        Schema::create('license_and_certifications', function (Blueprint $table) {
            $table->id();

            // Link to the parent Credentials table
            $table->foreignId('credential_id')->constrained()->onDelete('cascade');

            // 1. THE DISCRIMINATOR: This allows "Certificate OR License" logic
            // The frontend can send 'license' or 'certification' based on which button they clicked
            $table->enum('type', ['license', 'certification']);

            // 2. SHARED DETAILS
            $table->string('name');           // e.g., "Civil Service Professional", "AWS Certified"

            // Nullable because some certificates don't have ID numbers
            $table->string('credential_id_number')->nullable();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('license_and_certificates');
    }
};
