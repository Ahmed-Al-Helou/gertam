<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class module extends Model
{
    use HasFactory;

    protected $fillable = [
        "ar_name",
        "en_name",
        "make_by"
    ];

    public function brands(){
        return $this->belongsTo(Brands::class);
    }

    public function moduleDate(){
        return $this->hasMany(ModuleDate::class, 'module_by');
    }
   
}
