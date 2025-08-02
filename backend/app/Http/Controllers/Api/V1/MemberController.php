<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();

        return UserResource::collection($users);
    }

    public function store(StoreMemberRequest $request)
    {
        $data = $request->validated();
        $password = Str::random(10);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($password),
        ]);

        if (!empty($data['role'])) {
            $user->assignRole($data['role']);
        }

        $user->load('roles');

        return (new UserResource($user))
            ->response()
            ->setStatusCode(201);
    }
}
