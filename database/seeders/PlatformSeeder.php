<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Platform;
use App\Support\Enums\Platforms as PlatformEnum; // Alias the Enum

class PlatformSeeder extends Seeder
{
    public function run(): void
    {
        // Get the master list from your Enum file
        $platforms = PlatformEnum::getList();

        foreach ($platforms as $platform) {
            Platform::updateOrCreate(
                ['name' => $platform['name']], // Check if exists by name
                [
                    'icon_key' => $platform['icon_key'],
                    'base_url' => $platform['base_url'],
                ]
            );
        }
    }
}
