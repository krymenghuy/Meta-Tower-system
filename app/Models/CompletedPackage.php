<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Session;
use DB;

class CompletedPackage extends Model
{
    use HasFactory;

    function getPackageInfo($uss,$id) {
        $branch_id = $uss->branch_id;
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id_id')->where('p.branch_id',$branch_id)->where('p.id',$id)->selectRaw("p.id, p.package_name, p.qr_code AS barcode,p.returned, ps.status, ps.status_id")->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    function deleteCompletedPackage($d) {
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $id = $d->package_id;
        $p = $this->getPackageInfo($ss,$id);
        DB::table('package')->where('branch_id',$branch_id)->where('id',$id)->delete();
        //Todo: update table delivery.package_count and delivery.status
        return null;
    }

    function getCompletedPackageList($data) {    
        $ss = getSessionInfo($data);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
         
        $branch_id = sanitize($ss->branch_id);
        $data->warehouse_id = isset($data->warehouse_id)?sanitize($data->warehouse_id):0;
        $data->start_date = isset($data->start_date)?convertDate($data->start_date):date('Y-m-d');
        $data->end_date = isset($data->end_date)?convertDate($data->end_date):date('Y-m-d');
        $data->delivery_type = isset($data->delivery_type)?$data->delivery_type:null;
        if($data->delivery_type ==0) $data->delivery_type =null;
        $data->zone_code = sanitize($data->zone_code);
        $data->driver_id = sanitize($data->driver_id);
        $data->sender_id = sanitize($data->sender_id);
        $data->status_id = sanitize($data->status_id);
        if(empty($data->status_id)) $data->status_id =-1;
        $data->search_value =isset($data->search_value)?$data->search_value:null;
        $data->search_value = escape_like_str(sanitize(trim($data->search_value)));

          //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
          $str_driver = null;
          $str_warehouse =null;
          $str_zone ='';
          $str_sender =null;
          $str_status = null; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
          $str_delivery_type = null;
          $str_search = null;
          if (!empty($data->search_value)) { 
            $str_search = " AND (p.qr_code ='".$data->search_value."') OR p.receiver_phone ='".$data->search_value."'  OR s.phone_number ='".$data->search_value."' OR s.name ='%".$data->search_value."%'";
            $more_wheres = " IFNULL(p.outstanding,0) =0 AND p.status_id IN (8,11) ".$str_search;
          }
          else{
            if (!empty($data->delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
            if(!empty($data->warehouse_id)) $str_warehouse =" AND p.warehouse_id ='".$data->warehouse_id."' ";
            if ($data->driver_id > 0) $str_driver = " AND p.driver_id ='".$data->driver_id."' ";
            if ($data->driver_id ==-1) $str_driver = " AND IFNULL(p.driver_id,0) = 0";
            if ($data->sender_id > 0) $str_sender = " AND p.sender_id ='".$data->sender_id."' ";
            if (!empty($data->zone_code)) $str_zone = " AND p.zone_code ='".$data->zone_code."' ";
            if ($data->status_id != -1) $str_status = " AND p.status_id ='".$data->status_id."' ";
            if (!(bool)strtotime($data->start_date)) $data->start_Date = date('Y-m-d');
            if (!(bool)strtotime($data->end_date)) $data->end_date = date('Y-m-d');
            $str_date = " AND DATE(p.arrival_time) >= '$data->start_date' AND DATE(p.arrival_time) <='$data->end_date'";
            $more_wheres = " IFNULL(p.outstanding,0) =0 AND p.status_id IN (8,11) ".$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_date.$str_status;
          }          
         
          $select_cols ="p.id As package_id,p.delivery_id, p.order_id, p.zone_code, p.delivery_type, p.qr_code AS barcode,p.delivery_condition, 
          DATE_FORMAT(p.arrival_time,'%d %b %Y') AS `delivery_date`, DATE_FORMAT(p.arrival_time,'%r') AS `arrival_time`, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,
          (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
              (CASE cod WHEN 1 THEN (IFNULL(price,0) - IFNULL(cod_fee,0)) ELSE 0 END) AS cod_amount,
           p.status_id,(SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total";

          $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_id DESC')->get();
          return $rows; 
         }
         function getCompletedPackageList_print($data) {    
            $ss = getSessionInfo($data);
            if(!$ss) return '#350'; //user not authenticated
            if (!prn_allowed(2)) return '@'; //need permission to do this task
            $branch_id = sanitize($ss->branch_id);
            $data->warehouse_id = isset($data->warehouse_id)?sanitize($data->warehouse_id):0;
            $data->date = convertDate($data->date);
            $data->delivery_type = isset($data->delivery_type)?$data->delivery_type:null;
            if($data->delivery_type ==0) $data->delivery_type =null;
            $data->zone_code = sanitize($data->zone_code);
            $data->driver_id = sanitize($data->driver_id);
            $data->sender_id = sanitize($data->sender_id);
            $data->status_id = sanitize($data->status_id);
            if(empty($data->status_id)) $data->status_id =-1;
            $data->search_value =isset($data->search_value)?$data->search_value:null;
            $data->search_value = escape_like_str(sanitize(trim($data->search_value)));
    
              //$succeeded_status ="delivered"; /* outstanding delvieries => select all packages that has status different from "delivered" */
              $str_driver = null;
              $str_warehouse =null;
              $str_zone ='';
              $str_sender =null;
              $str_status = null; //status_id = 4 (Picked and Booked), status_id = 5 (Arrived at warehouse) 
              $str_delivery_type = null;
              $str_search = null;
              if (!empty($data->search_value)) { 
                $str_search = " AND (p.qr_code ='".$data->search_value."') OR p.receiver_phone ='".$data->search_value."'  OR s.phone_number ='".$data->search_value."' OR s.name ='%".$data->search_value."%'";
                $more_wheres = " IFNULL(p.outstanding,0) =0 AND p.status_id IN (8,11) ".$str_search;
              }
              else{
                if (!empty($data->delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
                if(!empty($data->warehouse_id)) $str_warehouse =" AND p.warehouse_id ='".$data->warehouse_id."' ";
                if ($data->driver_id > 0) $str_driver = " AND p.driver_id ='".$data->driver_id."' ";
                if ($data->driver_id ==-1) $str_driver = " AND IFNULL(p.driver_id,0) = 0";
                if ($data->sender_id > 0) $str_sender = " AND p.sender_id ='".$data->sender_id."' ";
                if (!empty($data->zone_code)) $str_zone = " AND p.zone_code ='".$data->zone_code."' ";
                if ($data->status_id != -1) $str_status = " AND p.status_id ='".$data->status_id."' ";
                if (!(bool)strtotime($data->date)) $data->date = date('Y-m-d');
                if (!(bool)strtotime($data->date)) $data->date = date('Y-m-d');
                $str_date = " AND DATE(p.create_date) >= '".$data->date."' ";
                $more_wheres = " IFNULL(p.outstanding,0) =0 AND p.status_id IN (8,11) ".$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_date.$str_status;
              }          
             
              $select_cols ="'$' AS cur, p.qr_code AS barcode,DATE_FORMAT(p.arrival_time,'%d %b %Y') AS delivery_date, s.name AS sender_name, s.phone_number AS sender_phone,p.zone_name,p.receiver_phone,(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) +IFNULL(p.cod_fee,0)) AS fees, 
              (CASE cod WHEN 1 THEN (IFNULL(price,0) - IFNULL(cod_fee,0)) ELSE 0 END) AS cod_amount,(select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.delivery_type,
              (SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, IFNULL(p.driver_total,0) AS driver_total";
    
              $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_id DESC')->get();
              return $rows; 
             }


    //Now allow user to update  package's agent_notes (Notes by driver because driver is an agent)
    //agent_notes such as "Customer paid through ABA bank or ACLEDA bank directly and change COD status"
    function updateAgentPackage($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        if(!isset($d->package_id)) $d->package_id = 0;
        $d->agent_notes = isset($d->agent_notes)?$d->agent_notes:null;
        if (empty($d->agent_notes)) return "Agent notes not saved because it was empty!"; 

        $p = $this->getPackageInfo($ss,$d->package_id);
        if($p == null) {
            return "Package identifier is not valid";
        }
        DB::table('package')->where('branch_id',$branch_id)->where('id',$d->package_id)->update(array('agent_notes'=>$d->agent_notes));
        return null; 
    }

    function getFormData_completed_delivery($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task

        $branch_id = $ss->branch_id;
        $data = (object)[];
        $data->senders = DB::table('sender AS s')->where('s.branch_id',$branch_id)->selectRaw("s.id,s.name AS sender_name")->get();
        $data->drivers = DB::table('driver AS d')->where('d.branch_id',$branch_id)->selectRaw("d.id,d.name AS driver_name")->get();
        $data->statuses = DB::table('package_statuses AS ss')->where('ss.stage','delivery')->where('outstanding',0)->selectRaw("ss.id,ss.name")->get();
        return $data;
    }
}
