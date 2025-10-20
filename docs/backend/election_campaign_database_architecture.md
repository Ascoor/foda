# Election Campaign Management Database Architecture

This document defines the modular Laravel 11 database blueprint for the Election Campaign Management System. It covers bilingual (Arabic/English) data modelling, hierarchical geography, analytics readiness, and real-time synchronization metadata. The schema is optimized for scalability and extensibility following NationBuilder, Ecanvasser, and Campaign Manager Pro best practices.

## Contents
- [Design Principles](#design-principles)
- [Migration Blueprints](#migration-blueprints)
  - [Core Identity & Access](#core-identity--access)
  - [Geospatial Hierarchy](#geospatial-hierarchy)
  - [Campaign Structure](#campaign-structure)
  - [People & Engagement](#people--engagement)
  - [Operations & Logistics](#operations--logistics)
  - [Communications](#communications)
  - [Analytics & Sync](#analytics--sync)
- [ERD Relationship Map](#erd-relationship-map)
- [Recommended Artisan Commands](#recommended-artisan-commands)
- [Campaign → Volunteer → Voter Data Flow](#campaign--volunteer--voter-data-flow)
- [Seeder & Factory Structure (faker\_ar\_EG)](#seeder--factory-structure-faker_ar_eg)

## Design Principles
- **Bilingual first**: Every human-facing label captures English (`*_en`) and Arabic (`*_ar`) variants.
- **Explicit relationships**: Each migration documents Eloquent relations for maintainability.
- **Analytics ready**: Aggregate tables, JSON payloads, and temporal snapshots support dashboarding.
- **Real-time synchronization**: Sync metadata columns (`sync_status`, `synced_at`, `sync_attempts`) appear where mobile/field apps push updates.
- **Modularity**: Tables are segmented by domain (IAM, Geography, Campaign Ops, Communications, Analytics) allowing targeted migrations.

## Migration Blueprints
All migrations follow Laravel 11 conventions with `id`, `timestamps()`, and `softDeletes()` where applicable. Foreign keys cascade or nullify on deletion, and frequently filtered columns are indexed. Relationship notes are included inside each blueprint as documentation.

### Core Identity & Access
```php
// database/migrations/2024_11_30_000000_create_users_table.php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    // Relationships: morphMany messages (sender), hasMany volunteers, belongsToMany roles.
    $table->string('first_name_en', 100);
    $table->string('first_name_ar', 100)->nullable();
    $table->string('last_name_en', 100);
    $table->string('last_name_ar', 100)->nullable();
    $table->string('email')->unique();
    $table->string('phone')->index();
    $table->string('national_id', 20)->nullable()->unique();
    $table->enum('status', ['pending', 'active', 'suspended'])->default('pending')->index();
    $table->timestamp('last_login_at')->nullable();
    $table->string('locale', 10)->default('en');
    $table->rememberToken();
    $table->json('meta')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('roles', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsToMany users, belongsToMany permissions.
    $table->string('name_en');
    $table->string('name_ar')->nullable();
    $table->string('slug')->unique();
    $table->text('description_en')->nullable();
    $table->text('description_ar')->nullable();
    $table->timestamps();
});

Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsToMany roles.
    $table->string('name_en');
    $table->string('name_ar')->nullable();
    $table->string('slug')->unique();
    $table->text('description_en')->nullable();
    $table->text('description_ar')->nullable();
    $table->timestamps();
});

Schema::create('role_user', function (Blueprint $table) {
    // Relationships: belongsTo user, belongsTo role, belongsTo campaign (scoped roles).
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('role_id')->constrained()->cascadeOnDelete();
    $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
    $table->timestamps();
    $table->unique(['user_id', 'role_id', 'campaign_id']);
});

Schema::create('permission_role', function (Blueprint $table) {
    $table->id();
    $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
    $table->foreignId('role_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
    $table->unique(['permission_id', 'role_id']);
});
```

### Geospatial Hierarchy
```php
// database/migrations/2024_11_30_010000_create_areas_table.php
Schema::create('areas', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo parent area, hasMany child areas, hasMany committees.
    $table->foreignId('parent_id')->nullable()->constrained('areas')->cascadeOnDelete();
    $table->string('code', 20)->nullable()->index();
    $table->enum('type', ['country', 'governorate', 'district'])->index();
    $table->string('name_en');
    $table->string('name_ar');
    $table->json('boundary_geojson')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

// database/migrations/2024_11_30_010100_create_committees_table.php
Schema::create('committees', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo area (district level), belongsTo campaign, hasMany voters, hasMany volunteers.
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('area_id')->constrained('areas')->cascadeOnDelete();
    $table->string('name_en');
    $table->string('name_ar');
    $table->string('code', 20)->nullable()->index();
    $table->string('location');
    $table->string('chairperson_name_en')->nullable();
    $table->string('chairperson_name_ar')->nullable();
    $table->string('chairperson_phone', 30)->nullable();
    $table->enum('support_status', ['strong', 'leaning', 'undecided', 'opposition'])->default('undecided')->index();
    $table->json('meta')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

### Campaign Structure
```php
// database/migrations/2024_11_30_020000_create_elections_table.php
Schema::create('elections', function (Blueprint $table) {
    $table->id();
    // Relationships: hasMany campaigns.
    $table->string('name_en');
    $table->string('name_ar');
    $table->date('election_date')->index();
    $table->enum('type', ['parliamentary', 'presidential', 'local', 'referendum'])->index();
    $table->json('meta')->nullable();
    $table->timestamps();
});

// database/migrations/2024_11_30_020100_create_campaigns_table.php
Schema::create('campaigns', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo election, belongsTo area (base), hasMany teams, hasMany volunteers.
    $table->foreignId('election_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('base_area_id')->nullable()->constrained('areas')->nullOnDelete();
    $table->string('name_en');
    $table->string('name_ar');
    $table->string('slug')->unique();
    $table->string('slogan_en')->nullable();
    $table->string('slogan_ar')->nullable();
    $table->text('description_en')->nullable();
    $table->text('description_ar')->nullable();
    $table->date('start_date')->nullable()->index();
    $table->date('end_date')->nullable()->index();
    $table->decimal('budget', 15, 2)->default(0);
    $table->enum('status', ['draft', 'active', 'paused', 'closed'])->default('draft')->index();
    $table->json('settings')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

// database/migrations/2024_11_30_020200_create_candidates_table.php
Schema::create('candidates', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, belongsTo user (optional profile).
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->string('first_name_en');
    $table->string('first_name_ar');
    $table->string('last_name_en');
    $table->string('last_name_ar');
    $table->date('date_of_birth')->nullable();
    $table->string('photo_path')->nullable();
    $table->text('biography_en')->nullable();
    $table->text('biography_ar')->nullable();
    $table->string('website')->nullable();
    $table->json('social_links')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('campaign_area', function (Blueprint $table) {
    // Relationships: belongsTo campaign, belongsTo area.
    $table->id();
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('area_id')->constrained('areas')->cascadeOnDelete();
    $table->timestamps();
    $table->unique(['campaign_id', 'area_id']);
});
```

### People & Engagement
```php
// database/migrations/2024_11_30_030000_create_teams_table.php
Schema::create('teams', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, belongsTo user (leader), hasMany volunteers.
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('leader_id')->nullable()->constrained('users')->nullOnDelete();
    $table->string('name_en');
    $table->string('name_ar');
    $table->enum('type', ['field', 'communications', 'finance', 'logistics'])->default('field')->index();
    $table->string('contact_phone', 30)->nullable();
    $table->json('meta')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('team_user', function (Blueprint $table) {
    // Relationships: belongsTo team, belongsTo user.
    $table->id();
    $table->foreignId('team_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->enum('role', ['leader', 'coordinator', 'member'])->default('member')->index();
    $table->timestamps();
    $table->unique(['team_id', 'user_id']);
});

// database/migrations/2024_11_30_030100_create_volunteers_table.php
Schema::create('volunteers', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo user, campaign, team, area, committee, hasMany voter assignments.
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
    $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
    $table->string('first_name_en');
    $table->string('first_name_ar')->nullable();
    $table->string('last_name_en');
    $table->string('last_name_ar')->nullable();
    $table->string('phone')->index();
    $table->string('email')->nullable();
    $table->enum('status', ['prospect', 'active', 'inactive'])->default('prospect')->index();
    $table->enum('availability', ['full_time', 'part_time', 'adhoc'])->default('adhoc');
    $table->json('skills')->nullable();
    $table->json('languages')->nullable();
    $table->integer('daily_capacity')->default(0);
    $table->string('sync_status', 30)->default('pending')->index();
    $table->timestamp('synced_at')->nullable();
    $table->unsignedInteger('sync_attempts')->default(0);
    $table->timestamps();
    $table->softDeletes();
});

// database/migrations/2024_11_30_030200_create_voters_table.php
Schema::create('voters', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, area, committee, hasMany assignments and events (through participants).
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
    $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
    $table->string('national_id', 20)->unique();
    $table->string('first_name_en');
    $table->string('first_name_ar')->nullable();
    $table->string('last_name_en');
    $table->string('last_name_ar')->nullable();
    $table->date('date_of_birth')->nullable();
    $table->enum('gender', ['male', 'female', 'other'])->nullable();
    $table->enum('support_status', ['supporter', 'leaning', 'undecided', 'opposition'])->default('undecided')->index();
    $table->enum('contact_preference', ['phone', 'sms', 'email', 'in_person'])->nullable();
    $table->string('phone')->nullable()->index();
    $table->string('email')->nullable();
    $table->string('address_en')->nullable();
    $table->string('address_ar')->nullable();
    $table->json('meta')->nullable();
    $table->string('sync_status', 30)->default('pending')->index();
    $table->timestamp('synced_at')->nullable();
    $table->unsignedInteger('sync_attempts')->default(0);
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('volunteer_voter_assignments', function (Blueprint $table) {
    // Relationships: belongsTo volunteer, belongsTo voter.
    $table->id();
    $table->foreignId('volunteer_id')->constrained()->cascadeOnDelete();
    $table->foreignId('voter_id')->constrained()->cascadeOnDelete();
    $table->enum('assignment_type', ['canvass', 'follow_up', 'transport'])->default('canvass');
    $table->timestamp('assigned_at')->index();
    $table->timestamp('completed_at')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
    $table->unique(['volunteer_id', 'voter_id', 'assignment_type']);
});

Schema::create('committee_volunteer', function (Blueprint $table) {
    // Relationships: belongsTo committee, belongsTo volunteer.
    $table->id();
    $table->foreignId('committee_id')->constrained()->cascadeOnDelete();
    $table->foreignId('volunteer_id')->constrained()->cascadeOnDelete();
    $table->enum('role', ['chair', 'secretary', 'member'])->default('member');
    $table->timestamps();
    $table->unique(['committee_id', 'volunteer_id']);
});
```

### Operations & Logistics
```php
// database/migrations/2024_11_30_040000_create_events_table.php
Schema::create('events', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, team, area, committee; morphMany participants.
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
    $table->foreignId('committee_id')->nullable()->constrained()->nullOnDelete();
    $table->string('title_en');
    $table->string('title_ar');
    $table->text('description_en')->nullable();
    $table->text('description_ar')->nullable();
    $table->enum('type', ['rally', 'meeting', 'training', 'poll_watch'])->index();
    $table->timestamp('starts_at')->index();
    $table->timestamp('ends_at')->nullable();
    $table->string('location_en')->nullable();
    $table->string('location_ar')->nullable();
    $table->integer('expected_attendance')->nullable();
    $table->json('meta')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('event_participants', function (Blueprint $table) {
    // Relationships: belongsTo event, morphTo participant (volunteer, voter, user).
    $table->id();
    $table->foreignId('event_id')->constrained()->cascadeOnDelete();
    $table->morphs('participant');
    $table->enum('role', ['attendee', 'speaker', 'organizer'])->default('attendee');
    $table->enum('status', ['invited', 'confirmed', 'attended', 'absent'])->default('invited')->index();
    $table->timestamps();
    $table->unique(['event_id', 'participant_type', 'participant_id']);
});

// database/migrations/2024_11_30_040100_create_expense_categories_table.php
Schema::create('expense_categories', function (Blueprint $table) {
    $table->id();
    // Relationships: hasMany finances.
    $table->string('name_en');
    $table->string('name_ar');
    $table->string('code', 30)->unique();
    $table->text('description_en')->nullable();
    $table->text('description_ar')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('finances', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, belongsTo expense category, belongsTo team (optional), belongsTo user (creator).
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('expense_category_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
    $table->enum('type', ['income', 'expense'])->index();
    $table->enum('payment_method', ['cash', 'bank_transfer', 'mobile_wallet', 'cheque'])->nullable();
    $table->string('reference')->nullable()->index();
    $table->string('description_en')->nullable();
    $table->string('description_ar')->nullable();
    $table->decimal('amount', 15, 2);
    $table->string('currency', 3)->default('EGP');
    $table->date('transaction_date')->index();
    $table->string('receipt_path')->nullable();
    $table->json('meta')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

### Communications
```php
// database/migrations/2024_11_30_050000_create_messages_table.php
Schema::create('messages', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, belongsTo sender (user), morphMany recipients.
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
    $table->enum('channel', ['sms', 'email', 'push', 'whatsapp'])->index();
    $table->string('subject_en')->nullable();
    $table->string('subject_ar')->nullable();
    $table->text('body_en');
    $table->text('body_ar')->nullable();
    $table->enum('status', ['draft', 'scheduled', 'sent', 'failed'])->default('draft')->index();
    $table->timestamp('scheduled_at')->nullable()->index();
    $table->timestamp('sent_at')->nullable();
    $table->json('meta')->nullable();
    $table->timestamps();
    $table->softDeletes();
});

Schema::create('message_recipients', function (Blueprint $table) {
    // Relationships: belongsTo message, morphTo recipient (user, volunteer, voter).
    $table->id();
    $table->foreignId('message_id')->constrained()->cascadeOnDelete();
    $table->morphs('recipient');
    $table->enum('delivery_status', ['queued', 'sent', 'delivered', 'failed'])->default('queued')->index();
    $table->timestamp('delivered_at')->nullable();
    $table->text('failure_reason')->nullable();
    $table->timestamps();
    $table->unique(['message_id', 'recipient_type', 'recipient_id']);
});

// database/migrations/2024_11_30_050100_create_notifications_table.php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo notifiable (user), belongsTo campaign (scope).
    $table->morphs('notifiable');
    $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
    $table->string('title_en');
    $table->string('title_ar')->nullable();
    $table->text('body_en');
    $table->text('body_ar')->nullable();
    $table->enum('type', ['system', 'task', 'alert'])->index();
    $table->boolean('read')->default(false)->index();
    $table->timestamp('read_at')->nullable();
    $table->json('data')->nullable();
    $table->timestamps();
});
```

### Analytics & Sync
```php
// database/migrations/2024_11_30_060000_create_analytics_snapshots_table.php
Schema::create('analytics_snapshots', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, belongsTo team (optional), belongsTo area (optional).
    $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
    $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('area_id')->nullable()->constrained('areas')->nullOnDelete();
    $table->date('snapshot_date')->index();
    $table->enum('scope', ['campaign', 'team', 'area', 'committee'])->default('campaign')->index();
    $table->json('metrics')->nullable();
    $table->json('trends')->nullable();
    $table->timestamps();
});

Schema::create('analytics_snapshot_metrics', function (Blueprint $table) {
    // Relationships: belongsTo analytics snapshot.
    $table->id();
    $table->foreignId('analytics_snapshot_id')->constrained()->cascadeOnDelete();
    $table->string('key');
    $table->decimal('value', 15, 2)->default(0);
    $table->enum('value_type', ['count', 'currency', 'percentage', 'ratio'])->default('count');
    $table->timestamps();
    $table->unique(['analytics_snapshot_id', 'key']);
});

Schema::create('sync_jobs', function (Blueprint $table) {
    $table->id();
    // Relationships: belongsTo campaign, belongsTo user (initiator).
    $table->foreignId('campaign_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('initiated_by')->nullable()->constrained('users')->nullOnDelete();
    $table->enum('entity', ['volunteer', 'voter', 'event', 'finance'])->index();
    $table->enum('direction', ['push', 'pull'])->index();
    $table->enum('status', ['queued', 'processing', 'success', 'failed'])->default('queued')->index();
    $table->timestamp('started_at')->nullable();
    $table->timestamp('finished_at')->nullable();
    $table->unsignedInteger('processed_count')->default(0);
    $table->json('payload')->nullable();
    $table->text('error_message')->nullable();
    $table->timestamps();
});
```

## ERD Relationship Map
```
Elections
└── Campaigns
    ├── Candidates
    ├── Campaign Area (pivot) ── Areas (self-referential hierarchy)
    │   └── Committees
    │       ├── Volunteers (committee_id)
    │       └── Voters (committee_id)
    ├── Teams
    │   ├── Team User (pivot) ── Users
    │   └── Volunteers (team_id)
    ├── Volunteers
    │   └── Volunteer Voter Assignments ── Voters
    ├── Events
    │   └── Event Participants ── {Volunteers | Voters | Users}
    ├── Messages
    │   └── Message Recipients ── {Users | Volunteers | Voters}
    ├── Notifications ── Notifiable morph (Users/Volunteers)
    ├── Finances ── Expense Categories
    └── Analytics Snapshots
        └── Analytics Snapshot Metrics

Users
├── Role User (pivot) ── Roles ── Permission Role ── Permissions
└── Teams / Volunteers / Messages / Sync Jobs

Sync Jobs
└── Tracks push/pull of Volunteers, Voters, Events, Finances
```

## Recommended Artisan Commands
```bash
php artisan make:model Election -m
php artisan make:model Campaign -mcr
php artisan make:model Candidate -m
php artisan make:model Area -m
php artisan make:model Committee -m
php artisan make:model Team -mcr
php artisan make:model Volunteer -mcr
php artisan make:model Voter -mcr
php artisan make:model Event -mcr
php artisan make:model ExpenseCategory -m
php artisan make:model Finance -m
php artisan make:model Message -mcr
php artisan make:model Notification -m
php artisan make:model AnalyticsSnapshot -m
php artisan make:model SyncJob -m
```

Controllers can be scaffolded with `--resource` for RESTful endpoints and `--invokable` for service-specific handlers (e.g., `php artisan make:controller SyncJobController --invokable`).

## Campaign → Volunteer → Voter Data Flow
1. **Campaign Setup**
   - Campaign managers create a campaign linked to an election and target areas (`campaign_area`).
   - Teams are defined with leaders, and committees are mapped to district-level areas.
2. **Volunteer Recruitment & Assignment**
   - Volunteers (existing users or new records) are attached to campaigns, teams, and committees.
   - Mobile canvassing apps update `volunteers.sync_status` to reflect push/pull operations, recorded in `sync_jobs`.
   - Volunteers are assigned voters through `volunteer_voter_assignments`, including role and completion timestamps.
3. **Voter Engagement & Analytics**
   - Field interactions update voter support status, contact preferences, and committee linkage.
   - Events log attendance via `event_participants` for volunteers and voters.
   - Messaging campaigns deliver targeted outreach stored in `messages` and `message_recipients`.
4. **Analytics Snapshotting**
   - Nightly or on-demand jobs aggregate metrics per campaign/team/area, storing results in `analytics_snapshots` and `analytics_snapshot_metrics`.
   - Finance transactions, voter conversion rates, and volunteer activity volumes feed dashboards.
5. **Feedback Loop**
   - Notifications alert responsible teams of sync failures or significant metric deviations.
   - Managers iterate assignments, update campaign strategy, and persist adjustments for auditability.

## Seeder & Factory Structure (faker_ar_EG)
```php
// database/factories/VolunteerFactory.php
public function definition(): array
{
    $faker = \Faker\Factory::create('ar_EG');

    return [
        'campaign_id'   => Campaign::factory(),
        'team_id'       => Team::factory(),
        'area_id'       => Area::factory(),
        'committee_id'  => Committee::factory(),
        'first_name_en' => $this->faker->firstName(),
        'first_name_ar' => $faker->firstName(),
        'last_name_en'  => $this->faker->lastName(),
        'last_name_ar'  => $faker->lastName(),
        'phone'         => $this->faker->unique()->numerify('010########'),
        'email'         => $this->faker->safeEmail(),
        'status'        => $this->faker->randomElement(['prospect', 'active', 'inactive']),
        'availability'  => $this->faker->randomElement(['full_time', 'part_time', 'adhoc']),
        'skills'        => ['door-to-door', 'data-entry'],
        'languages'     => ['en', 'ar'],
        'daily_capacity'=> $this->faker->numberBetween(5, 20),
        'sync_status'   => 'pending',
    ];
}

// database/seeders/CampaignSeeder.php
public function run(): void
{
    Campaign::factory()
        ->has(Team::factory()->count(3))
        ->has(Volunteer::factory()->count(30))
        ->has(Voter::factory()->count(500))
        ->create();
}
```

These factories leverage `faker_ar_EG` for authentic Arabic content while preserving English fallbacks, ensuring localized testing scenarios.
