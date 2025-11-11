<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomeRequest;
use App\Http\Resources\CampaignOverviewResource;
use App\Models\Area;
use App\Models\Campaign;
use App\Services\CampaignOverviewService;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function __construct(private readonly CampaignOverviewService $overviewService)
    {
    }

    public function index(HomeRequest $request): CampaignOverviewResource
    {
        $campaign = $request->route('campaign');
        $campaignId = $campaign instanceof Campaign ? $campaign->getKey() : $request->integer('campaign_id');

        $context = [
            'campaign_id' => $campaignId,
        ];

        if ($request->filled('from')) {
            $context['from'] = $request->date('from');
        }

        if ($request->filled('to')) {
            $context['to'] = $request->date('to');
        }

        $payload = $this->overviewService->build(
            $campaign instanceof Campaign ? $campaign : null,
            $context,
        );

        return new CampaignOverviewResource($payload);
    }

    public function heatmap(): JsonResponse
    {
        $points = Area::whereNotNull('x')
            ->whereNotNull('y')
            ->get()
            ->map(fn ($area) => [
                'lat' => (float) $area->x,
                'lng' => (float) $area->y,
            ]);

        return response()->json(['data' => $points]);
    }
}
