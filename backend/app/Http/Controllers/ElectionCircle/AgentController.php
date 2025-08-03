<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return Agent::all();
    }

    public function show(Agent $agent)
    {
        return $agent;
    }

    public function store(Request $request)
    {
        $agent = Agent::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Agent']),
            'data' => $agent,
        ]);
    }

    public function update(Request $request, Agent $agent)
    {
        $agent->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Agent']),
            'data' => $agent,
        ]);
    }

    public function destroy(Agent $agent)
    {
        $agent->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Agent']),
        ]);
    }
}
