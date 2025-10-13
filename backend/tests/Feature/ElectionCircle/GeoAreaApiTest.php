<?php

namespace Tests\Feature\ElectionCircle;

use App\Models\ElectionCircle\Election;
use App\Models\ElectionCircle\GeoArea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class GeoAreaApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['cache.default' => 'array']);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    protected function authenticateUser(): User
    {
        $role = Role::create(['name' => 'admin', 'guard_name' => 'web']);

        $user = User::factory()->create();
        $user->assignRole($role);

        Sanctum::actingAs($user);

        return $user;
    }

    public function test_index_response_is_cached_and_cleared_after_mutations(): void
    {
        $this->authenticateUser();
        Cache::flush();

        $election = Election::create(['name' => 'General Election']);

        GeoArea::create([
            'name' => 'North District',
            'election_id' => $election->id,
        ]);

        $firstResponse = $this->getJson('/api/v1/ec/geo-areas');
        $firstResponse->assertOk()->assertJsonCount(1);

        $registry = Cache::get('ec.geo-areas.index.keys', []);
        $this->assertIsArray($registry);
        $this->assertNotEmpty($registry);

        GeoArea::create([
            'name' => 'South District',
            'election_id' => $election->id,
        ]);

        $secondResponse = $this->getJson('/api/v1/ec/geo-areas');
        $secondResponse->assertOk()->assertJsonCount(1);

        $this->postJson('/api/v1/ec/geo-areas', [
            'name' => 'East District',
            'election_id' => $election->id,
        ])->assertCreated()->assertJsonPath('data.name', 'East District');

        $this->assertSame([], Cache::get('ec.geo-areas.index.keys', []));

        $thirdResponse = $this->getJson('/api/v1/ec/geo-areas');
        $thirdResponse->assertOk()->assertJsonCount(3);
    }
}
