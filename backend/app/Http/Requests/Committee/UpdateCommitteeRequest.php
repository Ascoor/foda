<?php

declare(strict_types=1);

namespace App\Http\Requests\Committee;

use App\Models\Campaign;
use App\Models\GeographicScope;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCommitteeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'code' => ['sometimes', 'nullable', 'string', 'max:50'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'lat' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'meta' => ['sometimes', 'nullable', 'array'],
            'area_id' => ['sometimes', 'nullable', 'integer', 'exists:areas,id'],
            'geographic_scope_id' => ['sometimes', 'required', 'integer', 'exists:geographic_scopes,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $campaign = $this->route('campaign');
            $scopeId = $this->input('geographic_scope_id');

            if (! $campaign instanceof Campaign || ! $scopeId) {
                return;
            }

            $scope = GeographicScope::query()->find($scopeId);
            if (! $scope || (int) $scope->campaign_id !== (int) $campaign->getKey()) {
                $validator->errors()->add('geographic_scope_id', __('The selected geographic scope does not belong to this campaign.'));
            }
        });
    }
}
