<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Area;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ActivityApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_activities(): void
    {
        $user = User::factory()->create();
        $area = Area::factory()->create();
        Activity::factory()->count(3)->create(['area_id' => $area->id]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/activities');

        $response
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_store_creates_activity(): void
    {
        $user = User::factory()->create();
        $area = Area::factory()->create();
        Sanctum::actingAs($user);

        $payload = [
            'area_id' => $area->id,
            'type' => 'support',
            'status' => 'open',
            'title' => 'Agent reported high turnout',
            'description' => 'Turnout remains high with strong support',
            'latitude' => 30.0444,
            'longitude' => 31.2357,
            'support_score' => 85,
            'reported_at' => Carbon::now()->toIso8601String(),
        ];

        $response = $this->postJson('/api/v1/activities', $payload);

        $response->assertCreated()->assertJsonPath('data.title', 'Agent reported high turnout');
        $this->assertDatabaseHas('activities', [
            'title' => 'Agent reported high turnout',
            'type' => 'support',
        ]);
    }
}
