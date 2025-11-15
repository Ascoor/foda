<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Base\ApiController;
use App\Http\Requests\StoreDonationRequest;
use App\Http\Requests\UpdateDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Campaign;
use App\Models\Donation;
use App\Services\FinanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationController extends ApiController
{
    public function __construct(private readonly FinanceService $service)
    {
    }

    public function index(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('view', $campaign);

        $donations = $this->service->listDonations($campaign, $request->all());

        return $this->resource(DonationResource::collection($donations));
    }

    public function store(StoreDonationRequest $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $payload = $request->validated();
        $payload['campaign_id'] = $campaign->getKey();

        $donation = $this->service->createDonation($payload);

        return $this->resource(new DonationResource($donation), 201);
    }

    public function show(Campaign $campaign, Donation $donation): JsonResponse
    {
        $this->authorize('view', $campaign);

        $this->assertCampaignOwnership($campaign, $donation);

        return $this->resource(new DonationResource($donation->load('category')));
    }

    public function update(UpdateDonationRequest $request, Campaign $campaign, Donation $donation): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $donation);

        $payload = $request->validated();
        if (! isset($payload['campaign_id'])) {
            $payload['campaign_id'] = $campaign->getKey();
        }

        $donation = $this->service->updateDonation($donation, $payload);

        return $this->resource(new DonationResource($donation));
    }

    public function destroy(Campaign $campaign, Donation $donation): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $donation);

        $this->service->deleteDonation($donation);

        return $this->noContent();
    }

    private function assertCampaignOwnership(Campaign $campaign, Donation $donation): void
    {
        if ((int) $donation->campaign_id !== (int) $campaign->getKey()) {
            abort(404);
        }
    }
}
