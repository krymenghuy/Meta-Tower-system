<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Session;
use DB;
use Carbon\Carbon;

class SalesAgent extends Model
{
    use HasFactory;

    function SaveSalesAgent($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $agent_id = isset($d->agent_id)?sanitize($d->agent_id):null;
        $agent_type_id = isset($d->agent_type_id)?$d->agent_type_id:null;
        $name = isset($d->name)?sanitize($d->name):null;
        $name_kh = isset($d->name_kh)?sanitize($d->name_kh):null;
        $sex = isset($d->sex)?sanitize($d->sex):null;
        $phone_number =isset($d->phone_number)?sanitize($d->phone_number):null;
        $email =isset($d->email)?sanitize($d->email):null;
        $address =isset($d->address)?sanitize($d->address):null;
        $commission =isset($d->commission)?sanitize($d->commission):0;
        $commission_type = isset($d->commission_type)?$d->commission_type:'per_item'; //default
        $agent_code  = isset($d->code)?$d->code:null;
        $status_code ='Active';

        $result = (object)array('status'=>'OK','error_message'=>null);
        if (empty($name)) {
            $result->error_message ='Agent Name cannot be empty!';
            $result->status ='Error';
            return $result;
        }
        if ($this->agent_name_exists($branch_id,$name,$agent_id)) {
            $result->error_message ='Agent name already exists';
            $result->status ='Error';
            return $result;
        }
        if (empty($phone_number)) {
            $result->error_message ='Phone number is not valid';
            $result->status ='Error';
            return $result;
        }
        if ( $agent_type_id != 1 && $agent_type_id !=2 ) {
            $result->error_message ='agent type is not valid';
            $result->status ='Error';
            return $result;
        } 

        if ($agent_id > 0) {
                    DB::table('sales_agents')->where('branch_id',$branch_id)->where('id',$agent_id)->update(array(
                    'name'=>$name,
                    'name_kh'=>$name_kh,
                    'sex'=>$sex,
                    'email'=>$email,
                    'phone_number'=>$phone_number,
                    'address'=>$address,
                    'commission'=>$commission,
                    'commission_type'=>$commission_type,
                    'agent_type_id'=>$agent_type_id,
                    'status_code'=>$status_code,
                    'create_date'=>getNowTime(),
                    'create_user'=>$ss->login_name 
                    ));

        } else{
            $agent_code = $this->getNextAgentCode($ss,5);
            DB::table('sales_agents')->insert(array(
                'branch_id'=>$branch_id,
                'name'=>$name,
                'name_kh'=>$name_kh,
                'sex'=>$sex, 
                'code'=>$agent_code,
                'email'=>$email,
                'phone_number'=>$phone_number,
                'address'=>$address,
                'commission'=>$commission,
                'commission_type'=>$commission_type,
                'agent_type_id'=>$agent_type_id,
                'status_code'=>$status_code,
                'create_date'=>getNowTime(),
                'create_user'=>$ss->login_name 
             ));     
        }
      
        $result->status ='OK';
        $result->error_message = null;
        $result->code = $agent_code;
        return $result;
    }

    function agent_name_exists($branch_id,$name,$id) {
       if ($id>0) 
          return DB::table('sales_agents AS a')->where('branch_id',$branch_id)->where('name',$name)->whereRaw('a.id <> '.$id)->limit(1)->exists();
       else DB::table('sales_agents AS a')->where('branch_id',$branch_id)->where('name',$name)->limit(1)->exists();   
    }

    function getNextAgentCode($uss,$len =5){
        $branch_id = $uss->branch_id;
        $prefix ='';
        $rows = DB::table('agent_code_control AS c')->where('branch_id',$branch_id)->limit(1)->selectRaw('TRIM(c.prefix) AS prefix,c.last_agent_number')->get();
        foreach($rows as $row) {
            $num = $row->last_agent_number;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('agent_code_control')->where('branch_id',$branch_id)->update(array('last_agent_number'=>$num));
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('agent_code_control')->insert(array('branch_id'=>$branch_id,'last_agent_number'=>1));
        return $prefix.$branch_id.formatNumber(1,$len);
    }

    function getFormData_salesAgent($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        //$branch_id = sanitize($ss->branch_id);
        $data = (object)['statuses'=>[],'agent_types'=>[]]; 
        $data->statuses = DB::table('sales_agent_statuses AS ss')->selectRaw('ss.code As status_code,ss.name AS status_name')->get();
        $data->agent_types = DB::table('sales_agent_types')->selectRaw('id,name AS agent_type')->get();
        return $data;
    }

    function deleteSalesAgent($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $agent_id= isset($d->agent_id)?sanitize($d->agent_id):null;
        DB::table('sales_agents')->where('branch_id',$branch_id)->where('id',$agent_id)->delete();
        DB::table('sender')->where('branch_id',$branch_id)->where('sales_agent_id',$agent_id)->update(array('sales_agent_id'=>null));
        return null;
    }
    function getSalesAgentList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $status_code = isset($d->status_code)?sanitize($d->status_code):null;
        $agent_type_id =isset( $d->agent_type_id)? sanitize( $d->agent_type_id):null;
        $str_agent_type = null;
        if ($agent_type_id > 0) $str_agent_type = " AND d.agent_type_id ='".$agent_type_id."' ";

        $more_wheres = '1=1'.$str_agent_type;
        $rows = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw('d.id,d.name,d.code,d.email,d.phone_number,d.address,d.status_code,t.name AS agent_type')->get(); 
        return $rows;
    }
    function getSalesAgentById($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $agent_id = isset($d->agent_id)?sanitize($d->agent_id):null;
        $rows = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('d.branch_id',$branch_id)->where('d.id',$agent_id)->selectRaw('d.id,d.name,d.agent_type_id,d.code,d.email,d.phone_number,d.address,d.status_code,d.commission, d.commission_type, t.name AS agent_type')->limit(1)->get(); 
        foreach($rows as $row) return $row;
        return null;
    }
    function updateSalesAgentStatus($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $agent_id = isset($d->agent_id)?sanitize($d->agent_id):null;
        $status_code = isset($d->status_code)?sanitize($d->status_code):null;
        DB::table('sales_agents')->where('branch_id',$branch_id)->where('id',$agent_id)->update(array('status_code'=>$status_code));
        return null;
    }
}
