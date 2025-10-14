<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;

class ProfileApiCommand extends Command
{
    protected $signature = 'api:profile {--top=10 : عدد الاستدعاءات المطلوب تنفيذها}';

    protected $description = 'تنفيذ استدعاءات لأكثر واجهات API استخدامًا وتسجيل الأداء.';

    public function handle(HttpKernel $kernel): int
    {
        $top = (int) $this->option('top');
        $top = max(1, $top);

        $endpoints = [
            '/api/v1/voters',
            '/api/v1/campaigns',
            '/api/v1/activities',
        ];

        $metrics = array_fill_keys($endpoints, [
            'times' => [],
            'payloads' => [],
            'statuses' => [],
        ]);

        for ($i = 0; $i < $top; $i++) {
            $endpoint = $endpoints[$i % count($endpoints)];
            $request = Request::create($endpoint, 'GET');

            $start = microtime(true);
            $response = $kernel->handle($request);
            $duration = (microtime(true) - $start) * 1000;

            $metrics[$endpoint]['times'][] = $duration;
            $metrics[$endpoint]['payloads'][] = strlen($response->getContent());
            $metrics[$endpoint]['statuses'][] = $response->getStatusCode();

            $kernel->terminate($request, $response);
        }

        $rows = [];

        foreach ($metrics as $endpoint => $data) {
            if (empty($data['times'])) {
                continue;
            }

            $averageTime = array_sum($data['times']) / count($data['times']);
            $averagePayload = array_sum($data['payloads']) / count($data['payloads']);
            $lastStatus = Arr::last($data['statuses']);

            $rows[] = [
                'endpoint' => $endpoint,
                'calls' => count($data['times']),
                'avg_time' => round($averageTime, 2),
                'avg_payload' => round($averagePayload / 1024, 2),
                'last_status' => $lastStatus,
                'max_time' => round(max($data['times']), 2),
            ];
        }

        $this->outputTable($rows);
        $this->writeReport($rows);

        return self::SUCCESS;
    }

    private function outputTable(array $rows): void
    {
        if (empty($rows)) {
            $this->warn('لم يتم تسجيل أي بيانات.');

            return;
        }

        $this->table(
            ['Endpoint', 'Calls', 'Avg Response (ms)', 'Max Response (ms)', 'Avg Payload (KB)', 'Last Status'],
            array_map(fn ($row) => [
                $row['endpoint'],
                $row['calls'],
                $row['avg_time'],
                $row['max_time'],
                $row['avg_payload'],
                $row['last_status'],
            ], $rows)
        );
    }

    private function writeReport(array $rows): void
    {
        $lines = [
            '# API Performance Profile',
            '',
            '| Endpoint | Calls | Avg Response (ms) | Max Response (ms) | Avg Payload (KB) | Last Status |',
            '| --- | --- | --- | --- | --- | --- |',
        ];

        foreach ($rows as $row) {
            $lines[] = sprintf(
                '| %s | %d | %0.2f | %0.2f | %0.2f | %s |',
                $row['endpoint'],
                $row['calls'],
                $row['avg_time'],
                $row['max_time'],
                $row['avg_payload'],
                $row['last_status']
            );
        }

        $content = implode(PHP_EOL, $lines).PHP_EOL;

        $path = storage_path('logs/api_profile.md');
        File::ensureDirectoryExists(dirname($path));
        File::put($path, $content);

        $this->info('تم حفظ تقرير الأداء في: '.$path);
    }
}
