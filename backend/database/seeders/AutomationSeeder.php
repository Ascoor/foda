<?php

namespace Database\Seeders;

use App\Models\AutomationTask;
use App\Models\Campaign;
use App\Models\Notification;
use App\Models\Sms;
use App\Models\SmsSetting;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Ramsey\Uuid\Uuid;

class AutomationSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        $requiredTables = ['automation_tasks', 'notifications', 'sms_settings', 'sms'];
        foreach ($requiredTables as $table) {
            if (! Schema::hasTable($table)) {
                $this->command->warn('⚠️ الجدول ' . $table . ' غير موجود، سيتم تخطي AutomationSeeder.');

                return;
            }
        }

        $campaign = Campaign::with('users')->where('slug', 'eg-2025-main')->first();
        if (! $campaign) {
            $this->command->warn('⚠️ لا يمكن تهيئة الأتمتة بدون الحملة الرئيسية.');

            return;
        }

        $admin = $campaign->users->first()?->id;

        DB::transaction(function () use ($campaign, $admin) {
            DB::table('automation_tasks')->where('campaign_id', $campaign->id)->delete();
            DB::table('notifications')->where('campaign_id', $campaign->id)->delete();
            DB::table('sms')->where('campaign_id', $campaign->id)->delete();
            DB::table('sms_settings')->where('campaign_id', $campaign->id)->delete();

            SmsSetting::updateOrCreate(
                ['campaign_id' => $campaign->id, 'provider' => 'vodafone-eg'],
                [
                    'config' => [
                        'sender' => 'EG2025',
                        'username' => 'demo-account',
                        'balance' => 1250,
                    ],
                ]
            );

            Sms::updateOrCreate(
                [
                    'campaign_id' => $campaign->id,
                    'provider_message_id' => 'demo-eg-1',
                ],
                [
                    'user_id' => $admin,
                    'to' => $this->egyptianPhone(),
                    'status' => 'delivered',
                    'body' => 'رسالة ترحيبية لفريق المتطوعين بشأن الفعالية القادمة.',
                    'meta' => ['type' => 'broadcast'],
                ]
            );

            $tasks = [
                [
                    'name' => 'مزامنة الناخبين النشطين',
                    'status' => 'active',
                    'config' => ['frequency' => 'daily', 'time' => '08:00'],
                ],
                [
                    'name' => 'جدولة رسائل التذكير بالفعاليات',
                    'status' => 'active',
                    'config' => ['frequency' => 'hourly', 'offset_hours' => 6],
                ],
            ];

            foreach ($tasks as $task) {
                AutomationTask::updateOrCreate(
                    [
                        'campaign_id' => $campaign->id,
                        'name' => $task['name'],
                    ],
                    [
                        'status' => $task['status'],
                        'last_run_at' => now()->subHours(random_int(2, 12)),
                        'config' => $task['config'],
                    ]
                );
            }

            $notifications = [
                [
                    'key' => 'event_reminder',
                    'type' => 'campaign.event.reminder',
                    'priority' => 'high',
                    'data' => ['title' => 'تذكير بفعالية اليوم', 'action' => 'عرض التفاصيل'],
                ],
                [
                    'key' => 'volunteer_summary',
                    'type' => 'campaign.volunteer.summary',
                    'priority' => 'normal',
                    'data' => ['title' => 'تقرير المتطوعين اليومي', 'count' => 48],
                ],
            ];

            foreach ($notifications as $notification) {
                $id = Uuid::uuid5(Uuid::NAMESPACE_URL, 'campaign-' . $campaign->id . '-' . $notification['key'])->toString();

                Notification::updateOrCreate(
                    ['id' => $id],
                    [
                        'campaign_id' => $campaign->id,
                        'user_id' => $admin,
                        'type' => $notification['type'],
                        'priority' => $notification['priority'],
                        'data' => $notification['data'],
                        'read_at' => null,
                    ]
                );
            }
        });

        $this->command->info('✅ إعداد الأتمتة والإشعارات والرسائل القصيرة للحملة.');
    }
}
