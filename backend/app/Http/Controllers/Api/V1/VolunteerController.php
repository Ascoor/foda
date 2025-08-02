<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVolunteerRequest;
use App\Http\Requests\UpdateVolunteerRequest;
use App\Http\Resources\VolunteerResource;
use App\Models\Volunteer;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function index(Request $request)
    {
        $query = Volunteer::with('team');

        if ($name = $request->query('name')) {
            $query->where('name', 'like', "%{$name}%");
        }

        if ($teamId = $request->query('team_id')) {
            $query->where('team_id', $teamId);
        }

        return VolunteerResource::collection($query->get());
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

