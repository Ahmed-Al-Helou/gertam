<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleDate extends Model
{

    protected $fillable = [
        "module_by",
        "date_form",
        "date_to"
    ];
    
    use HasFactory;
     public function engine(){
        return $this->hasMany(Enginee::class);
    }
     public function module(){
        return $this->belongsTo(module::class);
    }
}
