<?php

namespace App\Http\Requests\CampaignPollingDay;

use App\Models\Campaign;
use App\Models\CampaignPollingDay;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePollingDayRequest extends FormRequest
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
        /** @var CampaignPollingDay $pollingDay */
        $pollingDay = $this->route('polling_day');

        return [
            'date' => [
                'sometimes',
                'required',
                'date',
                'unique:campaign_polling_days,date,' . $pollingDay->getKey() . ',id,campaign_id,' . $campaign->getKey(),
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
