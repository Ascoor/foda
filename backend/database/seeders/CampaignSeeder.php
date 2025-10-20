<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Campaign;
use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Election;
use App\Models\ElectionCircle\GeoArea;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $faker = FakerFactory::create('ar_EG');

        $election = Election::query()->firstOrCreate(
            ['name' => 'الانتخابات البرلمانية المصرية ٢٠٢٥'],
            [
                'start_date' => now()->startOfYear(),
                'end_date' => now()->endOfYear(),
            ]
        );

        $scenarios = [
            [
                'slug' => 'cairo-education-first',
                'name' => 'حملة التعليم أولاً - القاهرة',
                'slogan' => 'التعليم حق لكل طفل في المطرية وعين شمس',
                'description' => 'حملة تركز على تطوير المدارس الحكومية، توفير مجموعات تقوية مجانية، ومتابعة أوضاع المعلمين في شرق القاهرة.',
                'status' => 'active',
                'budget' => 3_200_000,
                'target_votes' => 52000,
                'candidate' => 'محمد أحمد علي',
                'governorate' => 'القاهرة',
            ],
            [
                'slug' => 'giza-women-empowerment',
                'name' => 'حملة الجيزة قوة السيدات',
                'slogan' => 'ستات الجيزة صانعات المستقبل',
                'description' => 'حملة تهتم بريادة الأعمال الصغيرة، تدريب السيدات، وحل مشكلات الأسواق الشعبية في بولاق والدقي.',
                'status' => 'mobilizing',
                'budget' => 2_850_000,
                'target_votes' => 47000,
                'candidate' => 'نهى خالد عبد السلام',
                'governorate' => 'الجيزة',
            ],
            [
                'slug' => 'alexandria-harbor-revival',
                'name' => 'حملة إسكندرية الميناء يتجدد',
                'slogan' => 'خدمات بحرية نظيفة وحياة كريمة للصيادين',
                'description' => 'حملة تركز على تطوير ميناء الأنفوشي، تحسين الخدمات الصحية في بحري، وتوسيع برامج الشباب في المنتزه.',
                'status' => 'planning',
                'budget' => 3_750_000,
                'target_votes' => 61000,
                'candidate' => 'إبراهيم محمود البحيري',
                'governorate' => 'الإسكندرية',
            ],
        ];

        foreach ($scenarios as $scenario) {
            $candidate = Candidate::query()->where('full_name', $scenario['candidate'])->first();

            if (! $candidate) {
                $this->command?->warn('لم يتم العثور على المرشح: ' . $scenario['candidate']);
                continue;
            }

            $geoArea = GeoArea::query()->firstOrCreate(
                ['name' => $scenario['governorate'], 'level' => 'governorate'],
                [
                    'code' => Str::slug($scenario['governorate']),
                    'parent_id' => null,
                    'full_path' => $scenario['governorate'],
                ]
            );

            Campaign::factory()->create([
                'election_id' => $election->id,
                'candidate_id' => $candidate->id,
                'geo_area_id' => $geoArea->id,
                'name' => $scenario['name'],
                'slug' => $scenario['slug'],
                'slogan' => $scenario['slogan'],
                'description' => $scenario['description'],
                'status' => $scenario['status'],
                'budget' => $scenario['budget'],
                'target_votes' => $scenario['target_votes'],
                'start_date' => now()->subWeeks($faker->numberBetween(6, 12)),
                'end_date' => now()->addWeeks($faker->numberBetween(6, 14)),
            ]);
        }
    }
}
