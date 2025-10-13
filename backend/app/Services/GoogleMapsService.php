<?php

namespace App\Services;

use App\Exceptions\ExternalApiException;

class GoogleMapsService extends ExternalApiService
{
    protected function serviceName(): string
    {
        return 'google_maps';
    }

    public function geocodeAddress(string $address, array $components = []): array
    {
        $cachePayload = ['address' => $address, 'components' => $components];
        $cacheKey = 'geocode:' . md5(json_encode($cachePayload));

        return $this->remember($cacheKey, function () use ($address, $components) {
            $apiKey = $this->config('api_key');

            if (empty($apiKey)) {
                throw new ExternalApiException($this->serviceName(), 'Missing API key configuration.');
            }

            $query = array_merge(
                ['address' => $address, 'key' => $apiKey],
                $components ? ['components' => $this->formatComponents($components)] : []
            );

            $response = $this->newRequest()->get('/geocode/json', $query);

            if ($response->failed()) {
                $this->throwForResponse($response, 'Unable to geocode address.');
            }

            return [
                'status' => $response->json('status'),
                'results' => $response->json('results', []),
            ];
        });
    }

    protected function formatComponents(array $components): string
    {
        return collect($components)
            ->map(fn ($value, $key) => $key . ':' . $value)
            ->implode('|');
    }
}
