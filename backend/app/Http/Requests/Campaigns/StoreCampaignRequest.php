<?php

namespace App\Http\Requests\Campaigns;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Campaign::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190', Rule::unique('campaigns', 'slug')],
            'description' => ['nullable', 'string'],
            'timezone' => ['required', 'timezone'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'spatial_level' => ['required', Rule::in(['city', 'center', 'governorate', 'region', 'custom'])],
            'admin_areas' => ['nullable', 'array'],
            'admin_areas.*' => ['nullable', 'string'],
            'spatial_extent' => ['nullable', 'array'],
            'bbox' => ['nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'polling_settings' => ['nullable', 'array'],
            'status' => ['nullable', Rule::in(['draft', 'active', 'archived'])],
        ];
    }
}
