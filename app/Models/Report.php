<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
// use Carbon\Carbon;
use App\Models\CompanyProfile;
use Session;
use DB;
// use Facade\Ignition\QueryRecorder\Query;
// use Illuminate\Database\Eloquent\Collection;
use Sanitizer;
use DateTime;
use DateInterval;
//use Illuminate\Support\Facades\Log;
class Report //extends Model
{
    //use HasFactory;
    //protected $companyModel;

    // public function __construct(array $attributes = [])
    // {
    //     parent::__construct($attributes);
    //     //$this->companyModel = new CompanyProfile();
    // }
    function getSummaryData($d){
        $ss = UM::getUserInfoByToken($d);
        if (!$ss->status_code !==200) return $ss; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
         $branch_id = isset($ss->branch_id)?Sanitizer::sanitize($ss->branch_id):null;
         $agent_type = isset($d->agent_type)?Sanitizer::sanitize($d->agent_type):null;
         $agent_id = isset($d->agent_id)?Sanitizer::sanitize($d->agent_id):null;
         $date = isset($d->date)?$d->date:null;
         if(!(bool)strtotime($date)) $date = date('Y-m-d');

         $more_where ="1=1";
         $rows = DB::table("package AS p")->join('delivery AS d','d.id','=','p.delivery_id')->where('d.branch_id',$branch_id)->whereRaw($more_where)
         ->selectRaw("DATE_FORMAT(d.depart_time,'%d %b %Y %r') AS delivery_date, p.sender_id,COUNT(p.id) AS package_count, 0 AS delivered_count,0 AS failed_count, 0 AS returned_count, 0 AS total_delivery_fee, 0 AS total_cod")->groupByRaw("p.sender_id, delivery_date")->get();
         return $rows;
    }

    function getBranchInfo($branch_id){
        $terms_text ="ចំណាំ៖ រាល់ទំនិញខុសច្បាប់ ម្ចាស់ទំនិញត្រូវទទួលខុសត្រូវចំពោះមុខច្បាប់ដោយខ្លួនឯង ក្រុមហ៊ុនមិនទទួលខុសត្រូវឡើយ។ សូមអគុណសំរាប់ការប្រើប្រាស់សេវាកម្មរបស់យើងខ្ញុំ។";//Write company's terms and condition here
        $rows = DB::table('um_branches AS b')->where('b.branch_id',$branch_id)->selectRaw("b.branch_id,'".$terms_text."' AS terms_text,b.email, b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
        foreach($rows as $row) {
            $row->logo_url =CompanyProfile::logoUrl($branch_id);
            return $row;
        }
        return (object)array("name"=>'(Company Name)','phone_number'=>'(Unvailaible phone)','website'=>'Unvailable');
   }
    //getbarCode() | label Info
    function getPackageLabelInfo($barcode){
       $branch_id =Session::get('branch_id',0);
       $rows = DB::table('package As p')->where('qr_code',$barcode)->selectRaw('id')->take(1)->get();
       $table ='package as p';
       if(!isset($rows[0])) $table ='order_receivers as p';
       $rows =DB::table($table)->where('p.branch_id',$branch_id)->where('p.qr_code',$barcode)->join('sender AS s','s.id','=','p.sender_id')->selectRaw("p.qr_code AS barcode,p.delivery_type,p.cod,DATE_FORMAT(p.create_date,'%d %b %Y') as booking_date,
       CASE IFNULL(p.cod,0) WHEN 1 THEN p.price ELSE 0 END AS price,
       s.name AS sender_name, s.phone_number AS sender_phone, p.receiver_name, p.receiver_address, p.zone_name, p.delivery_notes,p.zone_code,p.receiver_phone,(SELECT `name` FROM driver WHERE id = p.pickup_driver_id LIMIT 1) AS pickup_driver_name,
       CASE LOWER(p.df_payer) WHEN 'receiver' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END AS total_delivery_fee,
       IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.exchange_rate,1) AS exchange_rate")->take(1)->get();
       foreach($rows as $row) return $row;
       return (object)array('barcode'=>null,'cod'=>0,'other_fees'=>0,'price'=>0,'sender_phone'=>null,'sender_name'=>null,'receiver_address'=>null,'receiver_phone'=>null,'zone_name'=>null,'zone_code'=>null,'exchange_rate'=>1,'total_delivery_fee'=>0);
    }

    function getPickupListByMerchant($warehouse_id,$start_date,$end_date,$sender_id,$driver_id){
        $branch_id =Session::get('branch_id',0);
        $str_date = '1=1';
        $str_sender= $sender_id > 0 ? 's.id = '.$sender_id : '2=2';
        $str_driver = $driver_id > 0 ? 'p.pickup_driver_id = '.$driver_id : '3=3';
        $start_date =convertDate($start_date) ?? date('Y-m-d');
        $end_date =convertDate($end_date) ?? date('Y-m-d');
        $str_date = 'DATE(p.arrival_time) >= \''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date. '\'';
        $cols = 'p.id,p.qr_code AS barcode,formatDate(p.arrival_time) AS arrival_date, p.product_type,p.delivery_notes as remarks,p.receiver_phone, s.name AS sender_name, s.code as sender_code, s.phone_number as sender_phone,p.price, (p.price - IFNULL(p.cod_fee,0)) AS cod_amount, p.base_fee, p.delivery_fee,p.driver_id, p.pickup_driver_id'; 
        return DB::table('package as p')->join('sender AS s','s.id','=','p.sender_id')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.warehouse_id',$warehouse_id)->where('p.branch_id',$branch_id)->whereRaw($str_date)->whereRaw($str_sender)->whereRaw($str_driver)->selectRaw($cols)->get();
    }

    function groupRows($rows, $col_name) {
        $result = [];

        foreach ($rows as $row) {
            $col_value = $row->$col_name;

            if (!isset($result[$col_value])) {
                $result[$col_value] = [];
            }

            $result[$col_value][] = $row;
        }

        return $result;
    }

    /**
     *filterOutstandingPackages($rows) returns all outstanding packages in status (5,6,9)
    */
    function filterOutstandingPackages($rows, $delivery_date) {
        // Assuming dateAdd is used correctly and returns the prior date in 'Y-m-d' format
        //$prior_date = dateAdd('day', -1, $delivery_date, 'Y-m-d');
        $delivery_date = convertDate($delivery_date);
        // Check if $rows is a collection or an array
        if ($rows instanceof \Illuminate\Support\Collection) {
            // If $rows is a collection, use the 'filter' method
            return $rows->filter(function ($row) use ($delivery_date) {
                return ( in_array($row->status_id,[5,6,9]) && convertDate($row->orderByDate) < $delivery_date);
            });
        } elseif (is_array($rows)) {
            // If $rows is an array, use array_filter
            return array_filter($rows, function ($row) use ($delivery_date) {
                return (in_array($row->status_id,[5,6,9]) && convertDate($row->orderByDate) < $delivery_date);
            });
        } else {
            // Handle other data types or return an error message if needed
            return null; // You can customize this based on your needs
        }
    }


    function getDailyPackageCountByMerchant($branch_id,$warehouse_id, $start_date,$end_date,$sender_id = null,$pmt_status_id =null){
       $branch_id = $branch_id?$branch_id : Session::get('branch_id',0);
       $start_date = convertDate($start_date);
       $end_date = convertDate($end_date);

       $str_warehouse = 'p.warehouse_id ='.$warehouse_id.' AND p.branch_id ='.$branch_id;
       if(!(bool)strtotime($end_date)) $end_date =date('Y-m-d');
       if(!(bool)strtotime($start_date)) $start_date =date('Y-m-d');
       $str_dates = 'DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\'';
       $str_sender= $sender_id > 0? 's.id ='.$sender_id :'1=1';
       $str_sender_pmt_status ='2=2';
       if($pmt_status_id ===1){
         //Query the paid packages, we assume that then status is Paid then it must have been "delivered"
         $str_sender_pmt_status ='p.sender_pmt_status_id =1';
       }else if($pmt_status_id ===0){
         //For Unpaid package, Except returned packages
        $str_sender_pmt_status ='(IFNULL(p.sender_pmt_status_id,0) =0 AND p.status_id <> 11)';
       }

       $cols = 'COUNT(p.id) AS package_count,
       SUM(CASE p.status_id WHEN 5 THEN 1 ELSE 0 END) AS at_warehouse_count,
       SUM(CASE p.status_id WHEN 6 THEN 1 ELSE 0 END) AS on_delivery_count,
       SUM(CASE p.status_id WHEN 8 THEN 1 ELSE 0 END) AS delivered_count,
       SUM(CASE p.status_id WHEN 9 THEN 1 ELSE 0 END) AS failed_count,
       SUM(CASE p.status_id WHEN 11 THEN 1 ELSE 0 END) AS returned_count,
       formatDate(p.arrival_time) AS arrival_date,s.id AS sender_id,s.code AS sender_code, s.`name` AS sender_name, s.phone_number';
       $rows=  DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->whereRaw($str_dates)->whereRaw($str_warehouse)->whereRaw($str_sender)->whereRaw($str_sender_pmt_status)->selectRaw($cols)->orderByRaw('arrival_date DESC')->groupByRaw('arrival_date,s.code,s.id,s.name,s.phone_number')->havingRaw('COUNT(p.id) > 0')->get();
       return $this->groupRows($rows,'arrival_date');
    }

    //getPackageList() returns package list based on start_date and end_date (compared to package's Arrival Dates, not Create Dates )
    //$completed == true => show only completed package list
    function getPackageList($warehouse_id,$completed=-1,$start_date=null,$end_date=null,$search_value=null,$sender_id=null,$delivery_type=null,$zone_code=null,$driver_id=null,$status_id=null,$sender_pmt_status_id=-1){
        $branch_id =Session::get('branch_id',0);
        $more_wheres = "o.status_id <=4 "; //" o.warehouse_id ='".$warehouse_id."' ";
        $str_search = null;
        $str_date = null;
        $str_sender= $sender_id>0? " AND p.sender_id =$sender_id":'';
        $str_driver=null;
        $str_zone = null;
        $str_status = null;
        $str_delivery_type =null;
        $str_warehouse = null;
        $str_sender_pmt = ($sender_pmt_status_id !==null && $sender_pmt_status_id>=0)? " AND p.sender_pmt_status_id=$sender_pmt_status_id":"";

        if ($warehouse_id>0) $str_warehouse = " AND p.warehouse_id =$warehouse_id";
        $more_wheres .= $str_warehouse;

        if(!(bool)strtotime($start_date)) $start_date =date('Y-m-d');
        if(!(bool)strtotime($end_date)) $end_date =date('Y-m-d');
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);

        $str_completed ="";
        if ($completed ==1){
            $str_completed =" AND IFNULL(p.outstanding,0) = 1 OR p.status_id IN (8,11)";
        }
        else if ($completed===0){
            $str_completed =" AND IFNULL(p.outstanding,0) = 0 AND p.status_id NOT IN (8,11)";
        }

        if (empty($status_id)) $status_id = -1; // All statuses of packages

        if ($search_value) {
            $str_search = " AND (p.qr_code ='".$search_value."') OR p.receiver_phone ='$search_value'  OR s.phone_number ='$search_value' OR s.name ='%.$search_value%'";
            $more_wheres = " p.status_id > 4 ".$str_completed.$str_search;
          }
          else{
            if ($delivery_type) $str_delivery_type =' AND p.delivery_type =\''.$delivery_type.'\' ';
            //if(!$warehouse_id > 0) $str_warehouse =" AND p.warehouse_id ='".$data->warehouse_id."' ";
            if ($driver_id > 0) $str_driver = ' AND p.driver_id ='. $driver_id;
            if ($driver_id ==-1) $str_driver = '';
            if ($sender_id > 0) $str_sender = ' AND p.sender_id ='.$sender_id;
            if ($zone_code) $str_zone = ' AND p.zone_code =\''.$zone_code.'\'';
            if ($status_id != -1 && $status_id > 0) $str_status = ' AND p.status_id ='.$status_id;
            $str_date = " AND (DATE(p.arrival_time) >= '$start_date' AND DATE(p.arrival_time) <= '$end_date')";
            $more_wheres = ' p.status_id > 4 '.$str_completed.$str_warehouse.$str_sender.$str_sender_pmt.$str_delivery_type.$str_driver.$str_zone.$str_date.$str_status;
          }
          $select_cols ='p.id As package_id,p.delivery_id, p.order_id,formatDate(p.arrival_time) AS arrival_date,formatDate(p.create_date) AS create_date,p.product_type, p.zone_code, p.delivery_type, p.qr_code AS barcode,p.delivery_condition, p.delivery_type, formatTime(delivery_time) AS delivery_time, delivery_notes,return_notes,failure_notes,
          formatDate(p.arrival_time) AS `arrival_time`, s.sender_type_id, st.name AS sender_type, (select x.name from driver as x WHERE x.id = p.driver_id LIMIT 1) AS driver_name, p.driver_id,
         p.status_id,(SELECT ds.name FROM package_statuses AS ds WHERE ds.id = p.status_id LIMIT 1) AS status, p.sender_id, s.phone_number AS sender_phone, p.receiver_id, p.receiver_address, p.receiver_name, p.receiver_phone, p.zone_code,p.zone_name, s.name AS sender_name,p.cod,p.df_payer,p.forwarding_cost,p.price,p.delivery_fee,p.base_fee, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total';
         return DB::table('package AS p')->join('sender AS s','s.id','=','p.sender_id')->join('sender_type AS st','st.id','=','s.sender_type_id')->selectRaw($select_cols)->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('p.create_date DESC,p.sender_id,p.status_id ASC')->get();
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
            if(!empty($shift) && $shift != '0') $str_shift = " AND s.shift ='$shift' ";
            if(!empty($emp_type)) $str_emp_type ="AND s.emp_type ='".Sanitizer::sanitize($emp_type)."' ";
            if(!empty($status_code)) $str_status ="AND s.status_code ='".Sanitizer::sanitize($status_code)."' ";
            $more_wheres .=$str_emp_type.$str_status.$str_shift;
         } else {
            $str_search = "AND (s.name LIKE '%".escape_like_str($search_value)."%' OR s.phone_number ='".Sanitizer::sanitize($search_value)."' )";
            $more_wheres .=$str_search;
         }
        //driver's role = {'pickup_only','pickup_and_delivery','delivery_only','all'}
         return DB::table('driver as s')->selectRaw("'Main warehouse' AS warehouse_name,1 As warehouse_id,s.id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,s.email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role")->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('warehouse_name ASC,s.emp_type ASC')->get();
         //$rows = DB::table('driver as s')->join('driver_warehouses AS dw','dw.driver_id','=','s.id')->join('warehouses AS h','dw.warehouse_id','=','h.id')->selectRaw("h.name AS warehouse_name,s.id,s.code,s.national_id,s.status_code,s.name,s.name_kh,s.sex,s.driver_license_number,s.vehicle_type,s.vehicle_number,s.address,s.phone_number,encode_email(s.email) AS email,s.emp_type,salary,s.shift, s.delivery_commission_type,s.pickup_commission_type,s.role")->where('s.branch_id',$branch_id)->whereRaw($more_wheres)->orderByRaw('warehouse_name ASC,s.emp_type ASC')->get();
     }

     function getBankAccountInfo($sender_id){
        $rows = DB::table('sender_bank_accounts as acc')->join('sender as s','s.id','=','acc.sender_id')->where('s.id',$sender_id)->select(['account_number','account_name','bank_name','is_primary'])->orderBy('is_primary','DESC')->take(1)->get();
        foreach($rows as $row) return $row;
        return (object)[
            'account_number'=>'NA',
            'account_name'=>'NA',
            'bank_name'=>''
        ];
     }

     function getSenderList($warehouse_id){
        $branch_id = Session::get('branch_id',0);
        $rows = DB::table('sender as s')->join('sender_type as t','t.id','=','s.sender_type_id')->selectRaw("'Main warehouse' AS warehouse_name,1 As warehouse_id,s.id,s.code,s.status_code,s.name,s.name_kh,s.address,s.phone_number,s.email,t.name as sender_type,business_type")->where('s.branch_id',$branch_id)->orderByRaw('warehouse_id ASC')->orderBy('s.sender_type_id','ASC')->orderBy('s.name','ASC')->get();
        foreach($rows as $row){
            $acc = $this->getBankAccountInfo($row->id);
            $row->account_number = $acc->account_number;
            $row->account_name = $acc->account_name;
            $row->bank_name = $acc->bank_name;
        }
        return $rows;
    }

     //"dr_package_list" => driver_report, driver report,
     function getDeliveredPackagesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null){
            $branch_id = Session::get('branch_id',0);
            $str_dates =null;
            //$str_delivery_type = null;
            $str_driver =null;
            if ($driver_id > 0) $str_driver = ' AND p.driver_id ='.$driver_id;

            $start_date = convertDate($start_date);
            $end_date = convertDate($end_date);

            if((bool)strtotime($start_date)) $str_dates =' AND DATE(p.arrival_time) >= \''.$start_date.'\'';
            if((bool)strtotime($end_date))  $str_dates .= ' AND DATE(p.arrival_time) <=\''.$end_date.'\'';
            //if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$delivery_type."' ";
            $more_wheres = 'p.status_id =8 ';
            if($warehouse_id > 0){
                $more_wheres .= ' AND p.warehouse_id ='.$warehouse_id;
            }
            $more_wheres .= $str_dates.$str_driver;
            $selectCols ="p.id AS package_id, p.delivery_type, p.qr_code AS barcode,p.sender_name, p.sender_phone, p.receiver_name, p.receiver_phone, p.receiver_address, p.zone_code, p.zone_name,
            CASE p.status_id WHEN 8 THEN DATE_FORMAT(p.arrival_time,'%d %b %Y') ELSE DATE_FORMAT(p.create_date,'%d %b %Y') END AS delivery_date,
            CASE p.cod WHEN 1 THEN ifnull(p.price,0) ELSE 0 END AS cod_amount,
            p.df_payer,
            ifnull(p.cod_fee,0) AS cod_fee,
            IFNULL(p.base_fee,0) AS base_fee,
            CASE lower(p.df_payer) WHEN 'receiver' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END AS fees,
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
            return DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCols)->orderByRaw('p.create_date DESC,p.delivery_type')->get();
    }


       //"vd_package_list", "vd_deliveries" => sender_report, merchant report, pacakge list belonging to sender
       function getPackagesBySender($warehouse_id, $sender_id, $start_date, $end_date,$delivery_type=null, $status_id = null){
        $branch_id = Session::get('branch_id',0);
        $str_dates =null;
        //$str_delivery_type = null;
        $end_date =convertDate($end_date);
        $start_date =convertDate($start_date);

        if((bool)strtotime($start_date)) $str_dates =" AND DATE(p.arrival_time) >= '".convertDate($start_date)."'";
        if((bool)strtotime($end_date))  $str_dates .= " AND DATE(p.arrival_time) <='".convertDate($end_date)."' ";
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
    function getSummarizedDeliveriesByDriver($warehouse_id=0, $driver_id=0, $start_date='', $end_date='',$delivery_type=null, $status_id = 0){
        $branch_id = Session::get('branch_id',0);
        $str_dates =null;
        $str_delivery_type = null;
        $str_driver = null;
        $str_status = null;

        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if(!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if(!(bool)strtotime($end_date)) $end_date = date('Y-m-d');

        $str_dates =" AND DATE(p.arrival_time) >= '$start_date' AND DATE(p.arrival_time) <='$end_date'";
        if (!empty($delivery_type)) $str_delivery_type =" AND p.delivery_type ='".$delivery_type."' ";

        if (empty($status_id)) $status_id = 8;
        if ($status_id > 0) $str_status =" p.status_id =$status_id";

        $more_wheres = $str_status;
        if($warehouse_id > 0){
            $more_wheres .= " AND p.warehouse_id ='".$warehouse_id."' ";
        }

        if ($driver_id > 0) $str_driver =" AND driver_id =$driver_id";
        $more_wheres .= $str_dates.$str_driver;
        $selectCol ="'$' AS currency, COUNT(p.id) AS package_count, p.delivery_type, SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS cod_amount, SUM(IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) AS fees,  SUM(CASE lower(p.df_payer) WHEN 'receiver' THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0)) ELSE 0 END) collected_fees, SUM(IFNULL(p.driver_adjust_amount,0)) AS adjust_amount, '' AS remarks";
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw($selectCol)->groupBy('p.delivery_type')->orderByRaw('p.delivery_type')->get();
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
    function getDriverCommissionRates($driver_id,$delivery_type ='normal'){
        $branch_id = Session::get('branch_id',0);
        $sql_driver = null;
        if ($driver_id> 0) $sql_driver = "c.driver_id =$driver_id";
        $rows = DB::table('driver_commissions AS c')->where('c.branch_id',$branch_id)->whereRaw($sql_driver)->where('is_current',1)->selectRaw('IFNULL(c.pickup_commission,0) AS pickup_commission,IFNULL(c.delivery_commission,0) AS delivery_commission')->limit(1)->get();
        foreach($rows as $row) return $row;
        return (object)['pickup_commission'=>0,'delivery_commission'=>0];
    }

    static function getReturnedCountByDriver($branch_id,$warehouse_id,$driver_id,$start_date,$end_date){
        $more_wheres ="DATE(p.delivery_time) >='".convertDate($start_date)."' AND DATE(p.delivery_time) <='".convertDate($end_date)."' AND p.pickup_driver_id = ".$driver_id;
        return DB::table('package as p')->where('p.branch_id',$branch_id)->where('p.warehouse_id',$warehouse_id)->whereRaw($more_wheres)->distinct()->count('p.id');
    }

    /** getDriverCommissions | commissions| getDriverCommissionItems() is used by Driver Mobile App and backend 's Driver Commission report */
    function getDriverCommissionItems($ss,$warehouse_id,$driver_id, $start_date, $end_date){
      if(!$warehouse_id){
        /** $ss must have {"branch_id",[user_id] } */
        $warehouse_id = GeneralSettings::getDefaultWarehouse($ss);
      }
      if(!$driver_id) $driver_id =0; 
      if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
      if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
      $op = $this->getDriverCommissionOptions();
      //$cmm = $this->getDriverCommissionRates($driver_id);
      $more_wheres = null;
      $sql = null;
      $start_date = convertDate($start_date);
      $end_date = convertDate($end_date);
 
      //todo: get branch_id from token
      $branch_id = $ss?$ss->branch_id: 0;
      $user_class = isset($ss->user_class)?$ss->user_class:'Admin';
      $notes = 'ទំនិញត្រូវតែបានទូទាត់ជាមួយអ្នកដឹកនឹងជាមួយអ្នកលក់'; 
      $is_from_mobile = strtolower($user_class) ==='driver';
      if($is_from_mobile){
          /** DO not display long remraks on Mobile Driver App */
          $notes = '';  
      } 

      /** PICKUP and DELIVERY COUNT PER ITEMS => Default pickup_cmm_type ='per_item' **/
        // for time being => now use "booking_date" to retrieve number of pickups or packages picked
        $str_dates =' AND DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\'';
        $sql_pickup = 'SELECT \'USD\' AS currency_code, \'Pickup\' AS category, p.delivery_type, p.pickup_driver_id AS driver_id, SUM(CASE p.status_id WHEN 11 THEN 1 ELSE 0 END)  AS returned_count, SUM(CASE (p.status_id =8 and p.driver_pmt_status_id =1 AND p.sender_pmt_status_id =1) WHEN 1 THEN 1 ELSE 0 END) AS item_count, getDriverCommission(\'pickup\',pickup_driver_id,p.delivery_type) AS unit_amount,\''.$op->pickup_cmm_type. '\' AS cmm_type, \''.$notes.'\' AS remarks FROM `package` AS p WHERE p.branch_id = '.$branch_id.' AND p.status_id IN (8,11) AND p.pickup_driver_id ='.$driver_id.' '.$str_dates.
        ' GROUP BY pickup_driver_id, p.delivery_type';
        /** Default delivery_cmm_type ='per_item' **/
        $str_dates =' AND DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <=\''.$end_date.'\'';
        $sql_delivery = 'SELECT \'USD\' AS currency_code,\'Delivery\' AS category,p.delivery_type, p.driver_id, 0 AS returned_count, COUNT(p.id) AS item_count, getDriverCommission(\'delivery\',p.driver_id,p.delivery_type) AS unit_amount,\''.$op->delivery_cmm_type.'\' AS cmm_type, \''.$notes.'\' AS remarks FROM `package` AS p WHERE p.branch_id ='.$branch_id.' AND p.status_id= 8 AND p.driver_pmt_status_id =1 AND p.sender_pmt_status_id =1 AND p.driver_id ='.$driver_id.' '.$str_dates.
        " GROUP BY driver_id, p.delivery_type";

      /** COUNT PER PICKUP POINT and PER DELIVERY TRIP */  
        if ($op->pickup_cmm_type =='per_pickup'){
            // For time being => now use "booking_date" to retrieve number of pickups or packages picked
            $more_wheres =" AND DATE(o.create_date) >='".$start_date."' AND DATE(o.create_date) <='".$end_date."' ";  
            $sql_pickup ="SELECT 'USD' AS currency_code, 'Pickup' AS category, o.delivery_type, '$driver_id' AS driver_id, 0 AS returned_count, COUNT(o.id) AS item_count,getDriverCommission('pickup',o.driver_id,o.delivery_type) AS unit_amount,'".$op->pickup_cmm_type."' AS cmm_type, NULL AS remarks FROM `order` AS o WHERE o.branch_id = '$branch_id' AND IFNULL(o.driver_id,0) >0 AND o.status_id >=3 AND o.driver_id =".$driver_id." ".$more_wheres.
            " GROUP BY driver_id,o.delivery_type"; 
        }
        if ($op->delivery_cmm_type =='per_trip'){
            $more_wheres =' AND DATE(d.delivery_time) >=\''.$start_date.'\' AND DATE(d.delivery_time) <=\''.$end_date.'\' ';  
            $sql_delivery = "SELECT 'USD' AS currency_code,'Delivery' AS category,d.delivery_type,'$driver_id' AS driver_id, 0 AS returned_count, COUNT(d.driver_id) AS item_count,getDriverCommission('delivery',d.driver_id,d.delivery_type)  AS unit_amount,'".$op->delivery_cmm_type."' AS cmm_type, NULL AS remarks FROM `package` AS d WHERE d.branch_id = '$branch_id' AND IFNULL(d.driver_id,0) >0 AND d.status_id =3 AND d.driver_id ='".$driver_id."' ".$more_wheres.
            " GROUP BY driver_id,d.delivery_type";
        }

      $sql = '('.$sql_pickup.') UNION '.$sql_delivery;
   
      $rows = DB::select(DB::raw($sql));
      $total = 0;
      $total_item_count =0;
      $bottom_notes = '';
      foreach($rows as $row){
        if(isset($row->item_count)){
            $row->returned_count = isset($row->returned_count)?$row->returned_count:0;
            $cat = strtolower($row->category);
            if($cat ==='pickup'){
                $total_item_count = $row->item_count + $row->returned_count;
                //The $row->item_count becomes "total_item_count"
                $bottom_notes = 'Pickup count: '.$row->item_count. ' pcs = '.$total_item_count.' (picked items) - '.$row->returned_count.' (returned items)';   
            }else $total_item_count = $row->item_count;
            $row->unit_amount = $row->unit_amount>=0? $row->unit_amount:0; 
            $amount = $total_item_count * $row->unit_amount;
            $row->line_total = $amount;
            $total += $amount;
        }
      }

      return (object)[
           'bottom_notes_one'=>$bottom_notes,
           'currency_code'=>'USD',
           'total'=>number_format($total,2,'.',''),
           'remarks'=>'ទំនិញ​ដែល​ត្រូវ​បាន​យក​មក​ហាង​វិញ​មិន​ត្រូវ​បាន​រាប់​បញ្ចូល​ក្នុង​ការ​ចេញ​ប្រាក់​កម្រៃ​ជើង​សារ​ទេ។ '.$notes, //'Pickup items that have been returned to store are not counted for commission disbursement',
           'items'=> $rows 
      ];
    }
 
    function getDriverCommissionItems_mobile($ss,$driver_id, $start_date, $end_date){
        //$warehouse_id = GeneralSettings::getDefaultWarehouse($ss);
        if(!$driver_id) $driver_id =0; 
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $op = $this->getDriverCommissionOptions();
        //$cmm = $this->getDriverCommissionRates($driver_id);
        $more_wheres = null;
        $sql = null;
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
  
        //todo: get branch_id from token
         $branch_id = $ss?$ss->branch_id: 0;
         
        /** PICKUP and DELIVERY COUNT PER ITEMS => Default pickup_cmm_type ='per_item' **/
          // for time being => now use "booking_date" to retrieve number of pickups or packages picked
          $str_dates =' AND DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\'';
          $sql_pickup = 'SELECT \'USD\' AS currency_code, \'Pickup\' AS category, p.delivery_type, p.pickup_driver_id AS driver_id, SUM(CASE p.status_id WHEN 11 THEN 1 ELSE 0 END)  AS returned_count, SUM(CASE (p.status_id =8 and p.driver_pmt_status_id =1 AND p.sender_pmt_status_id =1) WHEN 1 THEN 1 ELSE 0 END) AS item_count, getDriverCommission(\'pickup\',pickup_driver_id,p.delivery_type) AS unit_amount,\''.$op->pickup_cmm_type. '\' AS cmm_type, \'ទំនិញត្រូវតែបានទូទាត់ជាមួយអ្នកដឹកនឹងជាមួយអ្នកលក់\' AS remarks FROM `package` AS p WHERE p.branch_id = '.$branch_id.' AND p.status_id IN (8,11) AND p.pickup_driver_id ='.$driver_id.' '.$str_dates.
          ' GROUP BY pickup_driver_id, p.delivery_type';
          /** Default delivery_cmm_type ='per_item' **/
          $str_dates =' AND DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <=\''.$end_date.'\'';
          $sql_delivery = 'SELECT \'USD\' AS currency_code,\'Delivery\' AS category,p.delivery_type, p.driver_id, 0 AS returned_count, COUNT(p.id) AS item_count, getDriverCommission(\'delivery\',p.driver_id,p.delivery_type) AS unit_amount,\''.$op->delivery_cmm_type.'\' AS cmm_type, \'ទំនិញត្រូវតែបានទូទាត់ជាមួយអ្នកដឹកនឹងជាមួយអ្នកលក់ \' AS remarks FROM `package` AS p WHERE p.branch_id ='.$branch_id.' AND p.status_id= 8 AND p.driver_pmt_status_id =1 AND p.sender_pmt_status_id =1 AND p.driver_id ='.$driver_id.' '.$str_dates.
          " GROUP BY driver_id, p.delivery_type";
  
        /** COUNT PER PICKUP POINT and PER DELIVERY TRIP */  
          if ($op->pickup_cmm_type =='per_pickup'){
              // For time being => now use "booking_date" to retrieve number of pickups or packages picked
              $more_wheres =" AND DATE(o.create_date) >='".$start_date."' AND DATE(o.create_date) <='".$end_date."' ";  
              $sql_pickup ="SELECT 'USD' AS currency_code, 'Pickup' AS category, o.delivery_type, '$driver_id' AS driver_id, 0 AS returned_count, COUNT(o.id) AS item_count,getDriverCommission('pickup',o.driver_id,o.delivery_type) AS unit_amount,'".$op->pickup_cmm_type."' AS cmm_type, NULL AS remarks FROM `order` AS o WHERE o.branch_id = '$branch_id' AND IFNULL(o.driver_id,0) >0 AND o.status_id >=3 AND o.driver_id =".$driver_id." ".$more_wheres.
              " GROUP BY driver_id,o.delivery_type"; 
          }
          if ($op->delivery_cmm_type =='per_trip'){
              $more_wheres =' AND DATE(d.delivery_time) >=\''.$start_date.'\' AND DATE(d.delivery_time) <=\''.$end_date.'\' ';  
              $sql_delivery = "SELECT 'USD' AS currency_code,'Delivery' AS category,d.delivery_type,'$driver_id' AS driver_id, 0 AS returned_count, COUNT(d.driver_id) AS item_count,getDriverCommission('delivery',d.driver_id,d.delivery_type)  AS unit_amount,'".$op->delivery_cmm_type."' AS cmm_type, NULL AS remarks FROM `package` AS d WHERE d.branch_id = '$branch_id' AND IFNULL(d.driver_id,0) >0 AND d.status_id =3 AND d.driver_id ='".$driver_id."' ".$more_wheres.
              " GROUP BY driver_id,d.delivery_type";
          }
  
        $sql = '('.$sql_pickup.') UNION '.$sql_delivery;
        $rows = DB::select(DB::raw($sql));
        $pickup_items = [];
        $delivery_items = [];
        foreach($rows as $row){
            $cat = strtolower($row->category);
           if($cat==='pickup'){
            $net_item_count = $row->item_count - $row->returned_count;
             /** Display "item_count" as "net_item_count" instead */
             $row->count =  $net_item_count;
             $row->currency = '$';
             $total = $row->count * $row->unit_amount;
             $row->total =  number_format($total,2,'.',',');
             $pickup_items[] = $row;
           }
           else if ($cat ==='delivery'){
             $row->count = $row->item_count;
             $row->currency = '$';
             $total = $row->count * $row->unit_amount;
             $row->total =  number_format($total,2,'.',',');
             $delivery_items[] = $row; 
           }
        }
        return (object)[
             'pickup_items'=>$pickup_items,
             'delivery_items'=>$delivery_items
        ];
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
    function getDriverReport_mobile($ss,$driver_id,$start_date, $end_date){
        $m = $this->getDriverCommissionItems($ss,null,$driver_id,$start_date, $end_date);
        $total_due = $this->getDriverTotalDue($driver_id,$start_date, $end_date);
       return (object)array('cur'=>'$','currency_code'=>'USD','commissions'=>$m,'total_due'=>$total_due);
    }

    //dr_payments driver report
    function getPaymentsByDriver($driver_id, $start_date, $end_date){
        $branch_id = Session::get('branch_id',0);
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_driver =null;

        if ($driver_id >0) $str_driver =" AND payer_id =$driver_id ";
        //$more_wheres includes $str_driver

        /***
         //IMPORTANT NOTE: the condition "where ABS(r.amount) > 0" is used because
           when Exparess company pays back to driver for taxi fee => the "r.amount" is negative
           //Todo: later we should move this "payment to driver" transaction to be stored in cash_disbursement table instead
         * ***/
        $more_wheres ="ABS(r.amount)>0 AND DATE(r.payment_date) >= '".$start_date."' AND DATE(r.payment_date) <='".$end_date."' ".$str_driver;
        $select_cols ='HEX(r.trx_id) AS trx_id, \'Receipt\' AS trx_type,r.payer_id,r.payer_name, r.payer_type,formatTime(r.payment_date) AS payment_date,r.package_count, r.amount,r.currency_code,r.create_user,r.create_date, r.remarks';
        $rows = DB::table('cash_receipts AS r')->where('branch_id',$branch_id)->where('payer_type','driver')->whereRaw($more_wheres)->selectRaw($select_cols)->orderByRaw('r.create_date DESC')->get();
        foreach($rows as $row){
           $bs = DB::table('receipt_breakdowns as bs')->whereRaw('bs.trx_id = UNHEX(\''.$row->trx_id.'\')')->selectRaw('bs.pmt_method,bs.amount,bs.currency_code,bs.notes')->get();
           $notes = '';
            foreach($bs as $x){
            $notes .= ($notes? '|':''). $x->pmt_method.' '.$x->amount.' '.$x->currency_code;
            }
            $row->pmt_breakdowns = $notes;
        }
        return $rows;
    }

    function getPreviousPackages($branch_id,$start_date){
        $str_dates ="DATE(p.arrival_time) <'$start_date' AND p.status_id IN (5,6,9)"; /** At warehouse, On-Delivery, Failed **/
        return DB::table('package AS p')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($str_dates)->selectRaw('p.id, p.status_id,p.delivery_type, IFNULL(p.base_fee,0) AS base_fee, IFNULL(delivery_fee,0) AS delivery_fee, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total,IFNULL(p.sender_net_amount,0) AS sender_net_amount,p.cod,IFNULL(p.price,0) AS price,IFNULL(p.cod_fee,0) AS cod_fee, sender_pmt_status_id, driver_pmt_status_id,IFNULL(p.exchange_rate,1) AS exchange_rate,IFNULL(p.forwarding_cost,0) AS forwarding_cost, p.df_payer,failed_num')->get();
    }

    //General summary report Daily/ general report
    function getCompanyReport_summary($warehouse_id,$start_date=null,$end_date=null){
       $branch_id = Session::get('branch_id',0);
       if(!(bool)strtotime($start_date)) $start_date =date('Y-m-d');
       if(!(bool)strtotime($end_date)) $end_date = $start_date;
       $start_date = convertDate($start_date);
       $end_date = convertDate($end_date);

       $str_dates ="DATE(p.arrival_time) >='$start_date' AND DATE(p.arrival_time) <='$end_date'";
       $rows = DB::table('package AS p')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->where('p.warehouse_id',$warehouse_id)->whereRaw($str_dates)->selectRaw("COUNT(DISTINCT p.sender_id) AS cnt")->get();
       $sender_count = 0;
       foreach($rows as $row) $sender_count = $row->cnt;

       //get package counts by different statuses
       $rows = DB::table('package AS p')->join('sender as s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->where('p.warehouse_id',$warehouse_id)->whereRaw($str_dates)->selectRaw('p.id, p.status_id,p.delivery_type, IFNULL(p.base_fee,0) AS base_fee, IFNULL(delivery_fee,0) AS delivery_fee, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total,IFNULL(p.sender_net_amount,0) AS sender_net_amount,p.cod,IFNULL(p.price,0) AS price,IFNULL(p.cod_fee,0) AS cod_fee, sender_pmt_status_id, driver_pmt_status_id,IFNULL(p.exchange_rate,1) AS exchange_rate,IFNULL(p.forwarding_cost,0) AS forwarding_cost, p.df_payer,failed_num')->get();

       $str_diff_dates ='DATE(p.delivery_time) >=\''.$start_date.'\' AND DATE(p.delivery_time) <=\''.$end_date.'\' AND DATE(p.arrival_time) < \''.$start_date.'\'';
       //$diff_packages is packages that are delivered or returned on the selected filter date, but those package arrived earlier than the filter date
       $diff_packages = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('p.warehouse_id',$warehouse_id)->whereRaw($str_diff_dates)->whereRaw('p.status_id IN (8,11)')->selectRaw('p.id, p.status_id,p.delivery_type, IFNULL(p.base_fee,0) AS base_fee, IFNULL(delivery_fee,0) AS delivery_fee, IFNULL(p.driver_total,0) AS driver_total, IFNULL(p.sender_total,0) AS sender_total,IFNULL(p.sender_net_amount,0) AS sender_net_amount,p.cod,IFNULL(p.price,0) AS price,IFNULL(p.cod_fee,0) AS cod_fee, sender_pmt_status_id, driver_pmt_status_id,IFNULL(p.exchange_rate,1) AS exchange_rate,IFNULL(p.forwarding_cost,0) AS forwarding_cost, p.df_payer,failed_num')->get();

       //$diff_packages is packages that are delivered or returned on the selected filter date, but those package arrived earlier than the filter date
       $leftover_rows = $this->getPreviousPackages($branch_id,$start_date);
        // $count_delivered_normal = $this->countPackageByStatus($rows,8,'normal');
        //    $count_delivered_fast = $this->countPackageByStatus($rows,8,'fast');
        //    //$count_failed = $this->countPackageByStatus($rows,9);

        //    $count_ctd_normal = $this->countPackageByStatus($rows,10,'normal');
        //    $count_ctd_fast = $this->countPackageByStatus($rows,10,'fast');
        // $count_returned_normal = $this->countPackageByStatus($rows,11,'normal');

       $p = $this->countPackages_rpt($rows,[]);
       $leftOverInfo = $this->countPackages_rpt($leftover_rows,[8,11]);
       $diff_package_info =   $this->countPackages_rpt($diff_packages,[5,6,9]);
       //$count_returned_fast = $this->countPackageByStatus($rows,11,'fast');
       //$m = $this->countPickups($rows);

    //    $count_failed = $count_returned_normal + $count_returned_fast + $count_ctd_normal + $count_ctd_fast;
    //    $count_failed_normal = $count_returned_normal  + $count_ctd_normal;
    //    $count_failed_fast =  $count_returned_fast + $count_ctd_fast;

       $package_counts = [];
       $p_date = date('d M Y',strtotime($start_date));
       $package_counts[] = (object)array('is_past'=>0,'status_id'=>null,'item_name'=>'ចំនួនកញ្ចប់បានទៅយក','total'=>$p->count,'normal'=>$p->count_normal,'fast'=>$p->count_fast);
       $package_counts[] = (object)array('is_past'=>0,'status_id'=>5,'item_name'=>'ចំនួនកញ្ចប់ នៅឃ្លាំង (At Warehouse)','total'=>$p->at_warehouse->total, 'normal'=>$p->at_warehouse->normal,'fast'=>$p->at_warehouse->fast);
       $package_counts[] = (object)array('is_past'=>0,'status_id'=>6,'item_name'=>'ចំនួនកញ្ចប់ កំពុងដឹក (On Delivery)','total'=>$p->on_delivery->total, 'normal'=>$p->on_delivery->normal,'fast'=>$p->on_delivery->fast);
       $package_counts[] = (object)array('is_past'=>0,'status_id'=>8,'item_name'=>'ចំនួនកញ្ចប់ដឹកបាន','total'=>$p->delivered->total, 'normal'=>$p->delivered->normal,'fast'=>$p->delivered->fast);
       $package_counts[] = (object)array('is_past'=>0,'status_id'=>9,'item_name'=>'ចំនួនកញ្ចប់ដឹកមិនបានសំរេច','total'=>$p->failed->total,'normal'=>$p->failed->normal,'fast'=>$p->failed->fast);

       //$package_counts[] = (object)array('status_id'=>10,'item_name'=>'ចំនួនកញ្ចប់បន្តរដឹក','total'=>$p->ctd->total,'normal'=>$p->ctd->normal,'fast'=>$p->ctd->fast);
       $package_counts[] = (object)array('is_past'=>0,'status_id'=>11,'item_name'=>'ចំនួនកញ្ចប់បញ្ជូនត្រឡប់','total'=>$p->returned->total,'normal'=>$p->returned->normal,'fast'=>$p->returned->fast);
       $package_counts[] = (object)array('is_past'=>2,'status_id'=>8,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' ដឹកបាន','total'=>$diff_package_info->delivered->total, 'normal'=>$diff_package_info->delivered->normal,'fast'=>$diff_package_info->delivered->fast);
       $package_counts[] = (object)array('is_past'=>2,'status_id'=>11,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' បញ្ជូនត្រឡប់','total'=>$diff_package_info->returned->total,'normal'=>$diff_package_info->returned->normal,'fast'=>$diff_package_info->returned->fast);

       $package_counts[] = (object)array('is_past'=>1,'status_id'=>null,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' (At Warehouse, On-Delivery, Failed)','total'=>$leftOverInfo->count,'normal'=>$leftOverInfo->count_normal,'fast'=>$leftOverInfo->count_fast);
       //$package_counts[] = (object)array('status_id'=>8,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' ដឹកបាន','total'=>$leftOverInfo->delivered->total, 'normal'=>$leftOverInfo->delivered->normal,'fast'=>$leftOverInfo->delivered->fast);
       $package_counts[] = (object)array('is_past'=>1,'status_id'=>9,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' ដឹកមិនបាន (Failed)','total'=>$leftOverInfo->failed->total,'normal'=>$leftOverInfo->failed->normal,'fast'=>$leftOverInfo->failed->fast);
       $package_counts[] = (object)array('is_past'=>1,'status_id'=>9,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' បន្តរដឹក (On Delivery)','total'=>$leftOverInfo->on_delivery->total,'normal'=>$leftOverInfo->on_delivery->normal,'fast'=>$leftOverInfo->on_delivery->fast);
       $package_counts[] = (object)array('is_past'=>1,'status_id'=>9,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' នៅឃ្លាំង (At Warehouse)','total'=>$leftOverInfo->at_warehouse->total,'normal'=>$leftOverInfo->at_warehouse->normal,'fast'=>$leftOverInfo->at_warehouse->fast);
       //$package_counts[] = (object)array('status_id'=>11,'item_name'=>'ចំនួនកញ្ចប់មុនថ្ងៃ '.$p_date.' បញ្ជូនត្រឡប់','total'=>$leftOverInfo->returned->total,'normal'=>$leftOverInfo->returned->normal,'fast'=>$leftOverInfo->returned->fast);

       $payments = [];
       //get cash_summary count object  based on the given $start_date and $end_date
       //Cash_summary_count object = {total_revenues, amount_to_sender,total_fees,sender_receiveable,balance}
       $countInfo = $this->getCashSummary_counts($rows);
       $amountToMerchant = $countInfo->total_revenues - $countInfo->total_fees;
       $payments[] = (object)array('var_name'=>'total_revenues','item_name'=>'ទឹកប្រាក់ប្រមូលបាន','amount'=>$countInfo->total_revenues);
       $payments[] = (object)array('var_name'=>'total_fees','item_name'=>'ថ្លៃសេវាទទួលបាន','amount'=> $countInfo->total_fees);
       $payments[] = (object)array('var_name'=>'sender_receivable','item_name'=>'ថ្លៃសេវាអតិថិជនជំពាក់','amount'=>$countInfo->sender_receivable);
       $payments[] = (object)array('var_name'=>'amount_to_sender','item_name'=>'ទឹកប្រាក់ទូទាត់ជូនអតិថិជន','amount'=>$amountToMerchant);
       $payments[] = (object)array('var_name'=>'balance','item_name'=>'សមតុល្យសេវាកម្មទទួលបាន','amount'=>$countInfo->balance);

       $result = (object)array();

       //Get Exchange rate from table settings_number
       $ss = (object)['branch_id'=>1];
       $result->exchange_rate = get_settings_value($ss,'EXCHANGE_RATE_BUY','number');

       $result->sender_count = $sender_count;
       $result->package_counts = $package_counts;
       $result->payments = $payments;
       return $result;
    }
 
       static function arraySortByKey($rows, $key) {
            $new_rows = $rows;
            usort($new_rows, function($a, $b) use ($key) {
                return $a->$key - $b->$key;
            });

            return $new_rows;
        }

    /**
     * Example => $except_statuses = [8,11]
     * IMPORTANT NOTE: it is more efficient to use countPackages_rpt() to group packages by Arrival Date, so countPackages_rpt() also returns a key "packagesByDate"
     *
    */
    function countPackages_rpt($rows,$except_statuses=[]){
            $at_warehouse = (object)['total'=>0,'fast'=>0,'normal'=>0];
            $on_delivery = (object)['total'=>0,'fast'=>0,'normal'=>0];
            $delivered = (object)['total'=>0,'fast'=>0,'normal'=>0];
            $failed = (object)['total'=>0,'fast'=>0,'normal'=>0];
            $ctd =(object)['total'=>0,'fast'=>0,'normal'=>0];
            $returned = (object)['total'=>0,'fast'=>0,'normal'=>0];

            $count_total =0;
            $count_normal = 0;
            $count_fast =0;

            $exchange_rate = 0;
            $delivered_cnt=0;
            $i=0;
            $c = null;
            $packagesByDate = [];

            do{
                if(!isset($rows[$i])) break;
                $c = (object)$rows[$i];
                $delivery_type = strtolower($c->delivery_type);
                $is_excepted = in_array($c->status_id,$except_statuses);

                // //begin:: process grouping packages by arrival date
                // if(isset($c->arrival_date) && $c->arrival_date){
                //     $this_date = $c->arrival_date;
                //     if(!isset($packagesByDate[$this_date])) $packagesByDate[$this_date] = [];
                //     $packagesByDate[$this_date][] = $c;
                //    //end:: process grouping packages by arrival date
                // }

                if(!$is_excepted){
                            if(strtolower($delivery_type) =='normal')
                            $count_normal++;
                            else
                            $count_fast++;

                            if($c->status_id ==5){
                                $count_total++;
                                if($delivery_type =='normal')
                                  $at_warehouse->normal++;
                                else if($delivery_type=='fast')
                                    $at_warehouse->fast++;
                            }
                            else if($c->status_id ==6){
                                $count_total++;
                                if($c->failed_num > 0){
                                    if($delivery_type =='normal')
                                    $ctd->normal++;
                                    else if($delivery_type =='fast')
                                    $ctd->fast++;
                                }
                                if($delivery_type =='normal')
                                $on_delivery->normal++;
                                else if($delivery_type =='fast')
                                $on_delivery->fast++;
                            }
                            else if($c->status_id ==8) {
                                $count_total++;
                                if($delivery_type =='normal')
                                $delivered->normal++;
                                else if($delivery_type =='fast')
                                $delivered->fast++;
                                $exchange_rate += $c->exchange_rate;
                                $delivered_cnt++;
                            }
                        else  if($c->status_id ==9) {
                            $count_total++;
                                if($delivery_type =='normal')
                                  $failed->normal++;
                                else if($delivery_type =='fast')
                                  $failed->fast++;
                        }
                        else if($c->status_id ==11) {
                            $count_total++;
                            if($delivery_type =='normal')
                              $returned->normal++;
                            else if($delivery_type=='fast')
                              $returned->fast++;
                        }
                }

                $i++;
            }while($c);

            $at_warehouse->total = $at_warehouse->fast + $at_warehouse->normal;
            $on_delivery->total = $on_delivery->fast + $on_delivery->normal;
            $delivered->total = $delivered->fast + $delivered->normal;
            $failed->total = $failed->fast + $failed->normal;
            $ctd->total = $ctd->fast + $ctd->normal;
            $returned->total = $returned->fast + $returned->normal;

            if($delivered_cnt===0) $delivered_cnt=1;
            $avg_exchange_rate = number_format($exchange_rate/$delivered_cnt,2);
            //$exchange_rate =self::getExchangeRate($end_date);
            $exchangeRateInfo = (object)[
                'rate'=>$avg_exchange_rate,
                'currency_pair'=>'USDKHR'
            ];
            $data =  (object)['exchangeRateInfo'=>$exchangeRateInfo,'packagesByDate'=>$packagesByDate,'count'=>$count_total,'count_normal'=>$count_normal,'count_fast'=>$count_fast,'at_warehouse'=>$at_warehouse,'on_delivery'=>$on_delivery,'delivered'=>$delivered,'failed'=>$failed,'ctd'=>$ctd,'returned'=>$returned];
            return $data;
        }

    function countPickups($rows){
        $i=0;
        $c = null;
        $count_normal =0;
        $count_fast =0;
        $count_total =0;
        do{
            if(!isset($rows[$i])) break;
            $c = (object)$rows[$i];
             if(strtolower($c->delivery_type) =='normal')
                $count_normal++;
             else  if(strtolower($c->delivery_type) =='fast')
                $count_fast++;
            $i++;
        }while($c);
        $count_total = $count_normal + $count_fast;
        return (object)['count_total'=>$count_total,'count_fast'=>$count_fast,'count_normal'=>$count_normal];
    }

       //CompanySummary| CompanyReport| get cash_summary count object  based on the given $start_date and $end_date
       //Cash_summary_count object = {total_revenues, amount_to_sender,total_fees,sender_receiveable,balance}
      function getCashSummary_counts($rows){
          $total_rev = 0;
          $total_fees = 0;
          $cod_amount =0;
          $amount_to_sender =0;
          $total_fee_from_sender = 0;
          $sender_receivable = 0 ;
          $total_cod_amount = 0;
          $sender_receivable_amt =0;
          $balance = 0;
          $additional_fee =0;

          $i = 0;
          $row = null;
          do{
              if(!isset($rows[$i])) break;
                 $row = $rows[$i];
                 $cod_fee = 0;
                 $total_cod_fees =0;

                 if ($row->status_id == 8){
                    $cod_fee = $row->cod_fee > 0? $row->cod_fee: 0;
                    $base_fee = $row->base_fee>0 ? $row->base_fee: 0;
                    //$forwarding_cost = ($row->forwarding_cost >=0)?$row->forwarding_cost:0;
                    $additional_fee = $row->delivery_fee > 0? $row->delivery_fee:0;
                    $price = $row->price > 0? $row->price : 0;
                    $fees = $base_fee + $additional_fee + $cod_fee;
                    $total_fees += $fees;

                    $total_cod_fees += $cod_fee;

                    $cod_amount = 0;
                    if ($row->cod == 1) $cod_amount = $price - $cod_fee;
                    $total_cod_amount += $cod_amount;

                    $forwarding_cost = $row->forwarding_cost >= 0? $row->forwarding_cost:0;

                    $df_payer = strtolower($row->df_payer);
                    if ($df_payer === 'receiver')
                       $total_rev += ($cod_amount + $base_fee + $additional_fee - $forwarding_cost);
                      //*** $total_rev is money collected from driver
                    else if($df_payer === 'sender'){
                        $total_rev += $cod_amount - $forwarding_cost;
                        // if($cod_amount - $forwarding_cost <0)
                        // {
                        //     //This case: $base_fee is the fee to be paid by merchant
                        //     $total_rev += $cod_amount + $base_fee - $forwarding_cost;
                        // }
                        // else $total_rev += $cod_amount - $forwarding_cost;
                    }

                    //fee_from_sender includes $fees and $forwarding_cost
                    $fee_from_sender = 0;
                    if ($df_payer === 'sender'){
                       $fee_from_sender = $fees;
                        //    if ($row->sender_pmt_status_id != 1){
                        //        $amt = $fees - ($cod_amount - $cod_fee);
                        //        if ($amt>0) $sender_receivable += $fees;
                        //    }
                    } else if($df_payer === 'receiver') $fee_from_sender = $cod_fee;

                    $total_fee_from_sender += $fee_from_sender;

                    //cash to be paid to Sender
                    $amount_to_sender += ($cod_amount - $fee_from_sender);
                    if ($row->sender_pmt_status_id != 1){
                        $sender_receivable += $fee_from_sender;
                    }
                 }

              $i++;
          }while($row);

           // $sender_receivable = amount of cash that Sender still owe the Express company
           $balance = $total_fees - $sender_receivable;
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
        $sender_id =  Sanitizer::sanitize($sender_id);

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

         if ($status_id==10) {
           //In case of Continue to deliver (when failed_num > 0 and status is "On Delivery (6)")
           if($status_id ==6 && ($row->failed_num >0) && strtolower($row->delivery_type) == $delivery_type) {
              $cnt++;
           }
         } else {
            if($status_id == $row->status_id && strtolower($row->delivery_type) == $delivery_type) {
                $cnt++;
             }
         }

      }
      return $cnt;
    }

    function getSalesCommissions($warehouse_id,$agent_id=0,$start_date=null,$end_date=null){
        $branch_id = Session::get('branch_id',0);
        $status_id = 8; //Delivered
        $start_date = isset($start_date)? convertDate($start_date): date('Y-m-d');
        $end_date = isset($end_date)? convertDate($end_date): date('Y-m-d');
        if (!(bool)strtotime($start_date) ) $start_date =date('Y-m-d');
        if (!(bool)strtotime($end_date) ) $end_date =date('Y-m-d');
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
            $str_dates = null;
        }

        $data_items =[];
        $exchange_rate = 0;
        $package_cnt =0;
        //Picked up packages
        $more_wheres = "s.id ='$sender_id' ".$str_dates;
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->join('sender AS s','s.id','=','p.sender_id')->where('p.branch_id',$branch_id)->whereRaw($more_wheres)->selectRaw("COUNT(p.id) AS cnt,p.delivery_type,p.status_id, ps.name AS status")->groupByRaw('p.delivery_type,p.status_id,status')->get();
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
                $row->item_name = $this->translateItemByStatus($row->status_id);
                $row->delivery_type = $prev_dtype;
                $row->cnt=$status_count;
                $row->cur = "$";
                $data_items[] = $row;

                $dtype_count =0;//reset it to zero when loops come to new status
                $status_count =0;
            }
            else{
                $dtype_count++;//increment count on same dType in the loop
                if(!in_array($row->status_id,$hide_statuses)) $status_count++;
            }
            $exchange_rate += $row->exchange_rate;
            $package_cnt++;
        }
        array_unshift($data_items,(object)['cnt'=>$total,'status_id'=>null,'status'=>null,'name'=>'បញ្ចប់បានទៅយក']);
        $data = (object)['p_items'=>$data_items];
        $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->where('s.id',$sender_id)->join('sender AS s','s.id','=','p.sender_id')->whereRaw($more_wheres)->selectRaw("SUM(IFNULL(p.sender_total,0)) AS sender_total, SUM(IFNULL(p.driver_total,0)) AS driver_total")->get();

        if($package_cnt===0) $package_cnt=1;
        $avg_exchange_rate = $exchange_rate/$package_cnt;
        foreach($rows as $row){
            $data->c_item = $row;
            $data->exchangeRateInfo = (object)[
                'currency_pair'=>'USDKHR',
                'buy_rate'=>$avg_exchange_rate, //buy rate,
                'rate'=>$avg_exchange_rate //buy rate
            ];
        }
        return $data;
    }

     function translateItemByStatus($status_id) {
        switch ($status_id)
        {
            case 8:
                return 'បញ្ចប់ដឹកបាន';
                break;
            case 9:
                return 'បញ្ចប់ដឹកមិនបាន';
                break;

            case 10:
               return 'បញ្ចប់ដឹកបន្តរ';
               break;
            case 11:
                return 'បញ្ចប់បញ្ជូនត្រឡប់';
                break;
            default:
               return 'Unknown status';
               break;
        }
        return 'Unknown status';
     }

      //Merchant Summary Report Data | vd_summary report data| getReportData() | getMerchantReport()
     //$delivery_status_id is package status = {delivered, failed, returned, ...}
     function getReportData_dv_summary($warehouse_id,$sender_id,$start_date=null, $end_date=null,$sender_pmt_status_id=-1,$delivery_status_id =null){
        $branch_id = Session::get('branch_id',0);
        //$use_default_dates =1;

        if(!(bool)strtotime($end_date)) $end_date = date('Y-m-d'); else $end_date = convertDate($end_date);
        if(!(bool)strtotime($start_date)){
                $givenDate = new DateTime($end_date);
                $modifiedDate = $givenDate->sub(new DateInterval('P90D'));
                $start_date = $modifiedDate->format('Y-m-d');
        } else $start_date = convertDate($start_date);

        /** If no dates provided => use last 90 days and extract only Unpaid packages with status_id = 8 (delivered) */
        // if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d', strtotime('-90 days'));
        // if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_pmt_status = "";
        $str_delivery_status =null;
        if ($delivery_status_id > 0) $str_delivery_status =' AND p.status_id = '.Sanitizer::sanitize($delivery_status_id);
        if($sender_pmt_status_id >=0) $str_pmt_status  =' AND IFNULL(p.sender_pmt_status_id,0) ='.$sender_pmt_status_id;

        $except_return ='7=7'; //'( (DATE(p.delivery_time) =\''.$start_date.'\' AND p.status_id =11) OR p.status_id <> 11)';
        $more_wheres = '(DATE(p.arrival_time) >= \''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\') '.$str_pmt_status.$str_delivery_status;
        $cols = 'DATE(p.arrival_time) AS orderByDate,p.qr_code AS barcode, formatDate(p.arrival_time) AS arrival_date,formatDate(p.create_date) AS booking_date, p.receiver_name,p.receiver_phone,p.zone_name,p.receiver_address,p.cod,p.sender_id,p.delivery_type,p.price,p.df_payer,p.base_fee, CONCAT(p.zone_code,\' \',p.zone_name) AS destination,p.zone_code,p.delivery_fee,p.cod_fee,p.outstanding,p.failed_num, p.sender_adjust_amount,p.sender_pmt_status_id,IFNULL(p.exchange_rate,1) AS exchange_rate,IFNULL(p.forwarding_cost,0) AS forwarding_cost,p.status_id,p.driver_total,p.sender_total, ps.name AS status,formatTime(p.arrival_time) AS arrival_time,formatTime(p.delivery_time) AS delivery_time,(SELECT driver.name FROM driver WHERE id =p.pickup_driver_id LIMIT 1) AS pickup_driver_name, CASE (p.status_id=9 OR p.status_id=11) WHEN 1 THEN p.failure_notes ELSE p.delivery_notes END AS remarks,p.failure_notes,p.delivery_notes, CASE p.status_id  WHEN 8 THEN 1 WHEN 9 THEN 2 WHEN 6 THEN 3 WHEN 5 THEN 4 ELSE 5 END AS status_order';
        $rows = DB::table('package AS p')->join('package_statuses AS ps','ps.id','=','p.status_id')->where('p.warehouse_id',$warehouse_id)->where('p.branch_id',$branch_id)->where('p.sender_id',$sender_id)->whereRaw($more_wheres)->whereRaw($except_return)->selectRaw($cols)->orderByRaw('orderByDate ASC,p.status_id ASC')->get();
        //$this->countPackageByStatus($rows,8);
        $c = $this->countPackages_rpt($rows,[]);
         $items = [];
         //$c->ctd->fast
         $name =null;
         $total_count = 0;
         $total_count_fast =0;
         $total_count_normal=0;

         $exchangeRateInfo = self::getExchangeRate($end_date);
         //remove ExchangeRateInfo from object $c because all props of object $c must consistently have prop {'fast','normal','total'}
         unset($c->exchangeRateInfo);
         foreach($c as $key=>$item){
            //if($key==='on_delivery')
              //$name ='Packages On Delivery';
            //else
            //$item->total = $item->$item->fast + $item->normal;
            if($key === 'delivered')
               $name ='Delivered packages';
            else if ($key === 'delivered')
               $name ='Delivered packages';
            else if ($key==='failed')
               $name ="Failed packages";
            else if ($key==='ctd')
               $name ='Continue to deliver (រាប់ចូលក្នង "On Delivery")';
            else if ($key==='returned')
               $name ='Returned packages';

            //   if($key != 'ctd' ){
            //     $total_count += $item->total;
            //     $total_count_fast += $item->fast;
            //     $total_count_normal += $item->normal;
            //   }
            if ($key != 'on_delivery') $items[] =(object)['name'=>$name,'total'=>isset($item->total)?$item->total:0,'fast_count'=>isset($item->fast)?$item->fast:0,'normal_count'=>isset($item->normal)?$item->normal:0];

         }
         $total_item = (object)['name'=>'Collected packages','total'=>$total_count,'fast_count'=>$total_count_fast,'normal_count'=>$total_count_normal];
         array_unshift($items,$total_item);
         //NOTE: $c->exchangeRateInfo is object = {rate,buy_rate,currency_pair}
         $packagesByDate = self::groupRows($rows,'arrival_date');
         foreach($packagesByDate as $date => $o_rows){
             $packagesByDate[$date] = self::arraySortByKey($o_rows,'status_order');
         }
         $data = (object)['packagesByDate'=>$packagesByDate,'exchangeRateInfo'=>$exchangeRateInfo,'currency_symbol'=>'$'];

         //$data->transactions = $rows;
         $merchant = new \App\Models\Sender($sender_id?$sender_id:0,(object)['branch_id'=>$branch_id]);
         $data->merchant = $merchant->getDetails();
         $data->merchant = $data->merchant? $data->merchant:(object)['name'=>'merchant info','phone_number'=>'NA','email'=>'NA'];
         $data->start_date = $start_date;
         $data->end_date = $end_date;
         return $data;
     }

     function getActiveSenders($warehouse_id,$start_date,$end_date){
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_dates ='DATE(p.arrival_time) >=\''.convertDate($start_date).'\' AND DATE(p.arrival_time) <=\''.convertDate($end_date).'\' ';
        $query = DB::table('package as p')->whereRaw($str_dates)->where('p.warehouse_id',$warehouse_id)->where('p.sender_id','>',0);
        $count = $query->join('sender as s','s.id','p.sender_id')->distinct('p.sender_id')->count('p.sender_id');
        return (object)[
            'count'=>$count,
            'senders'=>$query->selectRaw('s.id,s.name,s.phone_number,s.email,count(p.id) AS package_count,(SELECT CONCAT(b.account_number,\' / \',b.account_name,\' / \',b.bank_name) as t FROM sender_bank_accounts AS b WHERE b.sender_id =s.id AND b.is_primary =1 LIMIT 1) AS bank_info')->groupByRaw('s.id,s.name,s.phone_number,s.email')->get()
        ];
     }
     function getActiveDrivers_count($warehouse_id,$start_date,$end_date){
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        if (!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
        $str_dates ='DATE(p.arrival_time) >=\''.convertDate($start_date).'\' AND DATE(p.arrival_time) <=\''.convertDate($end_date).'\' ';
        $query = DB::table('package as p')->whereRaw($str_dates)->where('p.warehouse_id',$warehouse_id)->where('p.driver_id','>',0);
        return $query->distinct('p.driver_id')->count('p.driver_id');
     }

    static function getExchangeRate($end_date){
      return DB::table('exchange_rates AS r')->whereRaw('DATE(r.x_date) <=\''.$end_date.'\'')->selectRaw('r.currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->take(1)->get()->first();
    }

    static function getMerchantAmount($row){
        $driver_total =0;
        $sender_settled_amount = 0;
        $df_payer = strtolower($row->df_payer);
        $fees = $row->delivery_fee + $row->base_fee;
        if (!$row->cod || $row->cod==0){
            $driver_total = 0;
        }else  $driver_total = $row->price - $row->cod_fee;;

        if($df_payer =='receiver') $driver_total += $fees -$row->forwarding_cost;
        else $driver_total -= $row->forwarding_cost;

        $sender_settled_amount = $driver_total; //+ $row->adjustment
        if($df_payer=='sender') $sender_settled_amount -= $fees;
        return $sender_settled_amount;
    }

    //getMerchantSummary => Merchant Summary V2 | Merchant Summary report based on delivery_date, NOT arrival_date for each Sender or merchant
    function getMerchantSummaryReport($warehouse_id,$sender_id,$start_date=null,$end_date=null){
        $branch_id = Session::get('branch_id',0);
        if(!(bool)strtotime($start_date)) $start_date =date('Y-m-d');
        if(!(bool)strtotime($end_date)) $end_date = $start_date;
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        $str_first = 'p.warehouse_id ='.$warehouse_id.' AND p.sender_id ='.$sender_id. ' AND p.branch_id ='.$branch_id;
        $cols ='DATE(p.delivery_time) AS orderByDate,(CASE p.status_id WHEN 8 THEN 1 WHEN 11 THEN 2 WHEN 9 THEN 3 WHEN 6 THEN 4 ELSE 5 END) AS orderByStatus, p.id,p.qr_code AS barcode,formatDate(p.arrival_time) AS arrival_date,formatTime(p.arrival_time) AS arrival_time,formatTime(p.delivery_time) AS delivery_time,p.status_id,st.`name` AS `status`,p.delivery_type, IFNULL(p.base_fee,0) AS base_fee, IFNULL(delivery_fee,0) AS delivery_fee, IFNULL(p.driver_total,0) AS driver_total,p.receiver_phone,p.receiver_address,CONCAT(p.zone_code, \' \',p.zone_name) AS destination, IFNULL(p.sender_total,0) AS sender_total,IFNULL(p.sender_net_amount,0) AS sender_net_amount,p.cod,IFNULL(p.price,0) AS price,IFNULL(p.cod_fee,0) AS cod_fee, sender_pmt_status_id, driver_pmt_status_id,IFNULL(p.exchange_rate,1) AS exchange_rate,IFNULL(p.forwarding_cost,0) AS forwarding_cost, p.df_payer,failed_num,p.delivery_notes,p.failure_notes';
        $query = DB::table('package AS p')->join('package_statuses AS st','st.id','=','p.status_id')->join('sender as s','s.id','=','p.sender_id')->whereRaw($str_first)->selectRaw($cols);

        $new_count =0;
        $new_amount =0;
        $left_over_count = 0;
        $left_over_amount =0;

        //Get "Unfinished" packages before the $start_date (based on arrival_date)
        $summary_info['កញ្ចប់សល់'] = (object)['count'=>0,'amount'=>0];
        //$str_dates ='DATE(p.arrival_time) <\''.$start_date.'\' AND (DATE(p.delivery_time) <\''.$start_date.'\' OR DATE(p.delivery_time) >\''.$end_date.'\')';
        $str_dates ='DATE(p.delivery_time) >= \''.$start_date.'\' AND DATE(p.delivery_time) <= \''.$end_date.'\'';
        $all_query = clone $query;
        $rows = $all_query->whereRaw($str_dates)->whereRaw('p.status_id IN (9,8,11)')->orderByRaw('orderByDate ASC,orderByStatus ASC')->get();

        $rem_count_by_status = ['5'=>0,'6'=>0,'8'=>0,'9'=>0,'11'=>0];
        $rem_amount_by_status = ['5'=>0,'6'=>0,'8'=>0,'9'=>0,'11'=>0];

        $new_count_by_status = ['5'=>0,'6'=>0,'8'=>0,'9'=>0,'11'=>0];
        $new_amount_by_status = ['5'=>0,'6'=>0,'8'=>0,'9'=>0,'11'=>0];

        //$groups = self::groupRows($rows,'orderByDate');
        //Last delivery_date that exists based on the selected "start_dat"e and "end_date"

        $last_delivery_date = null;
        // foreach($groups as $delivery_date => $d_rows){
        //      if($last_delivery_date) $last_delivery_date = $delivery_date;
        //      else if($last_delivery_date < $delivery_date) $last_delivery_date = $delivery_date;
        // }

        $faied_rows = [];
        $groups = [];
        foreach($rows as $row){
            if(!$last_delivery_date)
              $last_delivery_date = $row->orderByDate;
            else if(convertDate( $last_delivery_date) < convertDate($row->orderByDate)) $last_delivery_date = $row->orderByDate;

            $sender_amount = self::getMerchantAmount($row);
            if(!isset($groups[$row->orderByDate])) $groups[$row->orderByDate] = [];

            if($row->status_id ==9)
               $faied_rows[] = $row;
            else{
                $groups[$row->orderByDate][] = $row;
                if(convertDate($row->arrival_date) < $start_date){
                    $left_over_count++;
                    $left_over_amount += $sender_amount;
                    $rem_count_by_status[$row->status_id]++;
                    $rem_amount_by_status[$row->status_id] +=$sender_amount;
                }else{
                    $new_count++;
                    $new_amount += $sender_amount;
                    $new_count_by_status[$row->status_id]++;
                    $new_amount_by_status[$row->status_id] += $sender_amount;
                }
            }
        }

        foreach($faied_rows as $row){
            $groups[$last_delivery_date][] = $row;
        }
         /** get remaining packages that are "At Warehouse" and "On Delivery" and arrived before the selected $end_date */
         $o_query = clone $query->whereRaw('p.status_id IN (5,6) AND DATE(p.arrival_time) <=\''.$end_date.'\'');
         $o_rows = $o_query->get();
         foreach($o_rows as $row){
               /** Add items with status (5,6) to the remaining_count */
               $left_over_count++;
               $sender_amount = self::getMerchantAmount($row);
               $rem_count_by_status[$row->status_id]++;
               $rem_amount_by_status[$row->status_id] += $sender_amount;
               $row->delivery_time = 'មិនទាន់មាន';
               $groups[$last_delivery_date][] = $row;
        }

        $summary_info['remaining'] = (object)['label'=>'កញ្ចប់សល់','count'=>$left_over_count,'amount'=>$left_over_amount,'currency_code'=>'USD'];
        $summary_info['new_arrival'] = (object)['label'=>'កញ្ចប់ថ្មី','count'=>$new_count,'amount'=>$new_amount,'currency_code'=>'USD'];
        $summary_info['total_count'] = (object)['label'=>'កញ្ចប់សរុប','count'=>($new_count + $left_over_count),'amount'=>($new_amount + $left_over_amount),'currency_code'=>'USD'];

        $delivered_total =$rem_count_by_status[8] + $new_count_by_status[8];
        $returned_total =$rem_count_by_status[11] + $new_count_by_status[11];
        $failed_total =  $rem_count_by_status[9] + $new_count_by_status[9];
        $at_warehouse_total = $rem_count_by_status[5] + $new_count_by_status[5];
        $on_delivery_total = $rem_count_by_status[6] + $new_count_by_status[6];

        $delivered_amount = $rem_amount_by_status[8] + $new_amount_by_status[8];
        $returned_amount = $rem_amount_by_status[11] + $new_amount_by_status[11];
        $failed_amount = $rem_amount_by_status[9] + $new_amount_by_status[9];
        $at_warehouse_amount = $rem_amount_by_status[5] + $new_amount_by_status[5];
        $on_delivery_amount = $rem_amount_by_status[6] + $new_amount_by_status[6];

        $summary_info['delivered'] = (object)['label'=>'កញ្ចប់ដឹកបាន','count'=>$delivered_total,'amount'=>$delivered_amount,'new_count'=>$new_count_by_status[8]];
        $summary_info['failed'] = (object)['label'=>'កញ្ចប់បរាជ័យ','count'=>$failed_total,'amount'=>$failed_amount,'new_count'=>$new_count_by_status[9]];
        $summary_info['returned'] = (object)['label'=>'កញ្ចប់បញ្ជូនត្រឡប់','count'=>$returned_total,'amount'=>$returned_amount,'new_count'=>$new_count_by_status[11]];
        $summary_info['at_warehouse'] = (object)['label'=>'នៅឃ្លាំង','count'=>$at_warehouse_total,'amount'=>$at_warehouse_amount,'new_count'=>$new_count_by_status[5]];
        $summary_info['on_delivery'] = (object)['label'=>'កំពុងដឹក','count'=>$on_delivery_total,'amount'=>$on_delivery_amount,'new_count'=>$new_count_by_status[6]];

        $merchant = new \App\Models\Sender($sender_id?$sender_id:0,(object)['branch_id'=>$branch_id]);
        $exchange_rate = self::getExchangeRate($end_date); //number_format($exchange_rate/$delivered_cnt,2);
        $exchangeRateInfo = (object)[
            'rate'=>$exchange_rate->buy_rate,
            'currency_pair'=>$exchange_rate->currency_pair
        ];

        return (object)[
              'currency_symbol'=>'$ ',
              //'packages'=>$delivered_rows->concat($failed_rows)->concat($rem_rows)->concat($rem_rows),
              'packagesByDate'=>$groups,
              'merchant'=>$merchant->getDetails(),
              'exchangeRateInfo'=>$exchangeRateInfo,
              'summary_info'=>$summary_info
        ];
     }

    //Returns Company summary data for reporting (Not used yet)
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
