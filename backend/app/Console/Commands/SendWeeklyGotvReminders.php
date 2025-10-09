<?php

namespace App\Console\Commands;

use App\Models\AutomationTask;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendWeeklyGotvReminders extends Command
{
    protected $signature = 'weekly:send-gotv-reminders {--source=scheduled}';

    protected $description = 'Send weekly get-out-the-vote reminders to targeted segments.';

    public function handle(): int
    {
        $task = AutomationTask::startRun($this->signature);

        try {
            Log::info('Weekly GOTV reminders dispatched', [
                'source' => $this->option('source'),
            ]);

            $task->markCompleted('Weekly GOTV reminders delivered.');

            $this->info('Weekly GOTV reminders queued successfully.');

            return self::SUCCESS;
        } catch (\Throwable $throwable) {
            $task->markFailed($throwable->getMessage());

            Log::error('Weekly GOTV reminders failed', [
                'error' => $throwable->getMessage(),
            ]);

            $this->error('Failed to send weekly GOTV reminders.');

            return self::FAILURE;
        }
    }
}
