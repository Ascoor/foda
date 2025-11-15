<?php

declare(strict_types=1);

namespace App\Http\Requests\GeographicScope;

use App\Models\Campaign;
use App\Models\GeographicScope;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGeographicScopeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'level' => ['sometimes', 'required', 'string', 'max:100'],
            'area_id' => ['sometimes', 'nullable', 'integer', 'exists:areas,id'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:geographic_scopes,id'],
            'bbox' => ['sometimes', 'nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'meta' => ['sometimes', 'nullable', 'array'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $campaign = $this->route('campaign');
            $parentId = $this->input('parent_id');

            if (! $campaign instanceof Campaign || ! $parentId) {
                return;
            }

            $parent = GeographicScope::query()->find($parentId);
            if (! $parent || (int) $parent->campaign_id !== (int) $campaign->getKey()) {
                $validator->errors()->add('parent_id', __('The selected parent scope does not belong to this campaign.'));
            }
        });
    }
}
