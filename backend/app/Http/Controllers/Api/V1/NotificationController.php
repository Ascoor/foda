<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $perPage = max(1, $request->integer('per_page', 25));

        try {
            $query = $user->notifications()->latest();

            if ($type = $request->string('type')->lower()) {
                $query->where('type', $type);
            }

            if ($request->boolean('unread')) {
                $query->whereNull('read_at');
            }

            $notifications = $query->paginate($perPage);
        } catch (QueryException $exception) {
            report($exception);

            $notifications = new LengthAwarePaginator(
                items: [],
                total: 0,
                perPage: $perPage,
                currentPage: max(1, $request->integer('page', 1)),
                options: [
                    'path' => $request->url(),
                    'query' => $request->query(),
                ],
            );
        }

        return NotificationResource::collection($notifications);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        if ($notification->user_id !== $user->id) {
            return response()->json(['error' => 'Notification not found'], Response::HTTP_NOT_FOUND);
        }

        $notification->markAsRead();

        return new NotificationResource($notification->fresh());
    }

    public function markAll(Request $request): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $query = $user->notifications();

        if ($type = $request->string('type')->lower()) {
            $query->where('type', $type);
        }

        $query->whereNull('read_at')->update(['read_at' => now()]);

        return response()->noContent();
    }
}
