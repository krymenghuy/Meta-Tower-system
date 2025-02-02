<?php

namespace App\Models;

use App\Models\ExchangeRateProvider;
use Illuminate\Support\Facades\DB;

class Money
{
    // The base currency for all conversions
    public static $base_currency = 'KHR',$national_currency = 'KHR';
    /**
     * Get a list of currencies for a given subscription.
     */
    public function getCurrencyList($ss)
    {
        $subs_id = $ss->subs_id;
        $bin_subs_id = hex2bin($subs_id);
        $rows = DB::table('currencies as c')
            ->where('subs_id', $bin_subs_id)
            ->selectRaw('c.id, c.code, c.name')
            ->get();
        return $rows;
    }

    /**
     * Format a number as currency with default 2 decimal places.
     */
    public static function format($amount, $currency = 'USD')
    {
        return number_format($amount, 2, '.', ',');
    }

    /**
     * Get the symbol for a given currency code.
     */
    public static function getCurrencySymbol($currency)
    {
        $cur = strtoupper($currency);
        if ($cur === 'USD') {
            return '$';
        } elseif ($cur === 'KHR') {
            return '៛';
        } else {
            return null;
        }
    }

    /**
     * Format money amount with currency symbol.
     */
    public static function formatMoney($amount, $currency = 'USD', $use_symbol = true)
    {
        if ($use_symbol) {
            $symbol = self::getCurrencySymbol($currency);
            return $symbol . ' ' . self::format($amount, $currency);
        } else {
            return self::format($amount, $currency) . ' ' . $currency;
        }
    }

    /**
     * Convert an amount from one currency to another.
     */
    public static function convert($ss,$amount, $from_currency, $to_currency = null, $exchange_rate = null)
    {
        $to_currency = $to_currency ?? self::$base_currency;
        if ($from_currency === $to_currency) {
            // If the currency is already the base currency, no conversion needed
            return $amount;
        }
        // Fetch the exchange rate if not provided
        $exchange_rate = $exchange_rate ?? ExchangeRateProvider::getLatestRate($ss,$to_currency, $from_currency);

        if (!$exchange_rate) {
            throw new \Exception("Exchange rate not found for $from_currency to " . $to_currency);
        }

        // Convert based on the direction (to_base: true for foreign -> base, false for base -> foreign)
        return  round($amount * $exchange_rate, 2);


    }

    /**
     * Convert an amount to the base currency.
     */
    public static function toBase($ss,$amount, $currency,$exchange_rate = null)
    {
        return self::convert($ss,$amount,$currency,null, $exchange_rate);
    }

    /**
     * Convert an amount from the base currency to another currency.
     */
    public static function fromBase($ss, $amount, $currency, $exchange_rate = null)
    {
        return self::convert($ss,$amount, $currency, $exchange_rate, false);
    }

    static function getBaseCurrency() {
        return self::$base_currency;
    }

    static function options_currency($ss)
    {
        return DB::table('currencies')->selectRaw('code,name,symbol')->get();
    }


}
