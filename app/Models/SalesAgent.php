<?php

namespace App\Models;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
 
use DB;
use Sanitizer;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator; 
use App\Models\PublicStorage;

class SalesAgent //extends Model
{
    protected $id = null, $userInfo = null;
    public function __construct($id=null,$userInfo =null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo; 
    }

    function delete($id=null,$ss =null){
       $id = $id? $id: $this->id;
       $x = DB::table('sales_agents')->where('id',$id)->delete();
       DB::table('sender')->where('sales_agent_id',$id)->update(['sales_agent_id'=>null]);
       return DV::depends($x,'Failed to delete sales agent'); 
    }

    function save($arr, $id = null, $ss = null){
      $v_rule = [
         'name'=>'1|string|1-150',
         'sex'=>'1|choice|M,F,O',
         'agent_type'=>'1|choice|Part Time, Full Time, Any',
         'phone_number'=>'1|phone',
         'email'=>'0|email',
         'address'=>'0|address',
         'start_date'=>'0|date',
         'photo'=>'0|image',
         'commission'=>'0|number',
         'status_code' => '0|choice|Active,Inactive|default=Active'
      ];

      $res = validateObject($arr,$v_rule,true,['email'=>['@','-','.','_']],$ss->lang,false,null);
      if($res->error) return DV::error($res->error);
      $inputs = $res->values;
      $id = saveData($ss,'sales_agents',['id'=>$id],$inputs,[],1,false);
      return DV::depends($id,[],'Failed to save sales agent');
    }
 
    function agent_name_exists($branch_id,$name,$id) {
       $str_id = $id>0 ? 'id <> '.$id:'1=1'; 
       $row = DB::table('sales_agents AS a')->where('a.branch_id',$branch_id)->where('a.name',$name)->whereRaw($str_id)->selectRaw('id')->take(1)->first();
       return $row?true:false;
    }

    function setAgentCode($uss,$len =5){
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
 
    static function getFormOptions($id,$ss){
        $d = null;
        if ($id) $d = self::details($id,$ss);
        return (object)[
           'details'=>$d, 
           'statuses'=>DB::table('sales_agent_statuses AS ss')->selectRaw('ss.code As status_code,ss.name AS status_name')->get(),
           'agent_types'=> DB::table('sales_agent_types')->selectRaw('id,name AS agent_type')->get(),
        ];
    }

    static function defaultImage($branch_id){
        return PublicStorage::getUrl($branch_id,'agent','image').'def-agent.png';
    }

    static function list($arr,$ss=null){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $status_code = isset($d->status_code)?Sanitizer::sanitize($d->status_code):null;
        $agent_type_id =isset( $d->agent_type_id)? Sanitizer::sanitize( $d->agent_type_id):null;
        
        $str_status = $status_code? 'status_code =\''.$status_code.'\'' : '1=1';
        $str_agent_type = $agent_type_id > 0 ? 'agent_type_id ='.$agent_type_id : '2=2';

        $query = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('branch_id',$branch_id)->whereRaw($str_status)->whereRaw($str_agent_type)->selectRaw('d.id,d.name,d.code,d.email,d.phone_number,d.address,d.status_code,t.name AS agent_type,photo_file_name'); 
        $count_query = clone $query;
        $count = $count_query->count('d.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row){
          $row->image_url = '';
          //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
          if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'agent','image').$row->photo_file_name;
          unset($row->photo_file_name);
          if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        }
       
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    }

    static function listAll($arr,$ss=null){
        $ss =$ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $d = (object)$arr;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $status_code = isset($d->status_code)?Sanitizer::sanitize($d->status_code):null;
        $agent_type_id =isset( $d->agent_type_id)? Sanitizer::sanitize( $d->agent_type_id):null;
        
        $str_status = $status_code? 'status_code =\''.$status_code.'\'' : '1=1';
        $str_agent_type = $agent_type_id > 0 ? 'agent_type_id ='.$agent_type_id : '2=2';

        $rows = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('branch_id',$branch_id)->whereRaw($str_status)->whereRaw($str_agent_type)->selectRaw('d.id,d.name,d.code,d.email,d.phone_number,d.address,d.status_code,t.name AS agent_type')->get(); 
   
        foreach($rows as $row){
          $row->image_url = '';
          //$row->mobile_login = \App\Models\UM::getAccountInfo($row->id,'official_id');
          if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'agent','image').$row->photo_file_name;
          unset($row->photo_file_name);
          if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        }
        return $rows;
    }

    static function details($id,$ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('sales_agents AS d')->join('sales_agent_types AS t','t.id','=','d.agent_type_id')->where('d.id',$id)->selectRaw('d.id,d.name,d.agent_type_id,d.code,d.email,d.phone_number,d.address,d.status_code,d.commission, t.name AS agent_type,d.photo_file_name')->take(1)->first(); 
        if($row){
           $row->image_url = PublicStorage::getUrl($branch_id,'agent','image').$row->photo_file_name;
        } 
        return $row;
    }

    function setStatus($status_code,$id=null,$ss = null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id? $id : $this->id;
        //$branch_id = $ss->branch_id;
        $x = DB::table('sales_agents')->where('id',$id)->update(['status_code'=>$status_code]);
        return DV::depends($x,null,'Failed to update Agent status');
    }
}
