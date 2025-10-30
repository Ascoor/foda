<?php

namespace Tests\Feature;

use App\Enums\MembershipScopeType;
use App\Models\Campaign;
use App\Models\Membership;
use App\Models\User;
use Database\Seeders\DemoElectionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ElectionScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_campaign_viewer_only_sees_assigned_campaign_elections(): void
    {
        $this->seed(DemoElectionSeeder::class);

        /** @var User $viewer */
        $viewer = User::where('email', 'viewer@example.com')->firstOrFail();
        $membership = Membership::where('user_id', $viewer->id)
            ->where('scope_type', MembershipScopeType::Campaign->value)
            ->firstOrFail();

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => $viewer->email,
            'password' => 'password',
        ]);

        $token = $login->json('token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/campaigns/' . $membership->scope_id . '/elections');

        $response->assertOk();

        $elections = $response->json();
        $this->assertGreaterThanOrEqual(2, count($elections));

        foreach ($elections as $election) {
            $this->assertEquals($membership->scope_id, $election['campaign']['id']);
        }

        $otherCampaign = Campaign::where('id', '!=', $membership->scope_id)->first();
        if ($otherCampaign) {
            $this->withHeader('Authorization', 'Bearer ' . $token)
                ->getJson('/api/v1/campaigns/' . $otherCampaign->id . '/elections')
                ->assertForbidden();
        }
    }
}
