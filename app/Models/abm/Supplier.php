<?php

namespace App\Models\abm;
use DB;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class Supplier //extends Model
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
            'name' => '1|string|1-150',
            'phone_number'=>'1|string|1-20',
            'email'=>'0|string',
            'address'=>'0|number',
            'sales_agent_id'=>'0|number',
            'price_list_id'=>'0|number',
            'status_code'=>'0|string|default =active',
        ];
        $eml_char = ['$','#','@','!','.','-','_','=','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$eml_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        // return JDV::result($inputs);
        $phone_err = $this->checkUniquePerson($branch_id,$inputs['phone_number'],$id);
        if ($phone_err) return DV::error( $phone_err);  
        // $check = isExist('suppliers',$id,['phone_number'=>$inputs['phone_number']]);
        // if($check) return DV::error('Phone number is already save...');
        $save = saveData($ss,'suppliers',['id'=>$id],$inputs,[],1,0);   
        return DV::depends($save,['action'=>'saved']);

    }

    function getSuplierList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('suppliers')->selectRaw('id,name, phone_number, email, address,status_code,price_list_id,formatDate(create_date) as create_date,DATE_FORMAT(create_date,\'%r\') AS request_time')->get();
    }

    function checkUniquePerson($branch_id,$phone_number,$id=null){
        $str_id ="1=1";
        if(!$phone_number) return 'Phone number cannot be empty';
        if ($id>0) $str_id="s.id <> $id";
        $x = DB::table('suppliers as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'Phone number "'.$phone_number.'" is already save...';
        return null;
      }

    function getOverseaItemList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('oversea_items')->selectRaw('item_type, billed_weight, actual_weight, allocated_kg, heigth, weigth, length')->get();
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
