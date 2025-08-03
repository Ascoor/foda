<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\Committee;
use Illuminate\Http\Request;

class CommitteeController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return Committee::all();
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
