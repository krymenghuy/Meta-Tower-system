<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\DBX;
use App\Models\Umt\UMTSettings;
use DB;
class Application //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id = null,$userInfo=null)
    {
       $this->id = $id;
       $this->userInfo = $userInfo;   
    }

    function getEligibleUsers($app_id,$ss){
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        $user_class = DB::table('um_applications as app')->where('id',hex2bin($app_id))->value('user_class');
        return DB::table('um_users as u')->where('u.subs_id',hex2bin($subs_id))->where('u.user_class',$user_class)->selectRaw('u.id,u.full_name as target_user')->get();
    }

    static function list($arr, $ss){
        $d = (object)$arr;
        $subs_id = isset($d->subs_id)? $d->subs_id:null;
        $search_value = isset($d->search_value)? $d->search_value:null;
        $role_id = isset($d->role_id)? $d->role_id : 0;
        $str_search = $search_value ? ' app.name LIKE \'%'.escape_like_str($search_value).'%\'': '3=3';
        $is_allowed = DBX::roleAccessApp($role_id,'app.id','allowed');
        $rows = DB::table('um_applications as app')->join('um_subs_apps as sa','sa.app_id','=','app.id')->where('sa.subs_id',hex2bin($subs_id))->whereRaw($str_search)->selectRaw( DBX::getHEX('app.id','id').', app.name,'.$is_allowed.',app.is_mobile_app,user_class')->get();
        return $rows;
    }

    static function details($id){
        $bin_app_id = hex2bin($id);  
        //$str_app_id = DBX::getHEX ('id','id');
        return DB::table('um_applications as app')->where('app.id', $bin_app_id)->selectRaw(DBX::getHEX('app.id','id').', app.name,app.is_mobile_app,app.home_route,app.user_class,app.icon_file_name')->first();
    }

    //$col = app_id|user_class
    static function getBy($col,$value){
        $used_value = null;
        if ($col ==='id' || $col ==='app_id'){
            $used_value = hex2bin($value);
        }else $used_value = $value;
        return DB::table('um_applications as app')->where('app.'.$col, $used_value)->selectRaw(DBX::getHEX('app.id','id').', app.name, user_class')->first();
    }

    function save($arr,$id = null, $ss = null){
        $ss =$ss ?? $this->userInfo;
        $id = $is ?? $this->id;
        $v_rule = [
            'name'=>'1|string|1-250',
            'is_mobile_app'=>'1|choice|0,1',
            'icon_file_name'=>'0|string|0-250',
            'home_route'=>'0|string|1-50',
            'user_class'=>'1|string',
            'subs_id'=>'1|string'
        ];

        $res = validateObject($arr, $v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $is_mobile_app = $inputs['is_mobile_app'];
        if (!$is_mobile_app){
             $route = $inputs['home_route'] ?? null;
             if(!$route) return DV::error('Route name is required for Web Application');
             if (self::appRouteExists($route,$id)) return DV::error('Route named '.$route.' already exists');
        }
        $inputs['name_native'] = $inputs['name'];
        $subs_id = $inputs['subs_id'];
        unset($inputs['subs_id']);
        $bin_app_id = $id? hex2bin($id) : null;
        $bin_subs_id = $subs_id? hex2bin($subs_id) : null;
        $id = saveData($ss,'um_applications',['id'=>$bin_app_id],$inputs,[],0,false,'binary');
        $nowTime = getNowTime();

        if($id && $bin_subs_id){
            $exists = DB::table('um_subs_apps')->where('app_id',$id)->where('subs_id',$bin_subs_id)->select('subs_id')->exists();
            if(!$exists){
                DB::table('um_subs_apps')->insert([
                    'subs_id'=>$bin_subs_id,
                    'app_id'=>$id,
                    'create_uid'=>$ss->user_id,
                    DBX::$created_at=>$nowTime,
                    'update_user'=>$ss->full_name,
                    'update_uid'=>$ss->user_id,
                    DBX::$updated_at=>$nowTime,
                    'update_user'=>$ss->full_name,
                ]);
            }
     
        }
        return DV::depends($id); 
    }

    static function appRouteExists($name,$id){
       $bin_app_id = hex2bin($id); 
       return DB::table('um_applications')->where('home_route',$name)->where('id','<>',$bin_app_id)->value('home_route');
    }

    function delete($id,$ss=null){
        $ss = $ss?? $this->userInfo;
        $bin_app_id = hex2bin($id);
        DB::table('um_applications')->where('id',$bin_app_id)->delete();
        DB::table('um_role_apps')->where('id',$bin_app_id)->delete();
        DB::table('um_user_apps')->where('id',$bin_app_id)->delete();
        return DV::depends(1);
    }

    static function getFormOptions($id,$ss){
      return (object)[
        'app'=>self::details($id),
        'user_classes'=>UMTSettings::options_user_class($ss)
      ];
    }
  
}
