<?php

namespace App\Http\Requests;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('teams', 'name')->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'area_id' => ['required', 'exists:areas,id'],
            'supervisor_id' => ['required', 'exists:users,id'],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
