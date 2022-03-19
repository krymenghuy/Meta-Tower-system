<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use Session;
use Carbon\Carbon;

class WebReportController extends Controller
{
    protected $reportModel;
    public function __construct(){
       $this->reportModel = new Report();
    }

    public function package_barcode($barcode=null) { 
        if (!Session::get('login_name',null)) return redirect('/');
        $html ="EMPTY";
        if(empty($barcode))   $html ="TEMP BARCODE"; //DNS2D::getBarcodeHTML('4445645656', 'QRCODE');
        $data['barcode'] = $barcode; 
        $branch_id = Session::get('branch_id',0);
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        $data['p'] = $this->reportModel->getPackageLabelInfo($barcode);
        return view('reports.package_barcode',$data);
    }

    public function general_report($query_string=null) {
        if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);
        if (!$branch_id) return redirect('/');
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        //$p = null;
        //try{
          $p = processQueryString($query_string);
        //}catch(\Exception $e){
          //return response()->view('errors.500');
        //}finally {
          //return response()->view('errors.500');
        //}
      
        if(!$p) {
            //error invalid parameters provided
            return view('errors.500');
        }
        $rtype = strtolower(isset($p->rtype)?$p->rtype:null);
        $data['rtype']= $rtype;
        if(!$rtype){
             //error invalid report type
             return view('errors.500');
        }
        switch($rtype){
          case 'pickuplist':{
            $warehouse_id =isset($p->wid)? $p->wid:null;
            $date = isset($p->date)?$p->date:null;
            $search_value =isset($p->search)?$p->search:null;
            $sender_id=isset($p->sid)?$p->sid:null;
            $delivery_type=isset($p->dtype)?$p->dtype:null;
            $status_id=isset($p->stid)?$p->stid:null;
            
            $data['items'] = $this->reportModel->getPickupList($warehouse_id,$date,$search_value, $sender_id,$delivery_type,$status_id);
            $data['title'] ="Pickup List Report";
            $data['subtitle'] ="Print Date: ".Carbon::now();
            break;
          }case 'packagelist':{
            $completed = isset($p->completed)? $p->completed:0;
            if ($completed !=1 && $completed!=true) $completed =0;
            $warehouse_id =isset($p->wid)? $p->wid:null;
            $date = isset($p->date)?$p->date:null;
            $driver_id = isset($p->driverid)?$p->driverid:null;
            $zone_code = isset($p->zonecode)?$p->zonecode:null;
            $search_value =isset($p->search)?$p->search:null;
            $sender_id=isset($p->sid)?$p->sid:null;
            $delivery_type=isset($p->dtype)?$p->dtype:null;
            $status_id=isset($p->stid)?$p->stid:null;
            $data['items'] = $this->reportModel->getPackageList($completed, $warehouse_id,$date,$search_value,$sender_id,$delivery_type,$zone_code,$driver_id,$status_id);
            $data['title'] = ($completed==0)? "Outstanding Package List":"Completed Package List";
            $data['subtitle'] ="Print Date: ".Carbon::now();
            break;
          }case 'fleetlist':{

            $data['title'] ="Delivery Trips"; 
            $data['subtitle'] ="Print Date: ".Carbon::now();
            $date =$p->date;
            $warehouse_id =$p->wid;
            $search_value = $p->search;
            $driver_id = $p->driverid;
            $delivery_type= $p->dtype;
            $status_id = $p->stid;
            $data["items"]= $this->reportModel->getDeliveryTripList($date,$warehouse_id,$search_value, $driver_id,$delivery_type,$status_id);
            break;
          }case 'driverlist':{
            $data['title'] ="Driver List"; 
            $data['subtitle'] ="Print Date: ".Carbon::now();
            $warehouse_id =$p->wid;
            $search_value = $p->search;
            $shift = $p->shift;
            $status_code= $p->statuscode;
            $emp_type = isset($p->emptype)?$d->emptype:null;
            $data["items"]= $this->reportModel->getDriverList($warehouse_id,$search_value,$shift, $status_code,$emp_type);
            break;
          }
          case 'senderlist':{
            $data['title'] ="Merchant List"; 
            $data['subtitle'] ="Print Date: ".Carbon::now();
            $warehouse_id =$p->wid;
            $search_value = $p->search;
            $shift = $p->shift;
            $status_code= $p->statuscode;
            $emp_type = isset($p->emptype)?$d->emptype:null;
            $data["items"]= $this->reportModel->getSenderList($warehouse_id,$search_value,$shift, $status_code,$emp_type);
            break;
          }
          case 'dr_package_list':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $driver_name = isset($p->drivername)?$p->drivername:null;
            $driver_id = $p->driverid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;
            $data['driver_name'] =$driver_name;

            $data['title'] ="Deliveries by Driver"; 
            $sub_title = $driver_name." (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title; // "Print Date: ".Carbon::now(); 
            $data["items"]= $this->reportModel->getDeliveredPackagesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null);
            break;
          } 
          //sr_package_list, packages beloging to sender/vendor
          case 'vd_deliveries':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $sender_name = isset($p->sendername)?$p->sendername:null;
            $sender_id = $p->senderid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;
            $status_id = $p->statusid;
            $data['sender_name'] =$sender_name;

            $data['title'] ="Packages by Merchant"; 
            $sub_title = $sender_name." (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title; // "Print Date: ".Carbon::now(); 
            $data["items"]= $this->reportModel->getPackagesBySender($warehouse_id, $sender_id, $start_date, $end_date,$delivery_type,$status_id);
            break;
          } 
          case 'dr_summarized_deliveries':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $driver_id = $p->driverid;
            $driver_name = $p->drivername;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;

            $data['title'] ="SUMMARIZED DELIVERIES"; 
            $sub_title = $driver_name." (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['driver_name'] =$driver_name;
            $data['subtitle'] =  $sub_title; // "Print Date: ".Carbon::now(); 
            $data["items"]= $this->reportModel->getSummarizedDeliveriesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null);
            break;
          }
          case 'dr_driver_commissions':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $driver_id = $p->driverid;
            $driver_name = $p->drivername;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;
            $data['title'] ="SUMMARIZED DRIVER COMMISSIONS"; 
            $sub_title = $driver_name." (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title;  
            $data['subtitle1'] = "Print Date: ".Carbon::now(); 
            $data["commission_items"]= $this->reportModel->getDriverCommissionItems($driver_id, $start_date, $end_date);
            break;
          }
          case 'dr_driver_pmts':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $driver_id = $p->driverid;
            $driver_name = $p->drivername;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;
            $data['title'] ="PAYMENTS BY DRIVER";
            $sub_title = $driver_name." (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title;  
            $data['subtitle1'] = "Print Date: ".Carbon::now(); 
            $data["pmt_items"]= $this->reportModel->getPaymentsByDriver($driver_id, $start_date, $end_date);
            break;
          }
          case 'rpt_daily_summary':{
            $warehouse_id =$p->wid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            //$end_date = $p->enddate;
            $data['title'] ="DAILY SUMMARY REPORT";
            $sub_title = date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date));
            $data['subtitle'] =  $sub_title;  
            //$data['subtitle1'] = "Print Date: ".date('d M Y h:m:s',strtotime(Carbon::now())); 
             //$d = $this->reportModel->getCompanySummary($warehouse_id,$start_date,$end_date);
             $data['data']= $this->reportModel->getCompanyReport_summary($warehouse_id,$start_date,$end_date);
             //$data['p_items']= $d->p_items;
             //$data['c_item'] = $d->c_item;
             break;
          }
          case 'vd_summarized_deliveries':{
            $warehouse_id =$p->wid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $sender_id = $p->senderid;
            $sender_id = $p->senderid;
            $sender_name = $p->sendername;
            //$end_date = $p->enddate;
            $data['title'] ="DAILY SUMMARY BY MERCHANT";
            $sub_title = $sender_name. " (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title;  
            //$data['subtitle1'] = "Print Date: ".date('d M Y h:m:s',strtotime(Carbon::now())); 
            $d = $this->reportModel->getVendorSummary($sender_id,$start_date,$end_date);
            $data['p_items'] = $d->p_items; //package_items
            //$data['c_item']=$d->c_item; //cash_items
             break;
          }
          case 'vd_transactions':{
            $warehouse_id =$p->wid;
            $start_date = $p->startdate;
            $sender_id = $p->senderid;
            $sender_name = $p->sendername;
            $end_date = $p->enddate;
            $data['title'] ="PAYMENT TRANSACTIONS BY MERCHANT";
            $sub_title = $sender_name. " (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title;  
            //$data['subtitle1'] = "Print Date: ".date('d M Y h:m:s',strtotime(Carbon::now())); 
            $data['items']= $this->reportModel->getVendorTransactions($sender_id,$start_date,$end_date);
             break;
          }
          case 'rpt_sales_commissions':{
            $warehouse_id =$p->wid;
            $agent_id = $p->agentid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $data['title'] ="SALES COMMISSIONS REPORT";
            $sub_title = "From ".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date));
            $data['subtitle'] = "";  
            //$data['subtitle1'] = "Print Date: ".date('d M Y h:m:s',strtotime(Carbon::now())); 
            $data['items'] = $this->reportModel->getSalesCommissions($warehouse_id,$agent_id,$start_date,$end_date);
             break;
          }
          default:{
              $data['title'] ="IT SEEMS NO MATCHING REPORT NAME :)"; 
              break;
          }
        }
        return view('reports.genreport',$data);
    }
}
