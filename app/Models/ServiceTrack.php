<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Invoice\InvoiceSettings;
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
    
    //$id is service_track_id that is optional or NULL. It can be used to update service_track as done by doctor or a nurse
    static function form_options($id,$ss){
       $branch_id = $ss->branch_id;
       $service_tracks = []; 
       if($id>0){
         $service_tracks = DB::table('services_performed as t')->where('id',$id)->where('t.branch_id',$branch_id)->selectRaw("t.id,t.service_id,t.service_plan_id,t.doctor_id,t.first_nurse_id,t.second_nurse_id,t.status_id,t.create_user,t.update_user,DATE_FORMAT(t.created_at,'%d %b %Y') as created_at, getEmpName(t.first_nurse_id) AS first_nurse_name, getEmpName(t.doctor_id) AS doctor_name");
       }
       $options_emp = DB::table('employees as e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->select(['e.id',DB::raw("concat(p.last_name,' ',p.first_name) as name")])->orderBy('name','ASC')->get();
       $customer_table = InvoiceSettings::$customer_table;
       return (object)[
        'options_service'=>DB::table('medical_services as s')->where('branch_id',$branch_id)->where('is_package',0)->select(['s.id','s.name as service_name'])->get(),
        'options_service_plan'=>DB::table('medical_services as p')->where('branch_id',$branch_id)->where('is_package',1)->select(['p.id','p.name as service_plan_name'])->get(),
        'options_nurse'=>$options_emp,
        'options_doctor'=>$options_emp,
        'options_client'=>DB::table($customer_table." as c")->join('persons as p','p.id','=','c.person_id')->where('c.branch_id',$branch_id)->select(['c.id',DB::raw("concat(p.last_name,' ',p.first_name) as client_name")])->orderBy('client_name','ASC')->get(),
        'service_track'=>isset($service_tracks[0])?$service_tracks[0]:null
       ];  
    }

    static function details($id,$ss){
        $rows = DB::table('services_performed as t')->where('id',$id)->where('t.branch_id',$branch_id)->selectRaw("t.id,t.service_id,t.service_plan_id,t.doctor_id,t.first_nurse_id,t.second_nurse_id,t.status_id,t.create_user,t.update_user,DATE_FORMAT(t.created_at,'%d %b %Y') as created_at, getEmpName(t.first_nurse_id) AS first_nurse_name, getEmpName(t.doctor_id) AS doctor_name");
        return isset($rows[0])?$rows[0]:null; 
    }
    
    function getDetails($id=null,$ss=null){
      $id = $id?$id:$this->getId();
      $ss = $ss?$ss:$this->getUserInfo();  
      return self::details($id,$ss);
    }
    
    function save($arr=[],$ss){
       $branch_id = $ss->branch_id;
       $customer_table = InvoiceSettings::$customer_table; 
       $v_rule = [
        'id'=>'0|number|identity=1',
        'date'=>'0|date',
        'client_id'=>"1|number|exists=$customer_table.id",
        'service_id'=>"1|number|exists=medical_services.id",
        "doctor_id"=>"0|number|exists=employees.id|text=Doctor ID is not valid",
        "first_nurse_id"=>"0|number|exists=employees.id|text=Nurse ID is not valid",
        "doctor_commission"=>"0|number",
        "first_nurse_commission"=>"0|number",
        "service_plan_id"=>"0|number|exists=medical_services.id|Service Plan ID is not valid",
        "invoice_number"=>"0|number|exists=invoices.ref_number|text=Invoice number not valid or does not exist"
       ];

       $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
       if($res->error) return DV::error($res->error);
       $id = $res->id;
       $create_case = true;
       if($id>0) $create_case = false;
       $inputs = $res->values;
       $inputs['service_date'] =getNowTime();
       $serviceInfo = self::serviceInfo($inputs['service_id']);
       if(!$serviceInfo) return DV::error("Service ID id not valid or does not exist");
       $inputs['price'] = $serviceInfo->selling_price;

       $client_id = $inputs['client_id'];
       $invoice_number = $inputs['invoice_number'];
       $service_plan_id = $inputs['service_plan_id'];
       if($service_plan_id > 0)
        {
            if(!self::client_has_plan($branch_id,$client_id,$service_plan_id)){
                return DV::error("This client does not seem to have subscribed to the provided Service Plan");
            }
        }else{
            $invoice = self::getInvoiceInfo($branch_id,$invoice_number,$client_id);
            if(!$invoice) return DV::error('Invoice Number is not valid or does not belong this customer');
        }
       
       $id = saveData($ss,"services_performed",$inputs,[],1);
       return DV::depends($id,['id'=>$id],"Something went wrong when saving Service Track");
    }

    static function getInvoiceInfo($branch_id,$invoice_number,$client_id){
        $rows = DB::table('invoices as v')->where('branch_id',$branch_id)->where('ref_number',$invoice_number)->where('v.customer_id',$client_id)->selectRaw("id")->take(1)->get();
        return isset($rows[0])? $rows[0]:null; 
    }

    static function client_has_plan($branch_id,$client_id,$service_plan_id){
      $rows = DB::table("plan_subscriptions as b")->where('service_plan_id',$service_plan_id)->where('b.branch_id',$branch_id)->where('client_id',$client_id)->select('id')->take(1)->get();
      return isset($rows[0]);  
    }

    static function serviceInfo($service_id){
        //For services, the price is "selling_price"
        $cols = ["i.id","i.name as item_name","i.description","i.sku","i.cost","i.price as selling_price","i.tax_rate as sales_tax_rate"]; 
        $rows = DB::table("medical_services as i")->where("i.id",$service_id)->select($cols)->take(1)->get();
        return isset($rows[0])?$rows[0]:null;    
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
