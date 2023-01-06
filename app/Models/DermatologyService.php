<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DermatologyService extends Model
{
    use HasFactory;
    protected $table = 'service_items';
    protected $primaryKey = 'id';
    //public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;
    protected $dateFormat = 'U';

    // //Automatice Current timestamp columns
    // const CREATED_AT = 'create_date';
    // const UPDATED_AT = 'update_date';

    //protected $connection = 'sqlite';

    //Model's default values for some attributes
    protected $attributes = [
        'item_type'=>'good',
        'group_id'=>1,
        'selling_price' => 0,
        'cost'=>0,
        'inactive'=>0,
        //'name'=>'some name',
        //'create_date'=>getNowTime(),
        'status'=>'normal' /** status ={normal, obsolete}**/
    ];

    protected $fillable =["*"];  

}
