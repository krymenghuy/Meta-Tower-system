<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
//use App\Models\Umt\Data\DataConvertor;

class BranchData //extends Model
{
    //use HasFactory;
    public static $branches = [];

    static function createData()
    {
       
        $country_id =13;
        self::$branches = [
            [
                 'id'=>1,
                 'name'=> 'HQ Branch',
                 'name_kh'=>'សាខាធំ',
                 'branch_type'=>'HQ',
                 'branch_rank'=>1,
                 'country_id'=>$country_id,
                 'city_id'=>null,
                 'region_id'=>null
            ]
        ];
    }

    static function first(){
        self::createData();
        return self::$branches[0];
    }
}
