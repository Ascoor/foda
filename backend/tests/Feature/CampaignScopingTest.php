<?php

namespace Tests\Feature;

use App\Enums\MembershipScopeType;
use App\Models\Membership;
use App\Models\User;
use Database\Seeders\DemoElectionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CampaignScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_sees_campaigns_for_area_scope(): void
    {
        $this->seed(DemoElectionSeeder::class);

        /** @var User $manager */
        $manager = User::where('email', 'manager@example.com')->firstOrFail();
        $login = $this->postJson('/api/v1/auth/login', [
            'email' => $manager->email,
            'password' => 'password',
        ]);

        $token = $login->json('token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/campaigns');

        $response->assertOk();

        $campaigns = $response->json('data');
        $this->assertCount(5, $campaigns);

        $membershipArea = Membership::where('user_id', $manager->id)
            ->where('scope_type', MembershipScopeType::Area->value)
            ->first();

        $this->assertNotNull($membershipArea);
        foreach ($campaigns as $campaign) {
            $this->assertEquals($membershipArea->scope_id, $campaign['area']['id']);
        }
    }
}
