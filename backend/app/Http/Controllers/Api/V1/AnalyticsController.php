<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Area;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
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

    public function forecast(Request $request)
    {
        $futureDays = max(1, min((int) $request->input('days', 7), 30));

        $cacheKey = sprintf('analytics.v1.forecast.%d', $futureDays);

        $payload = Cache::remember($cacheKey, now()->addDay(), function () use ($futureDays) {
            $historyWindow = 60;
            $totalVoters = Area::query()->withCount('voters')->get()->sum('voters_count');

            $history = Activity::query()
                ->selectRaw('DATE(COALESCE(reported_at, created_at)) as day, AVG(support_score) as support_avg, COUNT(id) as total_reports')
                ->whereDate(DB::raw('COALESCE(reported_at, created_at)'), '>=', now()->subDays($historyWindow)->toDateString())
                ->groupBy('day')
                ->orderBy('day')
                ->get()
                ->map(function ($row) use ($totalVoters) {
                    $date = Carbon::parse($row->day)->toDateString();
                    $supportScore = round((float) ($row->support_avg ?? 0), 2);
                    $turnoutRate = $totalVoters > 0
                        ? round(min(100, (($row->total_reports ?? 0) / $totalVoters) * 100), 2)
                        : 0.0;

                    return [
                        'date' => $date,
                        'support_score' => $supportScore,
                        'turnout_rate' => $turnoutRate,
                        'activity_count' => (int) ($row->total_reports ?? 0),
                    ];
                });

            return [
                'generated_at' => now()->toIso8601String(),
                'history_days' => $history->count(),
                'horizon_days' => $futureDays,
                'support_score' => $this->buildForecast($history, 'support_score', $futureDays, 100),
                'turnout_rate' => $this->buildForecast($history, 'turnout_rate', $futureDays, 100),
            ];
        });

        return response()->json(['data' => $payload]);
    }

    protected function buildForecast(Collection $history, string $metricKey, int $futureDays, ?float $upperBound = null): array
    {
        $values = $history->pluck($metricKey)->map(fn ($value) => (float) $value);
        $dates = $history->pluck('date')->map(fn ($date) => Carbon::parse($date));
        $count = $values->count();

        if ($count === 0) {
            return [
                'history' => [],
                'forecast' => [],
                'metadata' => [
                    'trend_label' => 'stable',
                    'slope' => 0.0,
                    'std_error' => 0.0,
                ],
            ];
        }

        if ($count === 1) {
            $baseValue = $values->first();
            $forecast = [];
            for ($i = 1; $i <= $futureDays; $i++) {
                $date = $dates->first()->copy()->addDays($i);
                $forecast[] = [
                    'date' => $date->toDateString(),
                    'value' => $this->clamp($baseValue, 0, $upperBound),
                    'lower' => $this->clamp($baseValue, 0, $upperBound),
                    'upper' => $this->clamp($baseValue, 0, $upperBound),
                    'confidence' => 0.0,
                ];
            }

            return [
                'history' => $history->map(fn ($row) => [
                    'date' => $row['date'],
                    'value' => $row[$metricKey],
                ])->values()->all(),
                'forecast' => $forecast,
                'metadata' => [
                    'trend_label' => 'stable',
                    'slope' => 0.0,
                    'std_error' => 0.0,
                ],
            ];
        }

        $xValues = collect(range(0, $count - 1));
        $xMean = $xValues->avg();
        $yMean = $values->avg();

        $denominator = $xValues->reduce(function ($carry, $x) use ($xMean) {
            return $carry + pow($x - $xMean, 2);
        }, 0.0);

        $numerator = 0.0;
        foreach ($xValues as $index => $x) {
            $numerator += ($x - $xMean) * ($values[$index] - $yMean);
        }

        $slope = $denominator > 0 ? $numerator / $denominator : 0.0;
        $intercept = $yMean - ($slope * $xMean);

        $predictedHistory = [];
        foreach ($xValues as $index => $x) {
            $predictedHistory[] = $intercept + ($slope * $x);
        }

        $squaredError = 0.0;
        foreach ($values as $index => $actual) {
            $squaredError += pow($actual - $predictedHistory[$index], 2);
        }

        $degreesOfFreedom = max($count - 2, 1);
        $variance = $squaredError / $degreesOfFreedom;
        $stdError = sqrt($variance);

        $historyOutput = $history->map(fn ($row) => [
            'date' => $row['date'],
            'value' => $row[$metricKey],
        ])->values()->all();

        $forecast = [];
        $trendLabel = $this->trendLabel($slope, $stdError);
        $confidenceBase = $this->confidenceFromError($stdError);

        $criticalValue = 1.96; // approx 95%
        foreach (range(1, $futureDays) as $offset) {
            $xFuture = ($count - 1) + $offset;
            $prediction = $intercept + ($slope * $xFuture);

            $predictionStd = $denominator > 0
                ? sqrt($variance * (1 + (1 / $count) + pow($xFuture - $xMean, 2) / $denominator))
                : $stdError;

            $lower = $prediction - ($criticalValue * $predictionStd);
            $upper = $prediction + ($criticalValue * $predictionStd);

            $forecast[] = [
                'date' => $dates->last()->copy()->addDays($offset)->toDateString(),
                'value' => $this->clamp($prediction, 0, $upperBound),
                'lower' => $this->clamp($lower, 0, $upperBound),
                'upper' => $this->clamp($upper, 0, $upperBound),
                'confidence' => $confidenceBase,
            ];
        }

        return [
            'history' => $historyOutput,
            'forecast' => $forecast,
            'metadata' => [
                'trend_label' => $trendLabel,
                'slope' => round($slope, 4),
                'std_error' => round($stdError, 4),
            ],
        ];
    }

    protected function clamp(float $value, float $min, ?float $max = null): float
    {
        if (! is_null($max)) {
            $value = min($value, $max);
        }

        return max($min, round($value, 2));
    }

    protected function trendLabel(float $slope, float $stdError): string
    {
        $threshold = max(0.05, $stdError);

        if ($slope > $threshold) {
            return 'rising';
        }

        if ($slope < -$threshold) {
            return 'declining';
        }

        return 'stable';
    }

    protected function confidenceFromError(float $stdError): float
    {
        $confidence = 1 / (1 + $stdError);

        return round(max(0.1, min(0.99, $confidence)), 2);
    }
}
