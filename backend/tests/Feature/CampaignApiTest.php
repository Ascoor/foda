<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class CampaignApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateAsAdmin(): User
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $user = User::factory()->create();
        $user->assignRole($role);

        Sanctum::actingAs($user);

        return $user;
    }

    public function test_can_list_campaigns(): void
    {
        $user = $this->authenticateAsAdmin();
        Campaign::factory()->count(2)->create(['created_by' => $user->getKey()]);

        $response = $this->getJson('/api/v1/campaigns');

        $response->assertOk()->assertJsonCount(2, 'data');
    }

    public function test_can_create_campaign(): void
    {
        $this->authenticateAsAdmin();

        $starts = Carbon::now()->addWeek();
        $ends = Carbon::now()->addWeeks(2);

        $payload = [
            'name' => 'اختبار الحملة',
            'description' => 'حملة اختبارية.',
            'timezone' => 'Africa/Cairo',
            'starts_at' => $starts->toISOString(),
            'ends_at' => $ends->toISOString(),
            'spatial_level' => 'city',
            'admin_areas' => ['EG-01'],
            'bbox' => [29.0, 30.0, 31.0, 32.0],
            'polling_settings' => ['reminders' => true],
            'status' => 'draft',
        ];

        $response = $this->postJson('/api/v1/campaigns', $payload);

        $response->assertCreated();
        $this->assertDatabaseHas('campaigns', ['name' => 'اختبار الحملة']);
    }

    public function test_can_update_campaign(): void
    {
        $user = $this->authenticateAsAdmin();
        $campaign = Campaign::factory()->create(['created_by' => $user->getKey(), 'status' => 'draft']);

        $response = $this->putJson("/api/v1/campaigns/{$campaign->id}", [
            'name' => 'حملة محدثة',
            'status' => 'active',
        ]);

        $response->assertOk()->assertJsonPath('data.name', 'حملة محدثة');
        $this->assertDatabaseHas('campaigns', ['id' => $campaign->id, 'status' => 'active']);
    }

    public function test_can_delete_campaign(): void
    {
        $user = $this->authenticateAsAdmin();
        $campaign = Campaign::factory()->create(['created_by' => $user->getKey()]);

        $response = $this->deleteJson("/api/v1/campaigns/{$campaign->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('campaigns', ['id' => $campaign->id]);
    }
}
