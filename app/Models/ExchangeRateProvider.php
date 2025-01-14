<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
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

    /**
     * Retrieve exchange rates for a specific date range.
     */
    public static function getList($arr, $ss)
    {
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        $d = (object)$arr;
        $base_currency = $d->base_currency;
        $foreign_currency = $d->foreign_currency;
        $start_date = convertDate($d->start_date ?? null);
        $end_date = convertDate($d->end_date ?? null);
        //$str_dates = "x_date BETWEEN '$start_date' AND '$end_date'";
        return DB::table('exchange_rates')
            ->where('base_currency', strtoupper($base_currency))
            ->where('foreign_currency', strtoupper($foreign_currency))
            ->where('subs_id', $bin_subs_id)
            ->whereBetween('x_date', [$start_date, $end_date])
            ->selectRaw('id, x_date, rate,base_currency, foreign_currency, update_user, updated_at')
            ->orderBy('x_date','DESC')
            ->get();
    }
}
