<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;

class ExchangeRateProvider
{
    /**
     * Get the latest exchange rate for a given currency pair.
     */
    public static function getLatestRate($ss,$base_currency, $foreign_currency)
    {
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        return DB::table('exchange_rates')
            ->where('base_currency', strtoupper($base_currency))
            ->where('foreign_currency', strtoupper($foreign_currency))
            ->where('subs_id', $bin_subs_id)
            ->orderByDesc('x_date')
            ->value('rate');
    }


    function rateExistsByMonth($ss,$base_currency, $quoted_currency,$x_date,$update_period='daily'){
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        $x_month = date("m",strtotime($x_date));
        if(!$x_month) $x_month=0;
       if($update_period === 'daily'){
          $x_date1 = convertDate($x_date);
          $row = DB::table('exchange_rates as r')->whereRaw("DATE(r.x_date) ='$x_date1'")->where('r.base_currency',$base_currency)->where('r.quoted_currency',$quoted_currency)->where('r.subs_id',$bin_subs_id)->selectRaw('r.id,r.buy_rate,r.sell_rate')->first();
       }else if ($update_period==='monthly'){
          $row = DB::table('exchange_rates as r')->whereRaw("MONTH(r.x_date) =$x_month")->where('r.base_currency',$base_currency)->where('r.quoted_currency',$quoted_currency)->where('r.subs_id',$bin_subs_id)->selectRaw('r.id,r.buy_rate,r.sell_rate')->first();
       }else{
         $row = null;
       }
       return $row ? true: false;
    }

    function rateExistsByDate($base_currency,$quoted_currency, $x_date=null){
        if(!(bool)strtotime($x_date)) $x_date = date('Y-m-d');
        $q_x_date = DBX::convertToDate('x_date');
        return DB::table("exchange_rates")->where("base_currency",$base_currency)->where("quoted_currency",$quoted_currency)->whereRaw("$q_x_date='$x_date'")->select('id')->exists();
    }

    /**
     * Insert or update an exchange rate.
     */
    public static function setRate($ss,$base_currency, $foreign_currency, $rate, $x_date)
    {
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        $base_currency = strtoupper($base_currency);
        $foreign_currency = strtoupper($foreign_currency);
        $id = DB::table('exchange_rates as x')->where('subs_id',$bin_subs_id)->where('base_currency',$base_currency)->where('x_date',$x_date)->where('foreign_currency',$foreign_currency)->value('id');
        $inputs = [
            'base_currency' => $base_currency,
            'foreign_currency' => $foreign_currency,
            'x_date' => $x_date,
            'rate'=>$rate
        ];
        $id = saveData($ss,'exchange_rates',['id'=>$id],$inputs,[],1,false);
        return DV::depends(1);
    }


    //Create exchange rate by date
    function save($arr, $id =null, $ss=null){
       // $subs_id = $ss->subs_id;
        //$bin_subs_id = hex2bin($subs_id);
        $v_rule = [
            'base_currency'=>'1|string|1-10|exists=currencies.code',
            'quoted_currency'=>'1|string|1-10|exists=currencies.code',
            'x_date'=>'0|date',
            'buy_rate'=>'1|number',
            'sell_rate'=>'1|number',
            'rate'=>'0|number',
        ];
       
        $res =  validateObject($arr,$v_rule,true,[],$ss->lang,false);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $rate = $d->rate ?? null;
        if($d->base_currency == $d->quoted_currency) return DV::error('The base currency and quoted currency cannot be the same!');
        if($id){
            unset($inputs['x_date'], $inputs['quoted_currency'],$inputs['base_currency']);
        }
        unset($inputs['rate']);
        $x_date =  convertDate($d->x_date ?? null) ?? date('Y-m-d');
        $inputs['x_date'] = $x_date;
        $inputs['x_month'] = date('m',strtotime($x_date));
        $inputs['x_year'] = date('Y',strtotime($x_date));
        $id = saveData($ss,'exchange_rates',['id'=>$id],$inputs,[],1,false);
        return DV::depends($id,null,'Failed to save exchange rate info');
    }

    static function options_x_month($ss){
        $subs_id =$ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        return DB::table("exchange_rates as r")->where('subs_id',$bin_subs_id)->selectRaw("DISTINCT x_month,x_year,concat(x_year,'.',x_month) as `year_month`, concat(x_year,'.',x_month) as year_month_name")->orderByRaw('x_year DESC,x_month DESC')->get();
    }

    /**
     * Retrieve exchange rates for a specific date range.
     */
    public static function getList($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        $d = (object)$arr;

       $current_page =isset($d->current_page)?$d->current_page:1;
       $per_page =isset($d->per_page)?$d->per_page:10;
       if(!is_numeric($current_page)) $current_page=1;
       $skip_rows = ($current_page -1) * $per_page;

        $base_currency = $d->base_currency ?? null;
        $quoted_currency = $d->quoted_currency ?? null;
        $start_date = convertDate($d->start_date ?? null);
        $end_date = convertDate($d->end_date ?? null);
        //$str_dates = "x_date BETWEEN '$start_date' AND '$end_date'";
        $user_info = DBX::query_user_info('x','update_date',true,'create_date');
        $query = DB::table('exchange_rates AS x')
            ->where('subs_id', $bin_subs_id)
            ->selectRaw('id, x_date, ROUND(buy_rate,4) AS rate,ROUND(buy_rate,4) AS buy_rate, ROUND(sell_rate,4) AS sell_rate,CONCAT(quoted_currency,base_currency) AS currency_pair, base_currency, quoted_currency, update_user, updated_at,'.$user_info)
            ->orderBy('x_date','DESC');
            if($base_currency) $query->where('base_currency',$base_currency);
            if($quoted_currency) $query->where('quoted_currency',$quoted_currency);
            if($start_date && $end_date){
                $q_x_date = DBX::convertToDate('x.x_date');
                $query->whereBetween($q_x_date,[$start_date,$end_date]);
            }
        $count_query = clone $query;
        $count = $count_query->count('x.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();    
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    static function getExchangeRate($base_currency,$quoted_currency, $end_date = null,$ss=null){
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        if(!$end_date) $end_date = date('Y-m-d');
        $col_x_date = DBX::formatDate('r.x_date','x_date');
        $q_date = DBX::convertToDate('r.x_date');
        $row = DB::table('exchange_rates AS r')->where('subs_id',hex2bin($subs_id))->whereRaw($q_date. ' <=\''.$end_date.'\'')->where('base_currency',$base_currency)->where('quoted_currency',$quoted_currency)->selectRaw($col_x_date.',concat(r.quoted_currency,r.base_currency) AS currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->first();
        $img = base_url('assets/images/icons/usa.png');
        if($row){
            $row->image_url = $img;
            return $row;
        }
        return (object)['x_date'=>date('d M Y'),'currency_pair'=>null,'buy_rate'=>1,'sell_rate'=>1,'image_url'=>$img];
    }

    static function getCurrentExchangeRate($base_currency,$quoted_currency,$ss=null){
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        $end_date = date('Y-m-d');
        $col_x_date = DBX::formatDate('r.x_date','x_date');
        $q_date = DBX::convertToDate('r.x_date');
        $row = DB::table('exchange_rates AS r')->where('subs_id',hex2bin($subs_id))->whereRaw($q_date. ' <=\''.$end_date.'\'')->where('base_currency',$base_currency)->where('quoted_currency',$quoted_currency)->selectRaw($col_x_date.',concat(r.quoted_currency,r.base_currency) AS currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->first();
        $img = base_url('assets/images/icons/usa.png');
        if($row) return $row; 
        return (object)['x_date'=>date('d M Y'),'currency_pair'=>null,'buy_rate'=>1,'sell_rate'=>1,'image_url'=>$img];
    }

    static function getExchangeRateList($end_date = null,$ss=null){
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        if(!$end_date) $end_date = date('Y-m-d');
        $col_x_date = DBX::formatDate('r.x_date','x_date');
        $col_date = DBX::convertToDate('r.x_date');
        $rows = DB::table('exchange_rates AS r')->where('subs_id',hex2bin($subs_id))->whereRaw($col_date. ' <=\''.$end_date.'\'')->selectRaw($col_x_date.',concat(r.quoted_currency,r.base_currency) AS currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->get();
        $img = base_url('assets/images/icons/usa.png');
        foreach($rows as &$row){
            $row->image_url = $img;
        }
        return $rows;
    }

    function getDetails($id){
        return DB::table('exchange_rates AS x')
        ->where('x.id', $id)
        ->selectRaw('id, x_date, ROUND(buy_rate,4) AS rate,ROUND(buy_rate,4) AS buy_rate, ROUND(sell_rate,4) AS sell_rate,CONCAT(quoted_currency,base_currency) AS currency_pair, base_currency, quoted_currency, update_user, updated_at')->first();
    }

    function getFormOptions($id,$ss){
        $x_rate = $id ? $this->getDetails($id):null;
        return (object)[
            'exchange_rate'=>$x_rate,
            'currencies'=>Currency::options_currency($ss)
        ]; 
    }
   
    function delete($id){
        DB::table('exchange_rates')->where('id',$id)->delete();
        return DV::depends(1);
    }
    
    // static function getExchangeRateList($end_date = null,$ss=null){
    //     $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
    //     if(!$end_date) $end_date = date('Y-m-d');
    //     $col_x_date = DBX::formatDate('r.x_date','x_date');
    //     $col_date = DBX::convertToDate('r.x_date');
    //     $row = DB::table('exchange_rates AS r')->where('subs_id',hex2bin($subs_id))->whereRaw($col_date. ' <=\''.$end_date.'\'')->selectRaw($col_x_date.',r.currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->first();
    //     $img = base_url('assets/images/icons/usa.png');
    //     if($row){
    //         $row->image_url = $img;
    //         return [$row];
    //     }
    //     return [['x_date'=>date('d M Y'),'currency_pair'=>null,'buy_rate'=>1,'sell_rate'=>1,'image_url'=>$img]];
    // }
}