<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VolunteerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_volunteers_with_filters()
    {
        Sanctum::actingAs(User::factory()->create());
        $teamA = Team::factory()->create();
        $teamB = Team::factory()->create();
        Volunteer::factory()->create(['name' => 'Alice', 'team_id' => $teamA->id]);
        Volunteer::factory()->create(['name' => 'Bob', 'team_id' => $teamB->id]);

        $response = $this->getJson('/api/v1/volunteers?name=Ali');
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.name', 'Alice');

        $response = $this->getJson('/api/v1/volunteers?team_id=' . $teamB->id);
        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.team.id', $teamB->id);
    }

    public function test_store_creates_volunteer()
    {
        Sanctum::actingAs(User::factory()->create());
        $team = Team::factory()->create();

        $payload = [
            'name' => 'Vol 1',
            'email' => 'vol1@example.com',
            'phone' => '123456',
            'team_id' => $team->id,
        ];

        $response = $this->postJson('/api/v1/volunteers', $payload);

        $response->assertCreated()->assertJsonPath('data.name', 'Vol 1');
        $this->assertDatabaseHas('volunteers', ['email' => 'vol1@example.com']);
    }

    public function test_show_returns_volunteer()
    {
        Sanctum::actingAs(User::factory()->create());
        $volunteer = Volunteer::factory()->create();

        $response = $this->getJson('/api/v1/volunteers/' . $volunteer->id);

        $response->assertOk()->assertJsonPath('data.id', $volunteer->id);
    }

    public function test_update_updates_volunteer()
    {
        Sanctum::actingAs(User::factory()->create());
        $volunteer = Volunteer::factory()->create(['name' => 'Old']);

        $response = $this->putJson('/api/v1/volunteers/' . $volunteer->id, ['name' => 'New']);

        $response->assertOk()->assertJsonPath('data.name', 'New');
        $this->assertDatabaseHas('volunteers', ['id' => $volunteer->id, 'name' => 'New']);
    }

    public function test_destroy_deletes_volunteer()
    {
        Sanctum::actingAs(User::factory()->create());
        $volunteer = Volunteer::factory()->create();

        $response = $this->deleteJson('/api/v1/volunteers/' . $volunteer->id);

        $response->assertNoContent();
        $this->assertDatabaseMissing('volunteers', ['id' => $volunteer->id]);
    }

    public function test_store_validation_errors()
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/volunteers', []);

        $response->assertStatus(422);
    }

    public function test_requires_authentication()
    {
        $response = $this->getJson('/api/v1/volunteers');

        $response->assertStatus(401);
    }
}

