<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        if (! config('scheduler.enabled')) {
            return;
        }

        $schedule->call(function () {
            app(\App\Services\AlertService::class)->run();
        })
            ->name('automation:smart-alert-engine')
            ->everyThirtyMinutes()
            ->withoutOverlapping()
            ->runInBackground();

        $schedule->command('daily:send-analytics-summary')
            ->dailyAt('07:30')
            ->when(fn () => \App\Models\AutomationTask::isEnabled('daily:send-analytics-summary'));

        $schedule->command('weekly:send-gotv-reminders')
            ->weeklyOn(1, '09:00')
            ->when(fn () => \App\Models\AutomationTask::isEnabled('weekly:send-gotv-reminders'));

        $schedule->command('cleanup:stale-assignments')
            ->dailyAt('22:00')
            ->when(fn () => \App\Models\AutomationTask::isEnabled('cleanup:stale-assignments'));
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
