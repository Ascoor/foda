<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('users') || ! Schema::hasTable('campaign_user')) {
            $this->command->warn('⚠️ جداول المستخدمين أو الربط بالحملة غير متوفرة، سيتم تخطي UserSeeder.');

            return;
        }

        $campaign = Campaign::where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن إنشاء المستخدمين بدون الحملة الرئيسية.');

            return;
        }

        $supervisorCount = 6;
        $supervisors = [];
        for ($i = 1; $i <= $supervisorCount; $i++) {
            $nameParts = $this->randArabicName('male');
            $supervisors[] = [
                'name' => $nameParts['full'],
                'email' => 'supervisor' . $i . '@eg2025.test',
            ];
        }

        $adminName = $this->randArabicName('male');

        DB::transaction(function () use ($campaign, $adminName, $supervisors) {
            $admin = User::updateOrCreate(
                ['email' => 'admin@eg2025.test'],
                [
                    'name' => $adminName['full'] . ' - مدير الحملة',
                    'password' => Hash::make('Password@123'),
                    'last_login_at' => now()->subDays(1),
                ]
            );

            $campaign->users()->syncWithoutDetaching([
                $admin->id => [
                    'role' => 'admin',
                    'status' => 'active',
                    'permissions' => json_encode(['manage_campaign', 'manage_finance', 'broadcast_sms']),
                ],
            ]);

            foreach ($supervisors as $index => $spec) {
                $user = User::updateOrCreate(
                    ['email' => $spec['email']],
                    [
                        'name' => $spec['name'],
                        'password' => Hash::make('Password@123'),
                        'last_login_at' => now()->subDays(random_int(2, 10)),
                    ]
                );

                $campaign->users()->syncWithoutDetaching([
                    $user->id => [
                        'role' => 'supervisor',
                        'status' => 'active',
                        'permissions' => json_encode(['view_reports', 'manage_field']),
                    ],
                ]);
            }
        });

        $this->command->info('✅ إنشاء المستخدمين وربطهم بالحملة: 1 مدير + ' . $supervisorCount . ' مشرف.');
    }
}
