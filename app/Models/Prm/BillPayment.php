<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use XPublicStorage;
use DV;
use DBX;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class BillPayment
{
    protected $id       = null;
    protected $userInfo = null;

    public function __construct($id = null, $ss = null)
    {
        $this->id       = $id;
        $this->userInfo = $ss;
    }

    // public function savePayment(array $arr = [], $id = null, $ss = null)
    // {
    //     $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;

    //     $v_rule = [
    //         'bill_id'        => '1|number|exists=bills.id',
    //         'payment_date'   => '1|date',
    //         'payer'          => '1|string|0-50',
    //         'amount'         => '0|number|min=0.01',
    //         'payment_method' => '0|string|0-50',
    //         'ref_no'         => '0|string|0-100',
    //         'note'           => '0|string|0-255',
    //         'currency_code'  => '0|string|0-10|default=USD',

    //     ];


    //     $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
    //     if ($res->error) return DV::error($res->error);

    //     $inputs = $res->values;

    //     if (empty($inputs['payment_method'])) {
    //         $cash = floatval($arr['cash'] ?? 0);
    //         $bankAmt = floatval($arr['bank_amount'] ?? 0);
    //         $chequeAmt = floatval($arr['cheque_amount'] ?? 0);

    //         $methods = array_filter([
    //         $cash      > 0 ? 'cash'   : null,
    //         $bankAmt   > 0 ? 'bank'   : null,
    //         $chequeAmt > 0 ? 'cheque' : null,
    //     ]);

    //     $inputs['payment_method'] = count($methods) === 1
    //         ? reset($methods)
    //         : (count($methods) > 1 ? 'other' : 'cash');
    //     }

    //     if (floatval($inputs['amount']) <= 0) {
    //         return DV::error('Payment amount must be greater than zero.');
    //     }

    //     $bill_id      = $inputs['bill_id'];
    //     $payment_date = date('Y-m-d', strtotime($inputs['payment_date']));
    //     $today        = date('Y-m-d');

    //     if ($payment_date !== $today) {
    //         return DV::error('Payment date must be today.');
    //     }

    //     $bill = DB::table('bills')->where('id', $bill_id)->first();
    //     if (!$bill) return DV::error('Bill not found.');
    //     if ($bill->status_id == 2) return DV::error('This bill is already fully paid.');

    //     $total_paid = floatval(
    //         DB::table('bill_payments')
    //             ->where('bill_id', $bill_id)
    //             ->where('status_id', 1)
    //             ->sum('amount')
    //     );

    //     $total     = floatval($bill->total_amount);
    //     $remaining = max(0, $total - $total_paid);

    //     if (floatval($inputs['amount']) > $remaining + 0.001) {
    //         return DV::error("Payment amount exceeds remaining balance. Remaining: " . number_format($remaining, 2));
    //     }

    //     DB::beginTransaction();
    //     try {
    //         unset($inputs['branch_id']);
    //         unset($inputs['subs_id']);
    //         unset($inputs['create_uid']);
    //         unset($inputs['update_uid']);
    //         unset($inputs['id']);

    //         $inputs['status_id'] = 1;

    //         $pay_id = DBX::saveData($ss, 'bill_payments', ['id' => $id], $inputs, [], 1);

    //         if (!$pay_id || $pay_id <= 0) {
    //             DB::rollBack();
    //             return DV::error('Error saving payment record.');
    //         }

    //         $total_paid = floatval(
    //             DB::table('bill_payments')
    //                 ->where('bill_id', $bill_id)
    //                 ->where('status_id', 1)
    //                 ->sum('amount')
    //         );

    //         $balance   = max(0, $total - $total_paid);
    //         $status_id = ($total > 0 && $total_paid >= $total) ? 2
    //                    : ($total_paid > 0 ? 3 : 1);

    //         DB::table('bills')->where('id', $bill_id)->update([
    //             'paid_amount' => $total_paid,
    //             'balance'     => $balance,
    //             'status_id'   => $status_id,
    //             'update_user' => $ss->full_name ?? 'System',
    //             'updated_at'  => getNowTime(),
    //         ]);

    //         DB::commit();

    //         return DV::depends(1, [
    //             'payment_id' => $pay_id,
    //             'bill_id'    => $bill_id,
    //             'total_paid' => $total_paid,
    //             'balance'    => $balance,
    //             'status_id'  => $status_id,
    //         ]);

    //     } catch (Exception $e) {
    //         DB::rollBack();
    //         Log::error('BillPayment::savePayment Error: ' . $e->getMessage() . "\nTrace:\n" . $e->getTraceAsString());
    //         return DV::error('Failed to save payment. Please check logs.');
    //     }
    // }
    public function savePayment($data, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $bill_id     = (int)($data['bill_id'] ?? 0);
        $remarks        = trim($data['remarks'] ?? '');
        $pmt_breakdowns = $data['pmt_breakdowns'] ?? $data['payment_breakdown'] ?? [];

        if ($bill_id <= 0) {
            return DV::error('Invalid bill ID.');
        }
        if ($data['payer'] === '' || $data['payer'] === null) {
            return DV::error('Please input payer.');
        }

        if (empty($pmt_breakdowns)) {
            return DV::error('Please add at least one payment method.');
        }

        foreach ($pmt_breakdowns as $index => $payment) {
            // Only check bank_id if the method is Bank or Cheque
            if (in_array($payment['method'], ['Bank', 'Cheque'])) {

                // Check if bank_id key exists and if it is empty
                if ($payment['method'] === 'Bank' && empty($payment['bank_id'])) {
                    return DV::error('Bank selection is required for bank transfers.');
                }

                if ($payment['method'] === 'Bank' && empty($payment['bank_ref_number'])) {
                    return DV::error('Reference number is required for bank transfers.');
                }

                if ($payment['method'] === 'Cheque' && empty($payment['bank_id'])) {
                    return DV::error('Bank selection is required for cheque payment.');
                }

                if ($payment['method'] === 'Cheque' && empty($payment['cheque_number'])) {
                    return DV::error('cheque number is required for cheque payment.');
                }
            }
        }

        DB::beginTransaction();

        try {
            $bill = DB::table('bills')->where('id', $bill_id)->first();
            if (!$bill) {
                throw new \Exception('bill not found.');
            }

            // \Log::info('Bill details:', (array) $bill);

            if ((int)$bill->status_id === 2) {
                throw new \Exception('bill is already fully paid.');
            }


            $bill_amount      = (float)$bill->total_amount;
            $already_paid        = (float)$bill->paid_amount;
            $total_amount      = array_sum(array_column($pmt_breakdowns, 'amount'));
            $current_balance_due = ($bill_amount - $already_paid);



            if ($total_amount > $current_balance_due) {
                DB::rollBack();
                return DV::error('Receive amount must not be greater than due amount. Balance due: $' . number_format($current_balance_due, 2));
            }

            // ── Save Receipt ───────────────────────────────────────────────
            $billPaymentData = [
                'payment_date'   => now()->toDateString(),
                'bill_id'     => $bill_id,
                // 'vendor_id'      => $bill->vendor_id,
                'branch_id'      => $ss->branch_id ?? $bill->branch_id ?? 1,
                'total_amount'  => $total_amount,
                'note'        => $remarks,
                'create_user'    => $ss->name ?? 'Admin',
                'create_uid'     => $ss->uid ?? 1,
            ];

            $bill_payment_id = DBX::saveData($ss, 'bill_payments', [], $billPaymentData, [], 1);
            if (!$bill_payment_id) {
                throw new \Exception('Failed to create Bill Payment.');
            }

            // ── Save Receipt Breakdowns ────────────────────────────────────
            $methodMap = [
                'cash'   => 'Cash',
                'bank'   => 'Bank',
                'cheque' => 'Cheque',
            ];

            $detailRows = [];
            foreach ($pmt_breakdowns as $bd) {
                $method    = $methodMap[strtolower(trim($bd['method'] ?? ''))] ?? 'Cash';
                $bank_id   = $bd['bank_id'] ?? null;
                $bank_name = null;

                if ($bank_id) {
                    $bank_name = DB::table('banks')->where('id', $bank_id)->value('name');
                }

                $detailRows[] = [
                    'bill_payment_id'       => $bill_payment_id,
                    'bank_id'          => $bank_id,
                    'method'           => $method,
                    'amount'           => (float)($bd['amount'] ?? 0),
                    'currency_code'    => $bd['currency_code'] ?? 'USD',
                    'bank_ref_number'  => $bd['bank_ref_number'] ?? null,
                    'bank_name'        => $bank_name ?? $bd['bank_name'] ?? null,
                    'card_number'      => $bd['card_number'] ?? null,
                    'card_type'        => in_array(strtolower($bd['card_type'] ?? ''), ['credit', 'debit'])
                        ? strtolower($bd['card_type'])
                        : null,
                    'cheque_number'    => $bd['cheque_number'] ?? null,
                    'cheque_bank_name' => ($method === 'Cheque')
                        ? ($bank_name ?? $bd['cheque_bank_name'] ?? null)
                        : null,
                    'remarks'          => $bd['remarks'] ?? $remarks,
                    'created_at'       => now(),
                ];
            }

            if (!empty($detailRows)) {
                DB::table('bill_payment_breakdowns')->insert($detailRows);
            }

            // ── Update bill ─────────────────────────────────────────────
            $new_paid_amount = $already_paid + $total_amount;
            $new_total_amount  = $bill_amount  - $new_paid_amount;

            if ($new_total_amount < 0) {
                $new_total_amount = 0;
            }

            $status_id = 1; // unpaid
            if ($new_total_amount == 0) {
                $status_id = 2; // fully paid
            } elseif ($new_paid_amount > 0) {
                $status_id = 3; // partial
            }

            $is_paid = ($status_id === 1) ? 1 : 0;

            DB::table('bills')
                ->where('id', $bill_id)
                ->update([
                    'paid_amount'       => $new_paid_amount,
                    'balance'        => $new_total_amount,
                    'status_id'          => $status_id,
                    'updated_at'        => now(),
                    'update_user'       => $ss->name ?? 'Admin',
                    'update_uid'        => $ss->uid ?? 1,
                ]);

            DB::commit();

            return DV::depends(1, [
                'bill_payment_id'      => $bill_payment_id,
                // 'code'            => $codeRes->code ?? 'R-' . str_pad($bill_payment_id, 5, '0', STR_PAD_LEFT),
                'total_amount'  => $total_amount,
                'new_paid_amount' => $new_paid_amount,
                'new_total_amount'  => $new_total_amount,
                'is_fully_paid'   => (bool)$is_paid,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error("Receive payment failed: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return DV::error('Failed to pay bill: ' . $e->getMessage());
        }
    }

    public function getListPaginate(array $arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d  = (object) $arr;

        $date_from = $d->date_from ?? null;
        $date_to = $d->date_to ?? null;
        $search_value = $d->search_value ?? null;
        $bill_id = $d->bill_id ?? null;
        // $bank_id = $d->bank_id ?? null;
        $expense_type_id = $d->expense_type_id ?? null;
        $status_id = $d->status_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) $current_page = 1;

        $skip_rows  = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        $str_moreWhere = '2-2';

        if ($search_value) {
            $skip_rows    = 0;
            $search_value = escape_like_str($search_value);
            $str_search   = "(v.name LIKE '%" . $search_value . "%' OR b.bill_number LIKE '%" . $search_value . "%' OR bp.payer LIKE '%" . $search_value . "%')";
        }

        $query = DB::table('bill_payments as bp')
            ->leftJoin('bills as b', 'b.id', 'bp.bill_id')
            ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
            ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id')
            ->leftJoin('bill_payment_statuses as ps', 'ps.id', 'bp.status_id')
            ->leftJoin('bill_payment_breakdowns as bpb', 'bpb.bill_payment_id', 'bp.id')
            ->whereRaw($str_search);

        if ($bill_id) {
            $str_moreWhere .= 'AND bp.bill_id = ' . $bill_id;
        }
        if ($expense_type_id) {
            $str_moreWhere .= 'AND b.expense_type_id = ' . $expense_type_id;
        }
        if ($status_id) {
            $str_moreWhere .= 'AND bp.status_id = ' . $status_id;
        }
        if (!empty($date_from)) {
            $query->whereDate('bp.payment_date', '>=', date('Y-m-d', strtotime($date_from)));
        }
        if (!empty($date_to)) {
            $query->whereDate('bp.payment_date', '<=', date('Y-m-d', strtotime($date_to)));
        }

        $query->selectRaw("
            bp.id, bp.bill_id, b.bill_number, v.name as vendor_name,
            b.expense_type_id, ex.name as expense_type_name,
            bp.payment_date, bpb.amount, bp.payer,
            b.ref_no, bp.currency_code, bp.note,
            b.total_amount, b.paid_amount, b.balance,b.due_date,
            bp.status_id, ps.name as payment_status,
            bpb.method as payment_method,
            bp.create_user, bp.update_user, bp.created_at, bp.updated_at
        ")->orderBy('bp.id', 'desc');


        $count = (clone $query)->count('bp.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $processed = setOfficialDates($row, ['payment_date'], ['updated_at'], []);
            if ($processed) $row = $processed;
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getFormOptions($bill_id = null, $ss = null)
    {
        $bill     = null;
        $payments = collect();

        if ($bill_id) {
            $bill = DB::table('bills as b')
                ->leftJoin('vendors as v', 'v.id', 'b.vendor_id')
                ->leftJoin('bill_statuses as s', 's.id', 'b.status_id')
                ->leftJoin('expense_categories as ex', 'ex.id', 'b.expense_type_id')
                ->where('b.id', $bill_id)
                ->selectRaw('b.id, b.bill_number, b.total_amount, b.paid_amount, b.balance, b.status_id, s.name as status, v.name as vendor_name, v.phone_number, b.expense_type_id, ex.name as expense_type_name, b.currency_code')
                ->first();

            $payments = DB::table('bill_payments')
                ->where('bill_id', $bill_id)
                ->where('status_id', 1)
                ->orderBy('payment_date', 'asc')
                ->select('id', 'payment_date', 'payer', 'currency_code', 'total_amount', 'note', 'status_id')
                ->get();
        }
        $banks = DB::table('banks')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return (object) [
            'bill'     => $bill,
            'payments' => $payments,
            'banks'    => $banks,
        ];
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

            $total_paid = floatval(
                DB::table('bill_payments')
                    ->where('bill_id', $bill_id)
                    ->where('status_id', 1)
                    ->sum('amount')
            );

            $total     = floatval($bill->total_amount);
            $balance   = max(0, $total - $total_paid);
            $status_id = $total_paid <= 0 ? 1 : ($total_paid >= $total ? 2 : 3);

            DB::table('bills')->where('id', $bill_id)->update([
                'paid_amount' => $total_paid,
                'balance'     => $balance,
                'status_id'   => $status_id,
                'update_user' => $ss->full_name ?? 'System',
                'updated_at'  => getNowTime(),
            ]);

            DB::commit();
            return DV::depends(1, ['action' => 'deleted']);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('BillPayment::deletePayment Error: ' . $e->getMessage());
            return DV::error('Delete failed: ' . $e->getMessage());
        }
    }

    public function cancelPayment($d, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $id             = $d->id;

        $paid = DB::table('bill_payment_breakdowns as bpb')
            ->where('bp.id', $id)
            ->where('status_id', 1)
            // ->where('branch_id', $ss->branch_id)
            ->selectRaw('bill_id, total_amount')
            ->join('bill_payments as bp', 'bpb.bill_payment_id', 'bp.id')
            ->first();

        if (!$paid) return DV::error('Payment record not found or already cancelled.');

        $bill = DB::table('bills')->where('id', $paid->bill_id)->first();
        if (!$bill) return DV::error('Bill not found.');

        DB::beginTransaction();
        try {
            DB::table('bill_payment_breakdowns as bpb')
                ->where('bp.id', $id)->join('bill_payments as bp', 'bpb.bill_payment_id', 'bp.id')
                ->update([

                    'status_id' => 2,
                    'note' => $d->note ?? null,
                    'updated_at' => getNowTime(),
                ]);

            $total_paid = floatval(
                DB::table('bill_payment_breakdowns as bpb')
                    ->where('bp.bill_id', $paid->bill_id)
                    ->where('status_id', 1)
                    ->join('bill_payments as bp', 'bpb.bill_payment_id', 'bp.id')
                    ->sum('total_amount')
            );

            $total     = floatval($bill->total_amount);
            $balance   = max(0, $total - $total_paid);
            $status_id = $total_paid <= 0 ? 1 : ($total_paid >= $total ? 2 : 3);

            // Step 3: Update bill
            $cancel = DB::table('bills')->where('id', $paid->bill_id)->update([
                'paid_amount' => $total_paid,
                'balance'     => $balance,
                'status_id'   => $status_id,
                'update_user' => $ss->full_name,
                'updated_at'  => getNowTime(),
            ]);

            // CashAccount::rollBackTranxByBillPayment($id, $ss);

            DB::commit();
            return DV::depends($cancel, 'Cancelled', 'Something went wrong or bill not found.');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('BillPayment::cancelPayment Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return DV::error('Something went wrong on server side');
        }
    }
}
