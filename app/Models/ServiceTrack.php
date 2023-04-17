<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;
class ServiceTrack //extends Model
{
    //use HasFactory;

    protected $id = null;
    protected $userInfo = null;

    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function getUserInfo(){
        return $this->userInfo;
    }
    function getId(){
        return $this->id;
    }
    
    static function list($filter,$ss){
        $str_dates ="1=1";
        $str_search="1=1";
        $branch_id = $ss->branch_id;
        $cols ="s.id,s.doctor_id,s.first_nurse_id,s.second_nurse_id,s.patient_id,s.service_id,s.service_plan_id,s.created_at,s.create_user,s.create_uid,s.updated_at,s.update_user";
        return  DB::table('services_performed as s')->whereRaw($str_dates)->whereRaw($str_search)->where('branch_id',$branch_id)->selectRaw($cols)->get();
    }

    function getList($filter=[],$ss=null){
        $ss = $ss?$ss:$this->getUserInfo();
        return self::list($filter,$ss);
    }
}
