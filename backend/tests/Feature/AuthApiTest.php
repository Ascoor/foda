<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_successful(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)->assertJsonStructure(['data' => ['token']]);
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'nouser@example.com',
            'password' => 'secret',
        ]);

        $response->assertStatus(401);
    }

    public function test_register_creates_user(): void
    {
        $adminRole = Role::create(['name' => 'admin']);
        $newRole = Role::create(['name' => 'volunteer']);
        $admin = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole($adminRole);
        $token = $admin->createToken('api-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/register', [
                'name' => 'New User',
                'email' => 'new@example.com',
                'password' => 'password123',
                'role_id' => $newRole->id,
            ]);

        $response->assertStatus(201)->assertJsonPath('data.user.email', 'new@example.com');
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $token = $user->createToken('api-token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/logout')
            ->assertStatus(200);
    }

    public function test_profile_requires_authentication(): void
    {
        $this->getJson('/api/v1/profile')->assertStatus(401);

    }

    public function test_profile_returns_user_data(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $token = $user->createToken('api-token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/v1/profile')
            ->assertStatus(200)
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_update_profile_changes_user(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $token = $user->createToken('api-token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/v1/profile', [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
                'password' => 'newpassword',
                'password_confirmation' => 'newpassword',
            ])
            ->assertStatus(200)
            ->assertJsonPath('data.email', 'updated@example.com');

        $this->assertTrue(Hash::check('newpassword', $user->fresh()->password));
    }

    public function test_register_requires_admin_role(): void
    {
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'volunteer']);

        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);
        $user->assignRole($userRole);
        $token = $user->createToken('api-token')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/register', [
                'name' => 'Another User',
                'email' => 'another@example.com',
                'password' => 'password123',
                'role_id' => $userRole->id,
            ])
            ->assertStatus(403);
    }
}
