<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Campaign;
use App\Models\GeographicScope;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class GeographicScopeService
{
    public function paginateForCampaign(Campaign $campaign, array $filters = []): LengthAwarePaginator
    {
        $perPage = max(1, min((int) ($filters['per_page'] ?? 15), 100));

        $query = $campaign->geographicScopes()
            ->with(['parent:id,name', 'children', 'committees'])
            ->orderBy('name');

        if (! empty($filters['root_only'])) {
            $query->whereNull('parent_id');
        }

        if (! empty($filters['parent_id'])) {
            $query->where('parent_id', (int) $filters['parent_id']);
        }

        if (! empty($filters['level'])) {
            $query->where('level', $filters['level']);
        }

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(fn ($builder) => $builder->where('name', 'like', $term));
        }

        return $query
            ->paginate($perPage)
            ->appends(Arr::only($filters, ['root_only', 'parent_id', 'level', 'search']));
    }

    public function create(Campaign $campaign, array $payload): GeographicScope
    {
        $attributes = $this->extractAttributes($payload);
        $attributes['campaign_id'] = $campaign->getKey();

        $parentId = $attributes['parent_id'] ?? null;
        if ($parentId !== null) {
            $this->assertParentWithinCampaign($campaign, $parentId);
        }

        $scope = $campaign->geographicScopes()->create($attributes);

        return $scope->load(['parent', 'children', 'committees']);
    }

    public function update(GeographicScope $scope, array $payload): GeographicScope
    {
        $attributes = $this->extractAttributes($payload);

        if (array_key_exists('parent_id', $attributes)) {
            $parentId = $attributes['parent_id'];
            if ($parentId !== null) {
                $this->assertParentWithinCampaign($scope->campaign, $parentId, $scope);
            }

            if ($parentId === $scope->getKey()) {
                unset($attributes['parent_id']);
            }
        }

        $scope->fill($attributes);
        $scope->save();

        return $scope->refresh()->load(['parent', 'children', 'committees']);
    }

    public function delete(GeographicScope $scope): void
    {
        $scope->delete();
    }

    private function extractAttributes(array $payload): array
    {
        $attributes = Arr::only($payload, ['name', 'level', 'area_id', 'parent_id', 'bbox', 'meta']);

        if (array_key_exists('bbox', $attributes) && $attributes['bbox'] === null) {
            unset($attributes['bbox']);
        }

        return $attributes;
    }

    private function assertParentWithinCampaign(Campaign $campaign, int $parentId, ?GeographicScope $scope = null): void
    {
        $parent = $campaign->geographicScopes()->find($parentId);

        if (! $parent) {
            abort(422, __('The selected parent scope is invalid.'));
        }

        if ($scope && $parent->is($scope)) {
            abort(422, __('A scope cannot be its own parent.'));
        }

        if ($scope) {
            $this->guardAgainstCircularReference($scope, $parent);
        }
    }

    private function guardAgainstCircularReference(GeographicScope $scope, GeographicScope $parent): void
    {
        $ancestor = $parent;
        while ($ancestor) {
            if ($ancestor->is($scope)) {
                abort(422, __('A scope cannot become a child of its own descendant.'));
            }

            $ancestor = $ancestor->parent;
        }
    }
}
