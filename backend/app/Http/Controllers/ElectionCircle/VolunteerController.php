<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ElectionCircle\Traits\HandlesIndexRequests;
use App\Models\ElectionCircle\Volunteer;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Volunteer::query(), ['name']);
    }

    public function show(Volunteer $volunteer)
    {
        return $volunteer;
    }

    public function store(Request $request)
    {
        $volunteer = Volunteer::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Volunteer']),
            'data' => $volunteer,
        ]);
    }

    public function update(Request $request, Volunteer $volunteer)
    {
        $volunteer->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Volunteer']),
            'data' => $volunteer,
        ]);
    }

    public function destroy(Volunteer $volunteer)
    {
        $volunteer->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Volunteer']),
        ]);
    }
}
