<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Rules\BelongsToCampaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVoterRequest extends FormRequest
{
    protected ?Campaign $campaign = null;

    public function authorize(): bool
    {
        $campaign = $this->route('campaign');

        return $campaign instanceof Campaign
            ? ($this->user()?->can('manageData', $campaign) ?? false)
            : false;
    }

    protected function prepareForValidation(): void
    {
        $this->campaign = $this->route('campaign');
    }

    public function rules(): array
    {
        $campaignId = $this->campaign?->getKey();
        $voter = $this->route('voter');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'area_id' => ['sometimes', 'required', 'exists:areas,id'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'sex' => ['sometimes', 'nullable', 'in:male,female'],
            'birthdate' => ['sometimes', 'nullable', 'date'],
            'age' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'bloodgroup' => ['sometimes', 'nullable', 'string', 'max:3'],
            'img_url' => ['sometimes', 'nullable', 'url'],
            'ion_user_id' => ['sometimes', 'nullable', 'integer'],
            'committee_id' => ['sometimes', 'required', 'exists:committees,id', new BelongsToCampaign('committees')],
            'voter_id' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('voters', 'voter_id')
                    ->ignore($voter)
                    ->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'voter_uid' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
                Rule::unique('voters', 'voter_uid')
                    ->ignore($voter)
                    ->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'national_id' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
                Rule::unique('voters', 'national_id')
                    ->ignore($voter)
                    ->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'add_date' => ['sometimes', 'nullable', 'date'],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
