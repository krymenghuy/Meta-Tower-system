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
            'item_type'=>'1|choice|doc,non_doc,non-doc',
            'zone_code'=>'0|number',
            'to_country_id'=>'1|number',
            'from_country_id'=>'0|number|default =14',
            'primary_cp_id'=>'1|number',
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
            'total_price'=>'0|number|default =0.00',

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
        $d->zone_code = self::getZoneCode($to_cnt,$sender_id);
        if($d->zone_code['error'] != null) return DV::error($d->zone_code['error']);
        // return $d->zone_code['zone_code'];
        $inputs['zone_code'] = $d->zone_code['zone_code'];
        // return JDV::result($inputs); 

        // $check = isExist('shipments',$id,['description'=>$inputs['description']]);
        // if($check) return DV::error('Requirement is already to save...');
        $created = !$id;
        $save = saveData($ss,'os_shipments',['id'=>$id],$inputs,[],1,0);   
        if($save>0){
            $new_code = null;
            if($created){
                $new_code  = self::setShipmentCode($ss,5);
                $n = (object)$new_code;
                DB::table('os_shipments')->where('id',$n->last_id)->update(['code'=>$n->code]);
            }
        }
        return DV::depends($save,['action'=>'saved']);

    }

    public function getZoneCode($country_id,$sender_id){
        $pid = DB::table('sender')->where('id',$sender_id)->select('price_list_id')->first();
        $price_list_id = $pid->price_list_id;
        $zone_code = DB::table('price_list_details')->where('price_list_id',$price_list_id)->where('country_id','=',$country_id)->select('zone_code')->first();
        // return JDV::result($zone_code);
        if($zone_code == null){
            $country = DB::table('loc_countries')->where('id',$country_id)->select('name')->first();
            // return $country->name; 
            return ['error'=>'Customer price list dont have country zone : ('.$country->name.')! Chose another country.'];
        } 
        return ['error'=>'','zone_code'=>$zone_code->zone_code];
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
        if($search_value){
            $skip_row = 0;
            $str_srch = '(os.name LIKE \'%'.$search_value.'%\')';
        }
        // if($project_id){
        //     $str_where = 'r.project_id = '.$project_id;
        // }
        $skip_row = ($current_page - 1) * $per_page;
        // $price_list_id = ',(SELECT p.price_list_id FROM price_list_details as p WHERE p.country_id = os.to_country_id && p.item_type = os.item_type) as price_list_id';
        $price_list_id = ',(SELECT s.price_list_id FROM sender as s WHERE s.id = os.sender_id ) as price_list_id';
    //    $price_list = DB::table('price_list_details as p')->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('os_shipments as os')
                ->join('affiliates as sa','os.primary_cp_id','=','sa.id') // Perform an inner join
                ->join('loc_countries as lc', 'lc.id', '=', 'os.to_country_id')
                // ->join('price_list_details as p', 'p.country_id', '=', 'os.to_country_id')
                ->join('sender as sd', 'sd.id', '=', 'os.sender_id')
                ->join('os_shipment_statuses as oss', 'oss.id', '=', 'os.status_id')
                
                // ->whereRaw($str_srch)
                // ->whereRaw($str_where)
                // ->select('r.id','r.name','r.project_id','p.name as project','s.name as status ' , 'r.description' );
                ->selectRaw('os.id,os.code, os.item_type ,sd.id as sender_id, sd.name, os.remarks ,  os.zone_code, os.status_id, os.to_country_id, os.from_country_id, lc.name as to_country , os.primary_cp_id ,sa.name as primary_cp_name , sa.phone_number as primary_cp_phone , os.secondary_cp_id , os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.carrier_total_weight , os.total_price ,os.carrier_cost , os.carrier_special_charge , os.total_carrier_cost , os.total_special_charge , os.receiver_name , os.receiver_address , package_qty , oss.name as status , formatDate(os.create_date) as create_date , DATE_FORMAT(os.create_date,\'%r\') AS request_time'.$price_list_id)
                ->orderBy('os.id', 'DESC'); 
        
        $clone_query = clone $query;
        
        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        // return JDV::result($query->get());
        $rows = $query->skip($skip_row)->take($per_page)->get();
        // return $rows;

        $count = $clone_query->count('os.id');

        $unique_id = $this->getUnique_id($rows);
        // return $rows;
        $ret_rows = [];
        foreach($unique_id as $id){
            $m = $this->getShipmentList($id,$rows);  
            $from_contry = DB::table('os_shipments as os')
            ->join('loc_countries as lc', 'os.from_country_id', '=', 'lc.id')
            ->where('os.id',$m->id)->select('lc.name')->first();
            $m->from_country = $from_contry->name ?? ''; 
            $ret_rows[] = $m;  
        }   
        // $count = count($ret_rows);
        // return $count;

        return new LengthAwarePaginator($ret_rows,$count,$per_page,$current_page);
    }

    function updateStatus($status_id,$qr_code,$id=null){
        if(!in_array(strtolower($status_id),[1,2])) return DV::error('Status id is not correct');
        DB::table('os_shipments')->where('id',$id)->update(['status_id'=>$status_id,'qr_code'=>$qr_code]);
        return DV::depends(1,['update'=>'done']);
    }

    function updateCarrierInfo($arr,$shipment_id=null){
        // return $arr['carrier_total_weight'];
        $carrier_total_weight = $arr['carrier_total_weight'];
        $carrier_cost = $arr['carrier_cost'];
        $total_carrier_cost = $arr['total_carrier_cost'];
        if(!in_array(strtolower($arr['item_type']),['non_doc','doc'])) return DV::error('Item type id is not correct');
        DB::table('os_shipments')->where('id',$shipment_id)->update(['carrier_total_weight'=>$carrier_total_weight,'carrier_cost'=>$carrier_cost ,'total_carrier_cost'=>$total_carrier_cost]);
        return DV::depends(1,['update'=>'Sucess']);
    }

    function ListForBillValidate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $shipment_no = isset($d->shipment_no)?$d->shipment_no:null;
        $end_date = isset($d->end_date) ? $d->end_date : null;
        $start_date = isset($d->start_date) ? $d->start_date : null;
        // $project_id = isset($d->project_id)?$d->project_id:null;
        $str_where = '1=1';
        $str_dates = '2=2';
        if($shipment_no){
            $str_where = 'os.id = '.$shipment_no;
        }else{
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);
            if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) {
                $str_dates = "DATE(os.create_date) >= '$start_date' AND DATE(os.create_date) <= '$end_date'";
            // return $start_date;
            }else if($end_date){
               $start_date = date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days'));
               $str_dates = "DATE(os.create_date) >= '$start_date' AND DATE(os.create_date) <= '$end_date'";
            // return $str_dates;

            }
        }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('os_shipments as os')
                // ->join('affiliates as sa','os.primary_cp_id','=','sa.id') // Perform an inner join
                // ->join('loc_countries as lc', 'lc.id', '=', 'os.to_country_id')
                ->join('os_bill_validation as bv', 'bv.waybill_no', '=', 'os.qr_code')
                // ->join('price_list_details as p', 'p.country_id', '=', 'os.to_country_id')
                // ->join('os_package_statuses as st', 'st.id', '=', 'os.status_id')
                // ->join('sender as sd', 'sd.id', '=', 'os.sender_id')
                
                // ->whereRaw($str_srch)
                ->whereRaw($str_where)
                ->whereRaw($str_dates)
                // ->select('r.id','r.name','r.project_id','p.name as project','s.name as status ' , 'r.description' );
                ->selectRaw('os.id,os.code, os.item_type , bv.dest_country as to_country ,bv.unacceptable_weight ,bv.unacceptable_price ,bv.wrong_country ,bv.wrong_type , os.secondary_cp_id , os.total_weight , bv.carrier_weight as carrier_total_weight ,(bv.carrier_weight - os.total_weight) as weight_diff, os.total_price ,(bv.carrier_amount - os.total_price) as price_diff, bv.carrier_amount as total_carrier_cost , formatDate(os.create_date) as create_date')
                ->orderBy('os.id', 'DESC'); 
        
        $clone_query = clone $query;

        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        // return JDV::result($query->get());
        $rows = $query->skip($skip_row)->take($per_page)->get();
        $count = $clone_query->count('os.id');

        $unique_id = $this->getUnique_id($rows);
        // return $rows;
        $ret_rows = [];
        foreach($unique_id as $id){
            $m = $this->getShipmentList($id,$rows);  
            $from_contry = DB::table('os_shipments as os')->join('loc_countries as lc', 'os.from_country_id', '=', 'lc.id')->where('os.id',$m->id)->select('lc.name')->first();
            $m->from_country = $from_contry->name ?? ''; 
            $ret_rows[] = $m;  
        }   
        // $count = count($ret_rows);
        // return $count;

        return new LengthAwarePaginator($ret_rows,$count,$per_page,$current_page);
    }

    function getShipmentList($id,$rows){
        $i=0;
        $c;

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
        // return $rows;
        $unique_id = [];
        foreach($rows as $row){
            if(!in_array($row->id,$unique_id)){
                $unique_id[] = $row->id;
            }    
        }
        return $unique_id;
    }

    static function details($id,$ss){
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $row = DB::table('os_shipments as os')->where('os.id',$id)->where('os.branch_id',$branch_id)
        ->selectRaw('os.id,os.code,os.qr_code, os.item_type , os.remarks , os.sender_id, os.zone_code, os.status_id, os.to_country_id, os.from_country_id, os.primary_cp_id , os.secondary_cp_id , os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.carrier_total_weight , os.total_price ,os.carrier_cost , os.carrier_special_charge , os.total_carrier_cost , os.total_special_charge , os.receiver_name , os.receiver_address , package_qty , formatDate(os.create_date) as create_date , DATE_FORMAT(os.create_date,\'%r\') AS request_time')
        ->take(1)->first();
        return $row;
    }
    
    function delete($id,$ss){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('requirements as r')->where('r.id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }

    function setShipmentCode($uss,$len =5){
        $branch_id = $uss->branch_id;
        $prefix ='SH';
        $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
        $row = DB::table('shipment_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
       if($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('shipment_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
        return ['code'=>$prefix.$branch_id.formatNumber($num,$len),'last_id'=>$num];
        // return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('shipment_code_control')->insert(['branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix]);
        return ['code'=>$prefix.$branch_id.formatNumber(1,$len),'last_id'=>$row->last_id];
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
    
    static function getFormOptions($id,$ss){
        $shipment = null;
        if($id ){
            $shipment = self::details($id,$ss);
            // return $shipment;
        }
        return (object)[
            // 'project_types' => GeneralSettings::options_project_type($ss),
            'from_country'=>GeneralSettings::options_country_zone($ss),
            'to_country'=>GeneralSettings::options_country_zone($ss),
            'shipment_code'=>GeneralSettings::options_shipment_code($ss),
            'senders'=>GeneralSettings::options_sender($ss),
            'shipment_status'=> DB::table('os_shipment_statuses AS os')->selectRaw('os.id AS status_id,os.name as status_name')->get(),
            // 'sale_a'=>GeneralSettings::options_sales_affiliate($ss),
            'primary_cp'=>GeneralSettings::options_primary_cp($ss),
            'secondary_cp'=>GeneralSettings::options_secondary_cp($ss),
            'shipment' => $shipment
        ];
    }
}
