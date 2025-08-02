<?php

namespace Tests\Feature;

use App\Models\Area;
use App\Models\Event;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EventApiTest extends TestCase
{
    use RefreshDatabase;

    private function prepareDependencies()
    {
        $area = Area::create([
            'name' => 'Area 1',
            'description' => 'Desc',
        ]);
        $team = Team::create([
            'name' => 'Team 1',
        ]);
        return [$area, $team];
    }

    public function test_index_returns_filtered_events()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        Event::create([
            'event_id' => 'E1',
            'name' => 'Event1',
            'organiser' => 'Org1',
            'location' => 'Loc1',
            'date' => now()->addDays(1)->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);
        Event::create([
            'event_id' => 'E2',
            'name' => 'Event2',
            'organiser' => 'Org2',
            'location' => 'Loc2',
            'date' => now()->addDays(10)->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->getJson('/api/v1/events?date=' . now()->addDays(1)->toDateString());

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_store_creates_event()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        $payload = [
            'name' => 'My Event',
            'organiser' => 'Org',
            'location' => 'Loc',
            'date' => now()->addDays(1)->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ];

        $response = $this->postJson('/api/v1/events', $payload);

        $response->assertCreated()->assertJsonPath('data.name', 'My Event');
        $this->assertDatabaseHas('events', ['name' => 'My Event']);
    }

    public function test_cannot_create_event_in_past()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        $payload = [
            'name' => 'Old Event',
            'organiser' => 'Org',
            'location' => 'Loc',
            'date' => now()->subDay()->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ];

        $response = $this->postJson('/api/v1/events', $payload);

        $response->assertStatus(422)->assertJsonValidationErrors('date');
    }

    public function test_show_returns_event()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        $event = Event::create([
            'event_id' => 'E1',
            'name' => 'Event1',
            'organiser' => 'Org1',
            'location' => 'Loc1',
            'date' => now()->addDays(1)->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->getJson("/api/v1/events/{$event->id}");

        $response->assertOk()->assertJsonPath('data.id', $event->id);
    }

    public function test_update_modifies_event()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        $event = Event::create([
            'event_id' => 'E1',
            'name' => 'Event1',
            'organiser' => 'Org1',
            'location' => 'Loc1',
            'date' => now()->addDays(1)->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->putJson("/api/v1/events/{$event->id}", [
            'name' => 'Updated',
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response->assertOk()->assertJsonPath('data.name', 'Updated');
        $this->assertDatabaseHas('events', ['id' => $event->id, 'name' => 'Updated']);
    }

    public function test_destroy_deletes_event()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        $event = Event::create([
            'event_id' => 'E1',
            'name' => 'Event1',
            'organiser' => 'Org1',
            'location' => 'Loc1',
            'date' => now()->addDays(1)->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->deleteJson("/api/v1/events/{$event->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('events', ['id' => $event->id]);
    }

    public function test_upcoming_returns_future_events_only()
    {
        Sanctum::actingAs(User::factory()->create());
        [$area, $team] = $this->prepareDependencies();

        Event::create([
            'event_id' => 'E1',
            'name' => 'Past Event',
            'organiser' => 'Org',
            'location' => 'Loc',
            'date' => now()->subDay()->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);
        $future = Event::create([
            'event_id' => 'E2',
            'name' => 'Future Event',
            'organiser' => 'Org',
            'location' => 'Loc',
            'date' => now()->addDay()->toDateString(),
            'area_id' => $area->id,
            'team_id' => $team->id,
        ]);

        $response = $this->getJson('/api/v1/events/upcoming');

        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $future->id);
    }

    public function test_unauthenticated_user_cannot_access_events()
    {
        $response = $this->getJson('/api/v1/events');
        $response->assertStatus(401);
    }
}
