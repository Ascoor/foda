<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamRequest extends FormRequest
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
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'area_id' => ['sometimes', 'required', 'exists:areas,id'],
            'supervisor_id' => ['nullable', 'exists:users,id'],
        ];
    }

    public function validationData(): array
    {
        return array_merge(parent::validationData(), [
            'campaign' => $this->campaign,
        ]);
    }
}
