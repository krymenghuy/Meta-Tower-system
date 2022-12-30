<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\DV;
use App\Models\UM;
use DB;
use Mail;
use Carbon\Carbon;
Use Session;

class Account extends Model
{
    use HasFactory;

    static function lead_id($account_id=0){
        $rows = DB::table('accounts as acc')->where('acc.id',$lead_id)->selectRaw("acc.lead_id")->limit(1)->get();
        foreach($rows as $row) return $row->lead_id;
        return null; 
     }

     function getAccountProps($account_id=0,$cols){
        $cols ="acc.id,acc.lead_type,acc.acc.lead_id";
        $rows = DB::table('accounts as acc')->where('acc.id',$lead_id)->selectRaw($cols)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null; 
     }

     function getComboItems_country(){
       return DB::table("loc_countries AS c")->selectRaw("c.id, c.name as country_name")->orderByRaw("c.name ASC")->get();
     }

    //getformOptions
    function getForm_options($d){
        $ss = UM::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return $ss; //user not authenticated
        $branch_id = $ss->branch_id;
        $data =(object)[];
        $data->countries = $this->getComboItems_country();
        $data->positions = $this->getComboItems_position();
        $data->emp_organizations = $this->getComboItems_org();
        $data->industries = $this->getComboItems_industry();
   
        $data->cities =DB::table('loc_cities AS c')->selectRaw("c.id,c.name AS city_name")->get();
        $data->occupations =DB::table('occupations AS c')->selectRaw("c.id,c.name AS occupation")->get();
        
        return $data;
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
        return  DB::table('organizations as org')->whereRaw('IFNULL(org.inactive,0) =0')->where('org.branch_id',$branch_id)->selectRaw("org.id,org.name as emp_org_name")->get();
    }

      function getComboItems_industry(){
        //$ss = getSessionInfo($d);
        //if(!$ss) return '#350'; //user not authenticated
        //if (!prn_allowed(-1)) return '@'; //need permission to do this task
        //$branch_id = sanitize($ss->branch_id);
        $id =isset($d->id)?sanitize($d->id):0;
        return  DB::table('industries as i')->whereRaw('IFNULL(inactive,0) =0')->selectRaw("i.id,i.name as industry")->get();
    }

    
     //getAccountList()
     function list($d){
        $ss = UM::getUserInfoByToken($d,-1);
        if($ss->status_code !=200) return DV::emptyResult($ss->status_code,null);
        
        $branch_id = $ss->branch_id;
        $rows = DB::table('accounts as a')->where('branch_id',$branch_id)->selectRaw("a.id,a.name,a.email,a.phone_number,a.lead_type,a.lead_id")->get();
        return $rows;
     }


}
