<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSettingRequest;
use App\Http\Requests\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return SettingResource::collection(Setting::all());
    }

    public function store(StoreSettingRequest $request)
    {
        $setting = Setting::create($request->validated());

        return SettingResource::make($setting)->response()->setStatusCode(201);
    }

    public function show(Setting $setting)
    {
        return SettingResource::make($setting);
    }

    public function update(UpdateSettingRequest $request, Setting $setting)
    {
        $setting->update($request->validated());

        return SettingResource::make($setting);
    }

    public function destroy(Setting $setting)
    {
        $setting->delete();

        return response()->noContent();
    }

    public function getByKey(string $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        return SettingResource::make($setting);
    }
}
