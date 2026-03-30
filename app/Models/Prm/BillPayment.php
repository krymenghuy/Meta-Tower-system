<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use XPublicStorage;
use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class BillPayment
{
    protected $id       = null;
    protected $userInfo = null;

    public function savePayment(array $arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'bill_id'        => '1|number|exists=bills.id',
            'payment_date'   => '1|date',
            'amount'         => '1|number|min=0.01',
            'total_amount'         => '1|number|min=0.01|exists=bills.total_amount',
            'paid_amount'         => '1|number|min=0.01|exists=bills.paid_amountgit',
            'payment_method' => '0|string|0-50',
            'ref_no'         => '0|string|0-100',
            'note'           => '0|string|0-255',
        ];

        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);

        $inputs  = $res->values;
        $bill_id = $inputs['bill_id'];

        $bill = DB::table('bills')->where('id', $bill_id)->first();
        if (!$bill) return DV::error('Bill not found.');
        if ($bill->status_id == 2) return DV::error('This bill is already fully paid.');

        $remaining = floatval($bill->total_amount) - floatval($bill->paid_amount ?? 0);
        if (floatval($inputs['amount']) > $remaining + 0.001) {
            return DV::error("Payment amount exceeds remaining balance. Remaining: " . number_format($remaining, 2));
        }

        DB::beginTransaction();
        try {
            unset($inputs['branch_id']);
            unset($inputs['subs_id']);
            unset($inputs['create_uid']);
            unset($inputs['update_uid']);
            unset($inputs['id']); // avoid conflict

            $pay_id = DBX::saveData($ss, 'bill_payments', ['id' => $id], $inputs, [], 1);

            if (!$pay_id || $pay_id <= 0) {
                DB::rollBack();
                return DV::error('Error saving payment record.');
            }

            // Recalculate total paid and update bill
            $total_paid = floatval(
                DB::table('bill_payments')->where('bill_id', $bill_id)->sum('amount')
            );

            $total   = floatval($bill->total_amount);
            $balance = max(0, $total - $total_paid);

            $status_id = ($total > 0 && $total_paid >= $total) ? 2 
                    : ($total_paid > 0 ? 3 : 1);

            DB::table('bills')->where('id', $bill_id)->update([
                'paid_amount' => $total_paid,
                'balance'     => $balance,
                'status_id'   => $status_id,
                'update_user' => $ss->full_name ?? 'System',
                'updated_at'  => getNowTime(),
            ]);

            DB::commit();

            return DV::depends(1, [
                'payment_id' => $pay_id,
                'bill_id'    => $bill_id,
                'total_paid' => $total_paid,
                'balance'    => $balance,
                'status_id'  => $status_id,
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            \Log::error('BillPayment::savePayment Error: ' . $e->getMessage() . "\nTrace:\n" . $e->getTraceAsString());
            return DV::error('Failed to save payment. Please check logs.');
        }
    }
    // public function getPaymentsByBill(array $arr = [], $ss = null)
    // {
    //     $d        = (object) $arr;
    //     $bill_id  = $d->bill_id      ?? null;
    //     $per_page = $d->per_page     ?? 10;
    //     $page     = $d->current_page ?? 1;

    //     if (!$bill_id) return DV::error('bill_id is required.');

    //     $query = DB::table('bill_payments as bp')
    //         ->where('bp.bill_id', $bill_id)
    //         ->selectRaw(' bp.id,bp.bill_id,bp.amount,bp.payment_date,bp.payment_method,bp.ref_no,bp.note,bp.create_user,bp.update_user,bp.updated_at')
    //         ->orderBy('bp.id', 'desc');

    //     $count = (clone $query)->count('bp.id');
    //     $rows  = $query->skip(($page - 1) * $per_page)->take($per_page)->get();

    //     foreach ($rows as $row) {
    //         $processed = setOfficialDates($row, ['updated_at', 'payment_date'], [], []);
    //         if ($processed) $row = $processed;
    //     }

    //     return new LengthAwarePaginator($rows, $count, $per_page, $page);
    // }

    public function getListPaginate(array $arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;
        $bill_id      = $d->bill_id      ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page     ?? 10;

        if (!is_numeric($current_page)) $current_page = 1;

        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = '1=1';

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(bp.ref_no LIKE '%{$search_value}%' 
                        OR bp.note LIKE '%{$search_value}%' 
                        OR b.bill_number LIKE '%{$search_value}%')";
        }

        $query = DB::table('bill_payments as bp')
            ->leftJoin('bills as b', 'b.id', 'bp.bill_id')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->whereRaw($str_search);

        if ($bill_id) {
            $query->where('bp.bill_id', $bill_id);
        }

        $query->selectRaw("
            bp.id,bp.bill_id,b.bill_number,v.name as vendor_name, bp.payment_date,bp.amount,bp.payment_method,bp.ref_no, bp.note, bp.create_user,bp.update_user,bp.created_at,bp.updated_at")
        ->orderBy('bp.id', 'desc');

        $count = (clone $query)->count('bp.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $processed = setOfficialDates($row, ['payment_date', 'created_at', 'updated_at'], [], []);
            if ($processed) $row = $processed;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function deletePayment($pay_id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $payment = DB::table('bill_payments')->where('id', $pay_id)->first();
        if (!$payment) return DV::error('Payment record not found.');

        $bill_id = $payment->bill_id;
        $bill    = DB::table('bills')->where('id', $bill_id)->first();
        if (!$bill) return DV::error('Bill not found.');

        DB::beginTransaction();
        try {
            DB::table('bill_payments')->where('id', $pay_id)->delete();

            // Recalculate after delete
            $total_paid = floatval(
                DB::table('bill_payments')->where('bill_id', $bill_id)->sum('amount')
            );

            $total     = floatval($bill->total_amount);
            $balance   = max(0, $total - $total_paid);
            $status_id = $total_paid <= 0 ? 1 : ($total_paid >= $total ? 2 : 3);

            DB::table('bills')->where('id', $bill_id)->update([
                'paid_amount' => $total_paid,
                'balance'     => $balance,
                'status_id'   => $status_id,
                'update_user' => $ss->full_name,
                'updated_at'  => getNowTime(),
            ]);

            DB::commit();
            return DV::depends(1, ['action' => 'deleted']);

        } catch (\Throwable $e) {
            DB::rollBack();
            return DV::error('Delete failed: ' . $e->getMessage());
        }
    }

    public static function getFormOptions($bill_id = null, $ss = null)
    {
        $bill = null;

        if ($bill_id) {
            $bill = DB::table('bills as b')
                ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
                ->leftJoin('bill_statuses as s', 's.id', 'b.status_id')
                ->where('b.id', $bill_id)
                ->selectRaw('
                    b.id,
                    b.bill_number,
                    b.total_amount,
                    b.paid_amount,
                    b.balance,
                    b.status_id,
                    s.name as status,
                    v.name as vendor_name,
                    v.phone_number
                ')
                ->first();
        }

        $payment_methods = [
            ['id' => 'cash',   'name' => 'Cash'],
            ['id' => 'bank',   'name' => 'Bank Transfer'],
            ['id' => 'cheque', 'name' => 'Cheque'],
            ['id' => 'other',  'name' => 'Other'],
        ];

        return (object) [
            'bill' => $bill,
            'payment_methods' => $payment_methods,
        ];
    }
}