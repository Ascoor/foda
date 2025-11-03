<?php

namespace App\Http\Requests\Campaign;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Campaign $campaign */
        $campaign = $this->route('campaign');

        return $this->user()?->can('update', $campaign) ?? false;
    }

    public function rules(): array
    {
        /** @var Campaign $campaign */
        $campaign = $this->route('campaign');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('campaigns', 'slug')->ignore($campaign->getKey())],
            'description' => ['nullable', 'string'],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['sometimes', 'required', 'date', 'after:starts_at'],
            'spatial_level' => ['sometimes', 'required', 'string', Rule::in(['city', 'center', 'governorate', 'region', 'custom'])],
            'bbox' => ['nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'status' => ['nullable', 'string', 'max:50'],
        ];
    }
}
