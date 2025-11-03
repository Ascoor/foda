<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CampaignApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_can_list_campaigns(): void
    {
        $user = $this->makeAdmin();
        Campaign::factory()->count(3)->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/campaigns');

        $response->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_campaign(): void
    {
        $user = $this->makeAdmin();
        Sanctum::actingAs($user);

        $payload = [
            'name' => 'حملة جديدة',
            'description' => 'تفاصيل حملة جديدة',
            'starts_at' => now()->addWeek()->toDateString(),
            'ends_at' => now()->addWeeks(4)->toDateString(),
            'spatial_level' => 'city',
            'bbox' => [29.1, 30.2, 31.3, 32.4],
            'status' => 'planned',
        ];

        $response = $this->postJson('/api/v1/campaigns', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'حملة جديدة');

        $this->assertDatabaseHas('campaigns', ['name' => 'حملة جديدة']);
    }

    public function test_can_show_campaign(): void
    {
        $user = $this->makeAdmin();
        $campaign = Campaign::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/campaigns/{$campaign->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $campaign->id);
    }

    public function test_can_update_campaign(): void
    {
        $user = $this->makeAdmin();
        $campaign = Campaign::factory()->create(['name' => 'قديم']);

        Sanctum::actingAs($user);

        $response = $this->putJson("/api/v1/campaigns/{$campaign->id}", [
            'name' => 'محدث',
            'ends_at' => now()->addWeeks(6)->toDateString(),
        ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'محدث');

        $this->assertDatabaseHas('campaigns', ['id' => $campaign->id, 'name' => 'محدث']);
    }

    public function test_can_delete_campaign(): void
    {
        $user = $this->makeAdmin();
        $campaign = Campaign::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/campaigns/{$campaign->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('campaigns', ['id' => $campaign->id]);
    }

    public function test_user_without_access_cannot_view_other_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->getJson("/api/v1/campaigns/{$campaign->id}")
            ->assertForbidden();
    }

    protected function makeAdmin(): User
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        return $user;
    }
}
