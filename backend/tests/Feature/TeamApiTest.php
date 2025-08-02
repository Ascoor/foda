<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TeamApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_team()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();

        $payload = [
            'name' => 'Team 1',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ];

        $response = $this->postJson('/api/v1/teams', $payload);

        $response->assertCreated()->assertJsonPath('data.name', 'Team 1');
        $this->assertDatabaseHas('teams', ['name' => 'Team 1']);
    }

    public function test_assign_volunteer_to_team()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();
        $team = Team::create([
            'name' => 'Team A',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ]);
        $volunteer = Volunteer::create(['name' => 'Vol 1']);

        $response = $this->postJson("/api/v1/teams/{$team->id}/volunteers", [
            'volunteer_ids' => [$volunteer->id],
        ]);

        $response->assertOk()->assertJsonPath('data.volunteers_count', 1);
        $this->assertDatabaseHas('volunteers', [
            'id' => $volunteer->id,
            'team_id' => $team->id,
        ]);
    }

    public function test_destroy_deletes_team()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();
        $team = Team::create([
            'name' => 'Team B',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ]);

        $response = $this->deleteJson("/api/v1/teams/{$team->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('teams', ['id' => $team->id]);
    }

    public function test_index_shows_teams_with_volunteers()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();
        $team = Team::create([
            'name' => 'Team C',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ]);
        Volunteer::create(['name' => 'Vol X', 'team_id' => $team->id]);

        $response = $this->getJson('/api/v1/teams');

        $response->assertOk()->assertJsonPath('data.0.volunteers.0.name', 'Vol X');
    }

    public function test_show_returns_team_with_volunteers()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();
        $team = Team::create([
            'name' => 'Team D',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ]);
        $volunteer = Volunteer::create(['name' => 'Vol Y', 'team_id' => $team->id]);

        $response = $this->getJson("/api/v1/teams/{$team->id}");

        $response->assertOk()->assertJsonPath('data.volunteers.0.id', $volunteer->id);
    }

    public function test_update_modifies_team()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();
        $team = Team::create([
            'name' => 'Old',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ]);

        $response = $this->putJson("/api/v1/teams/{$team->id}", ['name' => 'New']);

        $response->assertOk()->assertJsonPath('data.name', 'New');
        $this->assertDatabaseHas('teams', ['id' => $team->id, 'name' => 'New']);
    }

    public function test_remove_volunteer_from_team()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::factory()->create();
        $supervisor = User::factory()->create();
        $team = Team::create([
            'name' => 'Team E',
            'area_id' => $area->id,
            'supervisor_id' => $supervisor->id,
        ]);
        $volunteer = Volunteer::create(['name' => 'Vol Z', 'team_id' => $team->id]);

        $response = $this->deleteJson("/api/v1/teams/{$team->id}/volunteers/{$volunteer->id}");

        $response->assertNoContent();
        $this->assertDatabaseHas('volunteers', ['id' => $volunteer->id, 'team_id' => null]);
    }
}

