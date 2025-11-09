<?php

declare(strict_types=1);

namespace App\Http\Requests\Campaign;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $campaign = $this->route('campaign');
        $campaignId = $campaign instanceof Campaign ? $campaign->getKey() : $campaign;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', Rule::unique('campaigns', 'slug')->ignore($campaignId)],
            'description' => ['nullable', 'string'],
            'starts_at' => ['sometimes', 'nullable', 'date'],
            'ends_at' => ['sometimes', 'nullable', 'date', Rule::when($this->filled('starts_at'), ['after_or_equal:starts_at'])],
            'spatial_level' => ['sometimes', 'nullable', 'string', Rule::in(['city', 'center', 'governorate', 'region', 'custom'])],
            'bbox' => ['nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'status' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
