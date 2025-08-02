<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class SettingApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Permission::firstOrCreate(['name' => 'manage settings']);
    }

    public function test_index_returns_settings()
    {
        Sanctum::actingAs(User::factory()->create());
        Setting::factory()->create(['key' => 'APP_NAME']);

        $response = $this->getJson('/api/v1/settings');

        $response->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_store_requires_permission()
    {
        Sanctum::actingAs(User::factory()->create());
        $payload = [
            'key' => 'TEST',
            'value' => '1',
            'type' => 'string',
        ];

        $this->postJson('/api/v1/settings', $payload)->assertForbidden();
    }

    public function test_store_creates_setting_for_authorized_user()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('manage settings');
        Sanctum::actingAs($user);

        $payload = [
            'key' => 'APP_NAME',
            'value' => 'Foda',
            'type' => 'string',
        ];

        $response = $this->postJson('/api/v1/settings', $payload);

        $response->assertCreated()->assertJsonPath('data.key', 'APP_NAME');
        $this->assertDatabaseHas('settings', ['key' => 'APP_NAME']);
    }

    public function test_show_returns_setting()
    {
        Sanctum::actingAs(User::factory()->create());
        $setting = Setting::factory()->create();

        $response = $this->getJson('/api/v1/settings/' . $setting->id);

        $response->assertOk()->assertJsonPath('data.id', $setting->id);
    }

    public function test_get_by_key_returns_setting()
    {
        Sanctum::actingAs(User::factory()->create());
        $setting = Setting::factory()->create(['key' => 'APP_NAME']);

        $response = $this->getJson('/api/v1/settings/key/APP_NAME');

        $response->assertOk()->assertJsonPath('data.id', $setting->id);
    }

    public function test_update_requires_permission()
    {
        $setting = Setting::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->putJson('/api/v1/settings/' . $setting->id, ['value' => 'new'])->assertForbidden();
    }

    public function test_update_modifies_setting_for_authorized_user()
    {
        $setting = Setting::factory()->create();
        $user = User::factory()->create();
        $user->givePermissionTo('manage settings');
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/v1/settings/' . $setting->id, ['value' => 'new']);

        $response->assertOk()->assertJsonPath('data.value', 'new');
        $this->assertDatabaseHas('settings', ['id' => $setting->id, 'value' => 'new']);
    }

    public function test_destroy_requires_permission()
    {
        $setting = Setting::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->deleteJson('/api/v1/settings/' . $setting->id)->assertForbidden();
    }

    public function test_destroy_deletes_setting_for_authorized_user()
    {
        $setting = Setting::factory()->create();
        $user = User::factory()->create();
        $user->givePermissionTo('manage settings');
        Sanctum::actingAs($user);

        $this->deleteJson('/api/v1/settings/' . $setting->id)->assertNoContent();
        $this->assertDatabaseMissing('settings', ['id' => $setting->id]);
    }
}
