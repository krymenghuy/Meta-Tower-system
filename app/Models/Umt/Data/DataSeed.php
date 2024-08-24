<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Services\Umt\AuthService;
//use App\Models\Umt\UMTSettings;
use App\Models\Umt\Data\AppData;

use App\Models\Umt\Data\CustomerData;
use App\Models\Umt\Data\PlanData;
//use App\Models\Umt\Data\PlanAppData;
use App\Models\Umt\Data\SubscriptionData;
use App\Models\Umt\Data\BranchData;
use App\Models\Umt\Data\RoleData;
use App\Models\Umt\Data\UserData;
use App\Models\Umt\Data\RoleGroupData;
use App\Models\DBX;
use DB;

use function Psy\bin;

class DataSeed //extends Model
{
    //use HasFactory;
    static function initialize(){
       self::migrate();
       self::initAppList();
       self::initPlans();
       self::initCustomer();
       $subs_id = self::initSubscription();
       if (!$subs_id){
        return [
            'status'=>'Error',
            'error_message'=>'Failed to create subscription data'
          ];
       }
       self::initBranch($subs_id);
       self::initRoleGroups($subs_id);  
       self::initRole($subs_id);
       self::initUser($subs_id);

       return [
         'status'=>'OK',
         'error_message'=>null
         //,'data'=>[]
       ];
    }
    
    static function migrate(){
      //todo: create table schema
      return;
    }

    static function initAppList(){
        DB::table('um_applications')->delete();
        DB::table('um_applications')->insert(AppData::list(['id']));
    }

    static function initCustomer(){
       DB::table('um_customers')->delete();
       DB::table('um_customers')->insert(CustomerData::first(['id']));
    }

    static function initRoleGroups($subs_id){
      DB::table('um_role_groups')->delete();
      $inputs = RoleGroupData::createData($subs_id);
      DB::table('um_role_groups')->insert($inputs);
    }

    static function initRole($subs_id){
        DB::table('um_roles')->delete();
        $input = RoleData::first();
        $input['subs_id'] = hex2bin($subs_id);
        DB::table('um_roles')->insert($input);
        $new_id = DB::getPdo()->lastInsertId();
        DB::table('um_role_apps')->delete();
        if($new_id){
            $apps = AppData::list();
            foreach($apps as $app){
                DB::table('um_role_apps')->insert([
                    'role_id'=>$new_id,
                    'app_id'=>hex2bin($app['id'])
                ]); 
            }
        } 
    }

    static function initUser($subs_id){
        DB::table('um_users')->delete();
        $inputs = UserData::first();
        $inputs['subs_id'] = hex2bin($subs_id);
        $pwd = $inputs['password'];
        unset($inputs['password']);
        $inputs['hpwd'] = AuthService::hashPassword($pwd,null);
        //Clear all existing users
        DB::table('um_users')->delete();
        DB::table('um_users')->insert($inputs);
        $new_id = DB::getPdo()->lastInsertId();

        $new_id = DB::getPdo()->lastInsertId();
        if($new_id){
            $def_branch_id = BranchData::first()['id'];
            DB::table('um_user_branches')->where('user_id',$new_id)->where('branch_id',$def_branch_id)->delete();
            DB::table('um_user_branches')->insert(['user_id'=>$new_id,'branch_id'=> $def_branch_id,'is_branch_admin'=>1,'is_default'=>1]);
        }
        
        $nowTime = getNowTime();
        DB::table('um_user_roles')->delete();
        if($new_id){
             $role = (object) RoleData::first();
             DB::table('um_user_roles')->insert([
                'user_id'=>$new_id,
                'role_id'=>$role->id,
                'start_date'=>$nowTime,
                'create_uid'=>1
             ]);

             //$subs_info = (object) SubscriptionData::first();
             $apps = AppData::list();
            
            //  foreach($apps as $app){
            //      DB::table('um_user_apps')->insert([
            //         'user_id'=>$new_id,
            //         'app_id'=> hex2bin($app['id']),
            //         'subs_id'=>hex2bin($subs_info->id),
            //         'is_super_admin'=>1,
            //         'superadmin_start_date'=>$nowTime,
            //         'create_uid'=>1,
            //         'create_user'=> $inputs['full_name']
            //      ]);
            //  } 

             /** Assign this first user to be admin of all apps */
             DB::table('um_app_admins')->delete();
             foreach($apps as $app){
                DB::table('um_app_admins')->insert([
                   'user_id'=>$new_id,
                   'app_id'=> hex2bin($app['id']),
                   'start_date'=>$nowTime,
                   'created_at'=>$nowTime,
                   'create_uid'=>1,
                   'create_user'=> $inputs['full_name']
                ]);
            } 

        }
    }
   

    static function initBranch($subs_id){
        $branch_table = DBX::$branch_table;
        DB::table($branch_table)->delete();
        $inputs = BranchData::first();
        $inputs['subs_id'] = hex2bin($subs_id);
        DB::table($branch_table)->insert($inputs);
    }
    
    static function initSubscription(){
       $subs_info = SubscriptionData::first();
       //NOTE: DataConvertor::prepare() will ensure that columns "app_id" and  "id" are in binary format
       $apps = DataConvertor::prepare([],$subs_info['apps']);
       if(isset($subs_info['apps'])) unset($subs_info['apps']);
       DB::table('um_subscriptions')->delete();

       $subs_id = $subs_info['id'];
       $subs_info['id'] = hex2bin($subs_id);
       DB::table('um_subscriptions')->insert($subs_info);
       if(!$subs_id){
          \Log::error('method SubscriptionData::first() return empty subscription ID ');
          return;
       }
       foreach($apps as $app){
        $app_id = $app['id'];
        DB::table('um_subs_apps')->insert([
            'app_id'=> hex2bin($app_id),
            'subs_id'=> hex2bin($subs_id),
            'create_uid'=>1,
            'create_date'=>getNowTime()
        ]);  
       }
       return $subs_id;
    }

    static function initPlans(){
        DB::table('um_plans')->delete();
        DB::table('um_plans')->insert((array)PlanData::first([]));

        DB::table('um_plan_apps')->delete();
        $apps = AppData::list(['id']);
        $plan = (object) PlanData::first();
        foreach($apps as $app){
            DB::table('um_plan_apps')->insert([
                'app_id'=> $app['id'],
                'plan_id'=>$plan->id
            ]);
        }

    }
}
