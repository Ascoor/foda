<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class CampaignPollingDayApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate(): User
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $user = User::factory()->create();
        $user->assignRole($role);
        Sanctum::actingAs($user);

        return $user;
    }

    public function test_index_returns_polling_days(): void
    {
        $this->authenticate();
        $campaign = Campaign::factory()->create();
        CampaignPollingDay::factory()->count(2)->create(['campaign_id' => $campaign->id]);

        $response = $this->getJson("/api/v1/campaigns/{$campaign->id}/polling-days");

        $response->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_can_create_polling_day(): void
    {
        $this->authenticate();
        $campaign = Campaign::factory()->create();

        $payload = [
            'date' => now()->addWeek()->toDateString(),
            'opens_at' => '08:00',
            'closes_at' => '20:00',
            'notes' => 'Opening day',
        ];

        $response = $this->postJson("/api/v1/campaigns/{$campaign->id}/polling-days", $payload);

        $response->assertCreated();
        $this->assertDatabaseHas('campaign_polling_days', [
            'campaign_id' => $campaign->id,
            'date' => $payload['date'],
        ]);
    }

    public function test_can_update_polling_day(): void
    {
        $this->authenticate();
        $campaign = Campaign::factory()->create();
        $pollingDay = CampaignPollingDay::factory()->create(['campaign_id' => $campaign->id]);

        $response = $this->putJson("/api/v1/campaigns/{$campaign->id}/polling-days/{$pollingDay->id}", [
            'notes' => 'Updated notes',
        ]);

        $response->assertOk()->assertJsonPath('data.notes', 'Updated notes');
        $this->assertDatabaseHas('campaign_polling_days', ['id' => $pollingDay->id, 'notes' => 'Updated notes']);
    }

    public function test_can_delete_polling_day(): void
    {
        $this->authenticate();
        $campaign = Campaign::factory()->create();
        $pollingDay = CampaignPollingDay::factory()->create(['campaign_id' => $campaign->id]);

        $response = $this->deleteJson("/api/v1/campaigns/{$campaign->id}/polling-days/{$pollingDay->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('campaign_polling_days', ['id' => $pollingDay->id]);
    }
}
