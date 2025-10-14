<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Models\ElectionCircle\Voter;
use Illuminate\Http\Request;

class VoterController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Voter::query(), ['name', 'national_id']);
    }

    public function show(Voter $voter)
    {
        return $voter;
    }

    public function store(Request $request)
    {
        $voter = Voter::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Voter']),
            'data' => $voter,
        ]);
    }

    public function update(Request $request, Voter $voter)
    {
        $voter->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Voter']),
            'data' => $voter,
        ]);
    }

    public function destroy(Voter $voter)
    {
        $voter->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Voter']),
        ]);
    }
}
