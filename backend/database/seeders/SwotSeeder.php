<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Campaign;
use App\Models\Swot;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;

class SwotSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->first() ?? User::factory()->create();
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();
        $area = Area::query()->first() ?? Area::factory()->create();
        $team = Team::query()->first() ?? Team::factory()->create([
            'campaign_id' => $campaign->id,
            'area_id' => $area->id,
        ]);
        $volunteer = Volunteer::query()->first() ?? Volunteer::factory()->create([
            'campaign_id' => $campaign->id,
            'team_id' => $team->id,
        ]);

        Swot::factory()->create([
            'campaign_id' => $campaign->id,
            'entity_type' => 'area',
            'entity_id' => $area->id,
            'strengths' => 'Strong community engagement',
            'weaknesses' => 'Limited funding',
            'opportunities' => 'Government grants',
            'threats' => 'Political instability',
            'created_by' => $user->id,
        ]);

        Swot::factory()->create([
            'campaign_id' => $campaign->id,
            'entity_type' => 'team',
            'entity_id' => $team->id,
            'strengths' => 'فريق ذو خبرة',
            'weaknesses' => 'نقص الموارد',
            'opportunities' => 'فرص تدريب خارجية',
            'threats' => 'تنافس شديد',
            'created_by' => $user->id,
        ]);

        Swot::factory()->create([
            'campaign_id' => $campaign->id,
            'entity_type' => 'volunteer',
            'entity_id' => $volunteer->id,
            'strengths' => 'Motivated and dedicated',
            'weaknesses' => 'Limited experience',
            'opportunities' => 'Workshops and mentoring',
            'threats' => 'Risk of burnout',
            'created_by' => $user->id,
        ]);
    }
}
