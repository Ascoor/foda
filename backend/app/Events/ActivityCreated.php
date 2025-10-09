<?php

namespace App\Events;

use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class ActivityCreated implements ShouldBroadcastNow
{
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(public Activity $activity)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('activities');
    }

    public function broadcastWith(): array
    {
        return [
            'data' => (new ActivityResource($this->activity->loadMissing(['area', 'committee', 'creator'])))->resolve(),
        ];
    }
}
