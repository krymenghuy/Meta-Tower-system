<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Vsd\Response\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Database\DBX;
use Vsd\Storage\PublicStorage as XPublicStorage;
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

    $remark_char = ['@', '.', '-', '_'];
    $ref_no_char = ['@', '.', '-', '_'];

    $v_rule = [
        'vendor_id'       => '1|number|exists=vendors.id',
        'bill_date'       => '1|date',
        'due_date'        => '1|date',
        'ref_no'          => '1|string|0-25',
        'expense_type_id' => '1|number|exists=expense_categories.id|Please select category.',
        'total_amount'    => '1|number|min=0',
        'remark'          => '0|string|0-255',
        'photo'           => '0|string',
        'ext'             => '0|string|in=jpg,jpeg,png',
    ];

    $res = DBX::validateObject($arr,$v_rule,1,['photo'  => GeneralSettings::$image_chars,'remark' => $remark_char,'ref_no' => $ref_no_char],$ss->lang);
    if ($res->error) return DV::error($res->error);
    $inputs = $res->values;

    $photo = $inputs['photo'] ?? null;
    $ext   = $inputs['ext'] ?? null;

    $billDate = strtotime($inputs['bill_date']);
    $dueDate  = strtotime($inputs['due_date']);

    if ($dueDate < $billDate) {
        return DV::error('Due date cannot be before invoice date.');
    }
    unset($inputs['photo'], $inputs['ext']);
    $total = floatval($inputs['total_amount'] ?? 0);
    if ($total < 0 ){
        return  DV::error ('Total amount cannot be negative.');
    }

    $inputs['total_amount'] = $total;
    $inputs['paid_amount']  = 0;
    $inputs['balance']      = $total;
    if (!empty($inputs['bill_number'])) {
        $exists = DB::table('bills')
            ->where('bill_number', $inputs['bill_number'])
            ->when($id, fn($q) => $q->where('id', '<>', $id))
            ->exists();

        if ($exists) {
            return DV::error('Bill number already exists');
        }
    }

    if(!empty($inputs{'ref_no'})) {
        $exists = DB::table('bills') 
            ->where('ref_no', $inputs['ref_no'])
            ->when($id, fn($q) => $q->where('id', '<>', $id))
            ->exists ();

        if ($exists) {
            return DV::error('Reference number already exists.');
        }
    }
    
    DB::beginTransaction();
    try {

        $created = !$id;
        $id = DBX::saveData($ss, 'bills', ['id' => $id], $inputs);
        if (!$id) {
            DB::rollBack();
            return DV::error('Error saving bill');
        }
        if ($created) {
            setOfficialBillNumber($branch_id,'bill_code_control','bills',['id' => $id],'B-',5);
        }
        if ($photo && $ext) {
            $old_file = DB::table('bills')->where('id', $id)->value('file_image');
            if ($old_file) {
                XPublicStorage::delete([
                    'subs_id' => $ss->subs_id,
                    'dir'     => self::$img_dir
                ], 'images', $old_file);
            }
            $photo = preg_replace('#^data:.*;base64,#', '', $photo);
            $file = XPublicStorage::savefile(
                ['subs_id' => $ss->subs_id, 'dir' => self::$img_dir],
                $ext,
                $photo,
                'image'
            );

            if ($file->status === 'Error') {
                DB::rollBack();
                return DV::error($file->error_message);
            }

            if (!empty($file->file_name)) {
                DB::table('bills')
                    ->where('id', $id)
                    ->update(['file_image' => $file->file_name]);

                $inputs['file_image'] = $file->file_name;
            }
        }

        DB::commit();

        return DV::depends(1, ['bills' => $inputs, 'id' => $id]);

    } catch (\Exception $e) {
        DB::rollBack();
        return DV::error($e->getMessage());
    }
}

   
    public function getListBill($arr = [], $ss = null)
    {   
        $d  = (object) $arr;
        $search_value = $d->search_value ?? null;
        $vendor_id    = $d->vendor_id    ?? null;
        $status_id    = $d->status_id    ?? null;
        $expense_type_id    = $d->expense_type_id    ?? null;
        $start_date = $d->bill_date_start ?? null;
        $end_date   = $d->bill_date_end ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page     ?? 10;

        if(!is_numeric($current_page)){ $current_page = 1; }

        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = "2=2";

        if ($search_value) {
            $skip_rows    = 0;
            $search_value = escape_like_str($search_value);
            $str_search   = "(b.bill_number LIKE '%" . $search_value ."%' OR b.ref_no LIKE '%" . $search_value ."%' OR v.name LIKE '%" . $search_value ."%')";
        }else{
            if ($start_date) {
                $start_date = date('Y-m-d', strtotime($start_date));
                $str_moreWhere .= " AND b.bill_date >= '$start_date'";
            }

            if ($end_date) {
                $end_date = date('Y-m-d', strtotime($end_date));
                $str_moreWhere .= " AND b.bill_date <= '$end_date'";
            }
            if ($vendor_id) {
                $str_moreWhere .= ' AND b.vendor_id = ' . $vendor_id;
            }

            if ($status_id) {
                $str_moreWhere .= ' AND b.status_id = ' . $status_id;
            }
            if ($expense_type_id) {
                $str_moreWhere .= ' AND b.expense_type_id = ' . $expense_type_id;
            }
        }
        
        

        $query = DB::table('bills as b')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->leftJoin('bill_statuses as s', 's.id', 'b.status_id')
            ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw("b.id, b.bill_number, b.ref_no, b.expense_type_id,ex.name as expense_type_name,b.vendor_id,v.name as vendor_name, v.phone_number, b.bill_date,b.due_date,
                b.total_amount, b.balance, b.paid_amount,b.status_id, s.name as status,b.file_image, b.update_user, b.remark, b.updated_at")
            ->orderBy('b.id', 'desc');
        $count = (clone $query)->count('b.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $processed = setOfficialDates($row, ['bill_date','due_date'], ['updated_at'], []);
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
            ->selectRaw('b.id, b.bill_number, b.ref_no, b.vendor_id, v.name as vendor_name,b.expense_type_id, ex.name as expense_type_name, v.phone_number, b.bill_date,b.due_date, b.file_image, b.total_amount, b.balance, b.paid_amount, b.status_id, b.remark')
            ->first();
        if ($row) {
            $row->file_image_url = self::getBillImageUrl($row->file_image, $ss);
            $processed = setOfficialDates($row, ['bill_date','due_date'], ['updated_at'], []);
            if ($processed) $row = $processed;
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
        $id = $id ?? $this->id;
        $paid = DB::table('bills')->select('id', 'status_id','paid_amount')->where('id', $id)->first();
        if (!$paid) {
            return DV::error('Bill not found.');
        }
        $is_paid = ($paid->paid_amount > 0 || $paid->status_id > 1);
        if($is_paid) return DV::error('Cannot delete paid invoice');
        $deleted = DB::table('bills')->where('id', $id)->delete();
        if (!$deleted) {
            return DV::error('Delete failed.');
        }
        return DV::depends($deleted, ['action' => 'deleted']);
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
            // 'pdf'  => 'application/pdf',
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