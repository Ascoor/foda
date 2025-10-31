<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\GeoHierarchyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function districts(Request $request): JsonResponse
    {
        $governorateId = $this->parseNullableId($request->query('governorate_id'));

        if ($request->has('governorate_id') && $governorateId === null) {
            return response()->json([
                'message' => 'Governorate id must be a valid integer.',
                'data' => [],
            ], 422);
        }

        if ($governorateId !== null && ! $this->geoService->hasGovernorate($governorateId)) {
            return response()->json([
                'message' => 'Governorate not found.',
                'data' => [],
            ], 404);
        }

        return response()->json([
            'data' => $this->geoService->districts($governorateId),
        ]);
    }

    public function circles(Request $request): JsonResponse
    {
        $districtId = $this->parseNullableId($request->query('district_id'));

        if ($request->has('district_id') && $districtId === null) {
            return response()->json([
                'message' => 'District id must be a valid integer.',
                'data' => [],
            ], 422);
        }

        if ($districtId !== null && ! $this->geoService->hasDistrict($districtId)) {
            return response()->json([
                'message' => 'District not found.',
                'data' => [],
            ], 404);
        }

        return response()->json([
            'data' => $this->geoService->circles($districtId),
        ]);
    }

    private function parseNullableId(?string $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $filtered = filter_var($value, FILTER_VALIDATE_INT);

        return $filtered === false ? null : (int) $filtered;
    }
}
