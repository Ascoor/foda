<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\AuthenticatedUserResource;
use App\Services\AuthService;
use App\Services\ScopeService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService, private ScopeService $scopeService)
    {
    }

    /**
     * Handle login and return access token.
     *
     * @throws AuthenticationException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        [$user, $token, $scope] = $this->authService->login(
            $request->only(['email', 'password']),
            (bool) $request->boolean('remember')
        );

        return response()->json([
            'token' => $token,
            'user' => new AuthenticatedUserResource($user, $scope),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()?->loadMissing('memberships');

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $scope = $this->scopeService->resolveForUser($user);

        return response()->json(new AuthenticatedUserResource($user, $scope));
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        [$user, $token, $scope] = $this->authService->refresh($user);

        return response()->json([
            'token' => $token,
            'user' => new AuthenticatedUserResource($user, $scope),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $this->authService->logout($user);
        }

        return response()->json(['message' => 'Logged out']);
    }
}
