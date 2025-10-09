<?php

namespace App\Events;

use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcastNow
{
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public Notification $notification)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('notifications');
    }

    public function broadcastWith(): array
    {
        return [
            'data' => (new NotificationResource($this->notification))->resolve(),
        ];
    }
}
