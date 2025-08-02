<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Event;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use Carbon\Carbon;

class HomeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_returns_stats_and_graph()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $team = Team::create([
            'name' => 'Team 1',
            'area_id' => $area->id,
            'supervisor_id' => $user->id,
        ]);

        Volunteer::create([
            'name' => 'Vol 1',
            'team_id' => $team->id,
        ]);

        $now = Carbon::now();
        Voter::create([
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        Voter::create([
            'created_at' => $now->copy()->addDay(),
            'updated_at' => $now->copy()->addDay(),
        ]);

        Event::create([
            'event_id' => 'EVT',
            'name' => 'Event 1',
            'description' => 'Desc',
            'organiser' => 'Org',
            'location' => 'Loc',
            'date' => Carbon::now()->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->getJson('/api/v1/home');

        $response->assertOk()
            ->assertJsonPath('data.areas', 1)
            ->assertJsonPath('data.volunteers', 1)
            ->assertJsonPath('data.voters', 2)
            ->assertJsonPath('data.teams', 1)
            ->assertJsonPath('data.events', 1);

        $response->assertJsonCount(1, 'data.registrations')
            ->assertJsonPath('data.registrations.0.count', 2);
    }

    public function test_dashboard_filters_voters_by_date_range()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $team = Team::create([
            'name' => 'Team 1',
            'area_id' => $area->id,
            'supervisor_id' => $user->id,
        ]);

        Volunteer::create([
            'name' => 'Vol 1',
            'team_id' => $team->id,
        ]);

        $old = Carbon::now()->subMonths(2);
        Voter::create([
            'created_at' => $old,
            'updated_at' => $old,
        ]);

        $now = Carbon::now();
        Voter::create([
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        Event::create([
            'event_id' => 'EVT',
            'name' => 'Event 1',
            'description' => 'Desc',
            'organiser' => 'Org',
            'location' => 'Loc',
            'date' => Carbon::now()->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->getJson('/api/v1/home?from=' . $now->subMonth()->toDateString());

        $response->assertOk()
            ->assertJsonPath('data.voters', 1)
            ->assertJsonCount(1, 'data.registrations');
    }

    public function test_heatmap_returns_area_coordinates()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
            'x' => 10,
            'y' => 20,
        ]);

        $response = $this->getJson('/api/v1/home/heatmap');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.lat', 10.0)
            ->assertJsonPath('data.0.lng', 20.0);
    }

    public function test_home_endpoints_require_authentication()
    {
        $this->getJson('/api/v1/home')->assertUnauthorized();
        $this->getJson('/api/v1/home/heatmap')->assertUnauthorized();
    }
}
