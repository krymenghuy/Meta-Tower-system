<?php

namespace App\Models\Abm;
use DB;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class OverseaShipment //extends Model
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
            'sender_id' => '1|number',
            'zone_code'=>'0|number',
            'to_country_id'=>'1|number',
            'from_country_id'=>'0|number',
            'primary_cp_id'=>'0|number',
            'secondary_cp_id'=>'0|number',
            
            'effective_weight'=>'0|number|default =0.00',
            'actual_weight'=>'0|number|default =0.00',
            'markup_weight'=>'0|number|default =0.00',
            'total_weight'=>'0|number|default =0.00',
            'carrier_total_weight'=>'0|number|default =0.00',
            'total_price'=>'0|number|default =0.00',
            'carrier_cost'=>'0|number|default =0.00',
            'carrier_special_charge'=>'0|number|default =0.00',
            'total_carrier_cost'=>'0|number|default =0.00',
            'total_special_charge'=>'0|number|default =0.00',

            'receiver_name'=>'0|string|1,150',
            'receiver_address'=>'0|string|1,250',
            'remarks'=>'0|string|1,200',
            'status_id'=>'0|number|default =1',
            

        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object) $inputs;
        $to_cnt = $d->to_country_id; 
        $sender_id = $d->sender_id; 
        $d->zone_code= self::getZoneCode($to_cnt,$sender_id);
        $inputs['zone_code'] = $d->zone_code->zone_code;
        // return JDV::result($inputs); 

        // $check = isExist('shipments',$id,['description'=>$inputs['description']]);
        // if($check) return DV::error('Requirement is already to save...');
        $save = saveData($ss,'os_shipments',['id'=>$id],$inputs,[],1,0);   
        return DV::depends($save,['action'=>'saved']);

    }

    public function getZoneCode($country_id,$sender_id){
        $pid = DB::table('sender')->where('id',$sender_id)->select('price_list_id')->first();
        $price_list_id = $pid->price_list_id;
        $zone_cone = DB::table('price_list_details')->where('price_list_id',$price_list_id)->where('country_id','=',$country_id)->select('zone_code')->first();
        // return JDV::result($zone_cone);
        return $zone_cone;
    }

    function getOverseaShipmentList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('os_shipments')->selectRaw('id , sender_id, remarks, zone_code, status_id, to_country_id, from_country_id,primary_cp_id,secondary_cp_id,effective_weight,actual_weight,markup_weight,total_weight,carrier_total_weight,total_price,carrier_cost , carrier_special_charge,total_carrier_cost,total_special_charge,receiver_name,receiver_address, package_qty , formatDate(create_date) as create_date,DATE_FORMAT(create_date,\'%r\') AS request_time')->get();
    }

    function getOverseaItemList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('oversea_items')->selectRaw('item_type, billed_weight, actual_weight, allocated_kg, heigth, weigth, length')->get();
    }

    function List(){
        return DB::table('requirements')->selectRaw('project_id,description,status_id')->get();
    }

    
    
    function ListPaginate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $search_value = isset($d->search_value)?$d->search_value:null;
        // $project_id = isset($d->project_id)?$d->project_id:null;
        $str_srch = '1=1';
        // $str_where = '1=1';
        // if($search_value){
        //     $skip_row = 0;
        //     $str_srch = '(os.name LIKE \'%'.$search_value.'%\')';
        // }
        // if($project_id){
        //     $str_where = 'r.project_id = '.$project_id;
        // }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('os_shipments as os')
                ->join('affiliates as sa','os.primary_cp_id','=','sa.id') // Perform an inner join
                ->join('loc_countries as lc', 'os.to_country_id', '=', 'lc.id')
                ->join('price_list_details as p', 'p.country_id', '=', 'lc.id')
                ->join('os_package_statuses as st', 'st.id', '=', 'os.status_id')
                
                // ->whereRaw($str_srch)
                // ->whereRaw($str_where)
                // ->select('r.id','r.name','r.project_id','p.name as project','s.name as status ' , 'r.description' );
                ->selectRaw('os.id, os.sender_id, os.remarks , p.price_list_id, os.zone_code, os.status_id, os.to_country_id, os.from_country_id, lc.name as to_country, lc.name as from_country , os.primary_cp_id ,sa.name as primary_cp_name , sa.phone_number as primary_cp_phone , os.secondary_cp_id , os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.carrier_total_weight , os.total_price ,os.carrier_cost , os.carrier_special_charge , os.total_carrier_cost , os.total_special_charge , os.receiver_name , os.receiver_address , package_qty , st.name as status , formatDate(os.create_date) as create_date , DATE_FORMAT(os.create_date,\'%r\') AS request_time');
        
        $clone_query = clone $query;

        $count = $clone_query->count('os.id');
        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        // return JDV::result($query->get());
        $rows = $query->skip($skip_row)->take($per_page)->get();
        $unique_id = $this->getUnique_id($rows);
        $ret_rows = [];
        foreach($unique_id as $id){
            $m = $this->getShipmentList($id,$rows);  
            $ret_rows[] = $m;  
        }   
        // return JDV::result($ret_rows);

        return new LengthAwarePaginator($ret_rows,$count,$per_page,$current_page);
    }

    function getShipmentList($id,$rows){
        $i=0;
        $c=0;

        $data = [];
        // return JDV::result($rows);
         
        do{
           if(!isset($rows[$i])) break;
           $c = $rows[$i];
    //     $item_type = strtolower($c->item_type); 
            if($c->id == $id) {  
                $data = $c;
            } 
           $i++;
        }while($c);


        // $data = (object)['data'=>$data];
        // return JDV::result($data);

        return $data;
    }

    function getUnique_id($rows){
        $unique_id = [];
        foreach($rows as $row){
            if(!in_array($row->id,$unique_id)){
                $unique_id[] = $row->id;
            }    
        }
        return $unique_id;
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
    
    // function getFormOptions($ss){
    //     return (object)[
    //       'warehouses'=>GeneralSettings::options_warehouse($ss),
    //       'senders'=>GeneralSettings::options_merchant_active($ss),
    //       'drivers'=>GeneralSettings::options_driver_active($ss),
    //       'zones'=>GeneralSettings::options_zone($ss),
    //       'vehicle_types'=>GeneralSettings::options_vehicle_type($ss),
    //       'product_types'=>GeneralSettings::options_product_type($ss)
    //     ];
    // }
    
    function getFormOptions($id,$ss){
        $shipment = null;
        if($id ){
            $shipment = self::details($id,$ss);
        }
        return (object)[
            // 'project_types' => GeneralSettings::options_project_type($ss),
            'from_country'=>GeneralSettings::options_country_zone($ss),
            'to_country'=>GeneralSettings::options_country_zone($ss),
            'senders'=>GeneralSettings::options_sender($ss),
            // 'sale_agent'=>GeneralSettings::options_sales_agent($ss),
            'shipment' => $shipment
        ];
    }
}
