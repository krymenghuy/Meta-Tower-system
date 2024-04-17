<?php

namespace App\Models\Dms;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slides extends Model
{
    use HasFactory;

    protected $fillable = ['name','image'];
    protected $table = 'slides';

    public function umUsers(){
    	return $this->belongsTo('App\Models\Dms\UmUsers', 'user_id', 'id');
    }
}
