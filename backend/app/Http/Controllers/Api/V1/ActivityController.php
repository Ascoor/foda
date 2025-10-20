<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\ActivityCreated;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'campaign_id' => ['sometimes', 'integer', 'exists:campaigns,id'],
            'volunteer_id' => ['sometimes', 'integer', 'exists:volunteers,id'],
            'voter_id' => ['sometimes', 'integer', 'exists:voters,id'],
            'activity_type' => ['sometimes', 'string', 'max:50'],
            'type' => ['sometimes', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:30'],
            'channel' => ['sometimes', 'string', 'max:50'],
            'performed_from' => ['sometimes', 'date'],
            'performed_to' => ['sometimes', 'date'],
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
        ]);

        $activityType = (string) $request->input('activity_type', $request->input('type', ''));
        $status = (string) $request->input('status', '');
        $channel = (string) $request->input('channel', '');
        $performedFrom = $request->input('performed_from', $request->input('from'));
        $performedTo = $request->input('performed_to', $request->input('to'));

        $activities = Activity::query()
            ->with(['campaign', 'volunteer', 'voter'])
            ->when($request->filled('campaign_id'), function ($query) use ($request) {
                $query->where('campaign_id', (int) $request->input('campaign_id'));
            })
            ->when($request->filled('volunteer_id'), function ($query) use ($request) {
                $query->where('volunteer_id', (int) $request->input('volunteer_id'));
            })
            ->when($request->filled('voter_id'), function ($query) use ($request) {
                $query->where('voter_id', (int) $request->input('voter_id'));
            })
            ->when($activityType !== '', function ($query) use ($activityType) {
                $query->where('activity_type', $activityType);
            })
            ->when($status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($channel !== '', function ($query) use ($channel) {
                $query->where('channel', $channel);
            })
            ->when($performedFrom, function ($query, $from) {
                $query->where('performed_at', '>=', Carbon::parse((string) $from)->startOfDay());
            })
            ->when($performedTo, function ($query, $to) {
                $query->where('performed_at', '<=', Carbon::parse((string) $to)->endOfDay());
            })
            ->orderByDesc('performed_at')
            ->orderByDesc('created_at');

        return ActivityResource::collection(
            $activities->paginate((int) $request->input('per_page', 15))->withQueryString()
        );
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $validated = $request->validate([
            'campaign_id' => ['required', 'integer', 'exists:campaigns,id'],
            'volunteer_id' => ['sometimes', 'nullable', 'integer', 'exists:volunteers,id'],
            'voter_id' => ['sometimes', 'nullable', 'integer', 'exists:voters,id'],
            'activity_type' => ['required', 'string', 'max:50'],
            'status' => ['sometimes', 'nullable', 'string', 'max:30'],
            'channel' => ['sometimes', 'nullable', 'string', 'max:50'],
            'performed_at' => ['required', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'metadata' => ['sometimes', 'nullable', 'array'],
        ]);

        $activity = Activity::create($validated);

        $activity->load(['campaign', 'volunteer', 'voter']);

        Cache::forget('analytics.v1.overview');
        Cache::forget('activities.recent.50');
        Cache::forget('activities.recent.100');
        Cache::forget(sprintf('activities.recent.%d.%d', $user->id, 50));
        Cache::forget(sprintf('activities.recent.%d.%d', $user->id, 100));

        broadcast(new ActivityCreated($activity))->toOthers();

        return (new ActivityResource($activity))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Activity $activity): ActivityResource
    {
        return new ActivityResource($activity->load(['campaign', 'volunteer', 'voter']));
    }

    public function update(Request $request, Activity $activity): ActivityResource
    {
        $validated = $request->validate([
            'campaign_id' => ['sometimes', 'integer', 'exists:campaigns,id'],
            'volunteer_id' => ['sometimes', 'nullable', 'integer', 'exists:volunteers,id'],
            'voter_id' => ['sometimes', 'nullable', 'integer', 'exists:voters,id'],
            'activity_type' => ['sometimes', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:30'],
            'channel' => ['sometimes', 'nullable', 'string', 'max:50'],
            'performed_at' => ['sometimes', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'metadata' => ['sometimes', 'nullable', 'array'],
        ]);

        $activity->update($validated);

        return new ActivityResource($activity->fresh(['campaign', 'volunteer', 'voter']));
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([], 204);
    }

    public function recent(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $request->validate([
            'campaign_id' => ['sometimes', 'integer', 'exists:campaigns,id'],
            'volunteer_id' => ['sometimes', 'integer', 'exists:volunteers,id'],
            'voter_id' => ['sometimes', 'integer', 'exists:voters,id'],
            'activity_type' => ['sometimes', 'string', 'max:50'],
            'type' => ['sometimes', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:30'],
            'channel' => ['sometimes', 'string', 'max:50'],
            'performed_from' => ['sometimes', 'date'],
            'performed_to' => ['sometimes', 'date'],
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
        ]);

        $limit = max(1, min(200, (int) $request->input('limit', 50)));

        $activityType = (string) $request->input('activity_type', $request->input('type', ''));
        $status = (string) $request->input('status', '');
        $channel = (string) $request->input('channel', '');
        $performedFrom = $request->input('performed_from', $request->input('from'));
        $performedTo = $request->input('performed_to', $request->input('to'));

        $cacheable = !($request->filled('campaign_id')
            || $request->filled('volunteer_id')
            || $request->filled('voter_id')
            || $activityType !== ''
            || $status !== ''
            || $channel !== ''
            || $performedFrom
            || $performedTo);

        $cacheKey = sprintf('activities.recent.%d.%d', $user->id, $limit);

        $featuresResolver = function () use ($limit, $request, $activityType, $status, $channel, $performedFrom, $performedTo) {
            return Activity::query()
                ->when($request->filled('campaign_id'), function ($query) use ($request) {
                    $query->where('campaign_id', (int) $request->input('campaign_id'));
                })
                ->when($request->filled('volunteer_id'), function ($query) use ($request) {
                    $query->where('volunteer_id', (int) $request->input('volunteer_id'));
                })
                ->when($request->filled('voter_id'), function ($query) use ($request) {
                    $query->where('voter_id', (int) $request->input('voter_id'));
                })
                ->when($activityType !== '', function ($query) use ($activityType) {
                    $query->where('activity_type', $activityType);
                })
                ->when($status !== '', function ($query) use ($status) {
                    $query->where('status', $status);
                })
                ->when($channel !== '', function ($query) use ($channel) {
                    $query->where('channel', $channel);
                })
                ->when($performedFrom, function ($query, $from) {
                    $query->where('performed_at', '>=', Carbon::parse((string) $from)->startOfDay());
                })
                ->when($performedTo, function ($query, $to) {
                    $query->where('performed_at', '<=', Carbon::parse((string) $to)->endOfDay());
                })
                ->orderByDesc('performed_at')
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get()
                ->map(function (Activity $activity) {
                    $latitude = data_get($activity->metadata, 'location.latitude');
                    $longitude = data_get($activity->metadata, 'location.longitude');

                    if ($latitude === null || $longitude === null) {
                        return null;
                    }

                    return [
                        'type' => 'Feature',
                        'geometry' => [
                            'type' => 'Point',
                            'coordinates' => [
                                (float) $longitude,
                                (float) $latitude,
                            ],
                        ],
                        'properties' => [
                            'id' => $activity->id,
                            'activity_type' => $activity->activity_type,
                            'status' => $activity->status,
                            'channel' => $activity->channel,
                            'performed_at' => optional($activity->performed_at)->toIso8601String(),
                            'campaign_id' => $activity->campaign_id,
                            'volunteer_id' => $activity->volunteer_id,
                            'voter_id' => $activity->voter_id,
                        ],
                    ];
                })
                ->filter()
                ->values();
        };

        try {
            $features = $cacheable
                ? Cache::remember($cacheKey, now()->addMinutes(5), $featuresResolver)
                : $featuresResolver();
        } catch (QueryException $exception) {
            report($exception);
            $features = collect();
        }

        if ($features instanceof Collection) {
            $features = $features->all();
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }
}
