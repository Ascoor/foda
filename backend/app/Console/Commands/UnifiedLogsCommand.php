<?php

namespace App\Console\Commands;

use App\Services\Logging\UnifiedLogger;
use Illuminate\Console\Command;

class UnifiedLogsCommand extends Command
{
    protected $signature = 'logs:unify';

    protected $description = 'دمج تقارير التدقيق في ملف موحد لدعم فحص التكامل.';

    public function __construct(private UnifiedLogger $logger)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $path = $this->logger->write();
        $this->info('تم إنشاء التقرير المدمج في: '.$path);

        return self::SUCCESS;
    }
}
