<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Campaign;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserAndRolesSeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('users') || ! Schema::hasTable('campaign_user')) {
            $this->command->warn('⚠️ جداول المستخدمين أو الحملة غير متوفرة، سيتم تخطي UserAndRolesSeeder.');
            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء المستخدمين بدون حملة رئيسية.');
            return;
        }

        // 🧩 1. إنشاء الصلاحيات
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

        foreach (array_keys($permissionCatalog) as $perm) {
            Permission::firstOrCreate(['name' => $perm], ['guard_name' => 'web']);
        }

        // 🧩 2. تعريف الأدوار وربط الصلاحيات
        $roleDefinitions = [
            'admin' => [
                'label' => 'مدير النظام',
                'permissions' => array_keys($permissionCatalog),
            ],
            'supervisor' => [
                'label' => 'مشرف اللجنة',
                'permissions' => ['manage volunteers', 'assign committees', 'view analytics'],
            ],
            'volunteer' => [
                'label' => 'متطوع',
                'permissions' => ['view analytics'],
            ],
            'campaign_manager' => [
                'label' => 'مدير الحملة',
                'permissions' => ['manage campaigns', 'manage volunteers', 'assign committees', 'view analytics'],
            ],
            'auditor' => [
                'label' => 'مراقب النتائج',
                'permissions' => ['monitor results', 'audit activities', 'view analytics'],
            ],
        ];

        $roles = [];
        foreach ($roleDefinitions as $key => $def) {
            $role = Role::firstOrCreate(['name' => $key, 'guard_name' => 'web']);
            $role->syncPermissions($def['permissions']);
            $roles[$key] = $role;
        }

        // 🧩 3. إنشاء مستخدم "مدير الحملة"
        $admin = User::updateOrCreate(
            ['email' => 'admin@eg2025.test'],
            [
                'name' => 'مدير عام الحملة',
                'password' => Hash::make('Password@123'),
                'status' => 'active',
            ]
        );
        $admin->syncRoles(['admin', 'campaign_manager']);

        $campaign->users()->syncWithoutDetaching([
            $admin->id => [
                'role' => 'admin',
                'status' => 'active',
                'permissions' => json_encode(['manage_campaigns', 'manage_settings', 'broadcast_sms']),
            ]
        ]);

        // 🧩 4. مشرفين عشوائيين
        for ($i = 1; $i <= 6; $i++) {
            $user = User::updateOrCreate(
                ['email' => "supervisor{$i}@eg2025.test"],
                [
                    'name' => "مشرف {$i}",
                    'password' => Hash::make('Password@123'),
                    'status' => 'active',
                ]
            );
            $user->assignRole('supervisor');

            $campaign->users()->syncWithoutDetaching([
                $user->id => [
                    'role' => 'supervisor',
                    'status' => 'active',
                    'permissions' => json_encode(['view_reports', 'manage_field']),
                ]
            ]);
        }

        $this->command->info('✅ تم إنشاء الأدوار والصلاحيات والمستخدمين وربطهم بالحملة بنجاح.');
    }
}
