<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GeneralSettings;
use Illuminate\Http\Request;
//use App\Models\GeneralSettings;
//use App\Models\ContactChannel;
use App\Models\JDV;
use App\Models\UM;
//use Session;
//use App\Locales\LocaleManager;

use Illuminate\Support\Facades\DB;
use App\DB\SQLDB;

//use DB;
//use SQLDB;
//use Carbon\Carbon;

class GeneralSettingsController extends Controller
{
    // protected $settingModel;
    // public function __construct()
    // {
    //     $this->settingModel = new GeneralSettings();
    // }

    function getComboItems_channel(Request $req){
        $rows = DB::table('contact_channels as cc')->where('cc.branch_id',0)->selectRaw("cc.id,cc.name as channel_name")->get();
        return JDV::result($rows);
    }

    function getComboItems_service(Request $req){
      $rows = DB::table('medical_services as s')->selectRaw("s.id as value,s.name as text")->get();
      return JDV::result($rows);
  }

    function getProductData(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = DB::table('inv_items as i')->where('i.branch_id',$branch_id)->selectRaw("i.id as `value`,i.name as `text`")->get();
      $data = (object)[];
      $data->products = $rows;
      $data->usage_options = [
        ['value'=>"1x2","text"=>"1x2"],
        ['value'=>"1x3","text"=>"1x3"],
        ['value'=>"Apply","text"=>"Apply"],
        ['value'=>"Other instruction","text"=>"Other instruction"]
      ];
      return JDV::result($data);
    }

    function getComboItems_pmt_method(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      return JDV::result(\App\Models\GeneralSettings::options_pmt_method($ss));
    }

    function getComboItems_consultant(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = self::getComboItems_consultant_internal($branch_id);
      return JDV::result($rows);
    }

    function getComboItems_chief_complaint(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss); //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = DB::table("chief_complaints as cc")->where('cc.branch_id',$branch_id)->selectRaw("cc.id,cc.name,cc.code")->get();
      return JDV::result($rows);
    }

    function getReportFilter_options(Request $req) {
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //User not authenticated
      return JDV::raw(Settings::getReportFilter_options($ss));
    }

     function saveChiefComplaint(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::raw($ss); //User not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;
      $name = $req->name;
      $parts = explode(':',$name);
      $code = null;
      if (isset($parts[1])){
        $code = $parts[0];
        $name = $parts[1];
      }

      if(!$name) return JDV::error("Chief complaint description or name cannot be empty");
      if($this->ChiefCompaintExists($branch_id,$name,$id)) return "This Chief Complaint already exists!";

      $inputs = ['name'=>$name,'code'=>null];
      $new_id = saveData($ss,'chief_complaints',['id'=>$id],$inputs,[],1);
      if ($new_id>0){
        $this->setChiefCompaintCode($new_id,$code);
        return JDV::success(['id'=>$new_id]);
      }
      else return JDV::error("Something went wrong when trying to save Chief complaint data");
    }

    // function getComboItems_position(Request $req){
    //   // $ss = UM::getUserInfoByToken($req,-1);
    //   // if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
    //   // $branch_id = $ss->branch_id;
    //   // $id =isset($d->id)?sanitize($d->id):0;
    //   // $rows = DB::table('positions as l')->whereRaw('IFNULL(l.inactive,0) =0')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as position_title")->get();
    //   return JDV::result($rows);
    // }

    function department_exists($dep_id){
      $row = getDataRow('departments',['id'=>$dep_id],"id");
      return $row?true:false;
    }
    function savePosition(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return JDV::emptyResult($ss->status_code,null); //user not authenticated
      $branch_id = $ss->branch_id;
      $name = $req->name;
      $department_id = $req->department_id;
      $id = $req->id;
      if(!isset($name)) return JDV::error("Position name or title cannot be empty");
      if (!$this->department_exists($department_id)) return JDV::error("Department Id is not valid");
      $id = saveData($ss,'positions',['id'=>$id],['name'=>$name,'department_id'=>$department_id],null,1);
      if($id > 0) return JDV::success(['id'=>$id]);
      return JDV::error("Failed to save position");
    }

    static function getComboItems_laboTest(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $rows = DB::table("medical_services as s")->where('s.service_type','labo')->selectRaw("s.id,s.name as test_name")->orderBy('s.name','ASC')->get();
      return JDV::result($rows);
    }

    static function getComboItems_appt_status(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $rows = DB::table("appt_statuses")->selectRaw("id,name as appt_status")->orderBy('id','ASC')->get();
      return JDV::result($rows);
   }

   static function getComboItems_ticket_status(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    //$branch_id = $ss->branch_id;
    $rows = DB::table("ticket_statuses")->selectRaw("id,name as ticket_status")->orderBy('id','ASC')->get();
    return JDV::result($rows);
  }

    function GetComboItems_academic_year(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        //$branch_id = $ss->branch_id;
        $items = GeneralSettings::options_academic_year($ss);
        return JDV::result($items);
    }

    function GetComboItems_term(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      //$branch_id = $ss->branch_id;
      $items = GeneralSettings::options_term($req->academic_year,$ss);
      return JDV::result($items);
   }

    function ChiefCompaintExists($branch_id,$name=null,$id=0){
        if($name) return false;
        $str_id = "1=1";
        if($id > 0) $str_id ="id <> $id";
        return DB::table('chief_complaints')->where('branch_id',$branch_id)->where('name',$name)->whereRaw($str_id)->selectRaw("id")->exists();
    }

    function setChiefCompaintCode($id,$code=null){
        if(!$code) $code = $id;
        DB::table('chief_complaints')->where('id',$id)->update(['code'=>$code]);
    }

   function getDepartmentList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $rows = DB::table('departments as d')->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name,d.description,d.create_user, d.created_at")->get();
        return JDV::result($rows);
    }

    function getDepartmentDetails(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;
      $rows = DB::table('departments as d')->where('d.branch_id',$branch_id)->where('d.id',$id)->selectRaw("d.id,d.name,d.description,d.create_user,formatDate(d.created_at) as created_at")->take(1)->get();
      return JDV::result(isset($rows[0])?$rows[0]:null);
   }

  function getPaymentFormOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    return JDV::result(\App\Models\Invoice\InvoiceSettings::payment_form_options($ss));
  }

   function deleteDepartment(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $id = $req->id;
      DB::table('departments')->where('branch_id',$branch_id)->where('id',$id)->delete();
      return JDV::success();
   }

   function saveDepartment(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !=200) return $ss; //user not authenticated
      $branch_id = $ss->branch_id;
      $check_unique = ["$branch_id|departments|name|id=id"];
      $validate_rule = ["id"=>"0|number|identity=1","name"=>"1|string|1-200|text=Department name is required","description"=>"0|string"];
      $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
      if($res->error) return JDV::error($res->error);
      $id = $res->id;
      $inputs = $res->values;
      if(!isset($inputs['description'])) $inputs['description'] = $inputs['name'];

      $id = saveData($ss,"departments",["id"=>$id],$inputs,[],1);
      if($id>0) return JDV::success(["id"=>$id]);
      return JDV::error("Something wrong in saving department data");
   }

   function getComboItems_sales_agent(Request $req){
     $ss = UM::getUserInfoByToken($req,-1);
     if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
     return JDV::result(\App\Models\GeneralSettings::options_sales_agent($ss));
   }

   function getComboItems_department(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(\App\Models\GeneralSettings::options_department($ss));
  }
  function getComboItems_position(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(\App\Models\GeneralSettings::options_position($ss));
  }
  function getComboItems_nationality(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated
    return JDV::result(\App\Models\GeneralSettings::options_nationality($ss));
  }

  static function getComboItems_consultant_internal($branch_id,$department_id=0){
    $str_where ="ep.status ='Active'";
    // return DB::table("employees as e")->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->selectRaw("e.id,concat(p.last_name,' ',p.first_name) AS consultant_name,e.code")->get();
    return DB::table("employees as e")->join('persons as p','p.id','=','e.person_id')->join('employee_positions as ep','ep.emp_id','=','e.id')->where('e.branch_id',$branch_id)->whereRaw($str_where)->selectRaw("e.id,concat(p.last_name,' ',p.first_name) AS consultant_name,e.code")->get();
  }

  function paymentOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated

    $options = GeneralSettings::payment_option($req->id);
    return JDV::result($options);
  }

  function paymentStatusOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //user not authenticated

    $options = GeneralSettings::paymentStatusOption();
    return JDV::result($options);
  }

  function depositeFormOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss); //us

    $options = GeneralSettings::depositeFormOption($ss);

    return JDV::result($options);
  }

  function otherFeeFormOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);

    $other_fees = GeneralSettings::otherFeeFormOption($req,$ss);
    return JDV::result($other_fees);
  }

  function getFeeTypeInfo(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);

    $other_fee = GeneralSettings::getFeetypeInfo($req,$ss);
    return JDV::result($other_fee);
  }

  function requestTypeOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);

    $options = GeneralSettings::requestTypesOptions($ss);
    return JDV::result($options);

  }
  function requestDiscountOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);

    $options = GeneralSettings::requestDiscountOptions($ss);
    return JDV::result($options);

  }

  // static function getComboItems_department(Request $req){
  //    $ss = UM::getUserInfoByToken($req,-1);
  //    if($ss->status_code !=200) return $ss; //user not authenticated
  //    $branch_id = $ss->branch_id;
  //    $rows = DB::table("departments as d")->selectRaw("d.id,d.name as department_name")->orderBy('d.id','ASC')->get();
  //    return JDV::result($rows);
  // }

    //api/settings/test-sql
    function testSQL(Request $req){
        //$ss = UM::getUserInfoByToken($req,-1);
        //if($ss->status_code !=200) return $ss; //user not authenticated
        //$branch_id = $ss->branch_id;
        //$d = Sanitizer::sanitizeObject($req->all(),[]);
        //$rows = DB::table('acm_classes as cl')->selectRaw("cl.classId, cl.Subject,cl.CurEnrollment")->take(30)->get();

        $res = SQLDB::executeSP('test_getClassList',[
          ['name'=>'@course_code','value'=>'100'],
          ['name'=>'@term_id','value'=>93]
        ],"@error");

        //if ($res->status==='Error')
           return JDV::result($res);
        //else return JDV::result($out_param);
    }
}
