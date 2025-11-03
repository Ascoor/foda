<?php

namespace App\Http\Middleware;

use App\Models\Campaign;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ResolveActiveCampaign
{
    public function handle(Request $request, Closure $next)
    {
        $campaign = $request->route('campaign');

        if ($campaign === null) {
            return $next($request);
        }

        if ($campaign instanceof Campaign) {
            $request->attributes->set('campaign', $campaign);

            return $next($request);
        }

        throw new NotFoundHttpException(__('Campaign not found.'));
    }
}
