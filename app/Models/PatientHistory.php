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

    static function medicalHistory($id,$ss){
       $branch_id = $ss->branch_id;
       $cols ="h.id,DATE_FORMAT(h.created_at,'%d %b %Y') as create_at,h.category,h.content,h.create_user";
       //NOTE: join tables => "tickets","patient_medical_history" on ticket_id
       return DB::table('patient_medical_history as h')->join('tickets as t','t.id','=','h.ticket_id')->where('t.client_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    static function pe($id,$ss){
        $branch_id = $ss->branch_id;
        $cols ="h.id,date_format(h.created_at,'%d %b %Y') AS date, h.category,h.content";
        return DB::table('patient_pe as h')->where('h.patient_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    static function diagnosis($id,$ss){
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content, DATE_FORMAT(h.created_at,'%d %b %Y') AS date";
        return DB::table('patient_diagnosis as h')->where('h.patient_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    static function laboTests($id,$ss){
        $branch_id = $ss->branch_id;
        $cols ="h.id,s.id as test_id,s.name as test_name,Date_format(h.created_at,'%d %b %Y') AS test_date, date_format(h.result_date,'%d %b %Y') as result_date, h.consultant_comments, h.remarks, h.labo_id,pn.name as labo_name, h.created_at,h.create_user";
        return DB::table('patient_labo_tests as h')->join('medical_services as s','s.id','=','h.test_id')->join('partners as pn','pn.id','=','h.labo_id')->where('h.patient_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    }

    // static function prescription($id=null,$ss=null){
    //     $id = $id?$id:$this->getId();
    //     $ss =$ss?$ss:$this->getUserInfo();
    //     $branch_id = $ss->branch_id;
    //     $cols ="h.id,h.category,h.content";
    //     return DB::table('patient_medical_history as h')->where('patient_id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
    //  }

     static function medications($id,$ss){
        $branch_id = $ss->branch_id;
        $cols ="h.id,i.name as item_name,h.qty,h.sku,h.duration_days, h.reason,h.usage,date_format(h.created_at,'%d %b %Y') AS created_at,h.create_user";
        return DB::table('patient_prescription_items as h')->join('inv_items as i','i.id','=','h.item_id')->where('h.patient_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }

     static function services($id,$ss){
        $branch_id = $ss->branch_id;
        $emps = Employee::listAll($branch_id);
        $cols ="h.id,s.id as service_id,s.name as service_name, h.remarks,h.qty,h.sku, h.doctor_id, h.first_nurse_id, '' AS doctor_name, '' AS first_nurse_name,h.create_user,DATE_FORMAT(h.created_at,'%d %b %Y') AS date";
        $rows = DB::table('patient_services as h')->join('medical_services as s','s.id','=','h.service_id')->where('h.patient_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get(); 
        foreach($rows as $row){
           $row->doctor_name = Employee::getById($row->doctor_id,$emps)->name;
           $row->first_nurse_name = Employee::getById($row->first_nurse_id,$emps)->name;
        }
        return $rows; 
    }

     static function advice($id,$ss){
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('patient_advice as h')->where('h.patient_id',$id)->where('h.branch_id',$branch_id)->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }

     function followups($id,$ss){;
        $branch_id = $ss->branch_id;
        $cols ="h.id,h.category,h.content";
        return DB::table('appointments as apt')->where('apt.client_id',$id)->where('apt.branch_id',$branch_id)->where('apt.schedule_type','followup')->selectRaw($cols)->orderBy('h.id','DESC')->get();
     }
}
