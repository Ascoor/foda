<?php

namespace App\Services;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    public function listDonations(Campaign $campaign, array $filters = []): LengthAwarePaginator
    {
        $query = $campaign->donations()->with('category');

        if ($search = Arr::get($filters, 'q')) {
            $query->where(function ($builder) use ($search): void {
                $builder->where('donor_name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($categoryId = Arr::get($filters, 'category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($from = Arr::get($filters, 'from')) {
            $query->whereDate('donated_at', '>=', $from);
        }

        if ($to = Arr::get($filters, 'to')) {
            $query->whereDate('donated_at', '<=', $to);
        }

        return $query->orderByDesc('donated_at')->paginate(Arr::get($filters, 'per_page', 15));
    }

    public function listExpenses(Campaign $campaign, array $filters = []): LengthAwarePaginator
    {
        $query = $campaign->expenses()->with('category');

        if ($search = Arr::get($filters, 'q')) {
            $query->where(function ($builder) use ($search): void {
                $builder->where('vendor_name', 'like', "%{$search}%")
                    ->orWhere('reference', 'like', "%{$search}%");
            });
        }

        if ($categoryId = Arr::get($filters, 'category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($from = Arr::get($filters, 'from')) {
            $query->whereDate('spent_at', '>=', $from);
        }

        if ($to = Arr::get($filters, 'to')) {
            $query->whereDate('spent_at', '<=', $to);
        }

        return $query->orderByDesc('spent_at')->paginate(Arr::get($filters, 'per_page', 15));
    }

    public function createDonation(array $payload): Donation
    {
        return DB::transaction(fn (): Donation => Donation::query()->create($payload)->fresh(['category']));
    }

    public function updateDonation(Donation $donation, array $payload): Donation
    {
        $donation->fill($payload);
        $donation->save();

        return $donation->refresh()->load('category');
    }

    public function deleteDonation(Donation $donation): void
    {
        $donation->delete();
    }

    public function createExpense(array $payload): Expense
    {
        return DB::transaction(fn (): Expense => Expense::query()->create($payload)->fresh(['category']));
    }

    public function updateExpense(Expense $expense, array $payload): Expense
    {
        $expense->fill($payload);
        $expense->save();

        return $expense->refresh()->load('category');
    }

    public function deleteExpense(Expense $expense): void
    {
        $expense->delete();
    }
}
