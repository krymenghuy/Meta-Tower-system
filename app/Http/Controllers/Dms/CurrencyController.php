<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\UM;
use App\Models\JDV;
use Config;
use DB;
 
class CurrencyController extends Controller
{
    
    //Exhcnage rate update period = {'intra-day','daily','monthly'}
    protected static $update_period ='daily';
    //protected $UMModel;
    // function __construct(){
    //     $this->UMModel = new UM();
    // }

    // //CheckAuth() returns sessionInfo object
    // function checkAuth(Request $req,$prn_id=-1){
    //     $ss = getSessionInfo($req);
    //     if(!$ss) return (object)['error_message'=>'Authentication failed','status_code'=>401,'status'=>'Error'];//user not authenticated
    //     if (!prn_allowed($prn_id)) return (object)['error_message'=>"Permisison $prn_id is required",'status_code'=>405,'status'=>'Error']; //need permission to do this task
 
    //     $req->decrypted =1;
    //     $ss->status='OK';
    //     $ss->status_code =200;
    //     return $ss;
    // }

    //Create/Update currency
    //$d = {code,name,symbol,symbol_after,decimal_points}
    function saveCurrency(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $validate_rule =['id'=>"0|identity=1",'code'=>"1|string|1-5","name"=>"1|string|1-50","symbol"=>"1|string|1-3|text=Currency symbol is required","symbol_after"=>"1|choice|0,1|default=0"];
        $check_unique =["$branch_id|currencies|code|id|text=Currency code already exists"];
        $res = validateReq($req,$validate_rule,true,['symbol'=>['$']],$auth->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        $id = saveData($auth,'currencies',['id'=>$id],$inputs,[],1);
        return JDV::success(["id"=>$id]);
    }

    function deleteCurrency(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $id = $req->id;
        DB::table("currencies")->where("id",$id)->delete();
        return JDV::success();
    }
    
    function deleteCurrencyPair(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $id = $req->id;
        if($id>0)
          DB::table("currency_pairs")->where("id",$id)->delete();
        else{
            $name = $req->name;
            DB::table("currency_pairs")->where("currency_pair",$name)->delete();
        }  
        return JDV::success();
    }
    //getCurrencyPairsList()
    function getCurrencyPairs(Request $req){
        $auth = UM::getUserInfoByToken($req);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $rows = DB::table("currency_pairs as p")->where("p.branch_id",$branch_id)->selectRaw("p.id,p.currency_pair,p.create_user")->get();
        return JDV::result($rows);
    }

    function getCurrencies(Request $req){
        $auth = UM::getUserInfoByToken($req);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $rows = DB::table("currencies as c")->where("branch_id",$branch_id)->selectRaw("id,code,name,symbol,symbol_after")->get();
        return JDV::result($rows);
    }

    //Create Currency Pair. createExchangeRatePair(). Create Exchange Rate currency pair such as USDKHR
    function createCurrencyPair(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $validate_rule =['id'=>'0|identity=1','currency_pair'=>'1|string|1-20','buy_rate'=>'0|number|default=0','sell_rate'=>'0|number|default=0'];
        $check_unique =["$branch_id|currency_pairs|currency_pair|id=id|text=Currency pair already exists"];
        $res = validateReq($req,$validate_rule,true,['currency_pair'=>['-']],$auth->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;

        $buy_rate = $inputs['buy_rate'];
        $sell_rate = $inputs['sell_rate'];
        unset($inputs['buy_rate']);
        unset($inputs['sell_rate']);
        $id = saveData($auth,'currency_pairs',['id'=>$id],$inputs,[],1);
        if($id>0){
            $currency_pair = $inputs['currency_pair'];
            if($buy_rate >0 || $sell_rate >0){
               //Add Exchange rate, if the rate for today does not exist 
               if(!$this->rate_exists($currency_pair,null)){
                   saveData($auth,'exchange_rates',['id'=>0],[
                    "currency_pair"=>$currency_pair,
                    'buy_rate'=>$buy_rate,
                    'sell_rate'=>$sell_rate,
                    'x_date'=>getNowTime()
                   ],[],1);
               }
               
            }
            return JDV::success(['id'=>$id]);
        }
        return JDV::error("Failed to create currency pair");
    }
    
    //Check if an exchange_rate exists on a given $date
    function rate_exists($currency_pair, $x_date=null){
        if(!(bool)strtotime($x_date)) $x_date = date('Y-m-d');
       return DB::table("exchange_rates")->where("currency_pair",$currency_pair)->whereRaw("DATE(x_date)='$x_date'")->select("id")->take(1)->exists();
    }
    
    function getExchangeRateInfo(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $id = $req->id;
        $cols = "r.id,r.x_date,r.x_month,r.currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.sell_rate,2) AS sell_rate,r.create_user,DATE_FORMAT(r.create_date,'%d %b %Y') as create_date";
        $rows = DB::table('exchange_rates as r')->where('id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        return JDV::result(isset($rows[0])?$rows[0]:null);
    }

    //$d = {x_month = "2023.2",currency_pair='USDKHR'}
    function getExchangeRates(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $currency_pair = $req->currency_pair;
        //Example x_month ="2023.2"
        $x_month = $req->x_month;
        $x_date = convertDate($req->x_date);
        $currency_pair = $req->currency_pair;
        //if(!(bool)strtotime($x_date)) $x_date = date('Y-m-d');
        $str_period = "1=1";
        $sts = explode('.',$x_month);
       
        $x_year_num = isset($sts[0])?$sts[0]:0;
        $x_month_num = isset($sts[1])?$sts[1]:0;
 
        if((bool)strtotime($x_date)) 
          $str_period="DATE(x_date) ='$x_date'";
        else if($x_month_num > 0 && $x_year_num >0) $str_period = "MONTH(x_date) =$x_month_num AND YEAR(x_date) = $x_year_num";
        else{
             //if there are no date and no month supplied as filter
             $x_date = date('Y-m-d');
             $x_month_num = date('m',strtotime($x_date));
             $x_year_num =  date('Y',strtotime($x_date));
             $str_period = "MONTH(x_date) =$x_month_num AND YEAR(x_date) = $x_year_num";
        }

        $str_pair = "1=1";
        if($currency_pair) $str_pair ="r.currency_pair ='$currency_pair'";
        $rows = DB::table("exchange_rates as r")->whereRaw($str_period)->whereRaw($str_pair)->where('r.branch_id',$branch_id)->selectRaw('r.id,formatDate(r.x_date) as x_date,r.currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw("r.x_date DESC")->get();
        return JDV::result($rows);
    }

    function deleteExchangeRate(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $id = $req->id;
        DB::table("exchange_rates")->where("id",$id)->delete();
        return JDV::success();
    }

    function getComboItems_x_month(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;
        $rows = DB::table("exchange_rates as r")->where('branch_id',$branch_id)->selectRaw("DISTINCT x_month,x_year,concat(x_year,'.',x_month) as `year_month`, concat(x_year,'.',x_month) as year_month_name")->orderByRaw('x_year DESC,x_month DESC')->get();
        return JDV::result($rows);
    }

    function rateExists($branch_id,$currency_pair,$x_date,$update_period='daily'){
        $x_month = date("m",strtotime($x_date));;
        if(!$x_month) $x_month=0;
       if($update_period==='daily'){
          $x_date1 = convertDate($x_date);
          $rows = DB::table('exchange_rates as r')->whereRaw("DATE(r.x_date) ='$x_date1'")->where('r.currency_pair',$currency_pair)->where('r.branch_id',$branch_id)->selectRaw('r.id,r.buy_rate,r.sell_rate')->take(1)->get();
       }else if ($update_period==='monthly'){
          $rows = DB::table('exchange_rates as r')->whereRaw("MONTH(r.x_date) =$x_month")->where('r.currency_pair',$currency_pair)->where('r.branch_id',$branch_id)->selectRaw('r.id,r.buy_rate,r.sell_rate')->take(1)->get();
       }else{
         $rows = [];
       }
       return count($rows)>0;
    }

    //Create exchange rate by date
    //$d = {x_date,buy_rate,sell_rate,auto_apply}
    function saveExchangeRate(Request $req){
        $auth = UM::getUserInfoByToken($req,-1);
        if($auth->status_code !=200) return JDV::raw($auth);
        $branch_id = $auth->branch_id;

        $currency_pair = isset($req->currency_pair)?$req->currency_pair:$req->pair;
        $x_date = $req->x_date;
        $id = $req->id;
        $auto_apply = $req->auto_apply;
        if(!(bool)strtotime($x_date)) $x_date = getNowTime();
        if($auto_apply){
             $this->applyExchangeRate($req);
        }

        $validate_rule =['id'=>"0|identity=1","x_month"=>"0|number|default=0","x_date"=>"0|date","currency_pair"=>"1|string|exists=currency_pairs.currency_pair|text=Currency pair not valid or does not exist","buy_rate"=>"1|positive","sell_rate"=>"1|positive"];
        $check_unique = [];
        $res = validateReq($req,$validate_rule,true,['currency_pair'=>['-']],$auth->lang,false,$check_unique);
        if($res->error) return JDV::error($res->error);
        $id = $res->id;
        if(!$id || $id ===0){
             if($this->rateExists($branch_id,$currency_pair,$x_date,self::$update_period)) return JDV::error(self::$update_period." exchange rate for $currency_pair already exists");
        }

        $inputs = $res->values;
        $inputs['x_date'] = convertDate($inputs['x_date']);
        $inputs['x_month'] = date('m',strtotime($inputs['x_date']));
        $inputs['x_year'] = date('Y',strtotime($inputs['x_date']));

        $id = saveData($auth,"exchange_rates",['id'=>$id],$inputs,[],1);
        if($id > 0) return JDV::success(['id'=>$id]);
        return JDV::error("Failed to save exchange rate");
    }

    //Apply Exchange rate based on selected date range
    function applyExchangeRate(Request $req){
        $ss = UM::getUserInfoByToken($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);
        // $start_date = convertDate($req->start_date);
        // $end_date = convertDate($req->end_date);
        $id = $req->id;
        $rateInfo = DB::table('exchange_rates as r')->where('r.id',$id)->selectRaw('r.id,r.x_date,r.buy_rate,r.sell_rate')->first();
        if(!$rateInfo) return JDV::error('It seems the selected Date does not have Exchange Rate data');
        $x_date = convertDate($rateInfo->x_date);
        $count = DB::table('package')->where('branch_id',$ss->branch_id)->whereRaw('DATE(arrival_time) = \''.$x_date.'\'')->update([
            'exchange_rate'=>$rateInfo->buy_rate
        ]);
        return JDV::success(['affected_count'=>$count,'buy_dare'=>number_format($rateInfo->buy_rate,2,'.',''),'x_date'=>date('d M Y',strtotime($x_date))]); 
    }
}
