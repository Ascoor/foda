<?php

namespace App\Models;

use App\Models\ElectionCircle\Committee as BaseCommittee;
use App\Models\GeoArea;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;

class Committee extends BaseCommittee
{
    protected $fillable = ['geo_area_id', 'code', 'name', 'location'];

    public function geoArea(): BelongsTo
    {
        return $this->belongsTo(GeoArea::class, 'geo_area_id');
    }

    protected static function booted(): void
    {
        static::saving(function (Committee $model) {
            if (!$model->geo_area_id) {
                throw ValidationException::withMessages([
                    'geo_area_id' => 'اللجنة يجب أن ترتبط بدائرة من نوع markaz أو qesm أو city.',
                ]);
            }

            $geoArea = $model->relationLoaded('geoArea')
                ? $model->getRelation('geoArea')
                : GeoArea::query()->find($model->geo_area_id);

            if (!$geoArea || !$geoArea->is_circle) {
                throw ValidationException::withMessages([
                    'geo_area_id' => 'اللجنة يجب أن ترتبط بدائرة من نوع markaz أو qesm أو city.',
                ]);
            }
        });
    }
}
