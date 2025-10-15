<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissionCatalog = [
            'manage users' => 'إدارة المستخدمين على مستوى النظام',
            'manage volunteers' => 'إدارة شبكة المتطوعين',
            'manage settings' => 'ضبط إعدادات المنصة',
            'manage campaigns' => 'تخطيط الحملات والإشراف عليها',
            'assign committees' => 'تعيين اللجان ومتابعتها',
            'monitor results' => 'مراقبة النتائج لحظة بلحظة',
            'audit activities' => 'تدقيق الأنشطة الحساسة',
            'view analytics' => 'عرض تحليلات الأداء الرئيسية',
        ];

        foreach (array_keys($permissionCatalog) as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web']
            );
        }

        $roleDefinitions = [
            [
                'name' => 'admin',
                'scope' => 'system',
                'label' => 'مدير النظام',
                'description' => 'صلاحيات مطلقة لإدارة المنصة وكامل الصلاحيات المتاحة.',
                'permissions' => array_keys($permissionCatalog),
            ],
            [
                'name' => 'supervisor',
                'scope' => 'committee',
                'label' => 'مشرف اللجنة (Legacy)',
                'permissions' => [
                    'manage volunteers',
                    'assign committees',
                    'view analytics',
                ],
            ],
            [
                'name' => 'volunteer',
                'scope' => 'committee',
                'label' => 'متطوع (Legacy)',
                'permissions' => [
                    'view analytics',
                ],
            ],
            [
                'name' => 'مدير الحملة',
                'scope' => 'election',
                'label' => 'مدير الحملة',
                'permissions' => [
                    'manage campaigns',
                    'manage volunteers',
                    'assign committees',
                    'view analytics',
                ],
            ],
        ];

        $roles = [];
        foreach ($roleDefinitions as $definition) {
            $role = Role::updateOrCreate(
                ['name' => $definition['name'], 'guard_name' => 'web'],
                [
                    'scope' => $definition['scope'],
                    'label' => $definition['label'],
                ]
            );
            $role->syncPermissions($definition['permissions']);
            $roles[$definition['name']] = $role;
        }

        // إنشاء المستخدمين الرئيسيين
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $adminUser->syncRoles([$roles['admin'], $roles['مدير الحملة'] ?? null]);

        $supervisorUser = User::firstOrCreate(
            ['email' => 'supervisor@example.com'],
            [
                'name' => 'Supervisor',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $supervisorUser->syncRoles([$roles['supervisor'] ?? null]);

        $volunteerUser = User::firstOrCreate(
            ['email' => 'volunteer@example.com'],
            [
                'name' => 'Volunteer',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $volunteerUser->syncRoles([$roles['volunteer'] ?? null]);
    }
}
