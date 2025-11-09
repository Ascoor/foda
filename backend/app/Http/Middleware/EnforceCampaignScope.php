<?php

namespace App\Http\Middleware;

use App\Models\Campaign;
use Closure;
use Illuminate\Http\Request;

class EnforceCampaignScope
{
    public function handle(Request $request, Closure $next)
    {
        // Check campaign scope first
        $routeCampaign = $request->route('campaign'); // id/slug/uuid (string|int)
        $headerId      = $request->header('X-Campaign-Id');
        $headerSlug    = $request->header('X-Campaign-Slug');

        if ($routeCampaign === null && $headerId === null && $headerSlug === null) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Missing campaign scope'],
            ], 403);
        }

        // Resolve candidate value (no new declarations until validated)
        $candidate = $routeCampaign ?? $headerId ?? $headerSlug;

        // Guard: only now query DB
        $campaignQuery = Campaign::query();
        if (is_numeric($candidate)) {
            $campaignQuery->where('id', (int) $candidate);
        } else {
            $campaignQuery->where(fn ($q) => $q
                ->where('slug', (string) $candidate)
                ->orWhere('uuid', (string) $candidate));
        }
        $campaign = $campaignQuery->first();

        if (! $campaign) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Campaign not found'],
            ], 404);
        }

        // Guard user membership before continuing
        $user = $request->user();
        if (! $user) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Unauthenticated'],
            ], 401);
        }

        $isMember = $campaign->users()
            ->where('users.id', $user->id)
            ->wherePivot('status', 'active')
            ->exists();

        if (! $isMember) {
            return response()->json([
                'status' => 'error',
                'errors' => ['Unauthorized campaign access'],
                'code'   => 403,
            ], 403);
        }

        // Attach only after all checks pass
        app()->instance('currentCampaignId', (int) $campaign->id);
        $request->attributes->set('campaign', $campaign);
        $request->attributes->set('currentCampaignId', (int) $campaign->id);

        return $next($request);
    }
}
