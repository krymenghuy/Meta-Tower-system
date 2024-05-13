<?php

namespace App\Models\Abm;
use DB;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator;
use Sanitizer;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class SpecialCharge //extends Model
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
            'shipment_id'=>'1|number|',
            'charge'=>'1|number|default =0.00',
            'remarks'=>'0|string|0-250', //add new column price_per_kg to table os_items
            'category'=>'1|string|1-50',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);

        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $created = !$id;
        $duplicateCategory = isExist('special_charges',$id,['category'=>$inputs['category'],'shipment_id'=>$inputs['shipment_id']]);
        if($duplicateCategory) return DV::error('This '.$inputs['category'].' is already save.');
        
        $d = (object)$res->values;
        // return JDV::result($inputs);
        $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$shipment_id)->selectRaw('os.carrier_special_charge')->take(1)->first();
        $shipmentInfo->ccarrier_special_charge += $inputs->charge;

        $id = saveData($ss,'special_charges',['id',$id],$inputs,[],1,false);
        if ($created){
            DB::table('os_shipments')->where('id',$shipment_id)->update(['carrier_special_charge'=>$shipmentInfo->ccarrier_special_charge]);
            // $pkg_count++;
        }
        // return JDV::result($p_res);

        return DV::depends($id,['Special charge'=>'Created'],'Failed to save item information');

    }


    function List(){
        return DB::table('requirements')->selectRaw('project_id,description,status_id')->get();
    }

    
    function ListPaginate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $shipment_id = isset($d->shipment_id)?$d->shipment_id:null;
        // $str_srch = '1=1';
        $str_where = '1=1';
        if($shipment_id){
            $str_where = 'sc.shipment_id = '.$shipment_id;
        }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('special_charges as sc')
                ->whereRaw($str_where)
                ->selectRaw('sc.id,sc.category,sc.shipment_id,IFNULL(sc.charge,0) as charge ,remarks');
       
        $clone_query = clone $query;
        $count = $clone_query->count('sc.id');
        $rows = $query->skip($skip_row)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    function deleteOrderitem($arr=[],$ss){
        $d = (object)$arr;
        $ss = $ss?$ss:$this->userInfo;
        $branch_id = $ss->branch_id;
        $shipment_id = isset($d->shipment_id)? Sanitizer::sanitize($d->shipment_id):null;
        $item_id = isset($d->item_id)? Sanitizer::sanitize($d->item_id):null;
        // return JDV::result('shipment_id:'.$shipment_id);
        
        $result = (object)array('status'=>'OK','error_message'=>null);
        $rows = DB::table('os_items AS o')->where('branch_id',$branch_id)->where('o.id',$item_id)->selectRaw('status_id')->limit(1)->get();
        foreach($rows as $row) $status_id = $row->status_id;

        if(empty($status_id)) {
        //   return JDV::result('status_id:'.$status_id);
           $result->error_message = "Cannot delete item because item identity is not valid";
           $result->status ='Error';
           return $result;
        }

        if($status_id >5){

          $result->error_message = "Cannot delete package with status higher than `Arrived Warehouse`";
          $result->status ='Error';
          return $result;
        }
        
        /*** deleting package will affect driver's commission, company's revenue, etc ***/

        $count = 0;
        if($status_id >=5){
            $item = DB::table('os_items')->where('branch_id',$branch_id)->where('shipment_id',$shipment_id)->where('id',$item_id)->selectRaw('billed_weight , actual_weight , allocated_kg  , item_total ')->take(1)->first();
            return JDV::result($item);
            
            DB::table('os_items')->where('branch_id',$branch_id)->where('shipment_id',$shipment_id)->where('id',$item_id)->delete();
            $count = DB::table('os_items as p')->where('p.shipment_id',$shipment_id)->count('p.id');
            $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$shipment_id)->selectRaw('os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.total_price ')->take(1)->first();
            $shipmentInfo->effective_weight -= $item->billed_weight;
            $shipmentInfo->actual_weight -= $item->actual_weight;
            $shipmentInfo->markup_weight -= $item->allocated_kg;
            $shipmentInfo->total_weight -= $item->billed_weight;
            $shipmentInfo->total_price -= $item->item_total;
            // $shipmentInfo->package_qty -= $p_res->success_count;
            // return JDV::result($shipmentInfo);

            DB::table('os_shipments')->where('id',$shipment_id)->update(['package_qty'=>$count,'effective_weight'=>$shipmentInfo->effective_weight<0??0,'actual_weight'=>$shipmentInfo->actual_weight<0??0,'markup_weight'=>$shipmentInfo->markup_weight<0??0,'total_weight'=>$shipmentInfo->total_weight<0??0,'total_price'=>$shipmentInfo->total_price<0??0]);
        } else {
            $item = DB::table('os_items')->where('branch_id',$branch_id)->where('shipment_id',$shipment_id)->where('id',$item_id)->selectRaw('billed_weight , actual_weight , allocated_kg  , item_total ')->take(1)->first();
            DB::table('os_items')->where('branch_id',$branch_id)->where('shipment_id',$shipment_id)->where('id',$item_id)->delete();
            $count = DB::table('os_items as r')->where('r.shipment_id',$shipment_id)->count('r.id'); 
            $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$shipment_id)->selectRaw('os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.total_price ')->take(1)->first();
            $shipmentInfo->effective_weight -= $item->billed_weight;
            $shipmentInfo->actual_weight -= $item->actual_weight;
            $shipmentInfo->markup_weight -= $item->allocated_kg;
            $shipmentInfo->total_weight -= $item->billed_weight;
            $shipmentInfo->total_price -= $item->item_total;
            // $shipmentInfo->package_qty -= $p_res->success_count;
            // return JDV::result($shipmentInfo);
            DB::table('os_shipments')->where('id',$shipment_id)->update(['package_qty'=>$count,'effective_weight'=>$shipmentInfo->effective_weight,'actual_weight'=>$shipmentInfo->actual_weight,'markup_weight'=>$shipmentInfo->markup_weight,'total_weight'=>$shipmentInfo->total_weight,'total_price'=>$shipmentInfo->total_price]);
            // DB::table('os_shipments')->where('id',$shipment_id)->update(['package_qty'=>$count]);
        }       
        // DB::table('os_shipments')->where('id',$shipment_id)->update([
        //     'qty'=>$count,
        //     'actual_pkg_count'=>$count
        // ]);

        // try{
        //    DB::table('order_images')->where('package_id',$package_id)->update(['package_id'=>null,'qr_code'=>null]); 
        // }catch(\Throwable $e){
        //    Log::error($e->getMessage());
        //    Log::error($e->getTraceAsString());
        // }

        return DV::depends(1,['item_count'=>$count]);
     }

    function details($id,$ss){
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $row = DB::table('requirements as r')->where('r.id',$id)->where('r.branch_id',$branch_id)->selectRaw('r.id,r.project_id,r.description,r.status_id')->first();
        return $row;
    }

    function getItemDetails($arr =[], $id = null,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $item_id  = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $d = (object)$arr;

        $shipment_id = isset($d->shipment_id)?Sanitizer::sanitize($d->shipment_id):null;
        // return JDV::result($d);

        $table = 'os_items';
        $data =  DB::table($table.' AS r')
        ->where('r.branch_id',$branch_id)
        ->where('r.shipment_id',$shipment_id)
        ->where('r.id',$d->item_id)
        ->selectRaw('r.id AS package_id,r.status_id , r.item_type,CONCAT(dim_x,\' \', dim_y,\' \', dim_h) AS size, r.actual_weight, r.billed_weight , r.allocated_kg ,r.price r,price_per_kg,r.item_total')->take(1)->first(); 
        return $data;
    }
    
    function delete($id,$ss){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('requirements as r')->where('r.id',$id)->delete();
        
        return DV::depends($delete,['action','deleted']);
    }
    
}
