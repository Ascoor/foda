<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        return $this->paginateActivities($request);
    }

    public function campaignIndex(Request $request, Campaign $campaign)
    {
        return $this->paginateActivities($request, $campaign);
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        $data['created_by'] = $request->user()?->getKey();

        $activity = Activity::query()->create($data);

        return (new ActivityResource($activity->fresh(['area', 'committee', 'creator'])))->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Activity $activity)
    {
        return new ActivityResource($activity->loadMissing(['area', 'committee', 'creator']));
    }

    public function update(Request $request, Activity $activity)
    {
        $data = $this->validatePayload($request, $activity);

        $activity->fill($data)->save();

        return new ActivityResource($activity->refresh()->loadMissing(['area', 'committee', 'creator']));
    }

    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function recent(Request $request, Campaign $campaign): JsonResponse
    {
        $limit = (int) $request->input('limit', 100);
        $limit = max(1, min($limit, 250));

        $activities = Activity::query()
            ->forCampaign($campaign->getKey())
            ->orderByDesc(DB::raw('COALESCE(reported_at, created_at)'))
            ->limit($limit)
            ->with(['area:id,name'])
            ->get();

        $features = $activities->map(function (Activity $activity) {
            if (!is_numeric($activity->longitude) || !is_numeric($activity->latitude)) {
                return null;
            }

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
                    'id' => $activity->getKey(),
                    'type' => $activity->type,
                    'status' => $activity->status,
                    'support_score' => $activity->support_score,
                    'area_id' => $activity->area_id,
                    'area_name' => $activity->area?->name,
                    'title' => $activity->title,
                    'reported_at' => optional($activity->reported_at)->toIso8601String(),
                ],
            ];
        })->filter()->values();

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    protected function paginateActivities(Request $request, ?Campaign $campaign = null)
    {
        $perPage = (int) $request->input('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $query = Activity::query()
            ->with(['area:id,name', 'committee:id,name', 'creator:id,name'])
            ->orderByDesc(DB::raw('COALESCE(reported_at, created_at)'));

        $campaignId = $campaign?->getKey() ?? $request->integer('campaign_id');
        if ($campaignId) {
            $query->forCampaign($campaignId);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('region')) {
            $query->where('area_id', $request->input('region'));
        }

        if ($request->filled('area_id')) {
            $query->where('area_id', $request->input('area_id'));
        }

        if ($request->filled('committee_id')) {
            $query->where('committee_id', $request->input('committee_id'));
        }

        if ($request->filled('from')) {
            $from = Carbon::parse($request->input('from'));
            $query->whereDate('reported_at', '>=', $from);
        }

        if ($request->filled('to')) {
            $to = Carbon::parse($request->input('to'));
            $query->whereDate('reported_at', '<=', $to);
        }

        if ($request->filled('search')) {
            $term = '%' . $request->input('search') . '%';
            $query->where(function ($inner) use ($term) {
                $inner->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term);
            });
        }

        $paginator = $query->paginate($perPage)->appends($request->query());

        return ActivityResource::collection($paginator);
    }

    protected function validatePayload(Request $request, ?Activity $activity = null): array
    {
        $campaignId = $request->integer('campaign_id') ?? $request->route('campaign');
        if ($campaignId instanceof Campaign) {
            $campaignId = $campaignId->getKey();
        }

        $data = $request->validate([
            'campaign_id' => ['nullable', 'integer', 'exists:campaigns,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'committee_id' => ['nullable', 'integer', 'exists:committees,id'],
            'voter_id' => ['nullable', 'integer', 'exists:voters,id'],
            'type' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'support_score' => ['nullable', 'integer', 'between:0,100'],
            'reported_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ]);

        if ($campaignId && empty($data['campaign_id'])) {
            $data['campaign_id'] = $campaignId;
        }

        return $data;
    }
}
