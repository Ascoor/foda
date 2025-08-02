<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use App\Services\ProfileService;

class ProfileController extends Controller
{
    public function __construct(private ProfileService $service)
    {
    }

    public function index()
    {
        return ProfileResource::collection(Profile::with('user')->get());
    }

    public function store(ProfileRequest $request)
    {
        $profile = $this->service->create($request->validated());
        return (new ProfileResource($profile->load('user')))->response()->setStatusCode(201);
    }

    public function show(Profile $profile)
    {
        return new ProfileResource($profile->load('user'));
    }

    public function update(ProfileRequest $request, Profile $profile)
    {
        $profile = $this->service->update($profile, $request->validated());
        return new ProfileResource($profile->load('user'));
    }

    public function destroy(Profile $profile)
    {
        $profile->delete();
        return response()->noContent();
    }
}
