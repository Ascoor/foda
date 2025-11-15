<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Campaign;
use App\Models\Committee;
use App\Models\GeographicScope;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;

class CampaignService
{
    public function listForUser(User $user, ?string $search = null): Collection
    {
        $query = $user->campaigns()
            ->select('campaigns.*')
            ->withPivot(['role', 'status', 'permissions'])
            ->with(['geographicScopes' => fn ($scopes) => $scopes->with('children', 'committees')])
            ->orderByDesc('campaigns.start_date');

        if ($search) {
            $like = '%' . $search . '%';
            $query->where(function ($builder) use ($like): void {
                $builder->where('campaigns.name', 'like', $like)
                    ->orWhere('campaigns.slug', 'like', $like)
                    ->orWhere('campaigns.description', 'like', $like);
            });
        }

        return $query->get();
    }

    public function create(User $owner, array $payload): Campaign
    {
        $payload = $this->ensureSlug($payload);

        $scopePayload = Arr::pull($payload, 'geographic_scopes', []);

        return DB::transaction(function () use ($owner, $payload, $scopePayload): Campaign {
            $campaign = Campaign::query()->create($payload);

            $owner->campaigns()->syncWithoutDetaching([
                $campaign->getKey() => [
                    'role' => 'owner',
                    'status' => 'active',
                ],
            ]);

            if ($scopePayload) {
                $this->rebuildGeographicScopes($campaign, $scopePayload);
            }

            return $campaign->refresh()->load([
                'geographicScopes' => fn ($query) => $query->with('children', 'committees'),
                'committees',
            ]);
        });
    }

    public function update(Campaign $campaign, array $payload): Campaign
    {
        if (array_key_exists('slug', $payload) && (! is_string($payload['slug']) || trim((string) $payload['slug']) === '')) {
            unset($payload['slug']);
        }

        $scopePayload = Arr::pull($payload, 'geographic_scopes', null);

        $campaign->fill($payload);
        $campaign->save();

        if (is_array($scopePayload)) {
            DB::transaction(function () use ($campaign, $scopePayload): void {
                $this->rebuildGeographicScopes($campaign, $scopePayload);
            });
        }

        return $campaign->refresh()->load([
            'geographicScopes' => fn ($query) => $query->with('children', 'committees'),
            'committees',
        ]);
    }

    public function delete(Campaign $campaign): void
    {
        $campaign->delete();
    }

    /**
     * Ensure the campaign payload contains a unique slug.
     */
    private function ensureSlug(array $payload): array
    {
        $provided = $payload['slug'] ?? null;

        if (is_string($provided)) {
            $provided = trim($provided);
        }

        if (is_string($provided) && $provided !== '') {
            $normalised = Str::slug($provided);

            if ($normalised === '') {
                $normalised = Str::lower(Str::random(8));
            }

            $payload['slug'] = $this->uniqueSlug($normalised);

            return $payload;
        }

        $name = (string) ($payload['name'] ?? '');
        $baseSlug = Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug = Str::lower(Str::random(8));
        }

        $payload['slug'] = $this->uniqueSlug($baseSlug);

        return $payload;
    }

    private function uniqueSlug(string $baseSlug): string
    {
        $slug = $baseSlug;
        $suffix = 1;

        while (Campaign::query()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }

    private function rebuildGeographicScopes(Campaign $campaign, array $scopes): void
    {
        $campaign->geographicScopes()->delete();

        $this->storeScopes($campaign, $scopes);
    }

    private function storeScopes(Campaign $campaign, array $scopes, ?GeographicScope $parent = null): void
    {
        foreach ($scopes as $scopeData) {
            $committees = Arr::pull($scopeData, 'committees', []);
            $children = Arr::pull($scopeData, 'children', []);

            $filteredScope = Arr::only($scopeData, ['name', 'level', 'area_id', 'bbox', 'meta']);
            $scope = $campaign->geographicScopes()->create(array_merge($filteredScope, [
                'parent_id' => $parent?->getKey(),
            ]));

            foreach ($committees as $committeeData) {
                $committeeAttributes = Arr::only($committeeData, ['name', 'code', 'location', 'lat', 'lng', 'meta', 'area_id']);
                $committeeAttributes['campaign_id'] = $campaign->getKey();
                $committeeAttributes['geographic_scope_id'] = $scope->getKey();

                Committee::query()->create($committeeAttributes);
            }

            if ($children) {
                $this->storeScopes($campaign, $children, $scope);
            }
        }
    }
}
