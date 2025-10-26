<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\LiveElectionResultsUpdated;
use App\Http\Controllers\Controller;
use App\Services\External\ElectionDataService;
use App\Services\External\GeoDataService;
use App\Services\External\GoogleMapsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;

class ExternalDataController extends Controller
{
    public function geoAreas(Request $request, GeoDataService $geoDataService): JsonResponse
    {
        $filters = $request->only([
            'province',
            'state',
            'committee',
            'search',
            'page',
            'per_page',
        ]);

        $areas = $geoDataService->areas($this->cleanupFilters($filters));

        return response()->json(['data' => $areas]);
    }

    public function electionSummary(Request $request, ElectionDataService $electionDataService): JsonResponse
    {
        $filters = $request->only(['province', 'state', 'committee']);

        $normalizedFilters = $this->cleanupFilters($filters);

        $summary = $electionDataService->summary($normalizedFilters);
        $turnout = $electionDataService->turnout($normalizedFilters);

        return response()->json([
            'data' => [
                'summary' => $summary,
                'turnout' => $turnout,
            ],
        ]);
    }

    public function liveResults(Request $request, ElectionDataService $electionDataService): JsonResponse
    {
        $filters = $request->only(['province', 'state', 'committee']);
        $normalizedFilters = $this->cleanupFilters($filters);
        $results = $electionDataService->liveResults($normalizedFilters);

        if ($this->shouldBroadcast($request)) {
            Event::dispatch(new LiveElectionResultsUpdated([
                'results' => $results,
                'filters' => $normalizedFilters,
                'fetched_at' => now()->toIso8601String(),
            ]));
        }

        return response()->json(['data' => $results]);
    }

    public function mapConfiguration(Request $request, GoogleMapsService $googleMapsService): JsonResponse
    {
        $config = $googleMapsService->buildInteractiveConfig($request->all());

        return response()->json(['data' => $config]);
    }

    private function shouldBroadcast(Request $request): bool
    {
        if (! $request->has('broadcast')) {
            return false;
        }

        return filter_var($request->get('broadcast'), FILTER_VALIDATE_BOOLEAN);
    }

    private function cleanupFilters(array $filters): array
    {
        return array_filter($filters, static function ($value) {
            if (is_array($value)) {
                return ! empty($value);
            }

            return $value !== null && $value !== '';
        });
    }
}
