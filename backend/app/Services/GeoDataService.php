<?php

namespace App\Services;

use App\Exceptions\ExternalApiException;

class GeoDataService extends ExternalApiService
{
    protected function serviceName(): string
    {
        return 'geo';
    }

    public function getLiveGeoData(array $parameters = []): array
    {
        ksort($parameters);
        $cacheKey = 'live:' . md5(json_encode($parameters));

        return $this->remember($cacheKey, function () use ($parameters) {
            $apiKey = $this->config('api_key');

            if (empty($apiKey)) {
                throw new ExternalApiException($this->serviceName(), 'Missing API key configuration.');
            }

            $response = $this->newRequest()
                ->withHeaders(['X-API-KEY' => $apiKey])
                ->get('/areas', $parameters);

            if ($response->failed()) {
                $this->throwForResponse($response, 'Unable to fetch live geo data.');
            }

            return $response->json();
        });
    }
}
