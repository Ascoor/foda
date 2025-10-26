<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 🧩 1. تعريف الصلاحيات
        $permissionCatalog = [
            'manage users'      => 'إدارة المستخدمين على مستوى النظام',
            'manage volunteers' => 'إدارة شبكة المتطوعين',
            'manage settings'   => 'ضبط إعدادات المنصة',
            'manage campaigns'  => 'تخطيط الحملات والإشراف عليها',
            'assign committees' => 'تعيين اللجان ومتابعتها',
            'monitor results'   => 'مراقبة النتائج لحظة بلحظة',
            'audit activities'  => 'تدقيق الأنشطة الحساسة',
            'view analytics'    => 'عرض تحليلات الأداء الرئيسية',
        ];

        foreach (array_keys($permissionCatalog) as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web']
            );
        }

        // 🧩 2. تعريف الأدوار وربط الصلاحيات
        $roleDefinitions = [
            'admin' => [
                'label' => 'مدير النظام',
                'permissions' => array_keys($permissionCatalog),
            ],
            'supervisor' => [
                'label' => 'مشرف اللجنة',
                'permissions' => [
                    'manage volunteers',
                    'assign committees',
                    'view analytics',
                ],
            ],
            'volunteer' => [
                'label' => 'متطوع',
                'permissions' => [
                    'view analytics',
                ],
            ],
            'campaign_manager' => [
                'label' => 'مدير الحملة',
                'permissions' => [
                    'manage campaigns',
                    'manage volunteers',
                    'assign committees',
                    'view analytics',
                ],
            ],
            'auditor' => [
                'label' => 'مراقب النتائج',
                'permissions' => [
                    'monitor results',
                    'audit activities',
                    'view analytics',
                ],
            ],
        ];

        $roles = [];
        foreach ($roleDefinitions as $key => $def) {
            $role = Role::firstOrCreate(
                ['name' => $key, 'guard_name' => 'web']
            );
            $role->syncPermissions($def['permissions']);
            $roles[$key] = $role;
        }

        // 🧩 3. إنشاء مستخدمين رئيسيين وربطهم بالأدوار
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'roles' => ['admin', 'campaign_manager'],
            ],
            [
                'name' => 'Supervisor',
                'email' => 'supervisor@example.com',
                'password' => Hash::make('password'),
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Volunteer',
                'email' => 'volunteer@example.com',
                'password' => Hash::make('password'),
                'roles' => ['volunteer'],
            ],
            [
                'name' => 'Auditor',
                'email' => 'auditor@example.com',
                'password' => Hash::make('password'),
                'roles' => ['auditor'],
            ],
        ];

        foreach ($users as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $data['password'],
                    'status' => 'active',
                ]
            );
            $user->syncRoles(array_map(fn($r) => $roles[$r] ?? null, $data['roles']));
        }

        $this->command->info('✅ Roles, permissions, and default users seeded successfully!');
    }
}
