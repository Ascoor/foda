<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function create(array $data): Profile
    {
        $this->updateUser($data);
        return Profile::create($data);
    }

    public function update(Profile $profile, array $data): Profile
    {
        $this->updateUser($data, $profile->user);
        $profile->update($data);
        return $profile;
    }

    protected function updateUser(array $data, ?User $user = null): void
    {
        $user = $user ?: User::find($data['user_id']);
        if (!$user) {
            return;
        }

        if (isset($data['email'])) {
            $user->email = $data['email'];
        }

        if (isset($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();
    }
}
