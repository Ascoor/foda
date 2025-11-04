<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AutomationTaskResource;
use App\Models\AutomationTask;
use App\Models\ElectionCircle\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class AutomationController extends Controller
{
    protected array $definitions = [
        'daily:send-analytics-summary' => [
            'display_name' => 'Daily Analytics Summary',
            'description' => 'Sends a morning digest of analytics and alerts to campaign leadership.',
            'default_enabled' => true,
        ],
        'weekly:send-gotv-reminders' => [
            'display_name' => 'Weekly GOTV Reminders',
            'description' => 'Pushes get-out-the-vote reminders to priority voter segments every Monday.',
            'default_enabled' => true,
        ],
        'cleanup:stale-assignments' => [
            'display_name' => 'Stale Assignment Cleanup',
            'description' => 'Reassigns or archives stale volunteer assignments older than 7 days.',
            'default_enabled' => true,
        ],
    ];

    public function index(Campaign $campaign)
    {
        $tasks = AutomationTask::syncDefinitions($this->definitions, $campaign->getKey())
            ->map->fresh()
            ->values();

        return AutomationTaskResource::collection($tasks);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.task' => 'required|string|in:' . implode(',', array_keys($this->definitions)),
            'tasks.*.is_enabled' => 'required|boolean',
        ]);

        $collection = collect($data['tasks'])->keyBy('task');

        $tasks = AutomationTask::query()
            ->where('campaign_id', $campaign->getKey())
            ->whereIn('task', $collection->keys())
            ->get()
            ->map(function (AutomationTask $task) use ($collection, $campaign) {
                $payload = $collection->get($task->task);
                $task->update(['is_enabled' => $payload['is_enabled']]);
                AutomationTask::refreshCache($task->task, $campaign->getKey());

                return $task->fresh();
            });

        return AutomationTaskResource::collection($tasks);
    }

    public function trigger(Campaign $campaign, string $task)
    {
        abort_unless(array_key_exists($task, $this->definitions), 404);

        $record = AutomationTask::firstOrCreate(
            [
                'campaign_id' => $campaign->getKey(),
                'task' => $task,
            ],
            [
                'display_name' => Arr::get($this->definitions[$task], 'display_name', $task),
                'description' => Arr::get($this->definitions[$task], 'description'),
                'is_enabled' => true,
            ]
        );

        try {
            Artisan::call($task, ['--source' => 'manual', '--campaign' => $campaign->getKey()]);
        } catch (\Throwable $throwable) {
            Log::error('Manual automation trigger failed', [
                'task' => $task,
                'campaign_id' => $campaign->getKey(),
                'error' => $throwable->getMessage(),
            ]);

            $record->markFailed($throwable->getMessage());

            return response()->json([
                'message' => 'Automation task failed to execute.',
            ], 500);
        }

        $record->refresh();

        return new AutomationTaskResource($record);
    }
}
