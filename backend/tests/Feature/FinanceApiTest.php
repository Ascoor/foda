<?php

namespace Tests\Feature;

use App\Models\Finance;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FinanceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_finances()
    {
        Sanctum::actingAs(User::factory()->create());
        Finance::factory()->create();

        $response = $this->getJson('/api/v1/finances');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_store_creates_finance()
    {
        Sanctum::actingAs(User::factory()->create());
        $payload = [
            'amount' => 100.5,
            'type' => 'income',
            'date' => '2024-01-01',
            'description' => 'Donation',
            'reference_id' => 1,
        ];

        $response = $this->postJson('/api/v1/finances', $payload);

        $response->assertCreated()->assertJsonPath('data.amount', 100.5);
        $this->assertDatabaseHas('finances', ['amount' => 100.5]);
    }

    public function test_show_returns_finance()
    {
        Sanctum::actingAs(User::factory()->create());
        $finance = Finance::factory()->create();

        $response = $this->getJson("/api/v1/finances/{$finance->id}");

        $response->assertOk()->assertJsonPath('data.id', $finance->id);
    }

    public function test_update_modifies_finance()
    {
        Sanctum::actingAs(User::factory()->create());
        $finance = Finance::factory()->create();

        $payload = [
            'amount' => 75,
            'type' => 'expense',
            'date' => $finance->date->toDateString(),
        ];

        $response = $this->putJson("/api/v1/finances/{$finance->id}", $payload);

        $response->assertOk()->assertJsonPath('data.amount', 75.0);
        $this->assertDatabaseHas('finances', ['id' => $finance->id, 'amount' => 75.0]);
    }

    public function test_destroy_deletes_finance()
    {
        Sanctum::actingAs(User::factory()->create());
        $finance = Finance::factory()->create();

        $response = $this->deleteJson("/api/v1/finances/{$finance->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('finances', ['id' => $finance->id]);
    }
}
