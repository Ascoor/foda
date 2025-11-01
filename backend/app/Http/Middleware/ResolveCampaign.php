<?php

namespace App\Http\Middleware;

use App\Models\Campaign;
use Closure;
use Illuminate\Http\Request;

class ResolveCampaign
{
    public function handle(Request $request, Closure $next)
    {
        $campaignParam = $request->route('campaign');
        $campaign = $campaignParam instanceof Campaign
            ? $campaignParam
            : null;

        $campaignId = $campaign?->getKey();

        if (!$campaignId) {
            $headerId = $request->header('X-Campaign-ID');
            if ($headerId) {
                $campaign = Campaign::query()->find($headerId);
                $campaignId = $campaign?->getKey() ?? $headerId;
            }
        }

        if (!$campaignId) {
            return response()->json([
                'message' => 'Campaign context required',
            ], 400);
        }

        $resolvedCampaign = $campaign;
        $resolvedId = (string) $campaignId;

        app()->singleton('campaign.context', function () use ($resolvedId, $resolvedCampaign) {
            return new class($resolvedId, $resolvedCampaign) {
                public function __construct(private string $id, private ?Campaign $campaign)
                {
                }

                public function id(): ?string
                {
                    return $this->id;
                }

                public function campaign(): ?Campaign
                {
                    return $this->campaign;
                }
            };
        });

        return $next($request);
    }
}
