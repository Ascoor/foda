<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $campaignId = $request->integer('campaign_id') ?? optional($request->route('campaign'))->getKey();

        $query = Notification::query()
            ->when($user, function ($query) use ($user) {
                $query->where(function ($inner) use ($user) {
                    $inner->whereNull('user_id')
                        ->orWhere('user_id', $user->getKey());
                });
            })
            ->when($campaignId, fn ($q) => $q->where('campaign_id', $campaignId))
            ->when($request->boolean('unread'), fn ($q) => $q->whereNull('read_at'))
            ->orderByDesc('created_at');

        $perPage = max(1, min((int) $request->input('per_page', 20), 100));

        $notifications = $query->paginate($perPage)->appends($request->query());

        return NotificationResource::collection($notifications);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $this->authorizeForUser($request, $notification);

        $notification->markAsRead();

        return new NotificationResource($notification->fresh());
    }

    public function markAll(Request $request): JsonResponse
    {
        $user = $request->user();
        $campaignId = $request->integer('campaign_id');

        $query = Notification::query()
            ->when($user, function ($query) use ($user) {
                $query->where(function ($inner) use ($user) {
                    $inner->whereNull('user_id')
                        ->orWhere('user_id', $user->getKey());
                });
            })
            ->when($campaignId, fn ($q) => $q->where('campaign_id', $campaignId));

        $query->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['status' => 'ok']);
    }

    protected function authorizeForUser(Request $request, Notification $notification): void
    {
        $user = $request->user();
        if (!$user) {
            abort(Response::HTTP_FORBIDDEN);
        }

        if ($notification->user_id && (int) $notification->user_id !== (int) $user->getKey()) {
            abort(Response::HTTP_FORBIDDEN);
        }

        if ($notification->campaign_id && $request->filled('campaign_id')) {
            if ((int) $notification->campaign_id !== (int) $request->integer('campaign_id')) {
                abort(Response::HTTP_FORBIDDEN);
            }
        }
    }
}
