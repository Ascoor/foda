<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\AnalyticsSnapshot;
use App\Models\Campaign;
use App\Models\Committee;
use App\Models\Team;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $scope = $request->input('scope', 'campaign');
        $campaignId = $this->resolveCampaignId($request);

        $activitiesQuery = Activity::query()->with(['area:id,name']);
        if ($campaignId) {
            $activitiesQuery->forCampaign($campaignId);
        }

        if ($request->filled('from')) {
            $activitiesQuery->whereDate('reported_at', '>=', Carbon::parse($request->input('from')));
        }

        if ($request->filled('to')) {
            $activitiesQuery->whereDate('reported_at', '<=', Carbon::parse($request->input('to')));
        }

        $activities = $activitiesQuery->get();

        $volunteerQuery = Volunteer::query();
        $teamQuery = Team::query()->with('area:id,name')->withCount('volunteers');
        $voterQuery = Voter::query();
        if ($campaignId) {
            $volunteerQuery->forCampaign($campaignId);
            $teamQuery->forCampaign($campaignId);
            $voterQuery->forCampaign($campaignId);
        }

        $teams = $teamQuery->get();
        $volunteerCount = $volunteerQuery->count();
        $voterCount = $voterQuery->count();

        $regions = $this->buildRegionMetrics($activities, $teams, $campaignId);
        $supportTrends = $this->buildSupportTrends($activities);
        $distribution = $this->buildReportDistribution($activities);

        $supportAverage = (float) $activities->avg('support_score');
        $reportsToday = $activities->filter(function (Activity $activity) {
            return optional($activity->reported_at)->isToday();
        })->count();

        $targetTurnoutBase = max($voterCount, 1);
        $turnoutEstimate = min(100, (($reportsToday * 2) + ($volunteerCount * 1.5)) / $targetTurnoutBase * 100);

        $targetCoverage = max(1, ($regions->count() ?: 1) * 10);
        $coverageProgress = $volunteerCount / $targetCoverage * 100;
        $coverageGap = max(0, 100 - min(100, $coverageProgress));

        $payload = [
            'scope' => $scope,
            'scope_uuid' => $campaignId ? (string) $campaignId : 'global',
            'generated_at' => now()->toIso8601String(),
            'summary' => [
                'support_percentage' => round($supportAverage, 1),
                'turnout_estimate' => round($turnoutEstimate, 1),
                'coverage_gap' => round($coverageGap, 1),
            ],
            'regions' => $regions->values()->all(),
            'support_trends' => $supportTrends->values()->all(),
            'report_distribution' => $distribution->values()->all(),
        ];

        return response()->json(['data' => $payload]);
    }

    public function forecast(Request $request): JsonResponse
    {
        $campaignId = $this->resolveCampaignId($request);
        $limit = max(1, min((int) $request->input('limit', 30), 100));

        $query = AnalyticsSnapshot::query()->orderByDesc('snapshot_date');
        if ($campaignId) {
            $query->where('campaign_id', $campaignId);
        }

        $snapshots = $query->limit($limit)->get()->map(function (AnalyticsSnapshot $snapshot) {
            return [
                'id' => $snapshot->getKey(),
                'campaign_id' => $snapshot->campaign_id,
                'election_id' => $snapshot->election_id,
                'metric_key' => $snapshot->metric_key,
                'snapshot_date' => optional($snapshot->snapshot_date)->toDateString(),
                'payload' => $snapshot->payload ?? [],
                'forecast_value' => $snapshot->forecast_value,
            ];
        });

        return response()->json(['data' => $snapshots]);
    }

    protected function resolveCampaignId(Request $request): ?int
    {
        $routeCampaign = $request->route('campaign');
        if ($routeCampaign instanceof Campaign) {
            return (int) $routeCampaign->getKey();
        }

        if ($request->filled('campaign_id')) {
            return (int) $request->input('campaign_id');
        }

        if ($request->filled('scope_uuid')) {
            return (int) $request->input('scope_uuid');
        }

        return Campaign::query()->value('id');
    }

    protected function buildRegionMetrics($activities, $teams, ?int $campaignId)
    {
        $teamCounts = $teams->groupBy('area_id')->map(function ($group) {
            return [
                'volunteers' => $group->sum('volunteers_count'),
                'area' => $group->first()->area,
            ];
        });

        $activitiesByArea = $activities->groupBy('area_id');
        $committeeCounts = [];
        $committeeIds = $activities->pluck('committee_id')->filter()->unique();
        if ($committeeIds->isNotEmpty()) {
            $committeeCounts = Committee::query()
                ->whereIn('id', $committeeIds)
                ->withCount('voters')
                ->get()
                ->pluck('voters_count', 'id');
        }

        return $activitiesByArea->keys()->merge($teamCounts->keys())->unique()->map(function ($areaId) use ($activitiesByArea, $teamCounts, $committeeCounts) {
            $activities = $activitiesByArea->get($areaId, collect());
            $teamData = $teamCounts->get($areaId, ['volunteers' => 0, 'area' => null]);
            $area = $teamData['area'] ?? $activities->first()?->area;

            $committeeIds = $activities->pluck('committee_id')->filter()->unique();
            $votersCount = $committeeIds->sum(function ($committeeId) use ($committeeCounts) {
                return (int) ($committeeCounts[$committeeId] ?? 0);
            });

            $reportsToday = $activities->filter(function (Activity $activity) {
                return optional($activity->reported_at)->isToday();
            })->count();

            $supportAverage = (float) $activities->avg('support_score');

            return [
                'geo_area_uuid' => $area ? (string) $area->getKey() : (string) $areaId,
                'region' => $area?->name ?? 'Unassigned',
                'total_voters' => $votersCount,
                'active_agents' => (int) $teamData['volunteers'],
                'reports_today' => $reportsToday,
                'support_score_avg' => round($supportAverage, 1),
            ];
        })->values();
    }

    protected function buildSupportTrends($activities)
    {
        return $activities->filter(fn (Activity $activity) => $activity->reported_at)
            ->groupBy(function (Activity $activity) {
                return optional($activity->reported_at)->toDateString();
            })
            ->sortKeys()
            ->map(function ($group, $date) {
                return [
                    'date' => $date,
                    'support_score_avg' => round((float) $group->avg('support_score'), 1),
                ];
            });
    }

    protected function buildReportDistribution($activities)
    {
        return $activities->groupBy(function (Activity $activity) {
            return $activity->type ?: 'other';
        })->map(function ($group, $type) {
            return [
                'type' => $type,
                'count' => $group->count(),
            ];
        })->sortByDesc('count');
    }
}
