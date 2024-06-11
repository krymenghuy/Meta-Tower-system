<?php

namespace App\Models\abm;
use App\Models\GeneralSettings;
use App\Models\UM;
use App\Models\PublicStorage;
use App\Models\DV;
use App\Models\JDV;
use DB;
use Sanitizer;
use Carbon\Carbon;
use Config;
use Illuminate\Pagination\LengthAwarePaginator;



class SalesAgents //extends Model
{
    protected $id = null, $userInfo = null;
    public function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    function save($arr , $id=null, $ss=null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $v_rule = [
            'name'=>'1|string|1-150',
            'sex'=>'1|choice|M,F,O',
            'agent_type_id'=>'1|number|exists=os_agent_types.id',
            'phone_number'=>'1|phone',
            'email'=>'1|email',
            'address'=>'0|address',
            //'status_code'=>'0|choice|Active,Inactive|default=Active',
            'position_title'=>'0|string|0-300'
            

        ];
        $branch_id = $ss->branch_id;
        $res = validateObject($arr,$v_rule,true,['address'=>GeneralSettings::$address_chars,'email'=>GeneralSettings::$email_chars],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $created = !$id;
        $duplicatePhoneNumber = isExist('sales_agents',$id,['phone_number'=>$inputs['phone_number']]);
        if($duplicatePhoneNumber) return DV::error('This number '.$inputs['phone_number'].' is already save.');

        $id = saveData($ss,'sales_agents',['id',$id],$inputs,[],1,false);
        if($id>0){
            $new_code = null;
            if($created){
                $new_code  = self::setAgentCode($ss,5);
                DB::table('sales_agents')->where('id',$id)->update(['code'=>$new_code]);
            }

        }
        return DV::depends($id,['id'=>$id,'new_code'=>$new_code],'Failed to save sales agents') ;

       
    }
    
    
    function setAgentCode($uss,$len =5){

        $branch_id = $uss->branch_id;
        $prefix ='SA';
        $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
        $row = DB::table('agent_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
       if($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('agent_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('agent_code_control')->insert(['branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix]);
        return $prefix.$branch_id.formatNumber(1,$len);
    }

    static function list($arr,$ss=null){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $search_value = isset($d->search_value)?$d->search_value:null;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $status_code = isset($d->status_code)? Sanitizer::sanitize($d->status_code):null;
        $agent_type =isset($d->agent_type)? $d->agent_type : null; 
        
        $str_agent_type = '3=3';
        $str_status = '1=1';
        $str_search = '2=2';
        if($search_value){
          $search_value = escape_like_str($search_value);
           $str_search = ' (d.code =\''.$search_value.'\' OR d.name LIKE \'%'.$search_value.'%\' OR d.phone_number =\''.$search_value.'\')';
        }else{
          $str_agent_type = $agent_type? 'd.agent_type_id ='.$agent_type : '3=3';
          $str_status = $status_code? 'd.status_code =\''.$status_code.'\'' : '1=1';
        }
       
        $query = DB::table('sales_agents AS d')
        ->join('sales_agent_types AS t','t.id','=','d.agent_type_id')
        ->where('branch_id',$branch_id)
        ->whereRaw($str_search)
        ->whereRaw($str_status)
        ->whereRaw($str_agent_type)
        ->selectRaw('d.id,d.name,d.code,d.email,d.phone_number,d.address,d.status_code,t.id as agent_type_id,t.name AS agent_type,formatDate(d.create_date) AS start_date,formatTime(d.create_date) AS create_date,d.create_user,photo_file_name')->orderBy('d.id', 'DESC'); 
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

      
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    




}
