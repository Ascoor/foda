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

        // per_page كعدد صحيح
        $perPage = (int) $request->input('per_page', 50);

        try {
            $query = $user->notifications()->latest();

            // التحقق من النوع كـ string
            $type = strtolower((string) $request->input('type', ''));

            if (!empty($type)) {
                $query->where('type', $type);
            }

            // التحقق من unread كـ boolean
            $unread = filter_var($request->input('unread', false), FILTER_VALIDATE_BOOLEAN);
            if ($unread) {
                $query->whereNull('read_at');
            }

            $notifications = $query->paginate($perPage);
        } catch (QueryException $exception) {
            report($exception);

            $notifications = new LengthAwarePaginator(
                items: [],
                total: 0,
                perPage: $perPage,
                currentPage: max(1, (int) $request->input('page', 1)),
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

        // استخدم input بدل string()
        $type = strtolower((string) $request->input('type', ''));
        if (!empty($type)) {
            $query->where('type', $type);
        }

        $query->whereNull('read_at')->update(['read_at' => now()]);

        return response()->noContent();
    }
}
