<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return Campaign::all();
    }

    public function show(Campaign $campaign)
    {
        return $campaign;
    }

    public function store(Request $request)
    {
        $campaign = Campaign::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Campaign']),
            'data' => $campaign,
        ]);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $campaign->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Campaign']),
            'data' => $campaign,
        ]);
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Campaign']),
        ]);
    }
}
