<?php

namespace Tests\Feature;

use App\Events\ElectionResultsUpdated;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LiveDataApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticate(): string
    {
        $user = User::factory()->create();

        return $user->createToken('api-token')->plainTextToken;
    }

    public function test_can_fetch_live_election_results_and_broadcast(): void
    {
        config([
            'services.election.base_url' => 'https://elections.example',
            'services.election.api_key' => 'secret-token',
            'services.election.cache_ttl' => 60,
        ]);

        Http::fake([
            'https://elections.example/results/42' => Http::response([
                'candidate_a' => 1200,
                'candidate_b' => 900,
            ]),
        ]);

        Event::fake();

        $token = $this->authenticate();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/live/elections/42?broadcast=1')
            ->assertOk()
            ->assertJsonPath('data.election_id', '42')
            ->assertJsonPath('data.results.candidate_a', 1200);

        Event::assertDispatched(ElectionResultsUpdated::class, function (ElectionResultsUpdated $event) {
            return $event->electionId === '42' && $event->results['candidate_a'] === 1200;
        });

        Http::assertSentCount(1);
    }

    public function test_election_results_endpoint_uses_cache(): void
    {
        config([
            'services.election.base_url' => 'https://elections.example',
            'services.election.api_key' => 'secret-token',
            'services.election.cache_ttl' => 60,
        ]);

        Http::fake([
            'https://elections.example/results/100' => Http::response([
                'candidate_a' => 10,
            ]),
        ]);

        Event::fake();

        $token = $this->authenticate();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/live/elections/100?broadcast=0')
            ->assertOk();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/live/elections/100?broadcast=0')
            ->assertOk();

        Http::assertSentCount(1);
    }

    public function test_can_fetch_live_geo_data(): void
    {
        config([
            'services.geo.base_url' => 'https://geo.example',
            'services.geo.api_key' => 'geo-token',
            'services.geo.cache_ttl' => 60,
        ]);

        Http::fake([
            'https://geo.example/areas*' => Http::response([
                'regions' => [
                    ['id' => 1, 'name' => 'Central']
                ],
            ]),
        ]);

        $token = $this->authenticate();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/live/geo?lat=30.1&lng=31.2')
            ->assertOk()
            ->assertJsonPath('data.regions.0.name', 'Central');
    }

    public function test_can_geocode_address(): void
    {
        config([
            'services.google_maps.base_url' => 'https://maps.googleapis.com/maps/api',
            'services.google_maps.api_key' => 'maps-token',
            'services.google_maps.cache_ttl' => 60,
        ]);

        Http::fake([
            'https://maps.googleapis.com/maps/api/geocode/json*' => Http::response([
                'status' => 'OK',
                'results' => [
                    ['formatted_address' => 'Cairo, Egypt']
                ],
            ]),
        ]);

        $token = $this->authenticate();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/live/maps/geocode?address=Cairo')
            ->assertOk()
            ->assertJsonPath('data.results.0.formatted_address', 'Cairo, Egypt');
    }
}
