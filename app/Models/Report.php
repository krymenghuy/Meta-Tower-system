<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\CompanyProfile;
use Session;
use DB;

class Report extends Model
{
    use HasFactory;
    protected $companyModel;
    
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->companyModel = new CompanyProfile();
    }

    function getSummaryData($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
         $branch_id = isset($ss->branch_id)?sanitize($ss->branch_id):null;
         $agent_type = isset($d->agent_type)?sanitize($d->agent_type):null;
         $agent_id = isset($d->agent_id)?sanitize($d->agent_id):null;
         $date = isset($d->date)?$d->date:null;
         if(!(bool)strtotime($date)) $date = date('Y-m-d');

         $more_where ="1=1"; 
         $rows = DB::table("package AS p")->join('delivery AS d','d.id','=','p.delivery_id')->where('d.branch_id',$branch_id)->whereRaw($more_where)
         ->selectRaw("DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS delivery_date, p.sender_id,COUNT(p.id) AS package_count, 0 AS delivered_count,0 AS failed_count, 0 AS returned_count, 0 AS total_delivery_fee, 0 AS total_cod")->groupByRaw("p.sender_id, delivery_date")->get();
         return $rows; 
    }

    function getBranchInfo($branch_id){ 
         $terms_text ="ចំណាំ៖ រាល់ឥវ៉ាន់ខុសច្បាប់ម្ចាស់ឥវ៉ាន់ជាអ្នកទទួលខុសត្រូវ។
         អរគុណសម្រាប់ការប្រើប្រាស់សេវាកម្មយើងខ្ញុំ។";//Write company's terms and condition here
         $rows = DB::table('um_branches AS b')->where('b.branch_id',$branch_id)->selectRaw("b.branch_id,'".$terms_text."' AS terms_text, b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
         foreach($rows as $row) {
             $row->logo_data = $this->companyModel->getCompanyLogo1($branch_id);
             return $row;
         } 
         return (object)array("name"=>'(Company Name)','phone_number'=>'(Unvailaible phone)','website'=>'Unvailable');
    }
    //getbarCode() | label Info
    function getPackageLabelInfo($barcode){
       $branch_id =Session::get('branch_id',0);
       $rows =DB::table('package AS p')->where('p.branch_id',$branch_id)->where('qr_code',$barcode)->join('sender AS s','s.id','=','p.sender_id')->selectRaw("p.qr_code AS barcode,p.delivery_type,p.cod,
       CASE IFNULL(p.cod,0) WHEN 1 THEN p.price ELSE 0 END AS price, 
       s.name AS sender_name, s.phone_number AS sender_phone, p.receiver_name, p.receiver_address, p.zone_name, p.delivery_notes,p.zone_code,p.receiver_phone,
       CASE LOWER(p.df_payer) WHEN 'receiver' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END AS total_delivery_fee,
       IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.exchange_rate,1) AS exchange_rate")->limit(1)->get();
       foreach($rows as $row) return $row;
       return (object)array('barcode'=>null,'cod'=>0,'other_fees'=>0,'price'=>0,'sender_phone'=>null,'sender_name'=>null,'receiver_address'=>null,'receiver_phone'=>null,'zone_name'=>null,'zone_code'=>null,'exchange_rate'=>1,'total_delivery_fee'=>0); 
    }
    function getPickupList($warehouse_id,$date,$search_value,$sender_id,$delivery_type,$status_id){
        $branch_id =Session::get('branch_id',0);
        $more_wheres = "o.status_id <=4 "; //" o.warehouse_id ='".$warehouse_id."' ";
        $str_search = null;
        $str_date = null;
        $str_sender= null;
        $str_status = null;
        $str_delivery_type =null;
        
        $date = convertDate($date);

        if (!empty($search_value)) {
            $str_search =" AND (o.code ='".$search_value."' OR s.phone_number ='".$search_value."' OR s.name LIKE '%".escape_like_str($search_value)."%') ";
            $more_wheres .= $str_search;
        } else {
            if($status_id> 0) $str_status = " AND o.status_id ='".sanitize($status_id)."' ";
            if($sender_id > 0) $str_sender = " AND o.sender_id ='".sanitize($sender_id)."' "; 
            //if($driver_id > 0) $str_driver = " AND o.driver_id ='".sanitize($driver_id)."' "; 
            if ((bool)strtotime($date)) $str_date = " AND DATE(o.request_date) >= '". Date('Y-m-d',strtotime($date))."' ";
            if (!empty($delivery_type)) $str_delivery_type = " AND o.delivery_type ='".$delivery_type."'";
            $more_wheres .=$str_date.$str_sender.$str_status.$str_delivery_type;
        }

        $rows =DB::table('order AS o')->join('sender AS s','s.id','=','o.sender_id')->join('package_statuses AS os','os.id','=','o.status_id')->where('o.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("s.code AS sender_code,s.name AS sender_name, s.phone_number AS sender_phone,o.code AS order_code,DATE_FORMAT(o.request_date,'%d %b %Y') AS request_date, o.product_type, o.qty, o.request_vehicle_type AS vehicle_type,(SELECT d.name FROM driver AS d WHERE d.id =o.driver_id LIMIT 1) AS driver_name, os.name AS status")->get();
        return $rows;
    } 

    //$completed == true => show only completed package list 
    function getPackageList($completed, $warehouse_id,$date,$search_value,$sender_id,$delivery_type,$zone_code,$driver_id,$status_id){
        $branch_id =Session::get('branch_id',0);
        $more_wheres = "o.status_id <=4 "; //" o.warehouse_id ='".$warehouse_id."' ";
        $str_search = null;
        $str_date = null;
        $str_sender= null;
        $str_driver=null;
        $str_zone = null;
        $str_status = null;
        $str_delivery_type =null;
        $str_warehouse = null;
        $date = convertDate($date);
        if ($completed ==0) $completed =false;
        if ($completed==1) $completed =true; 
         $str_completed = " AND p.status_id IN (8,11) AND IFNULL(p.outstanding,0) =0";
        if (!$completed || $completed==0) $str_completed =  $str_completed = " AND p.status_id NOT IN (8,11) AND p.outstanding =1";
        if (empty($status_id)) $status_id = -1; // All statuses of packages

        if (!empty($search_value)) { 
            $str_search = " AND (p.qr_code ='".$search_value."') OR p.receiver_phone ='".$search_value."'  OR s.phone_number ='".$search_value."' OR s.name ='%".$search_value."%'";
            $more_wheres = " p.status_id > 4 ".$str_completed.$str_search;
          }
          else{
            if (!empty($data->delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$data->delivery_type."' ";
            if(!empty($data->warehouse_id)) $str_warehouse =" AND p.warehouse_id ='".$data->warehouse_id."' ";
            if ($driver_id > 0) $str_driver = " AND p.driver_id ='".$driver_id."' ";
            if ($driver_id ==-1) $str_driver = " AND IFNULL(p.driver_id,0) = 0";
            if ($sender_id > 0) $str_sender = " AND p.sender_id ='".$sender_id."' ";
            if (!empty($zone_code)) $str_zone = " AND p.zone_code ='".$zone_code."' ";
            if ($status_id != -1) $str_status = " AND p.status_id ='".$status_id."' ";
            $str_date = null;
            if ((bool)strtotime($date)) $str_date = " AND DATE(p.create_date) >= '".$date."' ";
            $more_wheres = " p.status_id > 4 ".$str_completed.$str_warehouse.$str_delivery_type.$str_driver.$str_zone.$str_sender.$str_date.$str_status;
          }
          $select_cols ="p.id As package_id,p.delivery_id, p.order_id,DATE_FORMAT(p.create_date,'%d %b %Y') AS date,p.product_type, p.zone_code, p.delivery_type, p.qr_code AS barcode,p.delivery_condition, p.delivery_type, 
          DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS `arrival_time`, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,
         p.status_id,(SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, s.name AS sender_name, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total";

         $rows = DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC, p.delivery_type ASC, p.delivery_id DESC')->get();
         return $rows; 
    } 

    //same query as "DeliveryTrim->getDeliveryTrips_print()"
    function getDeliveryTripList($date,$warehouse_id,$search_value, $driver_id,$delivery_type,$status_id){
        $branch_id = Session::get('branch_id',0);
        if (empty($status_id)) $status_id =-1; //status_id = 0 => 'Canceled'
        $date =isset($date)? convertDate($date):null;
        
        $str_warehouse = null;
        $str_status =null;
        $str_date = null;
        $str_driver = null;
        //$str_zone =null;
        $str_delivery_type =null;

        if (empty($search_value)) {
            if ((bool)strtotime($date)) $str_date = " AND DATE(IFNULL(d.depart_time,DATE(NOW()))) >='".$date."' "; 
            $str_warehouse =" AND h.id ='".$warehouse_id."' ";
            if ($driver_id > 0) $str_driver = " AND d.driver_id ='".$driver_id."' ";
            //if (!empty($zone_code)) $str_zone =" AND d.zone_code ='".$zone_code."' ";
            if (empty($status_id)) 
               $str_status =" AND d.status_id =2";
            else if ($status_id != -1) $str_status =" AND d.status_id ='".$status_id."' ";
            if (!empty($delivery_type)) $str_delivery_type =" AND d.delivery_type ='".$delivery_type."' ";
            $more_wheres = "1=1 ".$str_delivery_type.$str_date.$str_warehouse.$str_status.$str_driver;
        }else{
            $search_value = escape_like_str($search_value);
            $more_wheres ="(d.fleet_tracking_number ='".$search_value."' OR d.driver_id IN (select id FROM driver WHERE branch_id ='".$branch_id."' AND name LIKE '%".$search_value."%') OR d.id IN (SELECT l.delivery_id FROM package AS l WHERE l.branch_id ='".$branch_id."' AND l.qr_code ='".$search_value."' or l.receiver_phone ='".$search_value."'))";
        }
        $selectCols ="d.id, d.driver_id, d.fleet_tracking_number,d.delivery_type, DATE_FORMAT(d.depart_time,'%d %b %Y') AS depart_date, encode_time(DATE_FORMAT(d.depart_time,'%r')) AS depart_time, d.package_count, d.delivered_count,d.failed_count, ds.name AS status, dr.name AS driver_name, d.vehicle_type".
        ",(SELECT SUM(IFNULL(base_fee,0)) FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_base_fee ".
        ",(SELECT SUM(IFNULL(delivery_fee,0)) FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_delivery_fee ".
        ",(SELECT SUM(CASE cod WHEN 1 THEN price ELSE 0 END) AS total FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_cod_amount ".
        ",(SELECT SUM(IFNULL(cod_fee,0)) AS total FROM package WHERE branch_id ='".$branch_id."' AND delivery_id = d.id) AS total_cod_fee ".
        ",(SELECT SUM(IFNULL(driver_total,0)) FROM package AS p WHERE branch_id = d.branch_id AND p.delivery_id = d.id) AS driver_total, 'Unsettled' AS pmt_status";
        $rows = DB::table('delivery AS d')->join('delivery_statuses AS ds','ds.id','=','d.status_id')->join('warehouses AS h','h.id','=','d.warehouse_id')->join('driver as dr','dr.id','=','d.driver_id')->where('d.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->get(); 
        foreach($rows as $h_row){
            $selectCols ="p.delivery_id,p.id AS package_id,p.qr_code AS barcode,p.sender_name,p.sender_phone,p.package_name, p.product_type,p.dim_x, p.dim_y, p.dim_h, p.billed_kg, p.price, (CASE cod WHEN 1 THEN p.price ELSE 0 END) AS cod_amount, p.cod, p.cod_fee, p.base_fee,p.delivery_fee,p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.delivery_notes,p.failure_notes, IFNULL(p.driver_total,0) AS driver_total,IFNULL(p.sender_total,0) AS sender_total, p.exchange_rate AS exchange_rate,p.status_id, (SELECT ps.name FROM package_statuses AS ps WHERE ps.id =p.status_id LIMIT 1) AS status, DATE_FORMAT(p.arrival_time,'%d %b %Y %r') AS arrival_time,p.agent_notes";
            $h_row->packages = DB::table('package AS p')->where('branch_id',$branch_id)->where('delivery_id',$h_row->id)->selectRaw($selectCols)->get();
        }
        return $rows;
    }

    function getDriverList($warehouse_id,$search_value,$shift, $status_code,$emp_type){
         $branch_id = Session::get('branch_id',0);
         $str_emp_type = null;
         $str_shift = null;
         $str_search =null;
         $str_status =null;
         $more_wheres ="1=1 ";
         if (empty($search_value)) {
            if(!empty($shift) && $shift != '0') $str_shift = " AND s.shift ='".$shift."' ";
            if(!empty($emp_type)) $str_emp_type ="AND s.emp_type ='".sanitize($emp_type)."' ";
            if(!empty($status_code)) $str_status ="AND s.status_code ='".sanitize($status_code)."' ";
            $more_wheres .=$str_emp_type.$str_status.$str_shift;
         } else {
            $str_search = "AND (s.name LIKE '%".escape_like_str($search_value)."%' OR s.phone_number ='".sanitize($search_value)."' )"; 
            $more_wheres .=$str_search;
         }
        //driver's role = {'pickup_only','pickup_and_delivery','delivery_only','all'}
         $rows = DB::table('driver as s')->selectRaw("'NA' AS warehouse_name,s.id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role")->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('warehouse_name ASC,s.emp_type ASC')->get();
         //$rows = DB::table('driver as s')->join('driver_warehouses AS dw','dw.driver_id','=','s.id')->join('warehouses AS h','dw.warehouse_id','=','h.id')->selectRaw("h.name AS warehouse_name,s.id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role")->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('warehouse_name ASC,s.emp_type ASC')->get();
        return $rows;
     }

     //"dr_package_list" => driver_report, driver report,  
     function getDeliveredPackagesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null){
            $branch_id = Session::get('branch_id',0);
            $str_dates =null;
            $str_delivery_type = null;
            if((bool)strtotime($start_date)) $str_dates =" AND DATE(p.create_date) >= '".convertDate($start_date)."'";
            if((bool)strtotime($end_date))  $str_dates .= " AND DATE(p.create_date) <='".convertDate($end_date)."' ";
            if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$delivery_type."' ";
            $more_wheres = " p.status_id =8 ";
            if($warehouse_id > 0){
                $more_wheres .= " AND p.warehouse_id ='".$warehouse_id."' "; 
            } 
             $more_wheres .= $str_dates; 
            $selectCols ="p.id AS package_id, p.delivery_type, p.qr_code AS barcode,p.sender_name, p.sender_phone, p.receiver_name, p.receiver_phone, p.receiver_address, p.zone_code, p.zone_name,  
            CASE p.status_id WHEN 8 THEN DATE_FORMAT(p.arrival_time,'%d %b %Y') ELSE DATE_FORMAT(p.create_date,'%d %b %Y') END AS delivery_date,
            CASE p.cod WHEN 1 THEN (ifnull(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
            ifnull(p.cod_fee,0) AS cod_fee, 
            IFNULL(p.base_fee,0) AS base_fee,
            IFNULL(p.delivery_fee,0) AS delivery_fee,
            IFNULL(p.driver_adjust_amount,0) AS driver_adjust_amount, 
            IFNULL(p.forwarding_cost,0) AS forwarding_cost,
            0 AS paid_to_sender,
            0 AS paid_by_driver,
            IFNULL(p.driver_total,0) AS driver_total, 
            IFNULL(p.sender_total,0) AS sender_total,
            IFNULL(p.driver_pmt_status_id,0) AS driver_pmt_status_id,
            p.driver_pmt_notes,
            '$' AS cur,
            IFNULL(p.sender_net_amount,0) AS sender_net_amount,
            p.status_id,ps.name AS status";
            $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.driver_id',$driver_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,p.delivery_type')->get();
            return $rows;
    }


       //"vd_package_list", "vd_deliveries" => sender_report, merchant report, pacakge list belonging to sender 
       function getPackagesBySender($warehouse_id, $sender_id, $start_date, $end_date,$delivery_type=null, $status_id = null){
        $branch_id = Session::get('branch_id',0);
        $str_dates =null;
        $str_delivery_type = null;
        if((bool)strtotime($start_date)) $str_dates =" AND DATE(p.create_date) >= '".convertDate($start_date)."'";
        if((bool)strtotime($end_date))  $str_dates .= " AND DATE(p.create_date) <='".convertDate($end_date)."' ";
        if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$delivery_type."' ";
        $more_wheres = " 1=1";
        if (!empty($status_id)) $more_wheres ="p.status_id ='".$status_id."'";
        if($warehouse_id > 0){
            $more_wheres .= " AND p.warehouse_id ='".$warehouse_id."' "; 
        } 
         $more_wheres .= $str_dates; 
        $selectCols ="p.id AS package_id, p.delivery_type, p.qr_code AS barcode,p.sender_name, p.sender_phone, p.receiver_name, p.receiver_phone, p.receiver_address, p.zone_code, p.zone_name,  
        CASE p.status_id WHEN 8 THEN DATE_FORMAT(p.arrival_time,'%d %b %Y') ELSE DATE_FORMAT(p.create_date,'%d %b %Y') END AS delivery_date,
        CASE p.cod WHEN 1 THEN (ifnull(p.price,0) - ifnull(p.cod_fee,0)) ELSE 0 END AS cod_amount,
        p.df_payer,
        ifnull(p.cod_fee,0) AS cod_fee, 
        IFNULL(p.base_fee,0) AS base_fee,
        IFNULL(p.delivery_fee,0) AS delivery_fee,
        IFNULL(p.sender_adjust_amount,0) AS sender_adjust_amount, 
        IFNULL(p.forwarding_cost,0) AS forwarding_cost,
        0 AS paid_to_sender,
        0 AS paid_by_driver,
        IFNULL(p.sender_total,0) AS sender_total, 
        IFNULL(p.sender_pmt_status_id,0) AS sender_pmt_status_id,
        p.sender_pmt_notes,
        '$' AS cur,
        IFNULL(p.sender_net_amount,0) AS sender_net_amount,
        p.status_id,ps.name AS status";
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,p.delivery_type,p.status_id DESC')->get();
        return $rows;
   }

    //"dr_summarized_deliveries", driver report
    function getSummarizedDeliveriesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null){
        $branch_id = Session::get('branch_id',0);
        $str_dates =null;
        $str_delivery_type = null;
        if((bool)strtotime($start_date))
          $str_dates =" AND DATE(p.create_date) >= '".convertDate($start_date)."'";
        if((bool)strtotime($end_date))  
          $str_dates .= " AND DATE(p.create_date) <='".convertDate($end_date)."' ";
        if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$delivery_type."' ";
        $more_wheres = " p.status_id =8 ";
        if($warehouse_id > 0){
            $more_wheres .= " AND p.warehouse_id ='".$warehouse_id."' "; 
        } 
        $more_wheres .= $str_dates; 
        $selectCol ="COUNT(p.id) AS package_count, p.delivery_type, SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS cod_amount, SUM(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees, SUM(IFNULL(p.driver_adjust_amount,0)) AS adjust_amount";
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->where('p.driver_id',$driver_id)->whereRaw($more_wheres)->selectRaw($selectCol)->groupBy('p.delivery_type')->orderByRaw('p.delivery_type')->get();
        return $rows;
    }

    /**returns commissions options (for the company given by @branch_id) as object with prop
       PICKUP_CMM_TYPE = Pickup Commission type can be {'per_pickup','per_item'}
       DELIVERY_CMM_TYPE = Delivery Commission type can be {'per_trip','per_item'}
    **/
    function getDriverCommissionOptions(){
       $branch_id = Session::get('branch_id',0);
       $ss = (object)['branch_id'=>$branch_id];
       $pickup_cmm_type = get_settings_value($ss,'PICKUP_CMM_TYPE','string');
       $delivery_cmm_type = get_settings_value($ss,'DELIVERY_CMM_TYPE','string');
       $result = (object)array('pickup_cmm_type'=>$pickup_cmm_type,'delivery_cmm_type'=>$delivery_cmm_type);
       return $result;    
    }
    function getDriverCommissionRates($driver_id){
        $branch_id = Session::get('branch_id',0);
        $rows = DB::table('driver_commissions AS c')->where('c.branch_id',$branch_id)->where('c.driver_id',$driver_id)->where('is_current',1)->limit(1)->selectRaw('IFNULL(c.pickup_commission,0) AS pickup_commission,IFNULL(c.delivery_commission,0) AS delivery_commission')->get(); 
        foreach($rows as $row) return $row;
        return (object)['pickup_commission'=>0,'delivery_commission'=>0];
    }

    function getDriverCommissionItems($driver_id, $start_date, $end_date){
      if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
      if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');  
      $op = $this->getDriverCommissionOptions();
      $cmm = $this->getDriverCommissionRates($driver_id);
      $more_wheres = null;
      $sql = null;
      $start_date = convertDate($start_date);
      $end_date = convertDate($end_date);

      //todo: get branch_id from token 
      $branch_id = Session::get('branch_id',1);
      $min_status_id = 3;

      $start_date = convertDate($start_date);
      $end_date = convertDate($end_date);
      $status_id_delivered =8;

      /** default pickup_cmm_type ='per_item' **/
      // for time being => now use "booking_date" to retrieve number of pickups or packages picked
      $more_wheres =" AND DATE(o.create_date) >='".$start_date."' AND DATE(o.create_date) <='".$end_date."' ";
      $sql_pickup = "SELECT '$' AS cur, 'Pickup' AS category, o.delivery_type, o.driver_id, SUM(o.qty) AS item_count, ".$cmm->pickup_commission." AS unit_amount,'".$op->pickup_cmm_type."' AS cmm_type, NULL AS remarks FROM `order` AS o WHERE o.branch_id = '$branch_id' AND IFNULL(o.driver_id,0) >0 AND o.status_id >='$min_status_id' AND o.driver_id ='".$driver_id."' ".$more_wheres.
      " GROUP BY o.driver_id, o.delivery_type";
      /** default delivery_cmm_type ='per_item' **/
      $more_wheres =" AND DATE(p.create_date) >='".$start_date."' AND DATE(p.create_date) <='".$end_date."' ";
      $sql_delivery = "SELECT '$' AS cur,'Delivery' AS category,p.delivery_type, p.driver_id, COUNT(p.driver_id) AS item_count,".$cmm->delivery_commission." AS unit_amount,'".$op->delivery_cmm_type."' AS cmm_type, NULL AS remarks FROM `package` AS p WHERE p.branch_id ='$branch_id' AND p.status_id= '$status_id_delivered' AND p.driver_id ='".$driver_id."' ".$more_wheres.
      " GROUP BY p.driver_id, p.delivery_type";

      if ($op->pickup_cmm_type =='per_pickup'){
        // for time being => now use "booking_date" to retrieve number of pickups or packages picked
        $more_wheres =" AND DATE(o.create_date) >='".$start_date."' AND DATE(o.create_date) <='".$end_date."' ";  
        $sql_pickup ="SELECT '$' AS cur, 'Pickup' AS category, o.delivery_type, NULL AS driver_id, COUNT(o.id) AS item_count, ".$cmm->pickup_commission." AS unit_amount,'".$op->pickup_cmm_type."' AS cmm_type, NULL AS remarks FROM `order` AS o WHERE o.branch_id = 1 AND IFNULL(o.driver_id,0) >0 AND o.status_id >=3 AND o.driver_id ='".$driver_id."' ".$more_wheres.
        " GROUP BY o.delivery_type"; 
      }
      if ($op->delivery_cmm_type =='per_trip'){
        $more_wheres =" AND DATE(d.depart_time) >='".$start_date."' AND DATE(d.depart_time) <='".$end_date."' ";  
        $sql_delivery = "SELECT '$' AS cur,'Delivery' AS category,d.delivery_type, d.driver_id, COUNT(d.driver_id) AS item_count,".$cmm->delivery_commission." AS unit_amount,'".$op->delivery_cmm_type."' AS cmm_type, NULL AS remarks FROM `delivery` AS d WHERE d.branch_id = 1 AND IFNULL(d.driver_id,0) >0 AND d.status_id =3 AND d.driver_id ='".$driver_id."' ".$more_wheres.
        " GROUP BY d.driver_id, d.delivery_type";
      }

      $sql = $sql_pickup." UNION ".$sql_delivery;
    //   $sql ="SELECT 'Pickup' AS category,'Any' AS delivery_type, o.driver_id, COUNT(o.driver_id) AS item_count, 0.02 AS unit_amount, NULL AS remarks FROM `order` AS o WHERE o.branch_id = 1 AND IFNULL(o.driver_id,0) >0 AND o.status_id >=3
    //   GROUP BY o.driver_id, delivery_type
    //   UNION
    //   SELECT 'Delivery' AS category,d.delivery_type, d.driver_id, COUNT(d.driver_id) AS item_count, 0.02 AS unit_amount, NULL AS remarks FROM delivery AS d WHERE d.branch_id = 1 AND IFNULL(d.driver_id,0) >0
    //   GROUP BY d.driver_id, delivery_type";

      $rows = DB::select(DB::raw($sql));
      return $rows;
    }

    //return total Amount due for each Driver (date to date). Amount driver has to pay to company
    function getDriverTotalDue($driver_id,$start_date, $end_date){
        $branch_id = Session::get('branch_id',0);
        $str_dates ='';
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if ((bool)strtotime($start_date)) $str_dates = " AND DATE(p.arrival_time) >= '".$start_date."' ";
        if ((bool)strtotime($end_date)) $str_dates .= " AND DATE(p.arrival_time) <= '".$end_date."' ";
        $more_wheres ="1=1 ".$str_dates;
       //select SUM(IFNULL(driver_total,0)) AS total_due from package AS p WHERE p.status_id =8 AND driver_pmt_status_id =0;
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('driver_id',$driver_id)->whereRaw($more_wheres)->selectRaw('SUM(IFNULL(p.driver_total,0)) AS total_due')->get();
        foreach($rows as $row) return is_numeric($row->total_due)?$row->total_due:0;
        return 0;  
    }

    //returns data to feed Driver Mobile app 's report section => COUNT pickups and delvieries and total commissions, and total driver's payable amount (@total_due)
    function getDriverReport_mobile($driver_id,$start_date, $end_date){
        $m = $this->getDriverCommissionItems($driver_id,$start_date, $end_date);
        $total_due = $this->getDriverTotalDue($driver_id,$start_date, $end_date);
        $result = (object)array('cur'=>'$','commissions'=>$m,'total_due'=>$total_due);
        return $result;  
    }

    //dr_payments driver report
    function getPaymentsByDriver($driver_id, $start_date, $end_date){
        $branch_id = Session::get('branch_id',0);
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        
        $more_wheres ="DATE(r.payment_date) >= '".$start_date."' AND DATE(r.payment_date) <='".$end_date."' ";
        $select_cols ="r.id,r.payer_id,r.payer_name, r.payer_type, DATE_FORMAT(r.payment_date,'%d %b %Y') AS payment_date, r.amount, r.pmt_type, r.pmt_method,r.cashier_name, r.description";
        $rows = DB::table('cash_receipts AS r')->where('branch_id',$branch_id)->where('payer_type','driver')->where('payer_id',$driver_id)->whereRaw($more_wheres)->selectRaw($select_cols)->get(); 
        return $rows;
    }

    //General summary report Daily/ general report
    function getCompanyReport_summary($warehouse_id,$start_date=null,$end_date=null){
       $branch_id = Session::get('branch_id',0);
       if(!(bool)strtotime($start_date)) $start_date =date('Y-m-d');
       if(!(bool)strtotime($end_date)) $end_date = $start_date;
       $start_date = convertDate($start_date);
       $end_date = convertDate($end_date);

       $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->whereRaw("DATE(p.pickup_time) >='$start_date' AND DATE(p.pickup_time) <='$end_date'")->selectRaw("COUNT(DISTINCT p.sender_id) AS cnt")->get();
       $sender_count = 0;
       foreach($rows as $row) $sender_count = $row->cnt;
       
       //get package counts by different statuses
       $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->whereRaw("DATE(p.pickup_time) >='$start_date' AND DATE(p.pickup_time) <='$end_date'")->selectRaw('p.id, p.status_id,p.delivery_type, IFNULL(p.base_fee,0) AS base_fee, IFNULL(delivery_fee,0) AS delivery_fee, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total,IFNULL(p.sender_net_amount,0) AS sender_net_amount,p.cod,IFNULL(p.price,0) AS price,IFNULL(p.cod_fee,0) AS cod_fee, sender_pmt_status_id, driver_pmt_status_id, IFNULL(p.forwarding_cost,0) AS forwarding_cost, p.df_payer')->get();
       $count_delivered_normal = $this->countPackageByStatus($rows,8,'normal');
       $count_delivered_fast = $this->countPackageByStatus($rows,8,'fast');
       //$count_failed = $this->countPackageByStatus($rows,9);
       
       $count_ctd_normal = $this->countPackageByStatus($rows,10,'normal');
       $count_ctd_fast = $this->countPackageByStatus($rows,10,'fast');

       $count_returned_normal = $this->countPackageByStatus($rows,11,'normal');
       $count_returned_fast = $this->countPackageByStatus($rows,11,'fast');

       $count_failed = $count_returned_normal + $count_returned_fast + $count_ctd_normal + $count_ctd_fast;
       $count_failed_normal = $count_returned_normal  + $count_ctd_normal;
       $count_failed_fast =  $count_returned_fast + $count_ctd_fast;

       $package_counts = [];
       $package_counts[] = (object)array('status_id'=>8,'item_name'=>'ចំនួនកញ្ចប់ទំនិញដឺកបាន','normal'=>$count_delivered_normal,'fast'=>$count_delivered_fast); 
       $package_counts[] = (object)array('status_id'=>9,'item_name'=>'ចំនួនកញ្ចប់ទំនិញដឺកមិនបាន','normal'=>$count_delivered_normal,'fast'=>$count_delivered_fast); 
       $package_counts[] = (object)array('status_id'=>10,'item_name'=>'ចំនួនកញ្ចប់ទំនិញបន្តរដឹក','normal'=>$count_ctd_normal,'fast'=>$count_ctd_fast);
       $package_counts[] = (object)array('status_id'=>11,'item_name'=>'ចំនួនកញ្ចប់ទំនិញបញ្ជូនត្រឡប់','normal'=>$count_returned_normal,'fast'=>$count_returned_fast);

       $payments = [];
       //get cash_summary count object  based on the given $start_date and $end_date
       //Cash_summary_count object = {total_revenues, amount_to_sender,total_fees,sender_receiveable,balance}
       $countInfo = $this->getCashSummary_counts($rows);
       $payments[] = (object)array('var_name'=>'total_revenues','item_name'=>'ទិកប្រាក់ទទួលបានសរុប','amount'=> $countInfo->total_revenues);
       $payments[] = (object)array('var_name'=>'amount_to_sender','item_name'=>'ទិកប្រាក់ទូទាត់ជូនអតិថិជន','amount'=> $countInfo->amount_to_sender);
       $payments[] = (object)array('var_name'=>'total_fees','item_name'=>'សរុបថ្លៃសេវាប្រចាំថ្ងៃ','amount'=> $countInfo->total_fees);
       $payments[] = (object)array('var_name'=>'sender_receivable','item_name'=>'ថ្លៃសេវាអតិថិជនជំពាក់','amount'=> $countInfo->sender_receivable);
       $payments[] = (object)array('var_name'=>'balance','item_name'=>'សមតុល្យសេវាកម្មទទួលបាន','amount'=> $countInfo->balance);

       $result = (object)array();

       //Get Exchange rate from table settings_number 
       $ss = (object)['branch_id'=>1];
       $result->exchange_rate = get_settings_value($ss,'EXCHANGE_RATE_BUY','number');

       $result->sender_count = $sender_count;
       $result->package_counts = $package_counts;
       $result->payments = $payments;
       return $result;
    }
       //get cash_summary count object  based on the given $start_date and $end_date
       //Cash_summary_count object = {total_revenues, amount_to_sender,total_fees,sender_receiveable,balance}
      function getCashSummary_counts($rows){
          $total_rev = 0;
          $total_fees = 0;
          $cod_amount =0;
          $amount_to_sender =0;
          $toal_fee_from_sender = 0;
          $sender_receivable = 0 ;
          $total_cod_amount = 0;
          $balance = 0;


          $i = 0;
          $row = null;
          do{
              if(!isset($rows[$i])) break;
                $row = $rows[$i];
                 $fees = $row->base_fee + $row->delivery_fee;
                 $total_fees+= $fees;
                  
                 $total_cod_amount = 0;
                 $cod_fee = !is_numeric($row->cod_fee)?$row->cod_fee:0;
                 if ($row->cod==1) $cod_amount = $row->price - $cod_fee;
                 $total_cod_amount += $cod_amount;
                  
                 $total_rev += $cod_amount + $fees + $cod_fee;

                 $forwarding_cost =0;
                 if($row->forwarding_cost > 0) $forwarding_cost = $row->forwarding_cost;
                 //fee_from-sender includes $fees and $forwarding_cost
                 $fee_from_sender = 0;
                 if (strtolower($row->df_payer)=='sender') $fee_from_sender = $fees + $forwarding_cost;

                 $toal_fee_from_sender += $fee_from_sender;
                 
                 //cash to be paid to Sender
                 $amount_to_sender += ($cod_amount - $fee_from_sender);
              $i++; 
          }while($row);

           // $sender_receivable = amount of cash that Sender still own the Express company
           $balance = $toal_fee_from_sender - $sender_receivable;
           $data = (object)['total_revenues'=>$total_rev,
           "total_fees"=>$total_fees,
           "total_cod_amount"=>$total_cod_amount,
           "amount_to_sender"=>$amount_to_sender,
           "sender_receivable"=>$sender_receivable,
           "balance"=>$balance];
           return $data;
       }

    //GetSendertransactions() getVendorTransactions() getPaymentsBySender() getPaymentsFromSender() MerchantTransaction Merchant Transactions
      function getVendorTransactions($sender_id,$start_date,$end_date){
        $branch_id = Session::get('branch_id',0);
        $sender_id =  sanitize($sender_id);
       
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_pay_sender =" AND d.payee_type ='Sender' AND d.payee_id ='".$sender_id."' ";
        $str_from_sender = " AND d.payer_type ='Sender' AND d.payer_id ='".$sender_id."' ";
        $str_dates = " AND DATE(d.payment_date) >= '".$start_date."' AND DATE(d.payment_date) <= '".$end_date."'";
  
        $sql ="SELECT d.id, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,'Disbursement' AS trx_type, payee_name AS payerr_or_payer, CONCAT('Pay to ',payee_name) AS special_notes, description, d.amount,d.pmt_method,d.cashier_name from cash_disbursements AS d WHERE d.branch_id ='".$branch_id."'".$str_pay_sender.$str_dates. 
        " UNION
        SELECT d.id, DATE_FORMAT(d.payment_date,'%d %b %Y') AS payment_date,'Receipt' AS trx_type,payer_name AS payee_or_payer, CONCAT('Received from ',payer_name) AS special_notes, description, d.amount,d.pmt_method,d.cashier_name from cash_receipts AS d WHERE d.branch_id ='".$branch_id."' ".$str_from_sender.$str_dates;
        $rows = DB::select(DB::raw($sql));
        return $rows;
      }

    // //Daily Summary for maerchant // summarized daily report for Vendor
    // function getSenderSummary_report($sender_id,$date){
    //     $branch_id = Session::get('branch_id',0);
        
    //     //get package counts by different statuses
    //         $more_wheres ="p.status_id >=5";
    //         $rows = DB::table('order AS o')->join('package AS p','p.order_id','=','o.id')->whereRaw('o.sender_id = p.sender_id')->where('o.branch_id',$branch_id)->where('p.sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw('COUNT(p.id) AS cnt')->get();
    //         $picked_packages_count = 0;
    //         foreach($rows as $row) $picked_packages_count = $row->cnt;
         
    //     //get package counts by different statuses
    //     $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->whereRaw("DATE(p.create_date) ='".$date."'")->where('p.sender_id',$sender_id)->selectRaw('p.id, p.status_id,p.delivery_type, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total,IFNULL(p.sender_net_amount,0) AS sender_net_amount,IFNULL(p.cod_fee,0) AS cod_fee, sender_pmt_status_id, driver_pmt_status_id')->get();
    //     $count_delivered_normal = $this->countPackageByStatus($rows,8,'normal');
    //     $count_delivered_fast = $this->countPackageByStatus($rows,8,'fast');
    //     //$count_failed = $this->countPackageByStatus($rows,9);
        
    //     $count_ctd_normal = $this->countPackageByStatus($rows,10,'normal');
    //     $count_ctd_fast = $this->countPackageByStatus($rows,10,'fast');
 
    //     $count_returned_normal = $this->countPackageByStatus($rows,11,'normal');
    //     $count_returned_fast = $this->countPackageByStatus($rows,11,'fast');
 
    //     $count_failed = $count_returned_normal + $count_returned_fast + $count_ctd_normal + $count_ctd_fast;
    //     $count_failed_normal = $count_returned_normal  + $count_ctd_normal;
    //     $count_failed_fast =  $count_returned_fast + $count_ctd_fast;
 
    //     $package_counts = [];
    //     $package_counts[] = (object)array('status_id'=>8,'item_name'=>'ចំនួនកញ្ចប់ទំនិញប្រមូលបាន','count'=>$picked_packages_count,'normal'=>0,'fast'=>0); 
    //     $package_counts[] = (object)array('status_id'=>8,'item_name'=>'ចំនួនកញ្ចប់ទំនិញដឺកបាន','count'=>0,'normal'=>$count_delivered_normal,'fast'=>$count_delivered_fast); 
    //     $package_counts[] = (object)array('status_id'=>9,'item_name'=>'ចំនួនកញ្ចប់ទំនិញដឺកមិនបាន','count'=>0,'normal'=>$count_delivered_normal,'fast'=>$count_delivered_fast); 
    //     $package_counts[] = (object)array('status_id'=>10,'item_name'=>'ចំនួនកញ្ចប់ទំនិញបន្តរដឹក','count'=>0,'normal'=>$count_ctd_normal,'fast'=>$count_ctd_fast);
    //     $package_counts[] = (object)array('status_id'=>11,'item_name'=>'ចំនួនកញ្ចប់ទំនិញបញ្ជូនត្រឡប់','count'=>0,'normal'=>$count_returned_normal,'fast'=>$count_returned_fast);
 
    //     $payments = [];
    //     $payments[] = (object)array('var_name'=>'cod_amount','item_name'=>'ទិកប្រាក់COD','amount'=>0);
    //     $payments[] = (object)array('var_name'=>'fees','item_name'=>'សរុបថ្លៃសេវា','amount'=>0);
    //     $payments[] = (object)array('var_name'=>'sender_net_amount','item_name'=>'ទិកប្រាក់ត្រូវទូទាត់ជូនអតិថិជន','amount'=>0);
    //     $payments[] = (object)array('var_name'=>'paid_to_sender','item_name'=>'ទិកប្រាក់បានទូទាត់','amount'=>0);
    //     $payments[] = (object)array('var_name'=>'balance','item_name'=>'សមតុល្យ','amount'=>0);
 
    //     $result = (object)array();
    //     $result->exchange_rate = 4100;
    //     $result->package_counts = $package_counts;
    //     $result->payments = $payments;
    //     return $result;
    //  }
 
    function countPackageByStatus($rows,$status_id,$delivery_type){
      //$result = (object)array('new_rows'=>[],'count'=>0);
      $cnt =0;
      $delivery_type = strtolower($delivery_type);
      foreach($rows as $row) {
         if($status_id == $row->status_id && strtolower($row->delivery_type) == $delivery_type) {
            $cnt++; 
         }
      }
      return $cnt;
    }

    function getSalesCommissions($warehouse_id,$agent_id,$start_date,$end_date){
        $branch_id = Session::get('branch_id',0);
        $status_id = 8; //Delivered
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
    
        $str_dates = " AND p.warehouse_id ='".$warehouse_id. "' AND a.id ='".$agent_id."' AND DATE(p.create_date) >='".$start_date."' AND DATE(p.create_date) <='".$end_date."' ";
        $rows = DB::select(DB::raw("select DATE_FORMAT(p.create_date,'%d %b %Y') AS booking_date, p.qr_code, p.delivery_type, p.sender_id,p.driver_id, a.id AS sales_agent_id,s.name AS sender_name,a.name as sales_name,a.commission, p.status_id FROM package as p INNER JOIN sender as s ON s.id = p.sender_id
        Inner join sales_agents AS a ON a.id = s.sales_agent_id WHERE p.status_id ='".$status_id."' ".$str_dates));
        return $rows; 
    }

    //returns Vendor summary data for reporting
    function getVendorSummary($sender_id, $start_date, $end_date,$hide_statuses=null){
        $branch_id = Session::get('branch_id',0); 
        $use_default_dates =0;
        //use_default_dates = 0 => if not dates supplied then all dates will be used ($str_dates = null)
        if(!$hide_statuses || $hide_statuses == []) $hide_statuses=[5,6,7]; //Usually we hide statuses such as 5='At Warehouse', 6='On Delivery',7 ='Delayed or Rescheduled' 
        $str_dates = null;
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if($use_default_dates==1) {
            if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
            if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
            $str_dates =" AND DATE(p.pickup_time) >='".$start_date."' AND DATE(p.pickup_time) <='".$end_date."' "; 
        }else {
            if ((bool)strtotime($start_date) && (bool)strtotime($end_date)){
               $str_dates =" AND DATE(p.pickup_time) >='".$start_date."' AND DATE(p.pickup_time) <='".$end_date."' "; 
            }
            $str_dates = null; //temp
        }
         
        $data_items =[];
        //Picked up packages
        $more_wheres = '1=1'.$str_dates;
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("COUNT(p.id) AS cnt,p.delivery_type,p.status_id, ps.name AS status")->groupByRaw('p.delivery_type,p.status_id,status')->get();
        $total =0;
        $prev_dtype =null;
        $prev_status_id =null;
        $dtype_count = 0 ; //count items by delivery_type
        $status_count =0;
        //NOTE: $rows is grouped by "delivery_type, status_id"
        foreach($rows as $row) {
            $total += $row->cnt;   
            $this_dtype = $row->delivery_type;
            if ($this_dtype != $prev_dtype && empty($prev_dtype)) {
                $dtype_count++; //first row in the loop
                if(!in_array($row->status_id,$hide_statuses)) $status_count++; 
            }else if ($this_dtype != $prev_dtype && $prev_dtype != null){
                $dtype_count =0;//reset it to zero when loops come to new status
                $status_count =0;
                $row->item_name = $this->translateItemByStatus($row->status_id);
                $row->cnt=$status_count;   
                $data_items[] = $row;
            }
            else{
                $dtype_count++;//increment count on same dType in the loop
                if(!in_array($row->status_id,$hide_statuses)) $status_count++; 
            } 
           
        }
        array_unshift($data_items,(object)['cnt'=>$total,'status_id'=>null,'status'=>null,'name'=>'បញ្ខប់ទៅយក']);
        $data = (object)['p_items'=>$data_items];
        //$rows = DB::table('package AS p')->where('branch_id',$branch_id)->where('sender_id',$sender_id)->whereRaw($more_wheres)->selectRaw("SUM(IFNULL(p.sender_total,0)) AS sender_total, SUM(IFNULL(p.driver_total,0)) AS driver_total")->get();
        //foreach($rows as $row) $data->c_item = $row;
        return $data;
    } 

     function translateItemByStatus($status_id) {
        switch ($status_id)
        {
            case 8:
                return 'បញ្ខប់បានដឹក';
                break;
            case 9:
                return 'បញ្ខប់ដឹកមិនបាន'; 
                break;
                
            case 10:
               return 'បញ្ខប់ដឹកបន្តរ';
               break; 
            case 11:
                return 'បញ្ខប់បញ្ជូនត្រឡប់';
                break;
            default:
               return 'Unknown status';
               break;
        }
        return 'Unknown status';
     } 
        //returns Company summary data for reporting (Not used yet)
        function getCompanySummary($warehouse_id,$start_date, $end_date){ 
            $branch_id = Session::get('branch_id',0); 
            $use_default_dates =1;
            $str_dates = null;
            $start_date = convertDate($start_date);
            $end_date = convertDate($end_date);
            if($use_default_dates==1) {
                if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
                if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
                $str_dates =" AND DATE(p.pickup_time) >='".$start_date."' AND DATE(p.pickup_time) <='".$end_date."' "; 
            }else {
                if ((bool)strtotime($start_date) && (bool)strtotime($end_date)){
                    $str_dates =" AND DATE(p.pickup_time) >='".$start_date."' AND DATE(p.pickup_time) <='".$end_date."' "; 
                }
            }
             
            $data_items =[];
            //Picked up packages
            $more_wheres = '1=1'.$str_dates;
            $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("COUNT(p.id) AS cnt,p.delivery_type,p.status_id, ps.name AS status")->groupByRaw('p.delivery_type,p.status_id,status')->orderByRaw('p.status_id ASC')->get();
            $total =0;
            foreach($rows as $row) {
                $name = 'Unspecified';
                $total += $row->cnt;
                if($row->status_id ==8) $name ='បញ្ខប់បានដឹក';
                else if($row->status_id ==9) $name ='បញ្ខប់ដឹកមិនបាន';
                else if ($row->status_id ==10) $name ='បញ្ខប់ដឹកបន្តរ';
                else if ($row->status_id ==11) $name ='បញ្ខប់បញ្ជូនត្រឡប់';
                $row->item_name =$name;
                $data_items[] = $row;
            }
            array_unshift($data_items,(object)['cnt'=>$total,'status_id'=>null,'status'=>null,'name'=>'បញ្ខប់ទៅយក']);
            //pickup_items
            $data = (object)['p_items'=>$data_items];
            $rows = DB::table('package AS p')->where('branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("SUM(CASE cod WHEN 1 THEN (IFNULL(p.price,0) - IFNULL(p.cod_fee,0)) ELSE 0 END) AS total_cod, SUM(IFNULL(p.sender_total,0)) AS sender_total, SUM(IFNULL(p.driver_total,0)) AS driver_total")->get();
            foreach($rows as $row) $data->c_item = $row;
            return $data;
        }
 

}
