<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Committee;
use Illuminate\Http\Request;
use App\Http\Controllers\ElectionCircle\Concerns\HandlesIndexRequests;

class CommitteeController extends Controller
{
    use HandlesIndexRequests;
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        $query = Committee::query();

        return $this->paginateAndFilter($request, $query, ['geo_area_id']);
    }

    public function show(Committee $committee)
    {
        return $committee;
    }

    public function store(Request $request)
    {
        $committee = Committee::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Committee']),
            'data' => $committee,
        ]);
    }

    public function update(Request $request, Committee $committee)
    {
        $committee->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Committee']),
            'data' => $committee,
        ]);
    }

    public function destroy(Committee $committee)
    {
        $committee->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Committee']),
        ]);
    }
}
