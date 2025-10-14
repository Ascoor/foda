<?php

namespace App\Console\Commands;

use App\Services\Schema\SchemaSynchronizer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SchemaSyncCommand extends Command
{
    protected $signature = 'schema:sync {--tables=* : جدول محدد أو أكثر} {--apply : تنفيذ التغييرات فعليًا} {--cleanup : حذف الجداول غير المستخدمة} {--user= : معرّف المستخدم المنفذ للأمر}';

    protected $description = 'مزامنة بنية قاعدة البيانات مع المخطط المرجعي.';

    public function __construct(private SchemaSynchronizer $synchronizer)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $tables = $this->option('tables');
        $apply = (bool) $this->option('apply');
        $cleanup = (bool) $this->option('cleanup');
        $userId = $this->option('user');

        $results = $this->synchronizer->sync($tables, $apply, $cleanup, $userId ? (int) $userId : null);

        $this->outputResults($results, $apply, $cleanup);
        $this->writeAuditReport($results);

        return Command::SUCCESS;
    }

    private function outputResults(array $results, bool $apply, bool $cleanup): void
    {
        if ($results['matched']) {
            $this->info('الجداول المتطابقة: '.implode(', ', $results['matched']));
        }

        if ($results['added']) {
            $this->info('تم إنشاء الجداول: '.implode(', ', $results['added']));
        }

        if ($results['updated']) {
            $this->info('تم تحديث الجداول: '.implode(', ', $results['updated']));
        }

        if ($cleanup && $results['deleted']) {
            $this->warn('تم حذف الجداول: '.implode(', ', $results['deleted']));
        }

        if ($results['warnings']) {
            foreach ($results['warnings'] as $warning) {
                $this->warn($warning);
            }
        }

        if (! $apply) {
            $pending = array_merge($results['missing'], $results['diverged']);
            if ($pending) {
                $this->comment('مطلوب تشغيل الأمر مع خيار --apply لتطبيق التغييرات على الجداول: '.implode(', ', $pending));
            }
        }

        $this->line('الحالة النهائية: '.$results['final_status']);
    }

    private function writeAuditReport(array $results): void
    {
        $path = storage_path('logs/schema_audit.md');
        File::ensureDirectoryExists(dirname($path));

        File::put($path, $this->synchronizer->generateAuditMarkdown($results));

        $this->info('تم حفظ تقرير التدقيق في: '.$path);
    }
}
