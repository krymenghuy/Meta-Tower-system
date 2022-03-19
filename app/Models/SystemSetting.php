<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Notifier;
use Carbon\Carbon;
use Session;
use DB;

class SystemSetting extends Model
{
    use HasFactory;
 
    static function package_statuses($d){
        // $ss = getSessionInfo($d);
        // if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(2)) return '@'; //need permission to do this task
        // $branch_id = $ss->branch_id;
        //if(!isset($d->expcepts)) $d->expcepts = "";
        $rows = DB::table('package_statuses AS ps')->selectRaw("ps.id AS status_id,ps.name AS status")->orderByRaw("ps.id ASC")->get();
        return $rows;
    }

    function getComboItems_package_status($data=null){
        // $ss = getSessionInfo($data);
        // if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(2)) return '@'; //need permission to do this task
          $rows = DB::table('package_statuses')->selectRaw('id,name AS status_name')->get();
          return ($rows);
    }

    static function merchant_list($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id; 

          $rows = DB::table('sender AS s')->where('s.branch_id',$branch_id)->selectRaw('id,name')->get();
          return ($rows);
    }

    function getComboItems_price_list($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id; 

          $rows = DB::table('price_list_names')->where('branch_id',$branch_id)->selectRaw('id,name')->get();
          return ($rows);
    }
    static function product_types($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $rows = DB::table('product_types AS t')->where('branch_id',$branch_id)->selectRaw("name AS product_type")->orderByRaw("name")->get();  
        return $rows;
    }
}
