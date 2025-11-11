<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $perms = [
            'campaign.view','campaign.manage',
            'committee.view','committee.manage',
            'voter.view','voter.manage',
            'activity.view','activity.manage',
            'finance.view','finance.manage',
        ];

        // Create permissions
        foreach ($perms as $p) { 
            Permission::firstOrCreate(['name' => $p]); 
        }

        // Define roles and their associated permissions
        $roles = [
            'campaign_manager' => ['campaign.manage','committee.manage','voter.manage','activity.manage','finance.manage'],
            'area_coordinator' => ['committee.manage','voter.manage','activity.manage'],
            'committee_supervisor' => ['voter.manage','activity.manage'],
            'agent' => ['activity.manage','voter.view'],
            'volunteer' => ['activity.manage'],
            'finance' => ['finance.manage'],
            'viewer' => ['campaign.view','committee.view','voter.view','activity.view','finance.view'],
        ];

        // Create roles and assign permissions
        foreach ($roles as $role => $permissions) {
            $r = Role::firstOrCreate(['name' => $role]);
            $r->syncPermissions($permissions);
        }

        // Define default users
        $defaultPassword = Hash::make('Password@123');
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => $defaultPassword,
                'roles' => ['campaign_manager'],
            ],
            [
                'name' => 'Area Coordinator',
                'email' => 'area_coordinator@example.com',
                'password' => $defaultPassword,
                'roles' => ['area_coordinator'],
            ],
            [
                'name' => 'Committee Supervisor',
                'email' => 'committee_supervisor@example.com',
                'password' => $defaultPassword,
                'roles' => ['committee_supervisor'],
            ],
            [
                'name' => 'Volunteer',
                'email' => 'volunteer@example.com',
                'password' => $defaultPassword,
                'roles' => ['volunteer'],
            ],
            [
                'name' => 'Finance',
                'email' => 'finance@example.com',
                'password' => $defaultPassword,
                'roles' => ['finance'],
            ],
            [
                'name' => 'Viewer',
                'email' => 'viewer@example.com',
                'password' => $defaultPassword,
                'roles' => ['viewer'],
            ],
        ];

        // Create users and assign roles
        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $userData['password'],
                    'status' => 'active',
                ]
            );

            // Sync roles for user
            $user->syncRoles([]); // Remove old roles if any
            foreach ($userData['roles'] as $role) {
                $user->assignRole($role);
            }
        }

        $this->command->info('✅ Permissions, roles, and users have been created successfully!');
    }
}
