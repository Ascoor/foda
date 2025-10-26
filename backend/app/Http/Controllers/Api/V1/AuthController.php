<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Authenticate user and return token.
     *
     * @OA\Post(
     *     path="/api/v1/login",
     *     summary="Login",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(required={"email","password"},
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Successful login"),
     *     @OA\Response(response=401, description="Invalid credentials")
     * )
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $remember = (bool) $request->input('remember', false);

        if (!Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], $remember)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة.'],
            ]);
        }

        $user = $request->user();

        $user->tokens()->delete();

        $tokenName = $remember ? 'remember_token' : 'access_token';
        $expiresAt = now()->addDays($remember ? 30 : 1);
        $token = $user->createToken($tokenName, ['*'], $expiresAt);

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'token' => $token->plainTextToken,
            'user' => new UserResource($user->load('roles', 'permissions')),
        ]);
    }

    /**
     * Register a new user with role.
     *
     * @OA\Post(
     *     path="/api/v1/register",
     *     summary="Register user",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     @OA\Response(response=201, description="Created"),
     * )
     */
    public function register(RegisterRequest $request)
    {
        $this->authorize('create', User::class);

        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        $user->assignRole($data['role_id']);
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => new UserResource($user->load('roles', 'permissions')),
                'token' => $token,
            ],
        ], 201);
    }

    /**
     * Logout current user.
     *
     * @OA\Post(
     *     path="/api/v1/logout",
     *     summary="Logout",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="Logged out")
     * )
     */
    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json(['message' => 'تم تسجيل الخروج بنجاح']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json(new UserResource($user->loadMissing('roles', 'permissions')));
    }

    /**
     * Return authenticated user's profile.
     *
     * @OA\Get(
     *     path="/api/v1/profile",
     *     summary="Profile",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="User profile")
     * )
     */
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => new UserResource($request->user()->load('roles', 'permissions')),
        ]);
    }

    /**
     * Update authenticated user's profile.
     *
     * @OA\Put(
     *     path="/api/v1/profile",
     *     summary="Update profile",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     @OA\Response(response=200, description="Updated")
     * )
     */
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'status' => 'success',
            'data' => new UserResource($user->load('roles', 'permissions')),
        ]);
    }
}
