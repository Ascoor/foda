<?php

namespace App\Models;

use App\Models\Concerns\BelongsToCampaign;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class AutomationTask extends Model
{
    use HasFactory;
    use BelongsToCampaign;

    protected $fillable = [
        'campaign_id',
        'task',
        'display_name',
        'description',
        'is_enabled',
        'status',
        'last_run_at',
        'meta',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'last_run_at' => 'datetime',
        'meta' => 'array',
    ];

    public static function cacheKey(string $task, ?int $campaignId = null): string
    {
        return sprintf('automation_tasks.%s.enabled.%s', $campaignId ?? 'global', $task);
    }

    public static function syncDefinitions(array $definitions, ?int $campaignId = null)
    {
        return collect($definitions)->map(function (array $definition, string $task) use ($campaignId) {
            $record = static::firstOrNew([
                'campaign_id' => $campaignId,
                'task' => $task,
            ]);
            $record->display_name = $definition['display_name'] ?? Arr::get($definition, 'name', $task);
            $record->description = $definition['description'] ?? null;

            if (! $record->exists) {
                $record->is_enabled = $definition['default_enabled'] ?? true;
            }

            $record->save();

            static::refreshCache($task, $campaignId);

            return $record;
        })->values();
    }

    public static function isEnabled(string $task, ?int $campaignId = null): bool
    {
        return Cache::remember(static::cacheKey($task, $campaignId), now()->addMinutes(10), function () use ($task, $campaignId) {
            return (bool) static::query()
                ->where('task', $task)
                ->where('campaign_id', $campaignId)
                ->value('is_enabled');
        });
    }

    public static function refreshCache(string $task, ?int $campaignId = null): void
    {
        Cache::forget(static::cacheKey($task, $campaignId));
    }

    public static function startRun(string $task, ?int $campaignId = null): self
    {
        $record = static::firstOrCreate(
            [
                'campaign_id' => $campaignId,
                'task' => $task,
            ],
            [
                'display_name' => $task,
                'description' => null,
                'is_enabled' => true,
            ]
        );

        $record->forceFill([
            'status' => 'running',
            'last_run_at' => now(),
        ])->save();

        static::refreshCache($task, $campaignId);

        return $record->fresh();
    }

    public function markCompleted(?string $message = null, array $meta = []): void
    {
        $this->forceFill([
            'status' => 'completed',
            'meta' => array_merge($this->meta ?? [], $meta, [
                'message' => $message,
                'completed_at' => Carbon::now()->toIso8601String(),
            ]),
        ])->save();

        static::refreshCache($this->task, $this->campaign_id);
    }

    public function markFailed(string $message, array $meta = []): void
    {
        $this->forceFill([
            'status' => 'failed',
            'meta' => array_merge($this->meta ?? [], $meta, [
                'message' => $message,
                'failed_at' => Carbon::now()->toIso8601String(),
            ]),
        ])->save();

        static::refreshCache($this->task, $this->campaign_id);
    }
}
