<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Swot;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SwotApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate(): void
    {
        Sanctum::actingAs(User::factory()->create());
    }

    public function test_store_creates_swot_for_area()
    {
        $this->authenticate();
        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);

        $payload = [
            'entity_type' => 'area',
            'entity_id' => $area->id,
            'strengths' => 'strong',
            'weaknesses' => 'weak',
            'opportunities' => 'opps',
            'threats' => 'threats',
        ];

        $response = $this->postJson('/api/v1/swots', $payload);

        $response->assertOk()->assertJsonPath('data.entity_id', $area->id);
        $this->assertDatabaseHas('swots', ['entity_id' => $area->id, 'entity_type' => 'area']);
    }

    public function test_index_returns_swots()
    {
        $this->authenticate();
        $area = Area::create(['name' => 'A', 'description' => 'D']);
        Swot::create([
            'entity_type' => 'area',
            'entity_id' => $area->id,
            'strengths' => 's',
            'weaknesses' => 'w',
            'opportunities' => 'o',
            'threats' => 't',
            'created_by' => User::factory()->create()->id,
        ]);

        $response = $this->getJson('/api/v1/swots');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_update_modifies_swot()
    {
        $this->authenticate();
        $area = Area::create(['name' => 'A', 'description' => 'D']);
        $swot = Swot::create([
            'entity_type' => 'area',
            'entity_id' => $area->id,
            'strengths' => 's',
            'weaknesses' => 'w',
            'opportunities' => 'o',
            'threats' => 't',
            'created_by' => User::factory()->create()->id,
        ]);

        $response = $this->putJson('/api/v1/swots/'.$swot->id, ['strengths' => 'updated']);

        $response->assertOk()->assertJsonPath('data.strengths', 'updated');
        $this->assertDatabaseHas('swots', ['id' => $swot->id, 'strengths' => 'updated']);
    }

    public function test_destroy_deletes_swot()
    {
        $this->authenticate();
        $area = Area::create(['name' => 'A', 'description' => 'D']);
        $swot = Swot::create([
            'entity_type' => 'area',
            'entity_id' => $area->id,
            'strengths' => 's',
            'weaknesses' => 'w',
            'opportunities' => 'o',
            'threats' => 't',
            'created_by' => User::factory()->create()->id,
        ]);

        $response = $this->deleteJson('/api/v1/swots/'.$swot->id);

        $response->assertNoContent();
        $this->assertDatabaseMissing('swots', ['id' => $swot->id]);
    }

    public function test_can_attach_to_team_and_volunteer()
    {
        $this->authenticate();
        $area = Area::create(['name' => 'A', 'description' => 'D']);
        $team = Team::create([
            'name' => 'Team 1',
            'area_id' => $area->id,
            'supervisor_id' => User::factory()->create()->id,
        ]);
        $volunteer = Volunteer::create(['name' => 'Vol 1']);

        $payloadTeam = [
            'entity_type' => 'team',
            'entity_id' => $team->id,
            'strengths' => 'team strength',
            'weaknesses' => 'team weakness',
            'opportunities' => 'team opp',
            'threats' => 'team threat',
        ];

        $payloadVolunteer = [
            'entity_type' => 'volunteer',
            'entity_id' => $volunteer->id,
            'strengths' => 'vol strength',
            'weaknesses' => 'vol weakness',
            'opportunities' => 'vol opp',
            'threats' => 'vol threat',
        ];

        $this->postJson('/api/v1/swots', $payloadTeam)->assertOk();
        $this->postJson('/api/v1/swots', $payloadVolunteer)->assertOk();

        $this->assertDatabaseHas('swots', ['entity_type' => 'team', 'entity_id' => $team->id]);
        $this->assertDatabaseHas('swots', ['entity_type' => 'volunteer', 'entity_id' => $volunteer->id]);
    }

    public function test_report_filters_by_entity_type_and_ids()
    {
        $this->authenticate();

        $area1 = Area::create(['name' => 'Area1', 'description' => 'D1']);
        $area2 = Area::create(['name' => 'Area2', 'description' => 'D2']);

        Swot::factory()->create([
            'entity_type' => 'area',
            'entity_id' => $area1->id,
        ]);
        Swot::factory()->create([
            'entity_type' => 'area',
            'entity_id' => $area2->id,
        ]);
        Swot::factory()->create([
            'entity_type' => 'team',
            'entity_id' => 1,
        ]);

        $response = $this->getJson('/api/v1/swots/report?entity_type=area&entity_ids[]=' . $area1->id);

        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.entity_id', $area1->id);
    }
}
