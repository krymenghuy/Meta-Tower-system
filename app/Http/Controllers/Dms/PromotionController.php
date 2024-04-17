<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dms\Promotion;
use App\Models\Dms\UM;
use App\Models\Dms\JDV;

class PromotionController extends Controller
{
    protected $promoModel;
    public function __construct()
    { 
        
        $this->promoModel = new Promotion();
    }

   function getPromotionList(Request $request){
      $ss = UM::getUserInfoByToken($request,-1);
      if ($ss->status_code !==200) return JDV::raw($ss);
      $rows = $this->promoModel->getPromotionList($ss,$request->all());
      return JDV::result($rows); 
   } 

   function deletePromotion(Request $request){
    $ss = UM::getUserInfoByToken($request,-1);
    if ($ss->status_code !==200) return JDV::raw($ss);
    $res = $this->promoModel->deletePromotion($ss,$request->all());
    return JDV::raw($res);
  } 

  function getPromotionInfo(Request $request){
    $ss = UM::getUserInfoByToken($request,-1);
    if ($ss->status_code !==200) return JDV::raw($ss);
    $row = $this->promoModel->getPromotionInfo($ss,$request->all());
    return JDV::result($row); 
  }
  
  function savePromotion(Request $request){
    $ss = UM::getUserInfoByToken($request,-1);
    if ($ss->status_code !==200) return JDV::raw($ss);
    $res = $this->promoModel->savePromotion($ss,$request->all());
    return JDV::raw($res);
  
  } 

}
