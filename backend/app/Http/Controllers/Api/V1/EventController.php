<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Campaign;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index(Request $request, Campaign $campaign)
    {
        $events = Event::with(['area', 'team'])
            ->where('campaign_id', $campaign->getKey())
            ->withinCampaignWindow($campaign)
            ->when($request->filled('date'), fn ($q) => $q->whereDate('date', $request->date))
            ->when($request->filled('area_id'), fn ($q) => $q->where('area_id', $request->area_id))
            ->when($request->filled('team_id'), fn ($q) => $q->where('team_id', $request->team_id))
            ->orderBy('date');

        return EventResource::collection($events->paginate($request->get('per_page', 15)));
    }

    public function store(StoreEventRequest $request, Campaign $campaign)
    {
        $data = $request->validated();
        $data['campaign_id'] = $campaign->getKey();

        if (empty($data['event_id'])) {
            $data['event_id'] = (string) Str::uuid();
        }

        $event = Event::create($data);

        return (new EventResource($event))->response()->setStatusCode(201);
    }

    public function show(Campaign $campaign, Event $event)
    {
        abort_unless($event->campaign_id === $campaign->getKey(), 404);

        $event->load(['area', 'team']);

        return new EventResource($event);
    }

    public function update(UpdateEventRequest $request, Campaign $campaign, Event $event)
    {
        abort_unless($event->campaign_id === $campaign->getKey(), 404);

        $payload = $request->validated();
        $payload['campaign_id'] = $campaign->getKey();

        $event->update($payload);

        return new EventResource($event);
    }

    public function destroy(Campaign $campaign, Event $event)
    {
        abort_unless($event->campaign_id === $campaign->getKey(), 404);

        $event->delete();

        return response()->noContent();
    }

    public function upcoming(Request $request, Campaign $campaign)
    {
        $events = Event::with(['area', 'team'])
            ->where('campaign_id', $campaign->getKey())
            ->withinCampaignWindow($campaign)
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date');

        return EventResource::collection($events->paginate($request->get('per_page', 15)));
    }
}
