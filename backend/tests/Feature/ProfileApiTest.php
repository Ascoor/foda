<?php

namespace Tests\Feature;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_profiles()
    {
        Sanctum::actingAs(User::factory()->create());
        Profile::factory()->create();

        $response = $this->getJson('/api/v1/profiles');
        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_store_creates_profile()
    {
        Sanctum::actingAs(User::factory()->create());
        $user = User::factory()->create();

        $payload = [
            'user_id' => $user->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '1234567890',
            'avatar' => 'avatar.jpg',
        ];

        $response = $this->postJson('/api/v1/profiles', $payload);
        $response->assertCreated()->assertJsonPath('data.first_name', 'John');
        $this->assertDatabaseHas('profiles', ['user_id' => $user->id, 'first_name' => 'John']);
    }

    public function test_show_returns_profile()
    {
        Sanctum::actingAs(User::factory()->create());
        $profile = Profile::factory()->create();

        $response = $this->getJson('/api/v1/profiles/' . $profile->id);
        $response->assertOk()->assertJsonPath('data.id', $profile->id);
    }

    public function test_update_modifies_profile_and_user()
    {
        Sanctum::actingAs(User::factory()->create());
        $profile = Profile::factory()->create();

        $payload = [
            'first_name' => 'Jane',
            'email' => 'jane@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ];

        $response = $this->putJson('/api/v1/profiles/' . $profile->id, $payload);
        $response->assertOk()->assertJsonPath('data.first_name', 'Jane');
        $this->assertDatabaseHas('profiles', ['id' => $profile->id, 'first_name' => 'Jane']);
        $profile->refresh();
        $this->assertEquals('jane@example.com', $profile->user->email);
        $this->assertTrue(Hash::check('secret123', $profile->user->password));
    }

    public function test_destroy_deletes_profile()
    {
        Sanctum::actingAs(User::factory()->create());
        $profile = Profile::factory()->create();

        $response = $this->deleteJson('/api/v1/profiles/' . $profile->id);
        $response->assertNoContent();
        $this->assertDatabaseMissing('profiles', ['id' => $profile->id]);
    }
}
