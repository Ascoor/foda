<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\Committee;
use App\Models\GeographicScope;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVolunteerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $campaign = $this->route('campaign');

        if ($campaign instanceof Campaign) {
            $this->merge(['campaign_id' => $campaign->getKey()]);
        } elseif (is_numeric($campaign)) {
            $this->merge(['campaign_id' => (int) $campaign]);
        }
    }

    public function rules(): array
    {
        $campaignId = $this->input('campaign_id');

        return [
            'campaign_id' => ['required', 'exists:campaigns,id'],
            'geographic_scope_id' => ['nullable', 'exists:geographic_scopes,id'],
            'committee_id' => ['nullable', 'exists:committees,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:150'],
            'email' => [
                'nullable',
                'email',
                'max:150',
                Rule::unique('volunteers', 'email')->where(function ($query) use ($campaignId): void {
                    if ($campaignId) {
                        $query->where('campaign_id', $campaignId);
                    }
                }),
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('volunteers', 'phone')->where(function ($query) use ($campaignId): void {
                    if ($campaignId) {
                        $query->where('campaign_id', $campaignId);
                    }
                }),
            ],
            'role' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['pending', 'active', 'inactive'])],
            'joined_at' => ['nullable', 'date'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $campaignId = (int) $this->input('campaign_id');
            $scopeId = $this->input('geographic_scope_id');
            $committeeId = $this->input('committee_id');

            if (! $campaignId) {
                return;
            }

            if ($scopeId) {
                $scope = GeographicScope::query()->find($scopeId);
                if (! $scope || (int) $scope->campaign_id !== $campaignId) {
                    $validator->errors()->add('geographic_scope_id', __('validation.custom.belongs_to_campaign'));
                }
            }

            if ($committeeId) {
                $committee = Committee::query()->find($committeeId);
                if (! $committee || (int) $committee->campaign_id !== $campaignId) {
                    $validator->errors()->add('committee_id', __('validation.custom.belongs_to_campaign'));
                }

                if ($scopeId && $committee && $committee->geographic_scope_id && (int) $committee->geographic_scope_id !== (int) $scopeId) {
                    $validator->errors()->add('committee_id', __('validation.custom.committee_area.out_of_scope'));
                }
            }
        });
    }
}

