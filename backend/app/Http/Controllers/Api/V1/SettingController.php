<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSettingRequest;
use App\Http\Requests\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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

    /**
     * Update multiple settings at once.
     *
     * Accepts a key/value payload and only updates keys that exist
     * in the database. Values are validated against the stored type
     * (string, integer or boolean).
     */
    public function bulkUpdate(Request $request)
    {
        $data = $request->all();
        $updated = collect();

        foreach ($data as $key => $value) {
            $setting = Setting::where('key', $key)->first();

            if (! $setting) {
                continue;
            }

            $casted = match ($setting->type) {
                'boolean' => filter_var($value, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE),
                'integer' => filter_var($value, FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE),
                default => (string) $value,
            };

            if ($casted === null && $setting->type !== 'string') {
                throw ValidationException::withMessages([
                    $key => ["Invalid value for {$setting->type}"]
                ]);
            }

            $setting->value = $casted;
            $setting->save();

            $updated->push($setting);
        }

        return SettingResource::collection($updated);
    }

    public function getByKey(string $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        return SettingResource::make($setting);
    }
}
