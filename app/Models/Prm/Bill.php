<?php

namespace App\Models\Prm;
use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;
use Log;


class Bill //extends Model
{

    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'bills';
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }

    public function saveBill($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'bill_number'       => '0|string|1-100',
            'purchase_order_id' => '0|number|exists=purchase_orders.id',
            'vendor_id'         => '1|number|exists=vendors.id',
            'bill_date'         => '1|date',
            // 'due_date'          => '0|date',
            'file_image'        => '0|string|0-255',
            'total_amount'         => '1|number|min=0',
            'balance'        => '0|number|min=0',
            'paid_amount'       => '1|number|min=0',
            'remark'            => '0|string|0-255',
        ];

        $email_char = ['@', '.', '-', '_'];
        $remark_char = ['@', ',', '.', '#'];
        $tax_char = ['@', '.', '-', '_'];

        $res = DBX::validateObject($arr, $v_rule, 1, ['email' => $email_char, 'tax_number' => $tax_char, 'remark' => $remark_char], $ss->lang, 0, null);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;

        $total    = floatval($inputs['total_amount'] ?? 0);
        $paid     = floatval($inputs['paid_amount']  ?? 0);

        // Paid cannot exceed total
        $safe_paid = min($paid, $total);
        $balance   = max(0, $total - $safe_paid);

        // Set calculated values back
        $inputs['paid_amount']   = $safe_paid;
        $inputs['balance']       = $balance;
        $inputs['total_amount']  = $total;

        // Also set payment_status based on amounts
        if ($total > 0 && $safe_paid >= $total) {
            $inputs['status_id'] = 1; // Paid
        } elseif ($safe_paid > 0 && $safe_paid < $total) {
            $inputs['status_id'] = 3; // Partially Paid
        } else {
        $inputs['status_id'] = 2; // Unpaid
        }
        if (request()->hasFile('file_image')) {
        $file = request()->file('file_image');
        $path = $file->store('bills', 'public'); // saves to storage/app/public/bills/
        $inputs['file_image'] = $path;
    }
        $exist = DB::table('bills')
            ->where('vendor_id', $inputs['vendor_id'])
            ->whereRaw('LOWER(bill_number) = ?', [strtolower($inputs['bill_number'])])
            ->when($id, function ($q) use ($id) {
                // If editing an existing bill, ignore its own ID
                $q->where('id', '<>', $id);
            })
            ->exists();

        if ($exist) {
            return DV::error('This Bill Number has already been recorded for this Vendor!');
        }

        $id = DBX::saveData($ss, 'bills', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            return DV::depends(1, ['bills' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving bill record!');
    }

   public function getListBill($arr = [], $ss = null)
{
    $d = (object) $arr;
    $search_value = $d->search_value ?? null;
    $purchase_order_id    = $d->purchase_order_id ?? null;
    $status_id    = $d->status_id ?? null;
    $current_page = $d->current_page ?? 1;
    $per_page     = $d->per_page ?? 10;

    if (!is_numeric($current_page) || !is_numeric($per_page)) {
        return null;
    }

    $skip_rows = ($current_page - 1) * $per_page;
    $str_search = "1=1";
    $str_moreWhere = "2=2";

    if ($search_value) {
        $skip_rows = 0;
        $search_value = escape_like_str($search_value);
        
        $str_search = "(v.name Like '%" . $search_value . "%' OR b.bill_number Like '%" . $search_value . "%' OR b.grand_total Like '%" . $search_value . "%')";
    }   
    if ($purchase_order_id) {
        $str_moreWhere .= ' AND b.purchase_order_id =' . $purchase_order_id;
    }  
    if ($status_id) {
        $str_moreWhere .= ' AND b.status_id =' . $status_id;
    }
      
    $query = DB::table('bills as b')
        ->leftJoin('purchase_orders as po', 'po.id', 'b.purchase_order_id')
        ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')            
        ->leftJoin('bill_statuses as s', 's.id', 'b.status_id')            
        ->whereRaw($str_search)
        ->whereRaw($str_moreWhere)
        ->selectRaw("b.id, b.bill_number, b.purchase_order_id, b.vendor_id,v.name as vendor_name, v.phone_number,b.bill_date, b.total_amount, b.balance, b.paid_amount,
                 b.status_id, s.name as status,b.file_image, b.update_user, b.remark, b.updated_at")
        ->orderBy('b.id', 'desc');
    $clone_query = clone $query;
    $count = $clone_query->count('b.id');
    $rows = $query->skip($skip_rows)->take($per_page)->get();
    foreach($rows as $row){
            $row = setOfficialDates($row,['updated_at', 'bill_date'],[],[]);
        }
    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
}
    public static function billDetails($id, $ss = null)
    {
        return DB::table('bills as b')
            ->leftJoin('purchase_orders as po', 'po.id', 'b.purchase_order_id')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->where('b.id', $id)
            ->selectRaw('b.id,b.bill_number,b.purchase_order_id,po.vendor_id,v.name as vendor_name,v.phone_number,b.bill_date,b.file_image,b.total_amount,b.balance,b.paid_amount,b.status_id,b.remark')
            ->first();
    }
    public static function getFormOptions($id = null, $ss = null)
    {
        $bill_details = $id ? self::billDetails($id, $ss) : null;
        return (object) [
            'bill_details' => $bill_details,
            'vendors'      => GeneralSettings::options_vendor($ss),
            'statuses' => GeneralSettings::options_bill_statuses($ss),
        ];
    }

    public function deleteBill($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $bill = DB::table('bills')->select('id', 'status_id')->where('id', $id)->first();
        if (!$bill) {
            return DV::error('Bill not found.');
        }
        if ($bill->status_id == 2) {
            return DV::error('Cannot delete unpaid bill.');
        }
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
            ->select('id', 'name', 'code', 'tax_number', 'address', 'phone_number')->first();
        // $spaces = $this->getActiveSpaces($id,$ss);
        return (object) [
            'vendor' => $vendor,
            // 'spaces'=>$spaces
        ];
    }
    function updateBillStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('bills')->where('id', $id)->value('status_id');
        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status.');
        }
        $x = DB::table('bills')->where('id', $id)->update([
            'status_id' => $status_id,
            'update_user' => $ss->full_name,
            'updated_at' => getNowTime(),
        ]);
        return DV::depends($x, ['Bill status', 'updated']);
    }

}
