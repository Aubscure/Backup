<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationalBackground extends Model
{
    use HasFactory;

    protected $fillable = [
        'credential_id',
        'level',
        'field_of_study',
        // Add 'school_name', 'start_date', 'end_date' if you added them to schema
    ];

    public function credential()
    {
        return $this->belongsTo(Credential::class);
    }
}
