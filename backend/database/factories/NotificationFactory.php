<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Database\Factories\Concerns\ResolvesCampaign;
use Faker\Factory as FakerFactory;
use Faker\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class NotificationFactory extends Factory
{
    use ResolvesCampaign;

    protected $model = Notification::class;

    protected function withFaker(): Generator
    {
        return FakerFactory::create('ar_SA');
    }

    public function definition(): array
    {
        $types = ['field', 'logistics', 'performance'];
        $priorities = ['low', 'medium', 'high'];
        $messages = [
            'يرجى متابعة التغطية الإعلامية للحملة في الدائرة.',
            'تم تحديث قائمة الناخبين، الرجاء مراجعتها والتأكد من الدقة.',
            'هناك طلب دعم عاجل للفريق الميداني في الحي الشمالي.',
            'يرجى إرسال تقرير موجز عن نشاط الأمس قبل الساعة 5 مساءً.',
        ];

        $userId = $this->resolveUserId();

        return [
            'campaign_id' => $this->resolveCampaignId(),
            'user_id' => $userId,
            'type' => $this->faker->randomElement($types),
            'title' => $this->faker->randomElement([
                'تنبيه متابعة ميدانية',
                'تحديث بيانات الناخبين',
                'طلب دعم عاجل',
                'تذكير بالتقارير اليومية',
            ]),
            'message' => $this->faker->randomElement($messages),
            'priority' => $this->faker->randomElement($priorities),
            'meta' => [
                'recipient_name' => User::find($userId)?->name,
                'created_by' => 'منصة Elections360',
                'requested_at' => Carbon::now()->subMinutes($this->faker->numberBetween(5, 180))->toIso8601String(),
            ],
            'read_at' => $this->faker->boolean(40) ? Carbon::now()->subMinutes($this->faker->numberBetween(1, 120)) : null,
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
}
