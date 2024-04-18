<?php

namespace App\Models\Dms;
use DB;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class Shipment //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    function save($arr, $id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'zone_code'=>'1|number',
            'sender_id' => '1|number',

        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        // return JDV::result($inputs);

        // $check = isExist('shipments',$id,['description'=>$inputs['description']]);
        // if($check) return DV::error('Requirement is already to save...');
        $save = saveData($ss,'shipments',['id'=>$id],$inputs,[],1,0);
        return DV::depends($save,['action'=>'saved']);

    }

    function getShipmentList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('shipments')->selectRaw('zone_code,sender_id,formatDate(created_at) as created_at,create_user')->get();
    }
    function List(){
        return DB::table('requirements')->selectRaw('project_id,description,status_id')->get();
    }

    function getFormOptions($id,$ss){
        $requirement = null;
        if($id ){
            $requirement = self::details($id,$ss);
        }
        return (object)[
            // 'project_types' => GeneralSettings::options_project_type($ss),
            'project'=>GeneralSettings::options_project($ss),
            'requirement' => $requirement
        ];
    }
    
    function ListPaginate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $project_id = isset($d->project_id)?$d->project_id:null;
        $str_srch = '1=1';
        $str_where = '1=1';
        if($search_value){
            $skip_row = 0;
            $str_srch = '(r.name LIKE \'%'.$search_value.'%\')';
        }
        if($project_id){
            $str_where = 'r.project_id = '.$project_id;
        }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('requirements as r')
                ->join('projects as p', 'r.project_id', '=', 'p.id')
                ->join('project_statuses as s','r.status_id','=','s.id') // Perform an inner join
                ->whereRaw($str_srch)
                ->whereRaw($str_where)
                ->select('r.id','r.name','r.project_id','p.name as project','s.name as status ' , 'r.description' );
       
        $clone_query = clone $query;
        $count = $clone_query->count('r.id');
        $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        $rows = $query->skip($skip_row)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    function details($id,$ss){
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $row = DB::table('requirements as r')->where('r.id',$id)->where('r.branch_id',$branch_id)->selectRaw('r.id,r.project_id,r.description,r.status_id')->first();
        return $row;
    }
    
    function delete($id,$ss){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('requirements as r')->where('r.id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }
    
}
