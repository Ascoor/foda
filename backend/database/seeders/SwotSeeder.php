<?php

namespace Database\Seeders;

use App\Models\Swot;
use App\Models\User;
use Illuminate\Database\Seeder;

class SwotSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        Swot::create([
            'entity_type' => 'area',
            'entity_id' => 1,
            'strengths' => 'Strong community engagement',
            'weaknesses' => 'Limited funding',
            'opportunities' => 'Government grants',
            'threats' => 'Political instability',
            'created_by' => $user->id,
        ]);

        Swot::create([
            'entity_type' => 'team',
            'entity_id' => 1,
            'strengths' => 'فريق ذو خبرة',
            'weaknesses' => 'نقص الموارد',
            'opportunities' => 'فرص تدريب خارجية',
            'threats' => 'تنافس شديد',
            'created_by' => $user->id,
        ]);

        Swot::create([
            'entity_type' => 'volunteer',
            'entity_id' => 1,
            'strengths' => 'Motivated and dedicated',
            'weaknesses' => 'Limited experience',
            'opportunities' => 'Workshops and mentoring',
            'threats' => 'Risk of burnout',
            'created_by' => $user->id,
        ]);
    }
}
