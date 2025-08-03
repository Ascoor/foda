<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Http\Request;
use App\Http\Controllers\ElectionCircle\Concerns\HandlesIndexRequests;

class GeoAreaController extends Controller
{
    use HandlesIndexRequests;
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        $query = GeoArea::query();

        return $this->paginateAndFilter($request, $query, ['election_id']);
    }

    public function show(GeoArea $geoArea)
    {
        return $geoArea;
    }

    public function store(Request $request)
    {
        $geoArea = GeoArea::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'GeoArea']),
            'data' => $geoArea,
        ]);
    }

    public function update(Request $request, GeoArea $geoArea)
    {
        $geoArea->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'GeoArea']),
            'data' => $geoArea,
        ]);
    }

    public function destroy(GeoArea $geoArea)
    {
        $geoArea->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'GeoArea']),
        ]);
    }
}
