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

    public function getExchangeRate($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        // Default to 'en' (English) if the session or language is STILL missing
        $lang = ($ss && isset($ss->lang)) ? $ss->lang : 'en';

        // 1. Fetch the data record as a clean database row object
        $setting = DB::table($this->table)
            ->where('id', 1)
            ->first();

        if (!$setting) {
            return DV::error('Invoice settings not found!');
        }

        $resData = array(
            'exchange_rate' => $setting->exchange_rate ?? '0.00',
        );
        return $resData;
    }

      public function getInvoiceSetting($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        // Default to 'en' (English) if the session or language is STILL missing
        $lang = ($ss && isset($ss->lang)) ? $ss->lang : 'en';

        // 1. Fetch the data record as a clean database row object
        $setting = DB::table($this->table)
            ->where('id', 1)
            ->first();

        if (!$setting) {
            return DV::error('Invoice settings not found!');
        }

        $resData = array(
            'show_baland' => $setting->show_baland,
            'show_comm_tax' => $setting->show_comm_tax,
            'show_pay_status' => $setting->show_pay_status,
            'show_amount_paid' => $setting->show_amount_paid,
            'exchange_rate' => $setting->exchange_rate ?? '0.00',
        );
        return $resData;
    }


   public function updateToglleButton($arr = [], $ss = null)
    {
        // Keep it as an array to read data safely or handle objects
        $d = (array) $arr;
        $id = (int) ($d['id'] ?? 1);

        // Convert inputs to a clean array for Laravel's query builder
        $inputs = $d;

        // Remove 'id' from the update payload so it doesn't cause SQL update errors
        unset($inputs['id']);

        \Log::info(json_encode($inputs));

        if ($id <= 0) {
            return DV::error('Invalid invoice setting.');
        }

        DB::beginTransaction();

        try {
            // 1. Verify the invoice exists
            $InvocieSetting = DB::table('invoice_settings')->where('id', $id)->first();
            if (!$InvocieSetting) {
                throw new \Exception('Invoice setting not found.');
            }

            // 2. Update database records (Passing the clean array now)
            DB::table('invoice_settings')
                ->where('id', $id)
                ->update($inputs);

            DB::commit();

            // 3. FIX: Cast or format directly to a raw array so your JDV wrapper doesn't serialize framework properties
            return [
                'id' => $id,
                'show_baland' =>  $inputs['show_baland'] ?? $InvocieSetting->show_baland,
                'show_comm_tax' => $inputs['show_comm_tax'] ?? $InvocieSetting->show_comm_tax,
                'show_pay_status' => $inputs['show_pay_status'] ?? $InvocieSetting->show_pay_status,
                'show_amount_paid' => $inputs['show_amount_paid'] ?? $InvocieSetting->show_amount_paid,
                
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to update invoice display settings: ' . $e->getMessage());
        }
    }

    public function getToglleButton($arr, $ss)
    {
        $d = (array) $arr;
        
        // Default to 1 if no id is provided in the payload
        $id = (int) ($d['id'] ?? 1);

        if ($id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        // FIX: Use the dynamic $id variable instead of hardcoded 1
        $setting = DB::table($this->table)
            ->where('id', $id)
            ->first();

        if (!$setting) {
            return DV::error('Invoice settings not found!');
        }

        // Return a clean raw array to feed nicely into your JDV controller wrapper
        return [
            'show_baland'      => (int) $setting->show_baland,
            'show_comm_tax'    => (int) $setting->show_comm_tax,
            'show_pay_status'  => (int) $setting->show_pay_status,
            'show_amount_paid' => (int) $setting->show_amount_paid,
        ];
    }
}
