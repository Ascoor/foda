<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\ElectionCircle\Campaign;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CampaignsSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $campaignSpecs = [
                [
                    'name' => 'حملة الدقهلية',
                    'slug' => 'dakahlia-campaign',
                    'description' => 'حملة تغطي جميع مناطق محافظة الدقهلية.',
                    'governorate_slug' => 'dakahlia',
                ],
                [
                    'name' => 'حملة الشرقية',
                    'slug' => 'sharqia-campaign',
                    'description' => 'حملة تغطي جميع مناطق محافظة الشرقية.',
                    'governorate_slug' => 'sharqia',
                ],
            ];

            $summary = [
                'campaigns_created' => 0,
                'campaigns_updated' => 0,
                'campaign_area_links' => [],
            ];

            foreach ($campaignSpecs as $spec) {
                [$campaign, $created] = $this->createOrUpdateCampaign($spec);
                $summary['campaigns_' . ($created ? 'created' : 'updated')]++;

                $areaIds = $this->areaIdsForGovernorate($spec['governorate_slug']);
                $linkStats = $this->linkAreasToCampaign($campaign->id, $areaIds);

                $summary['campaign_area_links'][$campaign->slug] = $linkStats;
            }

            Log::info('CampaignsSeeder completed', $summary);
        });
    }

    private function createOrUpdateCampaign(array $spec): array
    {
        $existing = Campaign::query()->where('slug', $spec['slug'])->first();

        $payload = [
            'name' => Arr::get($spec, 'name'),
            'slug' => Arr::get($spec, 'slug'),
            'description' => Arr::get($spec, 'description'),
            'election_id' => Arr::get($spec, 'election_id'),
            'created_at' => $existing?->created_at ?? now(),
            'updated_at' => now(),
        ];

        $updateColumns = ['name', 'description', 'election_id', 'updated_at'];

        Campaign::query()->upsert([$payload], ['slug'], $updateColumns);

        $campaign = Campaign::query()->where('slug', $spec['slug'])->firstOrFail();

        return [$campaign, $existing === null];
    }

    private function areaIdsForGovernorate(string $governorateSlug): array
    {
        $governorate = Area::query()->where('slug', $governorateSlug)->first();

        if (! $governorate) {
            return [];
        }

        $childIds = Area::query()
            ->where('parent_id', $governorate->id)
            ->pluck('id')
            ->all();

        return array_merge([$governorate->id], $childIds);
    }

    private function linkAreasToCampaign(int $campaignId, array $areaIds): array
    {
        if (empty($areaIds)) {
            return ['created' => 0, 'total' => 0];
        }

        $now = now();
        $existingLinks = DB::table('campaign_area')
            ->where('campaign_id', $campaignId)
            ->whereIn('area_id', $areaIds)
            ->pluck('area_id')
            ->all();

        $rows = [];
        foreach ($areaIds as $areaId) {
            $rows[] = [
                'campaign_id' => $campaignId,
                'area_id' => $areaId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('campaign_area')->upsert($rows, ['campaign_id', 'area_id'], ['updated_at']);

        return [
            'created' => count(array_diff($areaIds, $existingLinks)),
            'total' => count($areaIds),
        ];
    }
}
