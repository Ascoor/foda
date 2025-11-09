<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Traits\ApiResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    use ApiResponse;

    protected function campaign(Request $request)
    {
        return $request->attributes->get('campaign'); // only set after middleware checks
    }

    protected function guardDateRange(array $in): array
    {
        $from = $in['from'] ?? null;
        $to   = $in['to'] ?? null;

        $outFrom = $from ? date_create($from)?->format('Y-m-d H:i:s') : null;
        $outTo   = $to   ? date_create($to)?->format('Y-m-d H:i:s')   : null;

        if ($outFrom && $outTo && $outFrom > $outTo) {
            throw new \InvalidArgumentException('Invalid date range: from > to');
        }

        return ['from' => $outFrom, 'to' => $outTo];
    }

    protected function safeGeo(?array $geo): ?array
    {
        if (! $geo) {
            return null;
        }
        $lat = $geo['lat'] ?? $geo['latitude'] ?? null;
        $lng = $geo['lng'] ?? $geo['longitude'] ?? null;

        if (! is_numeric($lat) || ! is_numeric($lng)) {
            return null;
        }
        $lat = (float) $lat;
        $lng = (float) $lng;
        if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
            return null;
        }

        return ['lat' => $lat, 'lng' => $lng];
    }
}
