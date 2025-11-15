<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
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
        return [
            'campaign_id' => ['required', 'exists:campaigns,id'],
            'category_id' => ['nullable', 'exists:expense_categories,id'],
            'vendor_name' => ['nullable', 'string', 'max:150'],
            'amount' => ['required', 'numeric', 'min:0'],
            'spent_at' => ['required', 'date'],
            'reference' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'meta' => ['nullable', 'array'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $campaignId = (int) $this->input('campaign_id');
            $categoryId = $this->input('category_id');

            if ($categoryId) {
                $category = ExpenseCategory::query()->find($categoryId);
                if (! $category || (int) $category->campaign_id !== $campaignId) {
                    $validator->errors()->add('category_id', __('validation.custom.belongs_to_campaign'));
                }
            }
        });
    }
}
