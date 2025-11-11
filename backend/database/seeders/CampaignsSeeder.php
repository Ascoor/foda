<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Campaign;

class CampaignsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['name'=>'حملة القاهرة الكبرى','slug'=>'cairo-campaign','spatial_level'=>'city','status'=>'active','poll_date'=>now()->addDays(30)],
            ['name'=>'حملة الإسكندرية','slug'=>'alex-campaign','spatial_level'=>'city','status'=>'active','poll_date'=>now()->addDays(45)],
        ];

        foreach ($data as $row) {
            Campaign::firstOrCreate(['slug'=>$row['slug']], $row);
        }
    }
}
