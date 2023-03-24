<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use DB;
use Session;

class StockController extends Controller{
  //Receive PO items and increase Inventory items
  function receiveItems(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code !=200) return $ss; //user not authenticated
    $branch_id = $ss->branch_id;

    $validate_rule = [
        "type"=>"1|choice|RM,FG",
        "po_number"=>"0|string|0-25",
        "items"=>"1|array"
    ];

    $check_unique = null;
    $res = validateReq($req,$validate_rule,true,[],$ss->lang,false,$check_unique);
    if($res->error) return JDV::error($res->error); 
  }
}