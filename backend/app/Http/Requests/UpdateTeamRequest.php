<?php

namespace App\Http\Requests;

use App\Models\ElectionCircle\Campaign;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamRequest extends FormRequest
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
        $team = $this->route('team');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:100',
                Rule::unique('teams', 'name')
                    ->ignore($team)
                    ->where(fn ($query) => $query->where('campaign_id', $campaignId)),
            ],
            'area_id' => ['sometimes', 'required', 'exists:areas,id'],
            'supervisor_id' => ['sometimes', 'required', 'exists:users,id'],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
