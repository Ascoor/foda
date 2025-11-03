<?php

namespace Database\Seeders;

use App\Models\Election;
use Illuminate\Database\Seeder;

class ElectionSeeder extends Seeder
{
    public function run(): void
    {
        Election::query()->updateOrCreate(
            ['name' => 'الانتخابات العامة 2025'],
            [
                'start_date' => '2025-01-15',
                'end_date' => '2025-06-15',
            ]
        );
    }
}
