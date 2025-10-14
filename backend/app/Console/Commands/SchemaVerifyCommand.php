<?php

namespace App\Console\Commands;

use App\Services\Schema\SchemaSynchronizer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SchemaVerifyCommand extends Command
{
    protected $signature = 'schema:verify {--tables=* : جدول أو أكثر للتحقق}';

    protected $description = 'التحقق من مطابقة الجداول للمخطط المرجعي وتوليد تقرير Markdown.';

    public function __construct(private SchemaSynchronizer $synchronizer)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $tables = $this->option('tables');
        $inspection = $this->synchronizer->inspect($tables);

        $this->outputSummary($inspection);
        $this->writeReport($inspection);

        return Command::SUCCESS;
    }

    private function outputSummary(array $inspection): void
    {
        $matched = collect($inspection['tables'])
            ->filter(fn ($info) => $info['exists'] && $info['matches'])
            ->keys()
            ->all();

        $diverged = collect($inspection['tables'])
            ->filter(fn ($info) => $info['exists'] && ! $info['matches'])
            ->map(function ($info, $table) {
                return $table;
            })
            ->values()
            ->all();

        if ($matched) {
            $this->info('الجداول المطابقة: '.implode(', ', $matched));
        }

        if ($inspection['missing']) {
            $this->warn('الجداول الناقصة: '.implode(', ', $inspection['missing']));
        }

        if ($inspection['extra']) {
            $this->warn('الجداول الزائدة: '.implode(', ', $inspection['extra']));
        }

        if ($diverged) {
            $this->warn('الجداول المتطلبة للمزامنة: '.implode(', ', $diverged));
        }
    }

    private function writeReport(array $inspection): void
    {
        $path = storage_path('logs/schema_report.md');
        File::ensureDirectoryExists(dirname($path));

        File::put($path, $this->synchronizer->generateVerificationMarkdown($inspection));

        $this->info('تم حفظ تقرير التحقق في: '.$path);
    }
}
