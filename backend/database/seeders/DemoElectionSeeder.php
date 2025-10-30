<?php

namespace Database\Seeders;

use App\Enums\CampaignStatus;
use App\Enums\ElectionPhase;
use App\Enums\MembershipRole;
use App\Enums\MembershipScopeType;
use App\Models\Area;
use App\Models\Campaign;
use App\Models\Election;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoElectionSeeder extends Seeder
{
    private const CAMPAIGN_COVERS = [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ];

    private const ELECTION_COVERS = [
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6',
        'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2',
        'https://images.unsplash.com/photo-1528747045269-390fe33c19d4',
    ];

    public function run(): void
    {
        DB::transaction(function () {
            [$admin, $manager, $viewer] = $this->seedUsers();
            $parents = $this->seedAreas();

            $allCampaigns = collect();
            foreach ($parents as $parent) {
                foreach ($parent->children as $child) {
                    $campaigns = $this->seedCampaignsForArea($child, Arr::random([$admin->id, $manager->id]));
                    $allCampaigns = $allCampaigns->merge($campaigns);
                }
            }

            $this->seedMemberships($admin, $manager, $viewer, $parents, $allCampaigns);
        });
    }

    private function seedUsers(): array
    {
        $users = [
            [
                'name' => 'Admin Lead',
                'email' => 'admin@example.com',
            ],
            [
                'name' => 'Area Manager',
                'email' => 'manager@example.com',
            ],
            [
                'name' => 'Campaign Viewer',
                'email' => 'viewer@example.com',
            ],
        ];

        return collect($users)
            ->map(function (array $data) {
                return User::updateOrCreate(
                    ['email' => $data['email']],
                    array_merge($data, [
                        'password' => Hash::make('password'),
                        'email_verified_at' => now(),
                    ])
                );
            })
            ->all();
    }

    /**
     * @return \Illuminate\Support\Collection<int, Area>
     */
    private function seedAreas()
    {
        $parentAreas = collect([
            ['name' => 'محافظة القاهرة', 'code' => 'Cairo'],
            ['name' => 'محافظة الإسكندرية', 'code' => 'Alex'],
        ])->map(function (array $parentData) {
            return Area::updateOrCreate(
                ['code' => Str::upper($parentData['code'])],
                [
                    'name' => $parentData['name'],
                    'description' => 'منطقة إشراف انتخابي',
                ]
            );
        });

        $childNames = [
            'Cairo' => ['مصر الجديدة', 'حلوان', 'المطرية', 'المعادي'],
            'Alex' => ['سيدي بشر', 'العصافرة', 'المنشية', 'العامرية'],
        ];

        foreach ($parentAreas as $parent) {
            foreach ($childNames[Str::title(strtolower($parent->code))] ?? [] as $index => $name) {
                Area::updateOrCreate(
                    ['code' => Str::upper($parent->code . ($index + 1))],
                    [
                        'name' => $name,
                        'parent_id' => $parent->id,
                        'description' => 'وحدة فرعية لإدارة الحملة',
                    ]
                );
            }

            $parent->load('children');
        }

        return $parentAreas->map(fn (Area $area) => $area->fresh(['children']));
    }

    private function seedCampaignsForArea(Area $area, int $ownerId)
    {
        $statuses = CampaignStatus::cases();

        return collect(range(1, 5))->map(function (int $idx) use ($area, $ownerId, $statuses) {
            $status = $statuses[array_rand($statuses)];
            $campaign = Campaign::updateOrCreate(
                ['area_id' => $area->id, 'name' => $area->name . ' حملة ' . $idx],
                [
                    'owner_id' => $ownerId,
                    'cover_url' => Arr::random(self::CAMPAIGN_COVERS),
                    'status' => $status->value,
                ]
            );

            $this->seedElectionsForCampaign($campaign);

            return $campaign;
        });
    }

    private function seedElectionsForCampaign(Campaign $campaign): void
    {
        $phases = ElectionPhase::cases();
        $electionCount = random_int(2, 4);

        for ($i = 1; $i <= $electionCount; $i++) {
            $phase = $phases[array_rand($phases)];
            $start = now()->addDays(random_int(-30, 90));
            $end = $start->copy()->addDays(random_int(3, 10));

            Election::updateOrCreate(
                [
                    'campaign_id' => $campaign->id,
                    'name' => $campaign->name . ' - جولة ' . $i,
                ],
                [
                    'cover_url' => Arr::random(self::ELECTION_COVERS),
                    'phase' => $phase->value,
                    'start_at' => $start,
                    'end_at' => $end,
                ]
            );
        }
    }

    private function seedMemberships(User $admin, User $manager, User $viewer, $parentAreas, $campaigns): void
    {
        foreach ($parentAreas as $area) {
            Membership::updateOrCreate(
                [
                    'user_id' => $admin->id,
                    'scope_type' => MembershipScopeType::Area->value,
                    'scope_id' => $area->id,
                ],
                ['role' => MembershipRole::Admin->value]
            );
        }

        $managedArea = $parentAreas->first()?->children->first();
        if ($managedArea) {
            Membership::updateOrCreate(
                [
                    'user_id' => $manager->id,
                    'scope_type' => MembershipScopeType::Area->value,
                    'scope_id' => $managedArea->id,
                ],
                ['role' => MembershipRole::Manager->value]
            );
        }

        $viewCampaign = $campaigns->first();
        if ($viewCampaign) {
            Membership::updateOrCreate(
                [
                    'user_id' => $viewer->id,
                    'scope_type' => MembershipScopeType::Campaign->value,
                    'scope_id' => $viewCampaign->id,
                ],
                ['role' => MembershipRole::Viewer->value]
            );
        }
    }
}
