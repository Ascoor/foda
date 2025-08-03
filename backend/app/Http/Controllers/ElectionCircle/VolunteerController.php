<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Volunteer;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return Volunteer::all();
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
