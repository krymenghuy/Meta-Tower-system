<?php

namespace App\Models\Prm;

use Illuminate\Support\Facades\DB;
use DV;
use DBX;
use Vsd\Vsloquent\VSModel;

class InvoiceSetting extends VSModel
{
    // Keeping this plural as verified by your database structure screenshot
    protected $table    = 'invoice_settings';
    protected $userInfo = null;
    protected static $img_dir = 'invoice_settings';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id       = $id;
        $this->userInfo = $userInfo;
    }

  public function saveInvoiceSetting($arr = [], $id = null, $ss = null)
    {
        if (is_object($id) && is_null($ss)) {
            $ss = $id;
            $id = null;
        }

        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        // Default to 'en' (English) if the session or language is STILL missing
        $lang = ($ss && isset($ss->lang)) ? $ss->lang : 'en';

        // ONLY keep exchange_rate validation here
        $v_rule = [
            'exchange_rate' => '1|number|text=Please enter the exchange rate.',
        ];

        // Validate incoming request parameters
        $res = DBX::validateObject($arr, $v_rule, 1, [], $lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        
        // $inputs will now ONLY contain ['exchange_rate' => value]
        $inputs = $res->values;

        // Save data updates ONLY the exchange_rate field in row id = 1
        $resSave = DBX::saveData($ss, $this->table, ['id' => 1], $inputs, [], 1);
        if (!$resSave) {
            return DV::error('Error saving invoice setting!');
        }
        return DV::depends(1, [
            $this->table => $inputs,
            'id' => 1
        ]);
    }
  
    public function getInvoiceSetting(array $arr = [], $ss = null)
    {
        // FIXED: Changed from ->get() to ->first() to return a single configurations object 
        // instead of an indexed array array containing the record wrapper
        return DB::table($this->table)->first();
    }
}