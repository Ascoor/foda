<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\HandlesIndexRequests;
use App\Models\ElectionCircle\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Campaign::query(), ['name']);
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
