<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Session;
use DB;

class GeneralSettings extends Model
{
    use HasFactory;
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

    function createOrganization($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $name = isset($d->name)?$d->name:null;
        $id = isset($d->id)?$d->id:null;

        $org_type_id = isset($d->org_type_id)?$d->org_type_id:null;
        $industry_id = isset($d->industry_id)?$d->industry_id:null;
        if ($this->org_exists($name,$id)) return DV::error('The provided organization name already exists!');  
        DB::table('organizations')->insert([
            'branch_id'=>$branch_id,
            'name'=>$name,
            'org_type_id'=>$org_type_id,
            'industry_id'=>$industry_id,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ]);
        $new_id = DB::getPdo()->lastInsertId();
        return DV::success(['org_id'=>$new_id]);
    }


    function createIndustry($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $name = $d->name;
        
        DB::table('industries')->insert([
            'branch_id'=>$branch_id,
            'name'=>$name,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ]);
        return DV::success();
    }
 
    function deleteIndustry($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $id = $d->id;
        
        DB::table('industries')->where('id',$id)->delete(); 
        return DV::success();
    }

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

    function getComboItems_industry(){
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('industries as i')->whereRaw('IFNULL(inactive,0) =0')->selectRaw("i.id,i.name as industry")->get();
    }
    
    function getComboItems_position(){
        $branch_id = Session::get('branch_id',0);
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
    function getComboItems_org(){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = Session::get('branch_id',0);
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('organizations as org')->whereRaw('IFNULL(org.inactive,0) =0')->where('org.branch_id',$branch_id)->selectRaw("org.id,org.name as org_name")->get();
    }

    static function options_labo($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('partners AS l')->whereRaw('IFNULL(l.status_id,0) =1')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as labo_name")->orderBy('l.name','ASC')->get();
    }
    static function options_partner($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('partners AS l')->whereRaw('IFNULL(l.status_id,0) =1')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as labo_name")->orderBy('l.name','ASC')->get();
    }

    static function options_labo_test($ss){
        $branch_id = $ss->branch_id;
        return  DB::table('medical_services AS s')->whereIn('s.service_type',['labo','labo test'])->where('s.branch_id',$branch_id)->selectRaw("s.id,s.name,s.description,s.price")->orderBy('s.name','ASC')->get();
    }

    //given one test_id, it returns a list of labos who provide the test
    static function getLaboTestProviders($testId,$ss){
       $branch_id = $ss->branch_id; 
       return DB::table('test_labos as l')->join('medical_services as s','s.id','=','l.test_id')->where('s.branch_id',$branch_id)->selectRaw("s.id,l.price,s.price as default_price,l.description")->get();  
    }
}
