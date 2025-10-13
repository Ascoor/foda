<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ElectionCircle\Traits\HandlesIndexRequests;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class GeoAreaController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        $cacheKey = $this->resolveCacheKey($request);

        if (! $cacheKey) {
            return $this->handleIndex($request, GeoArea::query(), ['name']);
        }

        $result = Cache::remember(
            $cacheKey,
            now()->addSeconds($this->cacheTtl()),
            fn () => $this->handleIndex($request, GeoArea::query(), ['name'])
        );

        $this->rememberCacheKey($cacheKey);

        return $result;
    }

    public function show(GeoArea $geoArea)
    {
        return $geoArea;
    }

    public function store(Request $request)
    {
        $geoArea = GeoArea::create($request->all());
        $this->flushIndexCache();
        return response()->json([
            'message' => __('messages.created', ['entity' => 'GeoArea']),
            'data' => $geoArea,
        ]);
    }

    public function update(Request $request, GeoArea $geoArea)
    {
        $geoArea->update($request->all());
        $this->flushIndexCache();
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'GeoArea']),
            'data' => $geoArea,
        ]);
    }

    public function destroy(GeoArea $geoArea)
    {
        $geoArea->delete();
        $this->flushIndexCache();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'GeoArea']),
        ]);
    }

    protected function resolveCacheKey(Request $request): ?string
    {
        if ($request->query()) {
            return null;
        }

        $userId = optional($request->user())->getAuthIdentifier() ?? 'guest';

        return "ec.geo-areas.index.{$userId}";
    }

    protected function cacheRegistryKey(): string
    {
        return 'ec.geo-areas.index.keys';
    }

    protected function cacheTtl(): int
    {
        return 300;
    }

    protected function rememberCacheKey(string $cacheKey): void
    {
        $keys = Cache::get($this->cacheRegistryKey(), []);

        if (! in_array($cacheKey, $keys, true)) {
            $keys[] = $cacheKey;
            Cache::forever($this->cacheRegistryKey(), $keys);
        }
    }

    protected function flushIndexCache(): void
    {
        $keys = Cache::get($this->cacheRegistryKey(), []);

        foreach ($keys as $key) {
            Cache::forget($key);
        }

        Cache::forget($this->cacheRegistryKey());
    }
}
