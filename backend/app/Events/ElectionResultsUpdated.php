<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ElectionResultsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public string $electionId, public array $results)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('elections.live.' . $this->electionId);
    }

    public function broadcastAs(): string
    {
        return 'ElectionResultsUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'election_id' => $this->electionId,
            'results' => $this->results,
        ];
    }
}
