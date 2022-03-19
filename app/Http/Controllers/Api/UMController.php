<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UM;
use Session;
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
            if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
            else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
            return makeJsonResponse($r);
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
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r); 
}
  
function saveRole(Request $request){
  return makeJsonResponse($this->UMModel->saveRole($request));     
}  

 function role_exists(Request $request){
    $r = $this->UMModel->role_exists($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r); 
  } 

  function deleteRole(Request $request) {
    $r = $this->UMModel->deleteRole($request); 
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r); 
  }

  function addRoleMember(request $request){
    $r = $this->UMModel->addRoleMember($request); 
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function removeRoleMember(Request $request){
    $r = $this->UMModel->removeRoleMember($request);
     if($r =='#350') 
     return makeJsonResponse($r,350); // user not authenticated
   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function getUserRoles(Request $request){
    $r = $this->UMModel->getUserRoles($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function getRoleList(Request $request){
    $r = $this->UMModel->getRoleList($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function getRoleMembers(Request $request){
    $r = $this->UMModel->getRoleMembers($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function getRoleById(Request $request) {
    $r = $this->UMModel->getRoleById($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function getUserList(Request $request){
    $r = $this->UMModel->getUserList($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r); 
  }

  //returns extended details about a user given by user's class, and user's official_code. A user can be Staff, Student, Teacher, parent, or Guest etc  
  function getUserExtendedDetails(Request $request){
    $r = $this->UMModel->getUserExtendedDetails($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);  
  } 

  function saveUser(Request $request){
    $r = $this->UMModel->saveUser($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);

  } 
  //getUserInfo() returns "id, previlege_type, user_class,is_locked,status"
  function getUserInfo(Request $request){
      $r = $this->UMModel->getUserInfo($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }

  function deleteUser(Request $request){
    $r = $this->UMModel->deleteUser($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

  function setUserStatus(Request $request){
    $r = $this->UMModel->setUserStatus($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  } 
  
  function unlockUser(Request $request){
    $r = $this->UMModel->unlockUser($request->user_id);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  } 
  function setLockStatus(Request $request){
       $r = $this->UMModel->setLockStatus($request);
       if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
       else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
       return makeJsonResponse($r);
  }
  
  function user_exists(Request $request){
      $r = $this->UMModel->user_exists($request->name,$request->user_id); 
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  }
 
  //checkUser , validateUser, checkPassword, login, Signin
  /** verifyUser() check user login and pwd and then returns object $result = {status, error_message, user} **/
 function verifyUser(Request $request){
  $r = $this->UMModel->verifyUser($request);
  if($r =='#350') 
  return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  return makeJsonResponse($r);
 }

   //In case: user changes their own password
  function changePassword(Request $request){
     $r = $this->UMModel->changePassword($request);
     if($r =='#350') 
     return makeJsonResponse($r,350); // user not authenticated
     else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
     return makeJsonResponse($r);
  }

function setPassword(Request $request){
   $r = $this->UMModel->setPassword($request);
   if($r =='#350') 
   return makeJsonResponse($r,350); // user not authenticated
   else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
}

function changeLoginName(Request $request){
  $r = $this->UMModel->changeLoginName($request);
  if($r =='#350') 
  return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  return makeJsonResponse($r);
}

function createLoginSession(Request $request){
    $r = $this->UMModel->createLoginSession($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

function getComboItems_user(Request $request){
    $r = $this->UMModel->getComboItems_user($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

function getComboItems_role(Request $request){
    $r = $this->UMModel->getComboItems_role($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}
 function getComboItems_workloc(Request $request){
    $r = $this->UMModel->getComboItems_workloc($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
 }

 function getComboItems_module(Request $request){
    $r = $this->UMModel->getComboItems_module($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
 }

  function getAccessibleModules_current_user(Request $request){
    $r = $this->UMModel->getAccessibleModules_current_user($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
 } 

function getAccessibleModules(Request $request){
    $r = $this->UMModel->getAccessibleModules($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
} 

function addAccessibleModule(Request $request){
    $r = $this->UMModel->addAccessibleModule($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

function getPermissionsByRole(Request $request) {
    $r = $this->UMModel->getPermissionsByRole($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

function findPermissions(Request $request){
    $r = $this->UMModel->findPermissions($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

function addPermissionToRole(Request $request) {
    $r = $this->UMModel->addPermissionToRole($request);
    if($r =='#350') 
       return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);   
}

function removePermissionFromRole(Request $request){
    $r = $this->UMModel->removePermissionFromRole($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);   
}

function getPermissionsByLoginName(Request $request){
    $r = $this->UMModel->getPermissionsByLoginName($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);   
}

function getPermissionsByUserId(Request $request){
    $r = $this->UMModel->getPermissionsByUserId($request); 
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);  
}

function getPermissionsByRoleId(Request $request){
    $r = $this->UMModel->getPermissionsByRoleId($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);   
}

 function localizePermissions(Request $request){
    $r = $this->UMModel->localizePermissions($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}
 
function allowed(Request $request){
    $r = $this->UMModel->allowed($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
}

function removeAccessibleModule(Request $request) {
  $r = $this->UMModel->removeAccessibleModule($request);
  if($r =='#350') 
  return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  return makeJsonResponse($r);
} 
//Check if current user has access to a MODULE refered by module_code or ref_code
function accessibleModule(Request $request) {
    $r = $this->UMModel->accessibleModule($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
} 

function getComboItems_userclass(Request $request){
  $r = $this->UMModel->getComboItems_userclass($request);
  if($r =='#350') 
  return makeJsonResponse($r,350); // user not authenticated
  else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
  return makeJsonResponse($r);
}

  function logout(){
    Session::flush();
  }

}
