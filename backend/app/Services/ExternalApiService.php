<?php

namespace App\Services;

use App\Exceptions\ExternalApiException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

abstract class ExternalApiService
{
    abstract protected function serviceName(): string;

    protected function config(string $key, $default = null)
    {
        return data_get(config('services.' . $this->serviceName()), $key, $default);
    }

    protected function newRequest(): PendingRequest
    {
        $baseUrl = $this->config('base_url');

        if (empty($baseUrl)) {
            throw new ExternalApiException($this->serviceName(), 'Missing base URL configuration.');
        }

        return Http::timeout((int) $this->config('timeout', 10))
            ->baseUrl($baseUrl)
            ->acceptJson();
    }

    protected function remember(string $suffix, callable $callback, ?int $ttl = null)
    {
        $key = $this->cacheKey($suffix);
        $ttl = $ttl ?? (int) $this->config('cache_ttl', 60);

        return Cache::remember($key, $ttl, $callback);
    }

    protected function cacheKey(string $suffix): string
    {
        return Str::of('external:' . $this->serviceName() . ':' . $suffix)->replaceMatches('/[^A-Za-z0-9:_-]/', ':')->__toString();
    }

    protected function throwForResponse(Response $response, string $message): void
    {
        throw new ExternalApiException(
            $this->serviceName(),
            $message,
            $response->status(),
            $response->json()
        );
    }
}
