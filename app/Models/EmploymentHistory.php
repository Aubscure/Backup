<?php
// ════════════════════════════════════════════════════════════════════════════
// File: app/Models/EmploymentHistory.php
// ════════════════════════════════════════════════════════════════════════════

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmploymentHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'credential_id',
        'company_name',
        'position',
        'start_date',
        'end_date',
        'is_current_role',
    ];

    protected function casts(): array
    {
        return [
            'is_current_role' => 'boolean',
            'start_date'      => 'date',
            'end_date'        => 'date',
        ];
    }

    public function credential(): BelongsTo
    {
        return $this->belongsTo(Credential::class);
    }
}
