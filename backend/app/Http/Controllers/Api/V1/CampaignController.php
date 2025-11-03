<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Campaign\StoreCampaignRequest;
use App\Http\Requests\Campaign\UpdateCampaignRequest;
use App\Http\Resources\Campaign\CampaignCollection;
use App\Http\Resources\Campaign\CampaignResource;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CampaignController extends Controller
{
    public function index(Request $request): CampaignCollection
    {
        $perPage = min((int) $request->input('per_page', 15), 100);
        $this->authorize('viewAny', Campaign::class);

        $campaigns = Campaign::query()
            ->search($request->input('q'))
            ->orderByDesc('starts_at')
            ->paginate($perPage)
            ->appends($request->query());

        return new CampaignCollection($campaigns);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $this->authorize('create', Campaign::class);

        $campaign = Campaign::query()->create($request->validated());

        return (new CampaignResource($campaign))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Request $request, Campaign $campaign): CampaignResource
    {
        $this->authorize('view', $campaign);

        return new CampaignResource($campaign);
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): CampaignResource
    {
        $this->authorize('update', $campaign);

        $campaign->fill($request->validated());
        $campaign->save();

        return new CampaignResource($campaign->refresh());
    }

    public function destroy(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('delete', $campaign);

        $campaign->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}
