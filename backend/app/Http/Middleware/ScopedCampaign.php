<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Campaign;

class ScopedCampaign
{
    public function handle(Request $request, Closure $next)
    {
        $campaign = $request->route('campaign');
        if ($campaign instanceof Campaign === false) {
            // allow route-model-binding to resolve campaign automatically if {campaign} is an id/slug
            $param = $request->route('campaign');
            $campaign = Campaign::where('id', $param)->orWhere('slug', $param)->first();
            if (!$campaign) abort(404, 'Campaign not found');
            $request->route()->setParameter('campaign', $campaign);
        }

        // Ensure the user belongs to this campaign (if logged in routes)
        if ($request->user()) {
            $belongs = $campaign->users()->where('users.id', $request->user()->id)->exists();
            if (!$belongs) abort(403, 'You are not a member of this campaign');
        }

        app()->instance('scoped.campaign', $campaign); // make available via DI container
        return $next($request);
    }
}
