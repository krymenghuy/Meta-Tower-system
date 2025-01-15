<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\CompanyProfile;
use App\Models\DBX;
use App\Models\PublicStorage;

class Report
{
    protected $id = null, $ss = null;
    protected static $arr_escape_key_name = [
        //* key must be match to params if want to customize filter name,
        ['key' => 'group_id', 'name' => 'Group'],
        ['key' => 'term_id', 'name' => 'Term'],
        ['key' => 'campus_id', 'name' => 'Campus'],
        ['key' => 'is_paid', 'name' => 'Payment Option'],
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
    public function stringToKeyCase($input)
    {
        if (is_array($input)) {
            return array_map(function ($item) {
                return is_string($item) ? lcfirst($item) : $item;
            }, $input);
        }

        if (is_string($input)) {
            return lcfirst($input);
        }

        return $input; // Return as is for unsupported types
    }

    static function getCompanyInfo($ss)
    {
        $x = new CompanyProfile($ss);
        $p = (object)$x->getDetails($ss);
        $p->branches = [
            (object)['address_kh' => $p->address_kh ?? '', 'address' => $p->address ?? '', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''],
            (object)['address_kh' => 'ផ្ទះលេខ១២ ផ្លូវ៤៥៤ សង្កាត់ទួលទំពូងទី១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ', 'address' => '#16, St.454, Sangkat Toul Tum Poung 1, Khan Chamkarmon, Phnom Penh', 'phone_number' => $p->phone_number ?? '', 'email' => $p->email ?? ''],
        ];
        $p->phone_number = ($p->phone_number ?? '') . ' / ' . $p->first_cp_phone ?? '081 888 305';
        return $p;
    }

    static function list($ss)
    {
        $self = new Report();
        $get_arr_key_names = array_column(self::$arr_escape_key_name, 'name');
        $get_arr_key_keys = array_column(self::$arr_escape_key_name, 'key');
        $user_id = $ss->id;
        $include = '';
        if ($ss->is_system_admin != 1) {
            $umM_prms = DB::table('um_user_permissions as up')->join('um_permissions as p', 'p.id', '=', 'up.permission_id',)->where('user_id', $user_id)->where('p.category', 'report')->pluck('p.name')->toArray();
            if (count($umM_prms) > 0) {
                $include = ' AND name IN (\'' . implode('\',\'', $umM_prms) . '\')';
            } else {
                $include = ' AND 1 = 0';
            }
        }

        $rows = DB::select("SELECT id, `name`, `hidden`,code,category,rpt.module_id,rpt.description,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 $include ORDER BY rpt.category,rpt.display_order ASC");

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
                else $label = ucwords(str_replace('_', ' ', $filter));


                $key = ucwords(str_replace('_', ' ', $filter));

                $filterLabel[] = $label;
                $keys[] = $key;
            }

            $row->filters = $self->createMulKeyValue('name', $filterLabel, $self->createKeyValue('key', self::stringToKeyCase($key)));
            $i++;
        }
        return $rows;
    }
    function getEmployeeList($filter, $ss = null)
    {


        $header_list = ['Code', 'Name', 'Position', 'Salary', 'sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : $campus_id;
        $branch_ids = getAccessBranches($ss, $branch_id);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_branch_id = '2=2';
        if ($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if ($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id, emp.work_shift_id, pos.title as position, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
            // ->whereRaw($str_between_date)
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        // $d = [];
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;

        $title = 'Employee list by Branch Report';
        $sub_title = $start_date && $end_date ? $start_date . ' to ' . $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData, //$rows,//
            // 'company_profile' => self::getCompanyInfo($ss)
        ];
    }
    function getEmployeeListByType($filter, $ss = null)
    {


        $header_list = ['Code', 'Name', 'Position', 'Salary', 'sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : $campus_id;
        $branch_ids = getAccessBranches($ss, $branch_id);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if ($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if ($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        // $d = [];
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date . ' to ' . $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData, //$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getPayrollList($filter, $ss = null)
    {
        $header_list = ['Payroll', 'Employee', 'Salary', 'Taxable BFT', 'Nontaxable BFT	', 'BFT (Flat Tax)', 'Deduction', 'Allowance', 'Tax Rate', 'Bias', 'Tax Base', 'Benefit Tax', 'Total'];
        $key_list = ['payroll_name', 'employee', 'salary', 'benefit_taxable', 'benefit_non_tax', 'benefit_flat_rate', 'deduction', 'p_allowance', 'tax_rate', 'bias', 'tax_base', 'benefit_tax', 'disburse'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = $d->campus_id ?? null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $staff = $d->staff ?? null;
        $branch_id = $d->branch_id ?? $campus_id;
        $employee_name = $d->name ?? null;
        $str_branch_id = '2=2';

        if ($branch_id) {
            $str_branch_id = 'emp.branch_id = ' . $branch_id;
        }

        $query = DB::table('payroll_list as pl')
            ->join('employees as emp', 'emp.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'emp.branch_id')
            ->selectRaw('pl.id,
                    p.id as payroll_id,
                    p.name as payroll_name,
                    emp.id as emp_id,
                    emp.name as employee,
                    emp.created_at,
                    pos.title as emp_position,
                    b.name as branch_name,
                    pl.salary,
                    emp.apply_payroll_tax,
                    pl.payroll_id,
                    pl.p_allowance,
                    pl.benefit_taxable,
                    pl.benefit_non_tax,
                    pl.benefit_flat_rate,
                    pl.deduction,
                    pl.tax_rate,
                    pl.bias,
                    pl.tax_base,
                    pl.benefit_tax,
                    pl.total_salary,
                    pl.disburse,
                    emp.photo_file_name as emp_photo')
            ->whereRaw($str_branch_id);

        if ($staff) {
            $query->where('emp.id', $staff);
        }

        if ($employee_name) {
            $query->where('emp.name', 'LIKE', '%' . $employee_name . '%');
        }

        if ($start_date && $end_date) {
            $query->whereBetween('emp.created_at', [$start_date, $end_date]);
        }

        $rows = $query->get();

        foreach ($rows as $row) {
            $row->employee = $row->employee . "<br><small>" . $row->emp_position . "</small>";
            unset($row->id);
        }

        $groupedData['data'] = $rows;

        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Payroll List';
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

        $col_create_date = DBX::formatDate('b.create_date', 'create_date');
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
            $query->whereBetween('b.create_date', [$start_date, $end_date]);
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


    function getBranchInfo($branch_id = 0)
    {
        $branch_ids = getAccessBranches($ss, $branch_id);
        $rows = DB::table('um_branches AS b')->whereIn('b.branch_id', $branch_ids)->selectRaw("b.branch_id,b.logo_file_name,b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
        foreach ($rows as $row) {
            $user_class = "general";
            $category = "image";
            $dir = PublicStorage::getUrl($branch_id, $user_class, $category);
            $row->logo_url =  $dir . $row->logo_file_name;
            return $row;
        }
        return (object)array("name" => '(Company Name)', 'phone_number' => '(Unvailaible phone)', 'website' => 'Unvailable');
    }

    function getEmployeeMovementReport($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Email', 'Impact', 'Event Type', 'Event Date'];
        $key_list = ['code', 'name', 'email', 'impact', 'event_name', 'event_date'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = $d->campus_id ?? null;
        $branch_id = $d->branch_id ?? $campus_id;

        $branch_ids = getAccessBranches($ss, $branch_id);

        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');

        $str_branch_id = '2=2';
        if ($branch_id) {
            $str_branch_id = 'emp.branch_id = ' . $branch_id;
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
            pos.title as position_title,
            emp.emp_type_id,
            emp.name,
            emp.code,
            emp.email,
            ' . $col_event_date
            )
            ->whereRaw($str_branch_id);

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


    function getWalletAccountList($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Position', 'Account Type', 'Account Number', 'Balance', 'Currency Code', 'Balance Date'];
        $key_list = ['code', 'name', 'position_id', 'account_type', 'account_number', 'balance', 'currency_code', 'last_balance_date'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object) $filter;

        $campus_id = isset($d->campus_id) ? (int) $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? (int) $d->branch_id : $campus_id;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $staff = $d->staff ?? null;
        $branch_condition = $branch_id ? ['emp.branch_id' => $branch_id] : [];
        $date_condition = $start_date && $end_date ? [$start_date, $end_date] : null;

        $col_balance_date = DBX::formatTime('acc.last_balance_date', 'last_balance_date');

        $query = DB::table('accounts as acc')
        ->join('employees as emp', 'emp.id', '=', 'acc.emp_id')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw("
            emp.id,
            emp.work_shift_id,
            pos.title as position_id,
            acc.account_number,
            acc.balance,
            $col_balance_date,
            acc.currency_code,
            emp.name,
            emp.code,
            acc.account_type
        ")
        ->where($branch_condition)
            ->where('acc.account_type', 'Wallet');
        if ($staff) {
            $query->where('emp.id', $staff);
        }
        if ($date_condition) {
            $query->whereBetween('emp.created_at', $date_condition);
        }

        $rows = $query->get();

        foreach ($rows as $row) {
            unset($row->id);
        }

        $groupedData['data'] = $rows;

        $title = 'Employee Account Report';
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';

        return (object) [
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss),
        ];
    }

    function getEmployeeAccountReport($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Position', 'Account Type', 'Account Number', 'Balance', 'Currency Code', 'Balance Date'];
        $key_list = ['code', 'name', 'position_id', 'account_type', 'account_number', 'balance', 'currency_code', 'last_balance_date'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object) $filter;

        $campus_id = isset($d->campus_id) ? (int) $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? (int) $d->branch_id : $campus_id;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $staff = $d->staff ?? null;
        $branch_condition = $branch_id ? ['emp.branch_id' => $branch_id] : [];
        $date_condition = $start_date && $end_date ? [$start_date, $end_date] : null;

        $col_balance_date = DBX::formatTime('acc.last_balance_date', 'last_balance_date');

        $query = DB::table('accounts as acc')
            ->join('employees as emp', 'emp.id', '=', 'acc.emp_id')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw("
            emp.id,
            emp.work_shift_id,
            pos.title as position_id,
            acc.account_number,
            acc.balance,
            $col_balance_date,
            acc.currency_code,
            emp.name,
            emp.code,
            acc.account_type
        ")
            ->where($branch_condition);
        if ($staff) {
            $query->where('emp.id', $staff);
        }
        if ($date_condition) {
            $query->whereBetween('emp.created_at', $date_condition);
        }
        if ($start_date && $end_date) {
            $query->whereBetween('emp.created_at', [$start_date, $end_date]);
        }
        $rows = $query->get();

        foreach ($rows as $row) {
            unset($row->id);
        }

        $groupedData['data'] = $rows;

        $title = 'Employee Account Report';
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';

        return (object) [
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss),
        ];
    }


    function getForEachAccount($filter, $ss = null)
    {


        $header_list = ['Code', 'Name', 'Position', 'Salary', 'sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : $campus_id;
        $branch_ids = getAccessBranches($ss, $branch_id);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_branch_id = '2=2';
        if ($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        if ($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'For each account';
        $sub_title = $start_date && $end_date ? $start_date . ' to ' . $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getPayslipPrint($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Position', 'Salary', 'Sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $emp_id = isset($d->emp_id) ? $d->emp_id : null;
        // $branch_id = isset($d->branch_id) ? $d->branch_id : (isset($d->campus_id) ? $d->campus_id : null);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $joining_date = DBX::formatDate('emp.joining_date', 'joining_date');
        $formatted_start_date = date('d-M-Y', strtotime($start_date));
        $formatted_end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Payslip Print';
        $sub_title = "$formatted_start_date to $formatted_end_date";

        $query = DB::table('payroll_list as pl')
            ->join('employees as emp', 'emp.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'emp.branch_id')
            ->leftJoin('payroll_list_benefits as plb', function ($join) {
                $join->on('plb.emp_id', '=', 'pl.emp_id')
                    ->on('plb.payroll_id', '=', 'pl.payroll_id');
            })
            ->selectRaw("
            pl.id,
            p.id as payroll_id,
            p.name as payroll_name,
            '$start_date' as start_date,
            '$end_date' as end_date,
            '$sub_title' as duration,
            emp.id as emp_id,
            emp.code as emp_code,
            emp.name as emp_name,
            emp.sex,
            emp.apply_payroll_tax,
            pos.title as emp_position,
            b.name as branch_name,
            pl.p_salary,
            pl.benefit_taxable,
            pl.benefit_non_tax,
            pl.benefit_flat_rate,
            pl.count_day,
            plb.tax_option_id,
            pl.p_allowance,
            pl.deduction,
            pl.tax_rate,
            pl.tax_base,
            pl.benefit_tax,
            pl.total_salary,
            $joining_date,
            emp.photo_file_name as emp_photo
        ")
            ->where('emp.id', $emp_id);

        $rows = $query->get();

        foreach ($rows as $row) {
            unset($row->id);
            $row->image_url = $row->emp_photo
                ? Employee::profilePicture($row->emp_id)
                : '';
            unset($row->emp_photo);
        }
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'payslip_print',
            'header' => $headers,
            'data' => $rows,
            'company_profile' => CompanyProfile::details($ss),
        ];
    }


    function getPrintEmployeeCV($filter, $ss = null)
    {
        $header_list = ['Name', 'Kh name', 'Position', 'Email', 'Sex', 'Phone Number', 'Address', 'Action'];
        $key_list = ['name', 'name_kh', 'position_id', 'email', 'sex', 'phone_number', 'address', 'action'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $emp_id = isset($d->emp_id) ? $d->emp_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : (isset($d->campus_id) ? $d->campus_id : null);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $joining_date = DBX::formatDate('emp.joining_date', 'joining_date');

        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->join('loc_countries as loc', 'loc.id', '=', 'emp.nationality_id')
            ->selectRaw('
        emp.id as emp_id,
        emp.work_shift_id,
        pos.title as position_id,
        emp.salary,
        emp.emp_type_id,
        emp.name,
        emp.name_kh,
        emp.phone_number,
        emp.code,
        emp.sex,
        emp.email,
        emp.address,
        loc.nationality,
        loc.name as country,
        emp.address,
        ' . $joining_date . ',
        emp.photo_file_name as emp_photo
    ')
            ->where('emp.id', $emp_id);


        if ($branch_id) {
            $query->where('emp.branch_id', $branch_id);
        }

        $rows = $query->get();

        $emp_skills = DB::table('emp_skills as es')
            ->join('skills as s', 's.id', '=', 'es.skill_id')
            ->selectRaw('es.id, s.title as skill, es.rate, s.description')
            ->where('es.emp_id', $emp_id)
            ->get();

        $emp_exp = DB::table('emp_experiences as exp')
            ->join('positions as pos', 'pos.id', '=', 'exp.position_id')
            ->join('organizations as org', 'org.id', '=', 'exp.organization_id')
            ->selectRaw('pos.title as position, org.name as organization, exp.period_type, exp.description')
            ->where('exp.emp_id', $emp_id)
            ->get();

        $emp_edu = DB::table('emp_educations as e')
            ->join('schools as s', 's.id', '=', 'e.school_id')
            ->join('edu_levels as l', 'l.id', '=', 'e.edu_level_id')
            ->selectRaw('s.name as school, l.name as edu_level, e.major, e.start_year, e.finish_year')
            ->where('e.emp_id', $emp_id)
            ->get();

        foreach ($rows as $row) {
            $row->image_url = $row->emp_photo
                ? Employee::profilePicture($row->emp_id)
                : '';
            unset($row->emp_photo);
            $row->skills = $emp_skills;
            $row->experiences = $emp_exp;
            $row->educations = $emp_edu;
        }

        $formatted_start_date = date('d-M-Y', strtotime($start_date));
        $formatted_end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Print Employee CV';
        $sub_title = "$formatted_start_date to $formatted_end_date";

        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'print_employee_CV',
            'header' => $headers,
            'data' => $rows,
            'company_profile' => CompanyProfile::details($ss),
        ];
    }


    function getPayrollExpensesByMonth($filter, $ss = null)
    {

        $header_list = ['Code', 'Name', 'Position', 'Salary', 'sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : $campus_id;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_branch_id = '2=2';
        if ($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        if ($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Payroll Expenses by month';
        $sub_title = $start_date && $end_date ? $start_date . ' to ' . $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getEmployeeAttendanceSummary($filter, $ss = null)
    {


        $header_list = ['Code', 'Name', 'Position', 'Salary', 'sex', 'Joining Date', 'Email', 'Nationality', 'Address'];
        $key_list = ['code', 'name', 'position', 'salary', 'sex', 'joining_date', 'email', 'nationality', 'address'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : $campus_id;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_branch_id = '2=2';
        if ($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if ($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Attendance Summary';
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData, //$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getEmployeeAttendance($filter, $ss = null)
    {
        $header_list = ['Code', 'Name', 'Position', 'Scan Time', 'Scan Action', 'Scan Date', 'Action'];
        $key_list = ['code', 'name', 'position_id', 'scan_time', 'scan_action', 'attendance_date', 'action_type'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object) $filter;

        $campus_id = isset($d->campus_id) ? (int) $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? (int) $d->branch_id : $campus_id;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $staff = $d->staff ?? null;
        $branch_condition = $branch_id ? ['emp.branch_id' => $branch_id] : [];
        $col_attendance_date = DBX::formatDate('at.attendance_date', 'attendance_date');
        $query = DB::table('emp_attendances as at')
            ->join('employees as emp', 'emp.id', '=', 'at.emp_id')
            ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
            ->selectRaw("
            emp.id,
            emp.work_shift_id,
            pos.title as position_id,
            emp.salary,
            emp.emp_type_id,
            at.scan_time,
            at.scan_action,
            emp.name,
            emp.code,
            $col_attendance_date,
            at.action_type
        ")
            ->where($branch_condition)
            ->whereBetween('at.attendance_date', [$start_date, $end_date]);
        if ($staff) {
            $query->where('emp.id', $staff);
        }
        $rows = $query->get();
        foreach ($rows as $row) {
            unset($row->id);
        }
        $groupedData['data'] = $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Attendance Report';
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';
        return (object) [
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,
            'company_profile' => CompanyProfile::details($ss),
        ];
    }
    function createKeyValue($key_name, $arr)
    {
        $result = [];
        foreach ($arr as $d) {
            $result[] = [$key_name => $d];
        }
        return $result;
    }

    function createMulKeyValue($key_name, $arr, $bonus_data = null)
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

    /**
     * return list of invoice payments (date to date)
     * $arr = {term_id,start_date,end_date}
     *
     */
    function attendanceListReport($arr = [], $ss = null)
    {
        $ss = $ss ? $ss : $this->ss;
        $d = (object)$arr;
        $group_id = isset($d->group_id) ? $d->group_id : null;
        if (!$group_id) return DV::error('Group ID is required');
        $existGroup = DB::table('student_groups')->where('id', $group_id)->exists();
        if (!$existGroup) return DV::error('Group not found');

        $session_date = isset($d->session_date) ? date('Y-m-d', strtotime($d->session_date)) : null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $limit = isset($d->limit) ? $d->limit : 6;
        $is_shortMonthName = isset($d->short_month_name) ? $d->short_month_name : false;
        $aToz = isset($d->a_to_z) ? $d->a_to_z : null;
        $row = DB::table('student_groups as sg')->where('sg.id', $group_id)
            ->selectRaw('sg.id as group_id,sg.campus_id,sg.level_id,sg.session_id')->first();

        if ($start_date && $end_date) {
            $row->whereBetween('emp.created_at', [$start_date, $end_date]);
        }
        $rows = $row->get();
        foreach ($rows as $row) {
            $row->employee = $row->employee . "<br><small>" . $row->emp_position . "</small>";
            unset($row->id);
        }
        $groupedData['data'] = $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Attendance List';
        $sub_title = $start_date && $end_date ? "$start_date to $end_date" : 'N/A to N/A';

        return (object) [
            'title' => $title,
            "session_date" => $session_date,
            "a_to_z" => $aToz,
            "limit" => $limit,
            'sub_title' => $sub_title,
            'list' => $groupedData,
            'short_month_name' => $is_shortMonthName,
        ];
        // $row->form = 'customize';
        // $row->program = GeneralSettings::getProgramByLevel($row->level_id,$ss)->name;
        // $row->campus = GeneralSettings::getCampus($row->campus_id)->name;
        // $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
        // $row->session = GeneralSettings::getSession($row->session_id)->name;
        // $row-> count_students = $this->countGroupMembers($group_id,$ss);
        // $row->session_date = $this->studentGroupAttendanceReport($group_id,$arr_report,$ss);

        // return $row;

    }
    function getDailyCash($filter, $ss)
    {

        //** create table headers and keys */
        $header_list = ['Date', 'Receipt No.', 'Student Name', 'Sex', 'Dis.', 'Period'];
        $key_list = ['pmt_date', 'receipt_number', 'name', 'sex', 'discount', 'period'];
        // $obj = self::getOtherFeesList(1);
        $obj = self::getFeeCategory(0);

        $header_list = array_merge($header_list, $obj['header_list']);
        $key_list = array_merge($key_list, $obj['key_list']);
        $header_list = array_merge($header_list, ['Total']);
        $key_list = array_merge($key_list, ['Total']);
        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);


        //**---- */
        $selectInvoice = 'i.academic_year,i.invoice_number,i.id as invoice_id,formatDate(i.pmt_date) as pmt_date,DATE(i.pmt_date) as date,i.receiver,i.receiver_uid,i.currency_code';
        $d = (object)$filter;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $branch_id = isset($d->branch_id) ? $d->branch_id : $campus_id;
        $branch_ids = getAccessBranches($ss, $branch_id);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $receiver_id = isset($d->receiver_id) ? $d->receiver_id : null;
        $str_between_date = '1=1';
        if ($start_date && $end_date) $str_between_date = 'DATE(i.pmt_date) >= \'' . $start_date . '\' AND DATE(i.pmt_date) <= \'' . $end_date . '\'';
        $str_search = '1=1';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if ($campus_id) $str_search .= ' AND e.campus_id = ' . $campus_id;
        if ($receiver_id) $str_search .= ' AND i.receiver_id = ' . $receiver_id;

        $rows = DB::table('invoices as i')
            ->join('receipts as r', 'r.invoice_id', '=', 'i.id')
            ->join('students as s', 's.id', '=', 'i.student_id')
            ->join('enrollments as e', 'e.student_id', '=', 's.id')
            ->join(DBX::$branch_table . ' as c', 'c.id', '=', 'e.campus_id')
            ->whereRaw('ifnull(i.inactive,0)=0')
            ->selectRaw($selectInvoice . ',c.name as campus,s.id as student_id,s.name,s.sex,r.receipt_number')
            ->whereRaw($str_between_date)
            ->whereIn('i.branch_id', $branch_ids)->whereRaw($str_search)->distinct()->get();
        $str_date = 'WHERE v.pmt_date BETWEEN \'' . $start_date . '\' AND \'' . $end_date . '\'';
        $ivts = DB::select("SELECT i.start_date,i.end_date,i.fee_type_id,displayMoney(SUM(i.net_amount),'USD') as formatted_total,SUM(i.net_amount) as total,i.invoice_id FROM invoice_items i INNER JOIN invoices as v ON v.id = i.invoice_id $str_date GROUP BY i.fee_type_id,i.invoice_id,i.start_date,i.end_date");
        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        $campuses = [];
        foreach ($rows as $row) {
            //** get invoice items */
            // $row->period = formatDateString($row->start_date,$row->end_date,'md');
            $total = 0;
            foreach ($headers as $h) {
                $key = $h['key'];
                $feeName = $h['name'];
                // if($feeName == 'School Fee') $feeName = 'tuition_fee';
                if (!in_array($key, $key_list)) {
                    $fee_type_id =  DB::table('fee_types')->where('name', $feeName)->take(1)->value('id');
                    // $isSchoolFee = DB::table('fee_types')->where('id',$fee_type_id)->take(1)->value('name');
                    $item = self::getDailyCashDetails($ivts, $fee_type_id, $row->invoice_id);
                    $row->$key = $item->formatted_total;
                    $total += $item->total;
                    if (!isset($feeTotals[$key])) {
                        $feeTotals[$key] = 0;
                    }
                    // $d[] = $key;
                    $feeTotals[$key] += $item->total;
                    if ($item) {
                        if ($item->start_date && $item->end_date)
                            $row->period = formatDateString($item->start_date, $item->end_date, 'md');
                    } else $row->period = 'N/A';
                }
            }


            $row->total = '$' . $total;

            //* !self sum
            if (!in_array('total', $key_list)) {
                $feeTotals['total'] += round($total, 2);
            }

            $row->deposit = self::getDepositFee($row->student_id, $row->invoice_id);
            $campus = $row->campus;
            if (is_string($campus) && !in_array($campus, $campuses)) {
                $campuses[] = $row->campus;
            }
            unset($row->campus, $row->campus_id);
        }

        $groupedData['fee'] = $rows;

        if (empty($campuses)) {
            $campuses = DB::table(DBX::$branch_table . ' AS c')->whereRaw($campus_id ? 'id = ' . $campus_id : '1=1')->pluck('name')->toArray();
        }

        // add $ currency to each value of obj
        foreach ($feeTotals as $key => $value) {
            if (is_numeric($value)) {
                $feeTotals[$key] = '$' . number_format($value, 2);
            }
            $groupedData['fee_totals']['label'] = 'Total Cash Collection';
            $groupedData['fee_totals']['form'] = 'daily_cash';
        }

        $groupedData['fee_totals'] = $feeTotals;
        $groupedData['fee_totals']['label'] = 'Total Cash Collection';
        $groupedData['fee_totals']['form'] = 'daily_cash';

        $title = 'Daily Cash Collection Report (' . implode(', ', $campuses) . ')';
        $sub_title = $start_date && $end_date ? formatDate($start_date) . ' to ' . formatDate($end_date) : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData, //$rows,//
            'company_profile' => $this->getCompanyInfo($ss)
        ];
    }


    static function getShortMonthName($id)
    {
        $monthNames = [
            1 => 'Jan',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Apr',
            5 => 'May',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Aug',
            9 => 'Sep',
            10 => 'Oct',
            11 => 'Nov',
            12 => 'Dec'
        ];
        return $monthNames[$id];
    }
}
