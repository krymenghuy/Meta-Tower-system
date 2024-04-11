<?php

namespace App\Models\abm;
use DB;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Sanitizer;
class Supplier //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    function save($arr, $id=null,$ss=null){
        // $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id'=>'0|identity=1',
            'name' => '1|string|1-150',
            'phone_number'=>'1|string|1-20',
            'email'=>'0|string',
            'address'=>'0|number',
            'sales_agent_id'=>'0|number',
            'code'=>'0|string|0-25',
            'price_list_id'=>'0|number',
            'status_code'=>'0|string|default =active',
        ];
        $eml_char = ['$','#','@','!','.','-','_','=','?'];
        $res = validateObject($arr,$v_rule,1,['email'=>$eml_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        // return JDV::result($inputs);
        $phone_err = $this->checkUniquePerson($branch_id,$inputs['phone_number'],$id);
        if ($phone_err) return DV::error( $phone_err);  
        // $check = isExist('suppliers',$id,['phone_number'=>$inputs['phone_number']]);
        // if($check) return DV::error('Phone number is already save...');
        $supplier_created = !$id;
        $id = saveData($ss,'suppliers',['id'=>$id],$inputs,[],1,0);   
        if($id > 0){
            $new_code = null;
            if ($supplier_created){
                $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
                //$inputs['code'] = $new_code;
                DB::table('suppliers')->where('id',$id)->update(['code'=>$new_code]);
             }

        }
        return DV::depends($id,['action'=>'saved']);

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
    
    function getSuplierListPaginate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $str_srch = '1=1';
        $str_where = '1=1';
        if($search_value){
            $skip_row = 0;
            $str_srch = '(s.name LIKE \'%'.$search_value.'%\')';
        }
        if($price_list_id){
            $str_where = 's.price_list_id = '.$price_list_id;
        }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('suppliers as s')
                ->whereRaw($str_srch)
                ->whereRaw($str_where)
                ->selectRaw('s.id ,s.code, s.name, s.phone_number, s.email, s.address, s.status_code, s.price_list_id,getPriceListName(s.price_list_id) AS price_list_name,s.status_code,s.sales_agent_id,s.create_user,formatDate(s.create_date) as created_at,DATE_FORMAT(s.create_date,\'%r\') AS request_time' );
       
        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        $rows = $query->skip($skip_row)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    function setPriceList($price_list_id,$id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $p = getDataRow('price_list_names',["id"=>$price_list_id],"id,name");
        if(!$p) return DV::error("Price list ID is not valid");
        $p_name = $p->name;
        DB::table('suppliers')->where('id',$id)->update(array(
        'price_list_id'=>$price_list_id));
        // return JDV::result($price_list_id );
        return DV::success(['list_name'=>$p_name,'list_id'=>$price_list_id]);
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

    function getNextSenderCode($uss,$len =4){
        $branch_id = $uss->branch_id;
        $prefix ='SP';
        $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
        $row = DB::table('sender_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
        if($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('sender_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('sender_code_control')->insert(array('branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix));
        return $prefix.$branch_id.formatNumber(1,$len);
      }
    
}
