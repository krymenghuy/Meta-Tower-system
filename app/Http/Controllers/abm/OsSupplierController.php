<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\OsSupplier;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
class OsSupplierController extends Controller
{
    protected $supplier = null;
    function __construct(){
        $this->supplier = new OsSupplier();
    }
    function save(Request $req){

        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->supplier->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getSuplierList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->supplier->getSuplierList();
        
        return JDV::result($data);
    }
    function delete(Request $req)
    {
        $ss = UM::getUserInfoByToken($req, -1);
        if ($ss->status_code !== 200)
            return JDV::raw($ss);
        $id = $req->id;
        $supplier = new OsSupplier();
        $delete = $supplier->delete($id);
        return JDV::raw($delete);
    }

    function getSuplierListPaginate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->supplier->getSuplierListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }

    function setSupplierPriceList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->supplier_id? $req->supplier_id:$req->id;
        $supplier = new OsSupplier($id,$ss);
        $res = $supplier->setPriceList($req->price_list_id);
        // return JDV::result($res );
        if ($res->status==='OK') return JDV::success(['list_name'=>$res->list_name,'list_id'=>$res->list_id]);
        return JDV::error($res->error_message);
     }
    function createOverseaItem(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->item->createOverseaItem($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getOverseaItemList(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);   
        $id = $req->id;
        $data = $this->item->getOverseaItemList($id,$ss);
        
        return JDV::result($data);
    }

    function getFormOptions(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id?$req->id:$req->sender_id;  
         $data = $this->supplier->getFormOptions($id,$ss); 
         return JDV::result($data);
     }

    function updateSupplierStatus(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $supplier = new OsSupplier($id,$ss);
        $res = $supplier->updateStatus($req->status_code,$id);
        return JDV::raw($res);
    }

    function saveProfilePicture(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $photo = $req->photo;
        $supplier = new OsSupplier($id,$ss);
        $res = $supplier->saveProfilePicture($photo,$req->file_type);
        return JDV::raw($res);
     }
     function deleteProfilePicture(Request $req)
     {
         $ss = UM::getUserInfoByToken($req, -1);
         if ($ss->status_code !== 200)
             return JDV::raw($ss); //user not authenticated
         $id = $req->id ? $req->id : $req->supplier_id;
         $cus = new OsSupplier($id, $ss);
         $res = $cus->deleteProfilePicture();
         return JDV::raw($res);
     }
}
