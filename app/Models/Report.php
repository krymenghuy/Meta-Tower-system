<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\CompanyProfile;
use Session;
use DB;

class Report extends Model
{
    use HasFactory;
    protected $companyModel;
    
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->companyModel = new CompanyProfile();
    }

    static function list($ss){
        return DB::select("SELECT id, `name`, `hidden`,code,category,rpt.module_id,rpt.description,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 ORDER BY rpt.category,rpt.display_order ASC");
    }

    function getBranchInfo($branch_id=0){ 
         $rows = DB::table('um_branches AS b')->where('b.branch_id',$branch_id)->selectRaw("b.branch_id,b.logo_file_name,b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
         foreach($rows as $row) {
             $user_class="general";
             $category="image";
             $dir = PublicStorage::getUrl($branch_id,$user_class,$category);
             $row->logo_url =  $dir.$row->logo_file_name;
             return $row;
         } 
         return (object)array("name"=>'(Company Name)','phone_number'=>'(Unvailaible phone)','website'=>'Unvailable');
    }
 
    function getScalarData_loan($loan_app_id=0,$loan_id=0){
        return (object)[
          'guarantor_name'=>'Mr.Guarntor',
          'guarantor_address'=>'BKK1',
          'guarantor_phone'=>'0124564565',
          'collateral_description'=>'iWatch a great one',
        ];

        // $table="collaterals as c";
        // $str_id="1=2";
        // if($loan_app_id>0){
        //     {
        //       $str_id ="c.loan_app_id = $loan_app_id";
        //       $table ="collaterals as c";
        //     }
        //  }else {
        //      $str_id ="c.loan_id =$loan_id";
        //      $table ="collaterals as c";
        //  }
        // $rows = DB::table($table)->whereRaw($str_id)->selectRaw("c.id,(select name from collateral_types where id = c.collateral_type_id LIMIT 1) AS collateral_type,c.description,c.estimated_value,c.identification_number,c.owner_name,Date_format(c.expiration_date,'%d %b %Y') as expiration_date")->get(); 
        // foreach($rows as $row) return $row;
    }
  
    function getDays($compound_cycle){
     switch($compound_cycle){
        case 'monthly':{
            return 30;
        }case 'day':{
            return 1;
        }
        case 'week':{
            return 7;
        }
        default:
        return 30;
     }
    }
    
   function getActivities($start_date,$end_date){
     $start_date = convertDate($start_date);
     $end_date = convertDate($end_date);
     //$str_where ='DATE(r.updated_at) >=\''.$start_date.'\' AND DATE(r.updated_date) <=\''.$end_date.'\'';
     $str_where ='1=1';
     $cols ='r.id, r.term_id, r.student_id,t.`name` AS request_type, c.description,IFNULL(c.calculated_fee,0) AS amount,\'$\' AS currency_symbol, r.remarks, r.request_type_id,r.status_id ,r.authorized, r.auth_user, formatTime(r.auth_date) AS auth_date, formatTime(r.updated_at) AS updated_at,r.update_user';
     return DB::table('requests as r')->join('request_changes as c','c.request_id','=','r.id')->join('request_types AS t','t.id','=','r.request_type_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('r.id DESC')->get(); 
   }

   function getStudentList($term_id=0,$new_student=null){
    $term_id=$term_id?$term_id:0;
    $str_where ='t.id ='.$term_id;
    if($new_student==1) $str_where .=' AND e.is_new_student =1';
    $get_group_name =',(SELECT g.name FROM group_members AS gm INNER JOIN student_groups AS g ON g.id = gm.group_id WHERE gm.enrollment_id = e.id LIMIT 1) AS group_name';
    $cols ='e.id,st.id AS student_id,t.id AS term_id,st.name AS `student_name`, st.name_kh AS student_name_kh,st.code as student_code,st.sex,st.phone_number,(SELECT family_code FROM student_guardians WHERE student_id = st.id LIMIT 1) AS family_code'
    .',p.id AS program_id, l.id AS level_id,e.session_id,e.campus_id,t.`name` AS term_name, c.`name` AS campus_name,p.`name` AS program_name,l.`name` AS level_name'.$get_group_name.',formatDate(e.start_date) AS start_date, formatDate(e.tuition_end_date) AS tuition_end_date,e.status_id as pmt_status_id,e.enrollment_status_id,e.is_new_student';
    return DB::table('enrollments as e')
    ->join('students as st','st.id','=','e.student_id')
    ->join('terms as t','t.id','=','e.term_id')
    ->join('program_levels as l','l.id','=','e.level_id')
    ->join('sessions AS ss','ss.id','=','e.session_id')
    ->join('campuses AS c','c.id','=','e.campus_id')
    ->join('programs AS p','p.id','=','l.program_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('e.id DESC,st.id')->get(); 
  }

  /**
   * return list of invoice payments (date to date)
   * $arr = {term_id,start_date,end_date}
   * 
  */
  function getInvoicePaymnents($arr=[]){
    $d = (object)$arr;
    $term_id =isset( $d->term_id)? $d->term_id:null;
    $start_date = isset($d->start_date)?$d->start_date:null;
    $end_date = isset($d->end_date)?$d->end_date:null;
    $str_where ='v.is_paid =1 AND v.paid_amount > 0 ';
    $get_family_code =',(SELECT family_code FROM student_guardians AS sg WHERE sg.student_id = st.id LIMIT 1) AS family_code';
    $cols = 'v.id,st.id AS student_id,st.name AS student_name, st.name_kh, st.code as student_code, st.phone_number'.$get_family_code.
    ',v.invoice_date AS issue_date, formatDate(v.due_date) AS due_date, v.invoice_number, v.branch_id, v.amount, v.due_amount, v.paid_amount,v.currency_code, v.is_paid,v.invoice_type, formatDate(v.pmt_date) AS pmt_date,note AS notes,v.purpose, CASE v.inactive WHEN 1 THEN \'Canceled\' ELSE \'Active\' END AS `status`, (CASE (v.is_paid AND v.paid_amount > 0) WHEN 1 THEN \'Paid\' ELSE \'Unpaid\' END) AS pmt_status, receiver,receiver_uid, formatTime(v.updated_at) AS updated_at,v.update_user';
    return DB::table('invoices as v')->join('students as st','st.id','=','v.student_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('v.invoice_date ASC,st.id')->get();

  }

  function getInvoiceList($arr=[]){
    $d = (object)$arr;
    $term_id =isset( $d->term_id)? $d->term_id:null;
    $start_date = convertDate(isset($d->start_date)?$d->start_date:null);
    $end_date = convertDate(isset($d->end_date)?$d->end_date:null);
    $status_id = isset($d->status_id)?$d->status_id:null;
    $str_where ='1=1';
    //if($term_id > 0) $str_where .=' AND v.term_id ='.$term_id;
    if($status_id > 0) $str_where .=' AND v.status_id ='.$status_id;   

    $get_family_code =',(SELECT family_code FROM student_guardians AS sg WHERE sg.student_id = st.id LIMIT 1) AS family_code';
    $cols = 'v.id,st.id AS student_id,st.name AS student_name, st.name_kh, st.code as student_code, st.phone_number'.$get_family_code.
    ',v.invoice_date AS issue_date, formatDate(v.due_date) AS due_date, v.invoice_number, v.branch_id, v.amount, v.due_amount, v.paid_amount,v.currency_code,v.is_paid,v.invoice_type, formatDate(v.pmt_date) AS pmt_date,note AS notes,v.purpose, CASE v.inactive WHEN 1 THEN \'Canceled\' ELSE \'Active\' END AS `status`, (CASE (v.is_paid AND v.paid_amount > 0) WHEN 1 THEN \'Paid\' ELSE \'Unpaid\' END) AS pmt_status, receiver,receiver_uid, formatTime(v.updated_at) AS updated_at,v.update_user';
    return DB::table('invoices as v')->join('students as st','st.id','=','v.student_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('v.invoice_date ASC,st.id')->get();
  }
}
