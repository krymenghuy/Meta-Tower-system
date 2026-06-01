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


    public function updateToglleButton($arr, $ss)
    {
        $d = (object) $arr;
        $id = (int) ($d->id ?? 0);

        if ($id <= 0) {
            return DV::error('Invalid invoice setting.');
        }

        DB::beginTransaction();

        try {
            // 1. Verify the invoice exists
            $InvocieSetting = DB::table('invoice_settings')->where('id', 1)->first();
            if (!$InvocieSetting) {
                throw new \Exception('Invoice setting not found.');
            }

            // 2. Map toggle fields from request, fallback to existing DB values (Notice '_piad')
            $updateData = [
                'show_baland'      => isset($d->show_baland)      ? (int) $d->show_baland      : $InvocieSetting->show_baland,
                'show_comm_tax'    => isset($d->show_comm_tax)    ? (int) $d->show_comm_tax    : $InvocieSetting->show_comm_tax,
                'show_pay_status'  => isset($d->show_pay_status)  ? (int) $d->show_pay_status  : $InvocieSetting->show_pay_status,
                'show_amount_paid' => isset($d->show_amount_paid) ? (int) $d->show_amount_paid : $InvocieSetting->show_amount_paid, // Fixed DB key here
                'updated_at'       => now(),
            ];

            // 3. Update database records
            DB::table('invoice_settings')
                ->where('id', 1)
                ->update($updateData);

            DB::commit();

            // 4. Return the newly saved visibility states to the frontend (Keeping frontend keys clean)
            return DV::depends(1, [
                'id' => $id,
                'settings' => [
                    'show_baland'      => (int) $updateData['show_baland'],
                    'show_comm_tax'    => (int) $updateData['show_comm_tax'],
                    'show_pay_status'  => (int) $updateData['show_pay_status'],
                    'show_amount_paid' => (int) $updateData['show_amount_paid'], // Maps internal '_piad' back to clean '_paid' for your frontend
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to update invoice display settings: ' . $e->getMessage());
        }
    }

    // public function getToglleButton($arr, $ss)
    // {
    //     $d = (object) $arr;
    //     $id = (int) ($d->id ?? 0);

    //     if ($id <= 0) {
    //         return DV::error('Invalid invoice ID.');
    //     }

    //     DB::beginTransaction();

    //     try {
    //         // 1. Verify the invoice exists
    //         $invoice = DB::table('invoice_settings')->where('id', $id)->first();
    //         if (!$invoice) {
    //             throw new \Exception('Invoice not found.');
    //         }
    //         // 4. Return the newly saved visibility states to the frontend (Keeping frontend keys clean)
    //         return DV::depends(1, [
    //             'id' => $id,    
    //             'settings' => [
    //                 'show_baland'      => (int) $invoice->show_baland,
    //                 'show_comm_tax'    => (int) $invoice->show_comm_tax,
    //                 'show_pay_status'  => (int) $invoice->show_pay_status,
    //                 'show_amount_paid' => (int) $invoice->show_amount_paid,
    //             ]
    //         ]);

    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return DV::error('Failed to update invoice display settings: ' . $e->getMessage());
    //     }
    // }





   
}

