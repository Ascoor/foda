<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\Campaign;
use App\Models\User;
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

        $createdBy = Arr::get($spec, 'created_by');
        if (! $createdBy) {
            $createdBy = User::query()->value('id') ?? User::factory()->create()->getKey();
        }

        $payload = [
            'name' => Arr::get($spec, 'name'),
            'slug' => Arr::get($spec, 'slug'),
            'description' => Arr::get($spec, 'description'),
            'timezone' => Arr::get($spec, 'timezone', 'Africa/Cairo'),
            'starts_at' => Arr::get($spec, 'starts_at', now()->startOfMonth()),
            'ends_at' => Arr::get($spec, 'ends_at', now()->endOfMonth()),
            'spatial_level' => Arr::get($spec, 'spatial_level', 'governorate'),
            'admin_areas' => Arr::get($spec, 'admin_areas', []),
            'status' => Arr::get($spec, 'status', 'active'),
            'bbox' => Arr::get($spec, 'bbox', [29.0, 30.0, 31.0, 32.0]),
            'created_by' => $createdBy,
            'created_at' => $existing?->created_at ?? now(),
            'updated_at' => now(),
        ];

        $updateColumns = ['name', 'description', 'timezone', 'starts_at', 'ends_at', 'spatial_level', 'admin_areas', 'status', 'bbox', 'created_by', 'updated_at'];

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
