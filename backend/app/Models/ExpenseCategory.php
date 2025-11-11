<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name_ar','name_en'];

    public function finances(){ return $this->hasMany(Finance::class, 'category_id'); }
}
