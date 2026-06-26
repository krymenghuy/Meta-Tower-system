<?php

namespace App\Models\Prm;

use DB;
use Vsd\Database\DBX;
use DV;
use XPublicStorage;
use XBranch;
use App\Models\CompanyProfile;

class Report //extends Model
{
    protected $id = null, $ss = null;
    protected static $arr_escape_key_name = [
        //* key must be match to params if want to customize filter name,
        ['key' => 'group_id', 'name' => 'Group'],
        ['key' => 'term_id', 'name' => 'Term'],
        ['key' => 'campus_id', 'name' => 'Campus'],
        ['key' => 'status_id', 'name' => 'Payment Option'],
        ['key' => 'fee_type_id', 'name' => 'Fee Type'],
        ['key' => 'program_id', 'name' => 'Program'],
        ['key' => 'receiver_uid', 'name' => 'Receiver'],
        ['key' => 'level_id', 'name' => 'Level'],
        ['key' => 'student_id', 'name' => 'Student'],
        ['key' => 'leave_type_id', 'name' => 'Leave Type'],
        ['key' => 'from_campus_id', 'name' => 'From Campus'],
        ['key' => 'to_campus_id', 'name' => 'To Campus'],
        ['key' => 'request_type_id', 'name' => 'Request Type']
    ];


    function __construct($id = null, $ss = null)
    {
        $this->ss = $ss;
        $this->id = $id;
    }

    static function getCompanyInfo($ss)
    {
        $x = new CompanyProfile($ss);
        $p = (object) $x->getDetails($ss);

        $p->branches = [
            (object) ['address_kh' => $p->address_kh ?? '', 'address' => $p->address ?? '', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''],
            (object) ['address_kh' => 'ផ្ទះលេខ១២ ផ្លូវ៤៥៤ សង្កាត់ទួលទំពូងទី១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ', 'address' => '#16, St.454, Sangkat Toul Tum Poung 1, Khan Chamkarmon, Phnom Penh', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''],
        ];
        // $p->phone_number = ($p->phone_number ?? '') . ' / ' . $p->first_cp_phone ?? '081 888 305';
        return $p;
    }
    static function getCompanyInfoByBranch($branch_id,$ss)
    {
        // $x = new XBranch($ss);
        $p = XBranch::firstBy(['id'=>$branch_id],'name, address,name_kh, address_kh,phone_number,email');
        $p->branche = (object) ['address_kh' => $p->address_kh ?? '', 'address' => $p->address ?? '', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''];
        $p->phone_number = ($p->phone_number ?? '');
        return $p;
    }
    static function list($ss)
    {
        $self = new Report();
        $get_arr_key_names = array_column(self::$arr_escape_key_name, 'name');
        $get_arr_key_keys = array_column(self::$arr_escape_key_name, 'key');
        $user_id = $ss->id;
        $include = '';
        \Log::info(json_encode($ss));
        if ($ss->is_master_account != 1) {
            $umM_prms = DB::table('um_user_permissions as up')->join('um_permissions as p', 'p.id', '=', 'up.permission_id', )->where('user_id', $user_id)->where('p.category', 'report')->pluck('p.name')->toArray();
            if (count($umM_prms) > 0) {
                $include = ' AND name IN (\'' . implode('\',\'', $umM_prms) . '\')';
            } else {
                $include = ' AND 1 = 0';
            }

        }
        $report_hidden = DBX::ifNull('rpt.hidden', 'value:0');
        $rows = DB::select("SELECT id, name, hidden,code,category,rpt.module_id,rpt.description,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE $report_hidden = 0 $include ORDER BY rpt.category,rpt.display_order ASC");

        $i = 0;
        foreach ($rows as $row) {
            $str_filters = explode('|', $row->params);
            $filterLabel = [];
            $keys = [];
            foreach ($str_filters as $filter) {

                //** return match index to replace filter name */
                $found = array_search($filter, $get_arr_key_keys);
                if ($found !== false && isset($get_arr_key_names[$found]))
                    $label = $get_arr_key_names[$found];
                else
                    $label = ucwords(str_replace('_', ' ', $filter));


                $key = ucwords(str_replace('_', ' ', $filter));

                $filterLabel[] = $label;
                $keys[] = $key;
            }

            $row->filters = $self->createMulKeyValue('name', $filterLabel, $self->createKeyValue('key', self::stringToKeyCase($keys)));
            $i++;
        }
        return $rows;
    }
    static function createKeyValue($key_name, $arr)
    {
        $result = [];
        foreach ($arr as $d) {
            $result[] = [$key_name => $d];
        }
        return $result;
    }
    static function createMulKeyValue($key_name, $arr, $bonus_data = null)
    {
        $result = [];
        $count = count($arr);

        foreach ($arr as $index => $header) {
            $headerData = [$key_name => $header];

            if (isset($bonus_data[$index])) {
                foreach ($bonus_data[$index] as $bonus_key => $bonus_value) {
                    $headerData[$bonus_key] = $bonus_value;
                }
            }

            $result[] = $headerData;
        }

        return $result;
    }
    static function stringToKeyCase($cnvtString, $bonus_string = null, $front = 1)
    {

        $removeSpecialChars = function ($str) {
            $pattern = '/[^a-zA-Z0-9\s' . preg_quote('_', '/') . ']/u';
            return preg_replace($pattern, '', $str);
        };
        $bonus_string = $removeSpecialChars(strtolower($bonus_string));
        if (is_array($cnvtString)) {

            $result = [];
            foreach ($cnvtString as $string) {
                $string = $removeSpecialChars($string);
                $convertedString = strtolower(str_replace(' ', '_', $string));

                if ($bonus_string) {
                    $result[] = $front == 1 ? $bonus_string . '_' . $convertedString : $convertedString . '_' . $bonus_string;
                } else {
                    $result[] = $convertedString;
                }
            }
            return $result;
        }
        $cnvtString = $removeSpecialChars($cnvtString);
        $convertedString = strtolower(str_replace(' ', '_', $cnvtString));

        if ($bonus_string) {
            return $front == 1 ? $bonus_string . '_' . $convertedString : $convertedString . '_' . $bonus_string;
        }
        return $convertedString;

    }
    function getTenantReportList($arr, $ss){
        $d = (object) $arr;
        $status_id = $d->status_id ?? null;
        $building_id = $d->building_id ?? null;
        $start_date = !empty($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = !empty($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $date_of_birth = DBX::formatDate('t.date_of_birth','date_of_birth');
        $str_search = '1=1';
        $str_between_date =  '1=1';
        if($start_date && $end_date){
            $str_between_date = "DATE(t.created_at) BETWEEN '$start_date' AND '$end_date'";
        }
        if($status_id){
            $str_search .= " AND t.status_id = $status_id";
        }
        if($building_id){
            $str_search .= " AND bs.building_id = $building_id";
        }

        $rows = DB::table('tenants as t')
            ->leftJoin('tenant_statuses as ts','ts.id','=','t.status_id')
            ->leftJoin('contracts as c','c.tenant_id','=','t.id')
            ->leftJoin('building_spaces as bs','bs.id','=','c.space_id')
            ->leftJoin('buildings as b','b.id','=','bs.building_id')
            ->when($status_id, function ($q) use ($status_id) {
                $q->where('t.status_id', $status_id);
            })
            ->when($building_id, function ($q) use ($building_id) {
                $q->where(function ($q) use ($building_id) {
                    $q->where('bs.building_id', $building_id)
                    ->orWhereNull('bs.building_id'); // include no contract tenants
                });
            })
            ->whereRaw($str_between_date)
            ->selectRaw("t.id,t.name,t.code,t.national_id,t.passport_number,{$date_of_birth},t.nationality_id,t.photo_file_name,t.sex,t.tenant_type,t.status_id,ts.name AS status,t.legal_name,t.phone_number,t.email,t.address,bs.code as unit,b.name as building")->get();
        foreach ($rows as $row) {
            $row->image_url = '';
            if (!empty($row->photo_file_name)) {
                $row->image_url = Tenant::profilePicture($row->id,$ss);
            }
            unset($row->photo_file_name);
        }
        $statusLabels = [
            1 => '(Not yet get contract)',
            2 => '(Already got contract)',
            3 => '(Already moved out)',
        ];
        $title = 'Tenant List Report' . ($statusLabels[$status_id] ?? '(All Statuses)');
        $sub_title = $start_date && $end_date ? date('d-M-Y', strtotime($start_date)) .' to '. date('d-M-Y', strtotime($end_date)) : 'All Statuses';
        $date_rank = (object)[];
        if($start_date && $end_date ){
            $date_rank->start_date = date('d-M-Y', strtotime($start_date)) ;
            $date_rank->end_date = date('d-M-Y', strtotime($end_date)) ;
        }
        return (object) [
            'list' => $rows,
            'title' => trim($title),
            'sub_title' => $sub_title,
            'date_rank' => $date_rank,
            'form' => 'tenant_list',
            'company_profile' => self::getCompanyInfo($ss),
        ];
    }
    
    function getTotalPaymentHistory($arr, $ss)
{
    $d = (object) $arr;

       $start_date = !empty($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = !empty($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $payment_date = DBX::formatDate('bp.payment_date','payment_date');
        $str_search = '1=1';
        $str_between_date =  '1=1';
        if($start_date && $end_date){
            $str_between_date = "DATE(bp.payment_date) BETWEEN '$start_date' AND '$end_date'";
        }

    $rows = DB::table('bill_payments as bp')
        ->leftJoin('bills as b', 'b.id', '=', 'bp.bill_id')
        ->leftJoin('vendors as v', 'v.id', '=', 'b.vendor_id')
        ->leftJoin('expense_categories as ex', 'ex.id', '=', 'b.expense_type_id')
        ->leftJoin('bill_payment_statuses as ps', 'ps.id', '=', 'bp.status_id')
        ->leftJoin('bill_payment_breakdowns as bpb', 'bpb.bill_payment_id', '=', 'bp.id')
        ->where('bp.status_id', 1)
        ->whereRaw($str_between_date)
        ->selectRaw("
            bp.id,
            bp.bill_id,
            b.bill_number,
            v.name as vendor_name,
            b.expense_type_id,
            ex.name as expense_type_name,
            $payment_date,
            bp.total_amount as amount,
            bp.payer,
            b.ref_no,
            bp.currency_code,
            bp.note as remark,
            b.total_amount,
            b.paid_amount,
            b.balance,
            b.due_date,
            bp.status_id,
            ps.name as payment_status,
            bp.create_user,
            bp.update_user,
            bp.created_at,
            bp.updated_at,
            GROUP_CONCAT(
                CONCAT(bpb.method,' ',bpb.amount,'$')
                ORDER BY bpb.amount
                SEPARATOR ', '
            ) as payment_method
        ")
        ->groupBy('bp.id')
        ->get();
    foreach($rows as $row){
        $row->amount = '$' . number_format($row->amount, 2);
        $row->total_amount = '$' . number_format($row->total_amount, 2);
        $row->paid_amount = '$' . number_format($row->paid_amount, 2);
        $row->balance = '$' . number_format($row->balance, 2);
    }

    $title = 'Payment History Report';

    $sub_title = ($start_date && $end_date)
        ? date('d-M-Y', strtotime($start_date)) . ' to ' . date('d-M-Y', strtotime($end_date))
        : 'All Dates';

    $date_rank = (object)[];

    if ($start_date && $end_date) {
        $date_rank->start_date = date('d-M-Y', strtotime($start_date));
        $date_rank->end_date = date('d-M-Y', strtotime($end_date));
    }

    return (object)[
        'list' => $rows,
        'title' => $title,
        'sub_title' => $sub_title,
        'date_rank' => $date_rank,
        'form' => 'total_payment_history',
        'company_profile' => self::getCompanyInfo($ss),
    ];
}

function getVendorPaymentReport($arr, $ss)
    {
        $d = (object) $arr;
        $vendor_id = isset($d->vendor_id) ? $d->vendor_id : null;
        // if (!$vendor_id)
        //     return DV::error('Vendor must be selected');
        $payment_date = DBX::formatDate('bp.payment_date','payment_date');
        $vendor = DB::table('vendors')->where('id',$vendor_id)->selectRaw('id,address,name,phone_number,contact_person,contact_phone')->get()->first();
        $rows = DB::table('bills as b')
            ->where('b.vendor_id',$vendor_id)
            ->join('bill_payments as bp', 'bp.bill_id', '=', 'b.id')
            ->selectRaw("b.id,$payment_date,b.ref_no, b.total_amount,b.paid_amount,b.balance")->get();
        foreach($rows as $row){
            $row->total_amount = '$' . number_format($row->total_amount, 2);
            $row->paid_amount = '$' . number_format($row->paid_amount, 2);
            $row->balance = '$' . number_format($row->balance, 2);
        }

        $res = (object) [
            'form' => 'vendor_payment_list',
            'vendor_info' => $vendor,
            'list' => $rows,
            'title' => 'Vendor Payment',
            'sub_title' => '',
            'company_profile' => self::getCompanyInfo($ss)
        ];
        return DV::success(['data' => $res]);
    }
   
public static function getTenantDepositList($arr, $ss)
{
    $d = (object)$arr;
    $is_paid = isset($d->status_id) ? (int)$d->status_id : null;

    $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
    $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
    $str_date = "DATE(d.deposit_date) >= '$start_date' AND DATE(d.deposit_date) <= '$end_date'";
    $sub_title = 'Deposit Date From: ' . date('d-M-Y', strtotime($start_date)) . ' To ' . date('d-M-Y', strtotime($end_date));

    $str_search = '1=1';
    if ($is_paid !== null) $str_search .= ' AND d.status_id = ' . $is_paid;

    $rows = DB::table('deposits as d')
        ->join('tenants as t', 'd.tenant_id', '=', 't.id')
        ->selectRaw("
            t.code as tenant_code,
            t.name as tenant_name,
            d.deposit_date,
            d.amount,
            d.paid_amount,
            d.status_id,
            d.remarks,
            d.created_at as payment_date,
            d.updated_at as updated_date
        ")
        ->whereRaw($str_search)
        ->whereRaw($str_date)
        ->get();
    foreach($rows as $row){
        $row->amount = '$' . number_format($row->amount, 2);
        $row->paid_amount = '$' . number_format($row->paid_amount, 2);
         $row = setOfficialDates($row, ['deposit_date'], [''], ['']);
    }
    
    $statusLabel = '(All)';

    switch ($is_paid) {
        case 1:
            $statusLabel = '(Pending)';
            break;
        case 2:
            $statusLabel = '(Paid)';
            break;
        case 3:
            $statusLabel = '(Refunded)';
            break;
    }
    $title = $statusLabel . ' Tenant Deposit Report';

    $startDate = date('d-M-Y', strtotime($start_date));
    $endDate = date('d-M-Y', strtotime($end_date));
    $sub_title_2 = $startDate . ' To ' . $endDate;
    $date_rank = (object)[
        'start_date' => $startDate,
        'end_date' => $endDate
    ];

    $company_profile = self::getCompanyInfo($ss);

    return (object)[
        'title' => $title,
        'sub_title' => $sub_title,
        'sub_title_2' =>$sub_title_2,
        'date_rank' => $date_rank,
        'list' => $rows,
        'form' => 'deposit_list',
        'company_profile' => $company_profile
    ];
}
public static function getIncomeByCategories($arr, $ss)
{
    $d = (object) $arr;

    $header_list = [
        'Date',
        'Receipt No.',
        'Tenant Name',
        'Cash',
        'Transfer',
        'Cheque',
        'Card',
        'Remark'
    ];

    $keys = self::createKeyValue(
        'key',
        self::stringToKeyCase($header_list)
    );

    $header = self::createMulKeyValue(
        'name',
        $header_list,
        $keys
    );

    $company_profile = self::getCompanyInfo($ss);

    $start_date = !empty($d->start_date)
        ? convertDate($d->start_date)
        : date('Y-m-01');

    $end_date = !empty($d->end_date)
        ? convertDate($d->end_date)
        : date('Y-m-t');

    $rows = DB::table('invoices as v')
        ->join('receipts as r', 'r.invoice_id', '=', 'v.id')
        ->join('tenants as t', 't.id', '=', 'v.tenant_id')
        ->join('invoice_items as i', 'i.invoice_id', '=', 'v.id')
        ->whereBetween(DB::raw('DATE(r.receipt_date)'), [$start_date, $end_date])
        ->select(
            'r.id as receipt_id',
            'r.code as receipt_no',
            'r.receipt_date',
            't.name as tenant_name',
            'i.type',
            'v.general_remark'
        )
        ->groupBy(
            'r.id',
            'r.code',
            'r.receipt_date',
            't.name',
            'i.type',
            'v.general_remark'
        )
        ->orderBy('i.type')
        ->orderBy('r.receipt_date')
        ->get();

    $receiptPayments = DB::table('receipt_breakdowns')
        ->select('receipt_id', 'method', 'amount', 'cheque_number')
        ->get()
        ->groupBy('receipt_id');

    $typeNames = [
        'rent' => 'Rent',
        'utility' => 'Utility',
        'service_request' => 'Service Request',
        'service' => 'Service'
    ];

    $groupedData = [];

    $grandCash = 0;
    $grandTransfer = 0;
    $grandCheque = 0;
    $grandCard = 0;

    foreach ($rows as $row) {

        $category = $typeNames[$row->type]
            ?? ucwords(str_replace('_', ' ', $row->type));

        if (!isset($groupedData[$category])) {
            $groupedData[$category] = [
                'fee_type' => $category,
                'fee' => [],
                'cash_total' => 0,
                'transfer_total' => 0,
                'cheque_total' => 0,
                'card_total' => 0,
            ];
        }

        $cash = 0;
        $transfer = 0;
        $cheque = 0;
        $card = 0;

        $payments = $receiptPayments[$row->receipt_id] ?? [];

        foreach ($payments as $payment) {

            switch (strtolower($payment->method)) {

                case 'cash':
                    $cash += $payment->amount;
                    break;
                    
                case 'transfer':
                    $transfer += $payment->amount;
                    break;

                case 'cheque':
                    $cheque += $payment->amount;
                    break;

                case 'card':
                    $card += $payment->amount;
                    break;
            }
        }

        // GROUP TOTALS
        $groupedData[$category]['cash_total'] += $cash;
        $groupedData[$category]['transfer_total'] += $transfer;
        $groupedData[$category]['cheque_total'] += $cheque;
        $groupedData[$category]['card_total'] += $card;

        // GRAND TOTALS
        $grandCash += $cash;
        $grandTransfer += $transfer;
        $grandCheque += $cheque;
        $grandCard += $card;

        $groupedData[$category]['fee'][] = (object)[
            'date' => date('d-M-Y', strtotime($row->receipt_date)),
            'receipt_no' => $row->receipt_no,
            'tenant_name' => $row->tenant_name,
            'cash' => $cash,
            'transfer' => $transfer,
            'cheque' => $cheque,
            'card' => $card,
            'remark' => $row->general_remark,
        ];
    }

    // FORMAT GROUP TOTALS
    foreach ($groupedData as &$group) {

        $group['total_cash'] = '$' . number_format($group['cash_total'], 2);
        $group['total_transfer'] = '$' . number_format($group['transfer_total'], 2);
        $group['total_cheque'] = '$' . number_format($group['cheque_total'], 2);
        $group['total_card'] = '$' . number_format($group['card_total'], 2);

        $group['total'] = '$' . number_format(
            $group['cash_total']
            + $group['transfer_total']
            + $group['cheque_total']
            + $group['card_total'],
            2
        );

        unset(
            $group['cash_total'],
            $group['transfer_total'],
            $group['cheque_total'],
            $group['card_total']
        );

        $group['sub_label'] = 'Sub Total';
    }

    $fee_totals = [
        'cash' => '$' . number_format($grandCash, 2),
        'transfer' => '$' . number_format($grandTransfer, 2),
        'cheque' => '$' . number_format($grandCheque, 2),
        'card' => '$' . number_format($grandCard, 2),
        'total' => '$' . number_format(
            $grandCash + $grandTransfer + $grandCheque + $grandCard,
            2
        ),
        'label' => 'Grand Total',
        'sub_label' => 'Sub Total'
    ];

    $date_rank = (object)[
        'start_date' => date('d-M-Y', strtotime($start_date)),
        'end_date' => date('d-M-Y', strtotime($end_date))
    ];

    return (object)[
        'header' => $header,
        'title' => 'Income By Category',
        'sub_title_2' => $date_rank->start_date . ' To ' . $date_rank->end_date,
        'date_rank' => $date_rank,
        'form' => 'income_by_category',
        'list' => [
            'all_fee' => array_values($groupedData),
            'fee_totals' => $fee_totals
        ],
        'company_profile' => $company_profile
    ];
}

}
