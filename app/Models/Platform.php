<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon_key',
        'base_url',
    ];

    public function userLinks(): HasMany
    {
        return $this->hasMany(UserLink::class);
    }
}
