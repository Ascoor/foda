<?php

namespace Database\Seeders;

use App\Models\Election;
use Database\Seeders\Traits\EgyptDataHelpers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class ElectionSeeder extends Seeder
{
    use EgyptDataHelpers;

    public function run(): void
    {
        if (! Schema::hasTable('elections')) {
            $this->command->warn('⚠️ جدول الانتخابات غير موجود، سيتم تخطي ElectionSeeder.');

            return;
        }

        $election = Election::updateOrCreate(
            ['name' => 'الانتخابات العامة 2025'],
            [
                'election_date' => now()->addMonths(2)->toDateString(),
                'meta' => ['country' => 'EG', 'locale' => 'ar_EG'],
            ]
        );

        $this->command->info('✅ إنشاء الانتخابات: ' . $election->name);
    }
}
