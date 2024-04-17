<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slides extends Model
{
    use HasFactory;

    protected $fillable = ['name','image'];
    protected $table = 'slides';

    public function umUsers(){
    	return $this->belongsTo('App\Models\UmUsers', 'user_id', 'id');
    }
}
