<?php

namespace App\Http\Controllers\Abm;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Abm\CustomerPrice;
use App\Models\UM;
use App\Models\JDV;

class PriceController extends Controller
{
    protected $priceModel;

    public function __construct(){
        $this->priceModel = new CustomerPrice();
    }

    function renamePriceList(Request $req){
       $ss = UM::getUserInfoBytoken($req,-1);
       if($ss->status_code !==200) return JDV::raw($ss);
       $id = $req->price_list_id?$req->price_list_id:$req->id;
       $OsPrice = new CustomerPrice($id,$ss);
       $res = $OsPrice->renamePriceList($req->name);
       return JDV::raw($res);
    }

    function translateScript(Request $request){
      $r = $this->priceModel->translateScript($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
     
    function getPriceListIdBySearchValue(Request $request){
      $r = $this->priceModel->getPriceListIdBySearchValue($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function getSampleScript(Request $request){
      $r = $this->priceModel->getSampleScript($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    
    function updateZoneCodes(Request $request){
      $r = $this->priceModel->updateZoneCodes($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
   }

    function savePriceLine(Request $request){
        $r = $this->priceModel->savePriceLine($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }
       
    function removeMerchantFromPriceList(Request $request){
      $r = $this->priceModel->removeMerchantFromPriceList($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
     
    //Add a merchant by his ID to use a OsPrice list (price_list_id)
    //$d = {'sender_id','price_list_id'}
    function setMerchantPriceList(Request $request){
      $r = $this->priceModel->setMerchantPriceList($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function addMerchantToPriceList(Request $request){
      $r = $this->priceModel->addMerchantToPriceList($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function getMerchantsByPriceList(Request $request){
      $r = $this->priceModel->getMerchantsByPriceList($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function deletePriceZones(Request $request){
      $r = $this->priceModel->deletePriceZones($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
     
    function savePriceLineZones(Request $request){
      $r = $this->priceModel->savePriceLineZones($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    
    function savePriceLineInfo(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $p = new CustomerPrice($req->id,$ss);
      $res = $p->savePriceLineInfo($req->all());
     return JDV::raw($res);
    }
     
    function deletePriceLine(Request $request){
        $r = $this->priceModel->deletePriceLine($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 

    function saveCODFeeCharge(Request $request){
      $r = $this->priceModel->saveCODFeeCharge($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 

  function getCODFeeCharge(Request $request){
    $r = $this->priceModel->getCODFeeCharge($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
} 

    function getPriceLineData(Request $request){
        $r = $this->priceModel->getPriceLineData($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

    function deletePriceList(Request $request){
      $r = $this->priceModel->deletePriceList($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 
    
    function createPriceList(Request $request){
      $r = $this->priceModel->createPriceList($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 

    function updatePriceList_kg_marker(Request $request){
      $r = $this->priceModel->updatePriceList_kg_marker($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 
 
    function getComboItems_price_list(Request $request){
      $r = $this->priceModel->getComboItems_price_list($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function getPriceList(Request $request){
        $r = $this->priceModel->getPriceList($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 

    function getPriceList_data(Request $request){
      $r = $this->priceModel->getPriceList_data($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 

    //getSenderBaseFees() return list or base fee (promotions) to be displayed in PROMOTIONS tab view on Delivery Zones setting
    function getSenderBaseFees(Request $request){
      $r = $this->priceModel->getSenderBaseFees($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 
    function saveBaseFee(Request $request){
      $r = $this->priceModel->saveBaseFee($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }
    
    function deleteBaseFee(Request $request){
      $r = $this->priceModel->deleteBaseFee($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    }

    function getFormOptions_priceline(Request $request){
      $r = $this->priceModel->getFormOptions_priceline($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
  } 
  
      function getCODFees(Request $request){
        $r = $this->priceModel->getCODFees($request);
        if($r =='#350') 
          return makeJsonResponse($r,350); // user not authenticated
        else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    } 
    function saveCODFeeBySender(Request $request){
      $r = $this->priceModel->saveCODFeeBySender($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 

    function deleteCODFee(Request $request){
      $r = $this->priceModel->deleteCODFee($request);
      if($r =='#350') 
        return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
      return makeJsonResponse($r);
    } 

  function getExchangeRate(Request $request){
    $r = $this->priceModel->getExchangeRate($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  } 
  
  function getApplicableZones(Request $request){
    $r = $this->priceModel->getApplicableZones($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }
  function getApplicableSenders(Request $request){
    $r = $this->priceModel->getApplicableSenders($request);
    if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
    return makeJsonResponse($r);
  }

}
