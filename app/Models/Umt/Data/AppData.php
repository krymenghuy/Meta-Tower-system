<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\DataConvertor;
use Config;

class AppData //extends Model
{
    //use HasFactory;
    public static $apps = [];

    static function createData()
    {
        self::$apps = [
            [
                'id'=> Config::get('app.dms_app_id'),
                'name'=>'Delivery Management',
                'name_native'=>'DMS',
                'is_mobile_app'=>0,
                'icon_file_name'=> null,
                'home_route'=>'dms'
            ],
            [
                'id'=> Config::get('app.acc_app_id'),
                'name'=>'Accounting',
                'name_native'=>'ACC',
                'is_mobile_app'=>0,
                'icon_file_name'=> null,
                'home_route'=>'acc'
            ],
            [
                'id'=> Config::get('app.merchant_portal_app_id'),
                'name'=>'Merchant Access',
                'name_native'=>'MAC',
                'is_mobile_app'=>0,
                'icon_file_name'=> null,
                'home_route'=>'mac'
            ],
            [
                'id'=> Config::get('app.merchant_app_id'),
                'name'=>'HOU Merchant',
                'name_native'=>'HOU Merchant',
                'is_mobile_app'=>1,
                'icon_file_name'=> null,
                'home_route'=>null
            ],
            [
                'id'=> Config::get('app.driver_app_id'),
                'name'=>'HOU Driver',
                'name_native'=>'HOU Driver',
                'is_mobile_app'=>1,
                'icon_file_name'=> null,
                'home_route'=>null
            ],
            [
                'id'=>Config::get('app.sales_app_id'),
                'name'=>'HOU Connect',
                'name_native'=>'HOU Connect',
                'is_mobile_app'=>1,
                'icon_file_name'=> null,
                'home_route'=>null
            ],   [
                'id'=>Config::get('app.um_app_id'),
                'name'=>'User Management',
                'name_native'=>'User Management',
                'is_mobile_app'=>0,
                'icon_file_name'=> null,
                'home_route'=>'umt'
            ]
        ];

    }

    static function list($binary_columns = []){
        self::createData();
        return DataConvertor::prepare($binary_columns, self::$apps);
    }
}
