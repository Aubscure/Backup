<?php
// ════════════════════════════════════════════════════════════════════════════
// File: app/Models/Credential.php
// ════════════════════════════════════════════════════════════════════════════

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Credential extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'profession',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function educationalBackgrounds(): HasMany
    {
        return $this->hasMany(EducationalBackground::class);
    }

    public function employmentHistories(): HasMany
    {
        return $this->hasMany(EmploymentHistory::class);
    }

    public function licensesAndCertifications(): HasMany
    {
        return $this->hasMany(LicenseAndCertification::class);
    }

    public function userLinks(): HasMany
    {
        return $this->hasMany(UserLink::class);
    }
}
