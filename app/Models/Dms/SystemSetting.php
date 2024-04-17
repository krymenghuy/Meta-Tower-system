<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
// use App\Models\Notifier;
// use Carbon\Carbon;
// use Session;
use DB;
use Sanitizer;

class SystemSetting extends Model
{
    use HasFactory;
 
    static function package_statuses($d){
        // $ss = UM::getUserInfoByToken($d);
        // if ($ss->status_code !==200) return $ss; //user not authenticated
        //  //need permission to do this task
        // $branch_id = $ss->branch_id;
        //if(!isset($d->expcepts)) $d->expcepts = "";
        return DB::table('package_statuses AS ps')->selectRaw("ps.id AS status_id,ps.name AS status")->orderByRaw("ps.id ASC")->get();
    }

    function getComboItems_package_status($data=null){
         return DB::table('package_statuses')->selectRaw('id,name AS status_name')->get();
    }

    static function merchant_list($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id; 
        return DB::table('sender AS s')->where('s.branch_id',$branch_id)->selectRaw('id,name')->get();
    }

    function getComboItems_price_list($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = $ss->branch_id;
        return DB::table('price_list_names')->where('branch_id',$branch_id)->selectRaw('id,name')->get();
    }

    function getData_magicEntry($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $order_id = Sanitizer::sanitize($d->order_id);

        $order_info = null;
        $rows = DB::table('order as o')->join('sender AS s','s.id','=','o.sender_id')->where('o.branch_id',$branch_id)->where('o.id',$order_id)->selectRaw("o.id as order_id, o.code as order_code, o.qty as package_count, s.name AS sender_name,s.phone_number as sender_phone")->limit(1)->get();
        foreach($rows as $row) $order_info = $row;
        return (object)[
         'zones'=>DB::table('zones as z')->where('z.branch_id',$branch_id)->selectRaw("z.zone_code,CONCAT(z.zone_code,' | ', z.zone_name) AS zone_name")->get(),
         'senders'=>DB::table('sender AS s')->where('s.branch_id',$branch_id)->selectRaw("s.id,s.code as sender_code, s.name as sender_name,s.phone_number")->get(),
         'order_info'=>$order_info
        ];
    }

    function getOrderListByMerchant($d){
        $ss = UM::getUserInfoByToken($d);
        if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $sender_id = Sanitizer::sanitize($d->sender_id);
        return DB::table('order as o')->where('o.branch_id',$branch_id)->where('o.sender_id',$sender_id)->whereRaw("o.status_id < 5")->selectRaw("o.id,o.code as order_code")->orderByRaw('o.create_date DESC')->get();
    }

    static function product_types($ss){
        $branch_id =1; //$ss? $ss->branch_id: 1;
        return DB::table('product_types AS t')->where('branch_id',$branch_id)->selectRaw("name AS product_type")->orderByRaw("name")->get();
    }
}
