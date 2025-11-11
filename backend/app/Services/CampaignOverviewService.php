<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Activity;
use App\Models\Agent;
use App\Models\Area;
use App\Models\Campaign;
use App\Models\Candidate;
use App\Models\Committee;
use App\Models\Event;
use App\Models\Team;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class CampaignOverviewService
{
    public function build(?Campaign $campaign, array $context = []): array
    {
        $campaignId = $campaign?->getKey() ?? ($context['campaign_id'] ?? null);
        $from = $context['from'] instanceof Carbon ? $context['from'] : ($context['from'] ? Carbon::parse($context['from']) : null);
        $to = $context['to'] instanceof Carbon ? $context['to'] : ($context['to'] ? Carbon::parse($context['to']) : null);

        $campaignModel = $campaign ?? ($campaignId ? Campaign::query()->with('areas:id,name,level')->find($campaignId) : null);

        $activityQuery = Activity::query()->orderByDesc('reported_at')->orderByDesc('created_at');
        $volunteerQuery = Volunteer::query()->with(['team:id,name', 'area:id,name']);
        $teamQuery = Team::query()->with(['area:id,name'])->withCount('volunteers');
        $committeeQuery = Committee::query()->with(['area:id,name'])->withCount('voters');
        $eventQuery = Event::query()->with(['area:id,name', 'team:id,name']);
        $candidateQuery = Candidate::query();
        $agentQuery = Agent::query()->with(['candidate:id,name,party', 'committee:id,name']);
        $voterQuery = Voter::query()->with(['area:id,name', 'committee:id,name']);

        if ($campaignId) {
            $activityQuery->forCampaign($campaignId);
            $volunteerQuery->forCampaign($campaignId);
            $teamQuery->forCampaign($campaignId);
            $committeeQuery->forCampaign($campaignId);
            $eventQuery->forCampaign($campaignId);
            $candidateQuery->forCampaign($campaignId);
            $agentQuery->forCampaign($campaignId);
            $voterQuery->forCampaign($campaignId);
        }

        if ($from) {
            $voterQuery->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $voterQuery->whereDate('created_at', '<=', $to);
        }

        $activities = $activityQuery->limit(6)->get();

        $volunteerCount = (clone $volunteerQuery)->count();
        $activeVolunteers = (clone $volunteerQuery)
            ->whereDate('updated_at', '>=', Carbon::now()->subDays(30))
            ->count();
        $volunteerSample = (clone $volunteerQuery)
            ->latest('updated_at')
            ->limit(6)
            ->get();

        $teamCollection = (clone $teamQuery)->get();
        $teamCount = $teamCollection->count();
        $teamsWithSupervisor = $teamCollection->whereNotNull('supervisor_id')->count();
        $teamTop = $teamCollection->sortByDesc('volunteers_count')->take(3);

        $committeeCollection = (clone $committeeQuery)->get();
        $committeeCount = $committeeCollection->count();
        $committeeTop = $committeeCollection->sortByDesc('voters_count')->take(3);

        $committeeDistribution = $committeeCollection
            ->groupBy('area_id')
            ->map(function (Collection $group) {
                return [
                    'area_id' => $group->first()?->area_id,
                    'area_name' => $group->first()?->area?->name,
                    'committees' => $group->count(),
                    'voters' => $group->sum('voters_count'),
                ];
            })
            ->sortByDesc('committees')
            ->values()
            ->take(5)
            ->all();

        $eventCollection = (clone $eventQuery)->get();
        $eventCount = $eventCollection->count();
        $upcomingEvents = $eventCollection
            ->filter(fn (Event $event) => optional($event->starts_at)->isAfter(Carbon::now()))
            ->sortBy(fn (Event $event) => $event->starts_at)
            ->take(5)
            ->values();
        $recentEvents = $eventCollection
            ->reject(fn (Event $event) => optional($event->starts_at)->isAfter(Carbon::now()))
            ->sortByDesc(fn (Event $event) => $event->starts_at ?? $event->created_at)
            ->take(5)
            ->values();

        $candidateCollection = (clone $candidateQuery)->get();
        $candidateCount = $candidateCollection->count();

        $agentCollection = (clone $agentQuery)->get();
        $agentCount = $agentCollection->count();
        $assignedAgents = $agentCollection->whereNotNull('committee_id')->count();
        $agentByCommittee = $agentCollection->groupBy('committee_id')->map->count();
        $agentByCandidate = $agentCollection->groupBy('candidate_id')->map->count();

        $voterCount = (clone $voterQuery)->count();
        $latestVoters = (clone $voterQuery)->latest('created_at')->limit(5)->get();

        $registrations = $this->buildRegistrationSeries((clone $voterQuery));

        $candidateData = $this->transformCandidates($candidateCollection, $agentCount, $agentByCandidate, $voterCount);

        $volunteerCoverage = $voterCount > 0 ? round(($volunteerCount / $voterCount) * 100, 1) : null;
        $agentCoverage = $committeeCount > 0 ? round(($assignedAgents / max(1, $committeeCount)) * 100, 1) : null;
        $averageTeamSize = $teamCount > 0 ? round($teamCollection->avg('volunteers_count'), 1) : null;
        $areaCount = $campaignModel?->areas()->count() ?? Area::count();

        $geographyAssignedAreas = $campaignModel
            ? $campaignModel->areas()->limit(6)->get(['areas.id', 'areas.name', 'areas.level'])
            : Area::query()->limit(6)->get(['id', 'name', 'level']);

        $teamActors = $this->mergeActors($volunteerSample, $agentCollection->take(6));

        $progress = $this->buildProgressMetrics(
            $voterCount,
            $volunteerCount,
            $committeeCount,
            $eventCount,
            $activities->count()
        );

        $activityFeed = $activities
            ->map(function (Activity $activity) {
                $timestamp = $activity->reported_at ?? $activity->created_at ?? Carbon::now();

                return [
                    'id' => $activity->getKey(),
                    'type' => $activity->type,
                    'title' => $activity->title,
                    'time' => $timestamp?->toIso8601String(),
                ];
            })
            ->values();

        $turnoutSeries = $activities
            ->filter(fn (Activity $activity) => $activity->support_score !== null)
            ->sortBy(fn (Activity $activity) => $activity->reported_at ?? $activity->created_at)
            ->values()
            ->map(fn (Activity $activity) => (int) $activity->support_score)
            ->take(12)
            ->all();

        $campaignInfo = $campaignModel ? [
            'id' => $campaignModel->getKey(),
            'name' => $campaignModel->name,
            'status' => $campaignModel->status,
            'spatial_level' => $campaignModel->spatial_level,
            'timeframe' => [
                'starts_at' => optional($campaignModel->starts_at)?->toIso8601String(),
                'ends_at' => optional($campaignModel->ends_at)?->toIso8601String(),
            ],
        ] : null;

        $owner = $campaignModel
            ? $campaignModel->users()
                ->wherePivot('role', 'owner')
                ->select(['users.id', 'users.name', 'users.email'])
                ->first()
            : null;

        $settings = $campaignModel?->settings ?? [];
        $featureFlags = array_keys(array_filter((array) ($settings['features'] ?? [])));

        $committeesWithAgents = $agentCollection->whereNotNull('committee_id')->unique('committee_id')->count();

        $sections = [
            'events' => [
                'total' => $eventCount,
                'upcoming' => $upcomingEvents->map(fn (Event $event) => $this->transformEvent($event))->all(),
                'recent' => $recentEvents->map(fn (Event $event) => $this->transformEvent($event))->all(),
            ],
            'committees' => [
                'total' => $committeeCount,
                'with_assignments' => $committeesWithAgents,
                'without_assignments' => max(0, $committeeCount - $committeesWithAgents),
                'top' => $committeeTop
                    ->map(function (Committee $committee) use ($agentByCommittee) {
                        $agentCount = $agentByCommittee->get($committee->getKey(), 0);

                        return [
                            'id' => $committee->getKey(),
                            'name' => $committee->name,
                            'code' => $committee->code,
                            'area' => $committee->area ? [
                                'id' => $committee->area->getKey(),
                                'name' => $committee->area->name,
                            ] : null,
                            'voters_count' => $committee->voters_count,
                            'agents_count' => $agentCount,
                        ];
                    })
                    ->values()
                    ->all(),
                'distribution' => $committeeDistribution,
            ],
            'geography' => [
                'total_areas' => $areaCount,
                'assigned' => $geographyAssignedAreas
                    ->map(fn (Area $area) => [
                        'id' => $area->getKey(),
                        'name' => $area->name,
                        'level' => $area->level,
                    ])
                    ->all(),
                'coverage' => [
                    'volunteer_to_voter_ratio' => $volunteerCoverage,
                    'agent_to_committee_ratio' => $agentCoverage,
                    'teams_per_area' => $areaCount > 0 ? round($teamCount / $areaCount, 1) : null,
                ],
            ],
            'team' => [
                'teams' => [
                    'total' => $teamCount,
                    'with_supervisors' => $teamsWithSupervisor,
                    'average_size' => $averageTeamSize,
                    'top' => $teamTop
                        ->map(function (Team $team) {
                            return [
                                'id' => $team->getKey(),
                                'name' => $team->name,
                                'area' => $team->area ? [
                                    'id' => $team->area->getKey(),
                                    'name' => $team->area->name,
                                ] : null,
                                'volunteers_count' => $team->volunteers_count,
                            ];
                        })
                        ->values()
                        ->all(),
                ],
                'volunteers' => [
                    'total' => $volunteerCount,
                    'active' => $activeVolunteers,
                    'coverage_ratio' => $volunteerCoverage,
                    'sample' => $volunteerSample
                        ->map(fn (Volunteer $volunteer) => $this->transformVolunteer($volunteer))
                        ->all(),
                ],
                'agents' => [
                    'total' => $agentCount,
                    'assigned' => $assignedAgents,
                    'coverage_ratio' => $agentCoverage,
                    'sample' => $agentCollection
                        ->take(6)
                        ->map(fn (Agent $agent) => $this->transformAgent($agent))
                        ->all(),
                ],
                'actors' => $teamActors,
            ],
            'settings' => [
                'updated_at' => $campaignModel?->updated_at?->toIso8601String(),
                'flags' => $featureFlags,
                'channels' => Arr::wrap($settings['communication']['channels'] ?? []),
                'owner' => $owner ? [
                    'id' => $owner->getKey(),
                    'name' => $owner->name,
                    'email' => $owner->email,
                ] : null,
                'raw' => $settings,
            ],
            'voters' => [
                'total' => $voterCount,
                'registrations' => $registrations,
                'latest' => $latestVoters
                    ->map(function (Voter $voter) {
                        return [
                            'id' => $voter->getKey(),
                            'name' => $voter->full_name,
                            'committee' => $voter->committee ? [
                                'id' => $voter->committee->getKey(),
                                'name' => $voter->committee->name,
                            ] : null,
                            'registered_at' => optional($voter->created_at)?->toIso8601String(),
                        ];
                    })
                    ->all(),
                'by_committee' => $committeeDistribution,
            ],
            'candidates' => $candidateData,
        ];

        $metrics = [
            'events' => $eventCount,
            'committees' => $committeeCount,
            'areas' => $areaCount,
            'teams' => $teamCount,
            'volunteers' => $volunteerCount,
            'agents' => $agentCount,
            'voters' => $voterCount,
            'candidates' => $candidateCount,
        ];

        $stats = [
            'total_elections' => [
                'value' => Campaign::count(),
            ],
            'active_voters' => [
                'value' => $voterCount,
            ],
            'total_candidates' => [
                'value' => $candidateCount,
            ],
            'committees_count' => [
                'value' => $committeeCount,
            ],
        ];

        return [
            'campaign' => $campaignInfo,
            'metrics' => $metrics,
            'sections' => $sections,
            'stats' => $stats,
            'progress' => $progress,
            'activities' => $activityFeed,
            'turnout' => $turnoutSeries,
        ];
    }

    protected function transformEvent(Event $event): array
    {
        return [
            'id' => $event->getKey(),
            'title' => $event->title,
            'starts_at' => optional($event->starts_at)?->toIso8601String(),
            'ends_at' => optional($event->ends_at)?->toIso8601String(),
            'area' => $event->area ? [
                'id' => $event->area->getKey(),
                'name' => $event->area->name,
            ] : null,
            'team' => $event->team ? [
                'id' => $event->team->getKey(),
                'name' => $event->team->name,
            ] : null,
        ];
    }

    protected function transformVolunteer(Volunteer $volunteer): array
    {
        return [
            'id' => $volunteer->getKey(),
            'type' => 'volunteer',
            'name' => trim($volunteer->first_name . ' ' . $volunteer->last_name),
            'team' => $volunteer->team ? [
                'id' => $volunteer->team->getKey(),
                'name' => $volunteer->team->name,
            ] : null,
            'area' => $volunteer->area ? [
                'id' => $volunteer->area->getKey(),
                'name' => $volunteer->area->name,
            ] : null,
            'contact' => [
                'phone' => $volunteer->phone,
                'email' => $volunteer->email,
            ],
            'tags' => $volunteer->tags ?? [],
            'meta' => $volunteer->meta ?? [],
            'updated_at' => optional($volunteer->updated_at)?->toIso8601String(),
        ];
    }

    protected function transformAgent(Agent $agent): array
    {
        return [
            'id' => $agent->getKey(),
            'type' => 'agent',
            'name' => $agent->full_name,
            'candidate' => $agent->candidate ? [
                'id' => $agent->candidate->getKey(),
                'name' => $agent->candidate->name,
            ] : null,
            'committee' => $agent->committee ? [
                'id' => $agent->committee->getKey(),
                'name' => $agent->committee->name,
            ] : null,
            'contact' => [
                'phone' => $agent->phone,
            ],
            'meta' => $agent->meta ?? [],
            'updated_at' => optional($agent->updated_at)?->toIso8601String(),
        ];
    }

    protected function mergeActors(Collection $volunteers, Collection $agents): array
    {
        return $volunteers
            ->map(fn (Volunteer $volunteer) => $this->transformVolunteer($volunteer))
            ->merge($agents->map(fn (Agent $agent) => $this->transformAgent($agent)))
            ->sortBy('name')
            ->values()
            ->all();
    }

    protected function buildRegistrationSeries(Builder $voterQuery): array
    {
        return $voterQuery
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'count' => (int) $row->count,
            ])
            ->all();
    }

    protected function transformCandidates(Collection $candidates, int $totalAgents, Collection $agentByCandidate, int $voterCount): array
    {
        $featuredModel = $candidates
            ->firstWhere(fn (Candidate $candidate) => data_get($candidate->meta, 'featured') === true)
            ?? $candidates->first();

        $list = $candidates
            ->map(function (Candidate $candidate) use ($totalAgents, $agentByCandidate, $voterCount) {
                $meta = $candidate->meta ?? [];
                $agentShare = $totalAgents > 0
                    ? round((($agentByCandidate->get($candidate->getKey(), 0) ?? 0) / $totalAgents) * 100, 1)
                    : null;
                $supportScore = data_get($meta, 'support.score');
                $percentage = data_get($meta, 'results.percentage', $supportScore ?? $agentShare);
                $projectedVotes = data_get($meta, 'results.total_votes');
                if ($projectedVotes === null && $percentage !== null && $voterCount > 0) {
                    $projectedVotes = (int) round(($percentage / 100) * $voterCount);
                }

                $photo = data_get($meta, 'photo_url')
                    ?? data_get($meta, 'media.photo')
                    ?? 'https://ui-avatars.com/api/?name=' . urlencode($candidate->name) . '&background=312e81&color=ffffff';

                return [
                    'id' => $candidate->getKey(),
                    'name' => $candidate->name,
                    'party' => $candidate->party,
                    'slogan' => data_get($meta, 'slogan'),
                    'photo_url' => $photo,
                    'support' => $supportScore ?? $percentage,
                    'results' => [
                        'total_votes' => $projectedVotes,
                        'percentage' => $percentage,
                    ],
                    'media' => data_get($meta, 'media', []),
                ];
            })
            ->values();

        $featured = $featuredModel
            ? $list->firstWhere(fn ($candidate) => $candidate['id'] === $featuredModel->getKey())
            : $list->first();

        return [
            'total' => $list->count(),
            'featured' => $featured,
            'list' => $list->all(),
            'metrics' => [
                'support_average' => $list->avg(fn ($candidate) => data_get($candidate, 'support')),
                'last_updated' => Carbon::now()->toIso8601String(),
            ],
        ];
    }

    protected function buildProgressMetrics(
        int $voterCount,
        int $volunteerCount,
        int $committeeCount,
        int $eventCount,
        int $activityCount
    ): array {
        $registration = $voterCount > 0 ? min(100, ($voterCount / max(500, $voterCount)) * 100) : 0;
        $verification = min(100, $volunteerCount * 5);
        $campaignProgress = min(100, $eventCount * 8 + $committeeCount * 3);
        $votingMomentum = min(100, $activityCount * 10 + ($volunteerCount * 2));

        $overall = round(min(100, ($registration + $verification + $campaignProgress + $votingMomentum) / 4), 1);

        return [
            'registration' => round($registration, 1),
            'verification' => round($verification, 1),
            'campaign' => round($campaignProgress, 1),
            'voting' => round($votingMomentum, 1),
            'overall' => $overall,
            'remaining' => max(0, round(100 - $overall, 1)),
        ];
    }
}
