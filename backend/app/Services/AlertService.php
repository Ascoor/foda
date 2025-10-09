<?php

namespace App\Services;

use App\Events\NotificationCreated;
use App\Models\Activity;
use App\Models\Notification;
use App\Models\Team;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AlertService
{
    /**
     * Evaluate all alert sources and persist notifications.
     */
    public function run(): Collection
    {
        $alerts = $this->evaluate();

        return $alerts->map(function (array $payload) {
            $notification = $this->storeNotification($payload);

            if ($notification) {
                broadcast(new NotificationCreated($notification))->toOthers();
            }

            return $notification;
        })->filter();
    }

    /**
     * Build a collection of alert payloads without persisting them.
     */
    public function evaluate(): Collection
    {
        return collect()
            ->merge($this->detectSupportScoreDrop())
            ->merge($this->detectNegativeSurge())
            ->merge($this->detectClusterInactivity());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function detectSupportScoreDrop(): array
    {
        $rows = Activity::query()
            ->selectRaw('DATE(COALESCE(reported_at, created_at)) as day, AVG(support_score) as avg_score')
            ->whereNotNull('support_score')
            ->whereDate(DB::raw('COALESCE(reported_at, created_at)'), '>=', now()->subDays(10)->toDateString())
            ->groupBy('day')
            ->orderByDesc('day')
            ->limit(5)
            ->get();

        if ($rows->count() < 2) {
            return [];
        }

        $latest = (float) ($rows->first()->avg_score ?? 0);
        $previous = $rows->skip(1)->pluck('avg_score')->avg() ?? 0;
        $drop = max(0, $previous - $latest);

        if ($drop < 15) {
            return [];
        }

        return [[
            'type' => 'performance',
            'title' => 'Support Trend Alert',
            'message' => sprintf('Support score dropped %.1f%% versus the weekly trend. Investigate messaging immediately.', $drop),
            'priority' => 'high',
            'meta' => [
                'latest_score' => round($latest, 2),
                'baseline_score' => round($previous, 2),
                'drop' => round($drop, 2),
            ],
        ]];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function detectNegativeSurge(): array
    {
        $now = Carbon::now();
        $currentWindow = Activity::query()
            ->where('type', 'negative')
            ->where(DB::raw('COALESCE(reported_at, created_at)'), '>=', $now->copy()->subDay())
            ->count();

        $previousWindow = Activity::query()
            ->where('type', 'negative')
            ->whereBetween(DB::raw('COALESCE(reported_at, created_at)'), [$now->copy()->subDays(2), $now->copy()->subDay()])
            ->count();

        if ($currentWindow < 5) {
            return [];
        }

        $threshold = max(5, $previousWindow * 1.5);

        if ($previousWindow === 0) {
            $threshold = 5;
        }

        if ($currentWindow < $threshold) {
            return [];
        }

        return [[
            'type' => 'risk',
            'title' => 'Spike in Negative Field Reports',
            'message' => sprintf('Detected %d negative reports in the last 24h (previous window %d). Deploy rapid response.', $currentWindow, $previousWindow),
            'priority' => 'high',
            'meta' => [
                'current_negative_reports' => $currentWindow,
                'previous_negative_reports' => $previousWindow,
            ],
        ]];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function detectClusterInactivity(): array
    {
        $threshold = Carbon::now()->subHours(36);

        $teams = Team::query()->with('area')->get();

        $inactive = $teams->filter(function (Team $team) use ($threshold) {
            if (! $team->area_id) {
                return false;
            }

            return ! Activity::query()
                ->where('area_id', $team->area_id)
                ->where(DB::raw('COALESCE(reported_at, created_at)'), '>=', $threshold)
                ->exists();
        });

        if ($inactive->isEmpty()) {
            return [];
        }

        $top = $inactive->take(3)->map(fn (Team $team) => $team->name)->implode(', ');

        return [[
            'type' => 'field',
            'title' => 'Agent Cluster Inactivity',
            'message' => sprintf('No field activity recorded for %d clusters in the last 36h. Focus on: %s.', $inactive->count(), $top),
            'priority' => 'medium',
            'meta' => [
                'inactive_cluster_ids' => $inactive->pluck('id')->all(),
                'inactive_cluster_names' => $inactive->pluck('name')->all(),
            ],
        ]];
    }

    protected function storeNotification(array $payload): ?Notification
    {
        $exists = Notification::query()
            ->where('type', $payload['type'])
            ->where('title', $payload['title'])
            ->where('created_at', '>=', now()->subHours(6))
            ->exists();

        if ($exists) {
            return null;
        }

        try {
            $notification = Notification::create([
                'type' => $payload['type'],
                'title' => $payload['title'],
                'message' => $payload['message'],
                'priority' => $payload['priority'] ?? 'medium',
                'meta' => $payload['meta'] ?? [],
            ]);
        } catch (\Throwable $throwable) {
            Log::error('Failed to store notification', [
                'error' => $throwable->getMessage(),
                'payload' => $payload,
            ]);

            return null;
        }

        return $notification->fresh();
    }
}
