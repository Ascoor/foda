<?php

namespace Database\Factories;

use App\Models\ElectionCircle\Campaign;
use App\Models\Notification;
use App\Models\User;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_EG');
    }

    public function definition(): array
    {
        $titles = ['تنبيه متابعة ميدانية', 'تقرير أداء الحملة', 'تذكير بفعالية اليوم', 'تنبيه دعم عاجل'];
        $bodies = [
            'تم رصد تجمع لمنافسنا في سوق إمبابة، يرجى تكثيف المرور على التجار المؤيدين.',
            'رجاء مشاركة صور من جولة المرشح في المطرية قبل نهاية اليوم.',
            'الفريق الإعلامي في انتظار تأكيد الحضور لفعالية الغد في قاعة الشباب.',
            'متطوعي لجنة عزبة النخل بحاجة إلى مواد دعائية إضافية قبل نهاية الأسبوع.',
        ];

        $userId = $this->resolveUserId();
        $campaign = $this->resolveCampaign();

        return [
            'user_id' => $userId,
            'notifiable_type' => Campaign::class,
            'notifiable_id' => $campaign?->id,
            'title' => $this->faker->randomElement($titles),
            'body' => $this->faker->randomElement($bodies),
            'data' => [
                'campaign' => $campaign?->name,
                'priority' => $this->faker->randomElement(['منخفض', 'متوسط', 'عالٍ']),
                'created_by' => 'لوحة التحكم',
                'sent_at' => Carbon::now()->subMinutes($this->faker->numberBetween(5, 150))->toIso8601String(),
            ],
            'read_at' => $this->faker->boolean(45) ? Carbon::now()->subMinutes($this->faker->numberBetween(1, 90)) : null,
        ];
    }

    protected function resolveUserId(): int
    {
        $existing = User::query()->inRandomOrder()->value('id');

        if ($existing) {
            return $existing;
        }

        return User::factory()->create()->id;
    }

    protected function resolveCampaign(): ?Campaign
    {
        return Campaign::query()->inRandomOrder()->first();
    }
}
