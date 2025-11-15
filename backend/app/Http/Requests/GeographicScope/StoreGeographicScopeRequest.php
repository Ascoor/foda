<?php

declare(strict_types=1);

namespace App\Http\Requests\GeographicScope;

use App\Models\Campaign;
use App\Models\GeographicScope;
use Illuminate\Foundation\Http\FormRequest;

class StoreGeographicScopeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'level' => ['required', 'string', 'max:100'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'parent_id' => ['nullable', 'integer', 'exists:geographic_scopes,id'],
            'bbox' => ['nullable', 'array', 'size:4'],
            'bbox.*' => ['numeric'],
            'meta' => ['nullable', 'array'],
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
