<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_aggregated_metrics(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $area = Area::factory()->create(['name' => 'Cairo']);
        $team = Team::factory()->create(['area_id' => $area->id]);
        Volunteer::factory()->count(5)->create(['team_id' => $team->id]);

        Activity::factory()->count(2)->create([
            'area_id' => $area->id,
            'support_score' => 80,
            'reported_at' => Carbon::now(),
            'type' => 'support',
        ]);

        $response = $this->getJson('/api/v1/analytics');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'regions',
                    'support_trends',
                    'report_distribution',
                    'summary' => [
                        'support_percentage',
                        'turnout_estimate',
                        'coverage_gap',
                    ],
                    'generated_at',
                ],
            ])
            ->assertJsonPath('data.regions.0.region', 'Cairo');
    }
}
