<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use Session;
use Sanitizer;
use DB;

class UMController extends Controller
{
    protected $UMModel;

    public function __construct()
    { 
        //UMModel (company_id,user_id,user_name)
        $this->UMModel = new UM();
    }

/* #Begin::adhoc methods => Adhoc methods are used to create Applications, Permissions, and module name etc. They are used only in Development time */
   function createApplication(Request $request){
       $app_name = $request->app_name;
       return makeJsonResponse($this->UMModel->createApplication($app_name));
   }   

    // static function createAppComponent($app_name){
    //     $app_id =$this->getGUID();
    //     DB::table('um_applications')->insert([
    //         'app_id'=>$app_id,
    //         'name'=>$app_name,
    //         'name_native'=>$app_name
    //     ]);  
    // } 

      function createPermission(Request $request){ 
            $r = $this->UMModel->createPermission($request);
            return JDV::result($r); 
        }

/*#End::adhoc methods (Adhoc static functions are used only in Development time) */
 
/*##### begin::InApp UserModel ##### */
/** send encrypted data (usually query_string data) to browser for putting in url (for normal Web report parameters) **/
function encryptData(Request $request){
  if(!Session::has('login_name') || !Session::get('login_name',null)) return makeJsonResponse(null);
  $m_str = $request->data;
  $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
  $m_str = $encrypter->encrypt($m_str,false); //FALSE => to avoid serialization issue in decryption
  return makeJsonResponse($m_str);
}

function getModuleList($user_id =0){
    $r = $this->UMModel->getModuleList($request);
    return JDV::result($r); 
}
  
function saveRole(Request $request){
  return makeJsonResponse($this->UMModel->saveRole($request));     
}  

 function role_exists(Request $request){
    $r = $this->UMModel->role_exists($request);
    return JDV::result($r); 
  } 

  function deleteRole(Request $request) {
    $r = $this->UMModel->deleteRole($request); 
    return JDV::result($r); 
  }

  function addRoleMember(request $request){
    $r = $this->UMModel->addRoleMember($request); 
    return JDV::result($r); 
  }

  function removeRoleMember(Request $request){
    $r = $this->UMModel->removeRoleMember($request);
    return JDV::result($r); 
  }
  function getUserRoles(Request $request){
    $r = $this->UMModel->getUserRoles($request);
    return JDV::result($r); 
  }

  function getRoleList(Request $request){
    $r = $this->UMModel->getRoleList($request);
    return JDV::result($r); 
  }

  function getRoleMembers(Request $request){
    $r = $this->UMModel->getRoleMembers($request);
    return JDV::result($r); 
  }

  function getRoleById(Request $request) {
    $r = $this->UMModel->getRoleById($request);
    return JDV::result($r); 
  }

  function getUserList(Request $request){
    $r = $this->UMModel->getUserList($request);
    return JDV::result($r); 
  }

  //returns extended details about a user given by user's class, and user's official_code. A user can be Staff, Student, Teacher, parent, or Guest etc  
  function getUserExtendedDetails(Request $request){
    $r = $this->UMModel->getUserExtendedDetails($request);
    return JDV::result($r); 
  } 

  function saveUser(Request $request){
    $r = $this->UMModel->saveUser($request);
    return JDV::result($r); 
  } 

  //getUserInfo() returns "id, previlege_type, user_class,is_locked,status"
  function getUserInfo(Request $request){
      $r = $this->UMModel->getUserInfo($request);
      return JDV::result($r); 
  }

  function deleteUser(Request $request){
    $r = $this->UMModel->deleteUser($request);
    return JDV::result($r); 
  }

  function setUserStatus(Request $request){
    $r = $this->UMModel->setUserStatus($request);
    return JDV::result($r); 
  } 
  
  function unlockUser(Request $request){
    $r = $this->UMModel->unlockUser($request->user_id);
    return JDV::result($r); 
  }

  function setLockStatus(Request $request){
       $r = $this->UMModel->setLockStatus($request);
       return JDV::result($r); 
  }
  
  function user_exists(Request $request){
      $r = $this->UMModel->user_exists($request->name,$request->user_id); 
     return JDV::result($r); 
  }
 
  //checkUser , validateUser, checkPassword, login, Signin
  /** verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
 function verifyUser(Request $request){
  $r = $this->UMModel->verifyUser($request);
  return JDV::result($r); 
 }

   //In case: user changes their own password
  function changePassword(Request $request){
     $r = $this->UMModel->changePassword($request);
     return JDV::result($r); 
  }

function setPassword(Request $request){
   $r = $this->UMModel->setPassword($request);
   return JDV::result($r); 
}

function changeLoginName(Request $request){
  $r = $this->UMModel->changeLoginName($request);
  return JDV::result($r); 
}

function createLoginSession(Request $request){
    $r = $this->UMModel->createLoginSession($request);
    return JDV::result($r); 
}

function getComboItems_user(Request $request){
    $r = $this->UMModel->getComboItems_user($request);
    return JDV::json($r); 
}

function getComboItems_role(Request $request){
    $r = $this->UMModel->getComboItems_role($request);
    return JDV::json($r); 
}
 function getComboItems_workloc(Request $request){
    $r = $this->UMModel->getComboItems_workloc($request);
    return JDV::json($r);
 }

 function getComboItems_module(Request $request){
    $r = $this->UMModel->getComboItems_module($request);
    return JDV::json($r); 
 }

  function getAccessibleModules_current_user(Request $request){
    $r = $this->UMModel->getAccessibleModules_current_user($request);
    return JDV::json($r); 
 } 

function getAccessibleModules(Request $request){
    $r = $this->UMModel->getAccessibleModules($request);
    return JDV::json($r); 
} 

function addAccessibleModule(Request $request){
    $r = $this->UMModel->addAccessibleModule($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return JDV::result($r);
}

function getPermissionsByRole(Request $request) {
    $r = $this->UMModel->getPermissionsByRole($request);
    return JDV::result($r); 
}

function findPermissions(Request $request){
    $r = $this->UMModel->findPermissions($request);
    return JDV::result($r); 
}

function addPermissionToRole(Request $request) {
    $r = $this->UMModel->addPermissionToRole($request);
    if($r->status_code==='OK') return JDV::success(["id"=>$r->id]);  
    else return JDV::error($r->error_message);  
}

function removePermissionFromRole(Request $request){
    $this->UMModel->removePermissionFromRole($request);
    return JDV::success();  
}
 
function getPersonDetails(Request $request){
  $r = $this->UMModel->getPersonDetails($request->search_value);
  return JDV::result($r);  
}

function getPermissions_cu(Request $request){
    $r = $this->UMModel->getPermissions_cu($request);
    return JDV::result($r);   
}

function getPermissionsByUserId(Request $request){
    $r = $this->UMModel->getPermissionsByUserId($request); 
    return JDV::result($r);  
}

function getPermissionsByRoleId(Request $request){
    $r = $this->UMModel->getPermissionsByRoleId($request);
    return JDV::result($r);   
}

//returns auth data for AuthManager.js. returns object {prns=[], modules=[]}
function getAuthData(Request $request){
  $r = $this->UMModel->getAuthData($request);
  return JDV::result($r);  
}

 function localizePermissions(Request $request){
    $r = $this->UMModel->localizePermissions($request);
    return JDV::result($r); 
}

function apiLogin(Request $request){
  //app_id of the LMS backend system
  $app_id = getAdminAppId(); //$request->app_id;
  $login_name = $request->login_name;
  $pwd = $request->password; 

  $result = $this->UMModel->verifyUser($app_id,$login_name,$pwd);
  // if($result->status ==='OK'){
  //     //$encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
  //     //$result->user->access_token = $encrypter->encrypt($result->user->access_token,false); //FALSE => to avoid serialization issue in decryption
  //     //$result->user->image_url = null; // PublicStorage::getProfilePhoto_url($result->user->branch_id, $result->user->user_class, $result->user->official_id); 
  //  }
  return $result;
}

 
function allowed(Request $request){
    $r = $this->UMModel->allowed($request);
    return JDV::result($r); 
}

function removeAccessibleModule(Request $request) {
  $r = $this->UMModel->removeAccessibleModule($request);
  return JDV::result($r); 
} 
//Check if current user has access to a MODULE refered by module_code or ref_code
function accessibleModule(Request $request) {
    $r = $this->UMModel->accessibleModule($request);
    return JDV::result($r); 
} 

  function getComboItems_userclass(Request $request){
    $r = $this->UMModel->getComboItems_userclass($request);
    return JDV::result($r); 
  }

  // function reloadCurrentLang(Request $req){
  //       return JDV::success(['langContents'=>Localization::getLangContents()]);
  // }

  function getLang(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        //$d = Sanitizer::sanitizeObject($req->all(),[]);
        $lang = $req->lang; // strtolower(getValue($d,'lang'));
        //if parameter @lang is NULL then use "lang" set in um_session table based on (app_id,user_id) if the user already logged in
        //if (empty($lang)) $lang = $ss->lang;
        if (!$lang) $lang = "km"; //if there is no preset lanague for the user then use "khmer" default lang
        $base_path = base_path();
        $langRoutes =[
          'en'=> $base_path."/storage/locales/en.json",
          'km'=> $base_path."/storage/locales/km.json",
          'kh'=> $base_path."/storage/locales/km.json"
        ];

      //if no valid file_path => use km language  
      $file_path = isset($langRoutes[$lang])? $langRoutes[$lang]:$base_path."/storage/locales/km.json";
      $data = readFileContent($file_path);
      return JDV::json($data);
  }

    function saveLang(Request $req){
              $ss = UM::getUserInfoByToken($req,-1);
              if($ss->status_code !=200) return $ss; //user not authenticated
              $branch_id = $ss->branch_id;
              $d = Sanitizer::sanitizeObject($req->all(),[]);
              $lang = $req->lang;

              //if parameter @lang is NULL then use "lang" set in um_session table based on (app_id,user_id) if the user already logged in
              //if (!$lang) $lang = $ss->lang;
              if (!$lang) $lang = "km"; //default langauge in case @lang is not supplied
              $app_id = getAdminAppId();

              DB::table('um_sessions')->where('app_id',$app_id)->where('user_id',$ss->user_id)->update([
              'lang'=>$lang
              ]);
              DB::table('um_users')->where('id',$ss->user_id)->update([
              'lang'=>$lang
              ]);

              $base_path =base_path();
              $langRoutes = [
                'en'=>$base_path.'/storage/locales/en.json',
                'km'=>$base_path.'/storage/locales/km.json',
                'kh'=>$base_path.'/storage/locales/km.json'
              ];

              $file_path = isset($langRoutes[$lang])?$langRoutes[$lang]:$base_path.'/storage/locales/km.json';
              $data = readFileContent($file_path);
              //Save the new langauge code to current session
              Session::put('lang',$lang);

              //Todo: In case of JWT token => then change user's token and send new JWT token to client again in order to update cookie
              //$new_token = UM::updateJWT(['lang'=>$lang]);
              return JDV::success(['lang_content'=>$data]);
    }

  function logout(){
    Session::flush();
  }

}
