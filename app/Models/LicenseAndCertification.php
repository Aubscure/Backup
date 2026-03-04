<?php
// ════════════════════════════════════════════════════════════════════════════
// File: app/Models/LicenseAndCertification.php
// ════════════════════════════════════════════════════════════════════════════

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LicenseAndCertification extends Model
{
    use HasFactory;

    protected $fillable = [
        'credential_id',
        'type',
        'name',
        'credential_id_number',
    ];

    public function credential(): BelongsTo
    {
        return $this->belongsTo(Credential::class);
    }
}
