<?php

namespace Tests\Feature;

use Database\Seeders\DemoElectionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_and_fetch_profile(): void
    {
        $this->seed(DemoElectionSeeder::class);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response->assertOk();

        $token = $response->json('token');
        $this->assertNotEmpty($token);

        $profile = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/auth/me');

        $profile->assertOk()
            ->assertJsonPath('email', 'admin@example.com')
            ->assertJsonStructure([
                'id',
                'name',
                'memberships',
                'scopes',
            ]);
    }
}
