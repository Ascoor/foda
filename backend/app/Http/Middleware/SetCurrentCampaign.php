<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Campaign;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentCampaign
{
    public function handle(Request $request, Closure $next, string $required = 'optional'): Response|JsonResponse
    {
        $campaignCandidate = $request->header('X-Campaign-ID')
            ?? $request->query('campaign_id')
            ?? $request->route('campaign');

        $campaignId = $this->resolveCampaignId($campaignCandidate);

        if ($campaignId !== null) {
            $user = $request->user();

            if (! $user) {
                return response()->json([
                    'message' => 'Authentication required for campaign context',
                    'code' => Response::HTTP_UNAUTHORIZED,
                ], Response::HTTP_UNAUTHORIZED);
            }

            $hasMembership = DB::table('campaign_user')->where([
                ['campaign_id', '=', $campaignId],
                ['user_id', '=', $user->getKey()],
            ])->exists();

            if (! $hasMembership) {
                return response()->json([
                    'message' => 'Unauthorized campaign access',
                    'code' => Response::HTTP_FORBIDDEN,
                ], Response::HTTP_FORBIDDEN);
            }

            app()->instance('currentCampaignId', $campaignId);
            $request->attributes->set('currentCampaignId', $campaignId);
        } elseif ($required === 'required') {
            return response()->json([
                'message' => 'Campaign context required',
                'code' => Response::HTTP_UNPROCESSABLE_ENTITY,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $next($request);
    }

    protected function resolveCampaignId(mixed $candidate): ?int
    {
        if ($candidate instanceof Campaign) {
            return (int) $candidate->getKey();
        }

        if (is_numeric($candidate)) {
            return (int) $candidate;
        }

        return null;
    }
}
