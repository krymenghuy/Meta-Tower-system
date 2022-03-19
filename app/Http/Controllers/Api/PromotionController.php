<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;

class PromotionController extends Controller
{
    protected $promoModel;
    public function __construct()
    { 
        
        $this->promoModel = new Promotion();
    }

   function getPromotionList(Request $request){
      $r = $this->promoModel->getPromotionList($request);
      if($r =='#350') 
      return makeJsonResponse($r,350); // user not authenticated
      else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
     return makeJsonResponse($r);
   } 

   function deletePromotion(Request $request){
    $r = $this->promoModel->deletePromotion($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  } 

  function getPromotionInfo(Request $request){
    $r = $this->promoModel->getPromotionInfo($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  } 

  function savePromotion(Request $request){
    $r = $this->promoModel->savePromotion($request);
    if($r =='#350') 
    return makeJsonResponse($r,350); // user not authenticated
    else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
   return makeJsonResponse($r);
  } 

}
