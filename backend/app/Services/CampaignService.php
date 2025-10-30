<?php

namespace App\Services;

use App\Data\CampaignFilters;
use App\Enums\CampaignStatus;
use App\Models\Campaign;
use App\Models\User;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CampaignService
{
    public function __construct(
        private ScopeService $scopeService,
        private CacheRepository $cache
    ) {
    }

    public function listForUser(User $user, CampaignFilters $filters): Paginator
    {
        $signature = implode(':', [
            $filters->status?->value ?? 'any',
            $filters->areaId ?? 'any',
            $filters->search ?? 'any',
            $filters->perPage,
        ]);
        $cacheKey = sprintf('campaigns:user:%d:%s', $user->id, md5($signature));

        return $this->tagged(['campaigns', 'user:' . $user->id])->remember($cacheKey, 60, function () use ($user, $filters) {
            $query = $this->scopeService->campaignsQueryForUser($user)
                ->when($filters->status, fn (Builder $q, CampaignStatus $status) => $q->where('status', $status->value))
                ->when($filters->areaId, fn (Builder $q, int $areaId) => $q->where('area_id', $areaId))
                ->when($filters->search, function (Builder $q, string $term) {
                    $like = '%' . Str::lower($term) . '%';
                    $q->whereRaw('LOWER(name) LIKE ?', [$like]);
                })
                ->orderByDesc('created_at');

            return $query->simplePaginate($filters->perPage);
        });
    }

    public function create(User $user, array $payload): Campaign
    {
        $data = $this->sanitizePayload($payload);
        $data['owner_id'] = $user->id;

        $campaign = Campaign::create($data);
        $this->touchCache($user);

        return $campaign->load(['area', 'owner']);
    }

    public function update(Campaign $campaign, array $payload): Campaign
    {
        $campaign->fill($this->sanitizePayload($payload))->save();
        $this->touchCache($campaign->owner ?? $campaign->owner()->first());

        return $campaign->refresh()->load(['area', 'owner']);
    }

    public function archive(Campaign $campaign): Campaign
    {
        $campaign->update(['status' => CampaignStatus::Archived]);
        Cache::tags(['campaigns', 'user:' . $campaign->owner_id])->flush();

        return $campaign->refresh();
    }

    private function sanitizePayload(array $payload): array
    {
        $data = Arr::only($payload, ['name', 'area_id', 'cover_url', 'status']);

        if (isset($data['status']) && is_string($data['status'])) {
            $data['status'] = CampaignStatus::from($data['status']);
        }

        if (isset($data['status']) && $data['status'] instanceof CampaignStatus) {
            $data['status'] = $data['status']->value;
        }

        return $data;
    }

    private function touchCache(?User $user): void
    {
        if (!$user) {
            return;
        }

        $this->tagged(['campaigns'])->flush();
        $this->tagged(['scopes'])->flush();
        $this->scopeService->clearCacheForUser($user);
    }

    private function tagged(array $tags): CacheRepository
    {
        $store = $this->cache->getStore();

        if (method_exists($store, 'tags')) {
            return $this->cache->tags($tags);
        }

        return $this->cache;
    }
}
