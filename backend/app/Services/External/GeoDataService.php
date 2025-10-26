<?php

namespace App\Services\External;

use Illuminate\Support\Str;

class GeoDataService
{
    private ExternalHttpClient $client;

    public function __construct()
    {
        $config = config('external.geo');
        $cacheTtl = config('external.cache_ttl');

        $this->client = new ExternalHttpClient(
            'geo',
            $config['base_url'],
            $config['headers'] ?? [],
            (int) ($config['timeout'] ?? 5),
            $cacheTtl
        );
    }

    /**
     * @return array<mixed>
     */
    public function areas(array $filters = []): array
    {
        $cacheKey = $this->cacheKey('geo-areas', $filters);

        $response = $this->client->get($this->endpoint('areas_endpoint'), $filters, $cacheKey);

        return $response['data'] ?? $response;
    }

    private function endpoint(string $key): string
    {
        return config('external.geo.' . $key, '/');
    }

    private function cacheKey(string $prefix, array $filters): string
    {
        if (empty($filters)) {
            return $prefix;
        }

        return $prefix . ':' . Str::slug(http_build_query($filters));
    }
}
