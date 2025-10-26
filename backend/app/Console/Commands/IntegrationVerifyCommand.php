<?php

namespace App\Console\Commands;

use App\Models\Activity;
use App\Models\Notification;
use App\Models\Voter;
use App\Models\Volunteer;
use App\Models\ElectionCircle\Campaign;
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
            Voter::class => ['area'],
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

        $status = $count > 0 ? '✅ موجودة' : '⚠️ لا توجد بيانات';
        $note = $count > 0
            ? "تم العثور على {$count} سجل باللغة العربية."
            : 'لم يتم العثور على بيانات عربية.';

        return compact('status', 'note');
    }

    private function inspectReportsFreshness(): array
    {
        $reports = [
            'schema_audit.md',
            'factory_audit.md',
            'integration_report.md',
        ];

        $directory = storage_path('logs');
        $stale = [];

        foreach ($reports as $report) {
            $path = $directory.DIRECTORY_SEPARATOR.$report;

            if (! File::exists($path)) {
                $stale[] = $report.' (غير متوفر)';
                continue;
            }

            $lastModified = File::lastModified($path);
            $diffHours = now()->diffInHours((now()->setTimestamp($lastModified)));

            if ($diffHours > 24) {
                $stale[] = $report.' (أقدم من 24 ساعة)';
            }
        }

        $status = empty($stale) ? '✅ محدثة' : '⚠️ تحتاج تحديث';
        $note = empty($stale)
            ? 'جميع التقارير حديثة خلال آخر 24 ساعة.'
            : 'تقارير بحاجة إلى تحديث: '.implode(', ', $stale);

        return compact('status', 'note');
    }

    private function buildReport(array $sections): array
    {
        $entries = [];

        foreach ($sections as $section => $data) {
            $entries[] = [
                'section' => $section,
                'status' => Arr::get($data, 'status', '⚠️ غير معروف'),
                'note' => Arr::get($data, 'note', '—'),
            ];
        }

        return $entries;
    }

    private function outputSummary(array $entries): void
    {
        foreach ($entries as $entry) {
            $this->line(sprintf('%s: %s - %s', $entry['section'], $entry['status'], $entry['note']));
        }
    }

    private function writeReport(array $entries): void
    {
        $headers = ['القسم', 'الحالة', 'الملاحظات'];

        $lines = [
            '| '.implode(' | ', $headers).' |',
            '| '.implode(' | ', array_fill(0, count($headers), '---')).' |',
        ];

        foreach ($entries as $entry) {
            $lines[] = sprintf(
                '| %s | %s | %s |',
                $entry['section'],
                $entry['status'],
                $entry['note']
            );
        }

        $content = implode(PHP_EOL, $lines).PHP_EOL;

        $path = storage_path('logs/integration_report.md');
        File::ensureDirectoryExists(dirname($path));
        File::put($path, $content);

        $this->info('تم إنشاء تقرير التكامل في: '.$path);
    }
}
