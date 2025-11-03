<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Rules\BelongsToCampaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    protected ?Campaign $campaign = null;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->campaign = $this->route('campaign');
    }

    public function rules(): array
    {
        $campaignId = $this->campaign?->getKey();
        $eventId = $this->route('event');

        return [
            'event_id' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('events', 'event_id')
                    ->ignore($eventId)
                    ->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'organiser' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'date' => ['sometimes', 'required', 'date', 'after_or_equal:today'],
            'area_id' => ['sometimes', 'required', 'exists:areas,id'],
            'team_id' => ['sometimes', 'required', 'exists:teams,id', new BelongsToCampaign('teams')],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
