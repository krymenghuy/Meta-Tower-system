<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class RoleGroupData //extends Model
{
    //use HasFactory;

    static function createData($subs_id){
        $subs_id = hex2bin($subs_id);
       return [
        [
            'subs_id'=>$subs_id,
            'name'=>'General',
            'id'=>1
        ],
        [
            'subs_id'=>$subs_id,
            'name'=>'Official',
            'id'=>2
        ],
        [
            'subs_id'=>$subs_id,
            'name'=>'Unofficial',
            'id'=>3
        ],
        [
            'subs_id'=>$subs_id,
            'name'=>'Other',
            'id'=>4
        ]
       ];   
    }
}
