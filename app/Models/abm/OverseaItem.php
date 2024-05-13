<?php

namespace App\Models\Abm;
use DB;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator;
use Sanitizer;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class OverseaItem //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }

    function validatePackages($ss,$shipment,$items){
        $branch_id = $ss->branch_id;
        $max_price = 1000;
        $c = null;
        $i = 0;
        $success_count = 0;
        
      $packageModel = new \App\Models\Abm\Package();
      $success_items = []; 
      $sender_id = $shipment->sender_id;
      if (!$sender_id) return DV::error('The provided Merchant ID is empty and is not correct'); 
        do{
           $c = isset($items[$i])? (object)$items[$i]:null;
           if(!$c) break;
            $c->shipment_id = isset($shipment->id)? $shipment->id: (isset($shipment->shipment_id)? $shipment->shipment_id:null); 
            $c->item_type = isset($c->item_type) ? $c->item_type: $shipment->item_type;
            // $c->country_id = isset($c->country_id) ? $c->country_id: $shipment->country_id;
            // $remarks = isset($c->remarks) ? $c->remarks: '';
            // if(!isset($c->delivery_notes)) $c->delivery_notes = $remarks;
            // $c->warehouse_id = isset($shipment->warehouse_id) ? $shipment->warehouse_id:  null;
            // if (!isPhoneNumber($c->receiver_phone)) return DV::error('Receiver phone is not correct');
            // if (!$c->warehouse_id) return DV::error('No warehouse ID provided for package with reeiver phone '.$c->receiver_phone);
            /** Default df_payer to "sender". NOTE: that mobile app does not send df_payer via "create-delivery-shipment" */
            // $c->df_payer = isset($c->df_payer)? $c->df_payer : 'sender';
            // if(!in_array(strtolower($c->df_payer),['sender','receiver'])) return DV::error('Fee payer must be Sender or Receiver. Given value is '.$c->df_payer); 
            // $c->forwarding_cost = floatval(isset($c->forwarding_cost)?$c->forwarding_cost:0);
            // $c->forwarding_cost =  $c->forwarding_cost ?? 0;
            $c->billed_weight = floatval(isset($c->billed_weight) ? $c->billed_weight:0);
            $c->billed_weight = $c->billed_weight ?? 0;             
            $c->dim_x = floatval(isset($c->dim_x) ? $c->dim_x:  0);
            $c->dim_x  =$c->dim_x ?? 0;
            $c->dim_y = floatval(isset($c->dim_y) ? $c->dim_y:  0);
            $c->dim_y = $c->dim_y ?? 0;
            $c->dim_h = floatval(isset($c->dim_h) ? $c->dim_h: 0);
            $c->dim_h = $c->dim_h ?? 0;
            $c->actual_weight = floatval(isset($c->actual_weight) ? $c->actual_weight: 0);
            $c->actual_weight = $c->actual_weight ?? 0;
            $c->allocated_kg = floatval(isset($c->allocated_kg) ? $c->allocated_kg: 0);
            $c->allocated_kg = $c->allocated_kg ?? 0;
            // $c->delivery_type = isset($c->delivery_type) ? $c->delivery_type: $shipment->delivery_type;
            // if (!in_array(strtolower($c->delivery_type),['normal','fast'])) return DV::error('Service type must be either Normal or Fast'); 
            
            // $c->zone_code = isset($c->zone_code)?$c->zone_code:$shipment->zone_code;
            // $zone = $this->getZoneByCode($branch_id,$c->zone_code);
            // if(!$zone) return DV::error('Zone code ? does not exist. Given zone code is '.(!$c->zone_code? 'Empty':$c->zone_code).'::'.$c->zone_code);
            // if (!DeliveryZone::isCovered($zone->zone_code)) return DV::error('Zone ? is not within our coverage area::'.$zone->zone_name.' ('.$zone->zone_code.')');
            
            // $c->zone_name = $zone->zone_name;
            // if(!isset($c->receiver_phone)) return DV::error('Receiver phone number is required');
            // $c->receiver_phone = str_replace(' ','',$c->receiver_phone);
            // if(!isset($c->receiver_name)) $c->receiver_name = $c->receiver_phone;
            /** If no receiver address then use remarks as receiver address */
            // if(!isset($c->receiver_address)) $c->receiver_address = $c->zone_name;
            // if (!$c->receiver_address) $c->receiver_address = $c->zone_name; 
            // if (!$c->delivery_notes) $c->delivery_notes = $remarks;
            //Process item BilledWeight
            
             //Process package size
             $size = isset($c->size)?$c->size:null;
             if($size){
                 $m = (object)$size;
                 if (isset($m->length)){
                     $c->dim_x =$m->length;
                     $c->dim_y =$m->width;
                     $c->dim_h =$m->height;
                 }
             }else{
                     $c->dim_x =0;
                     $c->dim_y =0;
                     $c->dim_h =0;
             }
            $c->billed_weight = floatval($c->billed_weight)?$c->billed_weight:0; 
            if (!$c->billed_weight){
                $systematic_billed_kg = $this->getBilledWeight($c->dim_x,$c->dim_y,$c->dim_h, $c->actual_weight);
                $c->billed_weight = $systematic_billed_kg;
                // return JDV::result($c->billed_weight);
            }

            //  return JDV::result($c->billed_weight);


           //end process pacakge size

            $p = $packageModel->getPriceInfo($branch_id,$sender_id,$c->item_type,$shipment->zone_code,$c->billed_weight,$shipment->country_id);
        //    return JDV::result($p);
            
            if($p->status ==='Error'){
               return DV::error($p->error_message.' Zone: '.$shipment->zone_code);
            }else{
            //   $base_fee = $p->base_fee;
              $delivery_fee = $p->delivery_fee;
              $allocated_price = $c->allocated_kg * $p->price_per_kg;
              $c->price_per_kg = isset($c->price_per_kg) ? $c->price_per_kg: $p->price_per_kg;

              $c->price = $delivery_fee ;
            //   $cod_fee_percent = is_numeric($p->cod_fee_percent)?$p->cod_fee_percent:0;
            //   if(!isset($c->cod)) $c->cod = $p->cod;
            }

             if(!is_numeric($c->price)) $c->price =0;

             /** ensure the price and cod are always correct and consistent */
            //  $c->cod_fee =0;
            
            //  if($c->price > 0) 
            //  {
            //     if ($c->price >$max_price) return DV::error('ថ្លៃទំនិញធំបំផុតគឺ '.$max_price.' USD');
            //     $c->cod =1;
            //  }
            //  else{
            //     if($c->price < 0) return DV::error('ថ្លៃទំនិញមិនត្រឹមត្រូវ');
            //      $c->cod =0;  
            //  }
            //  $cod_amount =0;
            //  if ($c->cod ==1) {
            //    $c->cod_fee = ($c->price + $base_fee + $delivery_fee) * $cod_fee_percent/100;
            //    $cod_amount = $c->price;
            //  }
             //assume that Seller/Merrchant always has to pay taxi fee
            //  $driver_total = $cod_amount;
            //  $sender_total = $c->cod_fee + $c->forwarding_cost;
       
            //  if (strtolower($c->df_payer) ==='receiver') {
            //     $driver_total += $base_fee + $delivery_fee;
            //  }else{
            //     $sender_total += $base_fee + $delivery_fee; 
            //  }
            //  $c->delivery_fee = $delivery_fee;
            //  $c->base_fee = $base_fee;
            //  $c->sender_total = $sender_total;
             $c->item_total = number_format($c->price + $allocated_price,2);
            //  $c->outstanding =0;
            //  if(!isset($c->status_id)) $c->status_id =1;
            //  $c->sender_id = $sender_id;
             unset($c->size);
            // return JDV::result($c);

             $success_items[] = $c;
             $success_count++;
             $i++;
      }while($c);

      return (object)[
        'status'=>'OK',
        'status_code'=>200,
        'success_items'=>$success_items,
        'success_count'=>$success_count
      ];
    }
    
    function getBilledWeight($dim_x, $dim_y, $dim_h, $actual_weight, $adjusted_kg =0) {
        // return JDV::result($dim_h.$dim_y.$dim_x);
        $dim_x = floatval($dim_x) ?? 0;
        $dim_y = floatval($dim_y) ?? 0;
        $dim_h = floatval($dim_h) ?? 0;
        $actual_weight = floatval($actual_weight) ?? 0;
        $adjusted_kg = floatval($adjusted_kg) ?? 0;
        $b = ($dim_x * $dim_y * $dim_h)/5000; //culculate size 

        if ($b > $actual_weight) 
          return ($b + $adjusted_kg);
        else
           return ($actual_weight + $adjusted_kg);  
    }

    function createOverseaItem($arr, $id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'item_type'=>'1|string|0-20|default = doc',
            'shipment_id'=>'0|number|',
            'billed_weight'=>'0|number|default =0.00',
            'actual_weight'=>'0|number|default =0.00',
            'allocated_kg'=>'0|number|default =0.00',
            'price'=>'0|number|default =0.00',
            'price_per_kg'=>'0|number|default =0.00', //add new column price_per_kg to table os_items
            'item_total'=>'0|number|default =0.00',
            // 'heigth'=>'0|number|default =0.00',
            // 'weigth'=>'0|number|default =0.00',
            // 'length'=>'0|number|default =0.00',
            'size'=>'0|array|0-100',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);

        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        
        $d = (object)$res->values;
        // return JDV::result($d->shipment_id);
        $shipment_id = $d->shipment_id;
        $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$shipment_id)->selectRaw('os.id,os.sender_id,os.to_country_id,os.zone_code')->take(1)->first();
        // return JDV::result($shipmentInfo);
        if(!$shipmentInfo) return DV::error('Shipment Information is missing');
        $shipment = (object)['shipment_id'=>$shipmentInfo->id,'sender_id'=>$shipmentInfo->sender_id,'item_type'=>$d->item_type ,'country_id'=>$shipmentInfo->to_country_id,'zone_code'=>$shipmentInfo->zone_code];
        // $m = (object)$d->size;
        // if (isset($m->length)){
        //     $d->dim_x =$m->length;
        //     $d->dim_y =$m->width;
        //     $d->dim_h =$m->height;
        // return JDV::result($d);
        // }
        $p_res = self::validatePackages($ss,$shipment,[$d]);
        // return JDV::result($p_res);
        if ($p_res->status ==='Error') return DV::error($p_res->error_message);
        $item = null;
        if($p_res->success_items[0]){
            $item = $p_res->success_items[0];
        }
        if($p_res->success_count){
        $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$shipment_id)->selectRaw('os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.total_price , os.package_qty')->take(1)->first();
            $shipmentInfo->effective_weight += $item->billed_weight;
            $shipmentInfo->actual_weight += $item->actual_weight;
            $shipmentInfo->markup_weight += $item->allocated_kg;
            $shipmentInfo->total_weight += $item->billed_weight;
            $shipmentInfo->total_price += $item->item_total;
            $shipmentInfo->package_qty += $p_res->success_count;
        // return JDV::result($shipmentInfo);
        // DB::table('os_shipments');
        }
        if (!$item) return DV::error('Package data was not acceptable maybe it is not completely correct!');
        $item->shipment_id = $shipment_id;
        if(!isset($item->status_id)) $item->status_id = 1;
        // $check = isExist('os_shipments',$id,['remarks'=>$inputs['remarks']]);
        // if($check) return DV::error('Requirement is already to save...');
        // return JDV::result($item);
        $is_insert = !$id;
        $id = saveData($ss,'os_items',['id'=>$id],(array)$item,[],1,0);   
        $pkg_count = $shipmentInfo->package_qty;
        // return JDV::result($is_insert);
        if ($is_insert){
            DB::table('os_shipments')->where('id',$shipment_id)->update(['package_qty'=>$pkg_count,'effective_weight'=>$shipmentInfo->effective_weight,'actual_weight'=>$shipmentInfo->actual_weight,'markup_weight'=>$shipmentInfo->markup_weight,'total_weight'=>$shipmentInfo->total_weight,'total_price'=>$shipmentInfo->total_price]);
            // $pkg_count++;
        }
        $item->size = $d->dim_x." ".$d->dim_y." ".$d->dim_h; 
        // return JDV::result($p_res->success_items[0]);

        return DV::depends($id,[
            'Item'=>'Created',
            'package'=>(object)$item, /** Newly created pacakge details **/
        ],'Failed to save item information');

    }

    function getOverseaItemList($id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $shipment_id = $id ?? $this->id;
        // return JDV::result($shipnent_id);

        $branch_id = $ss->branch_id;
        $str_where = 'os_items.shipment_id = '.$shipment_id;
        // $country_where = 'os_items.shipment_id = '.$shipment_id;
        // return JDV::result($str_where);

        // if(empty($shipnent_id)) $shipnent_id =-1;
        $price_per_kg = DB::table('os_shipments')->selectRaw('zone_code,sender_id')->get();
        return DB::table('os_items')->whereRaw($str_where)->selectRaw('id,shipment_id,item_type, billed_weight, actual_weight, price ,price_per_kg, item_total, allocated_kg ,status_id, CONCAT(dim_x,\' \',dim_y,\' \',dim_h) AS size')->orderBy('id', 'desc')->get();
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
