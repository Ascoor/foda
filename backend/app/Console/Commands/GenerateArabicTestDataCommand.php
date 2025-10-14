<?php

namespace App\Console\Commands;

use Database\Seeders\ArabicDatabaseSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Throwable;

class GenerateArabicTestDataCommand extends Command
{
    protected $signature = 'data:seed:arabic';

    protected $description = 'توليد بيانات تجريبية عربية مترابطة لجميع كيانات Elections360.';

    public function handle(): int
    {
        $this->info('🚀 بدء إنشاء البيانات التجريبية العربية...');

        try {
            Artisan::call('db:seed', [
                '--class' => ArabicDatabaseSeeder::class,
                '--force' => true,
            ]);

            $report = ArabicDatabaseSeeder::$auditReport;

            if (empty($report)) {
                throw new \RuntimeException('لم يتم إنشاء تقرير من Seeder.');
            }

            $this->writeAuditReport($report);
            $this->displaySummary($report);

            $status = $report['status'] ?? 'success';

            return $status === 'failed' ? self::FAILURE : self::SUCCESS;
        } catch (Throwable $exception) {
            $this->error('حدث خطأ أثناء توليد البيانات: ' . $exception->getMessage());

            $fallbackReport = $this->buildFallbackReport($exception);
            $this->writeAuditReport($fallbackReport);

            return self::FAILURE;
        }
    }

    protected function displaySummary(array $report): void
    {
        $statusLabel = match ($report['status'] ?? 'success') {
            'failed' => '❌ فشل التوليد',
            'partial' => '⚠️ اكتمل جزئياً',
            default => '✅ تم التوليد بنجاح',
        };

        $this->line($statusLabel);
        $this->line('إجمالي السجلات: ' . ($report['total_records'] ?? 0));
        $this->line('المدة (ثانية): ' . ($report['duration_seconds'] ?? 0));

        if (!empty($report['failed'])) {
            $this->warn('تفاصيل الأخطاء:');
            foreach ($report['failed'] as $failure) {
                $this->line(sprintf('- %s: %s', $failure['label'], $failure['message']));
            }
        }

        $this->info('📄 تم حفظ التقرير في storage/logs/factory_audit.md');
    }

    protected function writeAuditReport(array $report): void
    {
        $path = storage_path('logs/factory_audit.md');
        File::ensureDirectoryExists(dirname($path));

        $executedAt = $report['completed_at'] instanceof Carbon
            ? $report['completed_at']->format('Y-m-d H:i:s')
            : Carbon::now()->format('Y-m-d H:i:s');

        $statusLabel = match ($report['status'] ?? 'success') {
            'failed' => '❌ فاشلة',
            'partial' => '⚠️ جزئية',
            default => '✅ ناجحة',
        };

        $lines = [];
        $lines[] = '# 🧪 تقرير توليد البيانات التجريبية (Arabic Test Data Report)';
        $lines[] = '';
        $lines[] = '**تاريخ التنفيذ:** ' . $executedAt;
        $lines[] = '**المستخدم:** ' . $this->resolveUsername();
        $lines[] = '**الحالة:** ' . $statusLabel;
        $lines[] = '';
        $lines[] = '| الكيان | عدد السجلات | العلاقات | الحالة |';
        $lines[] = '|--------|--------------|-----------|---------|';

        foreach ($report['entities'] ?? [] as $entity) {
            $icon = match ($entity['status'] ?? 'success') {
                'failed' => '❌',
                'partial' => '⚠️',
                default => '✅',
            };

            $lines[] = sprintf(
                '| %s | %d | %s | %s |',
                $entity['label'] ?? 'غير محدد',
                $entity['count'] ?? 0,
                $entity['relationships'] ?? '-',
                $icon
            );
        }

        $lines[] = '';
        $lines[] = '**الملخص:**';
        $lines[] = sprintf(
            'تم توليد %d سجل خلال %d ثانية.',
            $report['total_records'] ?? 0,
            $report['duration_seconds'] ?? 0
        );

        if (!empty($report['failed'])) {
            $lines[] = '';
            $lines[] = '**الأخطاء المسجلة:**';
            foreach ($report['failed'] as $failure) {
                $lines[] = sprintf('- %s: %s', $failure['label'] ?? 'غير معروف', $failure['message'] ?? '');
            }
        }

        $lines[] = str_repeat('-', 80);
        $lines[] = '';

        File::append($path, implode(PHP_EOL, $lines) . PHP_EOL);
    }

    protected function resolveUsername(): string
    {
        return get_current_user() ?: (getenv('USER') ?: 'system');
    }

    protected function buildFallbackReport(Throwable $exception): array
    {
        $now = Carbon::now();

        return [
            'status' => 'failed',
            'entities' => [],
            'failed' => [[
                'label' => 'Seeder',
                'message' => $exception->getMessage(),
            ]],
            'total_records' => 0,
            'duration_seconds' => 0,
            'completed_at' => $now,
        ];
    }
}
