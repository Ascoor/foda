<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/v1/events",
     *     summary="List events",
     *     tags={"Events"},
     *     @OA\Parameter(name="date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="area_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="team_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index(Request $request)
    {
        $events = Event::with(['area', 'team'])
            ->withCount('volunteers')
            ->when($request->filled('date'), fn($q) => $q->whereDate('date', $request->date))
            ->when($request->filled('area_id'), fn($q) => $q->where('area_id', $request->area_id))
            ->when($request->filled('team_id'), fn($q) => $q->where('team_id', $request->team_id))
            ->orderBy('date');

        return EventResource::collection($events->paginate($request->get('per_page', 15)));
    }

    /**
     * @OA\Post(
     *     path="/api/v1/events",
     *     summary="Create event",
     *     tags={"Events"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","organiser","location","date","area_id","team_id"},
     *             @OA\Property(property="event_id", type="string"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="organiser", type="string"),
     *             @OA\Property(property="location", type="string"),
     *             @OA\Property(property="date", type="string", format="date"),
     *             @OA\Property(property="area_id", type="integer"),
     *             @OA\Property(property="team_id", type="integer"),
     *         )
     *     ),
     *     @OA\Response(response=201, description="Created")
     * )
     */
    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();
        if (empty($data['event_id'])) {
            $data['event_id'] = (string) Str::uuid();
        }
        $event = Event::create($data);

        return (new EventResource($event))->response()->setStatusCode(201);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/events/{event}",
     *     summary="Show event",
     *     tags={"Events"},
     *     @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show(Event $event)
    {
        $event->load(['area', 'team', 'volunteers'])->loadCount('volunteers');
        return new EventResource($event);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/events/{event}",
     *     summary="Update event",
     *     tags={"Events"},
     *     @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="event_id", type="string"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="organiser", type="string"),
     *             @OA\Property(property="location", type="string"),
     *             @OA\Property(property="date", type="string", format="date"),
     *             @OA\Property(property="area_id", type="integer"),
     *             @OA\Property(property="team_id", type="integer"),
     *         )
     *     ),
     *     @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $event->update($request->validated());

        return new EventResource($event);
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/events/{event}",
     *     summary="Delete event",
     *     tags={"Events"},
     *     @OA\Parameter(name="event", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=204, description="No Content")
     * )
     */
    public function destroy(Event $event)
    {
        $event->delete();

        return response()->noContent();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/events/upcoming",
     *     summary="List upcoming events",
     *     tags={"Events"},
     *     @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function upcoming(Request $request)
    {
        $events = Event::with(['area', 'team'])
            ->withCount('volunteers')
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date');

        return EventResource::collection($events->paginate($request->get('per_page', 15)));
    }
}
