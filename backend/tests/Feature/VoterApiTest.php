<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Voter;
use App\Models\Area;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VoterApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_voters()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create(['name' => 'Area 1', 'description' => 'Desc']);
        Voter::factory()->create(['area_id' => $area->id]);

        $response = $this->getJson('/api/v1/voters');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_store_creates_voter()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create(['name' => 'Area 1', 'description' => 'Desc']);
        $payload = [
            'name' => 'Tester',
            'email' => 'test@example.com',
            'phone' => '123',
            'area_id' => $area->id,
            'voter_id' => 'VID123',
        ];

        $response = $this->postJson('/api/v1/voters', $payload);

        $response->assertCreated()->assertJsonPath('data.name', 'Tester');
        $this->assertDatabaseHas('voters', ['voter_id' => 'VID123']);
    }

    public function test_show_returns_voter()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create(['name' => 'Area 1', 'description' => 'Desc']);
        $voter = Voter::factory()->create(['area_id' => $area->id]);

        $response = $this->getJson("/api/v1/voters/{$voter->id}");

        $response->assertOk()->assertJsonPath('data.id', $voter->id);
    }

    public function test_update_modifies_voter()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create(['name' => 'Area 1', 'description' => 'Desc']);
        $voter = Voter::factory()->create(['area_id' => $area->id]);

        $response = $this->putJson("/api/v1/voters/{$voter->id}", ['name' => 'Updated']);

        $response->assertOk()->assertJsonPath('data.name', 'Updated');
        $this->assertDatabaseHas('voters', ['id' => $voter->id, 'name' => 'Updated']);
    }

    public function test_destroy_deletes_voter()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create(['name' => 'Area 1', 'description' => 'Desc']);
        $voter = Voter::factory()->create(['area_id' => $area->id]);

        $response = $this->deleteJson("/api/v1/voters/{$voter->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('voters', ['id' => $voter->id]);
    }

    public function test_search_by_voter_id()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create(['name' => 'Area 1', 'description' => 'Desc']);
        Voter::factory()->create(['area_id' => $area->id, 'voter_id' => 'ABC123']);

        $response = $this->getJson('/api/v1/voters?voter_id=ABC123');

        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.voter_id', 'ABC123');
    }

    public function test_requires_authentication()
    {
        $response = $this->getJson('/api/v1/voters');
        $response->assertUnauthorized();
    }
}
