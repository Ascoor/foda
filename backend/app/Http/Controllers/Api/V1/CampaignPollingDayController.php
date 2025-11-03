<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampaignPollingDay\StorePollingDayRequest;
use App\Http\Requests\CampaignPollingDay\UpdatePollingDayRequest;
use App\Http\Resources\CampaignPollingDay\CampaignPollingDayResource;
use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CampaignPollingDayController extends Controller
{
    public function index(Request $request, Campaign $campaign)
    {
        $this->authorize('view', $campaign);
        $perPage = min((int) $request->input('per_page', 15), 100);

        $pollingDays = CampaignPollingDay::query()
            ->forCampaign($campaign->getKey())
            ->orderBy('date')
            ->paginate($perPage)
            ->appends($request->query());

        return CampaignPollingDayResource::collection($pollingDays);
    }

    public function store(StorePollingDayRequest $request, Campaign $campaign)
    {
        $this->authorize('update', $campaign);

        $pollingDay = $campaign->pollingDays()->create($request->validated());

        return (new CampaignPollingDayResource($pollingDay))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Campaign $campaign, CampaignPollingDay $pollingDay)
    {
        $this->authorize('view', $campaign);
        $this->ensureCampaignContext($campaign, $pollingDay);

        return new CampaignPollingDayResource($pollingDay);
    }

    public function update(UpdatePollingDayRequest $request, Campaign $campaign, CampaignPollingDay $pollingDay)
    {
        $this->authorize('update', $campaign);
        $this->ensureCampaignContext($campaign, $pollingDay);

        $pollingDay->fill($request->validated());
        $pollingDay->save();

        return new CampaignPollingDayResource($pollingDay->refresh());
    }

    public function destroy(Campaign $campaign, CampaignPollingDay $pollingDay): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->ensureCampaignContext($campaign, $pollingDay);

        $pollingDay->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    protected function ensureCampaignContext(Campaign $campaign, CampaignPollingDay $pollingDay): void
    {
        if ((int) $pollingDay->campaign_id !== (int) $campaign->getKey()) {
            abort(Response::HTTP_NOT_FOUND);
        }
    }
}
