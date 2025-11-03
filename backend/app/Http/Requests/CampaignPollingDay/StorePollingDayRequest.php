<?php

namespace App\Http\Requests\CampaignPollingDay;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;

class StorePollingDayRequest extends FormRequest
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
            'date' => [
                'required',
                'date',
                'unique:campaign_polling_days,date,NULL,id,campaign_id,' . $campaign->getKey(),
            ],
            'notes' => ['nullable', 'string'],
        ];
    }
}
