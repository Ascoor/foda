<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $supervisor = Role::firstOrCreate(['name' => 'supervisor']);
        $volunteer = Role::firstOrCreate(['name' => 'volunteer']);

        // Define permissions and assign to roles
        $permissions = [
            'manage users'      => [$admin],
            'manage volunteers' => [$admin, $supervisor],
            'manage settings'   => [$admin],
        ];

        foreach ($permissions as $perm => $roles) {
            $permission = Permission::firstOrCreate(['name' => $perm]);
            $permission->syncRoles($roles);
        }

        // Seed default users
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $adminUser->assignRole($admin);

        $supervisorUser = User::firstOrCreate(
            ['email' => 'supervisor@example.com'],
            [
                'name' => 'Supervisor',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $supervisorUser->assignRole($supervisor);

        $volunteerUser = User::firstOrCreate(
            ['email' => 'volunteer@example.com'],
            [
                'name' => 'Volunteer',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $volunteerUser->assignRole($volunteer);
    }
}
