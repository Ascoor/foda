<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\{Team, Campaign, Area, User};

class TeamsSeeder extends Seeder
{
    public function run(): void
    {
        $campaign = Campaign::first();
        if (! $campaign) {
            $this->command?->warn('⚠️ لا توجد حملة حالياً، شغّل CampaignsSeeder أولاً.');
            return;
        }

        // مناطق الحملة عبر pivot
        $campaignAreaIds = DB::table('campaign_area')
            ->where('campaign_id', $campaign->id)
            ->pluck('area_id')->toArray();

        $areas = Area::whereIn('id', $campaignAreaIds)->get();
        $users = User::take(5)->get();

        $teams = [
            ['name' => 'فريق القاهرة المركزى',    'area' => 'القاهرة',    'supervisor' => 'أحمد محمود'],
            ['name' => 'فريق الجيزة الميدانى',    'area' => 'الجيزة',     'supervisor' => 'محمد عبد الله'],
            ['name' => 'فريق الإسكندرية الساحلى', 'area' => 'الإسكندرية', 'supervisor' => 'محمود فوزى'],
            ['name' => 'فريق الدقهلية التنظيمى',  'area' => 'المنصورة',   'supervisor' => 'خالد السيد'],
            ['name' => 'فريق أسيوط الجنوبى',      'area' => 'أسيوط',      'supervisor' => 'حسن عبد الرحمن'],
        ];

        foreach ($teams as $data) {
            // جرّب تطابق داخل المجموعة المحمّلة
            $area = $areas->first(function ($a) use ($data) {
                $target = $data['area'];
                return (($a->name_ar ?? null) === $target) || (($a->name_en ?? null) === $target);
            });

            // لو ما لقيناش، ابحث في DB بشرطية حسب الأعمدة المتاحة (بدون 'name')
            if (! $area) {
                $q = Area::query();
                $added = false;
                if (Schema::hasColumn('areas', 'name_ar')) {
                    $q->orWhere('name_ar', $data['area']); $added = true;
                }
                if (Schema::hasColumn('areas', 'name_en')) {
                    $q->orWhere('name_en', $data['area']); $added = true;
                }

                $existing = $added ? $q->first() : null;

                if ($existing) {
                    // اربطها بالحملة إن لم تكن مرتبطة
                    DB::table('campaign_area')->updateOrInsert(
                        ['campaign_id' => $campaign->id, 'area_id' => $existing->id],
                        ['created_at' => now(), 'updated_at' => now()]
                    );
                    $area = $existing;
                    $areas->push($existing);
                } else {
                    // أنشئ منطقة جديدة بالاسم العربي واربطها بالحملة
                    $created = Area::create([
                        'name_ar' => $data['area'],
                        'type'    => 'city',
                    ]);
                    DB::table('campaign_area')->insert([
                        'campaign_id' => $campaign->id,
                        'area_id'     => $created->id,
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);
                    $area = $created;
                    $areas->push($created);
                }
            }

            $supervisor = $users->isNotEmpty() ? $users->random() : null;

            Team::updateOrCreate(
                ['campaign_id' => $campaign->id, 'name' => $data['name']],
                [
                    'area_id'       => $area?->id,
                    'supervisor_id' => $supervisor?->id,
                    'meta'          => [
                        'supervisor_name' => $data['supervisor'],
                        'notes'           => 'تم إنشاء الفريق تلقائياً لعرض البيانات المصرية بشكل تجريبى',
                    ],
                ]
            );
        }

        $this->command?->info('✅ تم إنشاء فرق الحملة المصرية وربطها بمناطق الحملة بنجاح.');
    }
}
