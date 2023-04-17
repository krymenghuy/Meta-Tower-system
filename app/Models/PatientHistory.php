<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use DB;
use App\Models\DV;

class PatientHistory //extends Model
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

    function medicalHistory($id=null,$ss=null){
       $id = $id?$id:$this->getId();
       $ss =$ss?$ss:$this->getUserInfo();
       $branch_id = $ss->branch_id;
       $cols ="h.id,h.category,h.content";
       return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    function pe($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    function diagnosis($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    function labo_tests($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }
    function prescription($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }

     function services($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }
     function advice($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }
     function followups($id=null,$ss=null){
        $id = $id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }
}
