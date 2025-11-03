<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Campaigns\CreateCampaignAction;
use App\Actions\Campaigns\UpdateCampaignAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Campaigns\StoreCampaignRequest;
use App\Http\Requests\Campaigns\UpdateCampaignRequest;
use App\Http\Resources\CampaignCollection;
use App\Http\Resources\CampaignResource;
use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Campaign::class, 'campaign');
    }

    public function index(Request $request): CampaignCollection
    {
        $this->authorize('viewAny', Campaign::class);

        $query = Campaign::query();

        if ($search = $request->string('q')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (($status = $request->string('status')->toString()) && in_array($status, ['draft', 'active', 'archived'], true)) {
            $query->where('status', $status);
        }

        $sort = $request->input('sort', 'starts_at');
        $direction = strtolower($request->input('direction', 'desc'));
        $allowedSorts = ['starts_at', 'ends_at', 'name', 'status', 'created_at'];
        $allowedDirections = ['asc', 'desc'];

        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'starts_at';
        }

        if (! in_array($direction, $allowedDirections, true)) {
            $direction = 'desc';
        }

        $query->orderBy($sort, $direction);

        $perPage = $request->integer('per_page', 15);
        $perPage = max(1, min(100, $perPage));

        $campaigns = $query->paginate($perPage)->appends($request->query());

        return new CampaignCollection($campaigns);
    }

    public function store(StoreCampaignRequest $request, CreateCampaignAction $createCampaignAction): CampaignResource
    {
        $campaign = $createCampaignAction($request->validated(), $request->user());

        return (new CampaignResource($campaign))->response()->setStatusCode(201);
    }

    public function show(Campaign $campaign): CampaignResource
    {
        return new CampaignResource($campaign);
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign, UpdateCampaignAction $updateCampaignAction): CampaignResource
    {
        $campaign = $updateCampaignAction($campaign, $request->validated());

        return new CampaignResource($campaign);
    }

    public function destroy(Campaign $campaign)
    {
        $this->authorize('delete', $campaign);

        $campaign->delete();

        return response()->noContent();
    }
}
