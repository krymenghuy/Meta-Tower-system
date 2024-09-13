<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Employee;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class EmployeeController extends Controller
{
    protected $employeeModel;
    public function __construct(){
        $this->senderModel = new Employee();
    }

    function saveEmployee(Request $req){
       $ss = AuthService::verifyAuth($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $id = $req->employee_id?$req->employee_id:$req->id;
       $employee = new Employee($id,$ss);
       $res = $employee->save($req->all());
       return JDV::raw($res);
    }
    public function deleteEmployee(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->senderModel->delete($req->id, $ss));
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

       return JDV::result($this->senderModel->getDetails($req->id, $ss));

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
    return JDV::result($this->senderModel->getListPaginate($req->all(), $ss));
   }

   function getFormOptions(Request $req){
      $ss = AuthService::verifyAuth($req,-1);
      if ($ss->status_code !==200) return JDV::raw($ss);
      $id = $req->id?$req->id:$req->employee_id;
      $data = Employee::getFormOptions($id,$ss);
      return JDV::result($data);
   }
}
