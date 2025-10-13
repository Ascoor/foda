<?php

namespace Tests\Feature;

use App\Events\LiveElectionResultsUpdated;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExternalIntegrationApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'external.geo.base_url' => 'https://geo.test',
            'external.geo.headers' => [],
            'external.geo.timeout' => 5,
            'external.elections.base_url' => 'https://elections.test',
            'external.elections.headers' => [],
            'external.elections.timeout' => 5,
            'external.maps.key' => 'test-key',
            'external.maps.base_url' => 'https://maps.googleapis.com/maps/api',
            'external.cache_ttl' => null,
        ]);
    }

    public function test_geo_areas_endpoint_returns_external_data(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Http::fake([
            'https://geo.test/ec/geo-areas*' => Http::response([
                'data' => [
                    ['id' => 1, 'name' => 'Area 1'],
                    ['id' => 2, 'name' => 'Area 2'],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/integrations/geo-areas?province=Cairo');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Area 1');
    }

    public function test_election_summary_endpoint_combines_summary_and_turnout(): void
    {
        Sanctum::actingAs(User::factory()->create());

        Http::fake([
            'https://elections.test/ec/elections/summary*' => Http::response([
                'data' => ['total_precincts' => 10, 'reporting_precincts' => 5],
            ], 200),
            'https://elections.test/ec/elections/turnout*' => Http::response([
                'data' => ['registered_voters' => 5000, 'turnout_percentage' => 52],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/integrations/elections/summary?state=Giza');

        $response->assertOk()
            ->assertJsonPath('data.summary.total_precincts', 10)
            ->assertJsonPath('data.turnout.turnout_percentage', 52);
    }

    public function test_live_results_endpoint_can_broadcast_event(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Event::fake([LiveElectionResultsUpdated::class]);

        Http::fake([
            'https://elections.test/ec/elections/results*' => Http::response([
                'data' => [
                    ['candidate' => 'A', 'votes' => 1234],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/v1/integrations/elections/live-results?broadcast=true');

        $response->assertOk()
            ->assertJsonPath('data.0.candidate', 'A');

        Event::assertDispatched(LiveElectionResultsUpdated::class, function ($event) {
            return $event->payload['results'][0]['candidate'] === 'A';
        });
    }

    public function test_map_configuration_returns_static_map_details(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->getJson('/api/v1/integrations/maps/configuration?center=30.1,31.2&visible_layers=turnout,delegates');

        $response->assertOk()
            ->assertJsonPath('data.apiKey', 'test-key')
            ->assertJsonPath('data.visibleLayers.0', 'turnout')
            ->assertJsonPath('data.visibleLayers.1', 'delegates')
            ->assertJsonStructure(['data' => ['staticMapUrl']]);
    }

    public function test_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/integrations/geo-areas')->assertUnauthorized();
        $this->getJson('/api/v1/integrations/elections/summary')->assertUnauthorized();
        $this->getJson('/api/v1/integrations/elections/live-results')->assertUnauthorized();
        $this->getJson('/api/v1/integrations/maps/configuration')->assertUnauthorized();
    }
}
