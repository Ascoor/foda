<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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
            $area = $areas->first(fn ($a) => ($a->name ?? null) === $data['area']);

            if (! $area) {
                $existing = Area::where('name', $data['area'])->first();

                if ($existing) {
                    DB::table('campaign_area')->updateOrInsert(
                        ['campaign_id' => $campaign->id, 'area_id' => $existing->id],
                        ['created_at' => now(), 'updated_at' => now()]
                    );
                    $area = $existing;
                    $areas->push($existing);
                } else {
                    $created = Area::create([
                        'name' => $data['area'],
                        'type' => 'city',
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
