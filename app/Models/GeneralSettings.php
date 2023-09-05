<?php

namespace App\Models;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use Carbon\Carbon;
//use Session;
use DB;
use Illuminate\Support\Facades\Cache;

class GeneralSettings //extends Model
{
    //use HasFactory;
    function position_exists($branch_id, $name){
        $rows = DB::table('positions')->where('branch_id',$branch_id)->where('name',$name)->selectRaw("id")->limit(1)->get();
        foreach($rows as $row) return true;
        return false;
    }

    // function sendMessage($d){
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(100)) return '@'; //need permission to do this task
    //     $branch_id = sanitize($ss->branch_id);
    //     $phone_number = isset($d->phone_number)?sanitize($d->phone_number):null;
    //     $text = isset($d->text)?sanitize($d->text):null;

    //             $fields = array(
    //                 //'app_id' => "5eb5a37e-b458-11e3-ac11-000c2940e62c",
    //                 'gw-username'=>'xperasoft',
    //                 'gw-password'=>'bchsd',
    //                 'gw-to'=>$phone_number,
    //                 'gw-from'=>'Dolgoal',
    //                 'gw-text'=>$text
    //                 //'token' =>'di5B9xXcZeULyNAFSsdv9COWOzBPWE',
    //             );

    //         $ch = curl_init();
    //         curl_setopt($ch, CURLOPT_URL, "http://sms.plasgate.com:29062/cgi-bin/sendsms");
    //         curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    //             'Content-Type: application/json; charset=utf-8',
    //             'Authorization: Basic di5B9xXcZeULyNAFSsdv9COWOzBPWE'
    //         ));
    //         curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    //         curl_setopt($ch, CURLOPT_HEADER, FALSE);
    //         curl_setopt($ch, CURLOPT_POST, TRUE);
    //         curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    //         curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

    //         $response = curl_exec($ch);
    //         curl_close($ch);

    //         return $response;
    // }

    function org_exists($name,$id){
        if(!$name) return false;
        $name = sanitize($name);
        $rows = [];
        if($id>0)
          $rows = DB::table('organizations as o')->where('name',$name)->whereRaw("o.id <> $id")->selectRaw('id')->limit(1)->get();
        else
        $rows = DB::table('organizations as o')->where('name',$name)->selectRaw('id')->limit(1)->get();
        foreach($rows as $row) return true;
        return false;
    }

    // function createOrganization($d){
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(-1)) return '@'; //need permission to do this task
    //     $branch_id = sanitize($ss->branch_id);
    //     $name = isset($d->name)?$d->name:null;
    //     $id = isset($d->id)?$d->id:null;

    //     $org_type_id = isset($d->org_type_id)?$d->org_type_id:null;
    //     $industry_id = isset($d->industry_id)?$d->industry_id:null;
    //     if ($this->org_exists($name,$id)) return DV::error('The provided organization name already exists!');
    //     DB::table('organizations')->insert([
    //         'branch_id'=>$branch_id,
    //         'name'=>$name,
    //         'org_type_id'=>$org_type_id,
    //         'industry_id'=>$industry_id,
    //         'create_user'=>$ss->login_name,
    //         'create_date'=>getNowTime()
    //     ]);
    //     $new_id = DB::getPdo()->lastInsertId();
    //     return DV::success(['org_id'=>$new_id]);
    // }


    // function createIndustry($d){
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(-1)) return '@'; //need permission to do this task
    //     $branch_id = sanitize($ss->branch_id);
    //     $name = $d->name;

    //     DB::table('industries')->insert([
    //         'branch_id'=>$branch_id,
    //         'name'=>$name,
    //         'create_user'=>$ss->login_name,
    //         'create_date'=>getNowTime()
    //     ]);
    //     return DV::success();
    // }

    // function deleteIndustry($d){
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(-1)) return '@'; //need permission to do this task
    //     $branch_id = sanitize($ss->branch_id);
    //     $id = $d->id;

    //     DB::table('industries')->where('id',$id)->delete();
    //     return DV::success();
    // }

    static function employee_form_options($ss){
     return (object)[
         'positions'=> self::options_position($ss),
         'departments'=>self::options_department($ss),
         'nationalities'=>self::options_nationality($ss),
         'employment_types'=>self::options_emp_type($ss)
         //'organizations'=>$this->getComboItems_org(),
         //'industries'=>$this->getComboItems_industry()
     ];
    }

    static function options_pmt_method($ss){
      $branch_id = $ss->branch_id;
      return DB::table('payment_methods as m')->where('m.branch_id',$branch_id)->selectRaw("m.id,m.name,m.method_type")->get();
    }

    function getComboItems_industry(){
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('industries as i')->whereRaw('IFNULL(inactive,0) =0')->selectRaw("i.id,i.name as industry")->get();
    }

    function getComboItems_position($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('positions as l')->whereRaw('IFNULL(l.inactive,0) =0')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as position_title")->get();
    }
    static function options_position($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('positions as l')->whereRaw('IFNULL(l.inactive,0) =0')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as position_title")->get();
    }
    static function options_department($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('departments as d')->whereRaw('IFNULL(d.inactive,0) =0')->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name as department")->orderBy('d.name','ASC')->get();
    }
    static function options_nationality($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('loc_countries as c')->where('c.branch_id',$branch_id)->selectRaw("c.id,c.nationality as nationality")->orderBy('nationality','ASC')->get();
    }
    static function options_emp_type($ss){
        $branch_id = $ss->branch_id;
        return [
            (object)['employment_type'=>'Part Time'],
            (object)['employment_type'=>'Full Time'],
            (object)['employment_type'=>'Freelance']
        ];
    }
    function getComboItems_org($ss){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('organizations as org')->whereRaw('IFNULL(org.inactive,0) =0')->where('org.branch_id',$branch_id)->selectRaw("org.id,org.name as org_name")->get();
    }

    static function studentInfo($student_id){
        $selectCols = 'e.school_id,s.name as student_name,s.name_kh,s.id as student_id,e.session_id,e.term_id,e.campus_id,e.level_id,e.academic_year,p.pmt_option_id';
        $row = DB::table('students as s')->where('s.id',$student_id)
            ->join('enrollments as e','e.student_id','=','s.id')
            ->join('terms as t','e.term_id','=','t.id')
            ->join('payments as p','p.enrollment_id','=','e.id')
            ->selectRaw($selectCols)
            ->first();
        if(!$row) return $row=null;
        return $row;
    }
    static function options_session($ss){
      return DB::table('sessions as ss')->where('branch_id',$ss->branch_id)->selectRaw('id,name as session_name,shortcut')->get();
    }

    static function getSession($session_id){
        return DB::table('sessions')->where('id',$session_id)->selectRaw('id,name,id as session_id,name as session')->first();
    }

    static function getLevel($level_id=null,$ss=null) {
        $branch_id = $ss?$ss->branch_id:null;
        $row = DB::table('program_levels')->where('id',$level_id)->selectRaw('program_id,name as level,name,id as level_id,shortcut,id')->first();
    return $row;
    }

    static function getProgramByLevel($level_id=null,$ss=null) {
        $branch_id = $ss->branch_id;
        return DB::table('programs as p')->join('program_levels as pl','p.id','=','pl.program_id')->where('pl.id',$level_id)->selectRaw('p.name as program,p.id as program_id,p.id,p.name')->first();
    }

    static function options_program($ss){
        $branch_id = $ss?$ss->branch_id:null;
        $str_where ='';
        if($branch_id>0) $str_where = ' WHERE p.branch_id ='.$branch_id;
        return DB::select(DB::raw('SELECT p.id, p.name AS program_name, shortcut FROM programs AS p '.$str_where.' ORDER BY name ASC'));
    }
    static function options_level($program_id=null){
        //$branch_id = $ss->branch_id;
        $str_program = ($program_id > 0)? 'p.program_id = '.$program_id : '1=1';
        return  DB::table('program_levels AS p')->whereRaw($str_program)->selectRaw('p.id,p.program_id,p.name as level_name,p.level_order,p.prev_level_id')->orderByRaw('p.level_order ASC')->get();
    }
    static function options_campus($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('campuses AS c')->where('c.branch_id',$branch_id)->selectRaw('c.id,c.name as campus_name,c.shortcut')->get();
    }
    static function options_academic_year($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('academic_years AS a')->where('a.branch_id',$branch_id)->selectRaw('a.id,a.academic_year,formatDate(a.start_date) AS start_date,formatDate(a.end_date) AS end_date')->orderByRaw('a.start_date ASC')->get();
    }

    //payment options
    static function options_pmt($ss=null){
        return DB::table('pmt_options')->selectRaw('name,id')->limit(3)->orderBy('id','asc')->get();
    }

    static function options_school($ss=null){
        return DB::table('schools')->selectRaw('name,id')->get();
    }
    static function options_group($term_id,$filter=null){
        // if(!$filter)
        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id :null;
        $level_id = isset($d->level_id) ? $d->level_id :null;
        $session_id = isset($d->session_id) ? $d->session_id :null;
        $str_search ="term_id = $term_id";
        if($campus_id>0) $str_search.=' AND campus_id = '.$campus_id;
        if($level_id>0) $str_search.=' AND level_id = '.$level_id;
        if($session_id>0) $str_search.=' AND session_id = '.$session_id;

        return DB::table('student_groups')->whereRaw($str_search)->selectRaw('id,name AS group_name,campus_id,session_id,level_id')->get();
    }

    static function saveOption_school($arr,$id, $ss){
        $d = (object)$arr;
        $id = saveData($ss,'schools',['id'=>$id],['name'=>$d->name],[],1,false);
        return DV::depends($id,['schools'=>self::options_school($ss)]);
    }

    static function deleteOption_school($id, $ss){
       $x = DB::table('schools')->where('id',$id)->delete();
       return DV::depends($x,['schools'=>self::options_school($ss)]);
    }

    static function options_price_list($ss){
        $branch_id = $ss->branch_id;
        return DB::table('price_list')->where('branch_id',$branch_id)->selectRaw('name,id')->get();
    }

    static function options_sales_agent($ss){
        $branch_id = $ss->branch_id;
        return DB::table('employees AS e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->selectRaw("e.id, CONCAT(p.last_name,' ',p.first_name) as sales_agent_name")->orderBy('sales_agent_name','ASC')->get();
    }
    /** return list of terms by term names prefixed with academic year */
    static function options_acad_term($ss){
        $branch_id = $ss->branch_id;
        return DB::table('terms as t')->where('t.branch_id',$branch_id)->selectRaw('t.id,CONCAT(t.academic_year,\' \',t.name) AS term_name')->orderByRaw('start_date DESC')->get();
    }
    static function options_term($academic_year,$ss){
       $branch_id = $ss->branch_id;
       $str_year ='1=1';
       if($academic_year > 0) $str_year ='academic_year =\''.$academic_year.'\'';
       return DB::table('terms as t')->where('t.branch_id',$branch_id)->selectRaw('t.id,t.`name` as term_name')->orderByRaw('start_date DESC')->get();
    }

    static function getGroupByStudent($student_id,$ss=null){
        $branch_id = $ss?$ss->branch_id:1;
        $row = DB::table('student_groups as sg')->join('group_members as gm','gm.group_id','=','sg.id')->where('sg.branch_id',$branch_id)->where('gm.student_id',$student_id)
            ->selectRaw('sg.level_id,sg.term_id')
            ->first();
        if(!isset($row)) return (object)[];
        return $row;
    }

    static function options_country($ss){
        //$branch_id = $ss->branch_id;
        $countries = Cache::remember('countries', 60, function () {
            return DB::table('loc_countries as c')->select('id','name as country')->orderBy('c.name','ASC')->get();
        });
        return $countries;
    }

    static function options_city($country_id=null, $ss){
     //$branch_id = $ss->branch_id;
       //return Cache::remember('cities',60,function() use($country_id){
          $str_country ="1=1";
          if($country_id) $str_country ="c.country_id =$country_id";
          return DB::table('loc_cities as c')->whereRaw($str_country)->select('id','name as city')->orderBy('c.name','ASC')->get();
       //});
    }
    static function options_district($city_id=null, $ss){
        //$branch_id = $ss->branch_id;
        $str_city ="1=1";
        if($city_id) $str_city ="c.city_id =$city_id";
        return DB::table('loc_districts as c')->whereRaw($str_city)->select('id','name as district')->orderBy('c.name','ASC')->get();
    }

    static function options_commune($district_id=null, $ss){
        //$branch_id = $ss->branch_id;
        $str_where ="1=1";
        if($district_id) $str_where ="c.district_id =$district_id";
        return DB::table('loc_communes as c')->whereRaw($str_where)->select('id','name as commune')->orderBy('c.name','ASC')->get();
    }

    static function payment_option($id){
        if($id == 4){
            return (object)['name' => 'weeks'];
        }else if($id == 5){
            return (object)['name' => 'days'];
        }
        else{
            return (object)['name' => 'months'];
        }
    }

    static function paymentStatusOption(){
        $rows = DB::table('pmt_status')->selectRaw('name,id')->get();
        $rows[] =['id'=>4,'name' => 'All'];
        return $rows;
    }

    static function depositeFormOption($ss){
        return(object)[
            'options_student' => DB::table('students')->selectRaw('name as student_name,id')->get(),
            'options_campus' => DB::table('campuses')->selectRaw('name as campus_name,id')->get(),

            'options_program_level' => DB::table('program_levels')->selectRaw('name as level,id')->orderBy('order_number','ASC')->get(),

            'options_session' => DB::table('sessions')->selectRaw('name as session,id')->get(),
        ];
    }

    static function otherFeeFormOption($d,$ss){
            $rows = DB::table('other_fees')
                ->where('branch_id',$ss->branch_id);
                if($d->academic_year){
                    $rows->where('academic_year',$d->academic_year);
                }
            $list = $rows->selectRaw('name,id,academic_year')->get();
            return $list;

    }

    static function getFeetypeInfo($d,$ss){
        $name = $d->name;
        $academic_year = $d->academic_year;
        $row = DB::table('other_fees')->where('name',$name)->selectRaw('name,name as fee_type,amount,academic_year,description,amount as total');
        if($academic_year){
            $row->where('academic_year',$academic_year);
        }
        $item = $row->get()->first();
        return $item;
    }

    static function requestTypesOptions($ss=null){
        $rows = DB::table('request_types')->selectRaw('name,id')->get();
        return $rows;
    }

    static function requestDiscountOptions($ss=null){
        $dicount_type = DB::table('discount_types')->selectRaw('name,id')->get();
        $students = DB::table('students')->selectRaw('name as student_name,id as student_id,code as student_code')->get();
        return (object)[
            'discount_type' => $dicount_type,
            'students' => $students
        ];
    }

    static function requestTypeTnput($id){
        if($id == 1){
            return (object)[
                'label' => 'Level',
                'to' => 'to_level_id',
                'from' => 'from_level_id'
            ];
        }else if($id == 2){
            return (object)[
                'label' => 'Campus',
                'to' => 'to_campus_id',
                'from' => 'from_campus_id'
            ];
        }else if($id == 3){
            return (object)[
                'label' => 'Session',
                'to' => 'to_session_id',
                'from' => 'from_session_id'
            ];
        }
    }

    static function optionsStudentList($id){
        $rows = DB::table('students')->selectRaw('name as student_name,id as student_id')->get();
        return $rows;
    }

    static function requestTypeDialog($ss=null){
        return (object)[
            'student_list_options' => DB::table('students as s')->selectRaw('s.name as student_name,s.id as student_id,s.code as student_code')->get(),
            'request_type_options' => self::requestTypesOptions(),
            'sessions_options' => Setting::session_options($ss),
            'level_options' => Setting::level_options($ss),
            'campus_options' => Setting::campus_options($ss),
        ];
    }

    static function optionsStudentEnrollments($d,$ss){
        $id = isset($d->id)?$d->id:$d->student_id;
        $rows = DB::table('enrollments')->where('student_id',$id)->selectRaw('id as enrollment_id,student_id,term_id,session_id,program_id,level_id,campus_id')->get();
        foreach($rows as $row){
            $row->level = 'Enrollment level ('.self::getLevel($row->level_id,$ss)->level.')';
        }
        return $rows;
    }

    static function getstudentEnrollmentsInfo($d,$ss){
        $id = isset($d->id)?$d->id:$d->student_id;
        $rows = DB::table('enrollments as e')->where('student_id',$id)->selectRaw('e.id as enrollment_id,e.student_id,e.term_id,e.session_id,e.program_id,e.level_id,e.campus_id,p.tuition,p.tuition_due,e.tuition_end_date')
                ->join('payments as p','p.enrollment_id','=','e.id')->get();
        foreach($rows as $row){
            $row->level = 'Enrollment level ('.self::getLevel($row->level_id,$ss)->level.')';
            $row->campus = DB::table('campuses')->where('id',$row->campus_id)->first()->name;
            $row->session = self::getSession($row->session_id)->name;
        }
        return $rows;
    }

    static function optionsStudentRequest($d,$ss){
        $enrollment_id = $d->enrollment_id;
        $row = DB::table('enrollments as e')->where('e.id',$enrollment_id)
                ->join('students as s','s.id','=','e.student_id')
                ->join('terms as t','t.id','=','e.term_id')
                ->selectRaw('e.level_id,e.session_id,e.campus_id,s.name as student_name,s.name_kh,s.date_of_birth,s.place_of_birth')
                ->first();
        $row->level =  DB::table('program_levels')->where('id',$row->level_id)->selectRaw('name as level')->first()->level;
        $row->session = DB::table('sessions')->where('id',$row->session_id)->selectRaw('name')->first()->name;
        $row->campus = DB::table('campuses')->where('id',$row->campus_id)->selectRaw('name')->first()->name;
        return $row;
    }

    static function getCurrentProgram($id,$ss){
        $row = DB::table('programs')->where('branch_id',$ss->branch_id)->where('id',$id)->selectRaw('name as program,id')->first();
        return $row;
    }
    static function getNextProgram($id,$ss){
        $prev = self::getCurrentProgram($id,$ss);
        $row = DB::table('programs')->where('prev_program_id',$prev->id)->selectRaw('id as program_id,id,name as prgram_name,name')->get()->first();
        return $row;
    }

    static function getNextLevelByCurrentLevel($level_id=null,$ss=null){
        $branch_id = $ss?$ss->branch_id:1;
        $row = DB::table('program_levels')->where('prev_level_id',$level_id)->where('branch_id',$branch_id)->selectRaw('program_id,id,name,id as level_id,name as level')->first();
        if(!$row) return $row=null;
        return $row;
    }

    static function optionsGroup($ss=null,$level_id=null,$campus_id=null){
        $branch_id = $ss->branch_id;

        $search = '1=1';
        if($level_id){
            $search = "level_id = '$level_id' AND campus_id = '$campus_id'";
        }
        $rows = DB::table('student_groups as sg')->where('sg.branch_id',$branch_id)->whereRaw($search)->selectRaw('sg.name as group_name,sg.id as group_id,sg.name,sg.id')->get();
        return $rows;
    }

    static function optionsAttendanceTypes(){
        $rows = DB::table('attendance_types')->selectRaw('name,id,short_hand')->get();
        foreach($rows as $row){
            $row->name = $row->name.'('.$row->short_hand.')';
        }
        return $rows;
    }
    static function getCampus($id){
        return DB::table('campuses')->where('id',$id)->selectRaw('id,name,name as campus')->first();
    }

    static function optionsFindVerifyPmt(){
        return (object)[
            "academic_years" => DB::table('academic_years')->selectRaw('academic_year as academic_years,academic_year as id')->get(),
            "terms" => DB::table('terms')->selectRaw('name as terms_name,id')->get(),
            'pmt_options' => DB::table('pmt_options')->selectRaw('name as pmt_options_name,id')->take(3)->orderBy('id','asc')->get(),
            'sessions' => DB::table('sessions')->selectRaw('name as sessions_name,id')->get()
        ];
    }

    static function options_family($ss=null){
        $branch_id = $ss->branch_id;

        $familyCodes = DB::table('student_guardians')
        ->select('family_code')
        ->distinct()
        ->get();


        $result = [];
        $i=0;
        foreach ($familyCodes as $familyCode) {
            $familyPhone = DB::table('guardians as g')
                ->join('student_guardians as sg', 'g.id', '=', 'sg.guardian_id')
                ->select('g.name', 'sg.family_code','g.phone_number')
                ->where('sg.family_code', $familyCode->family_code)
                ->distinct()
                ->first()->phone_number;

            $familyObject = (object)[
                'family_code' => $familyCode->family_code,
                'family' => $familyCode->family_code.'('.$familyPhone.')',
            ];


            $result[] = $familyObject;
            $i++;
        }

        return $result;
    }

    static function getParentInfoByFamilyCode($familyCode,$ss=null){
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_guardians')->where('family_code',$familyCode)->selectRaw('guardian_id')->distinct()->get();
        $guardians = DB::table('guardians')->selectRaw('id,name,sex,role,phone_number,email,n_id,file_name,address,religion')->get();
        foreach($rows as $row){
            $guardian = $guardians->filter(function ($c) use($row) {
                return $c->id === $row->guardian_id;
            })->first();
            // if ($guardian && $guardian->role === 'father') {
            //     $row->father_name = $guardian->name;
            // }else{
            //     $row->mother_name = $guardian->name;
            // }


            if($guardian){
                if(strtolower($guardian->role) === 'father'){
                    $row->father_name =$guardian->name;
                    $row->father_phone =$guardian->phone_number;
                    $row->father_email =$guardian->email;
                    $row->father_nid = $guardian->n_id;
                    if($guardian->file_name){
                        $row->father_profile = PublicStorage::getUrl($branch_id,'guardians','image').$guardian->file_name;
                    }else $row->father_profile = "";
                }
                if(strtolower($guardian->role) === 'mother'){
                    $row->mother_name =$guardian->name;
                    $row->mother_phone =$guardian->phone_number;
                    $row->mother_email =$guardian->email;
                    $row->mother_nid = $guardian->n_id;
                    if($guardian->file_name){
                        $row->mother_profile = PublicStorage::getUrl($branch_id,'guardians','image').$guardian->file_name;
                    }else $row->mother_profile = "";
                }
                $row->address = $guardian->address;
                $row->role = $guardian->role;
                $row->religion = $guardian->religion;
            }
        }
        return $rows;
    }



    // static function optionsStudentRequest($student_id,$ss){
    //     $row = DB::table('enrollments as e')->where('student_id',$student_id)
    //             ->join('students as s','s.id','=','e.student_id')
    //             ->join('terms as t','t.id','=','e.term_id')
    //             ->selectRaw('e.level_id,e.session_id,e.campus_id,s.name as student_name,s.name_kh,s.date_of_birth,s.place_of_birth')
    //             ->first();
    //     $row->level =  DB::table('program_levels')->where('id',$row->level_id)->selectRaw('name as level')->first()->level;
    //     $row->session = DB::table('sessions')->where('id',$row->session_id)->selectRaw('name')->first()->name;
    //     $row->campus = DB::table('campuses')->where('id',$row->campus_id)->selectRaw('name')->first()->name;
    //     return $row;
    // }
}
