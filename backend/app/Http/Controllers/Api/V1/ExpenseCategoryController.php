<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExpenseCategoryRequest;
use App\Http\Resources\ExpenseCategoryResource;
use App\Models\ExpenseCategory;

/**
 * Expense categories CRUD endpoints.
 * Legacy: none.
 */
class ExpenseCategoryController extends Controller
{
    public function index()
    {
        return ExpenseCategoryResource::collection(ExpenseCategory::all());
    }

    public function store(ExpenseCategoryRequest $request)
    {
        $category = ExpenseCategory::create($request->validated());
        return (new ExpenseCategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    public function show(ExpenseCategory $expenseCategory)
    {
        return new ExpenseCategoryResource($expenseCategory);
    }

    public function update(ExpenseCategoryRequest $request, ExpenseCategory $expenseCategory)
    {
        $expenseCategory->update($request->validated());
        return new ExpenseCategoryResource($expenseCategory);
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {
        $expenseCategory->delete();
        return response()->noContent();
    }
}
