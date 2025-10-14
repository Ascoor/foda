<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Models\ElectionCircle\Election;
use Illuminate\Http\Request;

class ElectionController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Election::query(), ['name']);
    }

    public function show(Election $election)
    {
        return $election;
    }

    public function store(Request $request)
    {
        $election = Election::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Election']),
            'data' => $election,
        ]);
    }

    public function update(Request $request, Election $election)
    {
        $election->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Election']),
            'data' => $election,
        ]);
    }

    public function destroy(Election $election)
    {
        $election->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Election']),
        ]);
    }
}
