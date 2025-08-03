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

    public function test_get_by_key_returns_setting()
    {
        Sanctum::actingAs(User::factory()->create());
        $setting = Setting::factory()->create(['key' => 'APP_NAME']);

        $response = $this->getJson('/api/v1/settings/key/APP_NAME');

        $response->assertOk()->assertJsonPath('data.id', $setting->id);
    }


    public function test_bulk_update_requires_permission()
    {
        Sanctum::actingAs(User::factory()->create());
        Setting::factory()->create(['key' => 'site_name']);

        $this->putJson('/api/v1/settings', ['site_name' => 'New'])->assertForbidden();
    }

    public function test_bulk_update_modifies_settings_for_authorized_user()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('manage settings');
        Sanctum::actingAs($user);

        Setting::factory()->create(['key' => 'site_name', 'value' => 'Old']);

        $response = $this->putJson('/api/v1/settings', ['site_name' => 'New']);

        $response->assertOk()->assertJsonPath('data.0.value', 'New');
        $this->assertDatabaseHas('settings', ['key' => 'site_name', 'value' => 'New']);
    }
}
