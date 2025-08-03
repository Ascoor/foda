<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Election;
use Illuminate\Database\Seeder;

class ElectionSeeder extends Seeder
{
    public function run(): void
    {
        Election::create([
            'name' => 'الانتخابات العامة 2024',
            'start_date' => '2024-08-01',
            'end_date' => '2024-09-01',
        ]);
    }
}
