<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomeRequest;
use App\Http\Resources\HomeDashboardResource;
use App\Models\Activity;
use App\Models\Area;
use App\Models\Campaign;
use App\Models\Candidate;
use App\Models\Committee;
use App\Models\Event;
use App\Models\Team;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class HomeController extends Controller
{
    public function index(HomeRequest $request): HomeDashboardResource
    {
        $campaign = $request->route('campaign');
        $campaignId = $campaign instanceof Campaign ? $campaign->getKey() : $request->integer('campaign_id');

        $voterQuery = Voter::query();
        if ($campaignId) {
            $voterQuery->forCampaign($campaignId);
        }

        if ($request->filled('from')) {
            $voterQuery->whereDate('created_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $voterQuery->whereDate('created_at', '<=', $request->date('to'));
        }

        $registrations = (clone $voterQuery)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'count' => (int) $row->count,
            ]);

        $activityQuery = Activity::query()->orderByDesc('reported_at')->orderByDesc('created_at');
        $volunteerQuery = Volunteer::query();
        $teamQuery = Team::query();
        $committeeQuery = Committee::query();
        $eventQuery = Event::query();
        $candidateQuery = Candidate::query();

        if ($campaignId) {
            $activityQuery->forCampaign($campaignId);
            $volunteerQuery->forCampaign($campaignId);
            $teamQuery->forCampaign($campaignId);
            $committeeQuery->forCampaign($campaignId);
            $eventQuery->forCampaign($campaignId);
            $candidateQuery->forCampaign($campaignId);
        }

        $activities = $activityQuery->limit(6)->get();
        $volunteerCount = $volunteerQuery->count();
        $teamCount = $teamQuery->count();
        $committeeCount = $committeeQuery->count();
        $eventCount = $eventQuery->count();
        $candidateCount = $candidateQuery->count();
        $voterCount = $voterQuery->count();

        $progress = $this->buildProgressMetrics($voterCount, $volunteerCount, $committeeCount, $eventCount, $activities->count());

        $dashboardActivities = $activities->map(function (Activity $activity) {
            $timestamp = $activity->reported_at ?? $activity->created_at ?? Carbon::now();

            return [
                'id' => $activity->getKey(),
                'type' => $activity->type,
                'title' => $activity->title,
                'time' => $timestamp?->toIso8601String(),
            ];
        });

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

        $turnout = $activities
            ->filter(fn (Activity $activity) => $activity->support_score !== null)
            ->sortBy(fn (Activity $activity) => $activity->reported_at ?? $activity->created_at)
            ->values()
            ->map(fn (Activity $activity) => (int) $activity->support_score)
            ->take(12)
            ->all();

        $statsSummary = [
            'areas' => Area::count(),
            'volunteers' => $volunteerCount,
            'voters' => $voterCount,
            'teams' => $teamCount,
            'events' => $eventCount,
            'registrations' => $registrations,
            'stats' => $stats,
            'progress' => $progress,
            'activities' => $dashboardActivities,
            'turnout' => $turnout,
        ];

        return new HomeDashboardResource($statsSummary);
    }

    public function heatmap(): JsonResponse
    {
        $points = Area::whereNotNull('x')
            ->whereNotNull('y')
            ->get()
            ->map(fn ($area) => [
                'lat' => (float) $area->x,
                'lng' => (float) $area->y,
            ]);

        return response()->json(['data' => $points]);
    }

    protected function buildProgressMetrics(int $voterCount, int $volunteerCount, int $committeeCount, int $eventCount, int $activityCount): array
    {
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
