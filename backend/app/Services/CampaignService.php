<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CampaignService
{
    public function listForUser(User $user, ?string $search = null): Collection
    {
        $query = $user->campaigns()
            ->select('campaigns.*')
            ->withPivot(['role', 'status', 'permissions'])
            ->orderByDesc('campaigns.starts_at');

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

        return DB::transaction(function () use ($owner, $payload): Campaign {
            $campaign = Campaign::query()->create($payload);

            $owner->campaigns()->syncWithoutDetaching([
                $campaign->getKey() => [
                    'role' => 'owner',
                    'status' => 'active',
                ],
            ]);

            return $campaign->refresh();
        });
    }

    public function update(Campaign $campaign, array $payload): Campaign
    {
        if (array_key_exists('slug', $payload) && (! is_string($payload['slug']) || trim((string) $payload['slug']) === '')) {
            unset($payload['slug']);
        }

        $campaign->fill($payload);
        $campaign->save();

        return $campaign->refresh();
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
}
