<?php

namespace Database\Seeders;

use App\Models\ElectionCircle\Candidate;
use App\Models\ElectionCircle\Election;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $faker = FakerFactory::create('ar_EG');
    
        $election = Election::query()->firstOrCreate(
            ['name' => 'الانتخابات البرلمانية المصرية ٢٠٢٥'],
            [
                'slug' => Str::slug('الانتخابات البرلمانية المصرية ٢٠٢٥'),
                'election_type' => 'parliamentary',
                'starts_at' => now()->startOfYear(),
                'ends_at' => now()->endOfYear(),
                'status' => 'active',
                'country' => 'مصر',
                'geo_scope' => 'وطني',
                'description' => 'الانتخابات البرلمانية العامة لعام ٢٠٢٥ في مصر.',
            ]
        );
        
        


        $candidates = [
            [
                'full_name' => 'محمد أحمد علي',
                'party' => 'حزب مستقبل وطن',
                'biography' => 'محامٍ شاب من حي المطرية يهتم بملفات التعليم والعدالة الاجتماعية.',
            ],
            [
                'full_name' => 'نهى خالد عبد السلام',
                'party' => 'مستقل',
                'biography' => 'ناشطة في مبادرات دعم المرأة ورواد الأعمال في محافظة الجيزة.',
            ],
            [
                'full_name' => 'إبراهيم محمود البحيري',
                'party' => 'حزب المصريين الأحرار',
                'biography' => 'مهندس مدني من الإسكندرية يقود مبادرات تطوير البنية التحتية والبحيرات.',
            ],
        ];

        foreach ($candidates as $candidate) {
            Candidate::factory()->create([
                'election_id' => $election->id,
                'full_name' => $candidate['full_name'],
                'slug' => Str::slug(Arr::first(explode(' ', $candidate['full_name']))) . '-' . $faker->unique()->numberBetween(100, 999),
                'party' => $candidate['party'],
                'biography' => $candidate['biography'],
                'photo_path' => null,
            ]);
        }
    }
}
