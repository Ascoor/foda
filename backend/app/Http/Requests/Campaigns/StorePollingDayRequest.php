<?php

namespace App\Http\Requests\Campaigns;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePollingDayRequest extends FormRequest
{
    public function authorize(): bool
    {
        $campaign = $this->route('campaign');

        return $campaign instanceof Campaign
            ? ($this->user()?->can('manageData', $campaign) ?? false)
            : false;
    }

    public function rules(): array
    {
        /** @var Campaign $campaign */
        $campaign = $this->route('campaign');

        $campaignId = $campaign?->getKey() ?? 0;

        return [
            'date' => ['required', 'date', Rule::unique('campaign_polling_days')->where(fn ($query) => $query->where('campaign_id', $campaignId))],
            'opens_at' => ['nullable', 'date_format:H:i'],
            'closes_at' => ['nullable', 'date_format:H:i', 'after:opens_at'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
