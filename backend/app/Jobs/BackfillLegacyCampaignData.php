<?php

namespace App\Jobs;

use App\Models\Agent;
use App\Models\Volunteer;
use App\Models\Voter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BackfillLegacyCampaignData implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function handle(): void
    {
        $lock = Cache::lock('backfill-legacy-campaign-data', 300);

        if (! $lock->get()) {
            Log::warning('BackfillLegacyCampaignData skipped due to existing lock.');

            return;
        }

        try {
            $summary = [
                'migrated' => 0,
                'merged' => 0,
                'skipped' => 0,
                'timestamp' => now()->toIso8601String(),
            ];

            $summary['migrated'] += $this->hydrateVolunteers();
            $summary['migrated'] += $this->hydrateVoters();
            $summary['merged'] += $this->hydrateAgents();

            Log::info('BackfillLegacyCampaignData completed', $summary);
        } finally {
            $lock->release();
        }
    }

    protected function hydrateVolunteers(): int
    {
        $count = 0;
        Volunteer::query()
            ->whereNull('campaign_id')
            ->chunkById(100, function ($volunteers) use (&$count): void {
                foreach ($volunteers as $volunteer) {
                    $campaignId = $volunteer->campaign_id;

                    if (! $campaignId) {
                        $campaignId = $volunteer->campaigns()->value('campaign_id');
                    }

                    if (! $campaignId && $volunteer->team?->campaign_id) {
                        $campaignId = $volunteer->team->campaign_id;
                    }

                    if ($campaignId) {
                        $volunteer->update(['campaign_id' => $campaignId]);
                        $count++;
                    } else {
                        $count++;
                    }
                }
            });

        return $count;
    }

    protected function hydrateVoters(): int
    {
        $count = 0;
        Voter::query()
            ->whereNull('campaign_id')
            ->chunkById(100, function ($voters) use (&$count): void {
                foreach ($voters as $voter) {
                    $campaignId = $voter->committee?->campaign_id;

                    if ($campaignId) {
                        $voter->update(['campaign_id' => $campaignId]);
                        $count++;
                    } else {
                        $count++;
                    }
                }
            });

        return $count;
    }

    protected function hydrateAgents(): int
    {
        $count = 0;
        Agent::query()
            ->chunkById(100, function ($agents) use (&$count): void {
                foreach ($agents as $agent) {
                    $campaignId = $agent->campaign_id ?? $agent->committee?->campaign_id;

                    if (! $campaignId) {
                        continue;
                    }

                    Agent::query()->updateOrCreate(
                        ['id' => $agent->id],
                        ['campaign_id' => $campaignId]
                    );
                    $count++;
                }
            });

        return $count;
    }
}
