<?php

namespace App\Console\Commands;

use App\Services\Schema\SchemaSynchronizer;
use Illuminate\Console\Command;

class SchemaAddCommand extends Command
{
    protected $signature = 'schema:add {table : اسم الجدول المطلوب إنشاؤه} {--user= : معرّف المستخدم المنفذ للأمر}';

    protected $description = 'إنشاء جدول جديد اعتمادًا على قالب المخطط المرجعي.';

    public function __construct(private SchemaSynchronizer $synchronizer)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $table = $this->argument('table');
        $userId = $this->option('user');

        try {
            $result = $this->synchronizer->addTable($table, $userId ? (int) $userId : null);
        } catch (\Throwable $exception) {
            $this->error($exception->getMessage());

            return Command::FAILURE;
        }

        return $this->reportResult($result);
    }

    private function reportResult(array $result): int
    {
        return match ($result['status']) {
            'created' => $this->reportCreated($result['table']),
            'exists' => $this->reportExists($result['table']),
            default => $this->reportFailure(),
        };
    }

    private function reportCreated(string $table): int
    {
        $this->info('تم إنشاء الجدول: '.$table);

        return Command::SUCCESS;
    }

    private function reportExists(string $table): int
    {
        $this->comment('الجدول موجود مسبقًا: '.$table);

        return Command::SUCCESS;
    }

    private function reportFailure(): int
    {
        $this->error('تعذر تنفيذ العملية المطلوبة.');

        return Command::FAILURE;
    }
}
