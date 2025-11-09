<?php

namespace Database\Seeders\Traits;

use Carbon\Carbon;
use Illuminate\Support\Arr;

trait EgyptDataHelpers
{
    protected function egyptianPhone(): string
    {
        $prefix = Arr::random(['010', '011', '012', '015']);

        return $prefix . str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
    }

    protected function egyptianNationalId(?\DateTimeInterface $birthDate = null, ?string $governorateCode = null): string
    {
        $birthDate = $birthDate ? Carbon::instance(Carbon::parse($birthDate)) : Carbon::now()->subYears(random_int(19, 70))->subDays(random_int(0, 364));
        $century = $birthDate->year >= 2000 ? '3' : '2';
        $formattedDate = $birthDate->format('ymd');

        $govMap = $this->governorateCodeMap();
        if ($governorateCode === null || ! array_key_exists($governorateCode, $govMap)) {
            $governorateCode = Arr::random(array_keys($govMap));
        }

        $sequence = str_pad((string) random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        $checkDigit = (string) random_int(0, 9);

        return $century . $formattedDate . $governorateCode . $sequence . $checkDigit;
    }

    protected function govList(): array
    {
        return array_map(static function (array $item) {
            return $item['name'];
        }, $this->governorates());
    }

    protected function randArabicName(?string $gender = null): array
    {
        $gender = $gender ?? Arr::random(['male', 'female']);

        $firstNames = [
            'male' => ['أحمد', 'محمد', 'محمود', 'حسن', 'عبد الله', 'علي', 'كريم', 'مصطفى', 'أيمن', 'طارق', 'سامي'],
            'female' => ['فاطمة', 'مريم', 'سارة', 'منة', 'نهى', 'شيرين', 'داليا', 'هبة', 'ياسمين', 'أسماء', 'رحمة'],
        ];

        $lastNames = ['الشرقاوي', 'المصري', 'عبد الرحمن', 'سلامة', 'مرسي', 'النجار', 'محفوظ', 'العادلي', 'صبري', 'المنصوري', 'الزين'];

        $first = Arr::random($firstNames[$gender] ?? $firstNames['male']);
        $last = Arr::random($lastNames);

        return [
            'first' => $first,
            'last' => $last,
            'full' => trim($first . ' ' . $last),
        ];
    }

    protected function governorates(): array
    {
        return [
            ['code' => '01', 'name' => 'القاهرة'],
            ['code' => '02', 'name' => 'الإسكندرية'],
            ['code' => '03', 'name' => 'بورسعيد'],
            ['code' => '04', 'name' => 'السويس'],
            ['code' => '11', 'name' => 'دمياط'],
            ['code' => '12', 'name' => 'الدقهلية'],
            ['code' => '13', 'name' => 'الشرقية'],
            ['code' => '14', 'name' => 'القليوبية'],
            ['code' => '15', 'name' => 'كفر الشيخ'],
            ['code' => '16', 'name' => 'الغربية'],
            ['code' => '17', 'name' => 'المنوفية'],
            ['code' => '18', 'name' => 'البحيرة'],
            ['code' => '19', 'name' => 'الإسماعيلية'],
            ['code' => '21', 'name' => 'الجيزة'],
            ['code' => '22', 'name' => 'بني سويف'],
            ['code' => '23', 'name' => 'الفيوم'],
            ['code' => '24', 'name' => 'المنيا'],
            ['code' => '25', 'name' => 'أسيوط'],
            ['code' => '26', 'name' => 'سوهاج'],
            ['code' => '27', 'name' => 'قنا'],
            ['code' => '28', 'name' => 'أسوان'],
            ['code' => '29', 'name' => 'الأقصر'],
            ['code' => '31', 'name' => 'البحر الأحمر'],
            ['code' => '32', 'name' => 'الوادي الجديد'],
            ['code' => '33', 'name' => 'مطروح'],
            ['code' => '34', 'name' => 'شمال سيناء'],
            ['code' => '35', 'name' => 'جنوب سيناء'],
            ['code' => '88', 'name' => 'حلوان'],
        ];
    }

    protected function governorateCodeMap(): array
    {
        return collect($this->governorates())->mapWithKeys(function (array $item) {
            return [$item['code'] => $item['name']];
        })->all();
    }
}
