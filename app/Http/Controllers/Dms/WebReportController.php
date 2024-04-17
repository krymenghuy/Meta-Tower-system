<?php

namespace App\Http\Controllers;

use App\Models\Dms\GeneralSettings;
use App\Models\Dms\UM;
use Illuminate\Http\Request;
use App\Models\Dms\Report;
use Session;
use Carbon\Carbon;
use App\Models\Dms\JDV;
use DB;
use PHPUnit\TextUI\XmlConfiguration\Generator;

class WebReportController extends Controller{
    protected $reportModel;
    public function __construct(){
       $this->reportModel = new Report();
    }

    function getReportList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $include = '';
        $user_id = $ss->id;
        if($ss->is_system_admin!=1){
            $umM_prms = DB::table('um_user_permissions as up')->join('um_permissions as p','p.id','=','up.permission_id',)->where('user_id', $user_id)->where('p.category','report')->pluck('p.name')->toArray();
            if(count($umM_prms)> 0){
                $include = ' AND name IN (\'' . implode('\',\'', $umM_prms) . '\')';
            }else{
                $include = ' AND 1 = 0';
            }
        }
      $rows = DB::select("SELECT id, `name`, `hidden`, code,category,rpt.module_id,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 $include ORDER BY rpt.display_order ASC");
      return JDV::json($rows);
   }

   function getReportListByCategory(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);
    $include = '';
    $user_id = $ss->id;
    if($ss->is_system_admin!=1){
        $umM_prms = DB::table('um_user_permissions as up')->join('um_permissions as p','p.id','=','up.permission_id',)->where('user_id', $user_id)->where('p.category','report')->pluck('p.name')->toArray();
        if(count($umM_prms)> 0){
            $include = ' AND `name` IN (\'' . implode('\',\'', $umM_prms) . '\')';
        }else{
            $include = ' AND 1 = 0';
        }
    }
    $rows = DB::select('SELECT id, `name`, `hidden`, code,category,rpt.module_id,rpt.params,rpt.exportPDF, exportExcel, rpt.category_order,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 '.$include.' ORDER BY rpt.category_order,rpt.display_order ASC');
    $data = [];
    foreach($rows as $row){
       if(!isset($data[$row->category])) $data[$row->category] = [];
       $data[$row->category][] =$row; 
    }
    return JDV::json($data);
 }

    function getReportFilterOptions(Request $req){
      $branch_id = Session::get('branch_id',1);
      $ss = (object)['branch_id'=>$branch_id];
      $data = (object)[
        //'users'=>DB::select("SELECT id as `user_id`,  full_name As `user_name` FROM um_users AS u WHERE u.branch_id = '$branch_id' ORDER BY u.full_name asc"),
        'warehouses'=>GeneralSettings::options_warehouse($ss),
        'drivers'=>GeneralSettings::options_driver($ss),
        'senders'=>GeneralSettings::options_sender($ss),
        'pmt_statuses'=>GeneralSettings::options_pmt_status($ss),
        'delivery_statuses'=>GeneralSettings::options_delivery_status($ss),
        'completed_statuses'=>GeneralSettings::options_complete_status($ss),
        'sales_agents'=>GeneralSettings::options_sales_agent($ss,true,false),
        'trx_types'=>GeneralSettings::options_trx_type($ss),
        'months'=>GeneralSettings::options_calendar_month_year($ss)       
      ];
      return JDV::result($data);
    }

    public function package_barcode($barcode=null) {
        if (!Session::get('login_name',null)) return redirect('/');

        if(empty($barcode)) $html ="TEMP BARCODE"; //DNS2D::getBarcodeHTML('4445645656', 'QRCODE');
        $data['barcode'] = $barcode;
        $branch_id = Session::get('branch_id',0);
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        $data['p'] = $this->reportModel->getPackageLabelInfo($barcode);
        //echo dd($data); return;
        return view('reports.package_label_houexpress',$data);
    }

    function show_driver_settled_packages($ss,$p,&$data){
      $warehouse_id =isset($p->wid)? $p->wid:null;
      $trx_id = isset($p->trxid)?$p->trxid:null;
      $trx_type = isset($p->trxtype)?$p->trxtype:null;
      if($trx_type =='all'){
        echo '<div class="bg-warning text-black p-2">Transaction type must be either Receipt or Disbursement</div>';
        return;
      }
      if(!$trx_id || !$trx_type){
        echo '<div class="bg-warning text-black p-2">There are no transaction ID or transaction type provided</div>';
        return;
      }

      $agent_id=isset($p->agentid)?$p->agentid:null;
      $agent_name=isset($p->agentname)?$p->agentname:null;
      //$agent_type=isset($p->agenttype)?$p->agenttype:null;


      $trx = (new \App\Models\Dms\PaymentTransaction)::quickDetails($trx_id,$trx_type);
      if(!$trx){
          echo '<div class="bg-danger text-white p-2">The given transaction ID does not exist</div>';
          return;
      }

      $driver = new \App\Models\Dms\Driver(null,null);
      $m_data = $driver->getSettledPackages($trx_id,$agent_id);
      if (!isset($m_data->items[0])){
        echo '<div style="background:red;padding:10px; font-size:1.2em;border-radious:5px; border:1.2px solid red;color:#fff;">The driver transaction was done before updating system. Cannot display the package list <span style="display:block;padding:5px;">trans type: '.$trx_type.' | trans ID: '.$trx_id.'  | agent ID: '.$agent_id.'</span></div>';
        return;
      }
      $data['data'] =$m_data;
      //  echo json_encode( $items); return;
      $data['title'] = 'កញ្ចប់បានទូទាត់ជាមួយអ្នកដឹក';
      $agent_name = $trx->agent_name;
      if(!$agent_name) $agent_name ='Unknown Driver';
      $data['subTitle'] = 'អ្នកដឹក <b>'.$agent_name.' </b>'.' ថ្ងៃទូទាត់ '.$trx->payment_date;
    }

    function show_merchant_settled_packages($ss,$p,&$data){
      $warehouse_id =isset($p->wid)? $p->wid:null;
      $trx_id = isset($p->trxid)?$p->trxid:null;
      $trx_type = isset($p->trxtype)?$p->trxtype:null;
      if($trx_type =='all'){
        echo '<div class="bg-warning text-black p-2">Transaction type must be either Receipt or Disbursement</div>';
        return;
      }
      if(!$trx_id || !$trx_type){
        echo '<div class="bg-warning text-black p-2">There are no transaction ID or transaction type provided</div>';
        return;
      }

      $agent_id=isset($p->agentid)?$p->agentid:null;
      $agent_name=isset($p->agentname)?$p->agentname:null;
      //$agent_type=isset($p->agenttype)?$p->agenttype:null;


      $trx = (new \App\Models\Dms\PaymentTransaction)::quickDetails($trx_id,$trx_type);
      if(!$trx){
          echo '<div class="bg-danger text-white p-2">The given transaction ID does not exist</div>';
          return;
      }

      $pmt = new \App\Models\Dms\PaymentTransaction(null,null);
      $m_data = (object)[];
      $m_data->items = $pmt->getSettledPackages_sender($trx_id,$ss);
      if (!isset($m_data->items[0])){
        echo '<div style="background:red;padding:10px; font-size:1.2em;border-radious:5px; border:1.2px solid red;color:#fff;">The driver transaction was done before updating system. Cannot display the package list <span style="display:block;padding:5px;">trans type: '.$trx_type.' | trans ID: '.$trx_id.'  | agent ID: '.$agent_id.'</span></div>';
        return;
      }
      $data['data'] =$m_data;
      //  echo json_encode( $items); return;
      $data['title'] = 'កញ្ចប់បានទូទាត់ជាមួយអ្នកលក់';
      $agent_name = $trx->agent_name;
      if(!$agent_name) $agent_name ='Unknown Driver';
      $data['subTitle'] = 'អ្នកលក់ <b>'.$agent_name.' </b>'.' ថ្ងៃទូទាត់ '.$trx->payment_date;
    }

    public function general_report($query_string=null) {
        if (!Session::get('login_name',null)) return redirect('/');
        $branch_id =Session::get('branch_id',0);

        if (!$branch_id) return redirect('/');
        $ss = (object)['branch_id'=>$branch_id];

        $data = [];
        $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        $p = processQueryString($query_string);
 
        if(!$p) {
          return view('errors.500');
        }

        $rtype = strtolower(isset($p->rtype)? $p->rtype : null);
        //if($rtype=='dr_commissions') $rtype='driver_commissions';
        $data['rtype']= $rtype;

        if(!$rtype){
           return view('errors.500');
        }

        switch($rtype){
          case 'pickup_list':{
            $warehouse_id =isset($p->wid)? $p->wid:1;
            $start_date = isset($p->startdate)? convertDate($p->startdate):date('Y-m-d');
            $end_date = isset($p->enddate)? convertDate($p->enddate):date('Y-m-d');
            $sender_id=isset($p->senderid)?$p->senderid:null;
            $driver_id=isset($p->driverid)?$p->driverid:null;
            $delivery_type=isset($p->deliverytype)?$p->deliverytype:null;
            $sender = DB::table('sender AS s')->where('s.id',$sender_id)->selectRaw('s.id,s.name,s.code,s.phone_number')->take(1)->first();
            if (!$sender){
              echo 'មិនឃើញមានអ្នកលក់ត្រូវបានជ្រើសរើស ដើម្បីមើលរបាយការណ៍មួយនេះទេ';
              return;
            }
            $data['items'] = $this->reportModel->getPickupListByMerchant($warehouse_id,$start_date,$end_date, $sender_id,$driver_id);
            $data['title'] ='បញ្ជីទំនិញដែលបានទទួល';
            $data['subtitle'] ='អ្នកលក់ '.$sender->name.' ('.$sender->code.')   Tel: '.$sender->phone_number; //'Print Date: '.Carbon::now();
            $data['subtitle1'] = 'ចាប់ពីថ្ងៃ '.date('d M Y',strtotime($start_date)). ' ដល់ '.date('d M Y',  strtotime($end_date)); 
            break;
          }
          case 'daily_packages':{
            $warehouse_id =isset($p->wid)? $p->wid:null;
            $start_date = isset($p->startdate)?$p->startdate:date('d M Y');
            $end_date = isset($p->enddate)?$p->enddate:date('d M Y');
            $sender_id=isset($p->senderid)?$p->senderid:null;
            $sender_pmt_status_id =isset($p->senderpmtstatusid)?$p->senderpmtstatusid:null;
            $group_data = $this->reportModel->getDailyPackageCountByMerchant($branch_id,$warehouse_id,$start_date,$end_date,$sender_id,$sender_pmt_status_id);

            $start_date = (bool)strtotime($start_date)? $start_date:date('d M Y');
            $end_date = (bool)strtotime($end_date)? $end_date:date('d M Y');
            $data['items'] = $group_data;
            $data['title'] = 'សរុបកញ្ចប់ទំនិញ'.($sender_pmt_status_id ==1? 'ដែលបានទូទាត់':($sender_pmt_status_id==0? 'ដែលមិនទាន់ទូទាត់':'ទាំងអស់'));
            $sender_name ='All Merhcants';
            if($sender_id > 0){
              $sender_name = DB::table('sender as s')->where('id',$sender_id)->take(1)->value('name');
              if(!$sender_name) $sender_name ='Invalid Merchant';
            }
            $data['subtitle'] =  '<b>'.$sender_name.'</b> : ចាប់ពី '.date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
            break;
          }
          case 'package_count_by_merchant':{
            $warehouse_id =isset($p->wid)? $p->wid:null;
            $start_date = isset($p->startdate)?$p->startdate:date('d M Y');
            $end_date = isset($p->enddate)?$p->enddate:date('d M Y');
            $sender_id=isset($p->senderid)?$p->senderid:null;
            
            $rows = $this->reportModel->getMonthlyPackageCountByMerchant($branch_id,$warehouse_id,$start_date,$end_date,$sender_id);

            $start_date = (bool)strtotime($start_date)? $start_date:date('d M Y');
            $end_date = (bool)strtotime($end_date)? $end_date:date('d M Y');
            $data['items'] = $rows;
            $data['title'] = 'សរុបកញ្ចប់ទំនិញទាំងអស់';
            $sender_name ='All Merhcants';
            if($sender_id > 0){
              $sender_name = DB::table('sender as s')->where('id',$sender_id)->take(1)->value('name');
              if(!$sender_name) $sender_name ='Invalid Merchant';
            }
            $data['subtitle'] =  '<b>'.$sender_name.'</b> : ចាប់ពី '.date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date)); 
            break;
          }
          case 'dr_unpaid_packages':{
            $warehouse_id =isset($p->wid)? $p->wid:null;
            $start_date = isset($p->startdate)?$p->startdate:date('d M Y');
            $end_date = isset($p->enddate)?$p->enddate:date('d M Y');
            $driver_id=isset($p->driverid)?$p->driverid:null;
            $trx_id=isset($p->trxid)?$p->trxid:null;
            $driver = new \App\Models\Dms\Driver();
            $m_data = $driver->getUnpaidPackages(['trx_id'=>$trx_id,'driver_id'=>$driver_id,'start_date'=>$start_date,'end_date'=>$end_date],$driver_id);

            $start_date = (bool)strtotime($start_date)? $start_date:date('d M Y');
            $end_date = (bool)strtotime($end_date)? $end_date:date('d M Y');
            $data['data'] =$m_data;
            //  echo json_encode( $items); return;
            $data['title'] =  $trx_id? 'កញ្ចប់រង់ចាំការអនុម័ត':'កញ្ចប់មិនទាន់ទូទាត់ ';
            if($driver_id > 0) $driver_name = DB::table('driver as d')->where('id',$driver_id)->take(1)->value('name');
            if(!$driver_name) $driver_name ='Unknown Driver';
            $data['subtitle'] =  'អ្នកដឹក <b>'.$driver_name.'</b> : ចាប់ពី '.date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));

            break;
          }
          case 'vd_settled_packages':{
            $this->show_merchant_settled_packages($ss,$p,$data);
            break;
          }
          case 'dr_settled_packages':{
            $this->show_driver_settled_packages($ss,$p,$data);
            break;
          }
          case 'package_list':{
            $completed = isset($p->completed)? $p->completed:null;
            if ($completed !==1 && $completed !==0) $completed =null;
            $warehouse_id =isset($p->wid)? $p->wid:null;
            $start_date = isset($p->startdate)?$p->startdate:date('d M Y');
            $end_date = isset($p->enddate)?$p->enddate:date('d M Y');
            $driver_id = isset($p->driverid)?$p->driverid:null;
            $zone_code = isset($p->zonecode)?$p->zonecode:null;
            $search_value =isset($p->search)?$p->search:null;
            $sender_id=isset($p->senderid)?$p->senderid:null;
            $delivery_type=isset($p->dtype)?$p->dtype:null;
            $status_id=isset($p->stid)?$p->stid:null;

            $start_date = (bool)strtotime($start_date)? $start_date:date('d M Y');
            $end_date = (bool)strtotime($end_date)? $end_date:date('d M Y');
            $data['items'] = $this->reportModel->getPackageList($warehouse_id,$completed,$start_date,$end_date,$search_value,$sender_id,$delivery_type,$zone_code,$driver_id,$status_id);
            $data['title'] = ($completed===0)? "Outstanding Packages List":($completed===1? "Completed Package List":"បញ្ជីរកញ្ចប់ទំនិញទាំងអស់");
            $data['subtitle'] ="មកដល់ឃ្លាំង: ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
            break;
          }case 'fleet_list':{
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
          }case 'driver_list':{
            $data['title'] ="Driver List";
            $data['subtitle'] ="Print Date: ".Carbon::now();
            $warehouse_id =$p->wid;
            $search_value = null;
            $shift = null;
            $status_code = null;
            $emp_type = isset($p->emptype)? $p->emptype : null;
            $data["items"]= $this->reportModel->getDriverList($warehouse_id,$search_value,$shift, $status_code,$emp_type);
            break;
          }
          case 'sender_list':{
            $data['title'] ="Merchant List";
            $data['subtitle'] ="Print Date: ".Carbon::now();
            $data["items"]= $this->reportModel->getSenderList($p->wid);
            break;
          }
          case 'salespersons':{
            $data['title'] ="Sales Persons";
            $data['subtitle'] ="Print Date: ".Carbon::now();
            $warehouse_id =$p->wid;
            $search_value = null;
            $status_code= null;
            $ss = (object)['branch_id'=>$branch_id];
            $agent = new \App\Models\Dms\SalesAgent();
            $data["items"]= $agent->getList();
            break;
          }
          case 'dr_package_list':{
            $warehouse_id =$p->wid;
            $driver_name = isset($p->drivername)?$p->drivername:null;
            $driver_id = $p->driverid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;
            $data['driver_name'] = $driver_name;

            $data['title'] ="Deliveries by Driver";
            $sub_title = 'Driver: '. $driver_name."  Arrival Date: ".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date));
            $data['subtitle'] =  $sub_title; // "Print Date: ".Carbon::now();
            $data["items"]= $this->reportModel->getDeliveredPackagesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null);
            break;
          }
          case 'vd_deliveries':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $sender_name = isset($p->sendername)?$p->sendername:null;
            $sender_id = $p->senderid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type = $p->dtype;
            $status_id = $p->statusid;
            $data['sender_name'] = $sender_name;

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
            $status_id =0; /** status_id = 0 => getSummarizedDeliveriesByDriver() will use default status_id = 8 **/
            $data["items"]= $this->reportModel->getSummarizedDeliveriesByDriver($warehouse_id, $driver_id, $start_date, $end_date,$delivery_type=null,$status_id);
            break;
          }
          case 'dr_commissions':
          case 'dr_driver_commissions':
          case 'driver_commissions':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $driver_id = $p->driverid;
            $driver = getDataRow('driver',['id'=>$driver_id],"name,code,phone_number");
            if(!$driver){
               echo '<div style="display:flex;padding:5px;background-color:orange; border:1.5px solid organge;border-radius:5px;color:#fff;font-weight:600;">Please select a driver to view his or her summarized commissions</div>';
               return;
            }
            $driver_name = $driver->name;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $delivery_type =null;
            $data['title'] ="SUMMARIZED DRIVER COMMISSIONS";
            $sub_title = '<span style="font-weight:600;">អ្នកដឹកឈ្មោះ: '.$driver_name." (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")</span>";
            $data['subtitle'] =  $sub_title;
            $data['subtitle1'] = "Print Date: ".date('d M Y h:i');
            $ss = (object)['branch_id'=>$branch_id];
            $d = $this->reportModel->getDriverCommissionItems($ss,$warehouse_id,$driver_id, $start_date, $end_date);
            $data["data"] =$d;
            $data['rtype'] = 'dr_driver_commissions';
            break;
          }
          case 'active_senders':{
            /** "dr-" is prefix for driver-report **/
            $warehouse_id =$p->wid;
            $start_date = (bool)strtotime($p->startdate)? $p->startdate: date('Y-m-d');
            $end_date = (bool)strtotime($p->enddate)? $p->enddate: date('Y-m-d');
            $data['title'] ="អ្នកផ្ញើរសកម្ម";
            $sub_title = "ចាប់ពី ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
            $data['subtitle'] =  $sub_title;
            $d =$this->reportModel->getActiveSenders($warehouse_id,$start_date,$end_date);
            $data['subtitle1'] = "សរុបអ្នកផ្ញើរសកម្ម៖ ".$d->count." នាក់";
            $data['senders']= $d->senders;
            $data['rtype']="active_senders";
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
            $data['rtype']="dr_driver_pmts";
            break;
          }
          case 'daily_summary':{
            $warehouse_id =$p->wid;
            $start_date = (bool)strtotime($p->startdate)? $p->startdate: date('Y-m-d');
            $end_date = (bool)strtotime($p->enddate)? $p->enddate: date('Y-m-d');
            unset($p->rtype);
            $data['params'] = $p;
            $count = $this->reportModel->getActiveDrivers_count($warehouse_id,$start_date,$end_date);
            $data['title'] ="របាយការណ៍សង្ខេប";
            $sub_title = "ចាប់ពី ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
            $data['subtitle'] =  $sub_title;
            $data['subtitle1'] = "សរុបអ្នកដឹក៖ ".$count." នាក់";
            $data['data']= $this->reportModel->getCompanyReport_summary($warehouse_id,$start_date,$end_date);
            $data['rtype']="rpt_daily_summary";
            //dd($data);return;
            break;
          }
          case 'vd_summarized_deliveries':{
            $warehouse_id =$p->wid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $sender_id = $p->senderid;
            $sender_id = $p->senderid;
            $sender_name = $p->sendername;
            $data['title'] ="DAILY SUMMARY BY MERCHANT";
            $sub_title = $sender_name. " (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title;
            $d = $this->reportModel->getVendorSummary($sender_id,$start_date,$end_date);
            $data['data'] = $d;
            break;
          }
          case 'vd_transactions':{
            $warehouse_id =$p->wid;
            $sender_id = $p->senderid;
            $sender_name = null; //isset($p->sendername)?$p->sendername:null;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            //$use_paginate = $p->usepaginate;
            $trx_type = isset($p->trxtype)?$p->trxtype:'';

            $ss = (object)['branch_id'=>$branch_id];
            $senderInfo = null;
            if( $sender_id > 0){
              $sender = new \App\Models\Dms\Sender($sender_id,$ss);
              $senderInfo = $sender->getDetails();
            }

            $sender_name = $senderInfo? $senderInfo->name: 'All Merchants';
            $data['title'] ="MERCHANT PAYMENT TRANSACTIONS";
            if(!$end_date) $end_date = date('Y-m-d');
            $sub_title = $sender_name. " (".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date)).")";
            $data['subtitle'] =  $sub_title;
            $pmt = new \App\Models\Dms\PaymentTransaction();

            $m_data =$pmt->getTransactions_merchant([
              'trx_type'=>$trx_type,
              'start_date'=>$start_date,
              'end_date'=>$end_date,
              'use_paginate'=>false,
              'sender_id'=>$senderInfo?$senderInfo->id:null
            ],$ss);
            $data['data']= $m_data;
            break;
          }
          case 'sales_comm':{
            $warehouse_id =$p->wid;
            $agent_id = $p->agentid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            $data['title'] ="SALES COMMISSIONS REPORT";
            $sub_title = "From ".date('d M Y',strtotime($start_date))." to ".date('d M Y',strtotime($end_date));
            $data['subtitle'] = "";
            $data['items'] = $this->reportModel->getSalesCommissions($warehouse_id,$agent_id,$start_date,$end_date);
            break;
          }
          case 'driver_collections':{
            $warehouse_id =$p->wid;
            $driver_id = isset($p->driverid)?$p->driverid:null;
            $driver = getDataRow('driver',['id'=>$driver_id],'id,name,phone_number,code');
            $driver_name = "(All Drivers)";
            if($driver) $driver_name = $driver->name;

            $data['title'] ="របាយការណ៍ប្រម៉ូលប្រាក់ពីអ្នកដឹក";
            $data['subtitle'] = $driver_name;
            $start_date = isset($p->startdate)? convertDate($p->startdate):null;
            if (!$start_date || !(bool)strtotime($start_date)){
              $month = date('m');
              $day = date('d');
              $year = date('Y');
              $start_date ="$year-$month-01";
            }
            $end_date = isset($p->enddate)? convertDate($p->enddate):null;
            if (!$end_date || !(bool)strtotime($end_date)) $end_date = date('Y-m-d');
            $sub_title = "ចាប់ពី ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
            $data['subtitle1'] = $sub_title;

            $rpt = new \App\Models\Dms\PaymentTransaction();
            $d = $rpt->getTransactions_driver([
              'use_paginate'=>false,
              'warehouse_id'=>$warehouse_id,
              'start_date'=>$start_date,
              'end_date'=>$end_date,
              'driver_id'=>$driver? $driver->id:null,
            ],(object)['branch_id'=>$branch_id]);

            $data['data']= $d;
            $data['rtype']='driver_collections';
            break;
          }
          case 'vd_summary':{
            $warehouse_id =$p->wid;
            $sender_id = $p->senderid;
            $start_date = $p->startdate;
            $end_date = $p->enddate;
            //$merchant_name = isset($p->sendername)?$p->sendername:null;
            $sender_pmt_status_id = isset($p->senderpmtstatusid)?$p->senderpmtstatusid:-1;
            if($sender_pmt_status_id==null || $sender_pmt_status_id=='') $sender_pmt_status_id =-1;
            $delivery_status_id = isset($p->deliverystatusid)?$p->deliverystatusid:null;

            $data['title'] ="របាយការណ៍សង្ខេបអ្នកលក់";
            if(!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
            if(!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
            $sub_title = "ចាប់ពី ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));

            $data['subtitle1'] = $sub_title;
            $d = $this->reportModel->getReportData_dv_summary($warehouse_id,$sender_id,$start_date,$end_date,$sender_pmt_status_id,$delivery_status_id);
            $data['subtitle'] = isset($d->merchant->name)?$d->merchant->name:'(All Merchants)';
            $data['data']= $d;
            break;
          }
          case 'vendor_trx':{
            break;
          }
          default:{
            $data['title'] = "IT SEEMS NO MATCHING REPORT NAME :)";
            break;
          }
        }

        return view('reports.genreport',$data);
    }

    function hs_merchant_invoice($query_string = null){
      if (!Session::get('login_name',null)) return redirect('/');
      $branch_id =Session::get('branch_id',0);
      if (!$branch_id) return redirect('/');
      $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
      $p = processQueryString($query_string);

      if(!$p) {
        return view('errors.500');
      }

      $warehouse_id = $p->wid;
      $sender_id = isset($p->senderid)?$p->senderid:0;
      $start_date =$p->startdate;
      $end_date = $p->enddate;
      $delivery_status_id =null;

      if(!$sender_id){
        echo 'No Merchant choosen! (All Merchants) is not allowed for this report';
        return;
      }
      //$sender_pmt_status_id = $p->sender_pmt_status_id;
      $sender_pmt_status_id = $p->senderpmtstatusid;

      $sender_pmt_status_id =  $sender_pmt_status_id==null?-1:$sender_pmt_status_id;
      $d = $this->reportModel->getReportData_dv_summary($warehouse_id,$sender_id,$start_date,$end_date,$sender_pmt_status_id,$delivery_status_id);
      $merchant_banks = null;
      if(isset($d->merchant)){
        $merchant_banks = isset($d->merchant->bank_accounts)?$d->merchant->bank_accounts:null;
      }
      $data['data'] = $d;
      $data['merchant_bank'] = isset($merchant_banks[0])?$merchant_banks[0]:null;
      //if(!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
      //if(!(bool)strtotime($end_date)) $end_date = date('Y-m-d');

      $pmt_status_title = ($sender_pmt_status_id ==-1)? "បញ្ជីរកញ្ចប់បានទូទាត់ និង មិនទាន់ទូទាត់":($sender_pmt_status_id==1? "បញ្ជីរកញ្ចប់បានទូទាត់":"បញ្ជីរកញ្ចប់មិនទាន់ទូទាត់");

      $date = "ចាប់ពី ".date('d M Y',strtotime($d->start_date))." ដល់ ".date('d M Y',strtotime($d->end_date));
      $data["date"] = $date;
      $data['pmt_status_title'] =$pmt_status_title;
      // echo dd($data); return;

       if(!$sender_id){
        echo 'No Merchant choosen! (All Merchants) is not allowed for this report';
        return;
      }
      return view('reports.hs_merchant_invoice',$data);
    }


    /** Improved merchant invoice for HouXpress */
    function hs_merchant_invoice_v2($query_string = null){
      if (!Session::get('login_name',null)) return redirect('/');
      $branch_id =Session::get('branch_id',0);
      if (!$branch_id) return redirect('/');
      $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
      $p = processQueryString($query_string);

      if(!$p) {
        return view('errors.500');
      }

      if(!$p->senderid){
        echo 'No Merchant choosen! (All Merchants) is not allowed for this report';
        return;
      }

      $warehouse_id = $p->wid;
      $sender_id = $p->senderid;
      $start_date =$p->startdate;
      $end_date = $p->enddate;
      //$delivery_status_id =null;

      //$sender_pmt_status_id = $p->sender_pmt_status_id;
      $sender_pmt_status_id = $p->senderpmtstatusid;

      $sender_pmt_status_id =  $sender_pmt_status_id==null?-1:$sender_pmt_status_id;
      $report = new \App\Models\Dms\Report();
      $d = $report->getMerchantSummaryReport($warehouse_id,$sender_id,$start_date,$end_date,$sender_pmt_status_id);
      $merchant_banks = null;
      if(isset($d->merchant)){
        $merchant_banks =isset($d->merchant->bank_accounts)?$d->merchant->bank_accounts:null;
      }
      $data['data'] = $d;
      $data['merchant_bank'] = isset($merchant_banks[0])?$merchant_banks[0]:null;
      if(!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
      if(!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
      $pmt_status_title = ($sender_pmt_status_id ==-1)? "បញ្ជីរកញ្ចប់បានទូទាត់ និង មិនទាន់ទូទាត់":($sender_pmt_status_id==1? "បញ្ជីរកញ្ចប់បានទូទាត់":"បញ្ជីរកញ្ចប់មិនទាន់ទូទាត់");

      $date = "ចាប់ពី ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
      $data["date"] = $date;
      $data['pmt_status_title'] =$pmt_status_title;
      // echo dd($data); return;

      return view('reports.hs_merchant_invoice_v2',$data);
    }

    //standard merchant invoice
    function merchant_invoice($query_string = null){
      if (!Session::get('login_name',null)) return redirect('/');
      $branch_id =Session::get('branch_id',0);
      if (!$branch_id) return redirect('/');
      $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
      $p = processQueryString($query_string);

      if(!$p) {
        return view('errors.500');
      }

      $warehouse_id = $p->wid;
      $sender_id = $p->senderid;
      $start_date =$p->startdate;
      $end_date = $p->enddate;
      $delivery_status_id =null;

      //$d = $this->reportModel->getReportData_dv_summary($warehouse_id,$sender_id,$start_date,$end_date,null,$delivery_status_id);
      $merchant_banks = null;
      // if(isset($d->merchant)){
      //   $merchant_banks =$d->merchant->bank_accounts;
      // }
      $data['data'] = null;
      $data['merchant_bank'] = isset($merchant_banks[0])?$merchant_banks[0]:null;
      if(!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
      if(!(bool)strtotime($end_date)) $end_date = date('Y-m-d');
      $pmt_status_title = ''; //($sender_pmt_status_id ==-1)? "បញ្ជីរកញ្ចប់បានទូទាត់ និង មិនទាន់ទូទាត់":($sender_pmt_status_id==1? "បញ្ជីរកញ្ចប់បានទូទាត់":"បញ្ជីរកញ្ចប់មិនទាន់ទូទាត់");

      //$pmt_status_title = ($sender_pmt_status_id ==-1)? "បញ្ជីរកញ្ចប់បានទូទាត់ និង មិនទាន់ទូទាត់":($sender_pmt_status_id==1? "បញ្ជីរកញ្ចប់បានទូទាត់":"បញ្ជីរកញ្ចប់មិនទាន់ទូទាត់");
      $date = "ចាប់ពី ".date('d M Y',strtotime($start_date))." ដល់ ".date('d M Y',strtotime($end_date));
      $data["date"] = $date;
      $data['pmt_status_title'] =$pmt_status_title;
      // echo dd($data); return;

      return view('reports.merchant_invoice',$data);
    }
}
