<?php

namespace App\Http\Requests\Campaign;

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
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('campaigns', 'slug')],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'spatial_level' => ['required', 'string', Rule::in(['city', 'center', 'governorate', 'region', 'custom'])],
            'bbox' => ['nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'status' => ['nullable', 'string', 'max:50'],
        ];
    }
}
