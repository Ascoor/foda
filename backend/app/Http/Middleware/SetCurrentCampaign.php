<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Campaign;
use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentCampaign
{
    protected static ?bool $campaignHasUuid = null;

    public function handle(Request $request, Closure $next, string $required = 'optional'): Response|JsonResponse
    {
        $campaignCandidate = $request->header('X-Campaign-ID')
            ?? $request->header('X-Campaign-Id')
            ?? $request->header('X-Campaign-Slug')
            ?? $request->route('campaign');

        $campaign = $this->resolveCampaign($campaignCandidate);

        if ($campaign !== null) {
            $user = $request->user();

            if (! $user) {
                return ApiResponse::error(
                    'Authentication required for campaign context',
                    Response::HTTP_UNAUTHORIZED,
                    [],
                    'AUTHENTICATION_ERROR'
                );
            }

            $hasMembership = DB::table('campaign_user')->where([
                ['campaign_id', '=', $campaign->getKey()],
                ['user_id', '=', $user->getKey()],
                ['status', '=', 'active'],
            ])->exists();

            if (! $hasMembership && ! $user->hasRole('admin')) {
                return ApiResponse::error(
                    'Unauthorized campaign access',
                    Response::HTTP_FORBIDDEN,
                    [],
                    'AUTHORIZATION_ERROR'
                );
            }

            app()->instance('currentCampaignId', (int) $campaign->getKey());
            app()->instance('currentCampaign', $campaign);
            $request->attributes->set('currentCampaignId', (int) $campaign->getKey());
            $request->attributes->set('currentCampaign', $campaign);
        } elseif ($required === 'required') {
            return ApiResponse::error(
                'Campaign context required',
                Response::HTTP_UNPROCESSABLE_ENTITY,
                [],
                'CAMPAIGN_CONTEXT_REQUIRED'
            );
        }

        return $next($request);
    }

    protected function resolveCampaign(mixed $candidate): ?Campaign
    {
        if ($candidate instanceof Campaign) {
            return $candidate;
        }

        if (is_numeric($candidate)) {
            return Campaign::query()->find((int) $candidate);
        }

        if (is_string($candidate) && $candidate !== '') {
            $query = Campaign::query()->where('slug', $candidate);

            if ($this->campaignHasUuidColumn()) {
                $query->orWhere('uuid', $candidate);
            }

            return $query->first();
        }

        return null;
    }

    protected function campaignHasUuidColumn(): bool
    {
        if (self::$campaignHasUuid === null) {
            self::$campaignHasUuid = Schema::hasColumn('campaigns', 'uuid');
        }

        return self::$campaignHasUuid;
    }
}
