<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class StockLog extends Model
{
    use HasFactory;

    //$d = ['action_name'=>'receive','qty'=>10, 'sku'=>'bottle', 'trx_id']
    //This log is for each item in inv_daily_stocks
    static function log($ss,$d){
         $branch_id = $ss->branch_id;
         $trx_id = isset($d['trx_id'])? $d['trx_id']:null;
         $action = isset($d['action_name'])? $d['action_name']:$d['action'];
         $qty = isset($d['qty'])?$d['qty']:0;
         $sku = isset($d['sku'])?$d['sku']:"";

         $create_user = $ss->full_name;
         $message ="";
         switch($action){
            case 'receive':{
                $message ="$create_user receives PO $qty $sku";
                break;
            }    
            case 'adjust':{
                $message ="$create_user adjust quantity $qty $sku";
                break;
            }
            case 'sell':{
                $message ="$create_user sell quantity $qty $sku";
                break;
            }
            case 'receive return':{
                $message ="$create_user receive returns $qty $sku";
                break;
            }
            case 'return to vendor':{
                $message ="$create_user returns $qty $sku to vendor";
                break;
            }
            default:{
                $message ="unknown action";
                break;
            }
         }

         DB::table('inv_stock_log')->insert([
            'branch_id'=>$branch_id,
            'trx_id'=>$trx_id,
            'action_name'=>$action,
            'description'=>$message,
            'create_uid'=>$ss->user_id,
            'create_user'=>$ss->login_name,
            'created_at'=>getNowTime()
         ]);
         return true;
    }
}
