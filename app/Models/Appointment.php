<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//If we use UUID instead of integer appointment_id
//use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Session;

class Appointment extends Model
{
    use HasFactory;
    protected $table = 'appointments';
    protected $guarded = ['id'];
    protected $fillable = [];
    // protected $fillable = [
    //     'id',
    //     'branch_id',
    //     'channel_id',
    //     'arrival_date',
    //     'arrival_time',
    //     'consultant_id',
    //     'notes',
    //     'create_user',
    //     'created_at',
    //     'create_uid',
    //     'update_user',
    //     'update_uid',
    //     'updated_at'];

    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
    protected $dateFormat = 'Y-m-d';
    
    protected $attributes = [
        //'inactive' => 0,
        'consultant_id'=>0
    ];

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
        'branch_id'=>'integer',
        'channel_id'=>'integer',
        'arrival_date' => 'date',
        'arrival_time' => 'datetime',
        'consultant_id' => 'integer',
        'notes' => 'string'
    ];
    
    public static $rules = [
        // 'name' => 'required',
        'branch_id'=>'required|numeric',
        'channel_id'=>'required|numeric'
        //'arrival_date' => 'required|date|numeric|unique:customers,phone'
    ];

    public static $messages = [
        // 'name' => 'required',
        'channel_id.required'=>'Channel of contact is not correct!',
        'branch_id.required'=>'Company ID not valid'
        //'arrival_date' => 'required|date|numeric|unique:customers,phone'
    ];
}
