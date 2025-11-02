<?php

namespace App\Http\Requests;

use App\Models\ElectionCircle\Campaign;
use App\Rules\BelongsToCampaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
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

        return [
            'event_id' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('events', 'event_id')->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'organiser' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'area_id' => ['required', 'exists:areas,id'],
            'team_id' => ['required', 'exists:teams,id', new BelongsToCampaign('teams')],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
