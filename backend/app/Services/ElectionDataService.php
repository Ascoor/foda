<?php

namespace App\Services;

use App\Exceptions\ExternalApiException;
use Illuminate\Support\Facades\Cache;

class ElectionDataService extends ExternalApiService
{
    protected function serviceName(): string
    {
        return 'election';
    }

    public function getLiveResults(string $electionId): array
    {
        return $this->remember('results:' . $electionId, function () use ($electionId) {
            $apiKey = $this->config('api_key');

            if (empty($apiKey)) {
                throw new ExternalApiException($this->serviceName(), 'Missing API key configuration.');
            }

            $response = $this->newRequest()
                ->withToken($apiKey)
                ->get('/results/' . $electionId);

            if ($response->failed()) {
                $this->throwForResponse($response, 'Unable to fetch live election results.');
            }

            return $response->json();
        });
    }

    public function refreshLiveResults(string $electionId): array
    {
        Cache::forget($this->cacheKey('results:' . $electionId));

        return $this->getLiveResults($electionId);
    }
}
