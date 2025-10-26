<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVolunteerRequest;
use App\Http\Requests\UpdateVolunteerRequest;
use App\Http\Resources\VolunteerResource;
use App\Models\Volunteer;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    use HandlesIndexRequests;

    public function index(Request $request)
    {
        $volunteers = $this->handleIndex(
            $request,
            Volunteer::with('team'),
            ['name'],
            ['name', 'team_id'],
            ['name'],
            ['name']
        );

        return VolunteerResource::collection($volunteers);
    }

    public function store(StoreVolunteerRequest $request)
    {
        $volunteer = Volunteer::create($request->validated());

        return (new VolunteerResource($volunteer->load('team')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Volunteer $volunteer)
    {
        return new VolunteerResource($volunteer->load('team'));
    }

    public function update(UpdateVolunteerRequest $request, Volunteer $volunteer)
    {
        $volunteer->update($request->validated());

        return new VolunteerResource($volunteer->load('team'));
    }

    public function destroy(Volunteer $volunteer)
    {
        $volunteer->delete();

        return response()->noContent();
    }
}

