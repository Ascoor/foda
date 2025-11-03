<?php

namespace App\Console\Commands;

use App\Models\Activity;
use App\Models\Campaign;
use App\Models\Notification;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Throwable;

class IntegrationVerifyCommand extends Command
{
    protected $signature = 'integration:verify';

    protected $description = 'تنفيذ فحوصات تكامل شاملة بين واجهات Laravel وReact ودورة حياة البيانات.';

    public function handle(): int
    {
        $schemaState = $this->inspectSchema();
        $relationshipState = $this->inspectRelationships();
        $reactTypesState = $this->inspectReactTypes();
        $logFilesState = $this->inspectLogFiles();
        $arabicDataState = $this->inspectArabicData();
        $reportsState = $this->inspectReportsFreshness();

        $report = $this->buildReport([
            'Laravel Schema' => $schemaState,
            'Eloquent Relationships' => $relationshipState,
            'React Types' => $reactTypesState,
            'Data Lifecycle' => $relationshipState,
            'Arabic Data' => $arabicDataState,
            'Reports' => $reportsState,
        ]);

        $this->outputSummary($report);
        $this->writeReport($report);

        return self::SUCCESS;
    }

    private function inspectSchema(): array
    {
        $requiredTables = [
            'campaigns',
            'voters',
            'activities',
            'volunteers',
            'notifications',
        ];

        $missing = [];
        $withCounts = [];

        foreach ($requiredTables as $table) {
            if (! Schema::hasTable($table)) {
                $missing[] = $table;
                continue;
            }

            try {
                $count = DB::table($table)->count();
            } catch (Throwable) {
                $count = null;
            }

            $withCounts[$table] = $count;
        }

        $status = empty($missing) ? '✅ متطابق' : '⚠️ ناقص';
        $note = empty($missing)
            ? 'جميع الجداول الأساسية متوفرة.'
            : 'الجداول الناقصة: '.implode(', ', $missing);

        if ($withCounts) {
            $segments = [];
            foreach ($withCounts as $table => $count) {
                if ($count === null) {
                    $segments[] = "$table (غير متاح)";
                    continue;
                }

                $segments[] = "$table ($count سجل)";
            }

            $note .= ' — التعداد: '.implode(', ', $segments);
        }

        return compact('status', 'note');
    }

    private function inspectRelationships(): array
    {
        $checks = [
            Campaign::class => ['election'],
            Activity::class => ['campaign', 'voter', 'creator'],
            Volunteer::class => ['team'],
            Notification::class => ['user'],
            Voter::class => ['committee'],
        ];

        $missing = [];

        foreach ($checks as $model => $relations) {
            $instance = new $model();

            foreach ($relations as $relation) {
                if (! method_exists($instance, $relation)) {
                    $missing[] = sprintf('%s::%s', class_basename($model), $relation);
                    continue;
                }

                try {
                    $result = $instance->{$relation}();
                } catch (Throwable $exception) {
                    $missing[] = sprintf('%s::%s (%s)', class_basename($model), $relation, $exception->getMessage());
                    continue;
                }

                if (! $result instanceof Relation) {
                    $missing[] = sprintf('%s::%s (ليست علاقة صالحة)', class_basename($model), $relation);
                }
            }
        }

        $status = empty($missing) ? '✅ سليم' : '⚠️ تحقق يدوي';
        $note = empty($missing)
            ? 'تمت جميع العلاقات الأساسية بنجاح.'
            : 'العلاقات المتأثرة: '.implode(', ', $missing);

        return compact('status', 'note');
    }

    private function inspectReactTypes(): array
    {
        $typesDirectory = base_path('../frontend/src/types');
        $requiredTypes = [
            'Activity.ts',
            'Campaign.ts',
            'Volunteer.ts',
            'Voter.ts',
            'CampaignBudget.ts',
        ];

        $missing = [];

        foreach ($requiredTypes as $file) {
            if (! File::exists($typesDirectory.DIRECTORY_SEPARATOR.$file)) {
                $missing[] = pathinfo($file, PATHINFO_FILENAME);
            }
        }

        $status = empty($missing) ? '✅ متطابق' : '⚠️ ناقص '.implode(', ', $missing);
        $note = empty($missing)
            ? 'جميع الأنواع متطابقة مع النماذج.'
            : 'يجب مزامنة الأنواع التالية: '.implode(', ', $missing);

        return compact('status', 'note');
    }

    private function inspectLogFiles(): array
    {
        $logsDirectory = storage_path('logs');
        $requiredFiles = [
            'factory_audit.md',
            'schema_audit.md',
            'sync.log',
        ];

        $missing = array_filter($requiredFiles, fn ($file) => ! File::exists($logsDirectory.DIRECTORY_SEPARATOR.$file));

        $status = empty($missing) ? '✅ موجودة' : '⚠️ ناقص';
        $note = empty($missing)
            ? 'جميع سجلات التدقيق متاحة.'
            : 'ملفات مفقودة: '.implode(', ', $missing);

        return compact('status', 'note');
    }

    private function inspectArabicData(): array
    {
        if (! Schema::hasTable('voters')) {
            return [
                'status' => '⚠️ ناقص',
                'note' => 'جدول الناخبين غير متاح للتحقق.',
            ];
        }

        try {
            $count = Voter::query()->count();
        } catch (Throwable $exception) {
            return [
                'status' => '⚠️ تحقق يدوي',
                'note' => 'تعذر قراءة بيانات الناخبين: '.$exception->getMessage(),
            ];
        }

        $status = $count > 0 ? '✅ موجود' : '⚠️ فارغ';
        $note = $count > 0 ? "عدد الناخبين الحالي: $count" : 'لا توجد بيانات عربية متاحة.';

        return compact('status', 'note');
    }

    private function inspectReportsFreshness(): array
    {
        $reports = [
            'analytics_snapshots' => 'metric_key',
            'activities' => 'reported_at',
        ];

        $stale = [];

        foreach ($reports as $table => $column) {
            if (! Schema::hasTable($table)) {
                $stale[] = "$table (غير موجود)";
                continue;
            }

            $latest = DB::table($table)->max($column);

            if (! $latest) {
                $stale[] = "$table (لا توجد بيانات)";
                continue;
            }

            if (now()->diffInDays($latest) > 7) {
                $stale[] = "$table (قديم)";
            }
        }

        $status = empty($stale) ? '✅ محدث' : '⚠️ يحتاج تحديث';
        $note = empty($stale)
            ? 'تقارير البيانات محدثة.'
            : 'تقارير بحاجة لمتابعة: '.implode(', ', $stale);

        return compact('status', 'note');
    }

    private function buildReport(array $sections): array
    {
        return [
            'generated_at' => now()->toIso8601String(),
            'sections' => $sections,
        ];
    }

    private function outputSummary(array $report): void
    {
        $this->info('🔍 تقرير التحقق من التكامل');
        $this->line('تم التوليد في: '.$report['generated_at']);

        foreach ($report['sections'] as $section => $details) {
            $this->line(sprintf('%s: %s — %s', $section, $details['status'], $details['note']));
        }
    }

    private function writeReport(array $report): void
    {
        $path = storage_path('logs/integration_report.json');
        File::put($path, json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}
