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
                'auto_assign_rules' => [
                    'priority' => 100,
                    'manual_only' => true,
                    'scope' => 'system',
                ],
            ],
            [
                'name' => 'supervisor',
                'scope' => 'committee',
                'label' => 'مشرف اللجنة (Legacy)',
                'description' => 'الدعم للأنظمة القديمة التي تعتمد على الاسم الإنجليزي للدور.',
                'permissions' => [
                    'manage volunteers',
                    'assign committees',
                    'view analytics',
                ],
                'auto_assign_rules' => [
                    'priority' => 45,
                    'scope' => 'committee',
                    'thresholds' => ['committees_assigned' => 1],
                ],
            ],
            [
                'name' => 'volunteer',
                'scope' => 'committee',
                'label' => 'متطوع (Legacy)',
                'description' => 'دور المتطوع التقليدي لعمليات التوافق مع الإصدارات السابقة.',
                'permissions' => [
                    'view analytics',
                ],
                'auto_assign_rules' => [
                    'priority' => 20,
                    'scope' => 'committee',
                    'thresholds' => ['volunteers_managed' => 0],
                ],
            ],
            [
                'name' => 'مدير الحملة',
                'scope' => 'election',
                'label' => 'مدير الحملة',
                'description' => 'قيادة الحملة الانتخابية وتوجيه فرق العمل عبر الدوائر المختلفة.',
                'permissions' => [
                    'manage campaigns',
                    'manage volunteers',
                    'assign committees',
                    'view analytics',
                ],
                'auto_assign_rules' => [
                    'priority' => 90,
                    'scope' => 'election',
                    'thresholds' => [
                        'campaigns_managed' => 1,
                        'activities_created' => 15,
                    ],
                ],
            ],
            [
                'name' => 'مشرف اللجنة',
                'scope' => 'committee',
                'label' => 'مشرف اللجنة',
                'description' => 'متابعة أداء اللجان الميدانية وضمان تنفيذ خطة الحملة.',
                'permissions' => [
                    'assign committees',
                    'manage volunteers',
                    'view analytics',
                ],
                'auto_assign_rules' => [
                    'priority' => 70,
                    'scope' => 'committee',
                    'thresholds' => [
                        'committees_assigned' => 2,
                        'activities_created' => 5,
                    ],
                ],
            ],
            [
                'name' => 'منسق المتطوعين',
                'scope' => 'committee',
                'label' => 'منسق المتطوعين',
                'description' => 'تنسيق جهود المتطوعين وجدولة أنشطتهم الميدانية.',
                'permissions' => [
                    'manage volunteers',
                    'view analytics',
                ],
                'auto_assign_rules' => [
                    'priority' => 60,
                    'scope' => 'committee',
                    'thresholds' => [
                        'volunteers_managed' => 5,
                        'activities_created' => 3,
                    ],
                ],
            ],
            [
                'name' => 'مراقب النتائج',
                'scope' => 'election',
                'label' => 'مراقب النتائج',
                'description' => 'تحليل النتائج لحظيًا ورصد أي مؤشرات حساسة.',
                'permissions' => [
                    'monitor results',
                    'audit activities',
                    'view analytics',
                ],
                'auto_assign_rules' => [
                    'priority' => 55,
                    'scope' => 'election',
                    'thresholds' => [
                        'observations_submitted' => 5,
                    ],
                ],
            ],
        ];

        $roles = [];

        foreach ($roleDefinitions as $definition) {
            $role = Role::updateOrCreate(
                ['name' => $definition['name'], 'guard_name' => 'web'],
                [
                    'scope' => $definition['scope'],
                    'permissions_json' => [
                        'label' => $definition['label'],
                        'description' => $definition['description'],
                    ],
                    'auto_assign_rules' => $definition['auto_assign_rules'],
                ]
            );

            $role->syncPermissions($definition['permissions']);
            $roles[$definition['name']] = $role;
        }

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $adminUser->syncRoles([
            $roles['admin'],
            $roles['مدير الحملة'],
        ]);

        $supervisorUser = User::firstOrCreate(
            ['email' => 'supervisor@example.com'],
            [
                'name' => 'Supervisor',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $supervisorUser->syncRoles([
            $roles['supervisor'],
            $roles['مشرف اللجنة'],
        ]);

        $volunteerUser = User::firstOrCreate(
            ['email' => 'volunteer@example.com'],
            [
                'name' => 'Volunteer',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $volunteerUser->syncRoles([
            $roles['volunteer'],
            $roles['منسق المتطوعين'],
        ]);

        $auditorUser = User::firstOrCreate(
            ['email' => 'auditor@example.com'],
            [
                'name' => 'Auditor',
                'password' => Hash::make('password'),
                'status' => 'active',
            ]
        );
        $auditorUser->syncRoles([
            $roles['مراقب النتائج'],
        ]);
    }
}
