<?php

namespace App\Console\Commands;

use App\Models\Activity;
use App\Models\Campaign;
use App\Models\Notification;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Throwable;

class LifecycleTestCommand extends Command
{
    protected $signature = 'lifecycle:test';

    protected $description = 'محاكاة دورة حياة الكيانات الأساسية للتحقق من العلاقات وحذف السجلات.';

    public function handle(): int
    {
        $summary = [
            'campaign' => null,
            'volunteers' => [],
            'voters' => [],
            'activities' => [],
            'notifications' => [],
            'deleted' => null,
        ];

        DB::beginTransaction();

        try {
            $campaign = Campaign::factory()->create([
                'name' => 'حملة تكاملية تجريبية',
            ]);
            $summary['campaign'] = $campaign->only(['id', 'name']);

            $volunteers = Volunteer::factory()->count(3)->create([
                'campaign_id' => $campaign->id,
            ]);
            $summary['volunteers'] = $volunteers->map->only(['id', 'name', 'email'])->all();

            $voters = Voter::factory()->count(5)->create([
                'campaign_id' => $campaign->id,
            ]);
            $summary['voters'] = $voters->map->only(['id', 'name', 'phone'])->all();

            $activities = Activity::factory()->count(2)->create([
                'campaign_id' => $campaign->id,
                'voter_id' => $voters->first()->id,
            ]);
            $summary['activities'] = $activities->map->only(['id', 'title', 'status'])->all();

            $notifications = Notification::factory()->count(3)->create([
                'type' => 'integration-check',
            ]);
            $summary['notifications'] = $notifications->map->only(['id', 'title', 'priority'])->all();

            $activity = $activities->first();
            $activity->update(['status' => 'closed']);

            $volunteerToDelete = $volunteers->first();
            $volunteerToDelete->delete();
            $summary['deleted'] = ['volunteer_id' => $volunteerToDelete->id];

            DB::rollBack();
        } catch (Throwable $exception) {
            DB::rollBack();

            $this->error('فشل اختبار دورة الحياة: '.$exception->getMessage());
            $this->writeReport([
                'status' => 'فشل',
                'error' => $exception->getMessage(),
                'summary' => $summary,
            ]);

            return self::FAILURE;
        }

        $this->info('تم تنفيذ محاكاة دورة الحياة بنجاح.');
        $this->writeReport([
            'status' => 'نجاح',
            'summary' => $summary,
        ]);

        return self::SUCCESS;
    }

    private function writeReport(array $payload): void
    {
        $lines = [
            '# Entity Lifecycle Simulation',
            '',
            'الحالة: '.$payload['status'],
            '',
            '## التفاصيل',
            '```json',
            json_encode($payload['summary'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            '```',
        ];

        if (isset($payload['error'])) {
            $lines[] = '';
            $lines[] = '⚠️ الخطأ';
            $lines[] = '```';
            $lines[] = $payload['error'];
            $lines[] = '```';
        }

        $path = storage_path('logs/lifecycle_report.md');
        File::ensureDirectoryExists(dirname($path));
        File::put($path, implode(PHP_EOL, $lines).PHP_EOL);

        $this->info('تم حفظ تقرير دورة الحياة في: '.$path);
    }
}
