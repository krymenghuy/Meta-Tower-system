<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Education;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Auth;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    protected $education = null;
    public function __construct(){
        $this->education = new Education();
    }
    public function save(Request $req){
        $ss = AuthService::verifyAuth($req,1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id ?? $req->edu_id;
        $edu = $this->education->save($req->all(),$id, $ss);
        return JDV::raw($edu);
    }

    public function ListAll(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
        $edu = $this->education->getListAll($req->all(),$ss);

         return JDV::result($edu);
    }

    public function getDetails(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        $edu = $this->education->details($req->id,$ss);

        return JDV::result($edu);

    }


    public function getFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $edu = $this->education->formOptions($req->id,$ss);
         return JDV::result($edu);
    }

    public function delete(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        $res = $this->education->delete($req->id,$ss);
        return JDV::raw($res);
    }
}
