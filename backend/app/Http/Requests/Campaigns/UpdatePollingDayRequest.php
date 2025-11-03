<?php

namespace App\Http\Requests\Campaigns;

use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePollingDayRequest extends FormRequest
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
        /** @var CampaignPollingDay|null $pollingDay */
        $pollingDay = $this->route('polling_day');
        $campaignId = $campaign?->getKey() ?? 0;

        return [
            'date' => [
                'sometimes',
                'required',
                'date',
                Rule::unique('campaign_polling_days')
                    ->where(fn ($query) => $query->where('campaign_id', $campaignId))
                    ->ignore($pollingDay?->getKey()),
            ],
            'opens_at' => ['sometimes', 'nullable', 'date_format:H:i'],
            'closes_at' => ['sometimes', 'nullable', 'date_format:H:i', 'after:opens_at'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
