<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Base\ApiController;
use App\Http\Requests\StoreVolunteerRequest;
use App\Http\Requests\UpdateVolunteerRequest;
use App\Http\Resources\VolunteerResource;
use App\Models\Campaign;
use App\Models\Volunteer;
use App\Services\VolunteerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerController extends ApiController
{
    public function __construct(private readonly VolunteerService $service)
    {
    }

    public function index(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('view', $campaign);

        $volunteers = $this->service->listForCampaign($campaign, $request->all());

        return $this->resource(VolunteerResource::collection($volunteers));
    }

    public function store(StoreVolunteerRequest $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $payload = $request->validated();
        $payload['campaign_id'] = $campaign->getKey();

        $volunteer = $this->service->create($payload);

        return $this->resource(new VolunteerResource($volunteer), 201);
    }

    public function show(Campaign $campaign, Volunteer $volunteer): JsonResponse
    {
        $this->authorize('view', $campaign);
        $this->assertCampaignOwnership($campaign, $volunteer);

        return $this->resource(new VolunteerResource($volunteer->load(['committee', 'geographicScope'])));
    }

    public function update(UpdateVolunteerRequest $request, Campaign $campaign, Volunteer $volunteer): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $volunteer);

        $payload = $request->validated();
        if (! isset($payload['campaign_id'])) {
            $payload['campaign_id'] = $campaign->getKey();
        }

        $volunteer = $this->service->update($volunteer, $payload);

        return $this->resource(new VolunteerResource($volunteer));
    }

    public function destroy(Campaign $campaign, Volunteer $volunteer): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $volunteer);

        $this->service->delete($volunteer);

        return $this->noContent();
    }

    private function assertCampaignOwnership(Campaign $campaign, Volunteer $volunteer): void
    {
        if ((int) $volunteer->campaign_id !== (int) $campaign->getKey()) {
            abort(404);
        }
    }
}
