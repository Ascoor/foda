<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function __construct(private ScopeService $scopeService)
    {
    }

    /**
     * @throws AuthenticationException
     */
    public function login(array $credentials, bool $remember = false): array
    {
        if (!Auth::attempt($credentials, $remember)) {
            throw new AuthenticationException(__('auth.failed'));
        }

        /** @var User $user */
        $user = Auth::user();
        $user->tokens()->delete();

        $token = $user->createToken($remember ? 'long_lived' : 'access', ['*'], now()->addMinutes($remember ? 60 * 24 * 30 : 60 * 24));
        $user->loadMissing('memberships');
        $scope = $this->scopeService->resolveForUser($user);

        return [$user, $token->plainTextToken, $scope];
    }

    public function refresh(User $user): array
    {
        $user->tokens()->delete();
        $token = $user->createToken('access', ['*'], now()->addHours(24));
        $user->loadMissing('memberships');

        return [$user, $token->plainTextToken, $this->scopeService->resolveForUser($user)];
    }

    public function logout(User $user): void
    {
        $token = $user->currentAccessToken();

        if ($token) {
            $token->delete();
        }
    }
}
