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

    static function options_program($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('programs AS p')->where('p.branch_id',$branch_id)->selectRaw("p.id,p.name as program_name")->orderByRaw('p.name','ASC')->get();
    }
    static function options_level($program_id=null,$ss){
        //$branch_id = $ss->branch_id;
        return  DB::table('program_levels AS p')->where('p.program_id',$program_id)->selectRaw('p.id,p.program_id,p.name as level_name,p.level_order,p.prev_level_id')->orderByRaw('p.level_order ASC')->get();
    }

    static function options_academic_year($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('academic_years AS a')->where('a.branch_id',$branch_id)->selectRaw('a.id,a.academic_year,formatDate(a.start_date) AS start_date,formatDate(a.end_date) AS end_date')->orderByRaw('a.start_date ASC')->get();
    }

    static function options_sales_agent($ss){
        $branch_id = $ss->branch_id;
        return DB::table('employees AS e')->join('persons as p','p.id','=','e.person_id')->where('e.branch_id',$branch_id)->selectRaw("e.id, CONCAT(p.last_name,' ',p.first_name) as sales_agent_name")->orderBy('sales_agent_name','ASC')->get();
    }
    static function options_term($academic_year,$ss){
       $branch_id = $ss->branch_id;
       $str_year ='1=1';
       if($academic_year>0) $str_year ='academic_year =\''.$academic_year.'\'';
       return DB::table('terms as t')->where('t.branch_id',$branch_id)->selectRaw('t.id,t.`name` as term_name')->orderByRaw('start_date DESC')->get();
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
        $rows = DB::table('status')->selectRaw('name,id')->get();
        $rows[] =['id'=>4,'name' => 'All'];
        return $rows;
    }

    static function depositeFormOption($ss){
        return(object)[
            'options_student' => DB::table('students')->selectRaw('name as student_name,id')->get(),
            'options_campus' => DB::table('campuses')->selectRaw('name as campus_name,id')->get(),
            'options_program_level' => DB::table('program_levels')->selectRaw('name as level,id')->get(),
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
        $rows = DB::table('discount_types')->selectRaw('name,id')->get();
        return $rows;
    }
}
