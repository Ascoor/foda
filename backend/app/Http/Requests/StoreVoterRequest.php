<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Rules\BelongsToCampaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoterRequest extends FormRequest
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

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'area_id' => ['required', 'exists:areas,id'],
            'address' => ['nullable', 'string', 'max:255'],
            'sex' => ['nullable', 'in:male,female'],
            'birthdate' => ['nullable', 'date'],
            'age' => ['nullable', 'integer', 'min:0'],
            'bloodgroup' => ['nullable', 'string', 'max:3'],
            'img_url' => ['nullable', 'url'],
            'ion_user_id' => ['nullable', 'integer'],
            'committee_id' => ['required', 'exists:committees,id', new BelongsToCampaign('committees')],
            'voter_id' => [
                'required',
                'string',
                'max:100',
                Rule::unique('voters', 'voter_id')->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'voter_uid' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('voters', 'voter_uid')->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'national_id' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('voters', 'national_id')->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'add_date' => ['nullable', 'date'],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
