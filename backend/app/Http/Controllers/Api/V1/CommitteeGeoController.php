<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Committee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use Throwable;

class CommitteeGeoController extends Controller
{
    public function __invoke(Request $request)
    {
        $cacheKey = 'committees.geojson';

        $featuresResolver = function (): Collection {
            return Committee::query()
                ->with('geoArea')
                ->withCount(['agents', 'voters'])
                ->get()
                ->map(function (Committee $committee) {
                    $coordinates = $this->parseCoordinates($committee->location);

                    if (!$coordinates) {
                        return null;
                    }

                    return [
                        'type' => 'Feature',
                        'geometry' => [
                            'type' => 'Point',
                            'coordinates' => [$coordinates['lng'], $coordinates['lat']],
                        ],
                        'properties' => [
                            'id' => $committee->id,
                            'name' => $committee->name,
                            'geo_area' => $committee->geoArea?->name,
                            'agents_count' => $committee->agents_count,
                            'voters_count' => $committee->voters_count,
                        ],
                    ];
                })
                ->filter()
                ->values();
        };

        try {
            $features = Cache::remember($cacheKey, now()->addMinutes(5), $featuresResolver);
        } catch (Throwable $exception) {
            report($exception);
            $features = $featuresResolver();
        }

        if ($features instanceof Collection) {
            $features = $features->all();
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    private function parseCoordinates(?string $location): ?array
    {
        if (!$location) {
            return null;
        }

        if (preg_match('/(-?\d+\.\d+),\s*(-?\d+\.\d+)/', $location, $matches)) {
            return [
                'lat' => (float) $matches[1],
                'lng' => (float) $matches[2],
            ];
        }

        return null;
    }
}
