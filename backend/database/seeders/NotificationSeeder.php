<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        Campaign::with('volunteers')->each(function (Campaign $campaign) {
            $users = $campaign->volunteers->pluck('user_id')->filter()->unique();

            if ($users->isEmpty()) {
                Notification::factory()->count(3)->create([
                    'notifiable_id' => $campaign->id,
                ]);
                return;
            }

            $users->each(function ($userId) use ($campaign) {
                Notification::factory()->create([
                    'user_id' => $userId,
                    'notifiable_id' => $campaign->id,
                ]);
            });
        });
    }
}
