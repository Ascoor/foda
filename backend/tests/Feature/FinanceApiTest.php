<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\DonationCategory;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class FinanceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_can_manage_donations_within_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $user = User::factory()->create();
        $user->assignRole('admin');

        Sanctum::actingAs($user);

        $category = DonationCategory::factory()->create(['campaign_id' => $campaign->id]);

        $this->postJson(route('campaigns.donations.store', ['campaign' => $campaign->id]), [
            'donor_name' => 'Alice',
            'amount' => 1500,
            'donated_at' => '2024-01-01',
            'category_id' => $category->id,
        ])->assertCreated()->assertJsonPath('data.donor_name', 'Alice');

        $donation = Donation::query()->where('campaign_id', $campaign->id)->firstOrFail();

        $this->getJson(route('campaigns.donations.index', ['campaign' => $campaign->id]))
            ->assertOk()
            ->assertJsonPath('data.0.id', $donation->id);

        $this->putJson(route('campaigns.donations.update', ['campaign' => $campaign->id, 'donation' => $donation->id]), [
            'amount' => 1750,
        ])->assertOk()->assertJsonPath('data.amount', 1750.0);

        $this->deleteJson(route('campaigns.donations.destroy', ['campaign' => $campaign->id, 'donation' => $donation->id]))
            ->assertNoContent();

        $this->assertDatabaseMissing('donations', ['id' => $donation->id]);
    }

    public function test_can_manage_expenses_within_campaign(): void
    {
        $campaign = Campaign::factory()->create();
        $user = User::factory()->create();
        $user->assignRole('admin');
        Sanctum::actingAs($user);

        $category = ExpenseCategory::factory()->create(['campaign_id' => $campaign->id]);

        $this->postJson(route('campaigns.expenses.store', ['campaign' => $campaign->id]), [
            'amount' => 230.5,
            'spent_at' => '2024-02-10',
            'vendor_name' => 'Field Supplies',
            'category_id' => $category->id,
        ])->assertCreated()->assertJsonPath('data.vendor_name', 'Field Supplies');

        $expense = Expense::query()->where('campaign_id', $campaign->id)->firstOrFail();

        $this->getJson(route('campaigns.expenses.index', ['campaign' => $campaign->id]))
            ->assertOk()
            ->assertJsonPath('data.0.id', $expense->id);

        $this->putJson(route('campaigns.expenses.update', ['campaign' => $campaign->id, 'expense' => $expense->id]), [
            'amount' => 310,
        ])->assertOk()->assertJsonPath('data.amount', 310.0);

        $this->deleteJson(route('campaigns.expenses.destroy', ['campaign' => $campaign->id, 'expense' => $expense->id]))
            ->assertNoContent();

        $this->assertDatabaseMissing('expenses', ['id' => $expense->id]);
    }
}
