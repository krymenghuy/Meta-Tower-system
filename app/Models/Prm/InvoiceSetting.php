<?php

namespace App\Models\Prm;

use DBX;
use DV;
use XPublicStorage;
use Illuminate\Support\Facades\DB;
use Vsd\Vsloquent\VSModel;

class InvoiceSetting extends VSModel
{
    protected $table    = 'invoice_settings';
    protected $userInfo = null;
    protected static $img_dir = 'invoice_settings';
    protected static $allowed_image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

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

    // public function getExchangeRate($id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;

    //     $setting = DB::table($this->table)->where('id', 1)->first();

    //     if (!$setting) {
    //         return DV::error('Invoice settings not found!');
    //     }

    //     return [
    //         'exchange_rate' => $setting->exchange_rate ?? '0.00',
    //     ];
    // }

    public function getExchangeRate($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $setting = DB::table($this->table)
            ->find(1);

        return DV::depends(1, [
            'exchange_rate'   => $setting?->exchange_rate ?? 0,
            'warning_message' => $setting ? null : 'Exchange rate not found!',
        ]);
    }





    // public function  getInvoiceSetting($id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;

    //     $mimeTypes = [
    //         'pdf'  => 'application/pdf',
    //         'png'  => 'image/png',
    //         'jpg'  => 'image/jpeg',
    //         'jpeg' => 'image/jpeg',
    //         'gif'  => 'image/gif',
    //         'webp' => 'image/webp',
    //     ];

    //     $setting = DB::table($this->table)->where('id', 1)->first();

    //     if (!$setting) {
    //         return DV::error('Invoice settings not found!');
    //     }

    //     $file = XPublicStorage::getUrl(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image') . $setting->qr_file_name;
    //     $cleanPath = str_replace('\\', '/', $file);

    //     $extension = strtolower(pathinfo($setting->qr_file_name, PATHINFO_EXTENSION));
    //     $file_type = $mimeTypes[$extension] ?? null;

    //     return [
    //         'show_balance' => $setting->show_balance,
    //         'show_comm_tax' => $setting->show_comm_tax,
    //         'show_pmt_status' => $setting->show_pmt_status,
    //         'show_amount_paid' => $setting->show_amount_paid,
    //         'exchange_rate' => $setting->exchange_rate ?? '0.00',
    //         'qr_file_name'           => $setting->qr_file_name,
    //         'QR_file_type'              => $file_type,
    //         'QR_file'              => $cleanPath,
    //         'show_sign'        => (int) $setting->show_sign,
    //     ];
    // }


    public function getInvoiceSetting($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $mimeTypes = [
            'pdf'  => 'application/pdf',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif'  => 'image/gif',
            'webp' => 'image/webp',
        ];

        $setting = DB::table($this->table)->where('id', 1)->first();

        // if (!$setting) {
        //     return DV::error('Invoice settings not found!');
        // }

        $qr_filename = $setting->qr_file_name ?? null;
        $file_type = null;
        if($qr_filename){
            $file = XPublicStorage::getUrl(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image') . $setting->qr_file_name;
            $cleanPath = str_replace('\\', '/', $file);

            $extension = strtolower(pathinfo($setting->qr_file_name, PATHINFO_EXTENSION));
            $file_type = $mimeTypes[$extension] ?? null;
        }  
      

        return [
            'show_balance' => $setting->show_balance ?? 1,
            'show_comm_tax' => $setting->show_comm_tax ?? 0,
            'show_pmt_status' => $setting->show_pmt_status ?? 1,
            'show_amount_paid' => $setting->show_amount_paid ?? 1,
            'exchange_rate' => $setting->exchange_rate ?? 0,
            'build_representative' => $setting->build_representative ?? '',
            'representative_phone' => $setting->representative_phone ?? '',
            'representative_address' => $setting->representative_address ?? '',
            'qr_file_name'           => $setting->qr_file_name ?? '',
            'QR_file_type'              => $file_type,
            'QR_file'              => $cleanPath ?? '',
            'show_sign'        => (int) ($setting? $setting->show_sign : 0), //show be show_logo 
        ];
    }


    public function updateToglleButton($arr = [], $ss = null)
    {
        $d = (array) $arr;
        $id = (int) ($d['id'] ?? 1);
        $inputs = $d;

        unset($inputs['id']);

        if ($id <= 0) {
            return DV::error('Invalid invoice setting.');
        }

        DB::beginTransaction();
        try {
            $InvocieSetting = DB::table('invoice_settings')->where('id', $id)->first();
            if (!$InvocieSetting) {
                throw new \Exception('Invoice setting not found.');
            }

            DB::table('invoice_settings')->where('id', $id)->update($inputs);
            DB::commit();

            return [
                'id' => $id,
                'show_balance'     =>  $inputs['show_balance'] ?? $InvocieSetting->show_balance,
                'show_comm_tax'    =>  $inputs['show_comm_tax'] ?? $InvocieSetting->show_comm_tax,
                'show_pmt_status'  =>  $inputs['show_pmt_status'] ?? $InvocieSetting->show_pmt_status,
                'show_amount_paid' =>  $inputs['show_amount_paid'] ?? $InvocieSetting->show_amount_paid,
                'show_sign'        =>  $inputs['show_sign'] ?? $InvocieSetting->show_sign,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to update invoice display settings: ' . $e->getMessage());
        }
    }

    public function getToglleButton($arr, $ss)
    {
        $d = (array) $arr;
        $id = (int) ($d['id'] ?? 1);

        if ($id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        $setting = DB::table($this->table)->where('id', $id)->first();
        if (!$setting) {
            return DV::error('Invoice settings not found!');
        }

        return [
            'show_balance'     => (int) $setting->show_balance,
            'show_comm_tax'    => (int) $setting->show_comm_tax,
            'show_pmt_status'  => (int) $setting->show_pmt_status,
            'show_amount_paid' => (int) $setting->show_amount_paid,
            'show_sign'        => (int) $setting->show_sign,
        ];
    }

    // public function saveInvoiceSettingRepresentative($arr = [], $id = null, $ss = null)
    // {
    //     if (is_object($id) && is_null($ss)) {
    //         $ss = $id;
    //         $id = null;
    //     }

    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;
    //     $lang = ($ss && isset($ss->lang)) ? $ss->lang : 'en';

    //     $v_rule = [
    //         'build_representative' => '0|string|1-200',
    //         'representative_phone' => '0|string|1-20',
    //         'representative_address' => '0|string|1-200',
    //     ];
    //     $address_char = ['@', ',', '.', '#'];
    //     $res = DBX::validateObject($arr, $v_rule, 1, ['representative_address' => $address_char], $lang, 0, null);
    //     if ($res->error) {
    //         return DV::error($res->error);
    //     }

    //     $inputs = $res->values;

    //     $resSave = DBX::saveData($ss, $this->table, ['id' => 1], $inputs, [], 1);
    //     if (!$resSave) {
    //         return DV::error('Error saving invoice setting!');
    //     }
    //     return [
    //         'id' => $id,
    //         'build_representative' =>  $inputs['build_representative'] ?? null,
    //         'representative_phone' =>  $inputs['representative_phone'] ?? null,
    //         'representative_address' =>  $inputs['representative_address'] ?? null
    //     ];
    // }

    // public function getInvoiceBuildingInfo($arr = [], $ss = null)
    // {
    //     $d = (array) $arr;
    //     $id = (int) ($d['id'] ?? $this->id ?? 1);

    //     $info = DB::table('invoice_setting_info')->where('id', $id)->first();

    //     if (!$info && $id !== 1) {
    //         $info = DB::table('invoice_setting_info')->where('id', 1)->first();
    //     }

    //     return [
    //         'id'                  => $info ? (int)$info->id : 0,
    //         'build_name'          => $info->build_name ?? '',
    //         'build_email'         => $info->build_email ?? '',
    //         'build_phone'         => $info->build_phone ?? '',
    //         'build_address'         => $info->build_address ?? '',
    //         'build_representative' => $info->build_representative ?? '',
    //         'build_title_type'    => $info->build_title_type ?? '',
    //     ];
    // }

    


    public function saveQR($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $arr['id'] ?? $this->id ?? 1;
        $ss = $ss ?? $this->userInfo;

        $lang = ($ss && isset($ss->lang)) ? $ss->lang : 'en';

        $v_rule = [
            'id'           => '0|number',
            'qr_file_name' => '0|string',
            'ext'          => '0|string',
            'data'         => '0|string',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, ['data' => GeneralSettings::$image_chars], $lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs   = $res->values;


        \Log::info('saveQR input: ' . json_encode([
            "id" => $id,
            "ext" => $inputs['ext'],
            'qr_file_name' => $arr['qr_file_name'] ?? 'MISSING',
        ]));


        if ($inputs['data']) {
            $ext = $inputs['ext'];
            // ✅ Allow both images AND pdf
            $allAllowed = array_merge(self::$allowed_image_extensions, ['pdf']);
            if (!in_array($ext, $allAllowed, true)) {
                return DV::error('Invalid file type. Allowed: ' . implode(', ', $allAllowed));
            }

            $base64 = preg_replace('#^data:.*;base64,#', '', $inputs['data']);


            $resFile = XPublicStorage::savefile(
                ['subs_id' => $ss->subs_id ?? null, 'dir' => self::$img_dir],
                $ext,       // 2nd: extension
                $base64,      // 3rd: base64 data
                'image',
                $inputs['qr_file_name']   // 5th: original file name
            );

            if ($resFile->status === 'Error') {
                return DV::error($resFile->error_message);
            }

            $inputs['qr_file_name'] = $resFile->file_name;
        } else {
            // ✅ No new file uploaded — preserve existing DB values
            $existingRow = DB::table($this->table)->where('id', $id)->first();
            $inputs['qr_file_name'] = $arr['qr_file_name'] ?? $existingRow->qr_file_name ?? null;
        }

        unset($inputs['data'], $inputs['id'], $inputs['ext']);

        $savedId = DBX::saveData($ss, $this->table, ['id' => $id], $inputs, [], 1);

        return DV::depends($savedId, [$this->table => $inputs, 'id' => $savedId]);
    }

    public function deleteQR($id = null, $ss = null)
    {
        $id = $id ?? $this->id ?? 1;
        $ss = $ss ?? $this->userInfo;

        \Log::info('deleteQR called: ' . json_encode([
            'id'      => $id,
            'subs_id' => $ss->subs_id ?? 'MISSING',
        ]));

        $setting = DB::table($this->table)->where('id', $id)->first();

        if (!$setting) {
            return DV::error('Invoice setting not found.');
        }

        if (empty($setting->qr_file_name)) {
            return DV::error('No QR file to delete.');
        }

        $file_name = $setting->qr_file_name;
        $ext       = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $category  = ($ext === 'pdf') ? 'document' : 'image';

        \Log::info('deleteQR file: ' . json_encode([
            'file_name' => $file_name,
            'ext'       => $ext,
            'category'  => $category,
        ]));

        try {
            $res = XPublicStorage::delete(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $category,
                $file_name
            );
            \Log::info('deleteQR storage res: ' . json_encode($res));
        } catch (\Throwable $e) {
            \Log::error('deleteQR XPublicStorage::delete failed: ' . $e->getMessage());
            return DV::error('Storage delete failed: ' . $e->getMessage());
        }

        if ($res === "File not found for deleting") {
            return DV::error('Physical file not found for deleting.');
        }

        // ✅ Only clear QR fields — do NOT delete the entire row
        DB::table($this->table)->where('id', $id)->update([
            'qr_file_name' => null,
            'qr_file_path' => null,
        ]);

        return DV::depends(1, ['action' => 'deleted', 'id' => $id]);
    }
}
