<?php

namespace App\Models\Mhr;

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

    function getEmployeeMovementReport($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Position', 'Impact', 'Event', 'Event Date'];
        $key_list = ['code', 'name', 'position', 'impact', 'event_name', 'event_date'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $emp_id = $d->emp_id ?? null;
        $event_id = $d->event_id ?? null;

        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');

        $str_moreWheres = '2=2';
        if ($emp_id) {
            $str_moreWheres = 'emp.id = ' . $emp_id;
        }
          if ($event_id) {
            $str_moreWheres = 'ev.event_id = ' . $event_id;
        }

        $col_event_date = DBX::formatDate('ev.event_date', 'event_date');

        $query = DB::table('emp_events as ev')
            ->join('employees as emp', 'ev.emp_id', '=', 'emp.id')
            ->join('events as em', 'ev.event_id', '=', 'em.id')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw(
                '
            emp.id, 
            ev.impact,
            em.id as event_id,
            em.name as event_name,
            pos.name as position,
            emp.emp_type_id,
            emp.name,
            emp.code,
            ' . $col_event_date
            )
            ->whereRaw($str_moreWheres);

        if ($start_date && $end_date) {
            $query->whereBetween('ev.event_date', [$start_date, $end_date]);
        }
        $rows = $query->get();
        $groupedData = ['data' => $rows->map(function ($row) {
            unset($row->id);
            return $row;
        })];

        $title = 'Employee Movement Report';
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';

        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss)
        ];
    }
    function getEmployeeBenefitsReport($filter, $ss = null)
    {
        $header_list = ['No', 'Name', 'Benefit Type', 'Balance', 'Currency', 'Amount', 'Tax Option', 'Flat Tax Rate', 'Remarks'];
        $key_list = ['no', 'name', 'benefit_type', 'balance', 'currency', 'amount', 'tax_option_id', 'flat_tax_rate', 'remarks'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = $d->campus_id ?? null;
        $branch_id = $d->branch_id ?? $campus_id;
        $staff = $d->staff ?? null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');

        $str_branch_id = '2=2';
        if ($branch_id) {
            $str_branch_id = 'emp.branch_id = ' . $branch_id;
        }

        $col_create_date = DBX::formatDate('b.created_at', 'create_date');
        $query = DB::table('emp_benefits as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
            ->selectRaw(
                'b.id, emp.id as emp_id, emp.name as name, b.currency_code as currency,
            b.benefit_id, bc.name as benefit_type, b.tax_option_id, b.flat_tax_rate, b.balance, b.amount, b.remarks, b.update_user, b.updated_at, ' . $col_create_date . ', emp.photo_file_name as emp_photo'
            )
            ->whereRaw($str_branch_id);
        if ($staff) {
            $query->where('emp.id', $staff);
        }
        if ($start_date && $end_date) {
            $query->whereBetween('b.created_at', [$start_date, $end_date]);
        }

        $rows = $query->get();

        $groupedData = [];
        foreach ($rows as $i => $row) {
            $row->no = $i + 1;
            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');

            $row->tax_option_id = match ($row->tax_option_id) {
                1 => 'Taxable',
                2 => 'Non Taxable',
                3 => 'Flat Rate',
                default => 'Unknown',
            };
            $row->flat_tax_rate = $row->flat_tax_rate ? $row->flat_tax_rate . '%' : '0%';
            $row->tax_base = ($row->tax_base ?? 0);
            $row->total_salary = ($row->total_salary ?? 0);
            $row->benefit = ($row->benefit ?? 0);
            $row->deduction = ($row->deduction ?? 0);
            $row->allowance = ($row->allowance ?? 0);
            unset($row->id);
        }

        $groupedData['data'] = $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Employee Benefits Report';
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';

        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss),
        ];
    }
    function getEmployeeList($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Position', 'Salary', 'sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;

        $emp_type_id = isset($d->emp_type_id) ? $d->emp_type_id : null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_search = '1=1';
        $str_between_date =  '1=1';
        if($start_date && $end_date){
            $str_between_date = "DATE(emp.created_at) BETWEEN '$start_date' AND '$end_date'";
        }
       
        if($emp_type_id){
            $str_search .= " AND emp.emp_type_id = $emp_type_id";
        }
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id, emp.work_shift_id, pos.name as position, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date,emp.status_id')
            ->whereRaw($str_between_date)
            ->whereRaw($str_search);
        $rows = $query->get();

        $groupedData = [];
        // $d = [];
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;
        $typeLabels = [
            1 => '(Internship)',
            2 => '(In Probation)',
            3 => '(Staff)',
        ];

        $title = 'Employee List Report';
        if ($emp_type_id && isset($typeLabels[$emp_type_id])) {
            $title .= ' - ' . $typeLabels[$emp_type_id];
        }

        $sub_title = ($start_date && $end_date)
            ? date('d-M-Y', strtotime($start_date)) . ' to ' . date('d-M-Y', strtotime($end_date))
            : 'All Dates';

        $title = 'Employee List Report ' . ($typeLabels[$emp_type_id] ?? '(All Types)');

        // $title = 'Tenant List Report' . ($statusLabels[$status_id] ?? '(All Statuses)');
        // $sub_title = $start_date && $end_date ? date('d-M-Y', strtotime($start_date)) .' to '. date('d-M-Y', strtotime($end_date)) : 'All Statuses';
        $date_rank = (object)[];
        if($start_date && $end_date ){
            $date_rank->start_date = date('d-M-Y', strtotime($start_date)) ;
            $date_rank->end_date = date('d-M-Y', strtotime($end_date)) ;
        }
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData, //$rows,//
            // 'company_profile' => self::getCompanyInfo($ss)
        ];
    }
   
    function getPayrollList($filter, $ss = null)
    {
        $header_list = ['Payroll', 'Employee', 'Salary', 'Taxable BFT', 'Nontaxable BFT	', 'BFT (Flat Tax)', 'Deduction', 'Allowance', 'Tax Rate', 'Bias', 'Tax Base', 'Benefit Tax', 'Total'];
        $key_list = ['payroll_name', 'employee', 'salary', 'benefit_taxable', 'benefit_non_tax', 'benefit_flat_rate', 'deduction', 'p_allowance', 'tax_rate', 'bias', 'tax_base', 'benefit_tax', 'disburse'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $emp_id = $d->emp_id ?? null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_search = '1=1';
        $str_between_date =  '1=1';
        if($start_date && $end_date){
            $str_between_date = "DATE(pl.created_at) BETWEEN '$start_date' AND '$end_date'";
        }
       
        if($emp_id){
            $str_search .= " AND pl.emp_id = $emp_id";
        }
   

        $query = DB::table('payroll_list as pl')
            ->join('employees as emp', 'emp.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->selectRaw('pl.id,
                    p.id as payroll_id,
                    p.name as payroll_name,
                    emp.id as emp_id,
                    emp.name as employee,
                    emp.created_at,
                    pos.name as emp_position,
                    pl.salary,
                    emp.apply_payroll_tax,
                    pl.payroll_id,
                    pl.p_allowance,
                    pl.benefit_taxable,
                    pl.benefit_non_tax,
                    pl.benefit_flat_rate,
                    pl.deduction,
                    pl.tax_rate,
                    pl.tax_base,
                    pl.created_at,
                    pl.benefit_tax,
                    pl.total_salary,
                    pl.disbursed,
                    emp.photo_file_name as emp_photo')
            ->whereRaw($str_between_date)
            ->whereRaw($str_search);
        $rows = $query->get();

        foreach ($rows as $row) {
            $row->employee = $row->employee . "<br><small>" . $row->emp_position . "</small>";
            unset($row->id);
        }

        $groupedData['data'] = $rows;

        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Payroll List Report';
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';

        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss),
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

                case 'bank':
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
            'cash' => '$' . number_format(floatval($cash ?? 0), 2),
            'transfer' => '$' . number_format(floatval($transfer ?? 0), 2),
            'cheque' => '$' . number_format(floatval($cheque ?? 0), 2),
            'card' => '$' . number_format(floatval($card ?? 0), 2),
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
