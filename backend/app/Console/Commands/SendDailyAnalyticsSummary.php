<?php

namespace App\Console\Commands;

use App\Models\AutomationTask;
use App\Services\AlertService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendDailyAnalyticsSummary extends Command
{
    protected $signature = 'daily:send-analytics-summary {--source=scheduled}';

    protected $description = 'Compile and deliver the daily analytics briefing.';

    public function handle(AlertService $alertService): int
    {
        $task = AutomationTask::startRun($this->signature);

        try {
            $alerts = $alertService->evaluate();

            Log::info('Daily analytics summary generated', [
                'alerts' => $alerts->count(),
                'source' => $this->option('source'),
            ]);

            $task->markCompleted('Daily analytics summary executed.', [
                'alert_candidates' => $alerts->count(),
            ]);

            $this->info('Daily analytics summary dispatched successfully.');

            return self::SUCCESS;
        } catch (\Throwable $throwable) {
            $task->markFailed($throwable->getMessage());

            Log::error('Daily analytics summary failed', [
                'error' => $throwable->getMessage(),
            ]);

            $this->error('Unable to complete the daily summary.');

            return self::FAILURE;
        }
    }
}
