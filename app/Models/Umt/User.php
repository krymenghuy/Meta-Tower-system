<?php

namespace App\Models\Umt;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
//use App\Models\SMS;
use App\Models\PublicStorage;
//use App\Security\Sanitizer as SecuritySanitizer;
// use App\Security\Sanitizer as SecuritySanitizer;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use DB;
use App\Models\DBX;
use App\Models\Umt\UMTSettings;
use App\Services\Umt\AuthService;
use App\Models\Umt\Role;
use App\Security\Sanitizer;
use App\Models\DV;
use App\Models\SMS;
class User //extends Model
{
    //use HasFactory;
    protected $user_info = null, $id = null;
    function __construct($user_id =null, $user_info=null){
        $this->id = $user_id;
        $this->user_info = $user_info;     
    }

    static function getLinkedUser($id,$subs_id){
        if(!$subs_id) return (object)['error'=>'Invalid subs ID','user'=>null];
        if(!$id) return (object)['error'=>'Invalid User ID','user'=>null];
        $col_target_app = DBX::getHEX('l.target_app_id','app_id');
        $target_user = DB::table('um_linked_users AS l')->where('user_id',$id)->selectRaw('target_user_id AS id,'.$col_target_app)->first();
        if(!$target_user) return (object)['error'=>'It seems you dont have access to this application','user'=>null];
        $target_app = Application::details($target_user->app_id);
        if(!$target_app) return (object)['error'=>'Linked user found, but the specified app does not exist','user'=>null];

        $row = self::specialDetailsBy('id',$target_user->id);
        if(!$row) return (object)['error'=>'Linked User ID is not correct!','user'=>null];
        unset($row->hpwd);
        $sess =  UMTSession::setUserSession($target_app->id,$row);
        $default_branch_id = User::getDefaultBranchId($row->id,0);
                        //return object {access_token,user}
                        $row->user_id = $row->id;
                        $row->branch_id = $default_branch_id;
                        $row->branches = User::getBranches($row->id,5);
                        $row->apps = [$target_app];
                        $row->default_app =$target_app ;
                        // $row->mods = User::getAccessibleModules($row->id);
                        // $row->prns =  User::getPermissions($row->id);
                        $row->access_token = $sess->access_token;
                        //** $token_age = UMTSettings::$user_classes[strtolower($row->user_class)]['token_age'];
                        //** $refresh_token =UMTSession::createJWT(['id'=>$row->id,'lang'=>$row->lang,'login_name'=>$row->login_name,'user_class'=>$row->user_class,'official_id'=>$row->official_id,'official_code'=>$row->official_code,'full_name'=>$row->full_name,'email'=>$row->email,'phone_number'=>$row->phone_number],$token_age);
                        $isSuperAdmin = $target_app->id? (User::isAppAdmin($row->id,$target_app->id)? 1 : 0 ): 0;
                        $free_apps = UMTSettings::getFreeApps();
                        if (!in_array($target_app->id,$free_apps)){
                            $row->is_master_account = User::isMasterAccount($row->id) ? 1:0; 
                            $row->is_super_admin = $isSuperAdmin;
                        }else  $row->is_super_admin =1;
                        $row->image_url = User::getPhoto($row->id,'id',$row->user_class);
        return (object)['error'=>null,'user'=>$row];
    }

    /** return userData for mobileApp's api/profile-info(). This userData is needed when user start Mobile app or starts the mobile App */
    static function mobileUserData($ss, $createUserToken = false){
        $subs_id =$subs_id ?? getCurrentSubsId(true);
        $user_id = $ss->user_id ?? 0;
        $branch_id = $ss->branch_id ?? '';
        $row = self::specialDetailsBy('id',$user_id);
        if(!$row) return null;
        unset($row->hpwd);
        $sess = null;
        if($createUserToken) $sess =  UMTSession::setUserSession($user_id,$row);
        $default_branch_id = User::getDefaultBranchId($row->id,0);
                        //return object {access_token,user}
                        $row->user_id = $row->id;
                        $row->branch_id = $default_branch_id;
                        $row->branches = User::getBranches($row->id,0);
                        //$row->apps = [$target_app];
                        //$row->default_app =$target_app ;
                     
                        if($sess && $sess->status =='OK') $row->access_token = $sess->access_token;
                        //** $token_age = UMTSettings::$user_classes[strtolower($row->user_class)]['token_age'];
                        //** $refresh_token =UMTSession::createJWT(['id'=>$row->id,'lang'=>$row->lang,'login_name'=>$row->login_name,'user_class'=>$row->user_class,'official_id'=>$row->official_id,'official_code'=>$row->official_code,'full_name'=>$row->full_name,'email'=>$row->email,'phone_number'=>$row->phone_number],$token_age);
                        //$isSuperAdmin = $target_app->id? (User::isAppAdmin($row->id,$target_app->id)? 1 : 0 ): 0;
                        // $free_apps = UMTSettings::getFreeApps();
                        // if (!in_array($target_app->id,$free_apps)){
                        //     $row->is_master_account = User::isMasterAccount($row->id) ? 1:0; 
                        //     $row->is_super_admin = $isSuperAdmin;
                        // }else  $row->is_super_admin =1;
            $row->image_url = User::getPhoto($row->id,'id',$row->user_class);
            $lowerSubsId = strtolower($subs_id);
            $row->notif_topic_private= $lowerSubsId.'_'.$branch_id.'_'.topic_prefix($ss->user_class)."_private_".$user_id;
            $row->notif_topic_general=$lowerSubsId.'_'.$branch_id.'_'.topic_prefix($ss->user_class)."_general";
        return $row;
    }

    static function deleteLinkedUser($id,$ss){
      //$subs_id = $ss->subs_id ?? getCurrentSubsId(true);
      $x = DB::table('um_linked_users')->where('user_id',$id)->delete();
      return DV::depends(1);
    }

    /** It is possible to create one link*/
    static function createLinkedUser($arr,$id,$ss){
       $target_user_id = $arr['target_user_id'] ?? null;
       $target_app_id = $arr['target_app_id'] ?? null;
       $query = DB::table('um_linked_users')->where('user_id',$id);
       $test_id = $query->value('id'); 
       $inputs = [
         'user_id'=>$id,
         'target_user_id'=>$target_user_id,
         'target_app_id'=>hex2bin($target_app_id)
       ];
    //    return $inputs['target_app_id'];
       $test_id = saveData($ss,'um_linked_users',['id'=>$test_id],$inputs,[],0,false);
       return DV::depends($test_id);  
    }

    /** $status =1 means Allowed, $status = 0 means Not allowed or to eb removed */
    static function setBranch ($ss,$branch_id, $user_id, $status =1, $is_default =0){
        $is_default =$is_default ?? 0;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        if (!$status ||  $status === 0){
            DB::table('um_user_branches as ub')->where('ub.branch_id',$branch_id)->where('ub.user_id',$user_id)->delete();
            return DV::depends(1);
        }
        
        $query = DB::table('um_user_branches as ub')->join(DBX::$branch_table.' AS b','b.id','=','ub.branch_id')->where('b.subs_id',hex2bin($subs_id))->where('ub.branch_id',$branch_id)->where('ub.user_id',$user_id);
        $count = $query->count('user_id');
        if($is_default == null) $is_default = ($count == 0);
        /** remove all default branches for this user because we are going to set a new default branch */
        if ($is_default) DB::table('um_user_branches')->where('subs_id',hex2bin($subs_id))->where('user_id',$user_id)->update([
            'is_default'=>0
        ]);  
        $testId = DB::table('um_user_branches as ub')->where('ub.branch_id',$branch_id)->where('ub.user_id',$user_id)->where('is_default',$is_default)->value('id');
        $inputs = [
           'user_id'=>$user_id,
           'branch_id'=>$branch_id,
           'is_default'=>$is_default
        ];
        $testId = saveData($ss,'um_user_branches',['id'=>$testId],$inputs,[],0,false);
        return DV::depends($testId,null, 'Failed to set user branch');
   }
   
   
    //return a default branch for a user
    static function getDefaultBranchId($id, $cache_time_seconds = 0)
    {
        $fetchBranchId = function() use ($id) {
            return (int) DB::table('um_user_branches')
                ->where('user_id', $id)
                ->where('is_default', 1)
                ->value('branch_id') ?? 0;
        };
    
        if ($cache_time_seconds > 0) {
            return Cache::remember("user_{$id}_branch", $cache_time_seconds, $fetchBranchId);
        }
    
        return $fetchBranchId();
    }
     
    //return list of branches for a user
    static function getBranches($id, $cache_time_seconds = 0)
    {  
        if ($cache_time_seconds > 0) {
            return Cache::remember("user_{$id}_branch", $cache_time_seconds, function () use ($id) {
                return DB::table('um_user_branches As ub')->join(DBX::$branch_table.' as b','b.id','=','ub.branch_id')->where('ub.user_id', $id)->selectRaw('b.id,b.name')->get();
            });
        }
        return DB::table('um_user_branches as ub')->join(DBX::$branch_table.' as b','b.id','=','ub.branch_id')->where('ub.user_id', $id)->selectRaw('b.id,b.name')->get();
    }

    /**
     * Master account is the user account that subscribes the one or more subscription plans, so this account can access to all applications, and all modules, and have all permissions 
    */
    static function isMasterAccount($user_id){
        $users = Cache::get('users',null);
        if(!$users){
          $users = DB::table('um_users as u')->where('u.deleted',0)->selectRaw('u.id,u.login_name,u.is_locked,u.`status`,u.lang,u.user_class,u.is_master_account')->get();
          Cache::put('users',$users,30);
        }
        $rows = $users->filter(function($user) use($user_id){
          $is_master_account = isset($user->is_master_account)?$user->is_master_account:0;
          return $user_id == $user->id && $is_master_account == 1;
        });
        return count($rows)>0? true : false;
    }

    // static function getAppId($prn_id){
    //     $key ='appidsprns1127';
    //     $rows = Cache::get($key,null);
    //     if($rows ==null){
    //       $rows =  $rows = DB::table('um_permissions as prn')->join('um_app_modules as m','m.id','=','prn.module_id')->selectRaw( DBX::getHEX('m.app_id','app_id').', prn.id as permission_id')->get();
    //       Cache::put($key,$rows,60*30); 
    //     }
    //     $rows->filter(function($x) use($prn_id){
    //       return $x->permission_id == $prn_id;
    //     });
    //     if(isset($rows[0])) return  $rows->first()->app_id;
    //     else return null; 
    // }
   
    static function saveLang($lang,$user_id){
        DB::table('um_sessions')->where('user_id', $user_id)->update([
            'lang' => $lang
          ]);
          DB::table('um_users')->where('id', $user_id)->update([
            'lang' => $lang
          ]);
    }

    static function isAppAdmin($user_id,$app_id = null){
        if(!$app_id) return false;
        $app_id = hex2bin($app_id);
        $row = DB::table('um_app_admins as adm')->join('um_users as u','u.id','=','adm.user_id')->where('u.deleted',0)->where('u.id',$user_id)->where('adm.app_id',$app_id)->selectRaw('u.id')->take(1)->first();
        return $row? true : false;
    }

    static function getPrimaryRole($user_id){
       return DB::table('um_user_roles as ur')->join('um_roles as r','r.id','=','ur.role_id')->where('ur.user_id',$user_id)->where('ur.is_primary_role',1)->selectRaw('r.id,r.name')->take(1)->first();
    }
    static function getProps($user_id = null,$cols = 'id,login_name,user_class,full_name,official_id'){
       return DB::table('um_users as u')->where('u.id',$user_id)->selectRaw($cols)->first();
    }
    
    static function getAccountInfo($id,$byCol ='official_id',$user_class = null){
        $id = Sanitizer::sanitize($id);
        $str_where = $byCol ==='official_id'? 'u.official_id =\''.$id.'\'': 'u.id ='.$id;
        $str_user_class = '2=2';
        if($user_class) $str_user_class = 'u.user_class =\''.$user_class.'\'';
        $row = DB::table('um_users as u')->whereRaw($str_where)->whereRaw($str_user_class)->selectRaw('u.id,u.official_id,u.login_name,full_name,u.`status`, u.is_locked')->first();
        if($row){
          if($row->is_locked ==1) $row->status ='locked';
        }
        return $row;
    }

    /** get user_id based on the given $login_name or official_id ONLY */
    static function getUserId($user_class,$col_name,$check_value){
        if(!in_array($col_name,['official_id','login_name'])) return null;
        if(!UMTSettings::correctUserClass($user_class)) return null;
        return DB::table('um_users as u')->where('u.'.$col_name,$check_value)->where('u.user_class',$user_class)->value('id');
    }

    static function updateByOfficialId($official_id,$inputs=[]){
        return DB::table('um_users')->where('official_id',$official_id)->update($inputs);
    }

    static function updateProps($user_id,$inputs=[]){
        return DB::table('um_users')->where('id',$user_id)->update($inputs);
    }
    
    /** Given one user ID, check if he or she is super admin in one of accessible appd */
    static function isAppAdminOne($user_id){
      return false;
    }

    function delete($id){
        $current_user = AuthService::user();
        $id = $id ?? $this->id;
        if(!$id) return DV::error('User ID is empty');
        if($id ==   $current_user->id) return DV::error('Cannot delete yourself');
        //For one Application or one system, => There is one in-app Admin user denoted by his "previlege_type =Admin "
        //This Admin user cannot be delete, and he can create other in-app users if needed (Depending on permissions as well)
        if(self::isMasterAccount($id,null)) return DV::error('Cannot delete master account');
      
        DB::table('um_user_apps')->where('user_id',$id)->delete();
        DB::table('um_user_roles')->where('user_id',$id)->delete();
        DB::table('um_user_modules')->where('user_id',$id)->delete();
        DB::table('um_user_permissions')->where('user_id',$id)->delete();
        DB::table('um_user_branches')->where('user_id',$id)->delete();
        DB::table('um_users')->where('id',$id)->delete();
        return DV::depends(1);
    }

    static function deletePhoto($user_id,$user_class){
        $key = strtolower($user_class);
        $p = isset(UMTSettings::$profile_tables[$key])? UMTSettings::$profile_tables[$key]:null;
        if(!$p) return null;
        $p_table = $p['table'];
       // $subs_id_col = DBX::getHEX('u.subs_id','subs_id');
        $user = DB::table('um_users')->where('id',$user_id)->selectRaw('id,user_class,official_id,photo_file_name')->take(1)->first();
        if(!$user) return null;
        if($p_table ==='um_users'){
          $file_name = $user->photo_file_name;
          if($file_name) PublicStorage::delete($user->branch_id,$user_class,'image',$file_name);
        }else{
          $pk_field = $p['key_field'];
          $photo_field = $p['photo_field'];
          $file_name = DB::table($p_table)->where($pk_field,$user->official_id)->take(1)->value($photo_field);
          if($file_name) PublicStorage::delete($user->branch_id,$user_class,'image',$file_name);
        }
        return true;
      }
    
    static function getPropsBy($by_cols= [],$selec_cols=''){
        $q = DB::table('um_users')->selectRaw($selec_cols);
        foreach($by_cols as $key=>$value){
            $q->where($key,$value);
        }
        return $q->first();
    }

 static function geDefaultPhoto($ss = null){
    return  base_url('assets/images/default/').'default-user.png';
 }

 function profilePicture($id){
    $id = $id ?? $this->id;
    return self::getPhoto($id,'id');
 }

 function photo($id){
    $id = $id ?? $this->id;
    return self::getPhoto($id,'id');
 }

 /** $byCol = id,login_name, official_id */
/** $byCol = id,login_name, official_id */
 static function getPhoto($value, $byCol = 'id', $user_class = null){
    $user = null;
    //$branch_id = User::getDefaultBranchId($value,15);
    $col_subs_id = DBX::getHEX('subs_id','subs_id');
    if($byCol ==='id'){
        $user = DB::table('um_users as u')->where('u.id',$value)->selectRaw($col_subs_id.',id,user_class,official_id,photo_file_name')->first(); 
    } else if ($byCol ==='login_name'){
        $user = DB::table('um_users as u')->where('u.login_name',$value)->selectRaw($col_subs_id.',id,user_class,official_id,photo_file_name')->first(); 
    } else if ($byCol ==='official_id'){
        $user = DB::table('um_users as u')->where('u.official_id',$value)->where('user_class',$user_class)->selectRaw($col_subs_id.',id,user_class,official_id,photo_file_name')->first(); 
    }
    if(!$user) return self::geDefaultPhoto();
    //profile photo is not specific to branch_id
    $ss = (object)['subs_id'=>$user->subs_id, 'branch_id',null];
    //$user_class = strtolower($user->user_class);
    $key = strtolower($user->user_class);
    $p =  UMTSettings::$profile_tables[$key] ?? null;
    if(!$p) return self::geDefaultPhoto();
    $p_table = $p['table'];

    if($p_table ==='um_users'){
        $file_name = $user->photo_file_name;
        $url = PublicStorage::getUrl($ss,strtolower($user_class),'image').$file_name;
        return validateUrl($url,self::geDefaultPhoto());
    }else if($p_table){
      //$official_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('official_id');
      if(!$user->official_id){
        Log::error('Failed to retrieve photo file for user id '.$user->id.' (user_class : '.$user->user_class.') because his or her official ID is missing. The default photo is used');
        return self::geDefaultPhoto();
      }
  
      $pk_field = $p['key_field'];
      $photo_field =  $p['photo_field'] ?? 'photo_file_name';
      $file_name = DB::table($p_table)->where($pk_field,$user->official_id)->value($photo_field);
      if(!$file_name) return self::geDefaultPhoto();
      //NOTE: $key can be "merchant", "driver", "sales_agent"
      $url = PublicStorage::getUrl( ['subs_id'=>$user->subs_id,'dir'=>$key],'image').$file_name;
      return validateUrl($url,self::geDefaultPhoto());
     }
     return self::geDefaultPhoto($ss);
  }
  
     static function props($id,$cols = ''){
       return DB::table('um_users')->where('id',$id)->selectRaw($cols)->first();
     }

     static function user_exists($login_name,$user_id){
        $str_id = $user_id > 0 ? 'id <> '.$user_id : '1=1';
        $row = DB::table('um_users AS u')->whereRaw($str_id)->where('login_name',$login_name)->selectRaw('id,login_name,full_name')->first();
        return $row? true:false;
    }

     function changeLoginName($new_login_name,$id= null, $ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->user_info;
        if(!$id) return DV::error('User ID is empty or missing');
         //$login_name = Sanitizer::sanitize($login_name,['@','-','.']);
         $new_login_name = Sanitizer::sanitize($new_login_name,['@','-','.']);
         $user = self::props($id,'id,full_name,user_class,login_name,phone_number,official_id');
         if(!$user) return DV::error('User ID does not exist');

         if(empty($new_login_name)) return DV::error('Login name cannot be empty');
         if (strtolower($user->login_name) === strtolower($new_login_name)) return  DV::error('No change is made');
 
         if (self::user_exists($new_login_name,$id)) {
             return DV::error("Login named `$new_login_name` already in use");
         }
       
         $login_type = null;
         $user_class = strtolower($user->user_class);
         $uClassInfo = isset( UMTSettings::$user_classes[$user_class])? UMTSettings::$user_classes[$user_class]: null;
         if($uClassInfo){
             $login_type = isset($uClassInfo['login_type'])?$uClassInfo['login_type']:null;
         }
         if ($login_type === 'phone'){
            if ($user->phone_number != $new_login_name){
                return DV::error( "$new_login_name មិនមែនជាលេខទូរសព្ទ័របស់ $user->full_name ទេ!");
            }

            // $profile = $user::findProfile($id);
            // if($profile){
            //      if($profile->phone_number != $new_login_name){
            //         return DV::error(($new_login_name ?? 'This login name ').' is not the user\'s phone number');
            //      }
            // }
            DB::table('um_users')->where('id',$id)->update([
                'phone_number'=>$new_login_name
            ]);
            $ptableInfo = isset(UMTSettings::$profile_tables[$user_class])? UMTSettings::$profile_tables[$user_class]: Null;
            $p_table =  isset($ptableInfo['table'])?$ptableInfo['table']:null;
            if($p_table){
                DB::table($p_table)->where('id',$user->official_id)->update([
                    'phone_number'=>$new_login_name,
                    'update_user'=>$ss->full_name,
                    DBX::$updated_at=>getNowTime()
                ]);
            }
         }
         DB::table('um_users')->where('id',$id)->update(['login_name'=>$new_login_name,'update_user'=>$ss->full_name, DBX::$updated_at=>getNowTime()]); 
         return DV::success();
      }
      
         //user exists by colName: login_name or user_id
     static function existsBy($col_name,$val){
        if(!$val) return false;
        if($col_name ==='user_id') $col_name ='id';
        $where_sql = $col_name."='$val'";
        return DB::table("um_users")->whereRaw($where_sql)->select('id')->exists();
    }

   /** Admin User changes other user's password | setPassword() */
   static function setPassword($newPwd,$user_id){ 
        // return $user_id;
        if(!$newPwd) return DV::error('Password is required');
        $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        $row = DB::table('um_users as u')->where('u.id',$user_id)->selectRaw("u.id,u.hpwd")->first();
        if (!$row) return DV::error('user identity is not valid');
        // if (strtolower(session('user_name')) != strtolower($login_name)) {
        //       return "Failed to change password because there was problem identifying your identity";
        // }
        DB::table('um_users')->where('id',$user_id)->update(['hpwd'=>$new_password_hash]);
        return DV::depends(1);
   }

    function getAuthorizationReport($arr, $ss= null){
        $ss = $ss ?? $this->user_info;
        $d = (object)$arr;
        $user_id = $d->id ?? $this->id;
        $role_id = $d->role_id ?? null;
        //$d = (object)$arr;
        $applicationList =  self::getAccessibleApps($user_id); // self::applicationList($arr,$ss);
        $permissionList =  self::getUserPermissions($user_id,$role_id,$ss); ;  //self::permissionList($arr,$ss);
        
        $reportList = self::getUserReports($user_id); // self::reportList($arr,$ss);
        $module_list = self::getAccessibleModules($user_id);
        return (object)[
           'application_list'=>$applicationList,
           'module_list'=>$module_list,
           'permission_list'=>$permissionList,
           'report_list'=>$reportList
        ];
    }

    static function getUserPermissions($user_id,$role_id,$ss = null,$app_id=null,$module_id =null){
        $apps = collect([]);
        if(!$app_id)
        {
            $apps = self::getAccessibleApps($user_id);
            foreach($apps as &$app){
                $app->app_id = hex2bin($app->app_id);
            }
        }
        else $apps->add(hex2bin($app_id));
        $str_module = $module_id > 0 ? 'prn.module_id ='.$module_id: '1=1';
        $permissions = DB::table('um_users as u')
            ->join('um_user_permissions AS upr', 'upr.user_id', 'u.id')
            // ->join('um_role_permissions AS rp', 'rp.role_id', 'ur.role_id')
            ->join('um_permissions AS prn', 'prn.id', 'upr.permission_id')
            ->whereIn('prn.app_id', $apps->pluck('app_id'))
            ->where('u.deleted', 0)
            ->where('u.id', $user_id)
            ->where('prn.category','<>','report')
            ->whereRaw($str_module)
            ->selectRaw('prn.id AS permission_id, prn.name AS permission_name, prn.module_id,'.DBX::getHEX('prn.app_id','app_id'))
            ->get();
    
        // Eager load the related application details
        //$permissions->load('application');
        foreach($permissions as $permission){
            $permission->action_string = Report::getActionsWithStatusAsString($permission->permission_id,$role_id,null);
        }
        return $permissions;
    }

    // static function applicationList($arr, $ss = null){

    //     $d = (object)$arr;
    //     $role_id = isset($d->role_id)? $d->role_id : 0;
    //     // return $role_id;
    //     $rows = DB::table('um_applications as app')->join('um_role_apps as ra','ra.app_id','=','app.id')->where('ra.role_id',$role_id)
    //     ->selectRaw( DBX::getHEX('app.id','id').', app.name,app.is_mobile_app')->get();
    //     return $rows;
    // }

    // static function permissionList($arr, $ss= null){
    //     $d = (object)$arr;
    //     $role_id = isset($d->role_id)? $d->role_id : 0;
    //     $rows = DB::table('um_permissions as p')->join('um_app_modules as m','m.id','=','p.module_id')->join('um_role_permissions as rp','rp.permission_id','=','p.id')->where('rp.role_id',$role_id)
    //     ->selectRaw('p.id, p.name,m.id as module_id, m.name AS module_name')->get();
    //     return $rows;
    // }

    // static function reportList($arr, $ss= null){
    //     $d = (object)$arr;
    //     $apps = User::getAccessibleApps($d->user_id);
    //     $apps_id =[];
    //     foreach($apps as $app){
    //         $apps_id[] = hex2bin($app->app_id);
    //     }
    //     if(!isset($apps_id[0])){
    //         return [];
    //     }

    //     $rows = DB::table('reports as r')->whereIn('app_id',$apps_id)
    //     ->selectRaw( 'r.id, r.name, r.module_id ,r.category')->get();
    //     return $rows;
    // }

     //In case: user changes their own password
     function changePassword($oldPwd, $newPwd, $id = null, $ss = null){
        $lang = $ss->lang;
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->user_info;

        $user = self::props($id,'id,login_name,user_class,hpwd' );
        if(!$user) return DV::error('User Identity does not exist');   
        $login_name = $user->login_name;
        //if login_name is not provided then try to change if current user tries to change his own password
        //if(!$login_name) $login_name = $ss->login_name;
        $new_password_hash = PASSWORD_HASH($newPwd,PASSWORD_DEFAULT);
        $hpwd = $user->hpwd;
        // if (strtolower(session('user_name')) != strtolower($login_name)) {
        //       return "Failed to change password because there was problem identifying your identity";
        // }
        if (password_verify($oldPwd,$hpwd)){
            DB::table('um_users')->where('login_name',$login_name)->update(['hpwd'=>$new_password_hash]);
            return DV::depends(1);
        } else return DV::error('Old password is not correct!');
    }

    static function setStatus($status_code, $user_id,$updateProfile = true,$ss = null)
    {
      $subs_id = $ss->subs_id;
      $valid_statuses = ['active', 'inactive','lock','locked','unlock','unlocked'];
      if (strtolower($status_code) =='unlocked' || strtolower($status_code) =='unlock') $status_code ='active';
      if(self::isMasterAccount($user_id) && in_array(strtolower($status_code),['inactive','lock','locked'])) return DV::error('Cannot deactivate system admin user');
      if (!in_array(strtoLower($status_code), $valid_statuses)) {
        return DV::error('Status is not correct '.$status_code);
      }
      DB::table('um_users')->where('subs_id',hex2bin($subs_id))->where('id', $user_id)->update(['status' => $status_code,'is_locked'=> strtolower($status_code) =='active'?0:1]);
      if ($updateProfile){
        $user = DB::table('um_users AS u')->where('subs_id',hex2bin($subs_id))->where('id', $user_id)->selectRaw('u.user_class,u.official_id')->first();
        if($user){
          $p = UMTSettings::$profile_tables[strtolower($user->user_class)];
          /** Update status as "Ative |Inactive" in table "driver", "sender" */
          $p_table = $p['table'];
          if($p_table !=='um_users'){
            DB::table($p_table)->where('id',$user->official_id)->where('subs_id',hex2bin($subs_id))->update([
              'status_code'=>$status_code
            ]);
          }
        }
      }
      return DV::depends(1);
    }

    function updateUser($arr,$id =null, $ss =null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->user_info;
        if(!$id) return DV::error('User Identity is required');
        $v_rule = [
            'full_name'=>'1|string|1-250',
            'email'=>'0|email',
            'phone_number'=>'0|phone',
        ];
        $col_subs_id = DBX::getHex('u.subs_id', 'subs_id');
        $user = self::getProps($id,'id,user_class,official_id,'.$col_subs_id);
        if(!$user) return DV::error('User identity is not correct');
        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (Object)$inputs;
        $id = saveData($ss,'um_users',['id'=>$id],$inputs,[],1,0,false);
        if($id){
            $key = strtolower($user->user_class);
            $p_table = UMTSettings::$profile_tables[$key];
            if($p_table !='um_users'){
             try{
                DB::table($p_table)->where('id',$user->official_id)->update([
                    'name'=>$d->full_name,
                    'email'=>$d->email,
                    'phone_number'=>$d->phone_number
                  ]);   
             }catch(\Exception $e){
                 //possible error when the target table do not have fields like "name, email, phone_number"
             }
            }

        }
        return DV::depends($id);
    }

    function deleteProfilePicture($id, $ss){
        return $this->saveProfilePicture(null,$id,null,$id,$ss);
    }

    function saveProfilePicture($photo, $file_type =null, $id =null,$ss=null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->user_info;

        $is_image = isImage($photo);
        $deletePhoto = $id && (!$photo || $is_image);
        $col_subs_id = DBX::getHex('u.subs_id', 'subs_id');
        $user = self::getProps($id,'id,user_class,official_id,'.$col_subs_id);
        if(!$user) return DV::error('User identity is not correct');

        $key = strtolower($user->user_class);
        $p =  UMTSettings::$profile_tables[$key] ?? null;
        if(!$p){
            // error UMTSettings $profile_tables data not correct
        }

        $p_table = $p['table'];
        //$pk_field = $p['pk_field'];
        $photo_field = $p['photo_field'];
        $file_name = DB::table($p_table.' as t')->where('id',$id)->value($photo_field);
        if($deletePhoto && $file_name){
            PublicStorage::delete(['subs_id'=>$user->subs_id, 'dir'=>$key],'image',$file_name);
        }
        if($is_image){
            $pk_value = $p_table =='um_users'? $id : $user->official_id;
            $res = PublicStorage::saveImage(['subs_id'=>$user->subs_id, 'dir'=>$key],$file_type,$photo,null,['id'=>$pk_value,"$p_table.$photo_field"]);
            return DV::depends(1,['image_url'=>$res->image_url]);
        }
        return DV::depends(1);
    }

   /**CreateUser or UpdateUser() depending on $d->user_id;
       * @params $d = {login_name,password,email,full_name,phone_number,user_class,role_id,official_id}
   */
    function save($arr,$id = null,$ss=null){
        $ss = $ss ?? AuthService::user();
        $subs_id = $ss->subs_id;

        $str_user_classes = implode(',', array_keys(UMTSettings::$user_classes));
        $validate_rule =[
           'id'=>"0|identity=1",
           'login_name'=>'1|string|1-35|text=Login name is between 1 to 35 characters, and no spaces allowed',
           'password'=>'0|string|0-100',
           'email'=>'0|email',
           'user_class'=>'1|choice|'.$str_user_classes,
           'subs_id'=>'0|string',
           'role_id'=>'1|number|exists=um_roles.id|text=User role is missing',
           'official_code'=>'0|string|1-25',
           'official_id'=>'0|number',
           "full_name"=>"0|string",
           'previlege_type'=>'0|choice|standard|default=standard',
           //'work_location_id'=>'0|string',
           'lang'=>'0|choice|en,km|default=en',
           'status'=>'0|string|default=active',
           'photo' => '0|image',
           'phone_number' => '0|phone',
           //branch_id is used for merchant, driver, where they are based in
           'branch_id'=>'0|number|exists='.DBX::$branch_table.'.id'
        ];

        // $check_unique = ["$branch_id|um_users|login_name|id|text=login name or phone number is already in use by another user"];
        $img_char = ['+',':',',',';','=','/','\\','?'];
        $res = validateObject($arr,$validate_rule,true,['email'=>['.','@','-'],'login_name'=>['@','-','.','_'],'photo' => $img_char],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $role_id = $inputs['role_id'];
        $user_class = $inputs['user_class'] ?? null;
        $role = Role::getProps($role_id,'name,user_class');
        if(!$role) return DV::error('Role ID does not exist');
        if($role->user_class !== $user_class) return DV::error("In role '$role->name', the User Class is must be '$role->user_class'");
        $default_branch_id = $inputs['branch_id'];
        unset($inputs['branch_id']);
        $inputs['subs_id'] = hex2bin($subs_id);

        $user_id = $id ?? $res->id;
        if(!$default_branch_id && !$user_id) return DV::error('Please provide a default branch, where the user will be based in');
        $action = 'create';
        if($user_id) $action = 'update';
        if ($user_id > 0){
           if(!AuthService::allowed(112,$ss->user_id)) return  DV::error('You need permission number ?? to update user information::'.'112');
        }else{
            // return AuthService::allowed(100);
          if(!AuthService::allowed(100,$ss->user_id)) return  DV::error('You need permission number ?? to update user information::'.'100');
        }
        $official_id = null;
        $official_code = null;
        /** Ensure no space, no special characters in login_name */
        $login_name = Sanitizer::sanitize($inputs['login_name']);
        $login_name = preg_replace('/[^a-zA-Z0-9@.]/', '', $login_name);
        $inputs['login_name'] =$login_name;

        $user_class = strtolower($inputs['user_class']);
        if (!UMTSettings::correctUserClass($user_class)) return DV::error("User Type or User Class is not correct",$ss->lang);

        $inputs['phone_number'] = str_replace(' ','',$inputs['phone_number']);
        $p = UMTSettings::$profile_tables[$user_class];
        $p_table = $p['table'];
        $pk_field = $p['key_field'];
        $code_field = $p['code_field'];
        $photo_field = $p['photo_field'];
        if ($p_table !=='um_users'){
           /** Assuming here the $p_table has columns "id", and "code". Example, sender.id and sender.code */
           $official_id = $inputs['official_id'];
           $official_code = $inputs['official_code'];
           if(!$official_id){
             if($user_id> 0)
              $official_id = DB::table('um_users')->where('id',$user_id)->take(1)->value('official_id');  
             else 
              $official_id = DB::table($p_table)->where($code_field,$official_code)->take(1)->value($pk_field);  
          }
           $profileInfo = DB::table($p_table)->where($pk_field,$official_id)->select($pk_field,$code_field)->first();
           if (!$profileInfo) return DV::error($p_table.' ID does not exist. The given official ID is not valid');
           $official_id = $profileInfo->$pk_field;
           $official_code = $profileInfo->$code_field;
           $inputs['official_id'] = $official_id;
           $inputs['official_code'] = $official_code;
        }
 
        $image = $inputs['photo'];
        
        //$inputs['full_name'] = empty($inputs['full_name'])? $inputs['login_name']:null;
        if(empty($inputs['full_name'])) return DV::error("Full name is required");
        $user_class_info = UMTSettings::$user_classes[$user_class];  
        $loginVia = isset($user_class_info['login_type'])? $user_class_info['login_type']:null;
        if ($loginVia === 'phone'){
            if(!isset($inputs['phone_number'])) $inputs['phone_number'] = $inputs['login_name'];
        }

        if($user_id && (!$image || isImage($image))){
          self::deletePhoto($user_id,$user_class); 
        }
       $role_id = $inputs['role_id'];
       unset($inputs['role_id'],$inputs['photo']);
       $password = $inputs['password'];
       unset($inputs['password']);
       $hpwd = PASSWORD_HASH($password,PASSWORD_DEFAULT);
 
       if(!$user_id || $user_id ==0) {
         //todo: Check password strenth rule here
         if (!$password &&  $user_class_info['new_user_password_required'] == 1) return DV::error("Password is required");
         $inputs['hpwd'] = $hpwd;
       }

       //// $inputs['branch_id']=$branch_id;
       if ($user_id > 0){
         //in case of Update Login info
         unset($inputs['hpwd'],$inputs['status'],$inputs['is_locked'],$inputs['user_class'],$inputs['official_id'],$inputs['official_code']);
       }else{
         //In case of Create new login
         $inputs['is_locked'] =0;
         $inputs['status'] ='Active'; 
       } 
       
       $user_id = saveData($ss,"um_users",["id"=>$user_id],$inputs,[],0);
       if($user_id >0){
          $role = new Role($role_id);
          $role->addMember($user_id,$role_id,$ss);
          if($default_branch_id && $action ==='create') self::setBranch($ss,$default_branch_id,$user_id,1);
          $x = PublicStorage::saveImage($ss->branch_id,$user_class,null,$image,null,[]);
          if($x->status == 'OK'){     
              $primary_key = $p_table ==='um_users'? ['id'=>$user_id]: [$pk_field => ($official_id ?? -3)];
              saveData($ss,$p_table,$primary_key,[
                $photo_field => $x->file_name
              ],[],1);
          }
          return DV::success(['id'=>$user_id]);
       }else{
           return DV::error('Failed to '.$action.' user data');
       }
    }

    static function getUserInfo_quick($user_id, $cols)
    {
        if(!$user_id) return null;
        $key = 'userinfo_'.$user_id;
         $this_user = cache::get($key,null);
        if($this_user === null){
            $is_not_deleted = 'IFNULL(u.deleted,0)=0';
            $this_user = DB::table('um_users AS u')->whereRaw($is_not_deleted)->where('id', $user_id)->selectRaw($cols)->first();
            /** 60 x 5 = 300 => use 5 minutes cache for this user */
            Cache::put($key,$this_user,120);
        }
        return $this_user;
    }
 
    static function setRole($role_id,$user_id,$ss){
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        if (!$subs_id) return DV::error('Cannot assign user role because the subscription ID is invalid or missing');
        $q = DB::table('um_user_roles as ur')->join('um_roles as r','r.id','=','ur.role_id')->where('ur.user_id',$user_id)->where('r.subs_id',hex2bin($subs_id));
        $test_id = $q->value('ur.id');
        if (!$role_id){
          return DV::error('No role provided!');
        }
        $role = Role::getProps($role_id,'name,user_class');
        if (!$role) return DV::error('The provided role ID  is does not exist');
        if (!UMTSettings::correctUserClass($role->user_class)) return DV::error("Please ensure that role '$role->name' has a correct user class");
        $inputs = [
          'user_id'=>$user_id,
          'role_id'=>$role_id,
          'start_date'=>getNowTime()
        ];
        $test_id = saveData($ss,'um_user_roles',['id'=>$test_id],$inputs,[],0,false);
        if($test_id){
           DB::table('um_users')->where('id',$user_id)->update(['user_class'=>$role->user_class]);
        }
        $new_role = Role::details($role_id);
        return DV::depends(1,['role'=>$new_role]);
    }

    function getDetails($id =null,$ss = null){
        $ss = $ss ?? AuthService::user();
        $id = $id ?? $this->id;
        return self::details($id,$ss); 
    }

    function changeRoleUser($user_id ,$role_id,$ss = null){
        $ss = $ss ?? AuthService::user();
        $id = $id ?? $this->id;
        // DB::table('um_user_roles as ur')->join('um_roles as r','r.id','=','ur.role_id')->where('ur.user_id',$user_id)->where('ur.is_primary_role',1)->selectRaw('r.id,r.name')->take(1)->first();
        $d = DB::table('um_user_roles as ur')->where('ur.user_id',$user_id)->where('ur.is_primary_role',1)->update(['role_id'=>$role_id]);
        if($d)
        return DV::success(['user_id'=>$user_id,'role_id'=>$d]);
        else return DV::error('Can\'t change Role Master Account!');
    }

    function changeUserLoginName($user_id ,$login_name,$ss = null){
        $ss = $ss ?? AuthService::user();
        $id = $id ?? $this->id;
        // DB::table('um_user_roles as ur')->join('um_roles as r','r.id','=','ur.role_id')->where('ur.user_id',$user_id)->where('ur.is_primary_role',1)->selectRaw('r.id,r.name')->take(1)->first();
        $d = DB::table('um_users as u')->where('u.id',$user_id)->where('u.is_master_account',0)->update(['login_name'=>$login_name]);
        if($d)
        return DV::success(['user_id'=>$user_id,'Login Name'=>$login_name]);
        else return DV::error('Can\'t change Login Name Master Account!');
    }

    static function details($id,$ss=null){
        //$subs_id = $ss->subs_id; 
        $last_Login_date_col = DBX::formatTime('u.last_login_date','last_login_date');
        $selectCols = 'LOWER(u.user_class) AS user_class,u.login_name,u.phone_number,'.$last_Login_date_col.',u.full_name,u.official_id,u.official_code,\'\' AS role_id,u.id';
        $row = DB::table('um_users AS u')->where('u.id',$id)->selectRaw($selectCols)->first();
        if($row) {
          $role = self::getPrimaryRole($row->id);
          if($role){
            $row->role_id = $role->id;
            $row->role_name = $role->name;
          }else{
            $row->role_id = null;
            $row->role_name = null;
          }
          $row->image_url = self::getPhoto($id,'id',null);
        }
        return $row;
    }

    static function getDefaultAppId($login_name){
        $rows = DB::table('um_user_apps as ua')->join('um_applications as app','ua.app_id','=','app.id')->join('um_users as u','u.id','=','ua.user_id')->where('u.login_name',$login_name)->where('u.deleted',0)->selectRaw(DBX::getHEX('ua.app_id','app_id').',ua.is_default')->get();
        $cnt = $rows->count();
         if($cnt ===1) return $rows[0]->app_id;
         else if($cnt > 1){
            foreach($rows as $row){
                if($row->is_default ==1) return $row->app_id;
            }
         }
         return null;  
    }

    static function getDefaultApp($login_name){
        $rows = DB::table('um_user_apps as ua')->join('um_applications as app','ua.app_id','=','app.id')->join('um_users as u','u.id','=','ua.user_id')->where('u.login_name',$login_name)->where('u.deleted',0)->selectRaw( DBX::getHEX('ua.app_id','app_id'). ',app.name,app.is_modile_app,ua.is_default')->get();
        $cnt = $rows->count();
         if($cnt ===1) return $rows[0];
         else if($cnt > 1){
            foreach($rows as $row){
                if($row->is_default ==1) return $row;
            }
         }
         return null;
    }

    /**specialDetails() uses login_name to query user's details for login process in AuthService */
    static function specialDetails($login_name){
        $subs_id = DBX::getHEX('u.subs_id','subs_id');
        $subscriber_id = DBX::getHEX('s.customer_id','subscriber_id');
        $row = DB::table('um_users AS u')->join('um_subscriptions as s','s.id','=','u.subs_id')->selectRaw( $subs_id.',' .$subscriber_id.',u.lang,u.id,u.user_class,u.official_id,u.official_code,u.full_name,u.hpwd,u.login_name, u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.login_name',$login_name)->first();
        if($row) $row->default_app_id = self::getDefaultAppId($login_name);
        return $row;
    }
 
    static function specialDetailsBy($col,$value){
        $subs_id = DBX::getHEX('u.subs_id','subs_id');
        $subscriber_id = DBX::getHEX('s.customer_id','subscriber_id');
        $row = DB::table('um_users AS u')->join('um_subscriptions as s','s.id','=','u.subs_id')->selectRaw( $subs_id.',' .$subscriber_id.',u.lang,u.id,u.user_class,u.official_id,u.official_code,u.full_name,u.hpwd,u.login_name,u.branch_id, u.full_name, u.status, u.is_locked,u.email,u.phone_number,u.otp_code')->where('u.'.$col, $value)->first();
        if($row) $row->default_app_id = self::getDefaultAppId($row->login_name);
        return $row;
    }

    static function getAccessibleApps($user_id, $user_class = null){
        if(!$user_id || $user_id < 0) return collect([]); // Return an empty collection if user_id is invalid
        $is_master_account = self::isMasterAccount($user_id);
        $str_user_class = $user_class ? "app.user_class ='$user_class'" : '2=2';
        if($is_master_account != 1) {
            $rows = DB::table('um_user_roles AS ur')
                ->join('um_role_apps AS ra', 'ur.role_id', '=', 'ra.role_id')
                ->join('um_users as u', 'u.id', '=', 'ur.user_id')
                ->join('um_applications as app', 'app.id', '=', 'ra.app_id')
                ->whereRaw($str_user_class)
                ->whereRaw('ur.role_id = ra.role_id')
                ->where('u.id', $user_id)
                ->selectRaw(DBX::getHEX('ra.app_id', 'app_id') . ', app.name AS app_name, app.is_mobile_app, app.icon_file_name, home_route,app.user_class')
                ->get();
    
            $apps = collect([]);
            foreach($rows as $row){
                if(!$apps->contains('app_id', $row->app_id)) {
                    $apps->push($row);
                }
            }
            return $apps;
        } else {
            return DB::table('um_applications AS app')
                ->selectRaw(DBX::getHEX('app.id', 'app_id') . ', app.name AS app_name, app.is_mobile_app, app.icon_file_name, home_route,app.user_class')
                ->get();
        }
    }
      
    /** return user's permissions. 
     * If @app_id is provided then it is used to query only permissions within that app_id
     * If @app_id is not provided, the accessible apps is automatically retrieved, and the function returns user's permissions across all apps that the user can access to.
     * */
    function getAuthorizationReport_v2($arr,$id=null,$ss = null){
        $user_id = $id ?? $this->id;
        $ss =$ss ?? $this->user_info;
        $d = (object) $arr;
        
        $role_id = $d->role_id ?? null;
        $user_id = $d->user_id ?? null;
        $app_id = $d->app_id ?? null;
        $module_id = $d->module_id ?? null;
        $role_id = $role_id ?? self::getPrimaryRole($user_id);
        \Log::info($role_id);
        if(!$role_id){
            \Log::error("Umt\user.php: getAuthorizationReport(\$arr,\$user_id,\$ss) tried to query Auth report data, but the user ID $user_id does not have primary role");
            return collect([]);
        }

        $apps = collect([]);
        if(!$app_id)
        {
            $apps = self::getAccessibleApps($user_id);
            foreach($apps as &$app){
                $app->app_id = hex2bin($app->app_id);
            }
        }
        else $apps->add(hex2bin($app_id));
        $str_module = $module_id > 0 ? 'prn.module_id ='.$module_id: '1=1';
        $permissions = DB::table('um_users as u')
            ->join('um_user_permissions AS upr', 'upr.user_id', 'u.id')
            // ->join('um_role_permissions AS rp', 'rp.role_id', 'ur.role_id')
            ->join('um_permissions AS prn', 'prn.id', 'upr.permission_id')
            ->whereIn('prn.app_id', $apps->pluck('app_id'))
            ->where('u.deleted', 0)
            // ->where('u.id', $user_id)
            ->where('prn.category','<>','report')
            ->whereRaw($str_module)
            ->selectRaw('prn.id AS permission_id, prn.name AS permission_name, prn.module_id,'.DBX::getHEX('prn.app_id','app_id'))
            ->get();
    
        // Eager load the related application details
        //$permissions->load('application');
        foreach($permissions as $permission){
            $action_string = Role::getActionsWithStatusAsString($permission->permission_id,$role_id,null);
            $view =  $action_string;
            $permission->action_string = $view;

        }
        return $permissions;
    }
    
    /** returns list of permission based on role membership */
    static function getPermissions($user_id,$app_id=null,$module_id =null){
        $apps = collect([]);
        if(!$app_id)
        {
            $apps = self::getAccessibleApps($user_id);
            foreach($apps as &$app){
                $app->app_id = hex2bin($app->app_id);
            }
        }
        else $apps->add(hex2bin($app_id));

        $str_module = $module_id > 0 ? 'prn.module_id ='.$module_id: '1=1';
        $permissions = DB::table('um_users as u')
            ->join('um_user_roles AS ur','u.id','=','ur.user_id')
            ->join('um_roles as r','r.id','=','ur.role_id')
            ->join('um_role_permissions AS rp', 'r.id','=', 'ur.role_id')
            ->join('um_permissions AS prn', 'prn.id', 'rp.permission_id')
            // ->whereIn('prn.app_id', $apps->pluck('app_id'))
            ->where('u.deleted', 0)
            ->where('u.id', $user_id)
            //// ->where('prn.category','<>','report')
            ->whereRaw($str_module)
            ->whereRaw('rp.role_id = ur.role_id')
            ->selectRaw('prn.id AS permission_id, prn.name AS permission_name, rp.action_name')
            ->get();
        // Eager load the related application details
        //$permissions->load('application');
        
        return $permissions;
    }
    
    // //returns reports that are assigned to user directly
    // static function getUserReports($user_id,$app_id=null,$module_id =null){
    //     $apps = collect([]);
    //     if(!$app_id)
    //     {
    //         $apps = self::getAccessibleApps($user_id);
    //         foreach($apps as &$app){
    //             $app->app_id = hex2bin($app->app_id);
    //         }
    //     }
    //     else $apps->add(hex2bin($app_id));
    //     $str_module = $module_id > 0 ? 'prn.module_id ='.$module_id: '1=1';
    //     $permissions = DB::table('um_users as u')
    //         ->join('um_user_permissions AS upr', 'upr.user_id', 'u.id')
    //         // ->join('um_role_permissions AS rp', 'rp.role_id', 'ur.role_id')
    //         ->join('um_permissions AS prn', 'prn.id', 'upr.permission_id')
    //         ->whereIn('prn.app_id', $apps->pluck('app_id'))
    //         ->where('u.deleted', 0)
    //         ->where('u.id', $user_id)
    //         ->where('prn.category','=','report')
    //         ->whereRaw($str_module)
    //         ->selectRaw('prn.id AS permission_id, prn.name AS permission_name, prn.module_id,'.DBX::getHEX('prn.app_id','app_id'))
    //         ->get();
     
    //     return $permissions;
    // }
    static function getUserReports($user_id,$app_id=null,$module_id =null){
        //$apps = collect([]);
        $bin_app_ids = [];
        if(!$app_id)
        {
            $apps = self::getAccessibleApps($user_id);
            foreach($apps as $app){
                $bin_app_ids[] = hex2bin($app->app_id);
                //$app->app_id = hex2bin($app->app_id);
            }
        }
        else $bin_app_ids[] = hex2bin($app_id);  //$apps->add(hex2bin($app_id));
        //\Log::info('app_ids: '.json_encode($bin_app_ids));
        $str_module = $module_id > 0 ? 'prn.module_id ='.$module_id: '1=1';
        $query = DB::table('um_users as u')
            ->join('um_user_roles AS ur', 'ur.user_id', 'u.id')
             ->join('um_role_permissions AS rp', 'rp.role_id', 'ur.role_id')
            ->join('um_permissions AS prn', 'rp.permission_id', 'prn.id')
            ->whereIn('prn.app_id', $bin_app_ids)
            ->where('u.deleted', 0)
            ->where('u.id', $user_id)
            ->where('prn.category','=','report')
            ->whereRaw('rp.role_id = ur.role_id')
            ->whereRaw($str_module)
            ->selectRaw('prn.id AS permission_id, prn.name AS permission_name, prn.module_id,'.DBX::getHEX('prn.app_id','app_id'));
       
        //       // Get the raw SQL query
        //             $sql = $query->toSql();
        //             $bindings = $query->getBindings();
        //             // Replace placeholders with actual values
        //             foreach ($bindings as $binding) {
        //                 $value = is_numeric($binding) ? $binding : "'$binding'";
        //                 $sql = preg_replace('/\?/', $value, $sql, 1);
        //             }
        //    \Log::info('SQL:'.$sql);
        return $query->get();
    }


        /** returns list of permissions (that are permissions to view reports) based on his role membership */
        static function getReports($user_id,$app_id=null,$module_id =null){
            //$apps = collect([]);
            $bin_app_ids = [];
            if(!$app_id)
            {
                $apps = self::getAccessibleApps($user_id);
                foreach($apps as $app){
                    $bin_app_ids[] = hex2bin($app->app_id);
                    //$app->app_id = hex2bin($app->app_id);
                }
            }
            else $bin_app_ids[] = hex2bin($app_id);
    
            $str_module = $module_id > 0 ? 'prn.module_id ='.$module_id: '1=1';
            $query = DB::table('um_users as u')
                ->join('um_user_roles AS ur','u.id','=','ur.user_id')
                ->join('um_roles as r','r.id','=','ur.role_id')
                ->join('um_role_permissions AS rp', 'r.id','=', 'ur.role_id')
                ->join('um_permissions AS prn', 'prn.id', 'rp.permission_id')
                ->whereIn('prn.app_id', $bin_app_ids)
                ->where('u.deleted', 0)
                ->where('u.id', $user_id)
                ->where('u.id', '>',0)
                ->where('prn.category','report')
                ->whereRaw('rp.role_id = ur.role_id')
                ->where('rp.action_name','primary')
                ->whereRaw($str_module)
                ->selectRaw('prn.id AS permission_id, prn.name AS permission_name');
            // Eager load the related application details
                //    // Get the raw SQL query
                //    $sql = $query->toSql();
                //    $bindings = $query->getBindings();
                //    // Replace placeholders with actual values
                //    foreach ($bindings as $binding) {
                //        $value = is_numeric($binding) ? $binding : "'$binding'";
                //        $sql = preg_replace('/\?/', $value, $sql, 1);
                //    }
                //    \Log::info('SQL:'.$sql);

            return $query->get();
    }

    static function getAccessibleModules($user_id,$app_id =null,$cols=' m.id,r.id AS role_id,hex(m.app_id) as app_id,m.name as module_name,\'Role\' AS access_type'){
        if(!$user_id) return [];
        $bin_app_id = $app_id ? hex2bin($app_id): null;
        $query = DB::table('um_users as u')->join('um_user_roles as ur','ur.user_id','=','u.id')
        ->join('um_roles as r','r.id','=','ur.role_id')
        ->join('um_role_modules AS rm','r.id','=','rm.role_id')
        ->join('um_app_modules as m','m.id','=','rm.module_id')
        ->whereRaw('rm.role_id = ur.role_id')
        ->where('u.deleted',0)->where('u.id',$user_id)->selectRaw($cols);
        if($bin_app_id) $query->where('m.app_id',$bin_app_id);
        return $query->get();
     }
 
    static function list_paginate($arr,$ss){
        $subs_id = $ss->subs_id;

        
        $d = (object)$arr;
        $role_id = isset($d->role_id) ? $d->role_id : null;
        $search_value = $d->search_value ??  null;
       
        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = '';
        if ($search_value) {
          $search_value = escape_like_str($search_value);
          if ($search_value) {
            $str_search = " AND u.official_code ='$search_value' OR u.login_name LIKE '%" . $search_value . "%' OR u.full_name LIKE '%" . $search_value . "%' OR u.phone_number = '$search_value'";
          }
        }
        $more_where = "1=1" . $str_search;
        //$get_primary_role = ',(SELECT r.`name` FROM um_user_roles AS ur INNER JOIN um_roles AS r ON r.id = ur.role_id WHERE user_id = u.id AND ur.is_primary_role =1 LIMIT 1) AS primary_role';
        $last_Login_date_col = DBX::formatTime('u.last_login_date','last_login_date');
        $subs_id_col = DBX::getHEX('u.subs_id','subs_id');
        $create_date_col = DBX::query_user_info('u','update_date',true,'start_date');
        // $query = DB::table('um_users as u')->join('um_user_roles as ur','ur.user_id','=','u.id')->whereRaw($str_role)->whereRaw($more_where)->selectRaw('u.id,u.official_id,u.official_code, u.full_name,u.login_name, LOWER(u.user_class) AS user_class,'.$subs_id_col.', u.previlege_type,'.$last_Login_date_col.', is_locked, `status`,u.phone_number,'.$create_date_col.',u.photo_file_name')

        $query = DB::table('um_users as u')->join('um_user_roles as ur','ur.user_id','=','u.id')->join('um_roles as r','r.id','=','ur.role_id')->selectRaw('u.id,u.official_id,u.official_code, u.full_name,u.login_name, LOWER(u.user_class) AS user_class,'.$subs_id_col.', u.previlege_type,'.$last_Login_date_col.', is_locked, `status`,u.phone_number,'.$create_date_col.',u.created_at as start_date,u.photo_file_name,r.id AS role_id,r.name AS role_name')
        ->where('u.subs_id', hex2bin($subs_id))->whereRaw($more_where)->orderBy('u.id','DESC');
        if ($role_id > 0 && !$search_value) $query->where('ur.role_id',$role_id); 

        $count_query = clone $query;
        $count = $count_query->count('u.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        
        foreach($rows as $row){
            $role = self::getPrimaryRole($row->id);
            if($role){
               $row->role_id = $role->id;
               $row->role_name = $role->name;
            }else
            $row->role_id = 1;
            $row->image_url = self::getPhoto($row->id,'id',$row->user_class);
            // $col_target_app = DBX::getHEX('lu.target_app_id','app_id');
            $linked_user = DB::table('um_linked_users AS lu')->join('um_applications as app','app.id','=','lu.target_app_id')->join('um_users as u','u.id','=','lu.target_user_id')->where('lu.user_id',$row->id)->selectRaw('app.name as linked_app_name,u.full_name as linked_user_name')->first();
            if($linked_user){
                $row->linked_app_name = $linked_user->linked_app_name ?? null;
                $row->linked_user_name = $linked_user->linked_user_name ?? '';
            }
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    static function listAll($arr,$ss){
        $subs_id = $ss->subs_id;

        $str_user_class = "1=1";
        $d = (object)$arr;
        $user_class = isset($d->user_class) ? $d->user_class : null;
        $search_value = isset($d->search_value) ? $d->search_value : null;
        if ($user_class) $str_user_class = 'u.user_class =\'' . $user_class . '\'';
 
        $str_search = '';
        if ($search_value) {
          $search_value = escape_like_str($search_value);
          if ($search_value) {
            $str_search = " AND u.official_code ='$search_value' OR u.login_name LIKE '%" . $search_value . "%' OR u.full_name LIKE '%" . $search_value . "%' OR u.phone_number = '$search_value'";
          }
        }
        $more_where = "1=1" . $str_search;
        //$get_primary_role = ',(SELECT r.`name` FROM um_user_roles AS ur INNER JOIN um_roles AS r ON r.id = ur.role_id WHERE user_id = u.id AND ur.is_primary_role =1 LIMIT 1) AS primary_role';
        $last_Login_date_col = DBX::formatTime('u.last_login_date','last_login_date');
        $subs_id_col = DBX::getHEX('u.subs_id','subs_id');
        $create_date_col = DBX::query_user_info('u',null,true);
        $query = DB::table('um_users as u')->whereRaw($str_user_class)->whereRaw($more_where)->selectRaw('u.id,u.official_id,u.official_code, u.full_name,u.login_name, LOWER(u.user_class) AS user_class,'.$subs_id_col.', u.previlege_type,'.$last_Login_date_col.', is_locked, `status`,u.phone_number,'.$create_date_col.',u.photo_file_name')
        ->where('u.subs_id', hex2bin($subs_id))->orderBy('u.id','DESC');
         
        $rows = $query->get();
        foreach($rows as $row){
            $role = self::getPrimaryRole($row->id);
            if($role){
               $row->role_id = $role->id;
               $row->role_name = $role->name;
            } 
            $row->image_url = self::getPhoto($row->id,'id',$row->user_class);
        }
        return $rows;
    }

    /**
     * given email or phone_number, findProfile() will find the details of user profile , which also includes user_class.
     * This function is used when creating new Login Account. When the email or phone_number is input, this function is called to return profile details ( example, as phone_number may belong to Driver, merchant, or Sales Agent)
    */
    static function findProfile($phoneOrEmail, $ss =null){
       $str_find = '(phone_number = \''.$phoneOrEmail.'\' OR email = \''.$phoneOrEmail.'\')'; 
       $user_classes = UMTSettings::$user_classes;
       $tables = UMTSettings::$profile_tables;
       $new_login_name = '';
       foreach ($user_classes as $user_class => $uclassInfo){
           $lower = strtolower($user_class); 
           $tableInfo =  isset($tables[$lower])? $tables[$lower]: null;
           $login_type = isset($uclass['login_type'])?$uclass['login_type']:null; 
           if($tableInfo){
              $table = $tableInfo['table'];
              if($table && $table != 'um_users'){
                 $code_field = isset($tableInfo['code_field'])? $tableInfo['code_field'] : '';
                 $photo_field = isset($tableInfo['photo_field'])? $tableInfo['photo_field']: 'any_col_test1';
                 $sel_code_field = $code_field? $code_field.' AS official_code,':''; 
                 $sel_photo_field = $photo_field? $photo_field. ',' : ''; 
                 $row = DB::table($table)->where($str_find)->selectRaw('id,'.$sel_photo_field.$sel_code_field.'name AS full_name,email,phone_number')->first();
                 if ($row){
                     $row->image_url = null;
                     $file_name = isset($row->{$photo_field})? $row->{$photo_field}:null;
                     if($file_name){
                         $url = PublicStorage::getUrl(null,$lower,'image').$file_name;
                         $row->image_url = validateUrl($url,'');
                     }
                    if ($login_type =='email' || $login_type =='phone') $new_login_name = $phoneOrEmail; 
                    $row->login_name = $new_login_name;
                    return $row;
                 }
              }
           } 
       } 

       return  null;
    }

    static function deactivateMySelf($arr, $ss){
        $user_id =$ss->user_id;
        DB::table('um_users')->where('id',$user_id)->update(['status'=>'inactive','updated_at'=>getNowTime(),'update_uid'=>$user_id,'update_user'=>$ss->full_name]);
        return DV::success();
    }

    static function findProfileByOfficialCode($official_code,$user_class,$ss=null){
        $user_classes = UMTSettings::$user_classes;
        $new_login_name = '';
        $tables = UMTSettings::$profile_tables;
        $lower = strtolower($user_class); 
        $tableInfo = isset($tables[$lower])? $tables[$lower]: null;
        $uclassInfo = isset($user_classes[$lower]) ? $user_classes[$lower]:null;
        $login_type = $uclassInfo? (isset($uclassInfo['login_type'])? $uclassInfo['login_type'] : null) : null;
        if($tableInfo){
            $table = $tableInfo['table'];
            if($table && $table != 'um_users'){
              $code_field = isset($tableInfo['code_field'])? $tableInfo['code_field'] : '';
              $photo_field = isset($tableInfo['photo_field'])? $tableInfo['photo_field']: 'any_col_test1';
              $sel_code_field = $code_field? $code_field.' AS official_code,':''; 
              $sel_photo_field = $photo_field? $photo_field. ',' : ''; 
              $row = DB::table($table)->where($code_field,$official_code)->selectRaw('id,'.$sel_photo_field.$sel_code_field.'name AS full_name,email,phone_number')->first();
              if ($row){
                  $row->image_url = null;
                  $file_name = isset($row->{$photo_field})? $row->{$photo_field}:null;
                  if($file_name){
                      $url = PublicStorage::getUrl(null,$lower,'image').$file_name;
                      $row->image_url = validateUrl($url,'');
                  }
                  if($login_type =='phone') $new_login_name = $row->phone_number;
                  else if($login_type ==='email') $new_login_name = $row->email;
                  $row->login_name = $new_login_name;
                  return $row;
              }
            }
         }
 
        return  null;
     }
  
     static function newOTP($length=6)
     {
         return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
     }

     static function sendOTPCode_phone($arr,$ss=null){
        //$branch_id = Session::get('branch_id',1);
        $d = (object)$arr;
        $phone_number =  $d->login_name  ??  ($d->phone_number ?? null);
        $purpose = $d->purpose ?? "";
        if(!$purpose) return DV::error('Please specify the purpose such as forget_password or change_phone_number or register');
        if(!$phone_number) return DV::error('Phone number is not provided yet');
        $new_otp_code = self::newOTP();
        $message = SMS::getMessageTemplate($ss,$purpose,$new_otp_code);
        $res  = SMS::send($phone_number,$message);
        //if($res->status ==='OK'){
          $x = DB::table('um_users')->where('login_name',$phone_number)->update(['otp_code'=>$new_otp_code]);
          if(!$x) return DV::error("Login name $phone_number does not exist");
          return DV::depends(1,['otp_code'=>$new_otp_code]);
        //}
        //return DV::error("Failed to send OTP code");
    }

    static function getUserFormOptions($user_id, $ss){
        $user = null;
        if($user_id) $user = self::details($user_id,$ss);
        return (object)[
           'user'=>$user,
           'user_classes'=>UMTSettings::options_user_class($ss),
           'roles'=>UMTSettings::options_role($ss),
           'branches'=>UMTSettings::options_branch($ss)
        ];
    }

    static function getUserRoleFormOptions($user_id, $ss){
        $user = null;
        if($user_id) $user = self::details($user_id,$ss);
        return (object)[
           'user'=>$user,
           'roles'=>UMTSettings::options_role($ss),
        ];
    }

    static function getLinkUserFormOptions($user_id, $ss){
        $user = null;
        $subs_id = $ss->subs_id;
        if($user_id) $user = self::details($user_id,$ss);
        $target_user = DB::table('um_users as u')->where('u.subs_id',hex2bin($subs_id))->selectRaw('u.id,u.full_name as target_user')->get();
        
        return (object)[
           'apps'=>UMTSettings::options_web_app($ss,),
        //    'target_user'=>$target_user
        ];
    }

    // static function targetUserlistByApp($app_id, $ss)
    // {
    //     $branch_id = $ss->branch_id;
    //     $subs_id = $ss->subs_id;
    //     $user_class = DB::table('um_applications as app')->join('um_subs_apps as sa','sa.app_id','=','app.id')->where('sa.subs_id',hex2bin($subs_id))->where('app.is_mobile_app',0)->where('app.id',hex2bin($app_id))->value('user_class');
    //     // return $user_class;
    //     $target_user=null;
    //     if($user_class)
    //         $target_user = DB::table('um_users as u')->where('u.subs_id',hex2bin($subs_id))->where('u.user_class',$user_class)->selectRaw('u.id,u.full_name as target_user')->get();

    //     return $target_user;
    // }

}