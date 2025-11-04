<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Committee;
use Illuminate\Http\JsonResponse;

class CommitteeGeoController extends Controller
{
    public function __invoke(Campaign $campaign): JsonResponse
    {
        $committees = Committee::query()
            ->forCampaign($campaign->getKey())
            ->with(['geoArea'])
            ->withCount(['agents', 'voters'])
            ->get();

        $features = $committees->map(function (Committee $committee) {
            $coordinates = $this->resolveCoordinates($committee);
            if (!$coordinates) {
                return null;
            }

            return [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [
                        $coordinates['lng'],
                        $coordinates['lat'],
                    ],
                ],
                'properties' => [
                    'id' => $committee->getKey(),
                    'name' => $committee->name,
                    'geo_area' => $committee->geoArea?->name,
                    'agents_count' => $committee->agents_count ?? 0,
                    'voters_count' => $committee->voters_count ?? 0,
                ],
            ];
        })->filter()->values();

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    protected function resolveCoordinates(Committee $committee): ?array
    {
        $meta = $committee->geoArea?->meta ?? [];
        $lat = $this->extractCoordinate($meta, ['lat', 'latitude', 'centroid.lat']);
        $lng = $this->extractCoordinate($meta, ['lng', 'longitude', 'centroid.lng']);

        if (!is_numeric($lat) || !is_numeric($lng)) {
            return $this->fallbackCoordinates($committee->getKey());
        }

        return [
            'lat' => (float) $lat,
            'lng' => (float) $lng,
        ];
    }

    protected function extractCoordinate(array $meta, array $candidates): ?float
    {
        foreach ($candidates as $candidate) {
            $value = data_get($meta, $candidate);
            if (is_numeric($value)) {
                return (float) $value;
            }
        }

        return null;
    }

    protected function fallbackCoordinates(int $key): array
    {
        $baseLat = 24.0 + (sin($key) + 1) * 6;
        $baseLng = 28.0 + (cos($key) + 1) * 6;

        return [
            'lat' => round($baseLat, 6),
            'lng' => round($baseLng, 6),
        ];
    }
}
