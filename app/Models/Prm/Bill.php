<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use Log;

class Bill
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'bills';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public static function getBillImageUrl($filename, $ss)
    {
        if (!$filename) return null;
        return XPublicStorage::getUrl(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images') . $filename;
    }

    public function saveBill($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id; 
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'bill_number'  => '0|string|max=50',
            'expense_type_id'  => '1|number|exists=expense_categories.id',
            'ref_no'    => '0|number',
            'vendor_id'    => '1|number|exists=vendors.id',
            'bill_date'    => '1|date',
            'file_image'   => '0|string|0-255',
            'total_amount' => '1|number|min=0',
            'balance'      => '0|number|min=0',
            'paid_amount'  => '0|number|min=0',
            'remark'       => '0|string|0-255',
            'photo'        => '0|string',
            'ext'          => '0|string',
        ];

        $remark_char      = ['@', '.', '-', '_'];
        $bill_number_char = ['@', '.', '-', '_'];
        $res = DBX::validateObject($arr, $v_rule, 1,['photo' => GeneralSettings::$image_chars,'remark' => $remark_char,'bill_number' => $bill_number_char,'po_number' => $bill_number_char ],$ss->lang, 0, null);

        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;

        $photo = $inputs['photo'] ?? null;
        $ext   = $inputs['ext']   ?? null;

        unset($inputs['photo']);
        unset($inputs['ext']);
        unset($inputs['file_image']);

        $total     = floatval($inputs['total_amount'] ?? 0);
        $paid      = floatval($inputs['paid_amount']  ?? 0);
        $safe_paid = min($paid, $total);
        $balance   = max(0, $total - $safe_paid);

        $inputs['paid_amount']  = $safe_paid;
        $inputs['balance']      = $balance;
        $inputs['total_amount'] = $total;

        if ($total > 0 && $safe_paid >= $total) {
            $inputs['status_id'] = 2;
        } elseif ($safe_paid > 0 && $safe_paid < $total) {
            $inputs['status_id'] = 3;
        } else {
            $inputs['status_id'] = 1;
        }

        if (!empty($inputs['bill_number'])) {
            $exists = DB::table('bills')
                ->where('bill_number', $inputs['bill_number'])
                ->when($id, fn($q) => $q->where('id', '<>', $id))
                ->exists();

            if ($exists)
                return DV::error('Create failed: This bill number already exists');
        }

        if (!$id && empty($inputs['bill_number'])) {
            $branch_id = $ss->branch_id ?? null;
            $inputs['bill_number'] = self::createBillNumber($branch_id);
        }

        $id = DBX::saveData($ss, 'bills', ['id' => $id], $inputs, [], 1);

        if (!$id || $id <= 0) {
            return DV::error('Error saving bill record!');
        }

        // Handle photo upload
        if ($photo && $ext) {

            $old_file = DB::table('bills')->where('id', $id)->value('file_image');
            if ($old_file) {
                XPublicStorage::delete([
                    'branch_id' => null,
                    'subs_id'   => $ss->subs_id,
                    'dir'       => self::$img_dir
                ], 'images', $old_file);
            }

            $photo = preg_replace('#^data:.*;base64,#', '', $photo);

            $file_res = XPublicStorage::savefile(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $ext,
                $photo,
                'image'   
            );

            if ($file_res->status === 'Error') {
                return DV::error($file_res->error_message);
            }

            \Log::info('Bill file saved: ' . ($file_res->file_name ?? 'NULL'));

            if (!empty($file_res->file_name)) {
                DB::table('bills')->where('id', $id)->update(['file_image' => $file_res->file_name]);

                $inputs['file_image'] = $file_res->file_name;
            }
        }

        return DV::depends(1, ['bills' => $inputs, 'id' => $id]);
    }

    function createBillNumber($branch_id)
    {
        $prefix     = 'B';
        $fullPrefix = $prefix  ;

        $row = DB::table('bill_code_control')
            ->where('branch_id', $branch_id)
            ->where('prefix', $fullPrefix)
            ->first();

        $next_num   = $row ? ($row->last_id + 1) : 1;
        $billNumber = $fullPrefix . '-' . str_pad($next_num, 5, '0', STR_PAD_LEFT);

        if ($row) {
            DB::table('bill_code_control')
                ->where('branch_id', $branch_id)
                ->where('prefix', $fullPrefix)
                ->update(['last_id' => $next_num]);
        } else {
            DB::table('bill_code_control')
                ->insert([
                    'branch_id' => $branch_id,
                    'prefix'    => $fullPrefix,
                    'last_id'   => $next_num,
                ]);
        }

        return $billNumber;
    }
    public function getListBill($arr = [], $ss = null)
    {   
        $d  = (object) $arr;
        $search_value = $d->search_value ?? null;
        $vendor_id    = $d->vendor_id    ?? null;
        $status_id    = $d->status_id    ?? null;
        $expense_type_id    = $d->expense_type_id    ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page     ?? 10;

        if(!is_numeric($current_page)){ $current_page = 1; }

        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        $str_moreWhere = '2=2';

        if ($search_value) {
            $skip_rows    = 0;
            $search_value = escape_like_str($search_value);
            $str_search   = "(v.name LIKE '%" . $search_value ."%' OR b.bill_number LIKE '%" . $search_value ."%')";
        }

        if ($vendor_id) {
            $str_moreWhere .= ' AND b.vendor_id = ' . $vendor_id;
        }

        if ($status_id) {
            $str_moreWhere .= ' AND b.status_id = ' . $status_id;
        }
        if ($expense_type_id) {
            $str_moreWhere .= ' AND b.expense_type_id = ' . $expenese_type_id;
        }

        $query = DB::table('bills as b')
            // ->leftJoin('purchase_orders as po', 'po.id', 'b.po_number')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->leftJoin('bill_statuses as s', 's.id', 'b.status_id')
            ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id')
            ->whereRaw($str_moreWhere)
            // ->where('b.status_id', '!=', 2)
            ->selectRaw("b.id, b.bill_number, b.ref_no, b.expense_type_id,ex.name as expense_type_name,b.vendor_id,v.name as vendor_name, v.phone_number, b.bill_date,
                b.total_amount, b.balance, b.paid_amount,b.status_id, s.name as status,b.file_image, b.update_user, b.remark, b.updated_at")
            ->orderBy('b.id', 'desc');
        $count = (clone $query)->count('b.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $processed = setOfficialDates($row, ['updated_at', 'bill_date'], [], []);
            if ($processed) $row = $processed;

            $row->image_url = self::getBillImageUrl($row->file_image, $ss);
        }
        unset($row);

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function billDetails($id, $ss = null)
    {
        $row = DB::table('bills as b')
            // ->leftJoin('purchase_orders as po', 'po.id', 'b.po_number')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id') 
            ->where('b.id', $id)
            ->selectRaw('b.id, b.bill_number, b.ref_no, b.vendor_id, v.name as vendor_name,b.expense_type_id, ex.name as expense_type_name, v.phone_number, b.bill_date, b.file_image, b.total_amount, b.balance, b.paid_amount, b.status_id, b.remark')
            ->first();
        if ($row) {
            $row->file_image_url = self::getBillImageUrl($row->file_image, $ss);
        }
        return $row;
    }

    public static function getFormOptions($id = null, $ss = null)
    {
        $bill_details = $id ? self::billDetails($id, $ss) : null;

        return (object) [
            'bill_details' => $bill_details,
            'vendors'      => GeneralSettings::options_vendor($ss),
            'bill_statuses'  => GeneralSettings::options_bill_statuses($ss),
            'expense_types' => GeneralSettings::options_expense_categories($ss),
        ];
    }

    public function deleteBill($id = null, $ss = null)
    {
        $id   = $id ?? $this->id;
        $bill = DB::table('bills')->select('id', 'status_id')->where('id', $id)->first();

        if (!$bill) return DV::error('Bill not found.');
        if ($bill->status_id == 2) return DV::error('Cannot delete unpaid bill.');

        $deleted = DB::table('bills')->where('id', $id)->delete();

        return $deleted
            ? DV::depends($deleted, ['action' => 'deleted'])
            : DV::error('Delete failed.');
    }

    public function getVendorInfo($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $vendor = DB::table('vendors')
            ->where('id', $id)
            ->select('id', 'name', 'code', 'tax_number', 'address', 'phone_number')
            ->first();

        return (object) ['vendor' => $vendor];
    }

    public function updateBillStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $currentStatus = DB::table('bills')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) return DV::error('It is the same current status.');

        $x = DB::table('bills')->where('id', $id)->update([
            'status_id'   => $status_id,
            'update_user' => $ss->full_name,
            'updated_at'  => getNowTime(),
        ]);

        return DV::depends($x, ['Bill status', 'updated']);
    }
    public function viewBillAttachment($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $bill = DB::table('bills')
            ->where('id', $id)
            ->select('id', 'file_image')
            ->first();

        if (!$bill) return DV::error('Bill not found.');
        if (!$bill->file_image) return DV::error('No attachment found for this bill.');


        $fileUrl = XPublicStorage::getUrl(
            ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 
            'images'
        ) . $bill->file_image;

        $ext      = strtolower(pathinfo($bill->file_image, PATHINFO_EXTENSION));
        $mimeTypes = [
            'gif'  => 'image/gif',
            'png'  => 'image/png',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'pdf'  => 'application/pdf',
        ];
        $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';

        return DV::depends(1, [
            'data_url'  => $fileUrl,
            'file_name' => $bill->file_image,
            'ext'       => $ext,
            'mime_type' => $mimeType,
        ]);
    }

}