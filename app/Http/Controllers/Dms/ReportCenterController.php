<?php

namespace App\Http\Controllers\Dms;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\GeneralSettings;
use App\Models\UM;
use App\Models\JDV;
use Session;
use DB;

class ReportCenterController extends Controller
{
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
       if(!isset($data[$row->category])) $data[$row->category] = ['category'=>$row->category,'list'=>[],'order_number'=>1];
       $data[$row->category]['list'][] = $row;
       //$data[] = (object)['category'=>$row->category,'order_number'=>1,'list'=>[]];
       //$data->list  = $row;
    }
    return JDV::json($data);
 }

    function getReportFilterOptions(Request $req){
      $branch_id = Session::get('branch_id',1);
      $ss = (object)['branch_id'=>$branch_id];
      $sender_statuses = [(object)['sender_status'=>'Active'], (object)['sender_status'=>'Inactive']]; 
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
        'months'=>GeneralSettings::options_calendar_month_year($ss),
        'sales_agent_types'=>GeneralSettings::options_sales_agent_type($ss),
        'sender_statuses'=>$sender_statuses
      ];
      return JDV::result($data);
    }

}
