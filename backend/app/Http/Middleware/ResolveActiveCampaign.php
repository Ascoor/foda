<?php

namespace App\Http\Middleware;

use App\Models\Campaign;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ResolveActiveCampaign
{
    public function handle(Request $request, Closure $next)
    {
        $campaign = $this->resolveCampaign($request);

        if ($campaign) {
            if ($request->user()) {
                Gate::authorize('view', $campaign);
            }

            $request->attributes->set('campaign', $campaign);
        }

        return $next($request);
    }

    protected function resolveCampaign(Request $request): ?Campaign
    {
        $routeCampaign = $request->route('campaign');

        if ($routeCampaign instanceof Campaign) {
            return $routeCampaign;
        }

        $campaignId = $request->route('campaign') ?? $request->header('X-Campaign-Id');

        if (! $campaignId) {
            return null;
        }

        $campaign = Campaign::query()->find($campaignId);

        if (! $campaign) {
            throw new NotFoundHttpException('Campaign not found.');
        }

        if ($request->user() && Gate::denies('view', $campaign)) {
            throw new AccessDeniedHttpException('You do not have access to this campaign.');
        }

        return $campaign;
    }
}
