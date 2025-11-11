<?php

namespace App\Jobs;

use App\Models\{Campaign, AutomationTask};
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RunAutomationTask implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public AutomationTask $task) {}

    public function handle(): void
    {
        // Implement the actual automation work here (placeholder)
        $this->task->update(['status' => 'completed', 'last_run_at' => now()]);
    }
}
