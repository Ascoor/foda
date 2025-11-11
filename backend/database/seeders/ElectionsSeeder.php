<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ElectionsSeeder extends Seeder
{
    public function run(): void
    {
        // تأكد أن جدول elections موجود
        if (! Schema::hasTable('elections')) {
            $this->command?->warn('⚠️ جدول elections غير موجود، تم تخطي ElectionsSeeder.');
            return;
        }

        // أعمدة جدولك الحالية: id, name, election_date, meta, timestamps
        DB::table('elections')->updateOrInsert(
            ['id' => 1],
            [
                'name'          => 'انتخابات مجلس النواب 2025',
                'election_date' => now()->toDateString(), // عدّل التاريخ حسب الحاجة
                'meta'          => json_encode([
                    'notes'  => 'بيانات أولية للعرض المصري',
                    'source' => 'ElectionsSeeder',
                ], JSON_UNESCAPED_UNICODE),
                'created_at'    => now(),
                'updated_at'    => now(),
            ]
        );
    }
}
