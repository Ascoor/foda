<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ElectionCircle\Traits\HandlesIndexRequests;
use App\Models\ElectionCircle\Committee;
use Illuminate\Http\Request;

class CommitteeController extends Controller
{
    use HandlesIndexRequests;

    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index(Request $request)
    {
        return $this->handleIndex($request, Committee::query(), ['name']);
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
