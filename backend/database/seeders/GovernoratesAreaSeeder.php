<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class GovernoratesAreaSeeder extends Seeder
{
    private bool $hasLatColumn = false;

    private bool $hasLngColumn = false;

    public function run(): void
    {
        DB::transaction(function (): void {
            $this->hasLatColumn = Schema::hasColumn('areas', 'lat');
            $this->hasLngColumn = Schema::hasColumn('areas', 'lng');

            $coords = $this->coordinatesMap();

            $specs = [
                [
                    'name_ar' => 'الدقهلية',
                    'name_en' => 'Dakahlia',
                    'type' => 'governorate',
                    'children' => $this->dakahliaChildren(),
                ],
                [
                    'name_ar' => 'الشرقية',
                    'name_en' => 'Sharqia',
                    'type' => 'governorate',
                    'children' => $this->sharqiaChildren(),
                ],
            ];

            $summary = [
                'governorates' => ['created' => 0, 'updated' => 0],
                'children' => [],
            ];

            foreach ($specs as $spec) {
                [$governorateId, $created] = $this->createOrGetGovernorate($spec['name_ar'], $spec['name_en'], $spec['type'], $coords);
                $summary['governorates'][$created ? 'created' : 'updated']++;

                $childrenResult = $this->seedChildren($governorateId, $spec['children'], $coords);
                $summary['children'][$spec['name_ar']] = $childrenResult['counts'];
            }

            Log::info('GovernoratesAreaSeeder completed', [
                'governorates_created' => $summary['governorates']['created'],
                'governorates_updated' => $summary['governorates']['updated'],
                'children' => $summary['children'],
            ]);
        });
    }

    private function createOrGetGovernorate(string $nameAr, string $nameEn, string $type, array $coords): array
    {
        return $this->insertOrUpdateArea([
            'name_ar' => $nameAr,
            'name_en' => $nameEn,
            'type' => $type,
            'level' => 0,
            'parent_id' => null,
        ], $coords);
    }

    private function seedChildren(int $parentId, array $children, array $coords): array
    {
        $ids = [];
        $counts = ['created' => 0, 'updated' => 0];

        foreach ($children as $child) {
            [$id, $created] = $this->insertOrUpdateArea(array_merge($child, [
                'parent_id' => $parentId,
                'level' => 1,
            ]), $coords);

            $ids[] = $id;
            $counts[$created ? 'created' : 'updated']++;
        }

        return ['ids' => $ids, 'counts' => $counts];
    }

    private function insertOrUpdateArea(array $attributes, array $coords): array
    {
        $nameAr   = Arr::get($attributes, 'name_ar');
        $nameEn   = Arr::get($attributes, 'name_en');
        $type     = Arr::get($attributes, 'type');
        $level    = (int) Arr::get($attributes, 'level', 0);
        $parentId = Arr::get($attributes, 'parent_id');
        $code     = Arr::get($attributes, 'code');
    
        $slugSource = $nameEn ?: $nameAr;
        $slug = Str::slug((string) $slugSource) ?: Str::slug((string) $nameAr) ?: md5((string) $nameAr);
    
        $coordsPair = Arr::get($coords, $nameAr);
        $lat = is_array($coordsPair) ? Arr::get($coordsPair, 0) : null;
        $lng = is_array($coordsPair) ? Arr::get($coordsPair, 1) : null;
    
        $existing = Area::query()->where('slug', $slug)->first();
    
        // meta كمصفوفة → JSON
        $metaArray = Arr::get($attributes, 'meta', []);
        if (!is_array($metaArray)) {
            $metaArray = [];
        }
        if (!$this->hasLatColumn || !$this->hasLngColumn) {
            $metaArray['lat'] = $lat;
            $metaArray['lng'] = $lng;
        }
        $metaJson = empty($metaArray) ? null : json_encode($metaArray, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
        // حمّل الـ payload
        $payload = [
            'name'        => $nameAr,              // لو عندك عمود name
            'name_ar'     => $nameAr,
            'name_en'     => $nameEn,
            'slug'        => $slug,
            'type'        => $type,
            'level'       => $level,
            'parent_id'   => $parentId,
            'code'        => $code,
            'meta'        => $metaJson,            // <<<<<<<<<< هنا بقى JSON
            'description' => (string) Arr::get($attributes, 'description', ''), // ضمنًا نص
            'x'           => $lat,
            'y'           => $lng,
            'created_at'  => $existing?->created_at ?? now(),
            'updated_at'  => now(),
        ];
    
        if ($this->hasLatColumn) {
            $payload['lat'] = $lat;
        }
        if ($this->hasLngColumn) {
            $payload['lng'] = $lng;
        }
    
        // الأعمدة التي سيتم تحديثها في upsert (بدون slug/created_at)
        $updateColumns = array_keys(Arr::except($payload, ['slug', 'created_at']));
    
        // نفّذ upsert (بيمر من الـ Query Builder بدون كاستنج Eloquent)
        Area::query()->upsert([$payload], ['slug'], $updateColumns);
    
        $area = Area::query()->where('slug', $slug)->firstOrFail();
        return [$area->id, $existing === null];
    }
    
    private function coordinatesMap(): array
    {
        return [
            'الدقهلية' => [31.041, 31.378],
            'أجا' => [30.953, 31.290],
            'الجمالية' => [31.180, 31.865],
            'الكردي' => [30.963, 31.520],
            'المنصورة (مركز)' => [31.010, 31.380],
            'أول المنصورة' => [31.045, 31.380],
            'ثان المنصورة' => [31.015, 31.390],
            'المنزلة' => [31.120, 31.940],
            'المطرية' => [31.180, 31.990],
            'السنبلاوين' => [30.556, 31.001],
            'بني عبيد' => [30.993, 31.343],
            'بلقاس' => [31.214, 31.353],
            'دكرنس' => [31.088, 31.594],
            'جمصة' => [31.444, 31.507],
            'محلة دمنة' => [31.056, 31.522],
            'منية النصر' => [31.125, 31.520],
            'ميت غمر (قسم)' => [30.7167, 31.2607],
            'ميت غمر (مركز)' => [30.7167, 31.2607],
            'ميت سلسيل' => [31.136, 31.632],
            'نبروه' => [31.037, 31.285],
            'شربين' => [31.200, 31.520],
            'طلخا' => [31.054, 31.377],
            'تمي الأمديد' => [30.960, 31.510],
            'الشرقية' => [30.587, 31.502],
            'أبو حماد' => [30.467, 31.566],
            'أبو كبير' => [30.728, 31.673],
            'أولاد صقر' => [30.751, 31.620],
            'بلبيس' => [30.416, 31.565],
            'ديرب نجم' => [30.732, 31.439],
            'فاقوس (مركز)' => [30.730, 31.799],
            'ههيا' => [30.671, 31.588],
            'كفر صقر' => [30.793, 31.625],
            'مشتول السوق' => [30.363, 31.377],
            'منيا القمح' => [30.420, 31.417],
            'منشأة أبو عمر' => [30.735, 32.006],
            'الحسينية' => [30.737, 32.010],
            'الإبراهيمية' => [30.718, 31.563],
            'صان الحجر' => [30.957, 31.882],
            'الزقازيق أول' => [30.587, 31.502],
            'الزقازيق ثان' => [30.593, 31.505],
            'فاقوس (قسم)' => [30.730, 31.799],
            'القنايات' => [30.624, 31.464],
            'القرين' => [30.628, 31.737],
            'العاشر من رمضان أول' => [30.304, 31.741],
            'العاشر من رمضان ثان' => [30.315, 31.775],
            'الصالحية الجديدة' => [30.730, 32.053],
        ];
    }

    private function dakahliaChildren(): array
    {
        return [
            ['name_ar' => 'أجا', 'name_en' => 'Aga', 'type' => 'markaz'],
            ['name_ar' => 'الجمالية', 'name_en' => 'El Gamaliya', 'type' => 'markaz'],
            ['name_ar' => 'الكردي', 'name_en' => 'El Kurdi', 'type' => 'kism'],
            ['name_ar' => 'المنصورة (مركز)', 'name_en' => 'El Mansoura (Markaz)', 'type' => 'markaz'],
            ['name_ar' => 'أول المنصورة', 'name_en' => 'El Mansoura 1', 'type' => 'kism'],
            ['name_ar' => 'ثان المنصورة', 'name_en' => 'El Mansoura 2', 'type' => 'kism'],
            ['name_ar' => 'المنزلة', 'name_en' => 'El Manzala', 'type' => 'markaz'],
            ['name_ar' => 'المطرية', 'name_en' => 'El Matareya', 'type' => 'markaz'],
            ['name_ar' => 'السنبلاوين', 'name_en' => 'El Senbellawein', 'type' => 'markaz'],
            ['name_ar' => 'بني عبيد', 'name_en' => 'Beni Ebeid', 'type' => 'markaz'],
            ['name_ar' => 'بلقاس', 'name_en' => 'Belqas', 'type' => 'markaz'],
            ['name_ar' => 'دكرنس', 'name_en' => 'Dikirnis', 'type' => 'markaz'],
            ['name_ar' => 'جمصة', 'name_en' => 'Gamasa', 'type' => 'kism'],
            ['name_ar' => 'محلة دمنة', 'name_en' => 'Mahallat Damanah', 'type' => 'markaz'],
            ['name_ar' => 'منية النصر', 'name_en' => 'Minyet El Nasr', 'type' => 'markaz'],
            ['name_ar' => 'ميت غمر (قسم)', 'name_en' => 'Mit Ghamr (Kism)', 'type' => 'kism'],
            ['name_ar' => 'ميت غمر (مركز)', 'name_en' => 'Mit Ghamr (Markaz)', 'type' => 'markaz'],
            ['name_ar' => 'ميت سلسيل', 'name_en' => 'Mit Salsil', 'type' => 'markaz'],
            ['name_ar' => 'نبروه', 'name_en' => 'Nabaroh', 'type' => 'markaz'],
            ['name_ar' => 'شربين', 'name_en' => 'Shirbin', 'type' => 'markaz'],
            ['name_ar' => 'طلخا', 'name_en' => 'Talkha', 'type' => 'markaz'],
            ['name_ar' => 'تمي الأمديد', 'name_en' => 'Timay El Imdid', 'type' => 'markaz'],
        ];
    }

    private function sharqiaChildren(): array
    {
        return [
            ['name_ar' => 'أبو حماد', 'name_en' => 'Abu Hammad', 'type' => 'markaz'],
            ['name_ar' => 'أبو كبير', 'name_en' => 'Abu Kebir', 'type' => 'markaz'],
            ['name_ar' => 'أولاد صقر', 'name_en' => 'Awlad Saqr', 'type' => 'markaz'],
            ['name_ar' => 'بلبيس', 'name_en' => 'Bilbays', 'type' => 'markaz'],
            ['name_ar' => 'ديرب نجم', 'name_en' => 'Diyarb Najm', 'type' => 'markaz'],
            ['name_ar' => 'فاقوس (مركز)', 'name_en' => 'Faqous (Markaz)', 'type' => 'markaz'],
            ['name_ar' => 'ههيا', 'name_en' => 'Hihya', 'type' => 'markaz'],
            ['name_ar' => 'كفر صقر', 'name_en' => 'Kafr Saqr', 'type' => 'markaz'],
            ['name_ar' => 'مشتول السوق', 'name_en' => 'Mashtoul El-Souk', 'type' => 'markaz'],
            ['name_ar' => 'منيا القمح', 'name_en' => 'Minya Al Qamh', 'type' => 'markaz'],
            ['name_ar' => 'منشأة أبو عمر', 'name_en' => 'Munshat Abu Omar', 'type' => 'markaz'],
            ['name_ar' => 'الحسينية', 'name_en' => 'El Husseiniya', 'type' => 'markaz'],
            ['name_ar' => 'الإبراهيمية', 'name_en' => 'El Ibrahimiya', 'type' => 'markaz'],
            ['name_ar' => 'صان الحجر', 'name_en' => 'San El Hagar', 'type' => 'markaz'],
            ['name_ar' => 'الزقازيق أول', 'name_en' => 'Zagazig 1', 'type' => 'kism'],
            ['name_ar' => 'الزقازيق ثان', 'name_en' => 'Zagazig 2', 'type' => 'kism'],
            ['name_ar' => 'فاقوس (قسم)', 'name_en' => 'Faqous (Kism)', 'type' => 'kism'],
            ['name_ar' => 'القنايات', 'name_en' => 'El Qanayat', 'type' => 'kism'],
            ['name_ar' => 'القرين', 'name_en' => 'El Qurein', 'type' => 'kism'],
            ['name_ar' => 'العاشر من رمضان أول', 'name_en' => '10th of Ramadan 1', 'type' => 'kism'],
            ['name_ar' => 'العاشر من رمضان ثان', 'name_en' => '10th of Ramadan 2', 'type' => 'kism'],
            ['name_ar' => 'الصالحية الجديدة', 'name_en' => 'New Salhia', 'type' => 'kism'],
        ];
    }
}
