<?php

namespace App\Http\Controllers\Abm;

use App\Http\Controllers\Controller;
use App\Models\Abm\Supplier;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
class SupplierController extends Controller
{
    protected $supplier = null;
    function __construct(){
        $this->supplier = new Supplier();
    }
    function save(Request $req){
        $id = $req->id;
        $prn_code = $id? 306:305;
        $ss = AuthService::verifyAuth($req,$prn_code);
        if($ss->status_code != 200) return JDV::raw($ss);
        $save = $this->supplier->save($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getSuplierList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = Supplier::list($req->all(),$ss);
        return JDV::result($data);
    }
    function delete(Request $req)
    {
        $ss = AuthService::verifyAuth($req, 307);
        if ($ss->status_code !== 200)
            return JDV::raw($ss);
        $id = $req->id;
        $supplier = new Supplier();
        $delete = $supplier->delete($id);
        return JDV::raw($delete);
    }

    function getSuplierListPaginate(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        $data = $this->supplier->getSuplierListPaginate($req->all(),$ss);
        
        return JDV::result($data);
    }

    function setSupplierPriceList(Request $req){
        $ss = AuthService::verifyAuth($req,336);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->supplier_id? $req->supplier_id:$req->id;
        $supplier = new Supplier($id,$ss);
        $res = $supplier->setPriceList($req->price_list_id);
        // return JDV::result($res );
        if ($res->status==='OK') return JDV::success(['list_name'=>$res->list_name,'list_id'=>$res->list_id]);
        return JDV::error($res->error_message);
     }
    function createOverseaItem(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code != 200) return JDV::raw($ss);
        $id = $req->id;
        $save = $this->item->createOverseaItem($req->all(),$id,$ss);    
        return JDV::raw($save);
    }

    function getOverseaItemList(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);   
        $id = $req->id;
        $data = $this->item->getOverseaItemList($id,$ss);
        
        return JDV::result($data);
    }

    function getFormOptions(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss);
         $id = $req->id?$req->id:$req->sender_id;  
         $data = $this->supplier->getFormOptions($id,$ss); 
         return JDV::result($data);
     }

    function updateSupplierStatus(Request $req){
        $ss = AuthService::verifyAuth($req,307);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $supplier = new Supplier($id,$ss);
        $res = $supplier->updateStatus($req->status_code,$id);
        return JDV::raw($res);
    }

    function saveProfilePicture(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if ($ss->status_code !==200) return JDV::raw($ss); //user not authenticated
        $id = $req->id?$req->id:$req->sender_id;
        $photo = $req->photo;
        $supplier = new Supplier($id,$ss);
        $res = $supplier->saveProfilePicture($photo,$req->file_type);
        return JDV::raw($res);
     }
     function deleteProfilePicture(Request $req)
     {
         $ss = AuthService::verifyAuth($req, -1);
         if ($ss->status_code !== 200)
             return JDV::raw($ss); //user not authenticated
         $id = $req->id ? $req->id : $req->supplier_id;
         $cus = new Supplier($id, $ss);
         $res = $cus->deleteProfilePicture();
         return JDV::raw($res);
     }
}
