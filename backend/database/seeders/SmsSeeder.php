<?php

namespace Database\Seeders;

use App\Models\Sms;
use Illuminate\Database\Seeder;

class SmsSeeder extends Seeder
{
    public function run(): void
    {
        Sms::create();
    }
}
