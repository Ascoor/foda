<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\External\ElectionDataService;
use App\Services\External\GeoDataService;
use App\Services\External\GoogleMapsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExternalDataController extends Controller
{
    public function __construct(
        private readonly GeoDataService $geoDataService,
        private readonly ElectionDataService $electionDataService,
        private readonly GoogleMapsService $googleMapsService,
    ) {
    }

    public function geoAreas(Request $request): JsonResponse
    {
        $filters = $this->filtersFromRequest($request);

        $areas = $this->geoDataService->areas($filters);

        return response()->json(['data' => $areas]);
    }

    public function electionSummary(Request $request): JsonResponse
    {
        $filters = $this->filtersFromRequest($request);

        $summary = $this->electionDataService->summary($filters);

        return response()->json(['data' => $summary]);
    }

    public function liveResults(Request $request): JsonResponse
    {
        $filters = $this->filtersFromRequest($request);

        $results = $this->electionDataService->liveResults($filters);

        return response()->json(['data' => $results]);
    }

    public function mapConfiguration(Request $request): JsonResponse
    {
        $filters = $this->filtersFromRequest($request);

        $configuration = $this->googleMapsService->buildInteractiveConfig($filters);

        return response()->json(['data' => $configuration]);
    }

    /**
     * @return array<mixed>
     */
    private function filtersFromRequest(Request $request): array
    {
        $filters = $request->query();

        foreach ($filters as $key => $value) {
            if ($value === null) {
                unset($filters[$key]);
                continue;
            }

            if (is_string($value)) {
                $trimmed = trim($value);
                if ($trimmed === '') {
                    unset($filters[$key]);
                    continue;
                }

                $filters[$key] = $trimmed;
                continue;
            }

            if (is_array($value)) {
                $cleaned = array_filter($value, static fn ($item) => $item !== null && $item !== '');

                if (empty($cleaned)) {
                    unset($filters[$key]);
                    continue;
                }

                $filters[$key] = $cleaned;
                continue;
            }
        }

        return $filters;
    }
}
