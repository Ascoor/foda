<?php

namespace App\Services;

use App\Data\ResolvedScope;
use App\Enums\MembershipScopeType;
use App\Models\Area;
use App\Models\Campaign;
use App\Models\Election;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ScopeService
{
    public function __construct(private CacheRepository $cache)
    {
    }

    public function resolveForUser(User $user): ResolvedScope
    {
        $cacheKey = sprintf('scopes:user:%d', $user->id);

        return $this->tagged(['scopes', 'user:' . $user->id])->remember($cacheKey, 600, function () use ($user) {
            $memberships = Membership::query()
                ->where('user_id', $user->id)
                ->get(['scope_type', 'scope_id']);

            if ($memberships->isEmpty()) {
                return ResolvedScope::empty();
            }

            $areaIds = $this->expandAreaMemberships($memberships);
            $campaignIds = $this->collectCampaignIds($memberships, $areaIds);

            return new ResolvedScope(
                array_values(array_unique($areaIds)),
                array_values(array_unique($campaignIds))
            );
        });
    }

    public function campaignsQueryForUser(User $user): Builder
    {
        $scope = $this->resolveForUser($user);

        return Campaign::query()
            ->where(function (Builder $query) use ($scope) {
                $hasArea = !empty($scope->areaIds);
                $hasCampaign = !empty($scope->campaignIds);

                if (!$hasArea && !$hasCampaign) {
                    $query->whereRaw('0 = 1');
                    return;
                }

                $conditions = 0;

                if ($hasArea) {
                    $query->whereIn('area_id', $scope->areaIds);
                    $conditions++;
                }

                if ($hasCampaign) {
                    if ($conditions > 0) {
                        $query->orWhereIn('id', $scope->campaignIds);
                    } else {
                        $query->whereIn('id', $scope->campaignIds);
                    }
                }
            })
            ->with(['area', 'owner']);
    }

    public function electionsQueryForUser(User $user): Builder
    {
        $scope = $this->resolveForUser($user);

        return Election::query()
            ->where(function (Builder $query) use ($scope) {
                $hasCampaign = !empty($scope->campaignIds);
                $hasArea = !empty($scope->areaIds);

                if (!$hasCampaign && !$hasArea) {
                    $query->whereRaw('0 = 1');
                    return;
                }

                $conditions = 0;

                if ($hasCampaign) {
                    $query->whereIn('campaign_id', $scope->campaignIds);
                    $conditions++;
                }

                if ($hasArea) {
                    $method = $conditions > 0 ? 'orWhereHas' : 'whereHas';
                    $query->{$method}('campaign', fn (Builder $sub) => $sub->whereIn('area_id', $scope->areaIds));
                }
            })
            ->with(['campaign.area']);
    }

    public function clearCacheForUser(User $user): void
    {
        $this->tagged(['scopes', 'user:' . $user->id])->flush();
    }

    private function expandAreaMemberships(Collection $memberships): array
    {
        $areaIds = $memberships
            ->where('scope_type', MembershipScopeType::Area->value)
            ->pluck('scope_id')
            ->all();

        if (empty($areaIds)) {
            return [];
        }

        $allAreas = Area::query()->get(['id', 'parent_id']);
        $descendants = [];

        foreach ($areaIds as $areaId) {
            $descendants[] = $areaId;
            $descendants = array_merge($descendants, $this->collectDescendants($allAreas, $areaId));
        }

        return $descendants;
    }

    private function collectCampaignIds(Collection $memberships, array $areaIds): array
    {
        $campaignIds = $memberships
            ->where('scope_type', MembershipScopeType::Campaign->value)
            ->pluck('scope_id')
            ->all();

        if (!empty($areaIds)) {
            $campaignIds = array_merge(
                $campaignIds,
                Campaign::query()->whereIn('area_id', $areaIds)->pluck('id')->all()
            );
        }

        return $campaignIds;
    }

    private function collectDescendants(Collection $areas, int $areaId): array
    {
        $children = $areas->where('parent_id', $areaId);

        if ($children->isEmpty()) {
            return [];
        }

        return $children->flatMap(function ($child) use ($areas) {
            return array_merge([$child->id], $this->collectDescendants($areas, $child->id));
        })->all();
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
