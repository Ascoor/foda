<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CampaignPollingDayApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_can_manage_polling_days(): void
    {
        $user = $this->makeAdmin();
        $campaign = Campaign::factory()->create();
        Sanctum::actingAs($user);

        $create = $this->postJson("/api/v1/campaigns/{$campaign->id}/polling-days", [
            'date' => now()->addDays(10)->toDateString(),
            'notes' => 'اليوم الأول',
        ]);

        $create->assertCreated();
        $pollingDayId = $create->json('data.id');

        $this->assertDatabaseHas('campaign_polling_days', [
            'id' => $pollingDayId,
            'campaign_id' => $campaign->id,
        ]);

        $update = $this->putJson("/api/v1/campaigns/{$campaign->id}/polling-days/{$pollingDayId}", [
            'notes' => 'محدث',
        ]);

        $update->assertOk()->assertJsonPath('data.notes', 'محدث');

        $list = $this->getJson("/api/v1/campaigns/{$campaign->id}/polling-days");
        $list->assertOk()->assertJsonStructure(['data', 'links', 'meta']);

        $delete = $this->deleteJson("/api/v1/campaigns/{$campaign->id}/polling-days/{$pollingDayId}");
        $delete->assertNoContent();

        $this->assertDatabaseMissing('campaign_polling_days', ['id' => $pollingDayId]);
    }

    public function test_enforces_uniqueness_per_campaign_and_date(): void
    {
        $user = $this->makeAdmin();
        $campaign = Campaign::factory()->create();
        Sanctum::actingAs($user);

        $date = now()->addDays(5)->toDateString();

        CampaignPollingDay::factory()->create([
            'campaign_id' => $campaign->id,
            'date' => $date,
        ]);

        $response = $this->postJson("/api/v1/campaigns/{$campaign->id}/polling-days", [
            'date' => $date,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('code', 'VALIDATION_ERROR');
    }

    public function test_user_without_campaign_access_is_forbidden(): void
    {
        $campaign = Campaign::factory()->create();
        $pollingDay = CampaignPollingDay::factory()->create([
            'campaign_id' => $campaign->id,
        ]);

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson("/api/v1/campaigns/{$campaign->id}/polling-days/{$pollingDay->id}")
            ->assertForbidden();
    }

    protected function makeAdmin(): User
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        return $user;
    }
}
