<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\Umt\Data\CustomerData;
use App\Models\Umt\Data\SubscriptionData;
use App\Models\Umt\Data\DataConvertor;

class UserData //extends Model
{
    //use HasFactory;
    public static $users = [];

   static function createData()
    {
        $customer = (object) CustomerData::first();
        $subs = (object) SubscriptionData::first();
        $user_class ='Admin';
        self::$users = [
             [
                 'id'=>1,
                 'login_name'=>$customer->email,
                 'user_class'=> $user_class,
                 'password'=>'123456',
                 'full_name'=>'Owner Admin',
                 'is_master_account'=>1,
                 'subs_id'=>$subs->id,
                 'is_locked'=>0,
                 'status'=>'Active'
             ]
        ];
    }

    static function first($bin_cols = []){
        self::createData();
        return DataConvertor::prepare($bin_cols,self::$users[0]);
    }
}
