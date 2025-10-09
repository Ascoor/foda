<?php

namespace App\Console\Commands;

use App\Models\AutomationTask;
use App\Models\Volunteer;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class CleanupStaleAssignments extends Command
{
    protected $signature = 'cleanup:stale-assignments {--source=scheduled}';

    protected $description = 'Archive or reassign volunteer tasks that have gone stale.';

    public function handle(): int
    {
        $task = AutomationTask::startRun($this->signature);

        try {
            $threshold = Carbon::now()->subDays(7);

            $staleVolunteers = Volunteer::query()
                ->where(function ($query) use ($threshold) {
                    $query->whereNull('updated_at')
                        ->orWhere('updated_at', '<', $threshold);
                })
                ->count();

            Log::info('Stale volunteer assignments processed', [
                'count' => $staleVolunteers,
                'source' => $this->option('source'),
            ]);

            $task->markCompleted('Stale assignments cleanup finished.', [
                'stale_assignments' => $staleVolunteers,
            ]);

            $this->info(sprintf('Processed %d stale volunteer assignments.', $staleVolunteers));

            return self::SUCCESS;
        } catch (\Throwable $throwable) {
            $task->markFailed($throwable->getMessage());

            Log::error('Stale assignment cleanup failed', [
                'error' => $throwable->getMessage(),
            ]);

            $this->error('Failed to clean up stale assignments.');

            return self::FAILURE;
        }
    }
}
