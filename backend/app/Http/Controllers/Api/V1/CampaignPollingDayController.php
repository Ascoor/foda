<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Campaigns\CreatePollingDayAction;
use App\Actions\Campaigns\UpdatePollingDayAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Campaigns\StorePollingDayRequest;
use App\Http\Requests\Campaigns\UpdatePollingDayRequest;
use App\Http\Resources\CampaignPollingDayResource;
use App\Models\Campaign;
use App\Models\CampaignPollingDay;

class CampaignPollingDayController extends Controller
{
    public function index(Campaign $campaign)
    {
        $this->authorize('view', $campaign);

        $pollingDays = $campaign->pollingDays()->orderBy('date')->get();

        return CampaignPollingDayResource::collection($pollingDays);
    }

    public function store(StorePollingDayRequest $request, Campaign $campaign, CreatePollingDayAction $createPollingDayAction)
    {
        $this->authorize('manageData', $campaign);
        $pollingDay = $createPollingDayAction($campaign, $request->validated());

        return (new CampaignPollingDayResource($pollingDay))->response()->setStatusCode(201);
    }

    public function update(UpdatePollingDayRequest $request, Campaign $campaign, CampaignPollingDay $pollingDay, UpdatePollingDayAction $updatePollingDayAction)
    {
        $this->authorize('manageData', $campaign);
        abort_unless($pollingDay->campaign_id === $campaign->getKey(), 404);

        $pollingDay = $updatePollingDayAction($pollingDay, $request->validated());

        return new CampaignPollingDayResource($pollingDay);
    }

    public function destroy(Campaign $campaign, CampaignPollingDay $pollingDay)
    {
        $this->authorize('manageData', $campaign);
        abort_unless($pollingDay->campaign_id === $campaign->getKey(), 404);

        $pollingDay->delete();

        return response()->noContent();
    }
}
