<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Support\Enums\Categories;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach (Categories::all() as $categoryName) {
            Category::firstOrCreate(['name' => $categoryName]);
        }
    }
}
