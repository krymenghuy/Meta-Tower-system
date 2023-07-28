<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JDV;
use App\Models\UM;
use App\Models\PriceList;

class PriceListController extends Controller
{
    function getPriceList_paginate(Request $req){
       $ss = UM::getUserInfoByToken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $p = new PriceList($req->id,$ss);
       $data = $p->list_paginate($req->all);
       return JDV::result($data);
    }
   
    function savePriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->save($req->all()));
    }

    function deletePriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->delete());
    }

    function getPriceListDetails(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(PriceList::details($req->id));
    }

    function getPriceListItems(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        return JDV::result(PriceList::items($req->id));
    }

    function saveItem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->saveItem($req->all()));
    }

    function deleteItem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $p = new PriceList($req->id,$ss);
        return JDV::raw($p->deleteItem($req->item_id));
    }
}
