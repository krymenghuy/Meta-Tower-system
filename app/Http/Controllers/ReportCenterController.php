<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\Umt\User;
use DB;
  
class ReportCenterController extends Controller
{
    function getReportList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $include = '';
        $user_id = $ss->user_id;
        if($ss->is_master_account !== 1){
            $umm_prms = DB::table('um_user_permissions as up')->join('um_permissions as p','p.id','=','up.permission_id',)->where('user_id', $user_id)->where('p.category','report')->pluck('p.name')->toArray();
            if(count($umm_prms)> 0){
                $include = ' AND name IN (\'' . implode('\',\'', $umm_prms) . '\')';
            }else{
                $include = ' AND 1 = 0';
            }
        }
      $rows = DB::select("SELECT id, `name`, `hidden`, code,category,rpt.module_id,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 $include ORDER BY rpt.display_order ASC");
      return JDV::json($rows);
   }

   static function appExists($bin_app_id){
     return DB::table('um_applications')->where('id',$bin_app_id)->value('name');
   }

   function getReportListByCategory(Request $req){
    $ss = AuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);
    $app_id = $req->app_id;
    $bin_app_id = $app_id ? hex2bin($app_id):null;
    if(!$bin_app_id) return [];
    if(!self::appExists($bin_app_id)) return [];

   
    $user_id = $ss->user_id;
    $is_master_account = $ss->is_master_account ?? 0;

    $access_reports = User::getReports ($user_id,$app_id,null);
    $reports = DB::table('reports as rpt')->where('rpt.app_id',$bin_app_id)->whereRaw('IFNULL(rpt.hidden,0) =0')->selectRaw('id, permission_id,`name`, `hidden`, code,category,rpt.module_id,rpt.params,rpt.export_pdf, export_excel,export_csv, rpt.category_order,rpt.display_order,rpt.hidden')->get();
    $allowed_reports = [];
    foreach($reports as $row){
        $prn_id = $row->permission_id;
        if($is_master_account){
            $allowed_reports[] = $row;
        }else{
            if ($prn_id > 0){
                $founds = $access_reports->filter(function($x) use($prn_id){
                    return $x->permission_id == $prn_id;
                });
                if(!$founds->isEmpty()){
                    $allowed_reports[] = $row;
                }
            }else{
                //allowed report that we dont apply Permission Control
                $allowed_reports[] = $row;
            }
        }
    }
    $organized_reports = [];
    foreach($allowed_reports as $row){
       $cat_name = $row->category; 
       if (!isset( $organized_reports[$cat_name])){
         $organized_reports[$cat_name] = [];
         $organized_reports[$cat_name]['category'] = $cat_name; 
         $organized_reports[$cat_name]['list'] = [];
       }
       $organized_reports[$cat_name]['list'][] = $row; 
    }
    return JDV::result( $organized_reports);
 }
 
}
