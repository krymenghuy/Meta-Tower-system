<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\CompanyProfile;
use App\Models\DBX;
use App\Models\PublicStorage;

class Report {
    protected $id=null,$ss=null;
    protected static $arr_escape_key_name = [
        //* key must be match to params if want to customize filter name,
        ['key'=>'group_id','name'=>'Group'],
        ['key'=>'term_id','name'=>'Term'],
        ['key' => 'campus_id' ,'name' => 'Campus'],
        ['key' => 'is_paid' ,'name' => 'Payment Option'],
        ['key' => 'fee_type_id' ,'name' => 'Fee Type'],
        ['key' => 'program_id', 'name' => 'Program'],
        ['key' => 'receiver_uid','name' => 'Receiver'],
        ['key' => 'level_id','name' => 'Level'],
        ['key' => 'student_id','name' => 'Student'],
        ['key' => 'leave_type_id','name' => 'Leave Type'],
        ['key' => 'from_campus_id','name' => 'From Campus'],
        ['key' => 'to_campus_id','name' => 'To Campus'],
        ['key' => 'request_type_id','name' => 'Request Type']
    ];


    function __construct($id=null,$ss=null){
        $this->ss = $ss;
        $this->id = $id;
    }

    static function getCompanyInfo($ss){
        $x = new CompanyProfile($ss);
        $p = (object)$x->getDetails($ss);
        $p->branches = [
            (object)['address_kh' => $p->address_kh??'','address' => $p->address??'','phone_number' => $p->phone_number??'','email' => $p->email??''],
            (object)['address_kh' => 'ផ្ទះលេខ១២ ផ្លូវ៤៥៤ សង្កាត់ទួលទំពូងទី១ ខណ្ឌចំការមន រាជធានីភ្នំពេញ','address' => '#16, St.454, Sangkat Toul Tum Poung 1, Khan Chamkarmon, Phnom Penh','phone_number' => $p->phone_number??'','email' => $p->email??''],
        ];
        $p->phone_number = ($p->phone_number ?? '') .' / '. $p->first_cp_phone ?? '081 888 305';
        return $p;
    }

    static function list($ss){
        $self = new Report();
        $get_arr_key_names = array_column(self::$arr_escape_key_name, 'name');
        $get_arr_key_keys = array_column(self::$arr_escape_key_name, 'key');
        $user_id = $ss->id;
        $include = '';
        if($ss->is_system_admin!=1){
            $umM_prms = DB::table('um_user_permissions as up')->join('um_permissions as p','p.id','=','up.permission_id',)->where('user_id', $user_id)->where('p.category','report')->pluck('p.name')->toArray();
            if(count($umM_prms)> 0){
                $include = ' AND name IN (\'' . implode('\',\'', $umM_prms) . '\')';
            }else{
                $include = ' AND 1 = 0';
            }

        }

        $rows = DB::select("SELECT id, `name`, `hidden`,code,category,rpt.module_id,rpt.description,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 $include ORDER BY rpt.category,rpt.display_order ASC");

        $i=0;
        foreach($rows as $row){
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

            $row->filters = $self->createMulKeyValue('name',$filterLabel,$self->createKeyValue('key',self::stringToKeyCase($keys)));
            $i++;
        }
        return $rows;
    }
    function getEmployeeList($filter,$ss=null) {
    
       
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        // ->whereRaw($str_between_date)
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Branch Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            // 'company_profile' => self::getCompanyInfo($ss)
        ];
    } 
    function getEmployeeListByType($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 

    function getPayrollList($filter,$ss=null) {

    
        $header_list = ['No','Employee','Salary','Benefit','Deduction','Allowance','Tax Rate','Bias','Tax Base','Benefit Tax','	Total'];
        $key_list = ['no','employee','salary','benefit','deduction','allowance','tax_rate','bias','tax_base','benefit_tax','total_salary'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('payroll_list as pl')
            ->join('employees as e', 'e.id', '=', 'pl.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.position_id')
            ->join('payrolls as p', 'p.id', '=', 'pl.payroll_id')
            ->join('um_branches as b', 'b.id', '=', 'e.branch_id')
            ->selectRaw('pl.id,
                        p.id as payroll_id,
                        p.name as payroll_name,
                        e.id as emp_id,
                        e.name as employee,
                        pos.title as emp_position,
                        b.name as branch_name,
                        pl.salary,
                        e.apply_payroll_tax,
                        pl.benefit,
                        pl.deduction,
                        pl.tax_rate,
                        pl.bias,
                        pl.tax_base,
                        pl.benefit_tax,
                        pl.total_salary,
                        pl.disburse,
                        e.photo_file_name as emp_photo')
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $i=>$row){
            $row->no = $i+1;
            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');

            $row->tax_base = ($row->tax_base ?? 0);
            $row->total_salary = ($row->total_salary ?? 0);
            $row->benefit = ($row->benefit ?? 0);
            $row->deduction = ($row->deduction ?? 0);
            $row->allowance = ($row->allowance ?? 0);
            unset($row->id);
        }
        $groupedData['data']= $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Payroll list';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 

    function getEmployeeBenefitsReport($filter,$ss=null) {

    
        $header_list = ['No','Name','Benefit','Balance','Benefit Type','Amount','Tax Option','Flat Tax Rate','Remarks'];
        $key_list = ['no','name','benefit','balance','benefit_type','amount','tax_ption','flat_tax_rate','remarks'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('emp_benefits as b')
        ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
        ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
        ->selectRaw(
            'b.id, emp.id as emp_id, emp.name as name, emp.email as email, bc.name as benefit_name,
            b.benefit_type_id,b.benefit_id,b.tax_option_id,b.flat_tax_rate,b.balance, b.amount, b.remarks, b.update_user,b.updated_at, b.create_date, emp.photo_file_name as emp_photo'
        )
        ->orderBy('b.id', 'desc')
            ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $i=>$row){
            $row->no = $i+1;
            $row->allowance = DB::table('tax_allowances')
                ->where('emp_id', $row->emp_id)
                ->value('allowance');

            $row->tax_base = ($row->tax_base ?? 0);
            $row->total_salary = ($row->total_salary ?? 0);
            $row->benefit = ($row->benefit ?? 0);
            $row->deduction = ($row->deduction ?? 0);
            $row->allowance = ($row->allowance ?? 0);
            unset($row->id);
        }
        $groupedData['data']= $rows;
        $start_date = date('d-M-Y', strtotime($start_date));
        $end_date = date('d-M-Y', strtotime($end_date));
        $title = 'Payroll list';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getBranchInfo($branch_id=0){
        $branch_ids = getAccessBranches($ss,$branch_id);
        $rows = DB::table('um_branches AS b')->whereIn('b.branch_id',$branch_ids)->selectRaw("b.branch_id,b.logo_file_name,b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
         foreach($rows as $row) {
             $user_class="general";
             $category="image";
             $dir = PublicStorage::getUrl($branch_id,$user_class,$category);
             $row->logo_url =  $dir.$row->logo_file_name;
             return $row;
         }
         return (object)array("name"=>'(Company Name)','phone_number'=>'(Unvailaible phone)','website'=>'Unvailable');
    }

    function getEmployeeMovementReport($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getWalletAccountList($filter,$ss=null) {

    
        $header_list = ['No','Employee','Account Type','Account Number','Balance','Last Balance Date','Currency'];
        $key_list = ['no','emp_name','account_type','account_number','balance','last_balance_date','currency',];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $employee_id = isset($d->employee_id)?$d->employee_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'e.branch_id = ' . $branch_id;
        if($employee_id) $str_branch_id = 'e.id = ' . $employee_id;
        $balance_date = DBX::formatDate('a.last_balance_date', 'last_balance_date');

        $query = DB::table('accounts as a')
           ->join('employees as e', 'e.id', '=', 'a.emp_id')
           ->join('positions as pos', 'pos.id', '=', 'e.position_id')
           ->selectRaw('
               a.id,
               a.emp_id,
               e.name as emp_name,
               pos.title as position,
               a.account_type,
               a.account_number,
               a.balance,
               a.currency,
               ' . $balance_date . ',
               e.photo_file_name as emp_photo
           ')
           ->where('a.account_type', 'Wallet')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getEmployeeAccountReport($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getForEachAccount($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    }

    function getPayslipPrint($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 

    function getPrintEmployeeCV($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 

    function getPayrollExpensesByMonth($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 

    function getEmployeeAttendanceSummary($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 

    function getEmployeeAttendance($filter,$ss=null) {

    
        $header_list = ['Code','Name','Position','Salary','sex','Joining Date','Email','Nationality','Address'];
        $key_list = ['code','name','position','salary','sex','joining_date','email','nationality','address'];

        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_between_date = '1=1';
        $str_branch_id = '2=2';
        if($start_date && $end_date) $str_between_date = 'DATE(emp.created_at) >= \'' . $start_date . '\' AND DATE(emp.created_at) <= \'' . $end_date . '\'';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($branch_id) $str_branch_id = 'emp.branch_id = ' . $branch_id;
        $query = DB::table('employees as emp')
        ->join('positions as pos', 'emp.position_id', '=', 'pos.id')
        ->selectRaw('emp.id, emp.work_shift_id, pos.title as position_id, emp.salary, emp.emp_type_id, emp.name, emp.code, emp.sex, emp.email, emp.nationality_id,emp.address,emp.joining_date')
        ->whereRaw($str_branch_id);
        $rows = $query->get();

        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        foreach($rows as $row){
            unset($row->id);
        }
        $groupedData['data']= $rows;

        $title = 'Employee list by Type Report';
        $sub_title = $start_date && $end_date ? $start_date .' to '. $end_date : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => CompanyProfile::details($ss)
        ];
    } 


    function getScalarData_loan($loan_app_id=0,$loan_id=0){
        return (object)[
          'guarantor_name'=>'Mr.Guarntor',
          'guarantor_address'=>'BKK1',
          'guarantor_phone'=>'0124564565',
          'collateral_description'=>'iWatch a great one',
        ];

        // $table="collaterals as c";
        // $str_id="1=2";
        // if($loan_app_id>0){
        //     {
        //       $str_id ="c.loan_app_id = $loan_app_id";
        //       $table ="collaterals as c";
        //     }
        //  }else {
        //      $str_id ="c.loan_id =$loan_id";
        //      $table ="collaterals as c";
        //  }
        // $rows = DB::table($table)->whereRaw($str_id)->selectRaw("c.id,(select name from collateral_types where id = c.collateral_type_id LIMIT 1) AS collateral_type,c.description,c.estimated_value,c.identification_number,c.owner_name,Date_format(c.expiration_date,'%d %b %Y') as expiration_date")->get();
        // foreach($rows as $row) return $row;
    }

    function getDays($compound_cycle){
     switch($compound_cycle){
        case 'monthly':{
            return 30;
        }case 'day':{
            return 1;
        }
        case 'week':{
            return 7;
        }
        default:
        return 30;
     }
    }

    function getActivities($start_date,$end_date){
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        //$str_where ='DATE(r.updated_at) >=\''.$start_date.'\' AND DATE(r.updated_date) <=\''.$end_date.'\'';
        $str_where ='1=1';
        $cols ='r.id, r.term_id, r.student_id,t.`name` AS request_type, c.description,IFNULL(c.calculated_fee,0) AS amount,\'$\' AS currency_symbol, r.remarks, r.request_type_id,r.status_id ,r.authorized, r.auth_user, formatTime(r.auth_date) AS auth_date, formatTime(r.updated_at) AS updated_at,r.update_user';
        return DB::table('requests as r')->join('request_changes as c','c.request_id','=','r.id')->join('request_types AS t','t.id','=','r.request_type_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('r.id DESC')->get();
    }


    function getStudentList($term_id=0,$new_student=null){
        $term_id=$term_id?$term_id:0;
        $str_where ='t.id ='.$term_id;
        if($new_student==1) $str_where .=' AND e.is_new_student =1';
        $get_group_name =',(SELECT g.name FROM group_members AS gm INNER JOIN student_groups AS g ON g.id = gm.group_id WHERE gm.enrollment_id = e.id LIMIT 1) AS group_name';
        $cols ='e.id,st.id AS student_id,t.id AS term_id,st.name AS `student_name`, st.name_kh AS student_name_kh,st.code as student_code,st.sex,st.phone_number,(SELECT family_code FROM student_guardians WHERE student_id = st.id LIMIT 1) AS family_code'
        .',p.id AS program_id, l.id AS level_id,e.session_id,e.campus_id,t.`name` AS term_name, c.`name` AS campus_name,p.`name` AS program_name,l.`name` AS level_name'.$get_group_name.',formatDate(e.start_date) AS start_date, formatDate(e.tuition_end_date) AS tuition_end_date,e.status_id as pmt_status_id,e.enrollment_status_id,e.is_new_student';

        $studentList = DB::table('enrollments as e')
        ->join('students as st','st.id','=','e.student_id')
        ->join('terms as t','t.id','=','e.term_id')
        ->join('program_levels as l','l.id','=','e.level_id')
        ->join('sessions AS ss','ss.id','=','e.session_id')
        ->join(DBX::$branch_table.' AS c','c.id','=','e.campus_id')
        ->join('programs AS p','p.id','=','l.program_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('e.id DESC,st.id')->get();
        $header_list = ['Name','Name Kh','Sex','Term','Session','Program','Family ID'];
        $keys = ['name','name_kh','sex'];
        $key_props = $this->createKeyValue('key',$keys);
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);

        return (object)[
            'form' => 'simple',
            'headers' => $headers,
            'list' => $studentList
        ];
    }

    function createKeyValue($key_name,$arr){
        $result = [];
        foreach ($arr as $d) {
            $result[] = [$key_name => $d];
        }
        return $result;
    }

    function createMulKeyValue($key_name, $arr, $bonus_data=null) {
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

    function optionsTerm($acadmic_year=null,$ss){
        return GeneralSettings::options_term($acadmic_year,$ss);
    }

  /**
   * return list of invoice payments (date to date)
   * $arr = {term_id,start_date,end_date}
   *
  */
  function getInvoicePaymnents($arr=[]){
    $d = (object)$arr;
    $term_id =isset( $d->term_id)? $d->term_id:null;
    $start_date = isset($d->start_date) ? convertDate($d->start_date) :null;
    $end_date = isset($d->end_date) ? convertDate($d->end_date) :null;
    $str_where ='v.is_paid =1 AND v.paid_amount > 0 ';
    $get_family_code =',(SELECT family_code FROM student_guardians AS sg WHERE sg.student_id = st.id LIMIT 1) AS family_code';
    $cols = 'v.id,st.id AS student_id,st.name AS student_name, st.name_kh, st.code as student_code, st.phone_number'.$get_family_code.
    ',v.invoice_date AS issue_date, formatDate(v.due_date) AS due_date, v.invoice_number, v.branch_id, v.amount, v.due_amount, v.paid_amount,v.currency_code, v.is_paid,v.invoice_type, formatDate(v.pmt_date) AS pmt_date,note AS notes,v.purpose, CASE v.inactive WHEN 1 THEN \'Canceled\' ELSE \'Active\' END AS `status`, (CASE (v.is_paid AND v.paid_amount > 0) WHEN 1 THEN \'Paid\' ELSE \'Unpaid\' END) AS pmt_status, receiver,receiver_uid, formatTime(v.updated_at) AS updated_at,v.update_user';
    return DB::table('invoices as v')->join('students as st','st.id','=','v.student_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('v.invoice_date ASC,st.id')->get();
  }

  function getInvoiceList($arr=[]){
    $d = (object)$arr;
    $term_id =isset( $d->term_id)? $d->term_id:null;
    $start_date = convertDate(isset($d->start_date)?$d->start_date:null);
    $end_date = convertDate(isset($d->end_date)?$d->end_date:null);
    $status_id = isset($d->status_id)?$d->status_id:null;
    $str_where ='1=1';
    //if($term_id > 0) $str_where .=' AND v.term_id ='.$term_id;
    if($status_id > 0) $str_where .=' AND v.status_id ='.$status_id;

    $get_family_code =',(SELECT family_code FROM student_guardians AS sg WHERE sg.student_id = st.id LIMIT 1) AS family_code';
    $cols = 'v.id,st.id AS student_id,st.name AS student_name, st.name_kh, st.code as student_code, st.phone_number'.$get_family_code.
    ',v.invoice_date AS issue_date, formatDate(v.due_date) AS due_date, v.invoice_number, v.branch_id, v.amount, v.due_amount, v.paid_amount,v.currency_code,v.is_paid,v.invoice_type, formatDate(v.pmt_date) AS pmt_date,note AS notes,v.purpose, CASE v.inactive WHEN 1 THEN \'Canceled\' ELSE \'Active\' END AS `status`, (CASE (v.is_paid AND v.paid_amount > 0) WHEN 1 THEN \'Paid\' ELSE \'Unpaid\' END) AS pmt_status, receiver,receiver_uid, formatTime(v.updated_at) AS updated_at,v.update_user';
    return DB::table('invoices as v')->join('students as st','st.id','=','v.student_id')->whereRaw($str_where)->selectRaw($cols)->orderByRaw('v.invoice_date ASC,st.id')->get();
  }

  //** Attendance Report */

    function attendanceListReport($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $group_id =isset($d->group_id)?$d->group_id:null;
        if(!$group_id) return DV::error('Group ID is required');
        $existGroup = DB::table('student_groups')->where('id',$group_id)->exists();
        if(!$existGroup) return DV::error('Group not found');

        $session_date = isset($d->session_date)?date('Y-m-d',strtotime($d->session_date)):null;
        $startDate =  isset($d->start_date)?date('Y-m-d',strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date('Y-m-d',strtotime($d->end_date)):null;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:false;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        $row = DB::table('student_groups as sg')->where('sg.id',$group_id)
            ->selectRaw('sg.id as group_id,sg.campus_id,sg.level_id,sg.session_id')->first();
        $arr_report = [
            "session_date" => $session_date,
            "a_to_z" => $aToz,
            "limit" => $limit,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'short_month_name' => $is_shortMonthName,
        ];
        $row->form = 'customize';
        $row->program = GeneralSettings::getProgramByLevel($row->level_id,$ss)->name;
        $row->campus = GeneralSettings::getCampus($row->campus_id)->name;
        $row->level = GeneralSettings::getLevel($row->level_id,$ss)->name;
        $row->session = GeneralSettings::getSession($row->session_id)->name;
        $row-> count_students = $this->countGroupMembers($group_id,$ss);
        $row->session_date = $this->studentGroupAttendanceReport($group_id,$arr_report,$ss);

        return $row;

    }

    function getAttendanceRows($start_date=null,$end_date=null,$group_id=null,$student_id=null){
        $start_date = convertDate($start_date);
        $day = date('d',strtotime($start_date));
        $end_date = convertDate($end_date);

        $strSearchDate ='1=1';
        if($start_date && $end_date){
            $strSearchDate = "DATE(session_date) BETWEEN '$start_date' AND '$end_date'";
        }
        $rows = DB::table('student_attendances')->whereRaw($strSearchDate)->where('group_id',$group_id)->where('student_id',$student_id)->selectRaw('level_id,group_id,remarks,checkin_time,checkout_time,in_remarks,out_remarks,checkin_status_id,checkout_status_id,student_id,id as attendance_id,DAY(session_date) as day,MONTH (session_date) as `month`, YEAR(session_date) as `year`')->get();

        if(!isset($rows[0])) return [
                (object)[
                    'day' => (int)$day,
                    'attendance_id' => 'sdfsdf',
                    'status' => 'A',
                    'checkin_status_id' => '',
                    'checkout_status_id' => '',
                    'in_remarks' => 'Not Scan',
                    'out_remarks' => '',
                    'status_id' => 3,
                    "session_date" => '',
                    'checkin_time' => '',
                    'checkout_time' => '',
                    'group_id' => '',
                    "class" => '',
                    'level_id' => '',
                    'student_id' => '',
                    'remarks' => '',
                    'name' => '',

                ]
            ];
        return $rows;
    }

    function studentGroupAttendanceReport($group_id,$arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $limit = isset($d->limit)?$d->limit:6;
        $is_shortMonthName = isset($d->short_month_name)?$d->short_month_name:true;
        $aToz = isset($d->a_to_z)?$d->a_to_z:null;
        if($aToz){
            $aToz ='DESC';
        }else $aToz = 'ASC';

        $instance = new StudentAttendance();

        $session_date = isset($d->session_date)?date('Y-m-',strtotime($d->session_date)):date('Y-m-d');
        $startDate =  isset($d->start_date)?date("Y-m-d",strtotime($d->start_date)):null;
        $endDate =  isset($d->end_date)?date("Y-m-d",strtotime($d->end_date)):null;

        // $existSessionDate = DB::table('student_attendances')->where('session_date',$startDate)->exists();

        $sessionDateCondition = "1=1";
        if ($session_date) {
            $sessionDateCondition = "DATE(session_date) = '$session_date'";
        }
        if($startDate && $endDate) {
            $sessionDateCondition = "DATE(session_date) BETWEEN '$startDate' AND '$endDate'";
        }
        // $att_items = $this->getAttendanceRows($startDate,$endDate,$group_id);
        $students = DB::table('group_members as gm')
                ->join('students as s','s.id','=','gm.student_id')
                ->join('enrollments as e','e.id','=','gm.enrollment_id')
                ->where('gm.group_id',$group_id)
                ->selectRaw('s.id as student_id,s.name,s.date_of_birth,s.sex,e.start_date')
                ->get();

        $start_timestamp = strtotime($startDate);
        $end_timestamp = strtotime($endDate);

        $tmp_months =[];
        $months = [];
        $current_timestamp = $start_timestamp;
        while ($current_timestamp <= $end_timestamp) {
            $year = date("Y", $current_timestamp);
            $month = date("m", $current_timestamp);
            $unique_key = $year . '-' . $month;

            if (!in_array($unique_key, $tmp_months)) {
                $tmp_months[] = $unique_key;
                $months[] = (object)[
                    'month' => $month,
                    'year' => $year
                ];
            }

            $current_timestamp = strtotime("+1 month", $current_timestamp);

        }

        $attendanceData = [];

        foreach ($months as $date) {
            $year = $date->year;
            $month = $date->month;

            $current_date = new \DateTime("$year-$month-01");
            $end_date_obj = new \DateTime("$year-$month-01");
            $end_date_obj->modify('last day of this month');

            $days_between = [];

            // based on month and year of the start_date field
            $start_day = ($year == date('Y', $start_timestamp) && $month == date('m', $start_timestamp))
                ? max(date('d', $start_timestamp), 1)
                : 1;

            // based on month and year of the end_date field
            $end_day = ($year == date('Y', $end_timestamp) && $month == date('m', $end_timestamp))
                ? min(date('d', $end_timestamp), (int)$end_date_obj->format('d'))
                : (int)$end_date_obj->format('d');

            for ($day = $start_day; $day <= $end_day; $day++) {
                $days_between[] = ['day' => $day]; //str_pad($day, 2, '0', STR_PAD_LEFT)
            }

            $monthData = [
                'date' => $startDate && $endDate ? $year . '-' . getMonthName($month, $is_shortMonthName):date('Y-m-d'),
                'days' => $days_between,
                'students' => []
            ];

            $daily_attendance = [];
            $guardian_phoneNum = [];


            foreach ($students as $st) {
                $current_date = new \DateTime("$year-$month-01");
                $end_date_obj = new \DateTime("$year-$month-01");
                $end_date_obj->modify('last day of this month');
                $att_items = $this->getAttendanceRows($startDate,$endDate,$group_id,$st->student_id);

                $att_info = [];
                while ($current_date <= $end_date_obj) {
                    if ($current_date >= new \DateTime($startDate) && $current_date <= new \DateTime($endDate)) {
                        $att_info[] = $instance->getAttendanceInfo($att_items,$current_date->format('d'),$month,$year,$st->student_id);
                    }
                    $current_date->modify('+1 day');
                }

                $guardian_phoneNum[] = DB::table('student_guardians as sg')->where('sg.student_id',$st->student_id)
                                    ->join('guardians as g','sg.guardian_id','=','g.id')
                                    ->selectRaw('g.phone_number')
                                    ->get();

                $stData = [
                    'student_id' => $st->student_id,
                    'name' => $st->name,
                    'sex' => $st->sex,
                    'date_of_birth' => $st->date_of_birth,
                    'start_date' => $st->start_date,
                    'list' => $att_info,
                ];

                $count_col_absent = 0;
                $count_col_present = 0;
                $count_col_permission = 0;
                $count_rowsA=[];
                $count_rowsP=[];
                $count_rowsPr=[];
                foreach($att_info as $att){

                    if($att->status == 'A' || $att->status_id == 3){

                        $count_rowsA[] = $count_col_absent ++;
                    }
                    if($att->status == 'P' || $att->status_id == 1){

                        $count_rowsP[] = $count_col_present ++;
                    }
                    if($att->status == 'Pr' || $att->status_id == 2){

                        $count_rowsPr[] = $count_col_permission ++;
                    }

                    $daily_attendance[] = self::countDailyAttendance($att_info, $att->day);

                }

                $processedData = [];

                foreach ($daily_attendance as $item) {
                    $day = $item->day;

                    if (!isset($processedData[$day])) {
                        $processedData[$day] = [
                            'day' => $day,
                            'absent' => 0,
                            'present' => 0,
                            'permission' => 0
                        ];
                    }

                    if ($item->absent == 1) {
                        $processedData[$day]['absent']++;
                    }

                    if ($item->present == 1) {
                        $processedData[$day]['present']++;
                    }

                    if ($item->permission == 1) {
                        $processedData[$day]['permission']++;
                    }
                }
                $result = array_values($processedData);



                // $monthData['monthly_attendance'][]= [
                //     'absent' =>$count_col_absent,
                //     'permission' => $count_col_permission,
                //     'present' => $count_col_present,
                // ];
                $monthData['monthly_attendance'][]= [
                    'absent' =>count($count_rowsA),
                    'permission' => count($count_rowsPr),
                    'present' =>count($count_rowsP),
                ];
                $monthData['daily_attendance'] = $result;
                $monthData['phone_number'] = $guardian_phoneNum;
                $monthData['students'][] = $stData;

            }

            $attendanceData[] = $monthData;

        }

        return $attendanceData;

    }

    function countDailyAttendance($arr, $day) {
        $filteredData = array_filter($arr, function ($att) use ($day) {
            return $att->day == $day;
        });

        $countA = 0;
        $countP = 0;
        $countPr = 0;

        foreach ($filteredData as $att) {
            if ($att->status == 'A' || $att->status_id == 3) {
                $countA++;
            }
            if ($att->status == 'P' || $att->status_id == 1) {
                $countP++;
            }
            if ($att->status == 'Pr' || $att->status_id == 2) {
                $countPr++;
            }
        }

        return (object)[
            'day' => $day,
            'absent' => $countA,
            'present' => $countP,
            'permission' => $countPr
        ];
    }

    function countGroupMembers($group_id,$ss){
        $rows = DB::table('group_members as gm')
            ->join('students as s','s.id','=','gm.student_id')
            ->where('gm.group_id',$group_id)
            ->selectRaw('s.sex')->get();
        $female = [];
        $all = [];
        foreach($rows as $row){
            if($row->sex == 'F'){
                $female[] = $row->sex;
            }
            $all[] = $row->sex;
        }
        return (object)[
            'female' => count($female),
            'all' => count($all),
            'male' => count($all) - count($female)
        ];
    }

  //** end Attendance Report */

  //** Student List Report */

  function getStudentListReport($arr=[],$ss){
    $branch_id = $ss->branch_id;
    $rows = DB::table('students as s')->selectRaw('s.name,s.name_kh,s.sex,s.email,s.phone_number,s.date_of_birth,s.file_name')->get();
    foreach($rows as $row){
        $row->age = getAge($row->date_of_birth);
        if(isset($row->file_name)){
            $row->image_url = PublicStorage::getUrl($branch_id,'students',' image').$row->file_name;
        }else $row->image_url = null;

        unset($row->file_name);
    }
    return $rows;
  }

  //** end Student List Report */

  //** Family List Report*/

    function getFamilyListReport($arr=[],$ss){
        $branch_id = $ss->branch_id;
        $rows = DB::table('student_guardians as sg')
            ->select('sg.student_id','sg.family_code')
            ->groupBy('sg.student_id', 'sg.family_code')->get();
        $i=0;
        $tmp_keeper = [];
        while($i<count($rows)){
            $row = $rows[$i];
            $studentID = $row->student_id;
            $family_id = $row->family_code;
            if(!isset($tmp_keeper[$family_id])){
                $tmp_keeper[$family_id] = [
                    'family_id' => $family_id,
                    'parents' => [],
                    'children' => []
                ];
            }

            $child = DB::table('students')->where('id', $studentID)->first();
            if ($child) {
                $tmp_keeper[$family_id]['children'][] = $child;
            }

            $parents = DB::table('guardians as g')
                ->join('student_guardians as sg', 'g.id', '=', 'sg.guardian_id')
                ->selectRaw('g.name,g.name_kh,sg.family_code,g.phone_number,g.sex,g.n_id,g.address,g.email,g.file_name,g.role')
                ->where('sg.family_code', $family_id)
                ->distinct()
                ->get();

            $uniqueParents = [];
            foreach ($parents as $parent) {
                if(isset($parent->file_name) == null){
                    $parent->image_url = '';
                }else $parent->image_url = PublicStorage::getUrl($branch_id,'guardians','image').$parent->file_name;
                $key = $parent->name . $parent->family_code;
                if (!isset($uniqueParents[$key])) {
                    $uniqueParents[$key] = [
                        'name' => $parent->name,
                        'name_kh' => $parent->name_kh,
                        'phone' => $parent->phone_number,
                        'email' => $parent->email,
                        'address' => $parent->address,
                        'role' => $parent->role,
                        'sex' => $parent->sex,
                        'national_id' => $parent->n_id,
                        'image_url' => $parent->image_url,
                    ];
                }
            }

            $tmp_keeper[$family_id]['parents'] = array_values($uniqueParents);

            $i++;
        }

        // return $rows;

        return array_values($tmp_keeper);
    }
  //** end family list report */

  //** daily cash */

    function getDailyCash($filter,$ss){

        //** create table headers and keys */
        $header_list = ['Date','Receipt No.','Student Name','Sex','Dis.','Period'];
        $key_list = ['pmt_date','receipt_number','name','sex','discount','period'];
        // $obj = self::getOtherFeesList(1);
        $obj = self::getFeeCategory(0);

        $header_list = array_merge($header_list, $obj['header_list']);
        $key_list = array_merge($key_list, $obj['key_list']);
        $header_list = array_merge($header_list,['Total']);
        $key_list = array_merge($key_list,['Total']);
        $key_props = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name',$header_list,$key_props);


        //**---- */
        $selectInvoice='i.academic_year,i.invoice_number,i.id as invoice_id,formatDate(i.pmt_date) as pmt_date,DATE(i.pmt_date) as date,i.receiver,i.receiver_uid,i.currency_code';
        $d = (object)$filter;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $branch_id = isset($d->branch_id)?$d->branch_id:$campus_id;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $receiver_id = isset($d->receiver_id)?$d->receiver_id:null;
        $str_between_date = '1=1';
        if($start_date && $end_date) $str_between_date = 'DATE(i.pmt_date) >= \'' . $start_date . '\' AND DATE(i.pmt_date) <= \'' . $end_date . '\'';
        $str_search = '1=1';
        // $search_by_student = ' OR g.id IN (SELECT guardian_id FROM student_guardians AS sg1 INNER JOIN students AS st1 ON st1.id = sg1.student_id WHERE st1.code =\''.$search_value.'\' OR st1.phone_number = \''.$search_value.'\' OR st1.`name` LIKE \'%'. $search_value.'%\')';
        if($campus_id) $str_search .= ' AND e.campus_id = ' . $campus_id;
        if($receiver_id) $str_search .= ' AND i.receiver_id = '.$receiver_id;

        $rows = DB::table('invoices as i')
            ->join('receipts as r','r.invoice_id','=','i.id')
            ->join('students as s','s.id','=','i.student_id')
            ->join('enrollments as e','e.student_id','=','s.id')
            ->join(DBX::$branch_table.' as c','c.id','=','e.campus_id')
            ->whereRaw('ifnull(i.inactive,0)=0')
            ->selectRaw($selectInvoice.',c.name as campus,s.id as student_id,s.name,s.sex,r.receipt_number')
            ->whereRaw($str_between_date)
            ->whereIn('i.branch_id',$branch_ids)->whereRaw($str_search)->distinct()->get();
        $str_date = 'WHERE v.pmt_date BETWEEN \''.$start_date.'\' AND \''.$end_date.'\'';
        $ivts = DB::select("SELECT i.start_date,i.end_date,i.fee_type_id,displayMoney(SUM(i.net_amount),'USD') as formatted_total,SUM(i.net_amount) as total,i.invoice_id FROM invoice_items i INNER JOIN invoices as v ON v.id = i.invoice_id $str_date GROUP BY i.fee_type_id,i.invoice_id,i.start_date,i.end_date");
        $groupedData = [];
        $feeTotals = [];
        // $d = [];
        $campuses = [];
        foreach($rows as $row){
            //** get invoice items */
            // $row->period = formatDateString($row->start_date,$row->end_date,'md');
            $total = 0;
            foreach($headers as $h){
                $key = $h['key'];
                $feeName = $h['name'];
                // if($feeName == 'School Fee') $feeName = 'tuition_fee';
                if (!in_array($key, $key_list)){
                    $fee_type_id =  DB::table('fee_types')->where('name',$feeName)->take(1)->value('id');
                    // $isSchoolFee = DB::table('fee_types')->where('id',$fee_type_id)->take(1)->value('name');
                    $item = self::getDailyCashDetails($ivts,$fee_type_id,$row->invoice_id);
                    $row->$key = $item->formatted_total;
                    $total += $item->total;
                    if (!isset($feeTotals[$key])) {
                        $feeTotals[$key] = 0;
                    }
                    // $d[] = $key;
                    $feeTotals[$key] += $item->total;
                    if($item){
                        if($item->start_date && $item->end_date)
                        $row->period = formatDateString($item->start_date,$item->end_date,'md');
                    }else $row->period = 'N/A';
                }
            }


            $row->total = '$'.$total;

            //* !self sum
            if (!in_array('total', $key_list)) {
                $feeTotals['total'] += round($total,2);
            }

            $row->deposit = self::getDepositFee($row->student_id,$row->invoice_id);
            $campus = $row->campus;
            if (is_string($campus) && !in_array($campus, $campuses)) {
                $campuses[] = $row->campus;
            }
            unset($row->campus,$row->campus_id);
        }

        $groupedData['fee']= $rows;

        if(empty($campuses)){
            $campuses = DB::table(DBX::$branch_table.' AS c')->whereRaw($campus_id?'id = '.$campus_id:'1=1')->pluck('name')->toArray();
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
        $sub_title = $start_date && $end_date ? formatDate($start_date) .' to '. formatDate($end_date) : 'N/A to N/A';
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'simple',
            'header' => $headers,
            'list' => $groupedData,//$rows,//
            'company_profile' => $this->getCompanyInfo($ss)
        ];
    }

    static function getDailyCashDetails($rows,$fee_type_id,$invoice_id){
        $i=0;
        $c=null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->fee_type_id == $fee_type_id && $c->invoice_id == $invoice_id){
                return (object)[
                    'total' => $c->total,
                    'formatted_total' => $c->formatted_total,
                    'start_date' => $c->start_date,
                    'end_date' => $c->end_date
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'total' => 0,
            'formatted_total' => 0,
            'start_date' => null,
            'end_date' => null
        ];
    }

    function getInvoiceItemDetails($inv_id,$branch_id,$currency_code=null){
        if($currency_code){
            $currency_code = ',displayMoney(net_amount,\''.$currency_code.'\')';
        }else $currency_code = ',displayMoney(net_amount,\'USD\')';
        $tuition_amt=0;
        $branch_ids = getAccessBranches($ss,$branch_id);
        $total=[];
        $selectCols = 'price,fee_type,invoice_id,date_range,discount'.$currency_code.' as net_amount,net_amount as amount,start_date,end_date,fee_type_id,item_id';
        $rows = DB::table('invoice_items')->where('invoice_id',$inv_id)->whereIn('branch_id',$branch_ids)->selectRaw($selectCols)->get();
        // $fee_types = DB::table('fee_types')->selectRaw('name')->where('id','>',1)->get();
        $discount='N/A';
        $period='N/A';

        foreach($rows as $row){
            $inv = new Invoice();
            $fee_type = self::stringToKeyCase($row->fee_type);
            $row->$fee_type = $row->net_amount;

            if($row->fee_type == 'tuition_fee'){
                $tuition_amt = $row->net_amount;
                $discount = $row->discount;
                $tuition_amt = $row->tuition_fee;
                $row->period = $inv->getPaymentDuration($row->start_date, $row->end_date);//ateDiffMonths($row->start_date, $row->end_date).' months';
                $period = $row->period;
            }

            $total[] = $row->net_amount;

        }
        $sum = 0;
        $result = [];

        foreach ($total as $value) {
            $currencySymbol = substr($value, 0, 1); // Get the first character
            $amount = (float)substr($value, 1); // Get the numeric part

            if ($currencySymbol === '$') {
                if (!isset($result[$currencySymbol])) {
                    $result[$currencySymbol] = 0;
                }
                $result[$currencySymbol] += $amount;
            }
        }

        $sumWithCurrency = '';
        foreach ($result as $currencySymbol => $amount) {
            $sumWithCurrency .= $currencySymbol . number_format($amount, 2) . ' ';
        }

        $sum_amt = $sumWithCurrency;

        return (object)['discount'=>$discount,'data'=>$rows,'total'=>$sum_amt,'tuition_fee'=>$tuition_amt,'period' => $period,$fee_type];
    }

    
    static function getShortMonthName($id){
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