<?php

namespace App\Http\Controllers\abm;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\abm\Customer;
use App\Models\JDV;
use App\Models\UM;

class CustomerController extends Controller
{
    function save(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id;
         $zone = new Customer($id,$ss); 
         $save = $zone->save($req->all());
        //  JDV::result($save);
         return JDV::raw($save); 
     }
     function getList_all(Request $req) {
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = Customer::list_all($req->all(),$ss);
        return JDV::result($data); 
   }
   function getCustomerDetails(Request $req ){

    $ss = UM::getUserInfoByToken($req,-1);
    if($ss->status_code != 200) return JDV::raw($ss); 
    $id=$req->id;
    $customer= new Customer($id,$ss);
    $detail = $customer->details($id,$ss);
    return JDV::raw($detail);

}
function deleteCustomer(Request $req){
    $ss = UM::getUserInfoByToken($req, -1);
    if($ss->status_code !==200) return JDV::raw($ss);
    $id=$req->id;
    $customer = new Customer();
    $delete = $customer->delete($id);
    return JDV::raw($delete);
}
function getFormOptions(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    $id = $req->id;
    $customer = new Customer($id,$ss);
    if($ss->status_code !==200) return JDV::raw($ss);
    $data = $customer->getFormOptions($id,$ss,true); 
    return JDV::result($data);
}
function getList(Request $req){
    $ss = UM::getUserInfoByToken($req,-1);
    if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
    return JDV::result(Customer::list($req->all(),$ss));
   }
//    function setPriceList(Request $req){
//     $ss = UM::getUserInfoByToken($req,-1);
//     if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
//     $id = $req->sender_id? $req->sender_id:$req->id;
//     $sender = new Sender($id,$ss);
//     $res = $sender->setPriceList($req->price_list_id);
//     if ($res->status==='OK') return JDV::success(['list_name'=>$res->list_name,'list_id'=>$res->list_id]);
//     return JDV::error($res->error_message);
//  }
}
