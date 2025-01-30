<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Umt\AuthService;
use App\Models\JDV;
use App\Models\Currency;
use App\Models\ExchangeRateProvider;

class MoneyController extends Controller
{
    
    //Exhcnage rate update period = {'intra-day','daily','monthly'}
    protected static $update_period ='daily';
    //Create/Update currency
    //$d = {code,name,symbol,symbol_after,decimal_points}
    function saveCurrency(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id;
        $cur = new Currency($id,$ss);
        $res = $cur->save($req->all(),$id,$ss);
        return JDV::raw($res);
    }

    function deleteCurrency(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id;
        $cur = new Currency($id,$ss);
        $res = $cur->delete($id);
        return JDV::raw($res);
    }
    function getCurrencies(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id;
        $cur = new Currency($id,$ss);
        $data = $cur->getList($ss);
        return JDV::result($data);
    }
     
    function getCurrencyDetails(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id;
        $cur = new Currency($id,$ss);
        $data = $cur->getDetails($ss);
        return JDV::result($data);
    }

    function getFormOptions_currency(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id;
        $cur = new Currency($id,$ss);
        $data = $cur->getFormOptions($id,$ss);
        return JDV::result($data);
    }

    function getFormOptions_exchange_rate(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id ?? $req->exchange_rate_id;
        $x = new ExchangeRateProvider($id,$ss);
        $data = $x->getFormOptions($id,$ss);
        return JDV::result($data);
    }
  
    
    function getExchangeRateDetails(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id ?? $req->exchange_rate_id;
        $x = new ExchangeRateProvider($id,$ss);
        $data = $x->getDetails($id);
        return JDV::result($data);
    }

    function deleteExchangeRate(Request $req){
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !=200) return JDV::raw($ss);
        $id = $req->id ?? $req->exchange_rate_id;
        $x = new ExchangeRateProvider($id,$ss);
        $res = $x->delete($id);
        return JDV::raw($res);
    }
  
    function saveExchangeRate(Request $req){
            $ss = AuthService::verifyAuth($req,-1);
            if($ss->status_code !=200) return JDV::raw($ss);
            $id = $req->id ?? $req->exchange_rate_id;
            $x = new ExchangeRateProvider($id,$ss);
            $res = $x->save($req->all(),$id,$ss);
            return JDV::raw($res);
     }
    function getExchangeRateList(Request $req){
            $ss = AuthService::verifyAuth($req,-1);
            if($ss->status_code !=200) return JDV::raw($ss);
            $id = $req->id ?? $req->exchange_rate_id;
            $x = new ExchangeRateProvider($id,$ss);
            $data = $x->getList($req->all(),$ss);
            return JDV::result($data);
    }
   
    function options_x_month(Request $req){
            $ss = AuthService::verifyAuth($req,-1);
            if($ss->status_code !=200) return JDV::raw($ss);
            $data = ExchangeRateProvider::options_x_month($ss);
            return JDV::result($data);
    }
  
}
