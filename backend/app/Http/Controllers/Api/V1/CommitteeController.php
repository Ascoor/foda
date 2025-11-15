<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Base\ApiController;
use App\Http\Requests\Committee\StoreCommitteeRequest;
use App\Http\Requests\Committee\UpdateCommitteeRequest;
use App\Http\Resources\CommitteeResource;
use App\Models\Campaign;
use App\Models\Committee;
use App\Services\CommitteeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommitteeController extends ApiController
{
    public function __construct(private readonly CommitteeService $service)
    {
    }

    public function index(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('view', $campaign);

        $committees = $this->service->paginateForCampaign($campaign, $request->query());

        return $this->resource(CommitteeResource::collection($committees));
    }

    public function store(StoreCommitteeRequest $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $committee = $this->service->create($campaign, $request->validated());

        return $this->resource(new CommitteeResource($committee), 201);
    }

    public function show(Campaign $campaign, Committee $committee): JsonResponse
    {
        $this->authorize('view', $campaign);
        $this->assertCampaignOwnership($campaign, $committee);

        return $this->resource(new CommitteeResource($committee->loadMissing('geographicScope')));
    }

    public function update(UpdateCommitteeRequest $request, Campaign $campaign, Committee $committee): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $committee);

        $committee = $this->service->update($committee, $request->validated());

        return $this->resource(new CommitteeResource($committee));
    }

    public function destroy(Campaign $campaign, Committee $committee): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $committee);

        $this->service->delete($committee);

        return $this->noContent();
    }

    private function assertCampaignOwnership(Campaign $campaign, Committee $committee): void
    {
        if ((int) $committee->campaign_id !== (int) $campaign->getKey()) {
            abort(404);
        }
    }
}
