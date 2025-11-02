<?php

namespace App\Http\Middleware;

use App\Models\ElectionCircle\Campaign;
use Closure;
use Illuminate\Http\Request;

class ResolveCampaign
{
    public function handle(Request $request, Closure $next)
    {
        $campaign = $request->route('campaign');

        if ($campaign instanceof Campaign) {
            $request->attributes->set('campaign', $campaign);
        }

        return $next($request);
    }
}
