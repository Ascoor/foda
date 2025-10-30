<?php

namespace App\Http\Middleware;

use App\Services\ScopeService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveMembershipScope
{
    public function __construct(private ScopeService $scopeService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $scope = $this->scopeService->resolveForUser($user);
            $request->attributes->set('resolved_scope', $scope);
        }

        return $next($request);
    }
}
