<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Base\ApiController;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Campaign;
use App\Models\Expense;
use App\Services\FinanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends ApiController
{
    public function __construct(private readonly FinanceService $service)
    {
    }

    public function index(Request $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('view', $campaign);

        $expenses = $this->service->listExpenses($campaign, $request->all());

        return $this->resource(ExpenseResource::collection($expenses));
    }

    public function store(StoreExpenseRequest $request, Campaign $campaign): JsonResponse
    {
        $this->authorize('update', $campaign);

        $payload = $request->validated();
        $payload['campaign_id'] = $campaign->getKey();

        $expense = $this->service->createExpense($payload);

        return $this->resource(new ExpenseResource($expense), 201);
    }

    public function show(Campaign $campaign, Expense $expense): JsonResponse
    {
        $this->authorize('view', $campaign);
        $this->assertCampaignOwnership($campaign, $expense);

        return $this->resource(new ExpenseResource($expense->load('category')));
    }

    public function update(UpdateExpenseRequest $request, Campaign $campaign, Expense $expense): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $expense);

        $payload = $request->validated();
        if (! isset($payload['campaign_id'])) {
            $payload['campaign_id'] = $campaign->getKey();
        }

        $expense = $this->service->updateExpense($expense, $payload);

        return $this->resource(new ExpenseResource($expense));
    }

    public function destroy(Campaign $campaign, Expense $expense): JsonResponse
    {
        $this->authorize('update', $campaign);
        $this->assertCampaignOwnership($campaign, $expense);

        $this->service->deleteExpense($expense);

        return $this->noContent();
    }

    private function assertCampaignOwnership(Campaign $campaign, Expense $expense): void
    {
        if ((int) $expense->campaign_id !== (int) $campaign->getKey()) {
            abort(404);
        }
    }
}
