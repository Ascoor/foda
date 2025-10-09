<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::query()->latest();

        if ($type = $request->string('type')->lower()) {
            $query->where('type', $type);
        }

        if ($request->boolean('unread')) {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate($request->integer('per_page', 25));

        return NotificationResource::collection($notifications);
    }

    public function markAsRead(Notification $notification): NotificationResource
    {
        $notification->markAsRead();

        return new NotificationResource($notification->fresh());
    }

    public function markAll(Request $request): Response
    {
        $query = Notification::query();

        if ($type = $request->string('type')->lower()) {
            $query->where('type', $type);
        }

        $query->whereNull('read_at')->update(['read_at' => now()]);

        return response()->noContent();
    }
}
