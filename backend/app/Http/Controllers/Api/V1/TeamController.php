<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Http\Resources\TeamResource;
use App\Models\Team;
use App\Models\Volunteer;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with(['area', 'supervisor', 'volunteers'])->withCount('volunteers')->get();

        return TeamResource::collection($teams);
    }

    public function store(StoreTeamRequest $request)
    {
        $team = Team::create($request->validated());

        $team->load(['area', 'supervisor', 'volunteers'])->loadCount('volunteers');

        return (new TeamResource($team))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Team $team)
    {
        $team->load(['area', 'supervisor', 'volunteers'])->loadCount('volunteers');

        return new TeamResource($team);
    }

    public function update(UpdateTeamRequest $request, Team $team)
    {
        $team->update($request->validated());

        $team->load(['area', 'supervisor', 'volunteers'])->loadCount('volunteers');

        return new TeamResource($team);
    }

    public function destroy(Team $team)
    {
        $team->delete();

        return response()->noContent();
    }

    public function assignVolunteers(Request $request, Team $team)
    {
        $data = $request->validate([
            'volunteer_ids' => ['array'],
            'volunteer_ids.*' => ['exists:volunteers,id'],
        ]);

        $ids = $data['volunteer_ids'] ?? [];
        Volunteer::whereIn('id', $ids)->update(['team_id' => $team->id]);

        $team->load(['area', 'supervisor', 'volunteers'])->loadCount('volunteers');

        return new TeamResource($team);
    }

    public function removeVolunteer(Team $team, Volunteer $volunteer)
    {
        if ($volunteer->team_id === $team->id) {
            $volunteer->team_id = null;
            $volunteer->save();
        }

        return response()->noContent();
    }
}

