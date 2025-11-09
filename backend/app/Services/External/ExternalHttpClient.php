<?php

namespace App\Services\External;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExternalHttpClient
{
    public function get(string $cacheKey, string $url, array $query = [], int $ttlSeconds = 300)
    {
        if ($cacheKey === '' || $url === '') {
            abort(400, json_encode(['status' => 'error', 'errors' => ['Bad external request config']]));
        }

        return Cache::remember($cacheKey, $ttlSeconds, function () use ($url, $query) {
            $resp = Http::timeout(5)
                ->retry(2, 200)
                ->acceptJson()
                ->get($url, $query);

            if ($resp->failed()) {
                abort($resp->status() ?: 502, json_encode([
                    'status' => 'error',
                    'errors' => ['External provider error'],
                ]));
            }

            return $resp->json();
        });
    }
}
