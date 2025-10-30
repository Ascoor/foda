<?php

namespace App\Services;

use App\Enums\ElectionPhase;
use App\Models\Campaign;
use App\Models\Election;
use App\Models\User;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;

class ElectionService
{
    public function __construct(
        private ScopeService $scopeService,
        private CacheRepository $cache
    ) {
    }

    public function listForCampaign(User $user, Campaign $campaign)
    {
        $cacheKey = sprintf('elections:campaign:%d:user:%d', $campaign->id, $user->id);

        return $this->tagged(['elections', 'campaign:' . $campaign->id])->remember($cacheKey, 60, function () use ($user, $campaign) {
            $query = $this->scopeService
                ->electionsQueryForUser($user)
                ->where('campaign_id', $campaign->id)
                ->orderBy('start_at');

            return $query->get();
        });
    }

    public function show(User $user, int $electionId): ?Election
    {
        return $this->scopeService
            ->electionsQueryForUser($user)
            ->where('id', $electionId)
            ->first();
    }

    public function create(Campaign $campaign, array $payload): Election
    {
        $data = $this->sanitizePayload($payload);
        $data['campaign_id'] = $campaign->id;

        $election = $campaign->elections()->create($data);
        $this->touchCache($campaign->id);

        return $election->refresh();
    }

    public function update(Election $election, array $payload): Election
    {
        $election->fill($this->sanitizePayload($payload))->save();
        $this->touchCache($election->campaign_id);

        return $election->refresh();
    }

    private function sanitizePayload(array $payload): array
    {
        $data = Arr::only($payload, ['name', 'cover_url', 'phase', 'start_at', 'end_at']);

        if (isset($data['phase']) && is_string($data['phase'])) {
            $data['phase'] = ElectionPhase::from($data['phase']);
        }

        if (isset($data['phase']) && $data['phase'] instanceof ElectionPhase) {
            $data['phase'] = $data['phase']->value;
        }

        return $data;
    }

    private function touchCache(int $campaignId): void
    {
        $this->tagged(['elections', 'campaign:' . $campaignId])->flush();
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
