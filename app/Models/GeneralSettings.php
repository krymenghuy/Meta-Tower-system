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
 
    function occupation_exists($branch_id, $name){
       $rows = DB::table('occupations as c')->where('branch_id',$branch_id)->where('name',$name)->selectRaw("id")->limit(1)->get();
       foreach($rows as $row) return true;
       return false;
    }

    function purpose_exists($branch_id, $name){
        $rows = DB::table('loan_purposes as c')->where('branch_id',$branch_id)->where('name',$name)->selectRaw("id")->limit(1)->get();
        foreach($rows as $row) return true;
        return false;
    }
  
    function getReportFilter_options($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $rows = DB::table('loans as l')->join('persons as p','p.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->where('l.status_id',1)->whereRaw('IFNULL(l.inactive,0) =0')->selectRaw("l.id,l.code as loan_code, CONCAT(p.last_name,' ',p.first_name, ' (', l.code,')') AS loan_name, l.status_id,l.monthly_interest_rate")->get();
        return (object)[
            'loans'=>$rows,
            'staffs'=>UM::user_list_by_roles($branch_id,[1,2])
        ];

    }
 
    function getPaymentFormOptions($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $rows = DB::table('pmt_methods')->where('branch_id',$branch_id)->selectRaw("name as pmt_method,category,id")->get();
        return (object)[
          'pmt_methods'=>$rows
        ];
    }

    function getProgramOptions($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $id = isset($d->id)?sanitize($d->id):null;
        $data = (object)['levels'=>[],'degrees'=>[]];
        $data->levels = DB::table('academic_levels AS l')->selectRaw('id,level_name AS level_name')->orderByRaw('l.id ASC')->get();
        $data->degrees = DB::table('academic_degrees AS l')->where('branch_id',$branch_id)->selectRaw('name AS degree_name')->orderByRaw('l.name ASC')->get();
        $data->programs = DB::table('academic_programs AS l')->where('l.branch_id',$branch_id)->selectRaw('l.id,l.name AS program_name')->orderByRaw('l.level_id ASC')->get();
        return $data;
    }

    function program_exists($name,$id){
        $rows = [];
        if($id>0) 
         $rows = DB::table('academic_programs as p')->where('name',$name)->whereRaw("p.id <> $id")->select('id')->limit(1)->get();
        else
          $rows = DB::table('academic_programs as p')->where('name',$name)->select('id')->limit(1)->get();
        if(isset($rows[0])) return true;
        return false; 
    }
    function saveProgram($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,207)) return DV::error('No access to Loan Application');
        $branch_id = sanitize($ss->branch_id);
        $id = isset($d->id)?sanitize($d->id):null;
        $name =isset( $d->name)?sanitize( $d->name):null;
        $major_name = isset($d->major_name)?sanitize($d->major_name):null;
        $degree_name = isset($d->degree_name)?sanitize($d->degree_name):null;
        $level_id = isset($d->level_id)?sanitize($d->level_id):null;

        $err = DV::getErrors($d,['level_id'=>'positive','name'=>'string','major_name','string','degree_name'=>'string'],'academic_program');
        if($err) return DV::error($err);

        //begin:: validate degree and level
          $item = null;
          $rows = DB::table('academic_degrees as d')->where('name',$degree_name)->selectRaw('level_id,name')->limit(1)->get();
          foreach($rows as $row) $item = $row;
          if(!$item) return DV::error('Degree name is not valid or does not exist');
          if($item->level_id != $level_id) return DV::error('The provided Level is not correct for the degree name');
        //end:: validate degree and level

        if($this->program_exists($name,$id)) return DV::error('Program name already in use');

        if($id>0){
             DB::table('academic_programs')->where('id',$id)->update([
                 //'branch_id'=>$branch_id,
                 'level_id'=>$level_id,
                 'name'=>$name,
                 'degree_name'=>$degree_name,
                 'major_name'=>$major_name,
                 'create_user'=>$ss->login_name,
                 'create_date'=>getNowTime()
             ]);
        }else{
          DB::table('academic_programs')->where('id',$id)->insert([
                 'branch_id'=>$branch_id,
                 'level_id'=>$level_id,
                 'name'=>$name,
                 'degree_name'=>$degree_name,
                 'major_name'=>$major_name,
                 'create_user'=>$ss->login_name,
                 'create_date'=>getNowTime()
             ]);
           $id = DB::getPdo()->lastInsertId();
        }
        return DV::success(['program_id'=>$id]);
    }  

    function deleteProductType($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $id = isset($d->id)?sanitize($d->id):null;
        DB::table('product_types')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return null;
    }

    function sendMessage($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(100)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $phone_number = isset($d->phone_number)?sanitize($d->phone_number):null;
        $text = isset($d->text)?sanitize($d->text):null;

                $fields = array(
                    //'app_id' => "5eb5a37e-b458-11e3-ac11-000c2940e62c",
                    'gw-username'=>'xperasoft',
                    'gw-password'=>'bchsd',
                    'gw-to'=>$phone_number,
                    'gw-from'=>'Dolgoal',
                    'gw-text'=>$text
                    //'token' =>'di5B9xXcZeULyNAFSsdv9COWOzBPWE',
                );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "http://sms.plasgate.com:29062/cgi-bin/sendsms");
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json; charset=utf-8',
                'Authorization: Basic di5B9xXcZeULyNAFSsdv9COWOzBPWE'
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
            
            $response = curl_exec($ch);
            curl_close($ch);
            
            return $response;
    }

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

    function getComboitems_emp_options($d){
     return (object)[
         'positions'=> $this->getComboItems_position(),
         'organizations'=>$this->getComboItems_org(),
         'industries'=>$this->getComboItems_industry()
     ];
    }

    function getComboItems_industry(){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        //$branch_id = sanitize($ss->branch_id);
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('industries as i')->whereRaw('IFNULL(inactive,0) =0')->selectRaw("i.id,i.name as industry")->get();
    }

    function getComboItems_position(){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = Session::get('branch_id',0);
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('positions as l')->whereRaw('IFNULL(l.inactive,0) =0')->where('l.branch_id',$branch_id)->selectRaw("l.id,l.name as position_title")->get();
    }

    function getComboItems_org(){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = Session::get('branch_id',0);
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('organizations as org')->whereRaw('IFNULL(org.inactive,0) =0')->where('org.branch_id',$branch_id)->selectRaw("org.id,org.name as org_name")->get();
    }
}
