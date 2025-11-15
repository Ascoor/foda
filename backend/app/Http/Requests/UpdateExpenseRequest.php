<?php

namespace App\Http\Requests;

use App\Models\Campaign;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
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
        /** @var Expense|null $expense */
        $expense = $this->route('expense');

        return [
            'campaign_id' => ['sometimes', 'exists:campaigns,id'],
            'category_id' => ['sometimes', 'nullable', 'exists:expense_categories,id'],
            'vendor_name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'spent_at' => ['sometimes', 'required', 'date'],
            'reference' => ['sometimes', 'nullable', 'string', 'max:100'],
            'description' => ['sometimes', 'nullable', 'string'],
            'meta' => ['sometimes', 'nullable', 'array'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            /** @var Expense|null $expense */
            $expense = $this->route('expense');
            $campaignId = $expense?->campaign_id ?? (int) $this->input('campaign_id');
            $categoryId = $this->input('category_id');

            if ($categoryId) {
                $category = ExpenseCategory::query()->find($categoryId);
                if (! $category || ($campaignId && (int) $category->campaign_id !== $campaignId)) {
                    $validator->errors()->add('category_id', __('validation.custom.belongs_to_campaign'));
                }
            }
        });
    }
}
