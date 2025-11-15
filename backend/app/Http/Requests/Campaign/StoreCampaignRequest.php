<?php

declare(strict_types=1);

namespace App\Http\Requests\Campaign;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('campaigns', 'slug')],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', Rule::in(['draft', 'active', 'archived'])],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'poll_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'geographic_strategy' => ['required', 'string', Rule::in(['governorate', 'center', 'city', 'district', 'custom'])],
            'geographic_notes' => ['nullable', 'array'],
            'bbox' => ['nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'geographic_scopes' => ['sometimes', 'array'],
            'geographic_scopes.*.name' => ['required', 'string', 'max:255'],
            'geographic_scopes.*.level' => ['required', Rule::in(['governorate', 'center', 'city', 'district', 'committee', 'custom'])],
            'geographic_scopes.*.area_id' => ['nullable', 'exists:areas,id'],
            'geographic_scopes.*.bbox' => ['nullable', 'array'],
            'geographic_scopes.*.meta' => ['nullable', 'array'],
            'geographic_scopes.*.committees' => ['sometimes', 'array'],
            'geographic_scopes.*.committees.*.name' => ['required', 'string', 'max:255'],
            'geographic_scopes.*.committees.*.code' => ['required', 'string', 'max:50'],
            'geographic_scopes.*.committees.*.area_id' => ['nullable', 'exists:areas,id'],
            'geographic_scopes.*.committees.*.location' => ['nullable', 'string', 'max:255'],
            'geographic_scopes.*.committees.*.lat' => ['nullable', 'numeric'],
            'geographic_scopes.*.committees.*.lng' => ['nullable', 'numeric'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $scopes = $this->input('geographic_scopes', []);
            $seenCodes = [];

            foreach ($scopes as $scopeIndex => $scope) {
                $scopeArea = $scope['area_id'] ?? null;
                $committees = $scope['committees'] ?? [];

                foreach ($committees as $committeeIndex => $committee) {
                    $code = strtolower((string) ($committee['code'] ?? ''));

                    if ($code !== '') {
                        if (in_array($code, $seenCodes, true)) {
                            $validator->errors()->add(
                                "geographic_scopes.$scopeIndex.committees.$committeeIndex.code",
                                __('validation.custom.committee_code.unique_within_campaign')
                            );
                        }

                        $seenCodes[] = $code;
                    }

                    if ($scopeArea && isset($committee['area_id']) && (int) $committee['area_id'] !== (int) $scopeArea) {
                        $validator->errors()->add(
                            "geographic_scopes.$scopeIndex.committees.$committeeIndex.area_id",
                            __('validation.custom.committee_area.out_of_scope')
                        );
                    }
                }
            }
        });
    }
}
