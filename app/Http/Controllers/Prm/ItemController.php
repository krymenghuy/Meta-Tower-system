<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Prm\Item;
use JDV;
use XAuthService;

class ItemController extends Controller
{
    protected $items;
    public function __construct(){
        $this->items = new Item();
    }
    public function saveItem(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->item_id;
        $item = new Item($id, $ss);
        $res = $item->saveItem($req->all());
        return JDV::raw($res);
    }
    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
       
        return JDV::result($this->items->getListPaginate($req->all(),$ss));
    }
    public function itemDetails(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $item_id = $req->id ?? $req->item_id;
        if(!isset($item_id) || !is_numeric($item_id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->items->itemDetails($item_id));
    }

     public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->items->getFormOptions($req->id,$ss));
    }
    public  function deleteItem(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->items->deleteItem($req->id,$ss));
    }

    
}
