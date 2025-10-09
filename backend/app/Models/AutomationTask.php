<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class AutomationTask extends Model
{
    use HasFactory;

    protected $fillable = [
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

    public static function syncDefinitions(array $definitions)
    {
        return collect($definitions)->map(function (array $definition, string $task) {
            $record = static::firstOrNew(['task' => $task]);
            $record->display_name = $definition['display_name'] ?? Arr::get($definition, 'name', $task);
            $record->description = $definition['description'] ?? null;

            if (! $record->exists) {
                $record->is_enabled = $definition['default_enabled'] ?? true;
            }

            $record->save();

            static::refreshCache($task);

            return $record;
        })->values();
    }

    public static function isEnabled(string $task): bool
    {
        return Cache::remember("automation_tasks.enabled.{$task}", now()->addMinutes(10), function () use ($task) {
            return (bool) static::query()->where('task', $task)->value('is_enabled');
        });
    }

    public static function refreshCache(string $task): void
    {
        Cache::forget("automation_tasks.enabled.{$task}");
    }

    public static function startRun(string $task): self
    {
        $record = static::firstOrCreate(
            ['task' => $task],
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

        static::refreshCache($task);

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
    }
}
