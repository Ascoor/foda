<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Campaign;
use App\Models\Committee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class CommitteeService
{
    public function paginateForCampaign(Campaign $campaign, array $filters = []): LengthAwarePaginator
    {
        $perPage = max(1, min((int) ($filters['per_page'] ?? 15), 100));

        $query = $campaign->committees()
            ->with(['geographicScope:id,name,level'])
            ->orderBy('name');

        if (! empty($filters['geographic_scope_id'])) {
            $query->where('geographic_scope_id', (int) $filters['geographic_scope_id']);
        }

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($builder) use ($term): void {
                $builder->where('name', 'like', $term)
                    ->orWhere('code', 'like', $term);
            });
        }

        return $query
            ->paginate($perPage)
            ->appends(Arr::only($filters, ['geographic_scope_id', 'search']));
    }

    public function create(Campaign $campaign, array $payload): Committee
    {
        $scopeId = $payload['geographic_scope_id'] ?? null;
        if ($scopeId !== null) {
            $this->assertScopeWithinCampaign($campaign, (int) $scopeId);
        }

        $attributes = $this->extractAttributes($payload);
        $attributes['campaign_id'] = $campaign->getKey();

        $committee = $campaign->committees()->create($attributes);

        return $committee->load(['geographicScope']);
    }

    public function update(Committee $committee, array $payload): Committee
    {
        $attributes = $this->extractAttributes($payload);

        if (array_key_exists('geographic_scope_id', $attributes) && $attributes['geographic_scope_id'] !== null) {
            $this->assertScopeWithinCampaign($committee->campaign, (int) $attributes['geographic_scope_id']);
        }

        $committee->fill($attributes);
        $committee->save();

        return $committee->refresh()->load(['geographicScope']);
    }

    public function delete(Committee $committee): void
    {
        $committee->delete();
    }

    private function extractAttributes(array $payload): array
    {
        return Arr::only($payload, [
            'name',
            'code',
            'location',
            'lat',
            'lng',
            'meta',
            'area_id',
            'geographic_scope_id',
        ]);
    }

    private function assertScopeWithinCampaign(Campaign $campaign, int $scopeId): void
    {
        $scope = $campaign->geographicScopes()->find($scopeId);

        if (! $scope) {
            abort(422, __('The selected geographic scope is invalid for this campaign.'));
        }
    }
}
