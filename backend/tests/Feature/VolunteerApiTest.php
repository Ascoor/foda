<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Committee;
use App\Models\GeographicScope;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class VolunteerApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'campaign_manager', 'guard_name' => 'web']);
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_can_crud_volunteers_for_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $user = User::factory()->create();
        $user->assignRole('campaign_manager');
        Sanctum::actingAs($user);

        $scope = GeographicScope::factory()->create(['campaign_id' => $campaign->id]);
        $committee = Committee::factory()->create([
            'campaign_id' => $campaign->id,
            'geographic_scope_id' => $scope->id,
        ]);

        $this->postJson(route('campaigns.volunteers.store', ['campaign' => $campaign->id]), [
            'name' => 'Field Lead',
            'email' => 'lead@example.com',
            'phone' => '0512345678',
            'geographic_scope_id' => $scope->id,
            'committee_id' => $committee->id,
            'status' => 'active',
        ])->assertCreated()->assertJsonPath('data.name', 'Field Lead');

        $volunteer = Volunteer::query()->where('campaign_id', $campaign->id)->firstOrFail();

        $this->getJson(route('campaigns.volunteers.index', ['campaign' => $campaign->id]))
            ->assertOk()
            ->assertJsonPath('data.0.id', $volunteer->id);

        $this->putJson(route('campaigns.volunteers.update', ['campaign' => $campaign->id, 'volunteer' => $volunteer->id]), [
            'role' => 'Coordinator',
        ])->assertOk()->assertJsonPath('data.role', 'Coordinator');

        $this->deleteJson(route('campaigns.volunteers.destroy', ['campaign' => $campaign->id, 'volunteer' => $volunteer->id]))
            ->assertNoContent();

        $this->assertSoftDeleted('volunteers', ['id' => $volunteer->id]);
    }

    public function test_validation_prevents_out_of_scope_committee(): void
    {
        $campaign = Campaign::factory()->create();
        $user = User::factory()->create();
        $user->assignRole('campaign_manager');
        Sanctum::actingAs($user);

        $scope = GeographicScope::factory()->create(['campaign_id' => $campaign->id]);
        $otherScope = GeographicScope::factory()->create(['campaign_id' => $campaign->id]);
        $committee = Committee::factory()->create([
            'campaign_id' => $campaign->id,
            'geographic_scope_id' => $otherScope->id,
        ]);

        $this->postJson(route('campaigns.volunteers.store', ['campaign' => $campaign->id]), [
            'name' => 'Validator',
            'geographic_scope_id' => $scope->id,
            'committee_id' => $committee->id,
        ])->assertStatus(422)->assertJsonValidationErrors('committee_id');
    }
}

