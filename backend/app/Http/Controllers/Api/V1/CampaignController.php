<?php

namespace App\Http\Controllers\Api\V1;

use App\Data\CampaignFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Http\Resources\CampaignResource;
use App\Models\Campaign;
use App\Services\CampaignService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class CampaignController extends Controller
{
    public function __construct(private CampaignService $campaignService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = CampaignFilters::fromArray($request->all());
        $campaigns = $this->campaignService->listForUser($request->user(), $filters);

        return response()->json(
            CampaignResource::collection($campaigns)->additional(['meta' => ['has_more' => $campaigns->hasMorePages()]])
        );
    }

    public function show(Request $request, Campaign $campaign): JsonResponse
    {
        Gate::authorize('view', $campaign);

        return response()->json(new CampaignResource($campaign->loadMissing(['elections'])));
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $this->authorize('create', Campaign::class);

        $campaign = $this->campaignService->create($request->user(), $request->validated());

        return response()->json(new CampaignResource($campaign), Response::HTTP_CREATED);
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): JsonResponse
    {
        Gate::authorize('update', $campaign);

        $campaign = $this->campaignService->update($campaign, $request->validated());

        return response()->json(new CampaignResource($campaign));
    }

    public function archive(Request $request, Campaign $campaign): JsonResponse
    {
        Gate::authorize('update', $campaign);

        $campaign = $this->campaignService->archive($campaign);

        return response()->json(new CampaignResource($campaign));
    }
}
