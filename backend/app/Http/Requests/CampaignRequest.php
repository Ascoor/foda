<?php

namespace App\Http\Requests;

use App\Services\GeoHierarchyService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $geo = app(GeoHierarchyService::class);

        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
            'election_id' => ['nullable', 'exists:elections,id'],
            'governorate_id' => ['required', 'integer', Rule::in($geo->governorateIds())],
            'district_id' => ['required', 'integer', Rule::in($geo->districtIds())],
            'circle_id' => ['required', 'integer', Rule::in($geo->circleIds())],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $geo = app(GeoHierarchyService::class);

        $validator->after(function (Validator $validator) use ($geo): void {
            $governorateId = $this->integer('governorate_id');
            $districtId = $this->integer('district_id');
            $circleId = $this->integer('circle_id');

            if ($governorateId && $districtId && ! $geo->districtBelongsToGovernorate($districtId, $governorateId)) {
                $validator->errors()->add('district_id', 'The selected district does not belong to the provided governorate.');
            }

            if ($districtId && $circleId && ! $geo->circleBelongsToDistrict($circleId, $districtId)) {
                $validator->errors()->add('circle_id', 'The selected circle does not belong to the provided district.');
            }
        });
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'governorate_id' => $this->toNullableInteger($this->input('governorate_id')),
            'district_id' => $this->toNullableInteger($this->input('district_id')),
            'circle_id' => $this->toNullableInteger($this->input('circle_id')),
        ]);
    }

    private function toNullableInteger(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_int($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int) $value;
        }

        return null;
    }
}
