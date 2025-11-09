<?php

namespace App\Services\External;

use App\Exceptions\ExternalApiException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExternalHttpClient
{
    public function __construct(
        private readonly string $serviceName,
        private readonly string $baseUrl,
        private readonly array $headers = [],
        private readonly int $timeout = 5,
        private readonly ?int $cacheTtl = null
    ) {
    }

    /**
     * @return array<mixed>
     */
    public function get(string $endpoint, array $query = [], ?string $cacheKey = null): array
    {
        if ($cacheKey !== null && $this->cacheTtl !== null) {
            return Cache::remember($cacheKey, $this->cacheTtl, function () use ($endpoint, $query) {
                return $this->performRequest($endpoint, $query);
            });
        }

        return $this->performRequest($endpoint, $query);
    }

    /**
     * @return array<mixed>
     */
    private function performRequest(string $endpoint, array $query = []): array
    {
        $response = Http::withHeaders($this->headers)
            ->timeout($this->timeout)
            ->baseUrl($this->baseUrl)
            ->acceptJson()
            ->get($endpoint, $query);

        if ($response->failed()) {
            throw ExternalApiException::fromResponse(
                $this->serviceName,
                $response->status(),
                (string) data_get($response->json(), 'message', '')
            );
        }

        return $response->json() ?? [];
    }
}
