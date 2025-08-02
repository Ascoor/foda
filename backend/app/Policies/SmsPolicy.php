<?php

namespace App\Policies;

use App\Models\Sms;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SmsPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Sms $sms): bool
    {
        return $user->id === $sms->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Sms $sms): bool
    {
        return $user->id === $sms->user_id;
    }

    public function delete(User $user, Sms $sms): bool
    {
        return $user->id === $sms->user_id;
    }
}
