<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\GeoArea;
use Illuminate\Http\Request;

class GeoAreaController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return GeoArea::all();
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
