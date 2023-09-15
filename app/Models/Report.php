<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
//use App\Models\CompanyProfile;
use DB;

class Report //extends Model
{
    //use HasFactory;
    //protected $companyModel;

    // function __construct(array $attributes = [])
    // {
    //     parent::__construct($attributes);
    //     $this->companyModel = new CompanyProfile();
    // }
    protected $id=null,$ss=null;

    function __construct($id=null,$ss=null){
        $this->ss = $ss;
        $this->id = $id;
    }

    function getCampanyInfo($ss){
        $x = new CompanyProfile($ss);
        $p = $x->getDetails($ss);
        return $p;
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

        $studentList = DB::table('enrollments as e')
        ->join('students as st','st.id','=','e.student_id')
        ->join('terms as t','t.id','=','e.term_id')
        ->join('program_levels as l','l.id','=','e.level_id')
        ->join('sessions AS ss','ss.id','=','e.session_id')
        ->join('campuses AS c','c.id','=','e.campus_id')
        ->join('programs AS p','p.id','=','l.program_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('e.id DESC,st.id')->get();
        $header_list = ['Name','Name Kh','Sex','Term','Session','Program','Family ID'];
        $keys = ['name','name_kh','sex'];
        $key_props = $this->createKeyValue('key',$keys);
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        return (object)[
            'form' => 'simple',
            'headers' => $headers,
            'list' => $studentList
        ];
    }

    function createKeyValue($key_name,$arr){
        $result = [];
        foreach ($arr as $d) {
            $result[] = [$key_name => $d];
        }
        return $result;
    }

    function createMulKeyValue($key_name, $arr, $bonus_data=null) {
        $result = [];
        $count = count($arr);

        foreach ($arr as $index => $header) {
            $headerData = [$key_name => $header];

            if (isset($bonus_data[$index])) {
                foreach ($bonus_data[$index] as $bonus_key => $bonus_value) {
                    $headerData[$bonus_key] = $bonus_value;
                }
            }

            $result[] = $headerData;
        }

        return $result;
    }


    function optionsTerm($acadmic_year=null,$ss){
        return GeneralSettings::options_term($acadmic_year,$ss);
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

  //** Attendance Report */

    function attendanceListReport($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $group_id =isset($d->group_id)?$d->group_id:null;
        if(!$group_id) return DV::error('Group ID is required');
        $existGroup = DB::table('student_groups')->where('id',$group_id)->exists();
        if(!$existGroup) return DV::error('Group not found');

        $session_date = isset($d->session_date)?date('Y-m-d',strtotime($d->session_date)):null;
        $startDate =  isset($d->start_date)?date('Y-m-d',strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date('Y-m-d',strtotime($d->end_date)):null;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:false;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        $row = DB::table('student_groups as sg')->where('sg.id',$group_id)
            ->selectRaw('sg.id as group_id,sg.campus_id,sg.level_id,sg.session_id')->first();
        $arr_report = [
            "session_date" => $session_date,
            "a_to_z" => $aToz,
            "limit" => $limit,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'short_month_name' => $is_shortMonthName,
        ];
        $row->form = 'customize';
        $row->program = GeneralSettings::getProgramByLevel($row->level_id,$ss)->name;
        $row->campus = GeneralSettings::getCampus($row->campus_id)->name;
        $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
        $row->session = GeneralSettings::getSession($row->session_id)->name;
        $row-> count_students = $this->countGroupMembers($group_id,$ss);
        $row->session_date = $this->studentGroupAttendanceReport($group_id,$arr_report,$ss);

        return $row;

    }

    function getAttendanceRows($start_date=null,$end_date=null,$group_id=null,$student_id=null){
        $start_date = convertDate($start_date);
        $day = date('d',strtotime($start_date));
        $end_date = convertDate($end_date);

        $strSearchDate ='1=1';
        if($start_date && $end_date){
            $strSearchDate = "DATE(session_date) BETWEEN '$start_date' AND '$end_date'";
        }
        $rows = DB::table('student_attendances')->whereRaw($strSearchDate)->where('group_id',$group_id)->where('student_id',$student_id)->selectRaw('level_id,group_id,remarks,checkin_time,checkout_time,in_remarks,out_remarks,status_id,student_id,id as attendance_id,DAY(session_date) as day,MONTH (session_date) as `month`, YEAR(session_date) as `year`')->get();

        if(!isset($rows[0])) return [
                (object)[
                    'day' => (int)$day,
                    'attendance_id' => 'sdfsdf',
                    'status' => 'A',
                    'in_remarks' => 'Not Scan',
                    'out_remarks' => '',
                    'status_id' => 3,
                    "session_date" => '',
                    'checkin_time' => '',
                    'checkout_time' => '',
                    'group_id' => '',
                    "class" => '',
                    'level_id' => '',
                    'student_id' => '',
                    'remarks' => '',
                    'name' => '',

                ]
            ];
        return $rows;
    }

    function studentGroupAttendanceReport($group_id,$arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:true;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        if($aToz){
            $aToz ='DESC';
        }else $aToz = 'ASC';

        $instance = new StudentAttendance();

        $session_date = isset($d->session_date)?date('Y-m-',strtotime($d->session_date)):date('Y-m-d');
        $startDate =  isset($d->start_date)?date("Y-m-d",strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date("Y-m-d",strtotime($d->end_date)):null;

        // $existSessionDate = DB::table('student_attendances')->where('session_date',$startDate)->exists();

        $sessionDateCondition = "1=1";
        if ($session_date) {
            $sessionDateCondition = "DATE(session_date) = '$session_date'";
        }
        if($startDate && $endDate) {
            $sessionDateCondition = "DATE(session_date) BETWEEN '$startDate' AND '$endDate'";
        }
        // $att_items = $this->getAttendanceRows($startDate,$endDate,$group_id);
        $students = DB::table('group_members as gm')
                ->join('students as s','s.id','=','gm.student_id')
                ->join('enrollments as e','e.id','=','gm.enrollment_id')
                ->where('gm.group_id',$group_id)
                ->selectRaw('s.id as student_id,s.name,s.date_of_birth,s.sex,e.start_date')
                ->get();

        $start_timestamp = strtotime($startDate);
        $end_timestamp = strtotime($endDate);

        $tmp_months =[];
        $months = [];
        $current_timestamp = $start_timestamp;
        while ($current_timestamp <= $end_timestamp) {
            $year = date("Y", $current_timestamp);
            $month = date("m", $current_timestamp);
            $unique_key = $year . '-' . $month;

            if (!in_array($unique_key, $tmp_months)) {
                $tmp_months[] = $unique_key;
                $months[] = (object)[
                    'month' => $month,
                    'year' => $year
                ];
            }

            $current_timestamp = strtotime("+1 month", $current_timestamp);

        }

        $attendanceData = [];

        foreach ($months as $date) {
            $year = $date->year;
            $month = $date->month;

            $current_date = new \DateTime("$year-$month-01");
            $end_date_obj = new \DateTime("$year-$month-01");
            $end_date_obj->modify('last day of this month');

            $days_between = [];

            // based on month and year of the start_date field
            $start_day = ($year == date('Y', $start_timestamp) && $month == date('m', $start_timestamp))
                ? max(date('d', $start_timestamp), 1)
                : 1;

            // based on month and year of the end_date field
            $end_day = ($year == date('Y', $end_timestamp) && $month == date('m', $end_timestamp))
                ? min(date('d', $end_timestamp), (int)$end_date_obj->format('d'))
                : (int)$end_date_obj->format('d');

            for ($day = $start_day; $day <= $end_day; $day++) {
                $days_between[] = ['day' => $day]; //str_pad($day, 2, '0', STR_PAD_LEFT)
            }

            $monthData = [
                'date' => $year . '-' . getMonthName($month, $is_shortMonthName),
                'days' => $days_between,
                'students' => []
            ];

            $daily_attendance = [];
            $guardian_phoneNum = [];


            foreach ($students as $st) {
                $current_date = new \DateTime("$year-$month-01");
                $end_date_obj = new \DateTime("$year-$month-01");
                $end_date_obj->modify('last day of this month');
                $att_items = $this->getAttendanceRows($startDate,$endDate,$group_id,$st->student_id);

                $att_info = [];
                while ($current_date <= $end_date_obj) {
                    if ($current_date >= new \DateTime($startDate) && $current_date <= new \DateTime($endDate)) {
                        $att_info[] = $instance->getAttendanceInfo($att_items,$current_date->format('d'),$month,$year,$st->student_id);
                    }
                    $current_date->modify('+1 day');
                }

                $guardian_phoneNum[] = DB::table('student_guardians as sg')->where('sg.student_id',$st->student_id)
                                    ->join('guardians as g','sg.guardian_id','=','g.id')
                                    ->selectRaw('g.phone_number')
                                    ->get();

                $stData = [
                    'student_id' => $st->student_id,
                    'name' => $st->name,
                    'sex' => $st->sex,
                    'date_of_birth' => $st->date_of_birth,
                    'start_date' => $st->start_date,
                    'list' => $att_info,
                ];

                $count_col_absent = 0;
                $count_col_present = 0;
                $count_col_permission = 0;
                $count_rowsA=[];
                $count_rowsP=[];
                $count_rowsPr=[];
                foreach($att_info as $att){

                    if($att->status == 'A' || $att->status_id == 3){

                        $count_rowsA[] = $count_col_absent ++;
                    }
                    if($att->status == 'P' || $att->status_id == 1){

                        $count_rowsP[] = $count_col_present ++;
                    }
                    if($att->status == 'Pr' || $att->status_id == 2){

                        $count_rowsPr[] = $count_col_permission ++;
                    }

                    $daily_attendance[] = self::countDailyAttendance($att_info, $att->day);

                }

                $processedData = [];

                foreach ($daily_attendance as $item) {
                    $day = $item->day;

                    if (!isset($processedData[$day])) {
                        $processedData[$day] = [
                            'day' => $day,
                            'absent' => 0,
                            'present' => 0,
                            'permission' => 0
                        ];
                    }

                    if ($item->absent == 1) {
                        $processedData[$day]['absent']++;
                    }

                    if ($item->present == 1) {
                        $processedData[$day]['present']++;
                    }

                    if ($item->permission == 1) {
                        $processedData[$day]['permission']++;
                    }
                }
                $result = array_values($processedData);



                // $monthData['monthly_attendance'][]= [
                //     'absent' =>$count_col_absent,
                //     'permission' => $count_col_permission,
                //     'present' => $count_col_present,
                // ];
                $monthData['monthly_attendance'][]= [
                    'absent' =>count($count_rowsA),
                    'permission' => count($count_rowsPr),
                    'present' =>count($count_rowsP),
                ];
                $monthData['daily_attendance'] = $result;
                $monthData['phone_number'] = $guardian_phoneNum;
                $monthData['students'][] = $stData;

            }

            $attendanceData[] = $monthData;

        }

        return $attendanceData;

    }

    function countDailyAttendance($arr, $day) {
        $filteredData = array_filter($arr, function ($att) use ($day) {
            return $att->day == $day;
        });

        $countA = 0;
        $countP = 0;
        $countPr = 0;

        foreach ($filteredData as $att) {
            if ($att->status == 'A' || $att->status_id == 3) {
                $countA++;
            }
            if ($att->status == 'P' || $att->status_id == 1) {
                $countP++;
            }
            if ($att->status == 'Pr' || $att->status_id == 2) {
                $countPr++;
            }
        }

        return (object)[
            'day' => $day,
            'absent' => $countA,
            'present' => $countP,
            'permission' => $countPr
        ];
    }

    function countGroupMembers($group_id,$ss){
        $rows = DB::table('group_members as gm')
            ->join('students as s','s.id','=','gm.student_id')
            ->where('gm.group_id',$group_id)
            ->selectRaw('s.sex')->get();
        $female = [];
        $all = [];
        foreach($rows as $row){
            if($row->sex == 'F'){
                $female[] = $row->sex;
            }
            $all[] = $row->sex;
        }
        return (object)[
            'female' => count($female),
            'all' => count($all),
            'male' => count($all) - count($female)
        ];
    }

  //** end Attendance Report */

  //** Student List Report */

  function getStudentListReport($arr=[],$ss){
    $branch_id = $ss->branch_id;
    $rows = DB::table('students as s')->selectRaw('s.name,s.name_kh,s.sex,s.email,s.phone_number,s.date_of_birth,s.file_name')->get();
    foreach($rows as $row){
        $row->age = getAge($row->date_of_birth);
        if(isset($row->file_name)){
            $row->image_url = PublicStorage::getUrl($branch_id,'students',' image').$row->file_name;
        }else $row->image_url = null;

        unset($row->file_name);
    }
    return $rows;
  }

  //** end Student List Report */

  //** Family List Report*/

    function getFamilyListReport($arr=[],$ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_guardians as sg')
            ->select('sg.student_id','sg.family_code')
            ->groupBy('sg.student_id', 'sg.family_code')->get();
        $i=0;
        $tmp_keeper = [];
        while($i<count($rows)){
            $row = $rows[$i];
            $studentID = $row->student_id;
            $family_id = $row->family_code;
            if(!isset($tmp_keeper[$family_id])){
                $tmp_keeper[$family_id] = [
                    'family_id' => $family_id,
                    'parents' => [],
                    'children' => []
                ];
            }

            $child = DB::table('students')->where('id', $studentID)->first();
            if ($child) {
                $tmp_keeper[$family_id]['children'][] = $child;
            }

            $parents = DB::table('guardians as g')
                ->join('student_guardians as sg', 'g.id', '=', 'sg.guardian_id')
                ->selectRaw('g.name, sg.family_code,g.phone_number,g.sex,g.n_id,g.address,g.email,g.file_name,g.role')
                ->where('sg.family_code', $family_id)
                ->distinct()
                ->get();

            $uniqueParents = [];
            foreach ($parents as $parent) {
                if(isset($parent->file_name) == null){
                    $parent->image_url = '';
                }else $parent->image_url = PublicStorage::getUrl($branch_id,'guardians','image').$parent->file_name;
                $key = $parent->name . $parent->family_code;
                if (!isset($uniqueParents[$key])) {
                    $uniqueParents[$key] = [
                        'name' => $parent->name,
                        'phone' => $parent->phone_number,
                        'email' => $parent->email,
                        'address' => $parent->address,
                        'role' => $parent->role,
                        'sex' => $parent->sex,
                        'national_id' => $parent->n_id,
                        'image_url' => $parent->image_url,
                    ];
                }
            }

            $tmp_keeper[$family_id]['parents'] = array_values($uniqueParents);

            $i++;
        }

        // return $rows;

        return array_values($tmp_keeper);
    }

  //** end family list report */


  //** daily cash */

    function getDailyCash($filter,$ss){
        $selectInvoice='i.invoice_number,i.id,i.pmt_date';
        $str_search = '1=1';
        $d = (object)$filter;
        $branch_id = $ss->branch_id;
        $receiver = isset($d->receiver) ? $d->receiver :null;
        $receiver_id = isset($d->receiver_id) ? $d->receiver_id :null;

        $start_date = isset($d->start_date) ? $d->start_date :null;
        $end_date = isset($d->end_date) ? $d->end_date :null;

        $str_between_date = '1=1';
        if($start_date && $end_date) $str_between_date = 'DATE(i.pmt_date) >= \'' . $start_date . '\' AND DATE(i.pmt_date) <= \'' . $end_date . '\'';

        if($receiver) $str_search = 'i.receiver LIKE %' . $receiver.'%';
        if($receiver_id) $str_search .= ' AND i.receiver_uid = ' . $receiver_id;
        $rows = DB::table('invoices as i')->join('receipts as r','r.invoice_id','=','i.id')
            ->join('students as s','s.id','=','i.student_id')
            ->join('enrollments as e','e.student_id','=','s.id')
            ->selectRaw($selectInvoice.',s.name,s.sex,r.receipt_number,e.campus_id')
            ->whereRaw($str_between_date)
            ->where('i.branch_id',$branch_id)->whereRaw($str_search)->get();
        if(!isset($rows[0])) return DV::error('Could not find invoice');
        $campuses = [];
        foreach($rows as $row){
            //** get invoice items */
            $itemDetails = self::getInvoiceItemDetails($row->id,$branch_id);
            $row->total = $itemDetails->total;
            $row->items = $itemDetails->data;
            $row->campus = GeneralSettings::getCampus($row->campus_id)->shortcut;
            if (!in_array($row->campus, $campuses)) {
                $campuses[] = $row->campus;
            }
            unset($row->campus,$row->campus_id);
        }

        //** create table headers and keys */
        $header_list = ['Date','Receipt No.','Student Name','Sex','Dis.','Period','School Fee'];
        $fee_types = DB::table('fee_types')->selectRaw('name')->where('id','>=',20)->get();
        $key_list = ['pmt_date','receipt_number','name','sex','discount','period','tuition_fee'];
        foreach($fee_types as $type){
            //** push header name value into array */
            array_push($header_list,$type->name);
            //** push key value into array */
            array_push($key_list,$this->stringToKeyCase($type->name));
        }
        $key_props = $this->createKeyValue('key',$key_list);
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);
        //**---- */

        return (object)[
            'title' => 'Daily Cash Collection Report (' . implode(', ', $campuses) . ')',
            'form' => 'simple',
            'header' => $headers,
            'list' => $rows,
            'company_profile' => $this->getCampanyInfo($ss)
        ];
    }

    function getInvoiceItemDetails($inv_id,$branch_id){
        $tuition_amt=0;
        $total=[];
        $selectCols = 'price,fee_type,invoice_id,date_range,discount,net_amount,start_date,end_date';
        $rows = DB::table('invoice_items')->where('invoice_id',$inv_id)->where('branch_id',$branch_id)->selectRaw($selectCols)->get();
        $fee_types = DB::table('fee_types')->selectRaw('name')->where('id','>=',20)->get();
        $all_type =[];
        foreach($fee_types as $type){
           $all_type[] = $type->name;
        }
        foreach($rows as $row){
            $fee_type = self::stringToKeyCase($row->fee_type);
            $row->$fee_type = $row->net_amount;

            if($row->fee_type == 'tuition_fee'){
                $tuition_amt = $row->net_amount;
                $discount = $row->discount;
            }
            $total[] = $row->net_amount;
            $row->period = dateDiffMonths($row->start_date, $row->end_date);
        }
        $sum_amt = array_sum($total);

        return (object)['discount'=>$discount,'data'=>$rows,'total'=>$sum_amt];
    }



    //** monthly cash */
    function getMonthlyCash($arr,$ss){
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        // $key_list = DB::table('fee_types')->pluck('name')->toArray();
        // $keys = $this->stringToKeyCase($key_list);
        // $headers = $this->createMulKeyValue('name',$key_list,$this->createKeyValue('key',$keys));
        // $rows = DB::table('invoices')->selectRaw('pmt_date,id')->get();
        // foreach($rows as $row){
        //     $item = $this->getInvoiceItemDetails($row->id,$branch_id);
        //     $row->items = $item->data;
        // }

        $i=0;
        $str_date = '1=1';
        $start_date = isset($d->start_date) ? $d->start_date:date('Y-m-d');
        $end_date = isset($d->end_date) ? $d->end_date:date('Y-m-d');
        if($start_date && $end_date) {
            $str_date = "i.pmt_date BETWEEN '$start_date' AND '$end_date'";
       }
       $rows = DB::table('invoices as i')->selectRaw('i.pmt_date,i.id')->whereRaw($str_date)->get();
       return $rows;
    }
    function getFilterMonthlyCash($arr,$ss){
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        $month = isset($d->month)?$d->month:date('m');
        $year = isset($d->year)?$d->year:date('Y');

        $days = days_in_month($month,$year);
        $i=0;
        $monthlyCashList =[];
        $rows = DB::table('invoices as i')->whereMonth('i.pmt_date',$month)->whereYear('i.pmt_date',$year)->selectRaw('i.invoice_number')->get();
        do{
            $i++;
            $x = 1;//$this->getAttendanceInfo($rows,$i,$month,$year,$student_id);
            $monthlyCashList[] = $x;
        }while ($i<$days);
    }



    function stringToKeyCase($cnvtString,$bonus_string=null,$front=1){

        $removeSpecialChars = function ($str) {
            return preg_replace('/[^a-zA-Z0-9\s]/', '', $str);
        };
        $bonus_string = $removeSpecialChars(strtolower($bonus_string));
        if (is_array($cnvtString)) {

            $result = [];
            foreach ($cnvtString as $string) {
                $string = $removeSpecialChars($string);
                $convertedString = strtolower(str_replace(' ', '_', $string));

                if ($bonus_string) {
                    $result[] = $front == 1 ? $bonus_string . '_' . $convertedString : $convertedString . '_' . $bonus_string;
                } else {
                    $result[] = $convertedString;
                }
            }
            return $result;
        }
        $cnvtString = $removeSpecialChars($cnvtString);
        $convertedString = strtolower(str_replace(' ', '_', $cnvtString));

        if ($bonus_string) {
            return $front == 1 ? $bonus_string . '_' . $convertedString : $convertedString . '_' . $bonus_string;
        }
        return $convertedString;

    }


    function getDepositeFee($student_id){
        DB::table('deposites')->where('student_id',$student_id)->selectRaw('')->first();
    }
}
