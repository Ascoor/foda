<?php

namespace App\Services;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CampaignService
{
    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Campaign
    {
        return DB::transaction(function () use ($data) {
            $campaign = Campaign::create($this->preparePayload($data));

            return $campaign->fresh() ?? $campaign;
        });
    }

    /**
     * @param array<string, mixed> $data
     */
    public function update(Campaign $campaign, array $data): Campaign
    {
        return DB::transaction(function () use ($campaign, $data) {
            $campaign->update($this->preparePayload($data));

            return $campaign->fresh() ?? $campaign;
        });
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    private function preparePayload(array $data): array
    {
        $payload = Arr::only($data, [
            'name',
            'description',
            'election_id',
            'governorate_id',
            'district_id',
            'circle_id',
        ]);

        if (array_key_exists('name', $payload) && is_string($payload['name'])) {
            $payload['name'] = trim($payload['name']);
        }

        if (array_key_exists('description', $payload)) {
            $description = $payload['description'];
            $payload['description'] = ($description === null || $description === '')
                ? null
                : trim((string) $description);
        }

        foreach (['election_id', 'governorate_id', 'district_id', 'circle_id'] as $key) {
            if (array_key_exists($key, $payload) && $payload[$key] !== null) {
                $payload[$key] = (int) $payload[$key];
            }
        }

        return $payload;
    }
}
