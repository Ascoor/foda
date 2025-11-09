<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends ApiController
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return $this->forbidden('Unauthenticated');
        }

        $campaign = $this->campaign($request);

        $query = Notification::query()
            ->where(function ($inner) use ($user) {
                $inner->whereNull('user_id')
                    ->orWhere('user_id', $user->id);
            })
            ->when($campaign, fn ($q) => $q->where('campaign_id', $campaign->id))
            ->orderByDesc('created_at');

        return $this->ok(NotificationResource::collection($query->paginate(50)));
    }

    public function markRead(Request $request)
    {
        $data = $request->validate([
            'ids' => ['array'],
            'ids.*' => ['uuid'],
        ]);

        $user = $request->user();
        if (! $user) {
            return $this->forbidden('Unauthenticated');
        }

        $q = Notification::where('user_id', $user->id);
        if ($campaign = $this->campaign($request)) {
            $q->where('campaign_id', $campaign->id);
        }
        if (! empty($data['ids'])) {
            $q->whereIn('id', $data['ids']);
        }

        $q->update(['read_at' => now()]);

        return $this->ok(['updated' => true]);
    }
}
