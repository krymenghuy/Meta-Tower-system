<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Employee;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class EmployeeController extends Controller
{

    function saveEmployee(Request $req){
       $ss = AuthService::verifyAuth($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);

       $id = $req->employee_id?$req->employee_id:$req->id;
       $employee = new Employee($id,$ss);
       $res = $employee->save($req->all());
       return JDV::raw($res);
    }

    function saveProfilePhoto(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $id = $req->employee_id ?? $req->id;
        $photo = $req->photo?? $req->img;
        $res = Employee::saveProfilePicture($photo,null,$id,$ss);
        return JDV::raw($res);
     }

     function deleteProfilePhoto(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->employee_id ?? $req->id;
        $emp = new Employee($id,$ss);
        $res = $emp->deleteProfilePicture($id);
        return JDV::raw($res);
     }

     function getProfilePhoto(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->employee_id ?? $req->id;
        $img = Employee::profilePicture($id,$ss);
        return JDV::result($img);
     }

    function findEmployee(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $id = $req->employee_id?$req->employee_id:$req->id;
        $employee = new Employee($id,$ss);
        $data = $employee->find($req->all(),$ss);
        return JDV::result($data);
     }

    public function deleteEmployee(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->emp_id;
        $emp = new Employee($id,$ss);
        $res = $emp->delete($id,$ss);
        return JDV::raw($res);
    }

   function deleteSenderSpecial(Request $req){
      $ss = AuthService::verifyAuth($req,273);
      if ($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->employee_id;
      $employee = new Employee($id,$ss);
      $id = $req->id?$req->id:$req->employee_id;
      $res = $employee->deleteSpecial($id,$ss);
      return JDV::raw($res);
   }

   function deleteProfilePicture(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->employee_id;
      $employee = new Employee($id,$ss);
      $res = $employee->deleteProfilePicture();
      return JDV::raw($res);
   }

   function saveProfilePicture(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->employee_id;
      $photo = $req->photo;
      $employee = new Employee($id,$ss);
      $res = $employee->saveProfilePicture($photo,$req->file_type);
      return JDV::raw($res);
   }

   public function getDetails(Request $req)
   {
       $ss = AuthService::verifyAuth($req, -1);
       if ($ss->status_code !== 200) {
           return JDV::raw($ss);
       }
       $emp = new Employee();
       return JDV::result($emp->getDetails($req->id, $ss));

   }

   function updateSenderStatus(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
      $id = $req->id?$req->id:$req->employee_id;
      $employee = new Employee($id,$ss);
      $res = $employee->updateStatus($req->status_code,$id);
      return JDV::raw($res);
   }


   function getListPaginate(Request $req){
    $ss = AuthService::verifyAuth($req, -1);
    if ($ss->status_code !== 200) {
        return JDV::raw($ss);
    }
    $emp = new Employee();
    return JDV::result($emp->getListPaginate($req->all(), $ss));
   }

   public function getFormOptions(Request $req)
   {
       $ss = AuthService::verifyAuth($req, -1);
       if ($ss->status_code !== 200) {
           return JDV::raw($ss);
       }
       $emp = new Employee();
       return JDV::result($emp->getFormOptions($req->id,$ss));
   }
      public function getFormOptionPromotion(Request $req)
   {
       $ss = AuthService::verifyAuth($req, -1);
       if ($ss->status_code !== 200) {
           return JDV::raw($ss);
       }
       $emp = new Employee();
       return JDV::result($emp->getFormOptionPromotion($req->id,$ss));
   }

   public function setTerminateStatus(Request $req)
   {
       $ss = AuthService::verifyAuth($req, -1);
       if ($ss->status_code !== 200) {
           return JDV::raw($ss);
       }
       $id = $req->id ? $req->id : $req->id;
       $employee = new Employee($id, $ss);
       $res = $employee->setTerminateStatus($req->status_id, $id);
       return JDV::raw($res);
   }

   public function setResignStatus(Request $req)
   {
       $ss = AuthService::verifyAuth($req, -1);
       if ($ss->status_code !== 200) {
           return JDV::raw($ss);
       }

       $id = $req->emp_id ?? $req->id;
       $employee = new Employee($id, $ss);
       $res = $employee->setResignStatus($req->all(),$id,$ss,$req->status_id);
       return JDV::raw($res);
   }
   public function setRejoinStatus(Request $req)
   {
       $ss = AuthService::verifyAuth($req, -1);
       if ($ss->status_code !== 200) {
           return JDV::raw($ss);
       }
       $id = $req->id ? $req->id : $req->id;
       $employee = new Employee($id, $ss);
       $res = $employee->setRejoinStatus($req->all(),$id,$ss,$req->status_id);
       return JDV::raw($res);
   }
   public function promoteNonStaff(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id ?? $req->id;
    $employee = new Employee($id,$ss);
    $res = $employee->promoteNonStaff($req->emp_type_id,$id,$ss,$req->all());
    return JDV::raw($res);
   }

   public function promoteStaff(Request $req){
    $ss =AuthService::verifyAuth($req,-1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id = $req->id ?? $req->emp_id;
    $employee = new Employee($id,$ss);
    $res = $employee->promoteStaff($req->all(),$id,$ss);
    return JDV::raw($res);
   }
   public function getEmployeeList(Request $req){
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $emp = new Employee();
        return JDV::result($emp->getEmployeeList($req->all(), $ss));
   }

}

