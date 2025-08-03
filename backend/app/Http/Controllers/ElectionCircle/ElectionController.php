<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Election;
use Illuminate\Http\Request;

class ElectionController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return Election::all();
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
