<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Sms;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SmsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_sends_sms()
    {
        Http::fake();
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'message' => 'Test',
            'recipient' => '123456',
        ];

        $response = $this->postJson('/api/v1/sms', $payload);

        $response->assertCreated()->assertJsonPath('data.status', 'sent');
        $this->assertDatabaseHas('sms', ['recipient' => '123456', 'status' => 'sent']);
    }

    public function test_store_schedules_sms()
    {
        Sanctum::actingAs(User::factory()->create());

        $payload = [
            'message' => 'Later',
            'recipient' => '123456',
            'scheduled_for' => now()->addDay()->toISOString(),
        ];

        $response = $this->postJson('/api/v1/sms', $payload);

        $response->assertCreated()->assertJsonPath('data.status', 'scheduled');
        $this->assertDatabaseHas('sms', ['recipient' => '123456', 'status' => 'scheduled']);
    }

    public function test_store_validation_error()
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/sms', []);

        $response->assertStatus(422);
    }

    public function test_user_cannot_view_others_sms()
    {
        $userA = User::factory()->create();
        $sms = $userA->sms()->create([
            'message' => 'Secret',
            'recipient' => '111111',
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        $userB = User::factory()->create();
        Sanctum::actingAs($userB);

        $response = $this->getJson("/api/v1/sms/{$sms->id}");

        $response->assertForbidden();
    }

    public function test_update_resend_sms()
    {
        Http::fake();
        $user = User::factory()->create();
        $sms = Sms::factory()->for($user)->create(['status' => 'pending', 'sent_at' => null]);
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/v1/sms/{$sms->id}", [
            'message' => $sms->message,
            'recipient' => $sms->recipient,
            'resend' => true,
        ]);

        $response->assertOk()->assertJsonPath('data.status', 'sent');
        $this->assertNotNull($sms->fresh()->sent_at);
    }

    public function test_destroy_sms()
    {
        $user = User::factory()->create();
        $sms = Sms::factory()->for($user)->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/v1/sms/{$sms->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('sms', ['id' => $sms->id]);
    }
}
