<?php

namespace App\Http\Controllers\ElectionCircle;

use App\Http\Controllers\Controller;
use App\Models\ElectionCircle\ECSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage-electioncircle');
    }


    public function index()
    {
        return ECSetting::all();
    }

    public function show(ECSetting $setting)
    {
        return $setting;
    }

    public function store(Request $request)
    {
        $setting = ECSetting::create($request->all());
        return response()->json([
            'message' => __('messages.created', ['entity' => 'Setting']),
            'data' => $setting,
        ]);
    }

    public function update(Request $request, ECSetting $setting)
    {
        $setting->update($request->all());
        return response()->json([
            'message' => __('messages.updated', ['entity' => 'Setting']),
            'data' => $setting,
        ]);
    }

    public function destroy(ECSetting $setting)
    {
        $setting->delete();
        return response()->json([
            'message' => __('messages.deleted', ['entity' => 'Setting']),
        ]);
    }
}
