<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JDV;
use XUser;
use XAuthservice;
use DB;

use XApplication;
use XReport;
use AuthDBX;

class ReportCenterController extends Controller
{
//     function getReportList(Request $req){
//         $ss = XAuthService::verifyAuth($req,-1);
//         if($ss->status_code !=200) return JDV::raw($ss);
//         $user_id = $ss->user_id;
//         $app_id = $req->app_id ?? null;
//         if(!$app_id){
//              \Log::error('ReportCenterController->getReportList() requires app_id, which is not supplied!');
//              return JDV::json([]);
//         }
//         $access_reports = XUser::getReports ($user_id,$app_id,null);
//         $rows = DB::table('reports as rpt')->where('app_id',hex2bin($app_id))->selectRaw('rpt.id,rpt.permission_id,rpt.name,rpt.code,rpt.category,rpt.params,rpt.module_id,rpt.display_order,rpt.hidden')->orderByRaw('display_order ASC')->get();
//         $reports = [];
//         $is_master_account = $ss->is_master_account ?? 0;
//         foreach($rows as $row){
//             if (!$is_master_account){
//                 $permission_id = $row->permission_id ?? null;
//                 if ($permission_id > 0){
//                     $founds = $access_reports ->filter(function($can_access_report) use($permission_id){
//                         return $can_access_report->permission_id == $permission_id;
//                     });
//                     if(!$founds->isEmpty()){
//                         $reports[] = $row;
//                     }
//                 }else $reports[] = $row;

//             } else $reports[] = $row;
//         }
//         return JDV::json($reports);
//    }

   static function appExists($bin_app_id){
     return DB::table('um_applications')->where('id',$bin_app_id)->value('name');
   }
     function getReportList(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $user_id = $ss->user_id;
        $app_id = $req->app_id ?? null;
        //$str_app_id = DBX::whereBinary('app_id', $req->app_id);
        
        $access_reports = XUser::getReports($user_id,$app_id,null);
        $rows = XReport::getData(['hidden' =>0],'id,permission_id,name as name,code,category,params,module_id,display_order,hidden',[],3,null,[['display_order','Asc']],null);
        //$rows = DB::table('reports as rpt')->whereRaw($str_app_id)->selectRaw('rpt.id,rpt.permission_id,rpt.name as name,rpt.code,rpt.category,rpt.params,rpt.module_id,rpt.display_order,rpt.hidden')->orderByRaw('display_order ASC')->get();
 
        $reports = [];
        $is_master_account = $ss->is_master_account ?? 0;
        foreach($rows as $row){
            if (!$is_master_account){
                $permission_id = $row->permission_id ?? null;
                if ($permission_id > 0){
                    $founds = $access_reports ->filter(function($can_access_report) use($permission_id){
                        return $can_access_report->permission_id == $permission_id;
                    });
                    if(!$founds->isEmpty()){
                        $reports[] = $row;
                    }
                }else $reports[] = $row;
               
            } else $reports[] = $row;
        }
      return JDV::json($reports);
   }
   function getReportListByCategory(Request $req){
    $ss = XAuthService::verifyAuth($req,-1);
    if($ss->status_code !=200) return JDV::raw($ss);
    $app_id = $req->app_id;
    $bin_app_id = $app_id ? hex2bin($app_id):null;
    if(!$bin_app_id) return [];
    if(!self::appExists($bin_app_id)) return [];

    $user_id = $ss->user_id;
    $is_master_account = $ss->is_master_account ?? 0;

    $access_reports = XUser::getReports ($user_id,$app_id,null);
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
