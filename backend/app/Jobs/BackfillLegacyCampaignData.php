<?php

namespace App\Jobs;

use App\Models\Campaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class BackfillLegacyCampaignData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 120;

    public function handle(): void
    {
        DB::transaction(function () {
            $campaign = Campaign::query()->firstOrCreate(
                ['slug' => 'legacy-default-campaign'],
                [
                    'name' => 'Legacy Default Campaign',
                    'description' => 'Auto-generated campaign for legacy records without scoping.',
                    'timezone' => 'Africa/Cairo',
                    'starts_at' => now()->subYear(),
                    'ends_at' => now()->addYear(),
                    'spatial_level' => 'region',
                    'admin_areas' => [],
                    'status' => 'active',
                ]
            );

            foreach ($this->tablesToBackfill() as $table => $options) {
                $this->backfillTable($table, $campaign->getKey(), Arr::get($options, 'unique', []));
            }
        });
    }

    protected function tablesToBackfill(): array
    {
        return [
            'voters' => ['unique' => ['national_id']],
            'volunteers' => [],
            'agents' => ['unique' => ['person_id']],
            'committees' => ['unique' => ['code']],
            'events' => [],
            'activities' => [],
            'finances' => [],
            'swots' => [],
            'sms' => [],
        ];
    }

    protected function backfillTable(string $table, int $campaignId, array $uniqueColumns = []): void
    {
        DB::table($table)
            ->whereNull('campaign_id')
            ->orderBy('id')
            ->chunkById(500, function ($rows) use ($table, $campaignId, $uniqueColumns) {
                foreach ($rows as $row) {
                    try {
                        $query = DB::table($table)->where('id', $row->id);
                        $payload = ['campaign_id' => $campaignId];

                        foreach ($uniqueColumns as $column) {
                            if (! empty($row->{$column})) {
                                $query->whereNull('campaign_id');
                            }
                        }

                        $query->update($payload);
                    } catch (Throwable $exception) {
                        Log::warning('Failed to backfill record', [
                            'table' => $table,
                            'id' => $row->id,
                            'error' => $exception->getMessage(),
                        ]);
                    }
                }
            }, 'id');
    }
}
