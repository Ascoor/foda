<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Area;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request)
    {
        $payload = Cache::remember('analytics.v1.overview', now()->addMinutes(5), function () {
            $areas = Area::query()
                ->select(['areas.id', 'areas.name'])
                ->withCount('voters')
                ->get();

            $volunteersByArea = Volunteer::query()
                ->selectRaw('teams.area_id, COUNT(volunteers.id) as aggregate')
                ->join('teams', 'volunteers.team_id', '=', 'teams.id')
                ->groupBy('teams.area_id')
                ->pluck('aggregate', 'teams.area_id');

            $reportsToday = Activity::query()
                ->selectRaw('area_id, COUNT(id) as aggregate')
                ->whereDate(DB::raw('COALESCE(reported_at, created_at)'), now()->toDateString())
                ->groupBy('area_id')
                ->pluck('aggregate', 'area_id');

            $supportAverages = Activity::query()
                ->selectRaw('area_id, AVG(support_score) as aggregate')
                ->groupBy('area_id')
                ->pluck('aggregate', 'area_id');

            $supportTrends = Activity::query()
                ->selectRaw('DATE(COALESCE(reported_at, created_at)) as day, AVG(support_score) as support_avg')
                ->whereDate(DB::raw('COALESCE(reported_at, created_at)'), '>=', now()->subDays(14)->toDateString())
                ->groupBy('day')
                ->orderBy('day')
                ->get()
                ->map(fn ($row) => [
                    'date' => Carbon::parse($row->day)->toDateString(),
                    'support_score_avg' => round((float) $row->support_avg, 2),
                ]);

            $reportDistribution = Activity::query()
                ->selectRaw('type, COUNT(id) as total')
                ->groupBy('type')
                ->orderByDesc('total')
                ->get()
                ->map(fn ($row) => [
                    'type' => $row->type ?? 'other',
                    'count' => (int) $row->total,
                ]);

            $regions = $areas->map(function (Area $area) use ($volunteersByArea, $reportsToday, $supportAverages) {
                return [
                    'region' => $area->name,
                    'area_id' => $area->id,
                    'total_voters' => (int) $area->voters_count,
                    'active_agents' => (int) ($volunteersByArea[$area->id] ?? 0),
                    'reports_today' => (int) ($reportsToday[$area->id] ?? 0),
                    'support_score_avg' => round((float) ($supportAverages[$area->id] ?? 0), 2),
                ];
            });

            $totalVoters = $regions->sum('total_voters');
            $totalAgents = $regions->sum('active_agents');
            $overallSupport = (float) (Activity::avg('support_score') ?? 0);
            $turnoutEstimate = $totalVoters > 0 ? round(($totalAgents / $totalVoters) * 100, 2) : 0.0;
            $coverageGap = round(max(0, 100 - $turnoutEstimate), 2);

            return [
                'regions' => $regions,
                'support_trends' => $supportTrends,
                'report_distribution' => $reportDistribution,
                'summary' => [
                    'support_percentage' => round($overallSupport, 2),
                    'turnout_estimate' => $turnoutEstimate,
                    'coverage_gap' => $coverageGap,
                ],
                'generated_at' => now()->toIso8601String(),
            ];
        });

        return response()->json(['data' => $payload]);
    }
}
