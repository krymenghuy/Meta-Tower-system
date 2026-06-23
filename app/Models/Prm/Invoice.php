<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DV;
use DBX;
use Vsd\Vsloquent\VSModel;
use App\Models\Prm\InvoiceSetting;
use App\Models\CompanyProfile;


class Invoice extends VSModel
{
    protected $table    = 'invoices';
    protected $userInfo = null;
    protected static $img_dir = 'invoices';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id       = $id;
        $this->userInfo = $userInfo;
    }


    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id        = $id ?? $this->id;
        $ss        = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id ?? null;

        $v_rule = [
            'tenant_id'         => '1|integer|exists:tenants,id',
            'space_id'          => '1|integer|exists:building_spaces,id ',
            'due_date'          => '1|date|text=Please enter valid due date',
            'issue_date'        => '1|date|text=Please enter valid issue date',
            'payment_status_id' => '0|integer|exists:payment_statuses,id|default=2',
            'items'             => '1|array|min:1',
            'general_remark'    => '0|string|0-500|',
            'invoice_type'      => '1|choice|1,2,3',
            'discount_type'     => '0|string',
            'discount_value'    => '0|numeric',
            'contract_id'       => '0|integer',
            'amount'            => '0|numeric',
            'amount_payable'    => '0|numeric',
        ];



        $allowed_chars = ['@', ',', '-', '.', '#', '!', '?', '(', ')', "\n"];
        $res = DBX::validateObject(
            $arr,
            $v_rule,
            1,
            ['description' => $allowed_chars],
            $ss->lang ?? 'en',
            0,
            null
        );

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $isNew = !$id;

        $inputs['discount_value'] = (float)($inputs['discount_value'] ?? 0);
        $inputs['discount_type']  = in_array($inputs['discount_type'] ?? 'percent', ['percent', 'amount'])
            ? $inputs['discount_type']
            : 'percent';

        // if ($isNew) {
        //     $inputs['issue_date'] = $inputs['issue_date'] ?? now()->toDateString();
        // } else {
        //     unset($inputs['issue_date']);
        // }
        $items  = $arr['items'] ?? [];
        unset($inputs['items']);

        if (empty($items)) {
            return DV::error('Please add at least one item.');
        }

        // \Log::info("Saving invoice", [
        //     'id' => $id,
        //     'inputs' => $inputs,
        //     'items' => $items,
        //     'user' => $ss->name ?? 'Admin'
        // ]);

        $dueDate = $inputs['due_date'];
        $dueDT   = strtotime($dueDate);
        $todayDT = strtotime(now()->toDateString());
        if (!$dueDT) {
            return DV::error('Invalid due date.');
        }
        $issueDate = $inputs['issue_date'];
        $issueDT   = strtotime($issueDate);
        if (!$issueDT) {
            return DV::error('Invalid issue date.');
        }

        // if ($dueDT < $todayDT) {
        //     return DV::error('Due date cannot be in the past.');
        // }

        // \Log::info("Due date", ["dueDT" => $dueDT, "issueDate" => $inputs['issue_date']]);

        if ($dueDT < $issueDT) {
            return DV::error('Due date cannot be before the issue date.');
        }

        // \Log::info("Due date validation passed", $inputs);

        $inputs['due_amount'] = $inputs['amount_payable'];

        DB::beginTransaction();

        try {
            $created = !$id;
            $id = DBX::saveData($ss, 'invoices', ['id' => $id], $inputs, [], 1);

            $codeRes = null;
            if ($created && $id) {
                $prefix = 'I-';
                $codeRes = setOfficialCode(
                    $branch_id,
                    'invoice_code_control',
                    'invoices',
                    ['id' => $id],
                    $prefix,
                    5,
                    null
                );

                if (!$codeRes || !isset($codeRes->status) || $codeRes->status !== 'OK') {
                }
            }

            DB::table('invoice_items')->where('invoice_id', $id)->delete();


            $itemRows = [];
            foreach ($items as $item) {
                // $itemType = strtolower($item['type'] ?? $item['item_type'] ?? 'service');
                $itemType = $item['type'] ?? 'service';

                $itemId = $item['item_id']  ?? null;
                $qty    = (int)($item['qty'] ?? 1);
                $price  = (float)($item['price'] ?? 0);

                $unitType = $item['unit_type'] ?? '-';


                $price = (float)($item['price'] ?? 0);
                $qty   = (float)($item['qty'] ?? 1);

                $itemRows[] = [
                    'invoice_id'             => $id,
                    'item_id'                => $itemId,
                    'type'                   => $itemType,
                    'qty'                    => $qty,
                    'price'                  => $price,
                    'amount'                 => $item['amount'],
                    'unit_type'              => $unitType,
                    'remarks'                => $item['remarks'] ?? $item['description'] ?? '',
                    'discount'               => ($item['discount_value'] ?? 0),
                    'discount_type'          => $item['discount_type'] ?? 'percent',
                    'tax_rate'               => ($item['tax_rate'] ?? 0),
                    'start_date'             => convertDate($item['start_date']),
                    'end_date'               => convertDate($item['end_date']),
                    'created_at'             => now(),
                    'updated_at'             => now(),
                ];
            }

            if (!empty($itemRows)) {
                DB::table('invoice_items')->insert($itemRows);
            }

            DB::table('invoices')
                ->where('id', $id)
                ->update([
                    'amount'         => $inputs['amount'], // Use provided amount or calculated total
                    'discount_value' => $inputs['discount_value'],
                    'discount_type'  => $inputs['discount_type'],
                    'due_amount'    => $inputs['amount_payable'],
                    'amount_payable' =>  $inputs['amount_payable'], // This will now correctly save 209.7
                    'updated_at'     => now(),
                ]);

            DB::commit();

            return DV::depends(1, ['invoices' => $inputs, 'id' => $id]);
        } catch (\Exception $e) {
            DB::rollBack();
            // \Log::error("Invoice save failed: " . $e->getMessage(), [
            //     'trace' => $e->getTraceAsString()
            // ]);
            return DV::error('Failed to save invoice: ' . $e->getMessage());
        }
    }

    // ======================= Receive Payment ========================
    public function receive($data, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;

        $invoice_id     = (int)($data['invoice_id'] ?? 0);
        $remarks        = trim($data['remarks'] ?? '');
        $penal_rate    = (float)($data['penal_rate'] ?? 0); // penal_amount per day from frontend
        $pmt_breakdowns = $data['pmt_breakdowns'] ?? $data['payment_breakdown'] ?? [];

        // \Log::info($data);
        if ($invoice_id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        if (empty($pmt_breakdowns)) {
            return DV::error('Please add at least one payment method.');
        }

        DB::beginTransaction();

        try {
            $invoice = DB::table('invoices')->where('id', $invoice_id)->first();
            if (!$invoice) {
                throw new \Exception('Invoice not found.');
            }

            if ((int)$invoice->payment_status_id === 1) {
                throw new \Exception('Invoice is already fully paid.');
            }

            // ── Calculate Penalty ──────────────────────────────────────────
            $penal_amount   = 0;
            $over_due_day = 0;
            $today     = \Carbon\Carbon::now('Asia/Phnom_Penh')->startOfDay();
            $due_date  = \Carbon\Carbon::parse($invoice->due_date)->startOfDay(); // raw DB value

            if ($today->greaterThan($due_date) && $penal_rate > 0) {
                $over_due_day = $due_date->diffInDays($today);
                $penal_amount   = $over_due_day * $penal_rate;
            }

            // \Log::info("Penalty calculation", [
            //     'invoice_id'  => $invoice_id,
            //     'due_date'    => $due_date->toDateString(),
            //     'today'       => $today->toDateString(),
            //     'over_due_day'   => $over_due_day,
            //     'penal_rate' => $penal_rate,
            //     'penal_amount'     => $penal_amount,
            // ]);

            $invoice_amount      = (float)$invoice->amount;
            $already_paid        = (float)$invoice->paid_amount;
            $total_received      = array_sum(array_column($pmt_breakdowns, 'amount'));
            $current_balance_due = ($invoice_amount - $already_paid) + $penal_amount;

            $total_paid = $already_paid + $total_received;

            if ($total_received > $current_balance_due) {
                DB::rollBack();
                return DV::error('Receive amount must not be greater than due amount. Balance due: $' . number_format($current_balance_due, 2));
            }

            // ── Save Receipt ───────────────────────────────────────────────
            $receiptData = [
                'receipt_date'   => now()->toDateString(),
                'invoice_id'     => $invoice_id,
                'tenant_id'      => $invoice->tenant_id,
                'branch_id'      => $ss->branch_id ?? $invoice->branch_id ?? 1,
                'total_received' => $total_received,
                'total_paid'     => $total_paid,
                'penal_amount'   => $penal_amount,
                'over_due_day'   => $over_due_day,
                'penal_rate'     => $penal_rate,
                'remarks'        => $remarks,
                'create_user'    => $ss->name ?? 'Admin',
                'create_uid'     => $ss->uid ?? 1,
            ];

            $receipt_id = DBX::saveData($ss, 'receipts', [], $receiptData, [], 1);
            if (!$receipt_id) {
                throw new \Exception('Failed to create receipt.');
            }

            $codeRes = setOfficialCode(
                $receiptData['branch_id'],
                'receipt_code_control',
                'receipts',
                ['id' => $receipt_id],
                'R-',
                5,
                null
            );

            // ── Save Receipt Breakdowns ────────────────────────────────────
            $methodMap = [
                'cash'   => 'Cash',
                'bank'   => 'Bank',
                'card'   => 'Card',
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
                    'receipt_id'       => $receipt_id,
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
                DB::table('receipt_breakdowns')->insert($detailRows);
            }

            // ── Update Invoice ─────────────────────────────────────────────
            $new_paid_amount = $already_paid + $total_received;
            $new_due_amount  = ($invoice_amount + $penal_amount) - $new_paid_amount;

            if ($new_due_amount < 0) {
                $new_due_amount = 0;
            }

            $payment_status_id = 2; // unpaid
            if ($new_due_amount == 0) {
                $payment_status_id = 1; // fully paid
            } elseif ($new_paid_amount > 0) {
                $payment_status_id = 3; // partial
            }

            $is_paid = ($payment_status_id === 1) ? 1 : 0;

            DB::table('invoices')
                ->where('id', $invoice_id)
                ->update([
                    'paid_amount'       => $new_paid_amount,
                    'due_amount'        => $new_due_amount,
                    'penal_amount'           => $penal_amount,
                    'is_paid'           => $is_paid,
                    'payment_status_id' => $payment_status_id,
                    'updated_at'        => now(),
                    'update_user'       => $ss->name ?? 'Admin',
                    'update_uid'        => $ss->uid ?? 1,
                ]);

            DB::commit();

            return DV::depends(1, [
                'receipt_id'      => $receipt_id,
                'code'            => $codeRes->code ?? 'R-' . str_pad($receipt_id, 5, '0', STR_PAD_LEFT),
                'total_received'  => $total_received,
                'new_paid_amount' => $new_paid_amount,
                'new_due_amount'  => $new_due_amount,
                'over_due_day'       => $over_due_day,
                'penal_rate'     => $penal_rate,
                'penal_amount'         => $penal_amount,
                'is_fully_paid'   => (bool)$is_paid,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            // \Log::error("Receive payment failed: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return DV::error('Failed to receive payment: ' . $e->getMessage());
        }
    }





    public function invoiceSetting($arr, $ss)
    {
        $d = (object) $arr;
        $id = (int) ($d->id ?? 0);

        if ($id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        DB::beginTransaction();

        try {
            // 1. Verify the invoice exists
            $invoice = DB::table('invoices')->where('id', $id)->first();
            if (!$invoice) {
                throw new \Exception('Invoice not found.');
            }

            // 2. Map toggle fields from request, fallback to existing DB values (Notice '_piad')
            $updateData = [
                'show_balance'      => isset($d->show_balance)      ? (int) $d->show_balance      : $invoice->show_balance,
                'show_comm_tax'    => isset($d->show_comm_tax)    ? (int) $d->show_comm_tax    : $invoice->show_comm_tax,
                'show_pmt_status'  => isset($d->show_pmt_status)  ? (int) $d->show_pmt_status  : $invoice->show_pmt_status,
                'show_amount_paid' => isset($d->show_amount_paid) ? (int) $d->show_amount_paid : $invoice->show_amount_paid, // Fixed DB key here
                'show_sign'        => isset($d->show_sign)        ? (int) $d->show_sign        : $invoice->show_sign,
                'updated_at'       => now(),
            ];

            // 3. Update database records
            DB::table('invoices')
                ->where('id', $id)
                ->update($updateData);

            DB::commit();

            // 4. Return the newly saved visibility states to the frontend (Keeping frontend keys clean)
            return DV::depends(1, [
                'id' => $id,
                'settings' => [
                    'show_balance'      => (int) $updateData['show_balance'],
                    'show_comm_tax'    => (int) $updateData['show_comm_tax'],
                    'show_pmt_status'  => (int) $updateData['show_pmt_status'],
                    'show_amount_paid' => (int) $updateData['show_amount_paid'],
                    'show_sign'        => (int) $updateData['show_sign'],
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to update invoice display settings: ' . $e->getMessage());
        }
    }

    public function getInvoiceSetting($arr, $ss)
    {
        $d = (object) $arr;
        $id = (int) ($d->id ?? 0);

        if ($id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        DB::beginTransaction();

        try {
            // 1. Verify the invoice exists
            $invoice = DB::table('invoices')->where('id', $id)->first();
            if (!$invoice) {
                throw new \Exception('Invoice not found.');
            }
            // 4. Return the newly saved visibility states to the frontend (Keeping frontend keys clean)
            return DV::depends(1, [
                'id' => $id,
                'settings' => [
                    'show_balance'      => (int) $invoice->show_balance,
                    'show_comm_tax'    => (int) $invoice->show_comm_tax,
                    'show_pmt_status'  => (int) $invoice->show_pmt_status,
                    'show_amount_paid' => (int) $invoice->show_amount_paid,
                    'show_sign'        => (int) $invoice->show_sign,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to update invoice display settings: ' . $e->getMessage());
        }
    }

    public function resetInvoiceSettings($arr, $ss)
    {
        $d = (object) $arr;
        $id = (int) ($d->id ?? 0);

        if ($id <= 0) {
            return DV::error('Invalid invoice ID.');
        }

        DB::beginTransaction();

        try {
            // 1. Verify the invoice exists
            $invoice = DB::table('invoices')->where('id', $id)->first();
            if (!$invoice) {
                throw new \Exception('Invoice not found.');
            }

            // 2. Perform the Update (Resetting all toggles to 0)
            DB::table('invoices')->where('id', $id)->update([
                'show_balance'      => null,
                'show_comm_tax'    => null,
                'show_pmt_status'  => null,
                'show_amount_paid' => null,
            ]);

            DB::commit();

            // 4. Return the newly reset states to the frontend
            return DV::depends(1, [
                'id' => $id,
                'settings' => [
                    'show_balance'      => 0,
                    'show_comm_tax'    => 0,
                    'show_pmt_status'  => 0,
                    'show_amount_paid' => 0,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error('Failed to reset invoice display settings: ' . $e->getMessage());
        }
    }



    public static function checkDuplicateSpaceId($tenant_id, $invoice_id = null)
    {
        $query = DB::table('invoices as i')
            ->where('i.tenant_id', $tenant_id);

        if ($invoice_id) {
            $query->where('i.id', '!=', $invoice_id);
        }

        return $query->value('id');
    }

    public function getListPaginate($arr, $ss)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;
        $current_page = (int) ($d->current_page ?? 1);
        $per_page = (int) ($d->per_page ?? 10);


        if ($current_page < 1 || $per_page < 1) {
            return null;
        }

        $skip_rows = ($current_page - 1) * $per_page;


        $driver = DB::connection()->getDriverName();

        $remarksAgg = $driver === 'pgsql'
            ? "STRING_AGG(DISTINCT remarks, '; ') as remarks"
            : "GROUP_CONCAT(DISTINCT remarks SEPARATOR '; ') as remarks";

        $invoiceItemsSub = DB::table('invoice_items')
            ->select([
                'invoice_id',
                DB::raw($remarksAgg) // Aggregates remarks safely
            ])
            ->groupBy('invoice_id');


        $query = DB::table('invoices as i')
            ->leftJoin('tenants as t', 't.id', '=', 'i.tenant_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct', 'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs', 'bs.id', '=', 'i.space_id')
            ->leftJoinSub($invoiceItemsSub, 'ii', function ($join) {
                $join->on('ii.invoice_id', '=', 'i.id');
            })
            ->select([
                'i.id',
                'i.amount_payable',
                'i.due_amount',
                'i.code',
                'i.tenant_id',
                'i.space_id',
                'i.amount',
                'i.paid_amount',
                'i.invoice_type',
                'i.due_date',
                'i.general_remark',
                'i.issue_date',
                'i.discount_type',
                'i.discount_value',
                'i.start_time',
                'i.created_at',
                'i.updated_at',
                'i.update_user',
                'i.payment_status_id',
                'i.contract_id',

                't.name as tenant_name',
                't.legal_name as tenant_legal_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',

                'ps.name as payment_status_name',

                'bs.code as space_code',

                'ct.price as contract_price',

                'ii.remarks',

                // DB::raw('(i.amount - COALESCE(i.paid_amount, 0)) as balance')
                DB::raw('(i.amount_payable - COALESCE(i.paid_amount, 0)) as balance'),
            ]);


        if (!empty($d->invoice_type)) {
            $query->where('i.invoice_type', $d->invoice_type);
        }

        if (!empty($d->tenant_id)) {
            $query->where('i.tenant_id', $d->tenant_id);
        }

        if (!empty($d->payment_status_id)) {
            $query->where('i.payment_status_id', $d->payment_status_id);
        }


        if (!empty($search_value)) {
            $skip_rows = 0;
            $search = '%' . trim($search_value) . '%';

            $query->where(function ($q) use ($search) {
                $q->where('i.code', 'like', $search)
                    ->orWhere('t.name', 'like', $search)
                    ->orWhere('bs.code', 'like', $search);
            });
        }


        $count = (clone $query)->distinct('i.id')->count('i.id');

        $rows = $query
            ->orderByDesc('i.id')
            ->skip($skip_rows)
            ->take($per_page)
            ->get();


        $now = \Carbon\Carbon::now('Asia/Phnom_Penh')->startOfDay();

        foreach ($rows as $row) {
            if (!empty($row->due_date)) {
                $dueDate = \Carbon\Carbon::parse(
                    $row->due_date,
                    'Asia/Phnom_Penh'
                )->startOfDay();

                if (
                    in_array((int) $row->payment_status_id, [2, 3]) &&
                    $dueDate->lessThan($now)
                ) {
                    $row->payment_status_id = 4;
                    $row->payment_status_name = 'Overdue';
                }
            }

            setOfficialDates(
                $row,
                ['due_date', 'issue_date'],
                ['updated_at', 'created_at'],
                []
            );
        }

        return new LengthAwarePaginator(
            $rows,
            $count,
            $per_page,
            $current_page
        );
    }

    public static function getInvoiceDetails($id)
    {
        $header = DB::table('invoices as i')
            ->leftJoin('tenants as t',           't.id',  '=', 'i.tenant_id')
            ->leftJoin('payment_statuses as ps', 'ps.id', '=', 'i.payment_status_id')
            ->leftJoin('contracts as ct',        'ct.id', '=', 'i.contract_id')
            ->leftJoin('building_spaces as bs',  'bs.id', '=', 'i.space_id')
            ->where('i.id', $id)
            ->select(
                'i.id',
                'i.tenant_id',
                'i.space_id',
                'i.general_remark',
                'i.code',
                'i.amount_payable',
                'i.due_amount',
                'i.amount',
                'i.paid_amount',
                'i.start_time',
                'i.invoice_type',
                'i.issue_date',
                'i.due_date',
                'i.discount_type',
                'i.discount_value',
                DB::raw('(i.amount_payable - COALESCE(i.paid_amount, 0)) as balance'),
                'i.payment_status_id',
                'i.contract_id',
                't.name as tenant_name',
                't.phone_number as tenant_phone',
                't.email as tenant_email',
                'bs.code as space_code',
                'ct.legal_name as contract_legal_name',

                // Merging the 4 toggle flags into a single JSON Object string alias 'settings'
                DB::raw("JSON_OBJECT(
                        'show_balance', COALESCE(i.show_balance),
                        'show_comm_tax', COALESCE(i.show_comm_tax),
                        'show_pmt_status', COALESCE(i.show_pmt_status),
                        'show_amount_paid', COALESCE(i.show_amount_paid),
                        'show_sign', COALESCE(i.show_sign)
                    ) as settings")
            )
            ->first();

        if (!$header) {
            return null;
        }
        if ($header && is_string($header->settings)) {
            $header->settings = json_decode($header->settings);
        }

        $header->items = DB::table('invoice_items as ii')
            ->leftJoin('services as s', function ($join) {
                $join->on('s.id', '=', 'ii.item_id')
                    ->where('ii.type', '=', 'service');
            })
            ->leftJoin('contracts as c', function ($join) {
                $join->on('c.id', '=', 'ii.item_id')
                    ->where('ii.type', '=', 'rent');
            })
            ->where('ii.invoice_id', $id)
            ->select(
                'ii.id',
                'ii.invoice_id',
                'ii.item_id',
                'ii.type',
                'ii.qty',
                'ii.unit_type',
                'ii.remarks',
                'ii.amount as total',
                'ii.discount',
                'ii.discount_type',
                'ii.start_date',
                'ii.end_date',
                'ii.tax_rate',
                'ii.price',

                DB::raw("
                        COALESCE(
                            s.name,
                            CASE
                                WHEN ii.type = 'rent' THEN CONCAT('Rent - ', ii.remarks)
                                ELSE ii.remarks
                            END,
                            '—'
                        ) as item_name
                    ")
            )
            ->get();


        foreach ($header->items as $i) {
            $i = setOfficialDates($i, ['end_date', 'start_date'], [], []);
        }
        if ($header) {
            setOfficialDates($header, ['due_date', 'issue_date', 'start_date'], [], []);
        }
        return $header;
    }

    public static function getPrintInvoice($id, $ss)
    {
        // Instantiate the InvoiceSetting model first
        $invoiceSettingModel = new InvoiceSetting();
        $CompanyProfileModel = new CompanyProfile();

        return (object) [
            'invoice_details' => self::getInvoiceDetails($id),
            'invoice_setting' => $invoiceSettingModel->getInvoiceSetting($id, $ss),
            'company_info'    => $CompanyProfileModel->details($ss)
        ];
    }

    public static function getFormOptions($id, $ss)
    {
        return (object) [
            'invoice_details' => $id ? self::getInvoiceDetails($id) : null,
            'buildings'       => GeneralSettings::options_building($ss),
            'statuses'        => GeneralSettings::options_payment_status($ss),
            'tenants'         => GeneralSettings::options_tenant_with_active_contract($ss),
            'services'        => GeneralSettings::options_service($ss),
            'banks'           => GeneralSettings::options_bank($ss),
            'business_types'  => GeneralSettings::options_business_type($ss),
        ];
    }

    public function deleteInvoice($id = null)
    {
        $id = $id ?? $this->id;
        DB::beginTransaction();
        try {
            $currentItem = DB::table('invoice_items')
                ->where('invoice_id', $id)
                ->where('type', 'rent')
                ->first();

            if ($currentItem) {
                $nextInvoice = DB::table('invoice_items')
                    ->where('item_id', $currentItem->item_id)
                    ->where('type', 'rent')
                    ->where('start_date', '>', $currentItem->start_date)
                    ->exists();

                if ($nextInvoice) {
                    return DV::error('Cannot delete this invoice. You must delete the most recent invoice before deleting the previous one ');
                }
            }

            $invoiceHeader = DB::table('invoices')->where('id', $id)->first();
            if ($invoiceHeader && $invoiceHeader->paid_amount > 0) {
                return DV::error('Cannot delete an invoice that has already been paid.');
            }

            DB::table('invoice_items')->where('invoice_id', $id)->delete();
            $deleted = DB::table('invoices')->where('id', $id)->delete();

            if ($deleted) {
                DB::commit();
                return DV::depends(1, 'Invoice and items deleted successfully.');
            }

            throw new \Exception('Invoice record not found.');
        } catch (\Exception $e) {
            DB::rollBack();
            // \Log::error("Delete invoice failed: " . $e->getMessage());
            return DV::error('Failed to delete: ' . $e->getMessage());
        }
    }
}
