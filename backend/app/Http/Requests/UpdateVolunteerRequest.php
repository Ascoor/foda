<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\Committee;
use App\Models\GeographicScope;
use App\Models\Volunteer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVolunteerRequest extends FormRequest
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
        /** @var Volunteer|null $volunteer */
        $volunteer = $this->route('volunteer');
        $campaignId = $volunteer?->campaign_id ?? $this->input('campaign_id');

        return [
            'campaign_id' => ['sometimes', 'exists:campaigns,id'],
            'geographic_scope_id' => ['sometimes', 'nullable', 'exists:geographic_scopes,id'],
            'committee_id' => ['sometimes', 'nullable', 'exists:committees,id'],
            'user_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'email' => [
                'sometimes',
                'nullable',
                'email',
                'max:150',
                Rule::unique('volunteers', 'email')
                    ->ignore($volunteer?->getKey())
                    ->where(function ($query) use ($campaignId): void {
                        if ($campaignId) {
                            $query->where('campaign_id', $campaignId);
                        }
                    }),
            ],
            'phone' => [
                'sometimes',
                'nullable',
                'string',
                'max:20',
                Rule::unique('volunteers', 'phone')
                    ->ignore($volunteer?->getKey())
                    ->where(function ($query) use ($campaignId): void {
                        if ($campaignId) {
                            $query->where('campaign_id', $campaignId);
                        }
                    }),
            ],
            'role' => ['sometimes', 'nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'nullable', Rule::in(['pending', 'active', 'inactive'])],
            'joined_at' => ['sometimes', 'nullable', 'date'],
            'skills' => ['sometimes', 'nullable', 'array'],
            'skills.*' => ['string', 'max:50'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            /** @var Volunteer|null $volunteer */
            $volunteer = $this->route('volunteer');
            $campaignId = $volunteer?->campaign_id ?? (int) $this->input('campaign_id');
            $scopeId = $this->input('geographic_scope_id');
            $committeeId = $this->input('committee_id');

            if (! $campaignId) {
                return;
            }

            if ($scopeId) {
                $scope = GeographicScope::query()->find($scopeId);
                if (! $scope || (int) $scope->campaign_id !== (int) $campaignId) {
                    $validator->errors()->add('geographic_scope_id', __('validation.custom.belongs_to_campaign'));
                }
            }

            if ($committeeId) {
                $committee = Committee::query()->find($committeeId);
                if (! $committee || (int) $committee->campaign_id !== (int) $campaignId) {
                    $validator->errors()->add('committee_id', __('validation.custom.belongs_to_campaign'));
                }

                if ($scopeId && $committee && $committee->geographic_scope_id && (int) $committee->geographic_scope_id !== (int) $scopeId) {
                    $validator->errors()->add('committee_id', __('validation.custom.committee_area.out_of_scope'));
                }
            }
        });
    }
}

