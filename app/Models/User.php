<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'firstname',
        'lastname',
        'username',
        'email',
        'password',
        'verification_step',
    ];

    public function courseEnrollments(): HasMany
    {
        return $this->hasMany(CourseEnrollment::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['name'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_verified'       => 'boolean',
        ];
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function otps(): HasMany
    {
        return $this->hasMany(Otp::class);
    }

    public function userDetail(): HasOne
    {
        return $this->hasOne(UserDetail::class);
    }

    public function credential(): HasOne
    {
        return $this->hasOne(Credential::class);
    }

    public function verificationDocuments(): HasMany
    {
        return $this->hasMany(VerificationDocument::class);
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    public function getNameAttribute(): string
    {
        return trim("{$this->firstname} {$this->lastname}");
    }

    public function getVerificationStatusAttribute(): string
    {
        if ($this->is_verified) {
            return 'verified';
        }

        $documents = $this->verificationDocuments;

        if ($documents->isEmpty()) {
            return 'unverified';
        }

        if ($documents->contains('status', 'rejected')) {
            return 'rejected';
        }

        return 'pending';
    }

    // ── Verification step helpers ─────────────────────────────────────────────

    /**
     * Returns the step the user should currently be on (1, 2, 3),
     * or null if verification is already complete.
     */
    public function getCurrentVerificationStep(): ?int
    {
        if ($this->is_verified) {
            return null;
        }

        // Explicit step set during the flow takes priority
        if ($this->verification_step) {
            return $this->verification_step;
        }

        // Fallback: derive step from existing data (handles legacy records)
        if (! $this->userDetail) {
            return 1;
        }

        if (! $this->credential) {
            return 2;
        }

        $hasDocuments = $this->verificationDocuments()
            ->whereIn('status', ['pending', 'verified'])
            ->exists();

        return $hasDocuments ? null : 3;
    }

    /**
     * Advances (or sets) the user's verification step.
     */
    public function setVerificationStep(int $step): void
    {
        $this->update(['verification_step' => $step]);
    }

        public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

}
