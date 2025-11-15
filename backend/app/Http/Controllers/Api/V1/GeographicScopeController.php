<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Base\ApiController;
use App\Http\Requests\GeographicScope\StoreGeographicScopeRequest;
use App\Http\Requests\GeographicScope\UpdateGeographicScopeRequest;
use App\Http\Resources\GeographicScopeResource;
use App\Models\Campaign;
use App\Models\GeographicScope;
use App\Services\GeographicScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeographicScopeController extends ApiController
{
    public function __construct(private readonly GeographicScopeService $service)
    {
    }

    public function index(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('view', $campaign);

        $scopes = $this->service->paginateForCampaign($campaign, $request->query());

        return $this->resource(GeographicScopeResource::collection($scopes));
    }

    public function store(StoreGeographicScopeRequest $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $scope = $this->service->create($campaign, $request->validated());

        return $this->resource(new GeographicScopeResource($scope), 201);
    }

    public function show(Campaign $campaign, GeographicScope $geographicScope): JsonResponse
    {
        $this->authorize('view', $campaign);
        $this->assertCampaignOwnership($campaign, $geographicScope);

        return $this->resource(new GeographicScopeResource(
            $geographicScope->loadMissing(['parent', 'children', 'committees'])
        ));
    }

    public function update(UpdateGeographicScopeRequest $request, Campaign $campaign, GeographicScope $geographicScope): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $geographicScope);

        $scope = $this->service->update($geographicScope, $request->validated());

        return $this->resource(new GeographicScopeResource($scope));
    }

    public function destroy(Campaign $campaign, GeographicScope $geographicScope): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $geographicScope);

        $this->service->delete($geographicScope);

        return $this->noContent();
    }

    private function assertCampaignOwnership(Campaign $campaign, GeographicScope $scope): void
    {
        if ((int) $scope->campaign_id !== (int) $campaign->getKey()) {
            abort(404);
        }
    }
}
