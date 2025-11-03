<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\Voter;
use App\Rules\BelongsToCampaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVoterRequest extends FormRequest
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
        /** @var Voter $voter */
        $voter = $this->route('voter');
        $campaignId = $this->campaign?->getKey();

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'national_id' => ['sometimes', 'required', 'string', 'max:32', Rule::unique('voters', 'national_id')->ignore($voter->getKey())->where(fn ($query) => $query->where('campaign_id', $campaignId))],
            'voter_uid' => ['nullable', 'string', 'max:64', Rule::unique('voters', 'voter_uid')->ignore($voter->getKey())->where(fn ($query) => $query->where('campaign_id', $campaignId))],
            'committee_id' => ['sometimes', 'required', 'integer', 'exists:committees,id', new BelongsToCampaign('committees')],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'gender' => ['nullable', 'in:male,female'],
            'birthdate' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
