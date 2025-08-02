<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AreaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_areas()
    {
        Sanctum::actingAs(User::factory()->create());
        Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $response = $this->getJson('/api/v1/areas');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_store_creates_area()
    {
        Sanctum::actingAs(User::factory()->create());
        $payload = [
            'name' => 'Area 1',
            'description' => 'Desc',
            'x' => '1',
            'y' => '2',
        ];

        $response = $this->postJson('/api/v1/areas', $payload);

        $response->assertCreated()->assertJsonPath('data.name', 'Area 1');
        $this->assertDatabaseHas('areas', ['name' => 'Area 1']);
    }

    public function test_show_returns_area()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $response = $this->getJson("/api/v1/areas/{$area->id}");

        $response->assertOk()->assertJsonPath('data.id', $area->id);
    }

    public function test_update_modifies_area()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $response = $this->putJson("/api/v1/areas/{$area->id}", ['name' => 'Updated']);

        $response->assertOk()->assertJsonPath('data.name', 'Updated');
        $this->assertDatabaseHas('areas', ['id' => $area->id, 'name' => 'Updated']);
    }

    public function test_destroy_deletes_area()
    {
        Sanctum::actingAs(User::factory()->create());
        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $response = $this->deleteJson("/api/v1/areas/{$area->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('areas', ['id' => $area->id]);
    }
}
