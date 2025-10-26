<?php

namespace App\Console\Commands;

use App\Services\Schema\SchemaSynchronizer;
use Illuminate\Console\Command;

class SchemaRemoveCommand extends Command
{
    protected $signature = 'schema:remove {table : اسم الجدول المطلوب حذفه} {--user= : معرّف المستخدم المنفذ للأمر}';

    protected $description = 'حذف جدول قديم وإزالة علاقاته بناءً على المخطط المرجعي.';

    public function __construct(private SchemaSynchronizer $synchronizer)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $table = $this->argument('table');
        $userId = $this->option('user');

        $result = $this->synchronizer->removeTable($table, $userId ? (int) $userId : null);

        return match ($result['status']) {
            'deleted' => $this->reportDeleted($result['table']),
            'missing' => $this->reportMissing($result['table']),
            default => $this->reportNoAction(),
        };
    }

    private function reportDeleted(string $table): int
    {
        $this->warn('تم حذف الجدول: '.$table);

        return Command::SUCCESS;
    }

    private function reportMissing(string $table): int
    {
        $this->comment('الجدول غير موجود: '.$table);

        return Command::SUCCESS;
    }

    private function reportNoAction(): int
    {
        $this->error('لم يتم تنفيذ أي إجراء.');

        return Command::FAILURE;
    }
}
