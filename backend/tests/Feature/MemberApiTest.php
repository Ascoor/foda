<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class MemberApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_members()
    {
        Sanctum::actingAs(User::factory()->create());
        User::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/members');

        $response->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_store_creates_member()
    {
        Sanctum::actingAs(User::factory()->create());
        Role::create(['name' => 'member']);

        $payload = [
            'name' => 'Member 1',
            'email' => 'member1@example.com',
            'role' => 'member',
        ];

        $response = $this->postJson('/api/v1/members', $payload);

        $response->assertCreated()->assertJsonPath('data.name', 'Member 1');
        $this->assertDatabaseHas('users', ['email' => 'member1@example.com']);
    }

    public function test_store_validation_errors()
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/members', []);

        $response->assertStatus(422);
    }

    public function test_requires_authentication()
    {
        $response = $this->getJson('/api/v1/members');

        $response->assertStatus(401);
    }
}
