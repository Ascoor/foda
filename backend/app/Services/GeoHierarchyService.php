<?php

namespace App\Services;

class GeoHierarchyService
{
    /**
     * @var array<int, array<string, int|string>>
     */
    private array $governorates = [
        ['id' => 1, 'name' => 'محافظة القاهرة'],
        ['id' => 2, 'name' => 'محافظة الجيزة'],
        ['id' => 3, 'name' => 'محافظة الإسكندرية'],
    ];

    /**
     * @var array<int, array<string, int|string>>
     */
    private array $districts = [
        ['id' => 101, 'governorate_id' => 1, 'name' => 'مدينة نصر'],
        ['id' => 102, 'governorate_id' => 1, 'name' => 'المعادي'],
        ['id' => 201, 'governorate_id' => 2, 'name' => 'الدقي'],
        ['id' => 202, 'governorate_id' => 2, 'name' => 'الهرم'],
        ['id' => 301, 'governorate_id' => 3, 'name' => 'المنتزه'],
        ['id' => 302, 'governorate_id' => 3, 'name' => 'سيدي جابر'],
    ];

    /**
     * @var array<int, array<string, int|string>>
     */
    private array $electoralCircles = [
        ['id' => 1001, 'district_id' => 101, 'name' => 'الدائرة الأولى - مدينة نصر'],
        ['id' => 1002, 'district_id' => 101, 'name' => 'الدائرة الثانية - مدينة نصر'],
        ['id' => 1003, 'district_id' => 102, 'name' => 'الدائرة الأولى - المعادي'],
        ['id' => 2001, 'district_id' => 201, 'name' => 'الدائرة الأولى - الدقي'],
        ['id' => 2002, 'district_id' => 202, 'name' => 'الدائرة الأولى - الهرم'],
        ['id' => 3001, 'district_id' => 301, 'name' => 'الدائرة الأولى - المنتزه'],
        ['id' => 3002, 'district_id' => 302, 'name' => 'الدائرة الأولى - سيدي جابر'],
    ];

    /**
     * @return array<int, array<string, int|string>>
     */
    public function governorates(): array
    {
        return $this->governorates;
    }

    /**
     * @param int $governorateId
     * @return array<int, array<string, int|string>>
     */
    public function districts(int $governorateId): array
    {
        return array_values(array_filter(
            $this->districts,
            static fn (array $district): bool => (int) $district['governorate_id'] === $governorateId,
        ));
    }

    /**
     * @param int $districtId
     * @return array<int, array<string, int|string>>
     */
    public function electoralCircles(int $districtId): array
    {
        return array_values(array_filter(
            $this->electoralCircles,
            static fn (array $circle): bool => (int) $circle['district_id'] === $districtId,
        ));
    }

    public function hasGovernorate(int $governorateId): bool
    {
        foreach ($this->governorates as $governorate) {
            if ((int) $governorate['id'] === $governorateId) {
                return true;
            }
        }

        return false;
    }

    public function hasDistrict(int $districtId): bool
    {
        foreach ($this->districts as $district) {
            if ((int) $district['id'] === $districtId) {
                return true;
            }
        }

        return false;
    }
}
