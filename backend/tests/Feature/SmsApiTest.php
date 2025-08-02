<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SmsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_sends_sms()
    {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'message' => 'Test',
            'recipient_phone' => '123456',
        ];

        $response = $this->postJson('/api/v1/sms', $payload);

        $response->assertCreated()->assertJsonPath('data.status', 'sent');
        $this->assertDatabaseHas('sms', ['recipient_phone' => '123456', 'status' => 'sent']);
    }

    public function test_store_schedules_sms()
    {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'message' => 'Later',
            'recipient_phone' => '123456',
            'scheduled_for' => now()->addDay()->toISOString(),
        ];

        $response = $this->postJson('/api/v1/sms', $payload);

        $response->assertCreated()->assertJsonPath('data.status', 'scheduled');
        $this->assertDatabaseHas('sms', ['recipient_phone' => '123456', 'status' => 'scheduled']);
    }
}
