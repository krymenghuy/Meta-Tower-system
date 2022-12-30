<?php

namespace App\Models\Location;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;
    protected $table = 'loc_districts';
    protected $guarded = ['id'];
    protected $fillable = [];
     
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    //default attribute values
    // protected $attributes = [
    //     //'inactive' => 0,
    //     'consultant_id'=>0
    // ];

     /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    // protected $hidden = [
    //     'password',
    //     'remember_token',
    // ];
 
    protected $casts = [
        'id' => 'integer',
        'name'=>'string',
        'name_kh'=>'string'
    ];

}
