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

        $v_rule = [
            'exchange_rate' => '1|number|text=Please enter the exchange rate.',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $lang, 0, null);
        if ($res->error) {
            return DV::error($res->error);
        }
        
        $inputs = $res->values;

        $resSave = DBX::saveData($ss, $this->table, ['id' => 1], $inputs, [], 1);
        if (!$resSave) {
            return DV::error('Error saving invoice setting!');
        }
        return DV::depends(1, [
            $this->table => $inputs,
            'id' => 1
        ]);
    }

   public function getInvoiceSetting()
    {
        // Fetch the row where id = 1
        $setting = DB::table($this->table)->where('id', 1)->first();

        if (!$setting) {
            return DV::error('Invoice settings not found!');
        }

        // Cast the stdClass object to an array to satisfy DV::success()
        return DV::success((array) $setting);
    }

   
}

