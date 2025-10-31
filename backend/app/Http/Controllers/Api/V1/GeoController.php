<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\GeoHierarchyService;
use Illuminate\Http\JsonResponse;

class GeoController extends Controller
{
    public function __construct(private GeoHierarchyService $geoService)
    {
        $this->middleware('auth:sanctum');
    }

    public function governorates(): JsonResponse
    {
        return response()->json([
            'data' => $this->geoService->governorates(),
        ]);
    }

    public function districts(int $governorate): JsonResponse
    {
        if (! $this->geoService->hasGovernorate($governorate)) {
            return response()->json([
                'message' => 'Governorate not found.',
                'data' => [],
            ], 404);
        }

        return response()->json([
            'data' => $this->geoService->districts($governorate),
        ]);
    }

    public function electoralCircles(int $district): JsonResponse
    {
        if (! $this->geoService->hasDistrict($district)) {
            return response()->json([
                'message' => 'District not found.',
                'data' => [],
            ], 404);
        }

        return response()->json([
            'data' => $this->geoService->electoralCircles($district),
        ]);
    }
}
