<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Agent;
use App\Models\AnalyticsSnapshot;
use App\Models\Area;
use App\Models\AutomationTask;
use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use App\Models\Committee;
use App\Models\Event;
use App\Models\ExpenseCategory;
use App\Models\Finance;
use App\Models\GeoArea;
use App\Models\Notification;
use App\Models\Observation;
use App\Models\Sms;
use App\Models\Swot;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $campaign = Campaign::query()->first() ?? Campaign::factory()->create();

        $staff = User::factory()
            ->count(5)
            ->state([
                'status' => 'active',
            ])
            ->create();

        $campaign->users()->syncWithoutDetaching($staff->mapWithKeys(
            static fn (User $user, int $index): array => [
                $user->id => [
                    'role' => match (true) {
                        $index === 0 => 'campaign-admin',
                        $index <= 2 => 'campaign-staff',
                        default => 'campaign-viewer',
                    },
                    'status' => 'active',
                ],
            ]
        )->all());

        CampaignPollingDay::factory()->count(2)->state([
            'campaign_id' => $campaign->id,
        ])->create();

        $areas = Area::factory()->count(3)->create();

        $teams = Team::factory()
            ->count(3)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'supervisor_id' => $staff->random()->id,
                'area_id' => $areas->random()->id,
            ])
            ->create();

        $geoAreas = GeoArea::factory()
            ->count(3)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'election_id' => $campaign->election_id,
            ])
            ->create();

        $committees = Committee::factory()
            ->count(3)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'geo_area_id' => $geoAreas->random()->id,
            ])
            ->create();

        $volunteers = Volunteer::factory()
            ->count(18)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'team_id' => $teams->random()->id,
            ])
            ->create();

        $voters = Voter::factory()
            ->count(40)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'committee_id' => $committees->random()->id,
                'area_id' => $areas->random()->id,
            ])
            ->create();

        Agent::factory()
            ->count(5)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'committee_id' => $committees->random()->id,
                'person_id' => $volunteers->random()->id,
            ])
            ->create();

        Event::factory()
            ->count(6)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'area_id' => $areas->random()->id,
                'team_id' => $teams->random()->id,
            ])
            ->create();

        $categories = ExpenseCategory::query()->where('campaign_id', $campaign->id)->pluck('id');

        Finance::factory()
            ->count(12)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'category_id' => $categories->random(),
            ])
            ->create();

        Activity::factory()
            ->count(20)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'area_id' => $areas->random()->id,
                'committee_id' => $committees->random()->id,
                'voter_id' => $voters->random()->id,
                'created_by' => $staff->random()->id,
            ])
            ->create();

        AutomationTask::factory()
            ->count(4)
            ->state(fn () => ['campaign_id' => $campaign->id])
            ->create();

        AnalyticsSnapshot::factory()
            ->count(5)
            ->state(fn () => ['campaign_id' => $campaign->id, 'election_id' => $campaign->election_id])
            ->create();

        Notification::factory()
            ->count(6)
            ->state(fn () => ['campaign_id' => $campaign->id])
            ->create();

        Sms::factory()
            ->count(8)
            ->state(fn () => ['campaign_id' => $campaign->id])
            ->create();

        Observation::factory()
            ->count(5)
            ->state(fn () => ['campaign_id' => $campaign->id])
            ->create();

        Swot::factory()
            ->count(3)
            ->state(fn () => [
                'campaign_id' => $campaign->id,
                'entity_type' => Team::class,
                'entity_id' => $teams->random()->id,
            ])
            ->create();
    }
}
