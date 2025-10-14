<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\AnalyticsSnapshot;
use App\Models\Area;
use App\Models\Notification;
use App\Models\Team;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Voter;
use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Committee;
use App\Models\ElectionCircle\Election;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Throwable;

class ArabicDatabaseSeeder extends Seeder
{
    public static array $auditReport = [];

    public function run(): void
    {
        $startedAt = Carbon::now();
        $report = [
            'generated_at' => $startedAt,
            'entities' => [],
            'failed' => [],
            'total_records' => 0,
            'status' => 'success',
        ];

        DB::beginTransaction();

        try {
            $election = Election::query()->firstOrCreate(
                ['name' => 'انتخابات المجلس البلدي ' . Carbon::now()->year],
                [
                    'start_date' => Carbon::now()->startOfYear(),
                    'end_date' => Carbon::now()->endOfYear(),
                ]
            );

            $roles = $this->ensureRoles();

            $users = $this->recordEntity(
                $report,
                'المستخدمون',
                'الأدوار، الفرق',
                function () use ($roles) {
                    $users = User::factory()->count(10)->create();

                    $users->each(function (User $user) use ($roles) {
                        $role = $roles->random();
                        $user->assignRole($role);
                        $user->forceFill(['role_id' => $role->id])->save();
                    });

                    return ['count' => $users->count(), 'data' => $users];
                }
            );

            $areas = $this->recordEntity(
                $report,
                'المناطق الجغرافية',
                'الفرق، الأنشطة',
                function () {
                    $areas = Area::factory()->count(5)->create();

                    return ['count' => $areas->count(), 'data' => $areas];
                }
            );

            $teams = $this->recordEntity(
                $report,
                'الفرق الميدانية',
                'المناطق، المشرفون، المتطوعون',
                function () use ($areas, $users) {
                    $teams = new Collection();

                    for ($index = 0; $index < 5; $index++) {
                        $teams->push(
                            Team::factory()->create([
                                'area_id' => $areas[$index % $areas->count()]->id,
                                'supervisor_id' => $users[$index % $users->count()]->id,
                            ])
                        );
                    }

                    return ['count' => $teams->count(), 'data' => $teams];
                }
            );

            $volunteers = $this->recordEntity(
                $report,
                'المتطوعون',
                'الفرق',
                function () use ($teams) {
                    $volunteers = new Collection();

                    foreach ($teams as $team) {
                        $volunteers = $volunteers->merge(
                            Volunteer::factory()->count(5)->state(['team_id' => $team->id])->create()
                        );
                    }

                    return ['count' => $volunteers->count(), 'data' => $volunteers];
                }
            );

            $geoAreas = $this->recordEntity(
                $report,
                'الدوائر الانتخابية',
                'اللجان',
                function () use ($election) {
                    $geoAreas = GeoArea::factory()->count(5)->for($election)->create();

                    return ['count' => $geoAreas->count(), 'data' => $geoAreas];
                }
            );

            $committees = $this->recordEntity(
                $report,
                'اللجان الانتخابية',
                'الدوائر، الأنشطة',
                function () use ($geoAreas) {
                    $committees = Committee::factory()
                        ->count(20)
                        ->state(fn () => ['geo_area_id' => $geoAreas->random()->id])
                        ->create();

                    return ['count' => $committees->count(), 'data' => $committees];
                }
            );

            $campaigns = $this->recordEntity(
                $report,
                'الحملات الانتخابية',
                'الأنشطة، التحليلات',
                function () use ($election) {
                    $campaigns = Campaign::factory()->count(10)->state([
                        'election_id' => $election->id,
                    ])->create();

                    return ['count' => $campaigns->count(), 'data' => $campaigns];
                }
            );

            $voters = $this->recordEntity(
                $report,
                'الناخبون',
                'المناطق، الأنشطة',
                function () {
                    $voters = Voter::factory()->count(200)->create();

                    return ['count' => $voters->count(), 'data' => $voters];
                }
            );

            $activities = $this->recordEntity(
                $report,
                'الأنشطة الميدانية',
                'المستخدمون، اللجان، الحملات، الناخبون',
                function () use ($areas, $users, $committees, $campaigns, $voters) {
                    $activities = Activity::factory()
                        ->count(50)
                        ->state(fn () => [
                            'area_id' => $areas->random()->id,
                            'committee_id' => $committees->random()->id,
                            'created_by' => $users->random()->id,
                            'campaign_id' => $campaigns->random()->id,
                            'voter_id' => $voters->random()->id,
                        ])
                        ->create();

                    return ['count' => $activities->count(), 'data' => $activities];
                }
            );

            $notifications = $this->recordEntity(
                $report,
                'الإشعارات',
                'المستخدمون',
                function () use ($users) {
                    $notifications = Notification::factory()
                        ->count(30)
                        ->state(fn () => ['user_id' => $users->random()->id])
                        ->create();

                    return ['count' => $notifications->count(), 'data' => $notifications];
                }
            );

            $this->recordEntity(
                $report,
                'لقطات التحليلات',
                'الحملات، الانتخابات',
                function () use ($campaigns, $election) {
                    $snapshots = new Collection();
                    $metrics = ['turnout_trend', 'support_index', 'engagement_score'];

                    foreach ($campaigns as $campaign) {
                        foreach ($metrics as $offset => $metric) {
                            $snapshots->push(
                                AnalyticsSnapshot::factory()->create([
                                    'campaign_id' => $campaign->id,
                                    'election_id' => $election->id,
                                    'metric_key' => $metric,
                                    'snapshot_date' => Carbon::now()->subDays($offset + ($campaign->id % 7)),
                                ])
                            );
                        }
                    }

                    return ['count' => $snapshots->count(), 'data' => $snapshots];
                }
            );

            DB::commit();
        } catch (Throwable $exception) {
            DB::rollBack();
            report($exception);

            $report['status'] = 'failed';
            $report['failed'][] = [
                'label' => 'قاعدة البيانات',
                'message' => $exception->getMessage(),
            ];
        }

        $report['completed_at'] = Carbon::now();
        $report['duration_seconds'] = $report['completed_at']->diffInSeconds($startedAt);

        static::$auditReport = $report;
    }

    private function ensureRoles(): Collection
    {
        $roleNames = ['مشرف عام', 'منسق ميداني', 'محلل بيانات'];

        return collect($roleNames)->map(function (string $name) {
            return Role::query()->firstOrCreate([
                'name' => $name,
                'guard_name' => 'web',
            ]);
        });
    }

    private function recordEntity(array &$report, string $label, string $relationships, callable $callback)
    {
        try {
            $result = $callback();
            $count = (int) ($result['count'] ?? 0);
            $data = $result['data'] ?? null;

            $report['entities'][] = [
                'label' => $label,
                'count' => $count,
                'relationships' => $relationships,
                'status' => 'success',
            ];

            $report['total_records'] += $count;

            return $data instanceof Collection ? $data : collect($data);
        } catch (Throwable $exception) {
            report($exception);

            $report['status'] = $report['status'] === 'failed' ? 'failed' : 'partial';
            $report['failed'][] = [
                'label' => $label,
                'message' => $exception->getMessage(),
            ];

            $report['entities'][] = [
                'label' => $label,
                'count' => 0,
                'relationships' => $relationships,
                'status' => 'failed',
            ];

            return collect();
        }
    }
}
