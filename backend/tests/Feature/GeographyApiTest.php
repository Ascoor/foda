<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\GeographicScope;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class GeographyApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'campaign_manager', 'guard_name' => 'web']);
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_can_manage_geographic_scopes_for_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $user = User::factory()->create();
        $user->assignRole('campaign_manager');

        Sanctum::actingAs($user);

        $create = $this->postJson(route('campaigns.geographic-scopes.store', ['campaign' => $campaign->id]), [
            'name' => 'Main District',
            'level' => 'district',
        ]);

        $create->assertCreated();
        $scopeId = $create->json('data.id');

        $this->assertDatabaseHas('geographic_scopes', [
            'id' => $scopeId,
            'campaign_id' => $campaign->id,
        ]);

        $this->getJson(route('campaigns.geographic-scopes.index', ['campaign' => $campaign->id]))
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta']);

        $this->putJson(route('campaigns.geographic-scopes.update', [
            'campaign' => $campaign->id,
            'geographic_scope' => $scopeId,
        ]), [
            'name' => 'Updated District',
        ])->assertOk()->assertJsonPath('data.name', 'Updated District');

        $this->deleteJson(route('campaigns.geographic-scopes.destroy', [
            'campaign' => $campaign->id,
            'geographic_scope' => $scopeId,
        ]))->assertNoContent();

        $this->assertDatabaseMissing('geographic_scopes', ['id' => $scopeId]);
    }

    public function test_parent_scope_must_belong_to_same_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $otherCampaign = Campaign::factory()->create();
        $foreignScope = GeographicScope::factory()->create(['campaign_id' => $otherCampaign->id]);

        $user = User::factory()->create();
        $user->assignRole('campaign_manager');
        Sanctum::actingAs($user);

        $this->postJson(route('campaigns.geographic-scopes.store', ['campaign' => $campaign->id]), [
            'name' => 'Invalid Parent',
            'level' => 'city',
            'parent_id' => $foreignScope->id,
        ])->assertStatus(422)->assertJsonValidationErrors('parent_id');
    }

    public function test_can_manage_committees_for_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $scope = GeographicScope::factory()->create(['campaign_id' => $campaign->id]);

        $user = User::factory()->create();
        $user->assignRole('campaign_manager');
        Sanctum::actingAs($user);

        $create = $this->postJson(route('campaigns.committees.store', ['campaign' => $campaign->id]), [
            'name' => 'Central Committee',
            'geographic_scope_id' => $scope->id,
            'code' => 'CENTRAL',
        ]);

        $create->assertCreated();
        $committeeId = $create->json('data.id');

        $this->assertDatabaseHas('committees', [
            'id' => $committeeId,
            'campaign_id' => $campaign->id,
        ]);

        $this->getJson(route('campaigns.committees.index', ['campaign' => $campaign->id]))
            ->assertOk()
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonPath('data.0.id', $committeeId);

        $this->putJson(route('campaigns.committees.update', [
            'campaign' => $campaign->id,
            'committee' => $committeeId,
        ]), [
            'name' => 'Updated Committee',
        ])->assertOk()->assertJsonPath('data.name', 'Updated Committee');

        $this->deleteJson(route('campaigns.committees.destroy', [
            'campaign' => $campaign->id,
            'committee' => $committeeId,
        ]))->assertNoContent();

        $this->assertDatabaseMissing('committees', ['id' => $committeeId]);
    }

    public function test_committee_requires_scope_within_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $foreignScope = GeographicScope::factory()->create();

        $user = User::factory()->create();
        $user->assignRole('campaign_manager');
        Sanctum::actingAs($user);

        $this->postJson(route('campaigns.committees.store', ['campaign' => $campaign->id]), [
            'name' => 'Out of Scope',
            'geographic_scope_id' => $foreignScope->id,
        ])->assertStatus(422)->assertJsonValidationErrors('geographic_scope_id');
    }
}
