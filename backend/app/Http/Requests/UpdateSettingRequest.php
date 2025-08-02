<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage settings');
    }

    public function rules(): array
    {
        $id = $this->route('setting')->id ?? null;

        return [
            'key' => ['sometimes', 'string', 'max:100', 'unique:settings,key,' . $id],
            'value' => ['sometimes', 'string'],
            'description' => ['nullable', 'string'],
            'type' => ['sometimes', 'in:string,integer,boolean'],
        ];
    }
}
