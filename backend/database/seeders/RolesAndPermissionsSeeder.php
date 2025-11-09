<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // 0) امسح الكاش الخاص بالصلاحيات قبل أي تعديل
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1) كتالوج الصلاحيات
        $permissions = [
            'manage users'      => 'إدارة المستخدمين على مستوى النظام',
            'manage volunteers' => 'إدارة شبكة المتطوعين',
            'manage settings'   => 'ضبط إعدادات المنصة',
            'manage campaigns'  => 'تخطيط الحملات والإشراف عليها',
            'assign committees' => 'تعيين اللجان ومتابعتها',
            'monitor results'   => 'مراقبة النتائج لحظة بلحظة',
            'audit activities'  => 'تدقيق الأنشطة الحساسة',
            'view analytics'    => 'عرض تحليلات الأداء الرئيسية',
        ];

        foreach ($permissions as $name => $desc) {
            Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                [] // وصف الصلاحية يمكن تخزينه في جدول منفصل/ميتا إن رغبت
            );
        }

        // 2) تعريف الأدوار وربط الصلاحيات
        $rolesDefinition = [
            'admin' => [
                'label' => 'مدير النظام',
                'permissions' => array_keys($permissions),
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
        foreach ($rolesDefinition as $name => $def) {
            $role = Role::firstOrCreate(
                ['name' => $name, 'guard_name' => 'web'],
                []
            );
            $role->syncPermissions($def['permissions']);
            $roles[$name] = $role;
        }

        // 3) مستخدمون افتراضيون + ربط بالأدوار
        $defaultPassword = Hash::make('Password@123');

        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => $defaultPassword,
                'roles' => ['admin', 'campaign_manager'],
            ],
            [
                'name' => 'Supervisor',
                'email' => 'supervisor@example.com',
                'password' => $defaultPassword,
                'roles' => ['supervisor'],
            ],
            [
                'name' => 'Volunteer',
                'email' => 'volunteer@example.com',
                'password' => $defaultPassword,
                'roles' => ['volunteer'],
            ],
            [
                'name' => 'Auditor',
                'email' => 'auditor@example.com',
                'password' => $defaultPassword,
                'roles' => ['auditor'],
            ],
        ];

        foreach ($users as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $userData['password'],
                    'status' => 'active',
                ]
            );

            // مهم: تأكد أن حارس المستخدم هو web (حسب config/auth)
            // ثم اربط الأدوار:
            $user->syncRoles([]); // تفريغ أي أدوار قديمة إن وُجدت
            foreach ($userData['roles'] as $r) {
                $user->assignRole($r);
            }
        }

        // 4) امسح كاش الصلاحيات بعد البناء
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('✅ تم إنشاء الصلاحيات والأدوار والمستخدمين بنجاح!');
    }
}
