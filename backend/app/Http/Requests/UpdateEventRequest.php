<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\Event;
use App\Rules\BelongsToCampaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    protected ?Campaign $campaign = null;

    public function authorize(): bool
    {
        /** @var Campaign $campaign */
        $campaign = $this->route('campaign');
        $this->campaign = $campaign;

        return $this->user()?->can('update', $campaign) ?? false;
    }

    public function rules(): array
    {
        /** @var Event $event */
        $event = $this->route('event');
        $campaignId = $this->campaign?->getKey();

        return [
            'event_id' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('events', 'event_id')->ignore($event->getKey())->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'organiser' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'area_id' => ['nullable', 'exists:areas,id'],
            'team_id' => ['nullable', 'exists:teams,id', new BelongsToCampaign('teams')],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
