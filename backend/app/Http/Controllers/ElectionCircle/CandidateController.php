<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Models\ElectionCircle\Candidate;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Candidate::query(), ['name']);
    }

    public function show(Candidate $candidate)
    {
        return $candidate;
    }

    public function store(Request $request)
    {
        $candidate = Candidate::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Candidate']),
            'data' => $candidate,
        ]);
    }

    public function update(Request $request, Candidate $candidate)
    {
        $candidate->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Candidate']),
            'data' => $candidate,
        ]);
    }

    public function destroy(Candidate $candidate)
    {
        $candidate->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Candidate']),
        ]);
    }
}
