<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class LegacyCampaignRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'campaign_manager', 'guard_name' => 'web']);
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_legacy_campaign_index_alias_returns_data(): void
    {
        $user = $this->makeCampaignManager();
        $campaigns = Campaign::factory()->count(2)->create();

        $this->attachUserToCampaigns($user, $campaigns);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/ec/campaigns');

        $response->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_legacy_send_endpoint_dispatches_campaign(): void
    {
        $user = $this->makeCampaignManager();
        $campaign = Campaign::factory()->create(['status' => 'draft']);
        $this->attachUserToCampaigns($user, collect([$campaign]));

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/ec/campaigns/{$campaign->id}/send");

        $response->assertOk()->assertJsonPath('data.status', 'active');
    }

    protected function makeCampaignManager(): User
    {
        $user = User::factory()->create();
        $user->assignRole('campaign_manager');

        return $user;
    }

    protected function attachUserToCampaigns(User $user, $campaigns): void
    {
        $payload = collect($campaigns)->mapWithKeys(fn ($campaign) => [
            $campaign->getKey() => ['role' => 'campaign_manager', 'status' => 'active'],
        ])->all();

        $user->campaigns()->syncWithoutDetaching($payload);
    }
}
