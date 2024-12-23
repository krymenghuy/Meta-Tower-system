<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;
use App\Models\DBX;
use App\Services\Umt\AuthService;
use App\Models\Umt\Report;
use App\Models\Umt\Permission;
use DB;
//use Sanitizer;

class Role //extends Model
{
    //use HasFactory;
    protected  $id = null, $user_info = null;
    protected static $table = 'um_roles'; 
    function __construct($id = null, $user_info = null)
    {
        $this->id = $id;
        $this->user_info = $user_info;
    }

    function save($arr,$id =null, $ss=null){
      $role_id = $id ?? $this->id;
      $ss = $ss ?? AuthService::user();
      //if(!$c_user) return DV::authFailed();
      $subs_id = $ss->subs_id;
         $v_rule = [
            'name'=>'1|string|300',
            'group_id'=>'1|number|default=1',
            'user_class'=>'1|string|0-50'
         ];
         $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
         if($res->error) return DV::error($res->error);
         $inputs = $res->values;
         $inputs['subs_id'] = hex2bin($subs_id);
         unset($inputs['id']);
         $user_class = $inputs['user_class'] ?? null;
         if(!UMTSettings::correctUserClass($user_class)) return DV::error('user class is not correct');
         $id = saveData($ss,self::$table,['id'=>$role_id],$inputs,[],0,false);
         if($id){
             $inputs['id']= $id;
             $inputs['subs_id'] = $subs_id;
             return DV::depends(1,['new_role'=>$inputs],'Failed to role');
         }    
    }

    //Test whether a given @role can access to use a specified Application Module
    protected static function can_access_module($module_id,$role_id){
      $x = DB::table('um_role_modules')->where('role_id',$role_id)->where('module_id',$module_id)->take(1)->exists();
      return $x;  //false/true
    }

    function getComboItems_role($user_class,$ss=null){
      //$branch_id = Sanitizer::sanitize($ss->branch_id);
      $str_user_class ='1=1';
      if(!empty($user_class)) $str_user_class ='r.user_class =\''.$user_class.'\'';
      return DB::table('um_roles as r')->whereRaw($str_user_class)->selectRaw('r.name, r.id ')->orderByRaw('`name` ASC')->get();
    }

    function canAccessModule($module_id, $role_id = null){
      $role_id = $role_id ?? $this->id;
      return self::can_access_module($module_id,$role_id);
    }

    function delete($id = null){
      $role_id = $id ?? $this->id;
      $c_user = AuthService::user();
      //if(!$c_user) return  null;
      $subs_id = $c_user->subs_id;
      $id = hex2bin($id);  
      DB::table(self::$table)->where('subs_id',hex2bin($subs_id))->where('id',$role_id)->delete();
      return DV::depends(1);
    }
    
    static function getUserDetails($id,$ss){
      $c_user = AuthService::user();
      if(!$c_user) return  null;
      $subs_id = $c_user->subs_id;
      $current_page = isset($d->current_page) ? $d->current_page : 1;
      $search_value = isset($d->search_value) ? $d->search_value : null;
      $per_page = isset($d->per_page) ? $d->per_page : 10;
      $skip_rows = ($current_page - 1) * $per_page;
      if (!is_numeric($current_page)) $current_page = 1;

      $query = DB::table('um_roles AS r')
      ->selectRaw('r.id, r.`name`,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.role_id = r.id) AS user_count')
      ->where('r.subs_id',hex2bin($subs_id))
      ->whereRaw($str_search);

      $count_query = clone $query;
      $count = $count_query->count('r.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      return $rows;
    }

    static function list($arr,$ss){
      $ss = $ss ? $ss : AuthService::user();
      $subs_id = $ss->subs_id;
      $d = (object)$arr;
      $search_value = isset($d->search_value)? $d->search_value: null;
      $str_search = '7=7';
      if($search_value){
        $search_value = escape_like_str($search_value);
        $str_search = '(r.name LIKE \'%'.$search_value.'%\')';
      }
      $col_create_date = DBX::query_user_info('r' ,'created_at',true,'updated_at');
      $rows = DB::table('um_roles AS r')
      ->selectRaw("r.id, r.`name`,$col_create_date,r.create_user,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.role_id = r.id) AS user_count")
      ->orderBy('r.name','ASC')
      ->whereRaw($str_search)
      ->get();
      if($search_value && !isset($rows[0])){
        $str_search = '(r.id IN (SELECT ur.role_id FROM um_user_roles AS ur INNER JOIN um_users as u ON ur.user_id = u.id WHERE u.login_name LIKE \'%'.$search_value.'%\' OR u.phone_number = \''.$search_value.'\' OR u.official_code = \''.$search_value.'\' OR u.full_name LIKE \'%'.$search_value.'%\') )';
        $rows = DB::table('um_roles AS r')
        ->selectRaw('\''.$search_value.'\' AS user_search_value,' ."r.id, r.`name`,$col_create_date,r.create_user,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.role_id = r.id) AS user_count")
        ->orderBy('r.id','DESC')
        ->where('r.subs_id',hex2bin($subs_id))
        ->whereRaw($str_search)
        ->get();
      }
      return $rows;
    }
    static function listForPrint($arr,$ss){
        $ss = $ss ? $ss : AuthService::user();
        $subs_id = $ss->subs_id;
        $d = (object)$arr;
        $search_value = isset($d->search_value)? $d->search_value: null;
        $str_search = '7=7';
        if($search_value){
          $search_value = escape_like_str($search_value);
          $str_search = '(r.name LIKE \'%'.$search_value.'%\')';
        }
        $col_create_date = DBX::query_user_info('r' ,'created_at',true,'updated_at');
        $rows = DB::table('um_roles AS r')
        ->selectRaw("r.id, r.`name`,$col_create_date,r.create_user,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.role_id = r.id) AS user_count")
        ->orderBy('r.name','ASC')
        ->whereRaw($str_search)
        ->get();
        if($search_value && !isset($rows[0])){
          $str_search = '(r.id IN (SELECT ur.role_id FROM um_user_roles AS ur INNER JOIN um_users as u ON ur.user_id = u.id WHERE u.login_name LIKE \'%'.$search_value.'%\' OR u.phone_number = \''.$search_value.'\' OR u.official_code = \''.$search_value.'\' OR u.full_name LIKE \'%'.$search_value.'%\') )';
          $rows = DB::table('um_roles AS r')
          ->selectRaw('\''.$search_value.'\' AS user_search_value,' ."r.id, r.`name`,$col_create_date,r.create_user,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.role_id = r.id) AS user_count")
          ->orderBy('r.id','DESC')
          ->where('r.subs_id',hex2bin($subs_id))
          ->whereRaw($str_search)
          ->get();
        }
      return DV::success(['data'=>(object)[
        'roles' => $rows,
        'company_profile' => Report::getCompanyInfo($ss)??''
    ]]);
  }

    static function details($role_id){
      $subs_id_col = ','.DBX::getHEX('r.subs_id','subs_id');
      $create_date_col = ','.DBX::query_user_info('r',null,true);
      return DB::table('um_roles as r')->where('id',$role_id)->selectRaw('id,name,user_class,group_id'.$create_date_col.$subs_id_col)->first();
    }
    static function getProps($role_id = null,$cols = 'id,name,user_class'){
      return DB::table('um_roles as r')->where('r.id',$role_id)->selectRaw($cols)->first();
    }
    function getDetails($id){
      $id = $id ?? $this->id;
      return self::details($id);
    }

    static function list_paginate($arr)
    {
      $c_user = AuthService::user();
      if(!$c_user) return  null;
      $subs_id = $c_user->subs_id;
      $d = (object)$arr;
      $current_page = isset($d->current_page) ? $d->current_page : 1;
      $search_value = isset($d->search_value) ? $d->search_value : null;
      $per_page = isset($d->per_page) ? $d->per_page : 10;
      $skip_rows = ($current_page - 1) * $per_page;
      if (!is_numeric($current_page)) $current_page = 1;

     
      $str_search = '2=2';
      if ($search_value) {
        $search_value = escape_like_str($search_value);
        $str_search = "(r.name ='$search_value' OR r.name LIKE '%" . $search_value . "%' OR r.user_class ='" . $search_value . "' )";
      }

      $query = DB::table('um_roles AS r')
      ->selectRaw('r.id, r.`name`,r.user_class, (SELECT COUNT(ur.user_id) FROM um_user_roles AS ur INNER JOIN um_users as u ON u.id = ur.user_id WHERE ur.role_id = r.id) AS user_count')
      ->where('r.subs_id',hex2bin($subs_id))
      ->whereRaw($str_search);

      $count_query = clone $query;
      $count = $count_query->count('r.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getMembers($arr,$role_id = null,$ss =null){
      $ss = $ss ?? $this->user_info;
      $role_id = $role_id ?? $this->id;
      $role_id = $role_id ?? -1;

      $c_user = AuthService::user();
      $d = (object)$arr;
      // $subs_id = $c_user->subs_id;
      // $bin_app_id = hex2bin($subs_id);
      $current_page = isset($d->current_page) ? $d->current_page : 1;
      $search_value = $d->search_value ?? null;
      $per_page = isset($d->per_page) ? $d->per_page : 10;
      $skip_rows = ($current_page - 1) * $per_page;
      if (!is_numeric($current_page)) $current_page = 1;

     
      $role_name = Utils::getRoleName($role_id);
      $search_value = escape_like_str($search_value);
      $str_search = '7=7';
      if($search_value){
          $str_search = '(u.login_name LIKE \'%'.$search_value.'%\' OR u.official_code LIKE \'%'.$search_value.'%\' OR u.phone_number = \''.$search_value.'\' OR u.full_name LIKE \'%'.$search_value.'%\')';
      }
      $col_user_info = DBX::query_user_info('u',null,true);
      $query = DB::table('um_user_roles AS ur')
      ->join('um_users AS u','u.id','=','ur.user_id')
      ->selectRaw('\''.$role_name.'\' as role_name,\''.$search_value.'\' AS search_value,u.id,u.login_name,u.full_name,u.official_code,u.official_id,u.phone_number,'.$col_user_info.', '.DBX::formatTime('u.last_login_date','last_login_date').', u.is_locked,u.status, u.create_user, u.email,u.lang,u.otp_code,u.user_class')
      // ->where('u.subs_id',$bin_app_id)
      ->where('ur.role_id',$role_id)
      ->whereRaw($str_search)->orderBy('u.id','DESC');
      
      $count_query = clone $query;
      $count = $count_query->count('u.id');
      $rows = $query->skip($skip_rows)->take($per_page)->get();
      foreach($rows as $row){
        $role = User::getPrimaryRole($row->id);
        if($role){
           $row->role_id = $role->id;
           $row->role_name = $role->name;
        } 
        $row->image_url = User::getPhoto($row->id,'id',$row->user_class);
      }
      return new LengthAwarePaginator($rows, $count, $per_page, $current_page);    
   }

   function getMemberForPrint($arr,$role_id = null,$ss =null){
    $ss = $ss ?? $this->user_info;
    $role_id = $role_id ?? $this->id;
    $role_id = $role_id ?? -1;

    $c_user = AuthService::user();
    $d = (object)$arr;
    // $subs_id = $c_user->subs_id;
    // $bin_app_id = hex2bin($subs_id);
    
    $search_value = $d->search_value ?? null;
   
    $role_name = Utils::getRoleName($role_id);
    $search_value = escape_like_str($search_value);
    $str_search = '7=7';
    if($search_value){
        $str_search = '(u.login_name LIKE \'%'.$search_value.'%\' OR u.official_code LIKE \'%'.$search_value.'%\' OR u.phone_number = \''.$search_value.'\' OR u.full_name LIKE \'%'.$search_value.'%\')';
    }
    $col_user_info = DBX::query_user_info('u',null,true);
    $query = DB::table('um_user_roles AS ur')
    ->join('um_users AS u','u.id','=','ur.user_id')
    ->selectRaw('\''.$role_name.'\' as role_name,\''.$search_value.'\' AS search_value,u.id,u.login_name,u.full_name,u.official_code,u.official_id,u.phone_number,'.$col_user_info.', '.DBX::formatTime('u.last_login_date','last_login_date').', u.is_locked,u.status, u.create_user, u.email,u.lang,u.otp_code,u.user_class')
    // ->where('u.subs_id',$bin_app_id)
    ->where('ur.role_id',$role_id)
    ->whereRaw($str_search)->orderBy('u.id','DESC');
    
    $count_query = clone $query;
    $count = $count_query->count('u.id');
    $rows = $query->get();
    foreach($rows as $row){
      $role = User::getPrimaryRole($row->id);
      if($role){
         $row->role_id = $role->id;
         $row->role_name = $role->name;
      } 
      $row->image_url = User::getPhoto($row->id,'id',$row->user_class);
    }
    return DV::success(['data'=>(object)[
      'users' => $rows,
      'company_profile' => Report::getCompanyInfo($ss)??''
    ]]);
 }

   function addMember($user_id, $role_id = null,$ss = null){
     return $this->addMembers($user_id,$role_id,$ss);
   }
   
   static function setUserDefaultBranch($ss,$subs_id,$user_id){
      $bin_subs_id = hex2bin($subs_id);
      $firstBranch = DB::table(DBX::$branch_table.' as b')->where('subs_id',$bin_subs_id)->selectRaw('id,name')->orderByRaw('id ASC')->first();
      if($firstBranch){
         $test_id = DB::table('um_user_branches as b')->where('b.id',$firstBranch->id)->where('b.user_id',$user_id)->whereNotNull('user_id')->value('id');
         $inputs = [
          'user_id'=>$user_id,
          'branch_id'=>$firstBranch->id,
          'is_default'=>1];
          $test_id = saveData($ss,'um_user_branches',['id'=>$test_id],$inputs,[],0,false);
      }
      return null;
   }

   static function existsBy($col,$value){
     return DB::table('um_roles')->where($col,$value)->selectRaw('id')->first();
   }
   function addMembers($user_ids,$role_id,$ss=null){
      $role_id = $role_id ?? $this->id;
      $ss = $ss ?? AuthService::user();
      if(!$ss) return DV::error('Authentication failed unexpectedly!');
      $subs_id = DBX::getHEX('subs_id','subs_id');
      $role = DB::table('um_roles')->where('id',$role_id)->selectRaw('id,'.$subs_id)->first();
      if(!$role) return DV::error('Role does not exists');
      if(!$user_ids) return DV::error('No user IDs given');
      $sts = explode('|',$user_ids);
      $success_count = 0 ;
      $user_count = 0;
      foreach($sts as $user_id){
        $res = self::addRoleMember_internal($ss,$role_id,$user_id);
        if($res->status_code ==200){
            self::setUserDefaultBranch($ss,$role->subs_id,$user_id);
            $user_count = $res->data['user_count'];
            $success_count++;
        } 
      }
      return DV::depends(1, ['role_id'=>$role_id, 'user_count'=>$user_count, 'success_count'=>$success_count], 'Failed to add role members to role '.$role_id);  
  }

  protected static function addRoleMember_internal($ss,$role_id,$user_id){
    //$subs_id = $uss->subs_id;
    $lang = $ss->lang;
    if(!isset($role_id) || empty($role_id)) return DV::error("Role ID is not valid",$lang);

    //Delete all roles for this user first => ensuring one user has only one role, for now
    $m_id = DB::table('um_user_roles')->where('user_id',$user_id)->value('id'); //  ->where('role_id',$role_id)
    $nowTime = getNowTime();
    $input = [
      'user_id'=>$user_id,
      'role_id'=>$role_id,
      'is_primary_role' => 1,
      'start_date'=>$nowTime,
   ];
     $m_id = saveData($ss,'um_user_roles', ['id'=>$m_id],$input,[],0,false); 
     $user_count = DB::table('um_user_roles AS ur')->where('ur.role_id',$role_id)->count('ur.user_id');
     return DV::depends($m_id,['role_id'=>$role_id,'user_count'=>$user_count],'Failed to add user to the given role');
 }
 
  static function getUserIdsByName($roleName){
    return DB::table('um_roles as r')->join('um_user_roles as ur','r.id','=','ur.role_id')->where('r.name', $roleName)->pluck('ur.user_id')->toArray();
  }

  //  /** $arr = [user_id,is_primary] */
  //  function addMember($arr,$id=null,$user = null){
  //      $role_id = $id ?? $this->id;
  //      $user = $user ?? AuthService::user();

  //      $v_rule = [
  //        'user_id'=>'1|number|exists=um_users.id',
  //        'is_primary_role'=>'1|choice|0,1|default=1'
  //      ];
  //     $res = validateObject($arr,$arr,true,[],$user->lang,false,null);
  //     if($res->error) return DV::error($res->error);
  //     $inputs = $res->values;
  //     $user_id = $inputs['user_id'];
  //     $row = DB::table('um_user_roles')->where('role_id',$role_id)->where('user_id',$user_id)->select('role_id')->first();
  //     if($row) return DV::error('This user membership already exists');
  //     $inputs['start_date'] = getNowTime();
  //     $new_id = saveData($user,'um_user_roles',['id'=>null],$inputs,[],0,false);
  //     return DV::depends($new_id,null,'Failed to create role membership'); 
  //  }
 
  function getAccessibleApps($role_id = null){
    $role_id = $role_id ?? $this->id;
    return self::getAccessibleApps_internal($role_id);
  }

  /** $app_id is optional or it can be NULL */
  function getRoleModules($app_id, $role_id = null,$ss = null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    if($app_id =='') $app_id = null;
    $str_app_id = DBX::getHEX('app.id','app_id');
    $access_mods = self::getAccessibleModules_internal($role_id,$app_id);
    $query = DB::table('um_app_modules as m')->join('um_applications as app','app.id','=','m.app_id')->selectRaw('m.id, CONCAT(m.name,\' (\',m.id,\')\') AS name ,m.id AS module_id, app.name AS app_name,'.$str_app_id)->orderByRaw('m.name ASC');
    if($app_id){
      $query->where('app.id',hex2bin($app_id));
    }else{
      //get list of all apps that this role can access to
      $access_apps = self::getAccessibleApps_sql($role_id);
      $query->whereIn('app.id',$access_apps);
    }
    $rows = $query->get();
    $mods = [];
    foreach($rows as &$row){
      $mod_id= $row->id;
       $founds = $access_mods->filter(function($x) use($mod_id,$role_id){
          return ($x->id == $mod_id && $x->role_id == $role_id);
       });
       $row->allowed = $founds->isEmpty()? 0:1;
       if(!isset($mods[$row->app_name])) $mods[$row->app_name] = [];
       $mods[$row->app_name]['name'] = $row->app_name;
       $mods[$row->app_name]['id'] = $row->app_id;
       if (!isset($mods[$row->app_name]['items'])) $mods[$row->app_name]['items']= [];
       $mods[$row->app_name]['items'][] = [
        'id'=>$row->id,
        'module_id'=>$row->module_id,
        'name'=>$row->name,
        //Unlike Report, each module has only one permission_action. That is "primary:1" for providing access to the module
        'action_string'=>'primary:'.$row->allowed,
        //'status_id' =>$row->allowed
      ];
    }
    return $mods;
  }
 
  function getAccessibleModules($app_id,$role_id = null, $ss =null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    return self::getAccessibleModules_internal($role_id,$app_id);
  }

  protected static function getAccessibleApps_internal($role_id){ 
     $cols = DBX::getHEX('app.id','id').', app.name,is_mobile_app, home_route, icon_file_name,'.DBX::formatTime('ra.start_date', 'start_time');
     return DB::table('um_role_apps as ra')->join('um_applications as app','app.id','=','ra.app_id')->where('ra.role_id',$role_id)->selectRaw($cols)->get();
  }

  protected static function getAccessibleApps_sql($role_id){ 
    $apps = DB::table('um_role_apps as ra')->join('um_applications as app','app.id','=','ra.app_id')->where('ra.role_id',$role_id)->pluck('app.id')->toArray();
    return $apps;
  }

  protected static function getPermissions_internal($role_id){ 
    $role_id = $role_id ?? 0;
    $cols = 'p.id,rp.role_id,rp.permission_id,'.DBX::formatTime('rp.start_date', 'start_time');
    return DB::table('um_role_permissions as rp')
    ->where('rp.action_name','primary')
    ->where('rp.role_id',$role_id)->where('p.category','<>','Report')->selectRaw($cols)
    ->join('um_permissions as p','p.id','=','rp.permission_id')->get();
 }

 protected static function getReports_internal($role_id){ 
  $role_id = $role_id ?? 0;
  $cols = 'p.id,rp.role_id,rp.permission_id,'.DBX::formatTime('rp.start_date', 'start_time');
  return DB::table('um_role_permissions as rp')
  ->join('um_permissions as p','p.id','=','rp.permission_id')
  ->where('rp.action_name','primary')
  ->where('rp.role_id',$role_id)->where('p.category','Report')->selectRaw($cols)->get();
 }

  /** return all avaialable permissions with status as 1 = allowed, and 0 = Denied */
  function getRolePermissions($arr, $role_id = null,$ss = null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    $d = (object)$arr;
    $app_id =   $d->app_id ?? null;
    if($app_id =='') $app_id = null;
    $search_value =  $d->search_value ?? null;
    $str_app_id = DBX::getHEX('app.id','app_id');
    $query = DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('um_app_modules as am','am.id','=','p.module_id')->where('p.category','<>','report')->selectRaw('p.id,am.name AS module_name, CONCAT(p.name,\' (\',p.id,\')\') AS permission_name,p.category,p.module_id,app.name AS app_name,'.$str_app_id)->orderByRaw('p.name ASC');
    
    if($search_value){
      $str_search = '(p.name LIKE \'%'.escape_like_str($search_value).'%\' )';
      if(is_numeric($search_value) && $search_value > 0 ) $str_search = '(p.id = '.$search_value.')';
      $query->whereRaw($str_search);
    }else{
      if($app_id){
        $query->where('app.id',hex2bin($app_id));
      }else{
        $access_apps = self::getAccessibleApps_sql($role_id);
        $query->whereIn('app.id',$access_apps);
      }
    }
    $rows = $query->get();
    $prns = [];
    foreach($rows as &$row){
      $prn_id= $row->id;
       if(!isset($prns[$row->module_name])) $prns[$row->module_name] = [];
       $prns[$row->module_name]['name'] = $row->module_name;
       $prns[$row->module_name]['id'] = $row->module_id;
       if (!isset($prns[$row->module_name]['items'])) $prns[$row->module_name]['items']= [];
 
       $prns[$row->module_name]['items'][] = [
        'id'=>$row->id,
        'module_id'=>$row->module_id, //$module_id is used for Export list of Permissions to json file only
        'name'=>$row->permission_name,
        'category'=>$row->category,
        'action_string'=>Permission::getActionsWithStatusAsString($prn_id,$role_id,null),
        //'status_id' =>$row->allowed
      ];
    }
    return $prns;
  }
 
  /** return all avaialable permissions with status as 1 = allowed, and 0 = Denied */
  function getRoleReports($arr, $role_id = null,$ss = null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    $d = (object)$arr;
    $app_id = $d->app_id ?? null;
    if($app_id =='') $app_id = null; 
    $search_value = $d->search_value ?? null;
    $str_app_id = DBX::getHEX('app.id','app_id');
    $query = DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('reports as rpt','rpt.permission_id','=','p.id')->where('p.category','Report')->selectRaw('p.id,CONCAT(p.name,\' (\',p.id,\')\') AS permission_name,p.category,p.module_id,app.name AS app_name,rpt.category AS report_group,'.$str_app_id)->orderByRaw('rpt.category ASC, p.name ASC');
    if($search_value){
      $search_value = escape_like_str($search_value);
      $str_search = '(p.name LIKE \'%'.$search_value.'%\' )';
      if( is_numeric($search_value) && $search_value > 0) $str_search = 'p.id = '.$search_value.'';
      $query->whereRaw($str_search);
    }else{
      if($app_id){
        $query->where('app.id',hex2bin($app_id));
      }else{
          //get list of all apps that this role can access to
          $access_apps = self::getAccessibleApps_sql($role_id);
          $query->whereIn('app.id',$access_apps);
      }
    }
    $rows = $query->get();
    $prns = [];
    foreach($rows as &$row){
      $prn_id= $row->id;
      $ac_string = Report::getActionsWithStatusAsString($prn_id,$role_id,null);
       $app_name = $row->app_name;
       $report_group = $row->report_group;
       if(!isset($prns[$app_name])) $prns[$app_name] = [];
       $prns[$app_name]['name'] = $app_name;
       $prns[$app_name]['id'] = $row->app_id;
       if (!isset($prns[$app_name]['items'])) $prns[$app_name]['items']= [];
       $prns[$app_name]['items'][] = [
        'id'=>$row->id,
        'module_id'=>$row->module_id,
        'name'=>$row->permission_name,
        'category'=>$row->category,
        'report_group'=>$report_group,
        'action_string'=> $ac_string,
        //'status_id' =>$row->allowed
      ];
    }
    return $prns;
  }
 
  /** return all avaialable reports group by report's category (or report_group) */
  function getRoleReportsByCategory($arr, $role_id = null,$ss = null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    $d = (object)$arr;
    $app_id =  $d->app_id ?? null;
    $search_value = $d->search_value ?? null;
    $col_app_id = DBX::getHEX('app.id','app_id');
    $access_prns = self::getReports_internal($role_id,$app_id);
    $query = DB::table('um_permissions as p')->join('um_applications as app','app.id','=','p.app_id')->join('reports as rpt','rpt.permission_id','=','p.id')->where('p.category','Report')->selectRaw('p.id,CONCAT(p.name,\' (\',p.id,\')\') AS permission_name,p.category,p.module_id,app.name AS app_name,rpt.print_permission, rpt.export_excel, rpt.export_pdf, rpt.export_csv,rpt.category AS report_group,'.$col_app_id)->orderByRaw('rpt.category ASC, p.name ASC');
   
    if($search_value){
      $str_search = '(p.name LIKE \'%'.escape_like_str($search_value).'%\' )';
      if( is_numeric($search_value) && $search_value > 0) $str_search = 'p.id = '.$search_value.'';
      $query->whereRaw($str_search);
    }else{
      if($app_id){
        $query->where('app.id',hex2bin($app_id));
      }else{
          //get list of all apps that this role can access to
          $access_apps = self::getAccessibleApps_sql($role_id);
          $query->whereIn('app.id',$access_apps);
      }
    }
    $rows = $query->get();
    $prns = [];
    foreach($rows as &$row){
      $prn_id= $row->id;
       $founds = $access_prns->filter(function($x) use($prn_id,$role_id){
          return ($x->id == $prn_id && $x->role_id ==$role_id);
       });
       $row->allowed = $founds->isEmpty()? 0:1;
       $report_group = $row->report_group;
       if(!isset($prns[$report_group])) $prns[$report_group] = [];
       $prns[$report_group]['name'] = $report_group;
       $prns[$report_group]['id'] =null;
       if (!isset($prns[$report_group]['items'])) $prns[$report_group]['items']= [];
       $prns[$report_group]['items'][] = [
        'id'=>$row->id,
        'module_id'=>$row->module_id,
        'name'=>$row->permission_name,
        'category'=>$row->category,
        'report_group'=>$report_group,
        'action_string'=> Report::getActionsWithStatusAsString($prn_id,$role_id,null),
        //'status_id' =>$row->allowed,
        // 'export_permission'=>$row->print_permission,
        // 'export_excel'=>$row->export_excel,
        // 'export_pdf'=>$row->export_pdf,
        // 'export_csv'=>$row->export_csv
      ];
    }
    return $prns;
  }
  
  /** return all apps, and show status as allowed or not */
  static function getAppList($arr, $ss = null){
    $d = (object)$arr;
        $subs_id = isset($d->subs_id)? $d->subs_id:null;
        $search_value = isset($d->search_value)? $d->search_value:null;
        $role_id = isset($d->role_id)? $d->role_id : 0;
        $str_search = $search_value ? ' app.name LIKE \'%'.escape_like_str($search_value).'%\'': '3=3';
        //$is_allowed = DBX::roleAccessApp($role_id,'app.id','allowed');
        //role_id is under a subscription
        $access_apps = DB::table('um_role_apps')->where('role_id',$role_id)->selectRaw('role_id,app_id')->get();
        $rows = DB::table('um_applications as app')->join('um_subs_apps as sa','sa.app_id','=','app.id')->where('sa.subs_id',hex2bin($subs_id))->whereRaw($str_search)->selectRaw( DBX::getHEX('app.id','id').', app.name,app.is_mobile_app')->get();
        foreach($rows as &$row){
            $bin_app_id = hex2bin($row->id);
           $founds  =  $access_apps->filter(function($x) use($bin_app_id,$role_id){
             return $x->app_id == $bin_app_id && $x->role_id == $role_id;
           });
           $allowed = $founds->isEmpty()? 0 : 1;
           $row->allowed = $allowed;
           $row->status_id = $allowed;  
        }
        return $rows;
  }

  function addApp($app_id, $role_id=null, $ss=null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    $bin_app_id = hex2bin($app_id);
    $inputs = [
       'role_id'=>$role_id,
       'app_id'=>$bin_app_id,
       'start_date'=>getNowTime()
     ];
     $role = self::getProps($role_id,'id,user_class,name');
     $app = Application::getBy('id',$app_id);
     if(!$app) return DV::error('App ID does not exist');
     if (!$role) return DV::error('Role ID does not exist');
     $a_user_class = $role->user_class;
     if ($a_user_class !== $app->user_class){
       return DV::error("user in '$a_user_class' cannot access to app '$app->name'");
     } 
     $item_id= DB::table('um_role_apps')->where('app_id',$bin_app_id)->where('role_id',$role_id)->value('id');
     $item_id = saveData($ss,'um_role_apps',['id'=>$item_id],$inputs,[],0,false);
     return DV::depends($item_id,[],"");
  }

  function removeApp($app_id, $role_id=null, $ss=null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    $bin_app_id = hex2bin($app_id);
    $x = DB::table('um_role_apps')->where('app_id',$bin_app_id)->where('role_id',$role_id)->delete();
    return DV::depends(1);
  }
 
  function addModule($module_action, $role_id=null, $ss=null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info; 
    $sts = explode('.',$module_action);
    $module_id = $sts[0] ?? null;
    if(!$module_id) return DV::error('No module ID provideð');
    $inputs = [
       'role_id'=>$role_id,
       'module_id'=>$module_id,
       'start_date'=>getNowTime()
     ];
     $item_id= DB::table('um_role_modules')->where('module_id',$module_id)->where('role_id',$role_id)->value('id');
     $item_id = saveData($ss,'um_role_modules',['id'=>$item_id],$inputs,[],0,false);
     return DV::depends($item_id,[],"");
  }

  function removeModule($module_id, $role_id=null, $ss=null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? $this->user_info;
    $x = DB::table('um_role_modules')->where('module_id',$module_id)->where('role_id',$role_id)->delete();
    return DV::depends(1);
  }
 
  protected static function getAccessibleModules_internal($role_id, $app_id = null)
  {
      $cols = DBX::getHEX('am.app_id', 'id') . ', am.id, rm.role_id, am.name, ' . DBX::formatTime('rm.start_date', 'start_time');
      
      $query = DB::table('um_role_modules as rm')
                  ->join('um_app_modules as am', 'am.id', '=', 'rm.module_id')
                  ->where('rm.role_id', $role_id)
                  ->selectRaw($cols);
      
      if ($app_id) {
          $query->where('am.app_id', hex2bin($app_id));
      }
      
      return $query->get();
  }
   
  protected static function removeAppsByRole($role_id){
     $apps = self::getAccessibleApps_internal($role_id);
     foreach($apps as $app){
        $rows= DB::table('um_permissions as prn')->where('app_id',hex2bin($app->id))->selectRaw('id,module_id')->get();
        $prns = [];
        $mods = [];
        foreach($rows as $row){
            if(!in_array($row->module_id,$mods)) $mods[] = $row->module_id;
            $prns[] = $row->id;
        }
        DB::table('um_user_permissions')->whereIn('permission_id',$prns)->where('role_id',$role_id)->where('access_type','role')->delete();
        DB::table('um_user_modules')->whereIn('module_id',$mods)->where('role_id',$role_id)->where('access_type','role')->delete();
        DB::table('um_user_apps')->where('app_id',hex2bin($app->id))->where('role_id',$role_id)->where('access_type','role')->delete();
        DB::table('um_role_apps')->where('app_id',hex2bin($app->id))->where('role_id',$role_id)->delete();
     }
     return DV::success();
  }

   function removeMembers($user_ids, $role_id = null, $ss = null)
   {
       $role_id = $role_id ?? $this->id;
       $ss = $ss ?? AuthService::user();    
       if(!$role_id) return DV::error('Role is not found');
       $ids = explode('|',$user_ids);
       foreach($ids as $user_id){
          self::removeRoleMember_internal($user_id,$role_id,$ss);
       } 
   }
    
   function removeMember($user_id, $role_id = null, $ss = null)
   {
       $role_id = $role_id ?? $this->id;
       $ss = $ss ?? AuthService::user();    
       return self::removeRoleMember_internal($user_id,$role_id,$ss);
   }

   static function removeRoleMember_internal($user_id, $role_id = null, $ss = null){    
      if(!$role_id) return DV::error('Role is not found');
      $x = DB::table('um_user_roles')->where('role_id', $role_id)->where('user_id', $user_id)->delete();
      if($x){
        //Remove App access,module access, permissions for all members of this role
        self::removeAppsByRole($role_id);
      }
      $row = DB::table('um_user_roles')->where('role_id', $role_id)->selectRaw("COUNT(user_id) AS user_count")->get()->first();
      $user_count = $row? $row->user_count : 0;
      return DV::depends(1,['user_count'=>$user_count,'role_id'=>$role_id]);  
   }

   function getPermissions($arr, $id = null, $ss = null){
      $role_id = $id ?? $this->id;
      $ss = $ss ?? AuthService::user();
      $rows = DB::table('um_role_permissions as rp')->join('um_permissions as prn','prn.id','=','rp.permission_id')->where('rp.role_id',$role_id)->selectRaw('prn.id, prn.name,prn.category')->get();
      foreach($rows as $row){
         $row->status_id =1;
         $row->status = 'Allowed';
      }
      return $rows;
   }

   function getReports($arr,$id= null, $ss = null){
        $role_id = $id ?? $this->id;
        $role_id = $role_id  ?? -1;
        $ss = $ss ?? AuthService::user();
        $d = (object)$arr;
        $app_id = isset($d->app_id)? $d->app_id:null;

        $search_value =isset($d->search_value) ? $d->search_value : null;
        $str_app = '1=1';
        $str_search = '2=2';
        if($search_value){
          $search_value = escape_like_str($search_value);
          if ($search_value > 0) $str_search = 'prn.id = '.$search_value;
          else $str_search = '(rpt.name LIKE \'%'.$search_value.'%\' OR prn.name LIKE \'%'.$search_value.'%\')';
        }else{
          if($app_id) $str_app = 'rc.app_id =\''.$app_id.'\'';
        }
        $cols = 'prn.id, prn.name AS permission_name,rpt.id as report_id, rpt.category_id,rc.name AS category, rpt.code as report_code, has_prn('.$role_id.',prn.id) AS status_id';
        $rows = DB::table('um_permissions as prn')->join('reports as rpt','rpt.permission_id','=','prn.id')->join('report_categories as rc','rc.id','=','rpt.category_id')->whereRaw($str_app)->whereRaw($str_search)->selectRaw($cols)->get();
        $data = [];
        foreach($rows as $row){
          if (!isset($data[$row->category])){
          $data[$row->category] = (object)[
            'id'=>$row->category_id,
            'name'=>$row->category,
            'items'=>[]
          ];
          }
          
          $data[$row->category]->items[] =(object)[
          'id'=>$row->id,
          'name'=>$row->permission_name,
          'report_code'=>$row->report_code,
          //'report_id'=>$row->report_id,
          'status_id'=>$row->status_id
          ];
          return $data;
        }
   }

   /** $prn can be "311.some-action-here". This usually used for report suchas "312.export_pdf" or "322.pdf" */
   function addPermission($prn, $role_id =null, $ss = null)
   {
      $role_id = $role_id ?? $this->id;
      $ss = $ss ?? AuthService::user();
      $auto_add_module_access = true;

       if(!$prn) return DV::error('Permission ID is empty or invalid');
       //$str_branch =$branch_id>0? "m.branch_id =$branch_id" :"1=1";
       if (empty($role_id)) return DV::error("role ID is not valid");
       $sts = explode('.',$prn);
       $prn_id = $sts[0] ?? null;
       $action_name = $sts[1] ?? 'primary';

       $module_id = null;
       $module_name = null;
       $row = DB::table('um_permissions as p')->join('um_app_modules as m', 'm.id', '=', 'p.module_id')->where('p.id', $prn_id)->selectRaw('p.module_id,p.app_id,m.name,p.category')->first();
       if ($row) {
         $module_id = $row->module_id;
         $module_name = $row->name;
         //$prn_cat = $row->category;
       } else return DV::error('Permission ID ?? does not exist::'.$prn_id); 
          
       $nowTime = getNowTime();
       if ($module_id) {
           if (!self::can_access_module($module_id,$role_id)) {
           if ($auto_add_module_access) {
                // $inputs = ['role_id' => $role_id, 'module_id' => $module_id, 'start_date' => getNowTime()];
                DB::table('um_role_modules')->insert([
                   'role_id' => $role_id,
                   'module_id' => $module_id,
                   'start_date'=> $nowTime,
                   'create_uid'=>$ss->user_id,
                   'create_user'=>$ss->full_name,
                    DBX::$created_at => $nowTime,
                   'update_uid'=>$ss->user_id,
                   'update_user'=>$ss->full_name,
                    DBX::$updated_at=>$nowTime
                ]);
             } else return DV::error("Need access to .name in order to use permission $prn_id");
           }
       } else {
          $test_id = DB::table('um_permissions')->where('id', $prn_id)->value('id');
          if (!$test_id) return DV::error('Permission Number ?? is not valid::'.$prn_id);
       }

       $id = DB::table('um_role_permissions')->where('role_id', $role_id)->where('permission_id', $prn_id)->where('action_name',$action_name)->value('id');
       $inputs = [
        'role_id' => $role_id,
         'permission_id' => $prn_id,
         'action_name'=>$action_name,
         'start_date' => $nowTime,
         DBX::$created_at=>$nowTime,
         'create_uid'=>$ss->user_id,
         'create_user'=>$ss->full_name,
         DBX::$updated_at=>$nowTime,
         'update_uid'=>$ss->user_id,
         'update_user'=>$ss->full_name
      ];
       $id = saveData($ss, 'um_role_permissions', ['id' => $id], $inputs, [], 0, false);
       if ($id > 0) {
       //Ensure that all users in the provided $role_id has this permission ($prn_id)
       $users = DB::table('um_user_roles as ur')->join('um_users as u','u.id','=','ur.user_id')->where('ur.role_id', $role_id)->select('ur.user_id')->get();
       foreach ($users as $user) {
           $test_id = DB::table('um_user_permissions')->where('user_id', $user->user_id)->where('permission_id', $prn_id)->value('id');
           if (!$test_id) {
           $inputs = ['user_id' => $user->user_id,'role_id' => $role_id, 'permission_id' => $prn_id,'action_name'=>$action_name, 'start_date' => getNowTime()];
           saveData($ss, 'um_user_permissions', ['id' => null], $inputs, [], 0, false);
           }
       }
       }
       return DV::depends(1,['role_id' => $role_id, 'prn_id' => $prn_id,'action_name'=>$action_name, 'module_id' => $module_id]);
  }

  static function hasPrimaryPermission($prn_id, $role_id){
    $row = DB::table('um_role_permissions')->where('permission_id',$prn_id)->where('action_name','primary')->select('permission_id')->first();
     return $row? true:false;
  }

  /** Add actionable right under each permission. Example: Permission to View Report, so some actions under this permission can be "Print","Export To PDF", "Export to Excel" */
 function addPermissionAction($prn_id,$action_name, $user_id = null, $ss = null){
   $ss = $ss ?? $this->user_info;
   $user_id = $user_id ?? $this->id;
   if(self::hasPrimaryPermission($prn_id,$user_id)){
     return DV::error('User needs to be granted with primary permission ?? ::'.$prn_id);
   }
   $nowTime = getNowTime();
   DB::table('um_role_permissions')->insert([
     'role_id'=>$role_id,
     'permission_id'=>$prn_id,
     'action_name'=>$action_name,
     'start_date'=>$nowTime,
     DBX::$created_at=>$nowTime,
     'create_uid'=>$ss->user_id,
     'create_user'=>$ss->full_name,
     DBX::$updated_at=>$nowTime,
     'update_uid'=>$ss->user_id,
     'update_user'=>$ss->full_name
   ]);
   return DV::depends(1);
 }

 function removePermissionAction($prn_id,$action_name, $user_id=null, $ss=null){
   $ss = $ss ?? $this->user_info;
   $user_id = $user_id ?? $this->id;
   DB::table('um_role_permissions')->where('permission_id',$prn_id)->where('role_id',$role_id)->where('action_name',$action_name)->delete();
   return DV::depends(1);
}

  /** 
   * addReport() adds a report as a permission to role, and ensure that all users in that roles have that permissions by inserting data into table "um_user_permissions" 
   * NOTE: that $prn can be "205.print" 
  */
  function addReport($prn, $role_id =null, $ss = null)
   {
      $role_id = $role_id ?? $this->id;
      $ss = $ss ?? AuthService::user();
      $auto_add_module_access = true;
 
       if(!$prn) return DV::error('I seems there is no report id or permission id provided');
       //$str_branch =$branch_id>0? "m.branch_id =$branch_id" :"1=1";
       if (empty($role_id)) return DV::error("Invalid role ID. The given role ID is empty");
         
       $sts = explode('.',$prn);
       $prn_id = $sts[0]?? null;
       $action_name = $sts[1] ?? 'primary';
        //For Report, the permission such as "302.view" must be translated to "302.primary". NOTE: that "primary" action is the very first action that user can do before accessing to other actions such as "print or export_pdf". For user friendly purpose, the "primary" is shown as "View" permision for report.   
       if(strtolower($action_name) === 'view') $action_name ='primary';
       $module_id = null;
       //$module_name = null;
       $row = DB::table('um_permissions as p')->join('um_app_modules as m', 'm.id', '=', 'p.module_id')->where('p.id', $prn_id)->where('p.category','Report')->selectRaw('p.module_id,p.app_id,m.name,p.category')->first();
       if ($row) {
         $module_id = $row->module_id;
         //$module_name = $row->name;
         //$prn_cat = $row->category;
       } else return DV::error('Report Permission ID does not exist'); 
          
       $nowTime = getNowTime();
       if ($module_id) {
           if (!self::can_access_module($module_id,$role_id)) {
           if ($auto_add_module_access) {
                // $inputs = ['role_id' => $role_id, 'module_id' => $module_id, 'start_date' => getNowTime()];
                DB::table('um_role_modules')->insert([
                   'role_id' => $role_id,
                   'module_id' => $module_id,
                   'start_date'=> $nowTime,
                   'create_uid'=>$ss->user_id,
                   'create_user'=>$ss->full_name,
                   DBX::$created_at=>$nowTime,
                   'update_uid'=>$ss->user_id,
                   'update_user'=>$ss->full_name,
                   DBX::$updated_at=>$nowTime
                ]);
             } else return DV::error("Need access to .name in order to use permission $prn_id");
           }
       } else {
          $test_id = DB::table('um_permissions')->where('id', $prn_id)->value('id');
          if (!$test_id) return DV::error('Permission Number ?? is not valid::'.$prn_id);
       }

       $id = DB::table('um_role_permissions')->where('role_id', $role_id)->where('permission_id', $prn_id)->where('action_name',$action_name)->value('id');
       $inputs = [
        'role_id' => $role_id, 
        'permission_id' => $prn_id,
        'action_name'=>$action_name, 
        'start_date' =>$nowTime,
        DBX::$created_at=>$nowTime,
        'create_uid'=>$ss->user_id,
        'create_user'=>$ss->full_name,
        DBX::$updated_at=>$nowTime,
        'update_uid'=>$ss->user_id,
        'update_user'=>$ss->full_name
      ];
       $id = saveData($ss, 'um_role_permissions', ['id' => $id], $inputs, [], 0, false);
       if ($id > 0) {
       //Ensure that all users in the provided $role_id has this permission ($prn_id)
       $users = DB::table('um_user_roles as ur')->join('um_users as u','u.id','=','ur.user_id')->where('ur.role_id', $role_id)->select('ur.user_id')->get();
       foreach ($users as $user) {
           $test_id = DB::table('um_user_permissions')->where('user_id', $user->user_id)->where('permission_id', $prn_id)->value('id');
           if (!$test_id) {
           $inputs = ['user_id' => $user->user_id,'role_id' => $role_id, 'permission_id' => $prn_id,'action_name'=>$action_name, 'start_date' => $nowTime];
           saveData($ss, 'um_user_permissions', ['id' => null], $inputs, [], 0, false);
           }
       }
       }
       return DV::depends(1,['role_id' => $role_id, 'prn_id' => $prn_id, 'action_name'=>$action_name, 'module_id' => $module_id]);
  }

  /**
   * $ids = '312.print|113.view|177.export_pdf|...'
  */
  function removePermission($ids, $role_id = null, $ss = null){
     $role_id = $role_id ?? $this->id;
     $ss = $ss ?? AuthService::user();
     /** $ids is a list of permission Ids separated by | **/
     $ids = $ids ?? ''; 
     if (empty($role_id)) return DV::error("role ID is empty or not valid");
     $ms = explode('|', $ids);
     foreach ($ms as $prn_action) {
         $sts = explode('.',$prn_action);
         $prn_id = $sts[0] ?? null;
         $action_name = strtolower($sts[1] ?? 'primary');
         if ($prn_id) {
          DB::table('um_user_permissions')->where('role_id',$role_id)->where('permission_id',$prn_id)->where('action_name',$action_name)->where('access_type','role')->delete();
          DB::table('um_role_permissions')->where('role_id',$role_id)->where('permission_id',$prn_id)->where('action_name',$action_name)->delete();
         }
     }
     return DV::depends(1);
  }

  /**
   * $ids = '12|11|17|...'
  */
  function removeReport($ids, $role_id = null, $ss = null){
    $role_id = $role_id ?? $this->id;
    $ss = $ss ?? AuthService::user();
    \Log::info($ids);
    if (empty($ids)) return DV::error("Report ID is empty or not valid");
    /** $ids is a list of permission Ids separated by | **/
    $ids = $ids ?? '';
    if (empty($role_id)) return DV::error("role ID is empty or not valid");
    $ms = explode('|', $ids);
    foreach ($ms as $report_action) {
        $sts = explode('.',$report_action);
        $prn_id = $sts[0] ?? null;
        $action_name = strtolower($sts[1] ?? 'primary');
        if ($action_name ==='view')  $action_name ='primary'; //NOTE: In database, report's View permission is known as "primary"
        \Log::info("sts: $prn_id | $action_name");
        if ($prn_id) {
          DB::table('um_user_permissions')->where('role_id',$role_id)->where('permission_id',$prn_id)->where('action_name',$action_name)->where('access_type','role')->delete();
          DB::table('um_role_permissions')->where('role_id',$role_id)->where('permission_id',$prn_id)->where('action_name',$action_name)->delete();
        }
    }
    return DV::depends(1);
 }

  static function getFormOptions($id,$ss){
    $role = null;
    if($id > 0) $role = self::details($id);
    return (object)[
      'user_classes'=> UMTSettings::options_user_class($ss),
      'role_groups'=> UMTSettings::options_role_group($ss),
      'role'=>$role
    ];
 }
}