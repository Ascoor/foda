<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Services\Auth\RoleIntelligenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'role:admin|مدير الحملة']);
    }

    public function index(): JsonResponse
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy('scope')
            ->orderBy('name')
            ->get()
            ->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'scope' => $role->scope,
                'permissions' => $role->permissions->pluck('name'),
                'permissions_json' => $role->permissions_json,
                'auto_assign_rules' => $role->auto_assign_rules,
                'updated_at' => $role->updated_at,
            ]);

        return response()->json([
            'data' => $roles,
            'permissions' => Permission::query()->orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, Role $role, RoleIntelligenceService $roleIntelligenceService): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'scope' => ['sometimes', Rule::in(['system', 'election', 'committee'])],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', Rule::exists('permissions', 'name')],
            'permissions_json' => ['nullable', 'array'],
            'auto_assign_rules' => ['nullable', 'array'],
            'user_ids' => ['sometimes', 'array'],
            'user_ids.*' => ['integer', Rule::exists('users', 'id')],
            'context' => ['sometimes', 'array'],
        ]);

        if (array_key_exists('name', $payload)) {
            $role->name = $payload['name'];
        }

        if (array_key_exists('scope', $payload)) {
            $role->scope = $payload['scope'];
        }

        if (array_key_exists('permissions_json', $payload)) {
            $role->permissions_json = $payload['permissions_json'];
        }

        if (array_key_exists('auto_assign_rules', $payload)) {
            $role->auto_assign_rules = $payload['auto_assign_rules'];
        }

        $role->save();

        if (array_key_exists('permissions', $payload)) {
            $role->syncPermissions($payload['permissions']);
        }

        $role->load('permissions:id,name');

        if (!empty($payload['user_ids'])) {
            $users = User::query()->whereIn('id', $payload['user_ids'])->get();
            foreach ($users as $user) {
                $roleIntelligenceService->evaluate($user, $payload['context'] ?? []);
            }
        }

        return response()->json([
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'scope' => $role->scope,
                'permissions' => $role->permissions->pluck('name'),
                'permissions_json' => $role->permissions_json,
                'auto_assign_rules' => $role->auto_assign_rules,
                'updated_at' => $role->updated_at,
            ],
        ]);
    }
}

