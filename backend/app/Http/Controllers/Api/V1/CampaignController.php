<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Base\ApiController;
use App\Http\Requests\Campaign\StoreCampaignRequest;
use App\Http\Requests\Campaign\UpdateCampaignRequest;
use App\Http\Resources\CampaignResource;
use App\Models\Campaign;
use App\Services\CampaignService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends ApiController
{
    public function __construct(private readonly CampaignService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Campaign::class);

        $campaigns = $this->service->listForUser($request->user(), $request->input('q'));

        return $this->resource(CampaignResource::collection($campaigns));
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $this->authorize('create', Campaign::class);

        $campaign = $this->service->create($request->user(), $request->validated());

        return $this->resource(new CampaignResource($campaign), 201);
    }

    public function show(Campaign $campaign): JsonResponse
    {
        $this->authorize('view', $campaign);

        $campaign = $this->service->loadDetails($campaign);

        return $this->resource(new CampaignResource($campaign));
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $campaign = $this->service->update($campaign, $request->validated());

        return $this->resource(new CampaignResource($campaign));
    }

    public function send(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $campaign = $this->service->send($campaign);

        return $this->resource(new CampaignResource($campaign));
    }

    public function destroy(Campaign $campaign): JsonResponse
    {
        $this->authorize('delete', $campaign);

        $this->service->delete($campaign);

        return $this->noContent();
    }
}
