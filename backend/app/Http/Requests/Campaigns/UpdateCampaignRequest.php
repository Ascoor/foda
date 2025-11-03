<?php

namespace App\Http\Requests\Campaigns;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        $campaign = $this->route('campaign');

        return $campaign instanceof Campaign
            ? ($this->user()?->can('update', $campaign) ?? false)
            : ($this->user()?->can('create', Campaign::class) ?? false);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'min:3', 'max:190'],
            'slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:190',
                Rule::unique('campaigns', 'slug')->ignore($this->route('campaign')),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'timezone' => ['sometimes', 'required', 'timezone'],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['sometimes', 'required', 'date', 'after:starts_at'],
            'spatial_level' => ['sometimes', 'required', Rule::in(['city', 'center', 'governorate', 'region', 'custom'])],
            'admin_areas' => ['sometimes', 'nullable', 'array'],
            'admin_areas.*' => ['nullable', 'string'],
            'spatial_extent' => ['sometimes', 'nullable', 'array'],
            'bbox' => ['sometimes', 'nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'polling_settings' => ['sometimes', 'nullable', 'array'],
            'status' => ['sometimes', 'required', Rule::in(['draft', 'active', 'archived'])],
        ];
    }
}
