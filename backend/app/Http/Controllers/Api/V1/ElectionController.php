<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreElectionRequest;
use App\Http\Requests\UpdateElectionRequest;
use App\Http\Resources\ElectionResource;
use App\Models\Campaign;
use App\Models\Election;
use App\Services\ElectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class ElectionController extends Controller
{
    public function __construct(private ElectionService $electionService)
    {
    }

    public function indexByCampaign(Request $request, Campaign $campaign): JsonResponse
    {
        Gate::authorize('view', $campaign);

        $elections = $this->electionService->listForCampaign($request->user(), $campaign);

        return response()->json(ElectionResource::collection($elections));
    }

    public function show(Request $request, Campaign $campaign, Election $election): JsonResponse
    {
        Gate::authorize('view', $campaign);

        if ($election->campaign_id !== $campaign->id) {
            abort(Response::HTTP_NOT_FOUND);
        }

        Gate::authorize('view', $election);

        return response()->json(new ElectionResource($election));
    }

    public function store(StoreElectionRequest $request, Campaign $campaign): JsonResponse
    {
        Gate::authorize('update', $campaign);

        $election = $this->electionService->create($campaign, $request->validated());

        return response()->json(new ElectionResource($election), Response::HTTP_CREATED);
    }

    public function update(UpdateElectionRequest $request, Campaign $campaign, Election $election): JsonResponse
    {
        Gate::authorize('update', $campaign);

        if ($election->campaign_id !== $campaign->id) {
            abort(Response::HTTP_NOT_FOUND);
        }

        Gate::authorize('update', $election);

        $election = $this->electionService->update($election, $request->validated());

        return response()->json(new ElectionResource($election));
    }
}
