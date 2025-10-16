<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\ElectionResultsUpdated;
use App\Http\Controllers\Controller;
use App\Services\ElectionDataService;
use App\Services\GeoDataService;
use App\Services\GoogleMapsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LiveDataController extends Controller
{
    public function __construct(
        protected ElectionDataService $electionData,
        protected GeoDataService $geoData,
        protected GoogleMapsService $mapsService
    ) {
    }

    public function election(Request $request, string $electionId): JsonResponse
    {
        $results = (bool) $request->input('refresh', false)
            ? $this->electionData->refreshLiveResults($electionId)
            : $this->electionData->getLiveResults($electionId);

        if ((bool) $request->input('broadcast', true)) {
            ElectionResultsUpdated::dispatch($electionId, $results);
        }

        return response()->json([
            'data' => [
                'election_id' => $electionId,
                'results' => $results,
            ],
        ]);
    }

    public function geo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'radius' => 'nullable|numeric|min:0',
            'region' => 'nullable|string|max:120',
            'level' => 'nullable|string|max:120',
        ]);

        $payload = array_filter($validated, static fn ($value) => $value !== null && $value !== '');
        $data = $this->geoData->getLiveGeoData($payload);

        return response()->json(['data' => $data]);
    }

    public function geocode(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'components' => 'nullable|array',
            'components.*' => 'string',
        ]);

        $results = $this->mapsService->geocodeAddress($validated['address'], $validated['components'] ?? []);

        return response()->json(['data' => $results]);
    }
}
