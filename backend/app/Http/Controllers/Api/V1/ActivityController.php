<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\ActivityCreated;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'type' => ['sometimes', 'string'],
            'status' => ['sometimes', 'string'],
            'area_id' => ['sometimes', 'integer'],
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
        ]);

        $activities = Activity::query()
            ->with(['area', 'committee', 'creator'])
            ->forType($request->string('type')->toString())
            ->forStatus($request->string('status')->toString())
            ->forRegion($request->integer('area_id'))
            ->when($request->filled('from') || $request->filled('to'), function ($query) use ($request) {
                $from = $request->filled('from') ? Carbon::parse($request->string('from')->toString())->startOfDay() : null;
                $to = $request->filled('to') ? Carbon::parse($request->string('to')->toString())->endOfDay() : null;
                $query->betweenDates($from, $to);
            })
            ->orderByDesc('reported_at')
            ->orderByDesc('created_at');

        return ActivityResource::collection(
            $activities->paginate($request->integer('per_page', 15))->withQueryString()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'committee_id' => ['nullable', 'integer', 'exists:committees,id'],
            'type' => ['required', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'support_score' => ['nullable', 'integer', 'between:0,100'],
            'reported_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ]);

        $activity = Activity::create(array_merge($validated, [
            'created_by' => $request->user()?->id,
        ]));

        $activity->load(['area', 'committee', 'creator']);

        Cache::forget('analytics.v1.overview');
        Cache::forget('activities.recent.50');
        Cache::forget('activities.recent.100');

        broadcast(new ActivityCreated($activity))->toOthers();

        return (new ActivityResource($activity))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Activity $activity): ActivityResource
    {
        return new ActivityResource($activity->load(['area', 'committee', 'creator']));
    }

    public function update(Request $request, Activity $activity): ActivityResource
    {
        $validated = $request->validate([
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'committee_id' => ['nullable', 'integer', 'exists:committees,id'],
            'type' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'max:100'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'support_score' => ['nullable', 'integer', 'between:0,100'],
            'reported_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ]);

        $activity->update($validated);

        return new ActivityResource($activity->fresh(['area', 'committee', 'creator']));
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([], 204);
    }

    public function recent(Request $request)
    {
        $limit = max(1, min(200, $request->integer('limit', 50)));

        $cacheKey = sprintf('activities.recent.%d', $limit);

        $features = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($limit) {
            return Activity::query()
                ->with('area')
                ->whereNotNull('latitude')
                ->whereNotNull('longitude')
                ->orderByDesc('reported_at')
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get()
                ->map(function (Activity $activity) {
                    return [
                        'type' => 'Feature',
                        'geometry' => [
                            'type' => 'Point',
                            'coordinates' => [
                                (float) $activity->longitude,
                                (float) $activity->latitude,
                            ],
                        ],
                        'properties' => [
                            'id' => $activity->id,
                            'type' => $activity->type,
                            'status' => $activity->status,
                            'title' => $activity->title,
                            'support_score' => $activity->support_score,
                            'area_id' => $activity->area_id,
                            'area_name' => $activity->area?->name,
                            'reported_at' => optional($activity->reported_at)->toIso8601String(),
                        ],
                    ];
                })
                ->values();
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }
}
