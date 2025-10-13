<?php

namespace App\Services\External;

use Illuminate\Support\Str;

class ElectionDataService
{
    private ExternalHttpClient $client;

    public function __construct()
    {
        $config = config('external.elections');
        $cacheTtl = config('external.cache_ttl');

        $this->client = new ExternalHttpClient(
            'elections',
            $config['base_url'],
            $config['headers'] ?? [],
            (int) ($config['timeout'] ?? 5),
            $cacheTtl
        );
    }

    /**
     * @return array<mixed>
     */
    public function summary(array $filters = []): array
    {
        $response = $this->client->get($this->endpoint('summary_endpoint'), $filters, $this->cacheKey('summary', $filters));

        return $response['data'] ?? $response;
    }

    /**
     * @return array<mixed>
     */
    public function liveResults(array $filters = []): array
    {
        $response = $this->client->get($this->endpoint('results_endpoint'), $filters, $this->cacheKey('results', $filters));

        return $response['data'] ?? $response;
    }

    /**
     * @return array<mixed>
     */
    public function turnout(array $filters = []): array
    {
        $response = $this->client->get($this->endpoint('turnout_endpoint'), $filters, $this->cacheKey('turnout', $filters));

        return $response['data'] ?? $response;
    }

    private function endpoint(string $key): string
    {
        return config('external.elections.' . $key, '/');
    }

    private function cacheKey(string $prefix, array $filters): string
    {
        if (empty($filters)) {
            return $prefix;
        }

        return $prefix . ':' . Str::slug(http_build_query($filters));
    }
}
