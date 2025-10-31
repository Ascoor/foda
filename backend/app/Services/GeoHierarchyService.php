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
    private array $circles = [
        ['id' => 1001, 'district_id' => 101, 'name' => 'الدائرة الأولى - مدينة نصر'],
        ['id' => 1002, 'district_id' => 101, 'name' => 'الدائرة الثانية - مدينة نصر'],
        ['id' => 1003, 'district_id' => 102, 'name' => 'الدائرة الأولى - المعادي'],
        ['id' => 2001, 'district_id' => 201, 'name' => 'الدائرة الأولى - الدقي'],
        ['id' => 2002, 'district_id' => 202, 'name' => 'الدائرة الأولى - الهرم'],
        ['id' => 3001, 'district_id' => 301, 'name' => 'الدائرة الأولى - المنتزه'],
        ['id' => 3002, 'district_id' => 302, 'name' => 'الدائرة الأولى - سيدي جابر'],
    ];

    /**
     * @var array<int, array<string, int|string>>
     */
    private array $governorateIndex = [];

    /**
     * @var array<int, array<string, int|string>>
     */
    private array $districtIndex = [];

    /**
     * @var array<int, array<string, int|string>>
     */
    private array $circleIndex = [];

    public function __construct()
    {
        $this->governorateIndex = $this->indexById($this->governorates);
        $this->districtIndex = $this->indexById($this->districts);
        $this->circleIndex = $this->indexById($this->circles);
    }

    /**
     * @param array<int, array<string, int|string>> $items
     * @return array<int, array<string, int|string>>
     */
    private function indexById(array $items): array
    {
        $indexed = [];

        foreach ($items as $item) {
            $indexed[(int) $item['id']] = $item;
        }

        return $indexed;
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    public function governorates(): array
    {
        return array_values($this->governorateIndex);
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    public function districts(?int $governorateId = null): array
    {
        if ($governorateId === null) {
            return array_values($this->districtIndex);
        }

        return array_values(array_filter(
            $this->districtIndex,
            static fn (array $district): bool => (int) $district['governorate_id'] === $governorateId,
        ));
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    public function circles(?int $districtId = null): array
    {
        if ($districtId === null) {
            return array_values($this->circleIndex);
        }

        return array_values(array_filter(
            $this->circleIndex,
            static fn (array $circle): bool => (int) $circle['district_id'] === $districtId,
        ));
    }

    public function hasGovernorate(int $governorateId): bool
    {
        return isset($this->governorateIndex[$governorateId]);
    }

    public function hasDistrict(int $districtId): bool
    {
        return isset($this->districtIndex[$districtId]);
    }

    public function hasCircle(int $circleId): bool
    {
        return isset($this->circleIndex[$circleId]);
    }

    public function districtBelongsToGovernorate(int $districtId, int $governorateId): bool
    {
        $district = $this->districtIndex[$districtId] ?? null;

        if ($district === null) {
            return false;
        }

        return (int) $district['governorate_id'] === $governorateId;
    }

    public function circleBelongsToDistrict(int $circleId, int $districtId): bool
    {
        $circle = $this->circleIndex[$circleId] ?? null;

        if ($circle === null) {
            return false;
        }

        return (int) $circle['district_id'] === $districtId;
    }

    /**
     * @return array<int>
     */
    public function governorateIds(): array
    {
        return array_keys($this->governorateIndex);
    }

    /**
     * @return array<int>
     */
    public function districtIds(): array
    {
        return array_keys($this->districtIndex);
    }

    /**
     * @return array<int>
     */
    public function circleIds(): array
    {
        return array_keys($this->circleIndex);
    }
}
