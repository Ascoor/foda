<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Models\ElectionCircle\Observation;
use Illuminate\Http\Request;

class ObservationController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Observation::query(), ['title', 'description']);
    }

    public function show(Observation $observation)
    {
        return $observation;
    }

    public function store(Request $request)
    {
        $observation = Observation::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Observation']),
            'data' => $observation,
        ]);
    }

    public function update(Request $request, Observation $observation)
    {
        $observation->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Observation']),
            'data' => $observation,
        ]);
    }

    public function destroy(Observation $observation)
    {
        $observation->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Observation']),
        ]);
    }
}
