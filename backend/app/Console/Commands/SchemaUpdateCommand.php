<?php

namespace App\Console\Commands;

use App\Services\Schema\SchemaSynchronizer;
use Illuminate\Console\Command;

class SchemaUpdateCommand extends Command
{
    protected $signature = 'schema:update {tables* : قائمة الجداول المطلوب تحديثها} {--user= : معرّف المستخدم المنفذ للأمر}';

    protected $description = 'تحديث الجداول المحددة لتتوافق مع المخطط المرجعي.';

    public function __construct(private SchemaSynchronizer $synchronizer)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $tables = (array) $this->argument('tables');
        $userId = $this->option('user');

        $results = $this->synchronizer->updateTables($tables, $userId ? (int) $userId : null);

        if ($results['updated']) {
            $this->info('تم تحديث الجداول: '.implode(', ', $results['updated']));
        }

        if ($results['added']) {
            $this->info('تم إنشاء جداول مفقودة: '.implode(', ', $results['added']));
        }

        if ($results['warnings']) {
            foreach ($results['warnings'] as $warning) {
                $this->warn($warning);
            }
        }

        $this->line('الحالة النهائية: '.$results['final_status']);

        return Command::SUCCESS;
    }
}
