<?php

namespace Database\Factories;

use App\Models\Sms;
use Illuminate\Database\Eloquent\Factories\Factory;

class SmsFactory extends Factory
{
    protected $model = Sms::class;

    public function definition(): array
    {
        return [
            'message' => $this->faker->sentence,
            'recipient_phone' => $this->faker->e164PhoneNumber,
            'status' => 'sent',
            'sent_at' => now(),
        ];
    }
}
