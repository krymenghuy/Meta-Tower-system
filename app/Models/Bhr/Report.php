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


    //** monthly cash */
    function getMonthlyCash($arr,$ss){
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        $header_list =['Date'];
        $key_list = ['date'];
        $obj = self::getFeeCategory();

        $header_list = array_merge($header_list, $obj['header_list']);
        $key_list = array_merge($key_list, $obj['key_list']);

        $headers = array_merge($header_list,['Total','Remark']);
        $key_list = array_merge($key_list,['total','remark']);

        $headers = $this->createMulKeyValue('name',$headers,$this->createKeyValue('key',self::stringToKeyCase($key_list)));

        $str_date = '';
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $level_id = isset($d->level_id)?$d->level_id:null;
        if($start_date && $end_date) {
            $str_date .= " AND DATE(v.pmt_date) BETWEEN '$start_date' AND '$end_date'";
        }
        $str_search = '';
        if($campus_id) $str_search .= ' AND v.campus_id = ' . $campus_id;
        if($level_id) $str_search .= ' AND e.level_id = ' . $level_id;
        // $main_q = 'SELECT DISTINCT DATE(v.pmt_date) as `date` FROM invoices as v INNER JOIN enrollments as e ON e.id = v.enrollment_id WHERE ifnull(v.is_paid,0)=1 '.$str_date.$str_search.'';
        // $rows = DB::SELECT(DB::raw($main_q));
        $rows = self::getArrayDates($start_date,$end_date);
        $item_str_date = "DATE(v.pmt_date) BETWEEN '$start_date' AND '$end_date'";
        $item_str_campus = '';
        if($campus_id) $item_str_campus .= ' AND v.campus_id = ' . $campus_id;
        // $sub_q = 'SELECT i.fee_type_id,SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total FROM invoice_items as i INNER JOIN invoices as v ON v.id = i.invoice_id WHERE ifnull(i.is_paid,0)=1 AND '.$item_str_date.$item_str_campus.' GROUP BY i.fee_type_id;';
        // $inv_item_type = DB::SELECT(DB::raw($sub_q));
        // $sub_q = 'SELECT DATE(v.pmt_date) as `date`,i.fee_type_id,SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total FROM invoice_items as i INNER JOIN invoices as v ON v.id = i.invoice_id WHERE ifnull(i.is_paid,0)=1 AND '.$item_str_date.$item_str_campus.' GROUP BY v.pmt_date, i.fee_type_id;';
        // $inv_item_type = DB::SELECT(DB::raw($sub_q));
        $inv_item_type = DB::table('invoice_items as i')
        ->join('invoices as v', 'v.id', '=', 'i.invoice_id')
        ->selectRaw('DATE(v.pmt_date) as date, i.fee_type_id, SUM(i.net_amount) as total, displayMoney(SUM(i.net_amount), "USD") as formatted_total')
        ->whereRaw('IFNULL(i.is_paid, 0) = 1')
        ->whereRaw($item_str_date . $item_str_campus) // Assuming these are conditions for date and campus
        ->groupByRaw('DATE(v.pmt_date), i.fee_type_id')
        ->get();
        
        // $total = 0;
        $fee_totals = [];
        $groupedData = [];

        foreach ($rows as $row) {
            $total = 0;
            // return$rows;
            foreach($headers as $h){
                $key = $h['key'];
                $fee_type = $h['name'];
                if($fee_type == 'Date' || $fee_type == 'Total') continue;
                if($fee_type == 'School Fee') $fee_type = 'tuition_fee';
                // if($fee_type == 'Tuition Fee') $fee_type = 'School Fee';
                $fee_type_id = self::getFeeTypeID($fee_type);
                $total_fee_type = self::getMonthlyCashInfo($inv_item_type,$fee_type_id,$row->date);
                $row->$key = (float)(str_replace('$','',$total_fee_type->formatted_total)) <= 0 ? '' : '$'.number_format(str_replace('$','',$total_fee_type->formatted_total),2) ;
                $total += $total_fee_type->total;
                if (!isset($fee_totals[$key])) {
                    $fee_totals[$key] = 0;
                }
                $fee_totals[$key] += $total_fee_type->total;
                
            }

            // $row->tuition_fee = (float)(str_replace('$','',$row->tuition_fee )) <= 0 ? '' : ('$'. (str_replace('$','',$row->tuition_fee),2));
            $row->total = (float)$total <= 0 ? '' : '$'. number_format($total,2) ;
            $row->date = date('d M Y', strtotime($row->date));

            unset($row->campus_id);
        }
        $groupedData['fee'] = $rows;
        $fee_totals['total'] = 0;
        $total_amount['total'] = 0;
        $fee_totals['total'] = array_sum($fee_totals) ;
        // return $keeper;
        foreach($fee_totals as &$fee_total){
            $fee_total = (float)$fee_total <= 0 ? '<p></p>' : '$'. number_format($fee_total,2);
        }
        $groupedData['fee_totals'] = $fee_totals ;

        $groupedData['fee_totals']['label'] = 'Total Cash Collection';
        $groupedData['fee_totals']['form'] = 'monthly_cash';
        $groupedData['fee_totals']['service_fee'] = 'Service Fee for Staff Kids\' school ,book and Lunch Fee';

        $campuses = $campus_id ? DB::table(DBX::$branch_table.' AS c')->where('c.id',$campus_id)->pluck('shortcut')->toArray() : DB::table(DBX::$branch_table.' AS c')->pluck('shortcut')->toArray();
        $title = 'Monthly Cash Collection Report For (' . implode(',',$campuses).')';
        $sub_title = formatDate($start_date) .' to '. formatDate($end_date);
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'header'=>$headers,
            'list'=>$groupedData,//array_values($sumsByMonthAndFeeType),
            'form'=>'simple',
            'company_profile'=>self::getCompanyInfo($ss)
        ];

    }

    static function getArrayDates($start_date, $end_date) {
        $date_array = [];
        $current_date = $start_date;
    
        while (strtotime($current_date) <= strtotime($end_date)) {
            $date_array[] = (object)["date" => $current_date];
            $current_date = date("Y-m-d", strtotime($current_date . ' +1 day'));
        }
    
        return $date_array;
    }

    static function getMonthlyCashInfo($rows,$fee_type_id,$date){
        $i=0;
        $c=null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            // \Log::info($c->date.' = '.$date);
            if($c->fee_type_id == $fee_type_id && $c->date == $date){
                return (object)[
                    'total' => $c->total,
                    'formatted_total' => $c->formatted_total
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'total' => 0,
            'formatted_total' => 0
        ];
    }

    static function stringToKeyCase($cnvtString,$bonus_string=null,$front=1){

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

    //** referral */

    function getReferalFeeList($arr,$ss){
        $d = (object)$arr;
        $header_list = ['Parent Name','Student Name','Student ID','Class','Parent Name','Student Name','Student ID','Starting Date','Class','Payment Date','Payment Term','Payment Period','Discount','School Fee','Total Paid','Referral Fee','Date of Receiving Referral Fee'];
        // $header_list = array_diff($header_list,$rm_header);
        // $header = create;
        $replacements = [
            'Class' => ['recommender_class','class'], 
            'Parent Name' => ['ref_parent','parent_name'],
            'Student Name' => ['ref_name','student_name'],
            'Date of Receiving Referral Fee' => 'received_date'
        ];

        $keys = [];

        foreach ($header_list as $h) {
            if (array_key_exists($h, $replacements)) {
                if (is_array($replacements[$h])) {
                    $replacement = array_shift($replacements[$h]);
                    array_push($keys, $replacement);
                } else {
                    array_push($keys, $replacements[$h]);
                }
            } else {
                array_push($keys, $h);
            }
        }

        // $keys = array_merge($keys, ['remark']);

        $keys = $this->createKeyValue('key',self::stringToKeyCase($keys));
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        $parent_name = '(SELECT DISTINCT GROUP_CONCAT(g.name) FROM guardians as g INNER JOIN student_guardians as sg on sg.guardian_id = g.id WHERE sg.student_id = s.id) as parent_name';
        $getPaymentOption = ',(SELECT p.pmt_option_id FROM payments as p WHERE p.enrollment_id = e.id ORDER BY p.id DESC LIMIT 1) as payment_option_id';
        $getDiscount = ',(SELECT SUM(ifnull(p.policy_discount,0) + ifnull(p.special_discount,0) + ifnull(p.second_child_discount,0)) FROM payments as p WHERE p.enrollment_id = e.id GROUP BY p.id,p.policy_discount,p.second_child_discount,p.special_discount ORDER BY p.id DESC LIMIT 1) as discount';
        $selectCols = $parent_name.$getPaymentOption.$getDiscount.',r.remarks,e.id as enrollment_id,e.start_date,e.tuition_end_date,formatDate(s.admission_date) as starting_date,r.use_date as payment_date, formatDate(r.created_at) as received_date,e.level_id,e.campus_id,s.name as student_name,r.commission as referal_fee,r.referrer_id,r.invoice_id';
        $is_paid = isset($d->is_paid)?(int)$d->is_paid:null;
        $level_id = isset($d->level_id)?$d->level_id:null;
        $campus_id = isset($d->campus_id) ? $d->campus_id :null;
        $start_date = isset($d->start_date)?convertDate($d->start_date):date('Y-m-01');
        $end_date = isset($d->end_date)?convertDate($d->end_date):date('Y-m-t');
        $str_search = '1=1';
        if($is_paid || $is_paid === 0) $str_search .= ' AND r.is_paid = '.(int)$is_paid;
        if($level_id) $str_search .= ' AND e.level_id = '.$level_id;
        if($campus_id) $str_search .= ' AND e.campus_id = '.$campus_id;
        $str_date = '1=1';
        if($start_date && $end_date) $str_date = 'DATE(r.created_at) >= \''.$start_date.'\' AND DATE(r.created_at) <= \''.$end_date.'\'';
        $campuses = [];
        $rows = DB::table('referals as r')
            ->join('students as s','s.id','=','r.student_id')
            ->join('enrollments as e','e.student_id','=','s.id')
            ->whereRaw($str_search)
            ->whereRaw($str_date)
            ->selectRaw($selectCols)->get();
        // $rows = DB::table('referals as r')->join('students as s','s.id','=','r.student_id')->join('invoices as v','v.id','=','r.invoice_id')->join('enrollments as e','e.student_id','=','s.id')->where('v.enrollment_id','e.id')->get();
            // return $rows;
        $ref_info = DB::table('students as s')
                ->select(
                    's.id',
                    's.name as recommender_name',
                    's.code as student_code',
                    DB::raw('GROUP_CONCAT(g.name) as recommender_parents'),
                    'e.level_id'
                )
                ->join('referals as r','r.referrer_id','=','s.id')
                ->leftJoin('invoices as v','v.id','=','r.use_invoice_id')
                ->leftJoin('enrollments as e','e.id','=','v.enrollment_id')
                ->join('student_guardians as sg', 'sg.student_id', '=', 's.id')
                ->join('guardians as g', 'sg.guardian_id', '=', 'g.id')
                ->groupBy('s.id', 's.name', 's.code','e.level_id')
                ->get();
        $invoices = DB::table('invoices as v')->selectRaw('v.is_paid,v.enrollment_id,v.pmt_date,v.id as invoice_id,v.due_amount,(SELECT SUM(i.net_amount) FROM invoice_items as i WHERE i.invoice_id = v.id AND i.fee_type != \'tuition_fee\') as total_other_fee,note as remark,v.paid_amount')->orderBy('v.id','desc')->get();
        foreach($rows as $row){
            $recommenderInfo = $ref_info->filter(function ($i) use ($row){
                return $i->id == $row->referrer_id;
            })->first();

            if($recommenderInfo){
                $row->ref_name = $recommenderInfo->recommender_name;
                $row->ref_parent = $recommenderInfo->recommender_parents;
                $row->student_id = $recommenderInfo->student_code;
                $row->recommender_class = GeneralSettings::getlevelName($recommenderInfo->level_id);
            }

            $invoice = $invoices->filter(function ($i) use ($row){
                return $i->enrollment_id == $row->enrollment_id;
            })->first();

            $row->referral_fee = $row->referal_fee.'%';
            $row->discount = $row->discount.'%';
            // $row->remark = $invoice->remark;
            if($invoice){
                $school_fee = DB::table('invoice_items')->where('invoice_id',$invoice->invoice_id)->take(1)->value('net_amount');
                $row->total_paid = '$'.number_format($invoice->paid_amount, 2);
                $row->school_fee = '$'.number_format($school_fee, 2);
            }
            $row->payment_period = Invoice::getPaymentDuration($row->start_date,$row->tuition_end_date,1);
            $row->payment_term = GeneralSettings::getPmtOptions($row->payment_option_id);
            $use_date = $row->payment_date;
            
            if(!$use_date) $row->payment_date = 'N/A';
            else
            $row->payment_date = str_replace('-', ' ', date('d-M-Y', strtotime($use_date)));
            $row->received_date = $is_paid == 1 ? $row->received_date : '';
            $row->start_date = str_replace('-', ' ', date('d-M-Y', strtotime($row->start_date)));
            $row->tuition_end_date = str_replace('-', ' ', date('d-M-Y', strtotime($row->tuition_end_date)));
            $row->class = GeneralSettings::getLevel($row->level_id)->name;
            $campus =  GeneralSettings::getCampus($row->campus_id)->shortcut;
            if (is_string($campus) && !in_array($campus, $campuses)) {
                $campuses[] = $campus;
            }
            $row->duration = $row->payment_period;
            $row->payment_period = $row->start_date.' to '.$row->tuition_end_date;
            unset($row->campus_id);
        }
        $campuses = empty($campuses) ? [DB::table(DBX::$branch_table.' AS c')->where('id',$campus_id)->take(1)->value('name')] : $campuses;
        $status_is_paid = $is_paid===1?'(Already got Referral fee) ':($is_paid===0?'(Not yet get Referral fee) ':'(Detail)');
        $title = '('. implode(',', $campuses) . ') '.'Referal Fee Students ' .$status_is_paid ;

        $sub_title = $start_date && $end_date ? date('d-M-Y', strtotime($start_date)) .' to '. date('d-M-Y', strtotime($end_date)) : 'All Referal Fee';
        foreach ($header as &$h) {
            if ($h && isset($h['key'])) {
                $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
            }
        }
        $addElement = [
            "name" => "Duration",
            "key" => "duration"
        ];
        foreach ($header as $index => $item) {
            if (isset($item['key']) && $item['key'] === 'payment_period') {
                // Insert the new element after this index
                array_splice($header, $index + 1, 0, [$addElement]);
                break;
            }
        }
        // array_push($header, $addElement);
        // return$header;
        return (object)[
            'list' => $rows,
            'title' => $title,
            'sub_title' => $sub_title,
            'header' => $header,
            'form' => 'referral',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    static function getReferralInfo($referrer_id){
        return '';
    }


    function getSchoolFee($filter,$ss){
        $inv_instance = new Invoice();
        $d = (object)$filter;

        $is_paid = isset($d->is_paid) ? $d->is_paid:null;
        $campus_id = isset($d->campus_id) ? $d->campus_id:null;
        $level_id = isset($d->level_id) ? $d->level_id:null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) :date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-t');
        $selectInvoiceReceipt = 'i.id as invoice_id,formatDate(i.pmt_date) as pmt_date,i.invoice_date,i.note as remarks';

        //** HEADER */
        $replacement = "Fee Type";
        $header_list = ['Student Name','Student ID','Sex','Class','Time','Starting Date','Payment Date','From','To','Period','Policy Discount','Discount Amount','School Fee','Remarks'];
        $find_rpl = array_search('Fee Type', $header_list);
        //** */

        // if(!$fee_type_id) return DV::error('Fee type must be selected');
        //** */
        // $str_search = 'ivt.fee_type_id = '.$fee_type_id;
        $str_search = '1=1';
        if($is_paid != null) $str_search = 'i.is_paid = '. $is_paid;
        if($campus_id) $str_search .=' AND e.campus_id = '.$campus_id;
        if($level_id) $str_search .=' AND e.level_id = '.$level_id;

        //** */
        $str_date = '1=1';
        if($start_date && $end_date) $str_date = 'DATE(i.invoice_date) >= \'' .$start_date. '\' AND DATE(i.invoice_date) <= \''.$end_date.'\'';
        $selectInvoiceItems = ',ivt.policy_discount,ivt.id,ivt.fee_type,displayMoney(ivt.net_amount,i.currency_code) as amount_currency,ivt.net_amount,formatDate(ivt.start_date) as `from`, formatDate(ivt.end_date) as `to`,ifnull(ivt.qty,1) as qty,ivt.price';
        $rows = DB::table('invoices as i')
                ->join('enrollments as e','e.id','=','i.enrollment_id')
                ->join('invoice_items as ivt','ivt.invoice_id','=','i.id')
                ->join('students as s','s.id','=','i.student_id')
                ->where('ivt.fee_type','=','tuition_fee')
                ->whereRaw($str_search)
                ->where('ivt.item_id',100)
                ->whereRaw($str_date)
                ->selectRaw($selectInvoiceReceipt.$selectInvoiceItems.',i.is_paid,e.campus_id,e.level_id,s.code as student_id,s.sex,s.name as student_name,formatDate(s.admission_date) as starting_date,formatDate(s.date_of_birth) as dob,e.session_id')
                ->get();
        $student_level = [];
        $fee_type = []; //** title prop */
        $str_cpy_type = null;

        $fee_totals = ['total'=>0];
        $total = 0;
        foreach($rows as $row){
            $row->period = $inv_instance->getPaymentDuration($row->from,$row->to);
            $fee_type = $row->fee_type;

            $type_key = 'school_fee';
            $row->$type_key = $row->amount_currency;
            if($fee_type){
                $row->class = GeneralSettings::getLevel($row->level_id)->name;
                $replacement = $fee_type;
                $type_key = $this->stringToKeyCase($fee_type);
                $row->$type_key = $row->amount_currency;
            }
            $price = $row->price * $row->qty;
            $policy_discount = $row->policy_discount;
            $row->discount_amount =  '$'. number_format(($price * $policy_discount / 100),2);
            $row->policy_discount = $policy_discount.'%';
            //** if group by level use comment code */
                $levelId = $row->level_id;
                if (!isset($student_level[$levelId])) {
                    $student_level[$levelId] = [
                        "class" => $levelId,
                        'total' => 0,
                        'sub_total' => 0,
                        "students" => [],
                        'label' => 'Total '.$row->class
                    ];
                }
                $student_level[$levelId]["class"] = $row->class;
                $student_level[$levelId]["students"][] = $row;
                $student_level[$levelId]["sub_total"] += $row->net_amount;
                $student_level[$levelId]["total"] = '$'. number_format($student_level[$levelId]["sub_total"],2);
                $total += $row->net_amount;
            //** */
            $row->time = GeneralSettings::getSession($row->session_id)->name;

            unset($row->campus,$row->campus_id,$row->level_id);

        }
        $fee_totals['total'] = '$'.number_format($total,2);
        $fee_totals['form']  ='school_fee';
        $fee_totals['label'] = 'Grand Total';

        //** to change key name by header list arr name */
        $customMapping = [
            'Payment Date' => 'pmt date',

        ];

        $keys = [];
        foreach ($header_list as $h) {
            if (array_key_exists($h, $customMapping)) {
                $keys[] = $this->stringToKeyCase($customMapping[$h]);
            } else {
                $keys[] = $this->stringToKeyCase($h);
            }
        }
        $keys = $this->createKeyValue('key',$keys);
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        if(isset($rows[0])){
            $row->fee_type;
        }
        $fee_type = is_array($fee_type)?implode(',',$fee_type):$fee_type;
        
        $campuses = DB::table(DBX::$branch_table .' AS c')->whereRaw($campus_id?'id = '.$campus_id:'1=1')->pluck('shortcut')->toArray();

        $title = 'School Fee Report For (' . implode(',',$campuses).')';
        $sub_title = $start_date && $end_date ? date('d-M-Y',strtotime($start_date)) .' to '. date('d-M-Y',strtotime($end_date)) : 'N/A to N/A';
        $main_group=[
            'all_fee'=>array_values($student_level),
            'fee_totals' => $fee_totals
        ];
        return (object)[
            'header' => $header,
            'title' => $title,
            'sub_title' => $sub_title,
            'list' => $main_group,
            'form' => 'school_fee',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    function getNonTuitionFee($filter,$ss){
        $inv_instance = new Invoice();
        $d = (object)$filter;
        $fee_type_id = isset($d->fee_type_id) ? $d->fee_type_id:null;
        $selectInvoiceItems = ',ivt.id,ivt.fee_type,displayMoney(ivt.net_amount,i.currency_code) as amount_currency,ivt.net_amount,ivt.discount,formatDate(ivt.start_date) as `from`, formatDate(ivt.end_date) as `to`';
        $is_paid = isset($d->is_paid) ? $d->is_paid:null;
        $campus_id = isset($d->campus_id) ? $d->campus_id:null;
        $level_id = isset($d->level_id) ? $d->level_id:null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) :date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-t');
        $selectInvoiceReceipt = 'i.id as invoice_id,formatDate(i.pmt_date) as pmt_date,i.invoice_date';

        //** HEADER */
        $replacement = "Fee Type";
        $header_list = ['Student Name','Student ID','Sex','Date of birth','Class','Time','Starting Date','Payment Date','Period','Duration','Discount','Net Amount','Fee Type'];
        $find_rpl = array_search('Fee Type', $header_list);
        $obj = self::getOtherFeesList(0);
        //** */
        $fee_types = self::getFeeTypes([1,99]);

        // if(!$fee_type_id) return DV::error('Fee type must be selected');
        //** */
        // $str_search = 'ivt.fee_type_id = '.$fee_type_id;
        $str_search = '1=1';
        if($is_paid != null) $str_search = 'i.is_paid = '. $is_paid;
        if($campus_id) $str_search .=' AND e.campus_id = '.$campus_id;
        if($level_id) $str_search .=' AND e.level_id = '.$level_id;
        if($fee_type_id) $str_search .=' AND ivt.fee_type_id = '.$fee_type_id;

        //** */
        $str_date = '1=1';  
        if($start_date && $end_date) $str_date = 'DATE(i.invoice_date) >= \'' .$start_date. '\' AND DATE(i.invoice_date) <= \''.$end_date.'\'';
        $campuses =[];

        $rows = DB::table('invoices as i')
                ->join('enrollments as e','e.id','=','i.enrollment_id')
                ->join('invoice_items as ivt','ivt.invoice_id','=','i.id')
                ->join('students as s','s.id','=','i.student_id')
                ->whereNotIn('ivt.item_id',[100,98,99])
                ->whereRaw($str_search)
                ->whereRaw($str_date)
                ->selectRaw($selectInvoiceReceipt.$selectInvoiceItems.',i.is_paid,e.campus_id,e.level_id,s.code as student_id,s.sex,s.name as student_name,formatDate(s.admission_date) as starting_date,formatDate(s.date_of_birth) as dob,e.session_id')
                ->get();
        $student_level = [];

        $excludeHeader = false;
        $fee_totals = ['total'=>0,'label'=>'Grand Total'];
        $total = 0;
        foreach($rows as $row){
            $row->period = ($row->from ? date('d-M-Y', strtotime($row->from)) : '---' ) . ' to ' .($row->to ? date('d-M-Y', strtotime($row->to)) : '---') ;
            $row->duration = ($row->from&&$row->to) ? $inv_instance->getPaymentDuration($row->from,$row->to):'none';
            $fee_type = $row->fee_type;
            $row->discount = number_format($row->discount) . '%';
            $row->net_amount = '$' . number_format($row->net_amount ,2);
            // $fee_type_arr[] = $fee_type;
            // if(!$fee_type_id) $fee_type = 'All Non Tuition';
            // foreach($fee_types as $h){
            //     $key_name = $this->stringToKeyCase($h->name);
            //     if($h->name == $row->fee_type){
            //         $row->$key_name = $row->amount_currency.'('.shortHandString($row->fee_type,10,3).')';
            //     }
            // }

            // $type_key = 'fee_type';
            // $row->$type_key = $row->amount_currency.'('.$row->fee_type.')';
            // if($fee_type && $fee_type_id){
            //     $replacement = $fee_type;
            //     $type_key = $this->stringToKeyCase($fee_type);
            //     $row->$type_key = $row->amount_currency;
            // }
            //** if group by level use comment code */
                $levelId = $row->level_id;
                if (!isset($student_level[$levelId])) {
                    $student_level[$levelId] = [
                        "class" => $levelId,
                        'total' => 0,
                        'sub_total' => 0,
                        "students" => [],
                    ];
                }
                $row->class = GeneralSettings::getLevel($row->level_id)->name;
                $student_level[$levelId]["class"] = $row->class;
                $student_level[$levelId]["students"][] = $row;
                $student_level[$levelId]["sub_total"] += (float)str_replace('$','', $row->net_amount);
                $student_level[$levelId]["total"] = '$'. number_format($student_level[$levelId]["sub_total"],2);
                $student_level[$levelId]['label'] =  "Total ". $row->class;
                $total += (float)str_replace('$','', $row->net_amount);

            //** */

            $row->time = GeneralSettings::getSession($row->session_id)->name;
            $campus =  GeneralSettings::getCampus($row->campus_id)->shortcut;
            if (is_string($campus) && !in_array($campus, $campuses)) {
                $campuses[] = $campus;
            }
            unset($row->campus,$row->campus_id,$row->level_id);
        }
        $fee_totals['total'] = '$'. number_format($total,2);
        $fee_totals['form']  ='non_tuition';

        //** to change key name by header list arr name */
        $customMapping = [
            // value in header => change key name
            'Payment Date' => 'pmt date',
            'Date of birth' => 'dob'
        ];
        $keys = [];
        foreach ($header_list as $h) {
            if (array_key_exists($h, $customMapping)) {
                $keys[] = $this->stringToKeyCase($customMapping[$h]);
            } else {
                $keys[] = $this->stringToKeyCase($h);
            }
        }
        $keys = $this->createKeyValue('key',$keys);
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        if(isset($rows[0])){
            $row->fee_type;
        }
        $type_name = self::getFeeTypeName($fee_type_id);
        $fee_type_title = $type_name?$type_name:'All Types';
        $campuses = empty($campuses) ? [DB::table(DBX::$branch_table.' AS c')->where('id',$campus_id)->take(1)->value('name')] : $campuses;
        // $campuses = empty($campuses) ? ['N/A']:$campuses;
        $title = $fee_type_title.' Report For (' . implode(',',$campuses).')';
        $sub_title = $start_date && $end_date ? date('d-M-Y',strtotime($start_date)) .' to '. date('d-M-Y',strtotime($end_date))  : 'N/A to N/A';
        $main_group=[
            'all_fee'=>array_values($student_level),
            'fee_totals' => $fee_totals
        ];
        return (object)[
            'header' => $header,
            'title' => $title,
            'sub_title' => $sub_title,
            'list' => $main_group,
            'form' => 'non_tuition',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    // function getIncomeByCategories($arr,$ss){
    //     $d = (object)$arr;
    //     $header_list = ['Date','Receipt No.','Student Name'];
    //     $special_keys = ['Cash','Transfer','Cheque'];
    //     $header_list = array_merge($header_list,$special_keys,['Remark']);
    //     $keys = $this->createKeyValue('key',$this->stringToKeyCase($header_list));
    //     $header = $this->createMulKeyValue('name',$header_list,$keys);
    //     $keys = $this->createKeyValue('key',self::stringToKeyCase($header_list));
    //     $company_profile = self::getCompanyInfo($ss);
    //     $main_q = 'SELECT r.receipt_number,v.pmt_date,(SELECT s.name FROM students as s WHERE s.id = v.student_id) as student_name FROM invoices as v INNER JOIN receipts as r ON r.invoice_id = v.id WHERE ifnull(v.is_paid,0)=1 ;';
    //     $rows = DB::select($main_q);
    //     $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days')); //start date get last 3 month
    //     $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-d');
    //     $fee_type_id = isset($d->fee_type_id) ? $d->fee_type_id : null;
    //     $campus_id = isset($d->campus_id) ? $d->campus_id : 1;
    //     $str_search = '1=1';
    //     if($fee_type_id) {
    //         $str_search = 'ivt.fee_type_id = ' . $fee_type_id;
    //     }
    //     // $rows = DB::table('invoice_items as i')->join('invoices as v','v.id','=','i.invoice_id')->where('i.is_paid',1)->selectRaw('displayMoney(i.net_amount,\'USD\') as formatted_net_amt,formatDate(i.updated_at) as date,i.invoice_id,i.item_id,i.fee_type,i.net_amount,i.fee_type_id'.$get_receipt_number.$get_receipt_id.$getStudentName.$invoiceType)->where('i.is_paid',1)->get();
    //     $str_date = 'DATE(v.pmt_date) BETWEEN \''.$start_date.'\' AND \''.$end_date.'\'';
    //     $rows = DB::table('invoices as v')->join('receipts as r','v.id','=','r.invoice_id')->join('students as s','s.id','=','v.student_id')->join('invoice_items as i','i.invoice_id','=','v.id')->whereRaw($str_date)->selectRaw('s.name as student_name,v.note as remark,v.pmt_date as date,r.receipt_number as receipt_no,i.fee_type_id,r.id as receipt_id,SUM(i.net_amount) as net_amount,displayMoney(SUM(i.net_amount),\'USD\') as formatted_net_amt,v.invoice_type')->groupByRaw('r.receipt_number,v.note,v.id,i.fee_type_id,s.name,v.pmt_date,r.id,v.invoice_type')->get();
    //     $campuses = [];
    //     $campuses = empty($campuses) ? [DB::table(DBX::$branch_table.' AS c')->where('id',$campus_id)->take(1)->value('name')] : $campuses;
    //     $title = '('. implode(',', $campuses) . ') '.'Income By Category ';
    //     $timestamp = strtotime($start_date);
    //     $startDate = date('d-M-Y', $timestamp);
    //     $timestamp = strtotime($end_date);
    //     $endDate = date('d-M-Y', $timestamp);
    //     $sub_title = $startDate.' To '.$endDate;
    //     $receip_amt = DB::select('SELECT rm.pmt_method as method_name,rm.payment_method_id as pmt_method_id,rm.cheque_number,rm.receipt_id,rm.invoice_id,rm.payment_method_id as pmt_method_id,rm.amount,displayMoney(rm.amount,\'USD\') as formatted_amount FROM receipt_amount as rm');
    //     $groupedData = [];
    //     $fee_totals = ['transfer' => 0, 'cheque' => 0, 'cash' => 0];
    //     $transfer = 0;
    //     $arr_fee_id = [1,2,3,4,5,6,9,10];
    //     $feeTypes = DB::table('fee_types')->whereIn('id',$arr_fee_id)->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name')->get();
    //     $feeTypes = self::catagorySortByFeeType($feeTypes);
    //     // return $rows;
    //     foreach($rows as $row){
    //         foreach($feeTypes as $feeType){
    //             $fee_type = self::getFeeTypeName(($row->fee_type_id == $feeType->id) ? $row->fee_type_id : $feeType->id);//$row->fee_type;
    //             if (!isset($groupedData[$fee_type])) {
    //                 $groupedData[$fee_type] = [
    //                     'fee_type' => $fee_type,
    //                     'fee' => [],
    //                 ];
    //             }
    //             if($row->fee_type_id == $feeType->id){
    //                 $pmts = self::getIncomeByCategoriesDetails($receip_amt,$row->receipt_id,$row->net_amount,$row->formatted_net_amt);
    //                 if($row->invoice_type == 'tuition_fee'){
    //                     if($row->fee_type_id == 1){
    //                         foreach($pmts as $p){
    //                             $key = $p->method_name;
    //                             $row->transfer = 0;
    //                             $row->raw_transfer = 0;
    //                             if($key == 'bank'){
    //                                 $transfer += $p->amount;
    //                                 $row->transfer = $p->formatted_amount." <span class='text-danger'>".GeneralSettings::PaymentMethodName($p->pmt_method_id)."($p->cheque_number)</span>";
    //                                 $row->raw_transfer = $transfer;
    //                             }else if($key == 'cheque'){
    //                                 $row->$key = $p->formatted_amount." ".GeneralSettings::PaymentMethodName($p->pmt_method_id)." ($p->cheque_number)";
    //                             }
    
    //                             $row->cash = $row->net_amount - $transfer;
    //                         }
    //                     }else $row->cash = $row->net_amount;
    //                 }else{
    //                     foreach($pmts as $p){
    //                         $key = $p->method_name;
    //                         $row->$key = $p->amount;
    //                         $row->transfer = 0;
    //                         if($key == 'bank'){
    //                             $transfer += $p->amount;
    //                             $row->transfer = $p->formatted_amount." <span class='text-danger'>".GeneralSettings::PaymentMethodName($p->pmt_method_id)."($p->cheque_number)</span>";
    //                             $row->raw_transfer = $transfer;
    //                         }else if($key == 'cheque'){
    //                             $row->$key = $p->formatted_amount." ".GeneralSettings::PaymentMethodName($p->pmt_method_id)." ($p->cheque_number)";
    //                         }
    
    //                     }
    //                 }
    //                 $row->date = str_replace('-', ' ', date('d-M-Y', strtotime($row->date)));;
    //                 $row->net_amount = number_format($row->net_amount, 2);
    //                 $row->formatted_net_amt = '$'.number_format(str_replace('$', '',$row->formatted_net_amt), 2);
    //                 $row->cash = number_format($row->cash, 2);
    //                 $row->transfer = number_format($row->transfer, 2);
    //                 if($key == 'cheque'){
    //                     $row->$key = number_format($row->$key, 2);
    //                 }
    //                 // $row->remark = '';
    //                 $groupedData[$fee_type]['fee'][] = $row;
    //             }
    //         }
            
    //     }
        
    //     $grand_total_transfer = 0;
    //     foreach ($groupedData as $fee_type => &$fee_data) {
    //         $total_transfer = 0;
    //         $total_cheque = 0;
    //         $total_cash = 0;
    //         // var_dump($fee_data);

    //         foreach ($fee_data['fee'] as $fee) {

    //             $transfer_value = floatval(str_replace('$', '', isset($fee->raw_transfer)?$fee->raw_transfer:null));
    //             $cheque_value = floatval(str_replace('$', '', isset($fee->cheque)?$fee->cheque:null));
    //             $cash_value = floatval(str_replace('$', '', isset($fee->cash)?$fee->cash:null));

    //             $total_transfer += $transfer_value;
    //             $total_cheque += $cheque_value;
    //             $total_cash += $cash_value;
    //         }

    //         $fee_data['total_transfer'] = '$'.number_format($total_transfer, 2);
    //         $fee_data['total_cheque'] = '$'.number_format($total_cheque, 2);
    //         $fee_data['total_cash'] = '$'.number_format($total_cash, 2);
    //         $fee_data['sub_label'] = 'Sub Total';
    //         $fee_data['total'] = '$'. number_format(($total_transfer+$total_cash+$total_cheque), 2);
    //         $fee_data['label'] = 'Grand Total';


    //         $grand_total_transfer += $total_transfer;
    //         $fee_totals['transfer'] = number_format($grand_total_transfer, 2);
    //         $fee_totals['cheque'] += $total_cheque;
    //         $fee_totals['cash'] += $total_cash;
    //         $fee_totals['total'] = '$'.number_format(round($grand_total_transfer+$fee_totals['cheque'] +$fee_totals['cash'],2), 2);
    //         $fee_totals['form'] = 'income_by_category';
    //         $fee_totals['sub_label'] = 'Sub Total';
    //         $fee_totals['label'] = 'Grand Total';
    //         // $fee_totals['cash'] = number_format($fee_totals['cash'], 2);
    //         $fee_totals['grand_total'] = $fee_totals['total'];
    //     }
    //     $fee_totals['cheque'] = number_format($fee_totals['cheque'], 2);
    //     $fee_totals['cash'] = number_format($fee_totals['cash'], 2);

    //     $main_group = [
    //         'all_fee' => array_values($groupedData),
    //         'fee_totals' => $fee_totals
    //     ];

    //     return (object)[
    //         'header' => $header,
    //         'title' => $title,
    //         'sub_title' => $sub_title,
    //         'form' => 'income_by_category',
    //         'list' => $main_group,//array_values($groupedData),
    //         'company_profile' => $company_profile
    //     ];
    // }

    function getIncomeByCategories($arr, $ss)
    {
        $d = (object)$arr;
        $header_list = ['Date', 'Receipt No.', 'Student Name', 'Cash', 'Transfer', 'Cheque', 'Remark'];
        $keys = $this->createKeyValue('key', $this->stringToKeyCase($header_list));
        $header = $this->createMulKeyValue('name', $header_list, $keys);
        $company_profile = self::getCompanyInfo($ss);

        // Date range calculation
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-d', strtotime('-90 days'));
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-d');
        $str_date = "DATE(v.pmt_date) BETWEEN '$start_date' AND '$end_date'";

        // Filtering by fee_type_id if provided
        $fee_type_id = isset($d->fee_type_id) ? $d->fee_type_id : null;
        $campus_id = isset($d->campus_id) ? $d->campus_id : 1;
        $str_search = $fee_type_id ? 'ivt.fee_type_id = ' . $fee_type_id : '1=1';
        $campus = DB::table(DBX::$branch_table)->where('id',$campus_id)->value('name');


        // Main query to get the records
        $rows = DB::table('invoices as v')
            ->join('receipts as r', 'v.id', '=', 'r.invoice_id')
            ->join('students as s', 's.id', '=', 'v.student_id')
            ->join('invoice_items as i', 'i.invoice_id', '=', 'v.id')
            ->whereRaw($str_date)
            ->selectRaw('
                s.name as student_name,
                v.note as remark,
                v.pmt_date as date,
                r.receipt_number as receipt_no,
                i.fee_type_id,
                r.id as receipt_id,
                SUM(i.net_amount) as net_amount,
                displayMoney(SUM(i.net_amount), "USD") as formatted_net_amt,
                v.invoice_type
            ')
            ->groupByRaw('
                r.receipt_number, v.note, v.pmt_date, i.fee_type_id, s.name,  r.id, v.invoice_type
            ')
            ->get();

        // Retrieve and format receipt amounts
        $receip_amt = DB::select('
            SELECT rm.pmt_method as method_name, rm.payment_method_id as pmt_method_id, 
            rm.cheque_number, rm.receipt_id, rm.invoice_id, rm.amount, 
            displayMoney(rm.amount, "USD") as formatted_amount 
            FROM receipt_amount as rm
        ');

        // Initialize fee totals and other variables
        $groupedData = [];
        $fee_totals = ['transfer' => 0, 'cheque' => 0, 'cash' => 0];
        $transfer = 0;
        $arr_fee_id = [1, 2, 3, 4, 5, 6, 9, 10];
        $feeTypes = DB::table('fee_types')
            ->whereIn('id', $arr_fee_id)
            ->where('subs_id', hex2bin($ss->subs_id))
            ->selectRaw('id, name')
            ->get();
        $feeTypes = self::catagorySortByFeeType($feeTypes);

        // Group data by fee type and process payments
        foreach ($rows as $row) {
            foreach ($feeTypes as $feeType) {
                $fee_type = self::getFeeTypeName(
                    ($row->fee_type_id == $feeType->id) ? $row->fee_type_id : $feeType->id
                );

                if (!isset($groupedData[$fee_type])) {
                    $groupedData[$fee_type] = [
                        'fee_type' => $fee_type,
                        'fee' => [],
                    ];
                }

                if ($row->fee_type_id == $feeType->id) {
                    $pmts = self::getIncomeByCategoriesDetails($receip_amt, $row->receipt_id, $row->net_amount, $row->formatted_net_amt);
                    $row->transfer = 0;

                    if ($row->invoice_type == 'tuition_fee' && $row->fee_type_id == 1) {
                        foreach ($pmts as $p) {
                            $key = $p->method_name;
                            $row->raw_transfer = 0;

                            if ($key == 'bank') {
                                $transfer += $p->amount;
                                $row->transfer = $p->formatted_amount . " <span class='text-danger'>" . GeneralSettings::PaymentMethodName($p->pmt_method_id) . "($p->cheque_number)</span>";
                                $row->raw_transfer = $transfer;
                            } elseif ($key == 'cheque') {
                                $row->$key = $p->formatted_amount . " " . GeneralSettings::PaymentMethodName($p->pmt_method_id) . " ($p->cheque_number)";
                            }

                            $row->cash = $row->net_amount - $transfer;
                        }
                    } else {
                        foreach ($pmts as $p) {
                            $key = $p->method_name;
                            $row->$key = $p->amount;

                            if ($key == 'bank') {
                                $transfer += $p->amount;
                                $row->transfer = $p->formatted_amount . " <span class='text-danger'>" . GeneralSettings::PaymentMethodName($p->pmt_method_id) . "($p->cheque_number)</span>";
                                $row->raw_transfer = $transfer;
                            } elseif ($key == 'cheque') {
                                $row->$key = $p->formatted_amount . " " . GeneralSettings::PaymentMethodName($p->pmt_method_id) . " ($p->cheque_number)";
                            }
                        }
                    }

                    // Format values for display
                    $row->date = str_replace('-', ' ', date('d-M-Y', strtotime($row->date)));
                    $row->net_amount = number_format(floatval($row->net_amount), 2);
                    $row->formatted_net_amt = '$' . number_format(floatval(str_replace('$', '', $row->formatted_net_amt)), 2);
                    $row->cash = '$' . number_format(floatval(isset($row->cash) ?? 0), 2);
                    $row->transfer = '$' . number_format(floatval(isset($row->transfer) ?? 0), 2);
                    $row->cheque = '$' . number_format(floatval(isset($row->cheque) ?? 0), 2);

                    if ($key == 'cheque') {
                        $row->$key = '$' .number_format(floatval($row->$key), 2);
                    }

                    $groupedData[$fee_type]['fee'][] = $row;
                }
            }
        }

        // Calculate totals for each fee type
        foreach ($groupedData as $fee_type => &$fee_data) {
            $total_transfer = $total_cheque = $total_cash = 0;

            foreach ($fee_data['fee'] as $fee) {
                $total_transfer += floatval(str_replace('$', '', $fee->raw_transfer ?? 0));
                $total_cheque += floatval(str_replace('$', '', $fee->cheque ?? 0));
                $total_cash += floatval(str_replace('$', '', $fee->cash ?? 0));
            }

            $fee_data['total_transfer'] = '$' . number_format(floatval($total_transfer), 2);
            $fee_data['total_cheque'] = '$' . number_format(floatval($total_cheque), 2);
            $fee_data['total_cash'] = '$' . number_format(floatval($total_cash), 2);
            $fee_data['total'] = '$' . number_format(floatval($total_transfer + $total_cash + $total_cheque), 2);
            $fee_data['sub_label'] = 'Sub Total';

            $fee_totals['transfer'] += $total_transfer;
            $fee_totals['cheque'] += $total_cheque;
            $fee_totals['cash'] += $total_cash;
        }

        // Format fee totals for output
        $fee_totals['total'] = '$' . number_format($fee_totals['transfer'] + $fee_totals['cheque'] + $fee_totals['cash'], 2);
        $fee_totals['form'] = 'income_by_category';
        $fee_totals['sub_label'] = 'Sub Total';
        $fee_totals['label'] = 'Grand Total';

        // Prepare final output
        $main_group = [
            'all_fee' => array_values($groupedData),
            'fee_totals' => $fee_totals
        ];

        $title = '(' . $campus . ') Income By Category';
        $sub_title = date('d-M-Y', strtotime($start_date)) . ' To ' . date('d-M-Y', strtotime($end_date));

        return (object)[
            'header' => $header,
            'title' => $title,
            'sub_title' => $sub_title,
            'form' => 'income_by_category',
            'list' => $main_group,
            'company_profile' => $company_profile
        ];
    }


    public static function catagorySortByFeeType($data = null,$type = 'array')
    {
        $data = is_array($data) ? $data : (array)$data;
        // Define default data if none is provided
        $data = $data ?: [
            ["id" => 1, "name" => "Tuition Fee"],
            ["id" => 2, "name" => "Admin Fee"],
            ["id" => 3, "name" => "Books Fee"],
            ["id" => 4, "name" => "Bus Fee"],
            ["id" => 5, "name" => "Lunch Fee"],
            ["id" => 6, "name" => "Uniform Fee"],
            ["id" => 7, "name" => "Arts"],
            ["id" => 8, "name" => "Sports"],
            ["id" => 9, "name" => "Other"],
            ["id" => 10, "name" => "Text Books"]
        ];

        // Define the desired order
        $order = [
            "Tuition Fee",
            "Admin Fee",
            "Registration Fee",
            "Book Fee",
            "Uniform Fee",
            "Bus Fee",
            "Lunch Fee",
            "Test Fee",
            "Copy Book",
            "Other Fee",
            "Deposit"
        ];

        // Sort the array based on the order
        usort($data, function ($a, $b) use ($order) {
            $posA = array_search(isset($a['name']) ?? $a->name, $order);
            $posB = array_search(isset($a['name']) ?? $a->name, $order);

            // If not found, place them at the end
            $posA = $posA === false ? count($order) : $posA;
            $posB = $posB === false ? count($order) : $posB;

            return $posA - $posB;
        });

        if($type=='array')
            return $data[0];
        else
            return $data;

    }

    public static function paymentSortByFeeType($data = null)
    {
        $data = is_array($data) ? $data : (array)$data;
        // Define default data if none is provided
        $data = $data ?: [
            ["id" => 1, "name" => "Tuition Fee"],
            ["id" => 3, "name" => "Books Fee"],
            ["id" => 4, "name" => "Bus Fee"],
            ["id" => 5, "name" => "Lunch Fee"]
        ];

        // Define the desired order
        $order = [
            "Tuition Fee",
            "Book Fee",
            "Bus Fee",
            "Lunch Fee",
        ];

        // Sort the array based on the order
        usort($data, function ($a, $b) use ($order) {
            $posA = array_search(isset($a['name']) ?? $a->name, $order);
            $posB = array_search(isset($a['name']) ?? $a->name, $order);
            // If not found, place them at the end
            $posA = $posA === false ? count($order) : $posA;
            $posB = $posB === false ? count($order) : $posB;

            return $posA - $posB;
        });

        return $data[0];
    }

    function getIncomeByCategoriesDetails($rows,$receipt_id,$fee_net_amount,$formatted_net_amt){
        $c = null;
        $i = 0;
        $data = [];
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->receipt_id == $receipt_id){
                $data[] = (object)[
                    'amount' => $c->amount,
                    'method_name' => $c->method_name,
                    'formatted_amount' => $c->formatted_amount,
                    'cheque_number' => $c->cheque_number,
                    'pmt_method_id' => $c->pmt_method_id,
                ];
            }
            $i++;
        }while($c);
        return $data;
    }

    //back up
    // function getIncomeByClass($arr,$ss){
    //     $d = (object)$arr;
    //     $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days')); //start date get last 3 month
    //     $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-d');
    //     $campus_id = isset($d->campus_id) ? $d->campus_id : null;
    //     $level_id = isset($d->level_id) ? $d->level_id : null;
    //     //** */
    //     $header_list = ['Class','Total Student'];
    //     $company_profile = self::getCompanyInfo($ss);
    //     $keys = ['Class','Total Student'];
    //     $obj = self::getFeeCategory();//self::getOtherFeesList(1);

    //     $header_list = array_merge($header_list, $obj['header_list']);
    //     $keys = array_merge($keys, $obj['key_list']);

    //     $header_list[] = 'Total';
    //     $keys[]='total';
    //     $keys = $this->createKeyValue('key',self::stringToKeyCase($keys));
    //     $header = $this->createMulKeyValue('name',$header_list,$keys);
    //     //** Income By Class */
    //     $str_srch = '1=1';
    //     if($campus_id) $str_srch .= ' AND e.campus_id = ' . $campus_id;
    //     if($level_id) $str_srch .= ' AND e.level_id = ' . $level_id;
    //     // $main_q = 'SELECT e.id as enrollment_id,gm.group_id,e.level_id,e.session_id,sg.term_id,sg.descriptive_name,COUNT(DISTINCT gm.student_id) as total_student FROM enrollments as e INNER JOIN group_members as gm ON gm.enrollment_id = e.id INNER JOIN student_groups as sg ON sg.id = gm.group_id '.$str_srch.' GROUP BY gm.student_id,e.id,gm.group_id,e.level_id,e.session_id,sg.term_id,sg.descriptive_name';
    //     // $rows = DB::select($main_q);
    //     $rows = DB::table('enrollments as e')->join('group_members as gm','e.id','=','gm.enrollment_id')->join('student_groups as sg','sg.id','=','gm.group_id')->join('terms as t','t.id','=','e.term_id')->whereRaw($str_srch)->selectRaw('e.level_id,e.session_id,sg.id as group_id,sg.descriptive_name,COUNT(gm.student_id) as total_student,t.name AS term')->groupByRaw('t.name,sg.id,e.level_id,e.session_id,sg.term_id,sg.descriptive_name')->get();
    //     // $invoices = DB::table('invoices')->selectRaw('id,invoice_type,enrollment_id')->get();
    //     // $str_date = '2=2';
    //     $str_date = 'DATE(v.pmt_date) BETWEEN \''.$start_date.'\' AND \''.$end_date.'\'';
        
    //     $str_campus = $campus_id>0 ? 'v.campus_id = '.$campus_id : '1=1';
    //     $items = DB::table('invoices as v')->join('invoice_items as i','i.invoice_id','=','v.id')->join('group_members as gm','gm.enrollment_id','=','v.enrollment_id')->whereRaw($str_date)->whereRaw($str_campus)->whereRaw('ifnull(v.inactive,0)=0')->selectRaw('i.fee_type_id,gm.group_id,SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total')->groupByRaw('i.fee_type_id,gm.group_id')->get();
    //     $groupedByClass=[];
    //     $grand_total = 0;
    //     $fee_totals =['total_student'=>0,'total' => 0];
    //     foreach ($rows as $row) {
    //         $group = $row->descriptive_name;
    //         // $group = DB::table('student_groups')->where('level_id',$row->level_id)->where('session_id',$row->session_id)->take(1)->value('descriptive_name');
    //         if(!isset($groupedByClass[$group])){
    //             $groupedByClass[$group] = [
    //                 'class' => $group,
    //                 "fee" => [],
    //                 'class_fee_totals' => [],
    //             ];
    //         }
    //         $total_type=0;
    //         foreach ($header as $h) {
    //             $fee_type = $h['name'];
    //             $key = $h['key'];
    //             if (in_array($fee_type,['Class','Total Student','Total'])){
    //                 continue;
    //             }
    //             // if($fee_type == 'School Fee') $fee_type = $key;
    //             $fee_type_id = self::getFeeTypeID($fee_type);
    //             $item = self::getIncomeByClassValues($items,$fee_type_id,$row->group_id);
    //             $row->$key = $item->formatted_total;
    //             $groupedByClass[$group]['class_fee_totals'][$key] = $item->formatted_total;
    //             $total_type += $item->total;
    //             if(!isset($fee_totals[$key])){
    //                 $fee_totals[$key] = 0;
    //                 $sub_fee_total[$key] = 0;
    //             }
    //             $sub_fee_total[$key] += $item->total;
    //             $fee_totals[$key] = '$'.number_format($sub_fee_total[$key],2);
    //             $groupedByClass[$group]['class_fee_totals']['total_student'] = $row->total_student;
    //         }
    //         $row->class = "<p class='text-center'>$group<br/><small class='text-success'>$row->term</small></p>";
    //         $fee_totals['total_student'] += $row->total_student;
    //         $row->total = '$'.number_format($total_type,2);
    //         $groupedByClass[$group]['class_fee_totals']['total'] = '$'.number_format($total_type,2);
    //         $groupedByClass[$group]['class_fee_totals']['tuition_fee'] = '$'.number_format(str_replace('$','', $groupedByClass[$group]['class_fee_totals']['tuition_fee']),2);
    //         $row->tuition_fee = number_format(str_replace('$','',$row->tuition_fee),2);
    //         $groupedByClass[$group]['fee'][] = $row;
    //         $grand_total += $total_type;
    //     }
    //     $fee_totals['total'] = '$'. number_format($grand_total,2);
    //     $main_class = [
    //         'all_classes' => array_values($groupedByClass),
    //         'fee_totals' => $fee_totals,
    //         'grand_total' => 'Grand Total: $'.number_format($grand_total,2),
    //     ];
    //     //** End Income By Class */

    //     //** New Student */
    //     $student_header_list = ['Student Name','Sex','Class','Session','Starting Date','Discount','Payment Date'];
    //     // $except_student_keys = $student_header_list;
    //     $student_header_list = array_merge($student_header_list, $obj['header_list']);
    //     $student_keys = array_merge($student_header_list, $obj['key_list']);
    //     $bunus_keys = ['From Date','End Date','Duration of school fee'];
    //     $student_header_list = array_merge($student_header_list,$bunus_keys);
    //     $student_keys = array_merge($student_header_list,$bunus_keys);
    //     $student_keys = $this->createKeyValue('key',self::stringToKeyCase($student_keys));
    //     $new_student_header = $this->createMulKeyValue('name',$student_header_list,$student_keys);
    //     foreach ($new_student_header as &$h) {
    //         if ($h && isset($h['key'])) {
    //             $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
    //         }
    //     }
    //     $getPmtDate = '(SELECT formatDate(v.pmt_date) as pmt_date FROM invoices as v WHERE v.enrollment_id = e.id AND ifnull(v.is_paid,0)=1 AND v.invoice_type = \'tuition_fee\' ORDER BY v.id DESC LIMIT 1) as payment_date';
    //     $getInvoiceID = ',(SELECT v.id FROM invoices as v WHERE v.enrollment_id = e.id AND ifnull(v.is_paid,0)=1 AND v.invoice_type = \'tuition_fee\' ORDER BY v.id DESC LIMIT 1) as invoice_id';
    //     $getClass = ',(SELECT (SELECT sg.descriptive_name FROM student_groups as sg WHERE sg.id = gm.group_id) FROM group_members as gm WHERE gm.enrollment_id = e.id ) as class';
    //     //* new student string search
    //     $nst_str_srch = '';
    //     if($start_date && $end_date) $str_srch = ' AND e.id IN (SELECT v.enrollment_id FROM invoices as v WHERE v.pmt_date BETWEEN \'' . $start_date . '\' AND \'' . $end_date.'\')';
    //     $new_student_q = 'SELECT DISTINCT '.$getPmtDate.$getClass.$getInvoiceID.',formatDate(e.start_date) as from_date,formatDate(e.tuition_end_date) as end_date,formatDate(s.admission_date) as starting_date,s.id as student_id,s.name as student_name,s.sex, e.session_id,(SELECT pl.name FROM program_levels as pl WHERE pl.id = e.level_id) as level,(ifnull(p.sibling_discount,0) + ifnull(p.policy_discount,0)) as discount FROM  students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN payments as p ON e.id = p.enrollment_id WHERE ifnull(e.is_new_student,0)=1 AND e.status_id > 2'.$nst_str_srch.$str_srch;
    //     $students = DB::select($new_student_q);
    //     $new_student_items = DB::select('SELECT (SELECT v.student_id FROM invoices as v WHERE i.invoice_id = v.id) as student_id,(SELECT ft.name FROM fee_types as ft WHERE ft.id = i.fee_type_id) as fee_cate,SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total,i.invoice_id,i.start_date,i.end_date FROM invoice_items as i WHERE ifnull(i.is_paid,0)=1 GROUP BY i.fee_type_id,i.invoice_id,i.start_date,i.end_date;');
    //     $fee_types = self::getFeeCategory();
    //     foreach($students as $st){
    //         foreach ($fee_types['key_list'] as $idx=>$name) {
    //             $key = self::stringToKeyCase($name);
    //             $item = self::getNewStudentFeeDetails($new_student_items,$name,$st->student_id);
    //             $st->$key = $item->formatted_total;
    //             $st->duration_of_school_fee = self::getSchoolFeeDuration($st->invoice_id);
    //         }
    //         $st->session = GeneralSettings::getSessionName($st->session_id);
    //         unset($st->session_id);
    //     }
    //     // return $students;
    //     //** End New Student */

    //     //** Suspend Student */
    //     $leave_student_header = ['Student Name','Sex','Class','Session','Starting Date','Payment','From Date','End Date','Period','Last date of comming to school','Remaining Days'];
    //     $suspend_header = $leave_student_header;
    //     $suspend_keys = $leave_student_header;
    //     $suspend_header[] = 'Suspend (From-To)';
    //     $suspend_keys = self::stringToKeyCase($suspend_header);
    //     $suspend_header = $this->createMulKeyValue('name',$suspend_header,$this->createKeyValue('key',$suspend_keys));
    //     foreach ($suspend_header as &$h) {
    //         if ($h && isset($h['key'])) {
    //             $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
    //         }
    //     }
    //     $getLastAttScanned = '(SELECT sa.session_date FROM student_attendances as sa WHERE sa.student_id = s.id ORDER BY DATE(sa.session_date) DESC LIMIT 1) as last_date_of_comming_to_school';
    //     $suspend_students_query = 'SELECT '.$getLastAttScanned.',formatDate(e.start_date) as from_date,e.level_id,e.session_id,e.start_date,formatDate(l.leave_date) as leave_date,CONCAT(formatDate(l.leave_date),\' to \',formatDate(l.return_date)) as suspend_fromto,formatDate(e.tuition_end_date) as end_date,e.tuition_end_date,displayMoney(v.paid_amount,\'USD\') as payment,s.name as student_name,s.sex,formatDate(s.admission_date) as starting_date FROM students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN leaves as l ON l.enrollment_id = e.id INNER JOIN invoices as v ON v.enrollment_id = e.id WHERE ifnull(l.authorized,0) = 1 AND e.status_id>2 AND l.leave_type_id = 3;';
    //     $suspend_students = DB::select($suspend_students_query);
    //     foreach($suspend_students as $row){
    //         $row->period = Invoice::getPaymentDuration($row->start_date, $row->tuition_end_date,1);
    //         $remaining_day = dateDiff_days($row->leave_date, $row->tuition_end_date);
    //         $row->remaining_days = $remaining_day . 'day(s)';
    //         $row->class = GeneralSettings::getlevelName($row->level_id);
    //         $row->session = GeneralSettings::getSessionName($row->session_id);
    //         unset($row->session_id,$row->level_id);
    //     }
    //     // return$suspend_students;
    //     //** End Suspend Student */

    //      //** Drop Student */
    //      $drop_header = $leave_student_header;
    //      $drop_keys = $leave_student_header;
    //      $drop_header[] = 'Drop (From-To)';
    //      $drop_keys = self::stringToKeyCase($drop_header);
    //      $drop_header = $this->createMulKeyValue('name',$drop_header,$this->createKeyValue('key',$drop_keys));
    //      foreach ($drop_header as &$h) {
    //         if ($h && isset($h['key'])) {
    //             $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
    //         }
    //      }
    //      $getLastAttScanned = '(SELECT sa.session_date FROM student_attendances as sa WHERE sa.student_id = s.id ORDER BY DATE(sa.session_date) DESC LIMIT 1) as last_date_of_comming_to_school';
    //      $drop_students_query = 'SELECT '.$getLastAttScanned.',formatDate(e.start_date) as from_date,e.start_date,e.session_id,e.level_id,CONCAT(formatDate(l.leave_date),\' to \',formatDate(l.return_date)) as drop_fromto,formatDate(e.tuition_end_date) as end_date,e.tuition_end_date,displayMoney(v.paid_amount,\'USD\') as payment,s.name as student_name,s.sex,formatDate(s.admission_date) as starting_date FROM students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN leaves as l ON l.enrollment_id = e.id INNER JOIN invoices as v ON v.enrollment_id = e.id WHERE ifnull(l.authorized,0) = 1 AND e.status_id>2 AND l.leave_type_id = 2;';
    //      $drop_students = DB::select($drop_students_query);
    //      foreach($drop_students as $row){
    //          $row->period = Invoice::getPaymentDuration($row->start_date, $row->tuition_end_date,1);
    //          $remaining_day = dateDiff_days($row->start_date, $row->tuition_end_date);
    //          $row->remaining_days = $remaining_day . 'day(s)';
    //          $row->class = GeneralSettings::getlevelName($row->level_id);
    //          $row->session = GeneralSettings::getSessionName($row->session_id);
    //          unset($row->session_id,$row->level_id);
    //      }
    //     //  return$drop_students;
    //      //** End Drop Student */

    //     $campus = DB::table(DBX::$branch_table)->where('id',$campus_id)->value('name');
    //     $title = 'Income By Class ('.$campus.')';
    //     $timestamp = strtotime($start_date);
    //     $startDate = date('d-M-Y', $timestamp);
    //     $timestamp = strtotime($end_date);
    //     $endDate = date('d-M-Y', $timestamp);
    //     $sub_title = $startDate.' To '.$endDate;
    //     return (object)[
    //         'all_classes' => (object)[
    //             'header' => $header,
    //             'list' => $main_class,
    //         ],
    //         'new_students' => (object)[
    //             'title' => 'New Student',
    //             'header' => $new_student_header,
    //             'list' => $students
    //         ],
    //         'suspend_students' => (object)[
    //             'title' => 'Suspended Student',
    //             'header' => $suspend_header,
    //             'list' => $suspend_students
    //         ],
    //         'drop_students' => (object)[
    //             'title' => 'Drop Student',
    //             'header' => $drop_header,
    //             'list' => $drop_students
    //         ],
    //         'form' => 'income_by_class',
    //         'title' => $title,
    //         'sub_title' => $sub_title,
    //         'date' => date('Y-m-d'),
    //         'company_profile' => $company_profile
    //     ];
    // }

    function getIncomeByClass($arr,$ss){
        $d = (object)$arr;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days')); //start date get last 3 month
        $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-d');
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $level_id = isset($d->level_id) ? $d->level_id : null;
        //** */
        $header_list = ['Class','Total Student'];
        $company_profile = self::getCompanyInfo($ss);
        $keys = ['Class','Total Student'];
        $obj = self::getFeeCategory();//self::getOtherFeesList(1);

        $header_list = array_merge($header_list, $obj['header_list']);
        $keys = array_merge($keys, $obj['key_list']);

        $header_list[] = 'Total';
        $keys[]='total';
        $keys = $this->createKeyValue('key',self::stringToKeyCase($keys));
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        //** Income By Class */
        $str_srch = '1=1';
        if($campus_id) $str_srch .= ' AND e.campus_id = ' . $campus_id;
        if($level_id) $str_srch .= ' AND e.level_id = ' . $level_id;
        // $main_q = 'SELECT e.id as enrollment_id,gm.group_id,e.level_id,e.session_id,sg.term_id,sg.descriptive_name,COUNT(DISTINCT gm.student_id) as total_student FROM enrollments as e INNER JOIN group_members as gm ON gm.enrollment_id = e.id INNER JOIN student_groups as sg ON sg.id = gm.group_id '.$str_srch.' GROUP BY gm.student_id,e.id,gm.group_id,e.level_id,e.session_id,sg.term_id,sg.descriptive_name';
        // $rows = DB::select($main_q);
        $rows = DB::table('enrollments as e')->join('program_levels as pl','pl.id','=','e.level_id')->join('group_members as gm','e.id','=','gm.enrollment_id')->join('student_groups as sg','sg.id','=','gm.group_id')->join('terms as t','t.id','=','e.term_id')->whereRaw($str_srch)->selectRaw('e.level_id,e.session_id,sg.id as group_id,sg.descriptive_name,COUNT(gm.student_id) as total_student,t.name AS term')->groupByRaw('t.name,sg.id,e.level_id,e.session_id,sg.term_id,sg.descriptive_name')->get();
        // $rows = DB::table('enrollments as e')
        // ->join('program_levels as pl', 'pl.id', '=', 'e.level_id')
        // ->join('group_members as gm', 'e.id', '=', 'gm.enrollment_id')
        // ->join('student_groups as sg', 'sg.id', '=', 'gm.group_id')
        // ->join('terms as t', 't.id', '=', 'e.term_id')
        // ->whereRaw($str_srch)
        // ->selectRaw('e.level_id, e.session_id, sg.id as group_id, sg.descriptive_name, COUNT(gm.student_id) as total_student, t.name AS term, pl.name as level_name')
        // ->groupByRaw('t.name, sg.id, e.level_id, e.session_id, sg.term_id, sg.descriptive_name, pl.name')
        // ->orderBy('pl.name')
        // ->get();
        // $invoices = DB::table('invoices')->selectRaw('id,invoice_type,enrollment_id')->get();
        // $str_date = '2=2';
        $str_date = 'DATE(v.pmt_date) BETWEEN \''.$start_date.'\' AND \''.$end_date.'\'';
        
        $str_campus = $campus_id>0 ? 'v.campus_id = '.$campus_id : '1=1';
        $items = DB::table('invoices as v')->join('invoice_items as i','i.invoice_id','=','v.id')->join('group_members as gm','gm.enrollment_id','=','v.enrollment_id')->whereRaw($str_date)->whereRaw($str_campus)->whereRaw('ifnull(v.inactive,0)=0')->selectRaw('i.fee_type_id,gm.group_id,SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total')->groupByRaw('i.fee_type_id,gm.group_id')->get();
        $groupedByClass=[];
        $groupedByProgram=[];
        $grand_total = 0;
        $fee_totals =['total_student'=>0,'total' => 0];
        // return$rows;
        foreach ($rows as $row) {
            $group = $row->descriptive_name;
            $program = DB::table('program_levels as pl')->join('programs as p','p.id','=','pl.program_id')->where('pl.id',$row->level_id)->value('p.name');
            // $group = DB::table('student_groups')->where('level_id',$row->level_id)->where('session_id',$row->session_id)->take(1)->value('descriptive_name');
            
            if(!isset($groupedByClass[$group])){
                $groupedByClass[$group] = [
                    'class' => $group,
                    "fee" => [],
                    'class_fee_totals' => [],
                ];
            }
            if (!isset($groupedByProgram[$program])) {
                $groupedByProgram[$program] = [
                    'program' => $program,
                    'classes'=>[],
                    'group_name'=>[],
                    'classes_fee_totals'=>[]
                ];
            }
            $total_type=0;
            foreach ($header as $h) {
                $fee_type = $h['name'];
                $key = $h['key'];
                if (in_array($fee_type,['Class','Total Student','Total'])){
                    continue;
                }
                // if($fee_type == 'School Fee') $fee_type = $key;
                $fee_type_id = self::getFeeTypeID($fee_type);
                $item = self::getIncomeByClassValues($items,$fee_type_id,$row->group_id);
                // $row->$key = $item->formatted_total;
                $row->$key = (float)$item->total <= 0 ? '' : '$'.number_format((float)$item->total,2);
                $groupedByClass[$group]['class_fee_totals'][$key] = $item->formatted_total;
                $total_type += $item->total;
                if(!isset($fee_totals[$key])){
                    $fee_totals[$key] = 0;
                    $sub_fee_total[$key] = 0;
                }
                $sub_fee_total[$key] += $item->total;
                $fee_totals[$key] = (float)$sub_fee_total[$key] <= 0 ? '$ -' : '$'.number_format($sub_fee_total[$key],2);
                $groupedByClass[$group]['class_fee_totals']['total_student'] = $row->total_student;
                
            }
            $row->class = "<p class='text-center'>$group<br/><small class='text-success'>$row->term</small></p>";
            $fee_totals['total_student'] += $row->total_student;
            $row->total = (float)$total_type <= 0 ? '$ -' : '$'.number_format($total_type,2);
            $groupedByClass[$group]['class_fee_totals']['total'] = (float)$total_type <= 0 ? '$ -' : '$'.number_format($total_type,2);
            // $groupedByClass[$group]['class_fee_totals']['tuition_fee'] = (float)$total_type <= 0 ? '$ -' : '$'.number_format(str_replace('$','', $groupedByClass[$group]['class_fee_totals']['tuition_fee']),2);
            // $row->tuition_fee = '$'.number_format(str_replace('$','',$row->tuition_fee),2);
            $groupedByClass[$group]['fee'][] = $row;
            $groupedByProgram[$program]['classes'][$group] = $groupedByClass[$group]['fee'];
            $groupedByProgram[$program]['group_name'][] = $group;
            $groupedByProgram[$program]['classes_fee_totals'] = $fee_totals;
            $grand_total += $total_type;
        }
        // return $groupedByProgram;
        $fee_totals['total'] = '$'. number_format($grand_total,2);
        $main_class = [
            // 'all_classes' => array_values($groupedByClass),
            'all_classes' => array_values($groupedByProgram),
            'fee_totals' => $fee_totals,
            'grand_total' => 'Grand Total: $'.number_format($grand_total,2),
        ];
        //** End Income By Class */

        //** New Student */
        $student_header_list = ['Student Name','Sex','Class','Session','Starting Date','Discount','Payment Date'];
        // $except_student_keys = $student_header_list;
        $student_header_list = array_merge($student_header_list, $obj['header_list']);
        $student_keys = array_merge($student_header_list, $obj['key_list']);
        $bunus_keys = ['From Date','End Date','Duration of school fee'];
        $student_header_list = array_merge($student_header_list,$bunus_keys);
        $student_keys = array_merge($student_header_list,$bunus_keys);
        $student_keys = $this->createKeyValue('key',self::stringToKeyCase($student_keys));
        $new_student_header = $this->createMulKeyValue('name',$student_header_list,$student_keys);
        foreach ($new_student_header as &$h) {
            if ($h && isset($h['key'])) {
                $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
            }
        }
        $getPmtDate = '(SELECT formatDate(v.pmt_date) as pmt_date FROM invoices as v WHERE v.enrollment_id = e.id AND ifnull(v.is_paid,0)=1 AND v.invoice_type = \'tuition_fee\' ORDER BY v.id DESC LIMIT 1) as payment_date';
        $getInvoiceID = ',(SELECT v.id FROM invoices as v WHERE v.enrollment_id = e.id AND ifnull(v.is_paid,0)=1 AND v.invoice_type = \'tuition_fee\' ORDER BY v.id DESC LIMIT 1) as invoice_id';
        $getClass = ',(SELECT (SELECT sg.descriptive_name FROM student_groups as sg WHERE sg.id = gm.group_id) FROM group_members as gm WHERE gm.enrollment_id = e.id ) as class';
        //* new student string search
        $nst_str_srch = '';
        if($start_date && $end_date) $str_srch = ' AND e.id IN (SELECT v.enrollment_id FROM invoices as v WHERE v.pmt_date BETWEEN \'' . $start_date . '\' AND \'' . $end_date.'\')';
        $new_student_q = 'SELECT DISTINCT '.$getPmtDate.$getClass.$getInvoiceID.',formatDate(e.start_date) as from_date,formatDate(e.tuition_end_date) as end_date,formatDate(s.admission_date) as starting_date,s.id as student_id,s.name as student_name,s.sex, e.session_id,(SELECT pl.name FROM program_levels as pl WHERE pl.id = e.level_id) as level,(ifnull(p.sibling_discount,0) + ifnull(p.policy_discount,0)) as discount FROM  students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN payments as p ON e.id = p.enrollment_id WHERE ifnull(e.is_new_student,0)=1 AND e.status_id > 2'.$nst_str_srch.$str_srch;
        $students = DB::select($new_student_q);
        $new_student_items = DB::select('SELECT (SELECT v.student_id FROM invoices as v WHERE i.invoice_id = v.id) as student_id,(SELECT ft.name FROM fee_types as ft WHERE ft.id = i.fee_type_id) as fee_cate,SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total,i.invoice_id,i.start_date,i.end_date FROM invoice_items as i WHERE ifnull(i.is_paid,0)=1 GROUP BY i.fee_type_id,i.invoice_id,i.start_date,i.end_date;');
        $fee_types = self::getFeeCategory();
        foreach($students as $st){
            foreach ($fee_types['key_list'] as $idx=>$name) {
                $key = self::stringToKeyCase($name);
                $item = self::getNewStudentFeeDetails($new_student_items,$name,$st->student_id);
                $st->$key = (float)$item->total <= 0 ? '' : '$'.number_format((float)$item->total,2);
            }
            $st->duration_of_school_fee = self::getSchoolFeeDuration($st->invoice_id) ?? Invoice::getPaymentDuration($st->from_date,$st->end_date);
            $st->payment_date = $st->payment_date ?? DB::table('invoices as i')->where('i.student_id',$st->student_id)->where('i.is_paid',1)->value('i.pmt_date') ?? '<div class="text-center">- - -</div>';
            $st->discount = number_format($st->discount).'%';
            $st->session = GeneralSettings::getSessionName($st->session_id);
            unset($st->session_id);
        }
        // return $students;
        //** End New Student */

        //** Suspend Student */
        $leave_student_header = ['Student Name','Sex','Class','Session','Starting Date','Payment','Period','Duration','Last date of comming to school','Remaining Days'];
        $suspend_header = $leave_student_header;
        $suspend_keys = $leave_student_header;
        $suspend_header[] = 'Suspend (From-To)';
        $suspend_keys = self::stringToKeyCase($suspend_header);
        $suspend_header = $this->createMulKeyValue('name',$suspend_header,$this->createKeyValue('key',$suspend_keys));
        foreach ($suspend_header as &$h) {
            if ($h && isset($h['key'])) {
                $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
            }
        }
        $getLastAttScanned = '(SELECT sa.session_date FROM student_attendances as sa WHERE sa.student_id = s.id ORDER BY DATE(sa.session_date) DESC LIMIT 1) as last_date_of_comming_to_school';
        $suspend_students_query = 'SELECT '.$getLastAttScanned.',formatDate(e.start_date) as from_date,e.level_id,e.session_id,e.start_date,l.leave_date,formatDate(l.leave_date) as leave_date,CONCAT(formatDate(l.leave_date),\' to \',formatDate(l.return_date)) as suspend_fromto,l.return_date,formatDate(e.tuition_end_date) as end_date,e.tuition_end_date,displayMoney(v.paid_amount,\'USD\') as payment,s.name as student_name,s.sex,formatDate(s.admission_date) as starting_date FROM students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN leaves as l ON l.enrollment_id = e.id INNER JOIN invoices as v ON v.enrollment_id = e.id WHERE ifnull(l.authorized,0) = 1 AND e.status_id>2 AND l.leave_type_id = 3;';
        $suspend_students = DB::select($suspend_students_query);
        foreach($suspend_students as $row){
            $row->period = date('d M Y',strtotime($row->start_date)).' to '. date('d M Y', strtotime($row->tuition_end_date));
            $row->duration = Invoice::getPaymentDuration($row->start_date, $row->tuition_end_date,1);
            $remaining_day = dateDiff_days($row->leave_date, $row->tuition_end_date);
            $row->remaining_days = $remaining_day . 'day(s)';
            $row->payment = '$'.number_format((float)str_replace('$','', $row->payment),2);
            $row->class = GeneralSettings::getlevelName($row->level_id);
            $row->session = GeneralSettings::getSessionName($row->session_id);
            $row->last_date_of_comming_to_school = $row->last_date_of_comming_to_school ?? '<div class="text-center">- - -</div>';
            unset($row->session_id,$row->level_id,$row->start_date,$row->end_date,$row->leave_date,$row->return_date);
        }
        // return$suspend_students;
        //** End Suspend Student */

         //** Drop Student */
         $drop_header = $leave_student_header;
         $drop_keys = $leave_student_header;
         $drop_header[] = 'Drop (From-To)';
         $drop_keys = self::stringToKeyCase($drop_header);
         $drop_header = $this->createMulKeyValue('name',$drop_header,$this->createKeyValue('key',$drop_keys));
         foreach ($drop_header as &$h) {
            if ($h && isset($h['key'])) {
                $h['name'] = $h['key'] === 'starting_date' ? 'Admission Date' : $h['name'];
            }
         }
         $getLastAttScanned = '(SELECT sa.session_date FROM student_attendances as sa WHERE sa.student_id = s.id ORDER BY DATE(sa.session_date) DESC LIMIT 1) as last_date_of_comming_to_school';
         $drop_students_query = 'SELECT '.$getLastAttScanned.',formatDate(e.start_date) as from_date,e.start_date,e.session_id,e.level_id,l.leave_date,CONCAT(formatDate(l.leave_date),\' to \',formatDate(l.return_date)) as drop_fromto,l.return_date,formatDate(e.tuition_end_date) as end_date,e.tuition_end_date,displayMoney(v.paid_amount,\'USD\') as payment,s.name as student_name,s.sex,formatDate(s.admission_date) as starting_date FROM students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN leaves as l ON l.enrollment_id = e.id INNER JOIN invoices as v ON v.enrollment_id = e.id WHERE ifnull(l.authorized,0) = 1 AND e.status_id>2 AND l.leave_type_id = 2;';
         $drop_students = DB::select($drop_students_query);
         foreach($drop_students as $row){
            $row->period = date('d M Y',strtotime($row->start_date)).' to '. date('d M Y', strtotime($row->tuition_end_date));
            $row->duration = Invoice::getPaymentDuration($row->start_date, $row->tuition_end_date,1);
             $remaining_day = dateDiff_days($row->start_date, $row->tuition_end_date);
             $row->remaining_days = $remaining_day . 'day(s)';
             $row->class = GeneralSettings::getlevelName($row->level_id);
             $row->session = GeneralSettings::getSessionName($row->session_id);
            $row->last_date_of_comming_to_school = $row->last_date_of_comming_to_school ?? '<div class="text-center">- - -</div>';
            $row->drop_fromto = $row->drop_fromto ?? (date('d M Y',strtotime($row->leave_date)).' to ') . ($row->return_date ? date('d M Y', strtotime($row->return_date)) : '- - -');
            unset($row->session_id,$row->level_id,$row->start_date,$row->end_date,$row->leave_date,$row->return_date);
         }
        //  return$drop_students;
         //** End Drop Student */

        $campus = DB::table(DBX::$branch_table)->where('id',$campus_id)->value('name');
        $title = 'Income By Class ('.$campus.')';
        $timestamp = strtotime($start_date);
        $startDate = date('d-M-Y', $timestamp);
        $timestamp = strtotime($end_date);
        $endDate = date('d-M-Y', $timestamp);
        $sub_title = $startDate.' To '.$endDate;
        return (object)[
            'all_classes' => (object)[
                'header' => $header,
                'list' => $main_class,
            ],
            'new_students' => (object)[
                'title' => 'New Student',
                'header' => $new_student_header,
                'list' => $students
            ],
            'suspend_students' => (object)[
                'title' => 'Suspended Student',
                'header' => $suspend_header,
                'list' => $suspend_students
            ],
            'drop_students' => (object)[
                'title' => 'Drop Student',
                'header' => $drop_header,
                'list' => $drop_students
            ],
            'form' => 'income_by_class',
            'title' => $title,
            'sub_title' => $sub_title,
            'date' => date('Y-m-d'),
            'company_profile' => $company_profile
        ];
    }


    static function incomeByClassInvoice($rows,$enrollment_id){
        $c = null;
         $i = 0;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->enrollment_id == $enrollment_id){
                return (object)[
                    'id' => $c->id
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'id' => null
        ];
    }
    static function getSchoolFeeDuration($invoice_id){
        $row = DB::table('invoice_items')->where('item_id',100)->where('invoice_id',$invoice_id)->selectRaw('start_date,end_date')->first();
        if(!$row) return null;
        return Invoice::getPaymentDuration($row->start_date,$row->end_date);
    }


    static function getFeeTypes ($excepts=[]){
        $str_except = '1=1';
        if(isset($excepts[0])){
            $str_except = 'id NOT IN (' . implode(',', $excepts) . ')';
        }
        return DB::table('fee_types')->selectRaw('name,id')->whereRaw($str_except)->get();
    }

    static function getIncomeByClassValues($rows,$fee_type_id,$group_id){
        $i=0;
        $c=null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->fee_type_id == $fee_type_id && $c->group_id == $group_id){
                return (object)[
                    'total' => $c->total,
                    'formatted_total' => $c->formatted_total,
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'total' => 0,
            'formatted_total' => '$0',
        ];
    }

    static function getNewStudentFeeDetails($rows,$fee_type,$invoice_id){
        $i=0;
        $c=null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->fee_cate == $fee_type && $c->student_id == $invoice_id){
                return (object)[
                    'total' => $c->total,
                    'formatted_total' => $c->formatted_total,
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'total' => 0,
            'formatted_total' => '$0',
        ];
    }

    function getStudentDeposit($arr,$ss){
        $d = (object)$arr;
        $is_paid = isset($d->is_paid)?$d->is_paid:null;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) :date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-t');
        $header_list = ['No','Student Name','Student ID','Deposit date','Payment Date','Deposit','Class','Valid Date','Remark'];
        $campus_id = isset($d->campus_id) ? $d->campus_id:null;
        $keys = [];
        $sub_title = null;
        $replacements = [
            // 'Valid Date' => 'expire date',
        ];
        $keys = [];
        $total = 0;
        foreach ($header_list as $h) {
            if (array_key_exists($h, $replacements)){
                if (is_array($replacements[$h])) {
                    $replacement = array_shift($replacements[$h]);
                    array_push($keys, $replacement);
                } else {
                    array_push($keys, $replacements[$h]);
                }
            } else {
                array_push($keys, $h);
            }
        }

        $keys = $this->createKeyValue('key',$this->stringToKeyCase($keys));
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        $str_date = '1=1';
        if($start_date && $end_date) {
            $str_date = 'DATE(d.deposit_date) >= \'' .$start_date. '\' AND DATE(d.deposit_date) <= \''.$end_date.'\'';
            $sub_title = 'Deposit Date From: '.date('d-M-Y',strtotime($start_date)).' To '.date('d-M-Y',strtotime($end_date));
        }
        $str_search = '1=1';
        if($is_paid) $str_search .= ' AND d.is_used = '.$is_paid;
        if($campus_id) $str_search .= ' AND d.campus_id = '.$campus_id;
        $rows = DB::table('deposits as d')
            ->join('students as s','d.student_id','=','s.id')
            ->selectRaw('s.name as student_name,d.level_id,d.campus_id,d.session_id,d.deposit_amount as deposit,formatDate(d.deposit_date) as deposit_date,s.code as student_id,formatDate(d.expire_date) as valid_date,d.remark')
            ->whereRaw($str_search)
            ->whereRaw($str_date)
            ->get();
        $campuses = [];
        foreach($rows as $key=>$row){
            $row->no = $key+1;
            $row->class = GeneralSettings::getLevel($row->level_id)->name;
            $campus =  GeneralSettings::getCampus($row->campus_id)->shortcut;
            if (is_string($campus) && !in_array($campus, $campuses)) {
                $campuses[] = $campus;
            }
            unset($row->campus_id);
            $total += $row->deposit;
        }
        $campuses = empty($campuses) ? ['N/A']:$campuses;
        $title_status = isset($is_paid)? ($is_paid == 1 ? '(Paid) ' : ($is_paid == 0 ? '(Unpaid) ' : '')) :'(All)';
        $title = $title_status.'Student Deposit Report For '.implode(',',$campuses);
        $timestamp = strtotime($start_date);
        $startDate = date('d-M-Y', $timestamp);
        $timestamp = strtotime($end_date);
        $endDate = date('d-M-Y', $timestamp);
        $sub_title = $startDate.' To '.$endDate;
        $company_profile = self::getCompanyInfo($ss);
        $main_group = (object)[
            'fee' => $rows,
            'fee_totals' => (object)[
                'total' => '$'.$total,
                'label' => 'Total Deposit',
                'form' => 'deposit'
            ]
        ];

        return (object)[
            'header' => $header,
            'title' => $title,
            'sub_title' => $sub_title,
            'list' => $main_group,
            'form' => 'simple',
            'company_profile' => $company_profile
        ];
    }


    function getTotalPaymentByMonth($arr,$ss){
        $d = (object)$arr;
        $str_total_prev = 'Total Amount of Student Previous Payment';
        $header_list = ['Month','New Student Payment','Old Student Payment','Amount Paid','Amount Unpaid','Overdue','Total Paid',$str_total_prev,'Total']; //'Old Student Payment'
        $keys = [];
        foreach($header_list as $hl){
            if($hl == $str_total_prev){
                $hl = 'prev_paid';
                array_push($keys,$hl);
            }else array_push($keys,$hl);
        }
        $keys = $this->createKeyValue('key',self::stringToKeyCase($keys));
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        $str_where = '1';
        $level_id = isset($d->level_id)?$d->level_id:null;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        $start_date = isset($d->start_date) ? date('m',strtotime($d->start_date)) : null ;// date('m');
        $end_date = isset($d->end_date) ? date('m',strtotime($d->end_date)) : null ;//date('m');
        // $start_date = isset($d->start_date) ? date('Y', strtotime($d->start_date)) : date('Y');
        // $end_date = isset($d->end_date) ? date('Y', strtotime($d->end_date)) : date('Y');
        if($start_date && $end_date){
            $str_where .= ' AND MONTH(v.pmt_date) BETWEEN \'' . $start_date . '\' AND \'' . $end_date . '\'';
        }else{
            $str_where .= ' AND YEAR(v.pmt_date) BETWEEN \'' . date('Y') . '\' AND \'' . date('Y')+1 . '\'';
        }

        if($level_id){
            $str_where .= ' AND e.level_id = '.$level_id;
        }
        if($campus_id){
            $str_where .= ' AND e.campus_id = '.$campus_id;
        }
        $main_q = 'SELECT i.end_date,e.is_new_student as is_new,SUM(i.net_amount) as amount_paid,ft.name as fee_type,MONTH(v.pmt_date) as `mon`,e.academic_year FROM invoices as v INNER JOIN invoice_items as i ON i.invoice_id = v.id INNER JOIN fee_types as ft ON ft.id = i.fee_type_id INNER JOIN enrollments as e ON e.id = v.enrollment_id WHERE ifnull(v.is_paid,0) = 1 AND ifnull(i.is_paid,0)=1 AND '.$str_where.' GROUP BY ft.name,v.pmt_date,e.is_new_student,i.end_date,e.academic_year;';
        $rows = DB::select($main_q);

        $groupedData = [];

        $prevPaidByFeeType = [];
        $academic_year = null;
        $arr_fee_id = [1,3,4,5];
        $feeTypes = DB::table('fee_types')->whereIn('id',$arr_fee_id)->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name')->get();
        $feeTypes = self::catagorySortByFeeType($feeTypes);

        // Initialize groupedData with all fee types
        foreach ($feeTypes as $feeType) {
            $fee_type = $feeType->name;
            if (!isset($groupedData[$fee_type])) {
                $groupedData[$fee_type] = [
                    "type" => $fee_type,
                    "fee" => [],
                ];
        
                // Prepopulate all months from 1 to 12 with empty structures
                for ($i = 1; $i <= 12; $i++) {
                    $month = $i + 8; // Adjusting start from September (month 9)
                    if ($month > 12) {
                        $month -= 12; // Wrap around to January
                    }
                    $groupedData[$fee_type]['fee'][(string)$month] = [
                        "mon" => $month,
                        "month" => self::getShortMonthName($month),
                        "amount_paid" => '',
                        // "amount_unpaid" => '',
                        "new_student_payment" => '',
                        "old_student_payment" => '',
                        "overdue" => '',
                        "prev_paid" => '',
                        "total_paid" => '',
                        "total" => '',
                    ];
                }
            }
        }

        foreach ($rows as $row) {
            $month = $row->mon;
            $month_name = getMonthName($row->mon, 1);

            // Create academic_year
            $academic_year = $row->academic_year;

            foreach ($feeTypes as $feeType) {
                $fee_type = $row->fee_type ?? $feeType->name;

                if ($row->fee_type == $feeType->name) {
                    // Check if the month group exists, and if not, create it
                    if (!isset($groupedData[$fee_type]["fee"][$month])) {
                        $overdue = 0;
                        if (isDate($row->end_date) && $row->end_date < date('Y-m-d')) {
                            $overdue = $row->amount_paid;
                        }
                        $groupedData[$fee_type]["fee"][$month] = [
                            "amount_paid" => 0,
                            // 'amount_unpaid' => 0,
                            "new_student_payment" => 0,
                            'old_student_payment' => 0,
                            'end_date' => $row->end_date,
                            "fee_type" => $fee_type,
                            "mon" => $row->mon,
                            "month" => $month_name,
                            "overdue" => $overdue,
                            'prev_paid' => $prevPaidByFeeType[$fee_type],
                            'total_paid' => 0,
                            'total' => 0
                        ];
                    } else {
                        $row->end_date;
                        if (isDate($row->end_date) && $row->end_date < date('Y-m-d')) {
                            // $groupedData[$fee_type]['fee'][$month]['overdue'] += $row->amount_paid;
                            $groupedData[$fee_type]['fee'][$month]['overdue'] ++ ;// $row->amount_paid;
                        }else
                        $groupedData[$fee_type]['fee'][$month]['overdue'] = '0' ;// $row->amount_paid;
                        
                        $groupedData[$fee_type]['fee'][$month]["mon"] = $row->mon;
                        $groupedData[$fee_type]['fee'][$month]["month"] = $month_name;
                    }

                    if (!isset($groupedData[$fee_type]['fee'][$month]['amt_paid'])) {
                        $groupedData[$fee_type]['fee'][$month]['amt_paid'] = 0;
                    }
                    $groupedData[$fee_type]['fee'][$month]['amt_paid'] += $row->amount_paid;
                    // $groupedData[$fee_type]["fee"][$month]['amount_paid'] = '$' . number_format($groupedData[$fee_type]['fee'][$month]['amt_paid'],2);

                    if (!isset($groupedData[$fee_type]['fee'][$month]['new_pmt'])) {
                        $groupedData[$fee_type]['fee'][$month]['new_pmt'] = 0;
                    }

                    if ($row->is_new == 1) {
                        $groupedData[$fee_type]["fee"][$month]['new_pmt'] += $row->amount_paid;
                        $groupedData[$fee_type]["fee"][$month]['new_student_payment'] = '$' . number_format($groupedData[$fee_type]["fee"][$month]['new_pmt'],2);
                    }

                    // Calculate prev_paid from the previous month's amt_paid
                    $prevMonth = $month - 1;
                    if ($prevMonth < 1) {
                        $prevMonth += 12; // Wrap around to December of the previous year
                    }

                    // If the previous month's payment exists, use it for prev_paid
                    $prevPaid = isset($groupedData[$fee_type]['fee'][(string)$prevMonth]['amt_paid'])
                        ? $groupedData[$fee_type]['fee'][(string)$prevMonth]['amt_paid']
                        : 0;
                    

                    $prevPaidByFeeType[$fee_type] = '$' . number_format($prevPaid, 2);
                    $groupedData[$fee_type]["fee"][$month]['prev_paid'] = $prevPaidByFeeType[$fee_type];
                    // $groupedData[$fee_type]["fee"][$month]['old_student_payment'] = '$' . number_format($groupedData[$fee_type]["fee"][$month]['amt_paid'] - $groupedData[$fee_type]["fee"][$month]['new_pmt'],2);
                    $groupedData[$fee_type]["fee"][$month]['amount_paid'] = '$' . number_format($groupedData[$fee_type]["fee"][$month]['amt_paid'] - $groupedData[$fee_type]["fee"][$month]['new_pmt'],2);
                    $groupedData[$fee_type]["fee"][$month]['total_paid'] = '$' . number_format($groupedData[$fee_type]["fee"][$month]['amt_paid'],2);
                    $groupedData[$fee_type]["fee"][$month]['total'] = '$' . number_format($groupedData[$fee_type]["fee"][$month]['amt_paid'] + $prevPaid,2);
                    unset($groupedData[$fee_type]["fee"][$month]['old_student_payment']);
                }
            }
        }

        // return $groupedData;

        // Convert the "fee" object into an array
        foreach ($groupedData as &$feeTypeData) {
            $fees = array_values($feeTypeData["fee"]);
            $feeTypeData["fee"] = $fees;

        }

        $title = 'Total Payment By Month';
        $sub_title = 'Acadmic Year '.$academic_year;
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'list' => array_values($groupedData),//
            'form' => 'total_payment',
            'header' => $header,
            'company_profile' => self::getCompanyInfo($ss)
        ];
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

    // function getTotalPaymentByYear($arr,$ss){
    //     $d = (object)$arr;
    //     $str_total_prev = 'Total Amount of Student Previous Payment';
    //     $header_list = ['Academic Year','New Student Payment','Old Student Payment','Amount Paid','Overdue',$str_total_prev,'Total'];
    //     $keys = [];
    //     $prevPaidByFeeType = [];
    //     foreach($header_list as $hl){
    //         if($hl == $str_total_prev){
    //             $hl = 'prev_paid';
    //             array_push($keys,$hl);
    //         }else array_push($keys,$hl);
    //     }
    //     $keys = $this->createKeyValue('key',self::stringToKeyCase($keys));
    //     // $fee_types = self::getFeeTypes();
    //     $header = $this->createMulKeyValue('name',$header_list,$keys);
    //     $str_where = 'ifnull(v.is_paid,0) = 1';
    //     $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-d');
    //     $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-d',strtotime('+1 year'));
    //     $end = date('Y');
    //     $start = date('Y',strtotime('+1 year'));
    //     $level_id = isset($d->level_id)?$d->level_id:null;
    //     $campus_id = isset($d->campus_id)?$d->campus_id:null;
    //     if($start_date && $end_date){
    //         $start = date('Y',strtotime($start_date));
    //         $end = date('Y',strtotime($end_date));
    //         $str_where .= ' AND v.pmt_date >= \''.$start.'\' AND v.pmt_date <= \''.$end.'\'';
    //     }

    //     if($level_id){
    //         $str_where .= ' AND e.level_id = '.$level_id;
    //     }
    //     if($campus_id){
    //         $str_where .= ' AND e.campus_id = '.$campus_id;
    //     }
    //     $main_q = 'SELECT DISTINCT i.end_date,e.is_new_student as is_new,SUM(i.net_amount) as amount_paid,ft.name as fee_type,YEAR(v.pmt_date) as `year` FROM invoices as v INNER JOIN invoice_items as i ON i.invoice_id = v.id INNER JOIN fee_types as ft ON ft.id = i.fee_type_id INNER JOIN enrollments as e ON e.id = v.enrollment_id WHERE '.$str_where.' GROUP BY ft.name,MONTH(v.pmt_date),YEAR(v.pmt_date),e.is_new_student,i.end_date;';
    //     $rows = DB::SELECT(DB::raw($main_q));

    //     $groupedData = [];
    //     $arr_fee_id = [1,3,4,5];
    //     $feeTypes = DB::table('fee_types')->whereIn('id',$arr_fee_id)->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name')->get();
    //     $feeTypes = self::catagorySortByFeeType($feeTypes);

    //     // Initialize groupedData with all fee types
    //     foreach ($feeTypes as $feeType) {
    //         $fee_type = $feeType->name;
    //         if (!isset($groupedData[$fee_type])) {
    //             $groupedData[$fee_type] = [
    //                 "type" => $fee_type,
    //                 "fee" => [], // Initialize fee as an empty array
    //             ];
    //             $prevPaidByFeeType[$fee_type] = 0;
    //         }
    //     }

    //     foreach ($rows as $row) {
    //         $fee_type = $row->fee_type;

    //         $year = $row->year;

    //         $academic_year = $year . '-' . ($year + 1);
            
    //         foreach ($feeTypes as $feeType) {
    //             $fee_type = $row->fee_type ?? $feeType->name;
    //             if ($row->fee_type == $feeType->name) {
                
    //                 if (!isset($groupedData[$fee_type]["fee"][$year])) {
    //                     $overdue = 0;
    //                     if (isDate($row->end_date) && $row->end_date < date('Y-m-d')) {
    //                         $overdue = $row->amount_paid;
    //                     }
    //                     $groupedData[$fee_type]["fee"][$year] = [
    //                         "amount_paid" => 0,
    //                         "new_student_payment" => 0,
    //                         'old_student_payment' => 0,
    //                         "fee_type" => $fee_type,
    //                         "academic_year" => $academic_year,
    //                         'prev_paid' => $prevPaidByFeeType[$fee_type],
    //                         'overdue' => $overdue,
    //                         'total' => 0,
    //                     ];
    //                 }else{
    //                     if (isDate($row->end_date) && $row->end_date < date('Y-m-d')) {
    //                         $groupedData[$fee_type]['fee'][$year]['overdue'] += $row->amount_paid;
    //                     }
    //                 }

    //                 if(!isset($groupedData[$fee_type]['fee'][$year]['amt_paid'])){
    //                     $groupedData[$fee_type]['fee'][$year]['amt_paid'] = 0;
    //                 }
    //                 $groupedData[$fee_type]['fee'][$year]['amt_paid'] += $row->amount_paid;
    //                 $groupedData[$fee_type]["fee"][$year]['amount_paid'] ='$'.$groupedData[$fee_type]['fee'][$year]['amt_paid'];

    //                 if ($row->is_new == 1) {
    //                     if(!isset($groupedData[$fee_type]['fee'][$year]['new_pmt'])){
    //                         $groupedData[$fee_type]['fee'][$year]['new_pmt'] = 0;
    //                     }
    //                     $groupedData[$fee_type]["fee"][$year]['new_pmt'] += $row->amount_paid;
    //                     $groupedData[$fee_type]["fee"][$year]['new_student_payment'] ='$'. $groupedData[$fee_type]["fee"][$year]['new_pmt'];
    //                 }
    //                 $prevPaidByFeeType[$fee_type] = '$'.$groupedData[$fee_type]["fee"][$year]['amt_paid'];
    //                 $groupedData[$fee_type]["fee"][$year]['old_student_payment'] = $groupedData[$fee_type]["fee"][$year]['amt_paid'] - $groupedData[$fee_type]["fee"][$year]['new_pmt'];
    //                 $groupedData[$fee_type]["fee"][$year]['total'] = '$'.$groupedData[$fee_type]["fee"][$year]['amt_paid'];
    //             }
    //         }
    //     }

    //     // Convert the "fee" object into an array
    //     foreach ($groupedData as &$feeTypeData) {
    //         $feeTypeData["fee"] = array_values($feeTypeData["fee"]);
    //     }

    //     $title = 'Total Payment By Year';
    //     $sub_title = $start.'-'.$end;
    //     return (object)[
    //         'form' => 'total_payment',
    //         'title' => $title,
    //         'sub_title' => $sub_title,
    //         'list' => array_values($groupedData),//$rows,// $rows,//
    //         'header' => $header,
    //         'company_profile' => self::getCompanyInfo($ss)
    //     ];
    // }

    function getTotalPaymentByYear($arr, $ss)
    {
        $d = (object)$arr;
        $str_total_prev = 'Total Amount of Student Previous Payment';
        $header_list = ['Academic Year', 'New Student Payment', 'Old Student Payment', 'Amount Paid', 'Overdue' ,'Total Paid', $str_total_prev, 'Total'];
        $keys = [];
        $prevPaidByFeeType = [];
        foreach ($header_list as $hl) {
            if ($hl == $str_total_prev) {
                $hl = 'prev_paid';
                array_push($keys, $hl);
            } else array_push($keys, $hl);
        }
        $keys = $this->createKeyValue('key', self::stringToKeyCase($keys));
        $header = $this->createMulKeyValue('name', $header_list, $keys);
        $str_where = 'ifnull(v.is_paid,0) = 1';
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-d');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-d', strtotime('+1 year'));
        $end = date('Y');
        $start = date('Y', strtotime('+1 year'));
        $level_id = isset($d->level_id) ? $d->level_id : null;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;

        if ($start_date && $end_date) {
            $start = date('Y', strtotime($start_date));
            $end = date('Y', strtotime($end_date));
            $str_where .= ' AND v.pmt_date >= \'' . $start . '\' AND v.pmt_date <= \'' . $end . '\'';
        }

        if ($level_id) {
            $str_where .= ' AND e.level_id = ' . $level_id;
        }
        if ($campus_id) {
            $str_where .= ' AND e.campus_id = ' . $campus_id;
        }

        $main_q = 'SELECT DISTINCT i.end_date, e.is_new_student as is_new, SUM(i.net_amount) as amount_paid, ft.name as fee_type, YEAR(v.pmt_date) as `year` 
            FROM invoices as v 
            INNER JOIN invoice_items as i ON i.invoice_id = v.id 
            INNER JOIN fee_types as ft ON ft.id = i.fee_type_id 
            INNER JOIN enrollments as e ON e.id = v.enrollment_id 
            WHERE ' . $str_where . ' 
            GROUP BY ft.name, MONTH(v.pmt_date), YEAR(v.pmt_date), e.is_new_student, i.end_date;';
        $rows = DB::SELECT(DB::raw($main_q));

        $groupedData = [];
        $arr_fee_id = [1, 3, 4, 5];
        $feeTypes = DB::table('fee_types')->whereIn('id', $arr_fee_id)->where('subs_id', hex2bin($ss->subs_id))->selectRaw('id, name')->get();
        $feeTypes = self::catagorySortByFeeType($feeTypes);
        $aca_years = DB::table('academic_years')->where('subs_id', hex2bin($ss->subs_id))->selectRaw('id,academic_year')->orderBy('end_date')->get();

        // Initialize groupedData with all fee types
        foreach ($feeTypes as $feeType) {
            $fee_type = $feeType->name;
            if (!isset($groupedData[$fee_type])) {
                $groupedData[$fee_type] = [
                    "type" => $fee_type,
                    "fee" => [], // Initialize fee as an empty array
                ];
                foreach ($aca_years as $aca_year) {
                    
                     // Adjusting start from September (month 9)
                     $years = explode("-", $aca_year->academic_year);
                     $year = $years[0];
                    
                    $groupedData[$fee_type]['fee'][(string)$year] = [
                        "amount_paid" => '',
                        "new_student_payment" => '',
                        'old_student_payment' => '',
                        "fee_type" => $fee_type,
                        "academic_year" => $aca_year->academic_year,
                        'prev_paid' => '',
                        'overdue' => '',
                        'total_paid' => '',
                        'total' => '',
                    ];
                }
                // $prevPaidByFeeType[$fee_type] = 0;
            }
        }

        foreach ($rows as $row) {
            $fee_type = $row->fee_type;
            $year = $row->year;
            $academic_year = $year . '-' . ($year + 1);

            foreach ($feeTypes as $feeType) {
                $fee_type = $row->fee_type ?? $feeType->name;
                if ($row->fee_type == $feeType->name) {

                    if (!isset($groupedData[$fee_type]["fee"][$year])) {
                        $overdue = 0;
                        if (isDate($row->end_date) && $row->end_date < date('Y-m-d')) {
                            $overdue = $row->amount_paid;
                        }
                        $groupedData[$fee_type]["fee"][$year] = [
                            "amount_paid" => 0,
                            "new_student_payment" => 0,
                            'old_student_payment' => 0,
                            "fee_type" => $fee_type,
                            "academic_year" => $academic_year,
                            'prev_paid' => $prevPaidByFeeType[$fee_type],
                            'overdue' => $overdue,
                            'total_paid' => 0,
                            'total' => 0,
                        ];
                    } else {
                        if (isDate($row->end_date) && $row->end_date < date('Y-m-d')) {
                            $groupedData[$fee_type]['fee'][$year]['overdue'] += $row->amount_paid;
                        }else
                        $groupedData[$fee_type]['fee'][$year]['overdue'] = '0' ;
                    }

                    if (!isset($groupedData[$fee_type]['fee'][$year]['amt_paid'])) {
                        $groupedData[$fee_type]['fee'][$year]['amt_paid'] = 0;
                    }
                    $groupedData[$fee_type]['fee'][$year]['amt_paid'] += $row->amount_paid;

                    // Initialize 'new_pmt' if it doesn't exist
                    if (!isset($groupedData[$fee_type]['fee'][$year]['new_pmt'])) {
                        $groupedData[$fee_type]['fee'][$year]['new_pmt'] = 0;
                    }

                    if ($row->is_new == 1) {
                        $groupedData[$fee_type]["fee"][$year]['new_pmt'] += $row->amount_paid;
                        $groupedData[$fee_type]["fee"][$year]['new_student_payment'] = '$' . number_format(floatval($groupedData[$fee_type]["fee"][$year]['new_pmt']),2);
                    }

                    // Calculate prev_paid from the previous month's amt_paid
                    $prevYear = (int)$year - 1;
                    // If the previous month's payment exists, use it for prev_paid
                    $prevPaid = isset($groupedData[$fee_type]['fee'][(string)$prevYear]['amt_paid'])
                        ? $groupedData[$fee_type]['fee'][(string)$prevYear]['amt_paid']
                        : 0;
                    

                    $prevPaidByFeeType[$fee_type] = '$' . number_format($prevPaid, 2);
                    $groupedData[$fee_type]["fee"][$year]['prev_paid'] = $prevPaidByFeeType[$fee_type];

                    $prevPaidByFeeType[$fee_type] = '$' . number_format(floatval($groupedData[$fee_type]["fee"][$year]['amt_paid']),2);
                    $groupedData[$fee_type]["fee"][$year]['amount_paid'] = '$' . number_format(floatval($groupedData[$fee_type]['fee'][$year]['amt_paid'] - $groupedData[$fee_type]['fee'][$year]['new_pmt']),2);
                    $groupedData[$fee_type]["fee"][$year]['old_student_payment'] = '$' . number_format(floatval( $groupedData[$fee_type]["fee"][$year]['amt_paid'] - $groupedData[$fee_type]["fee"][$year]['new_pmt']),2);
                    $groupedData[$fee_type]["fee"][$year]['total_paid'] = '$' . number_format(floatval($groupedData[$fee_type]["fee"][$year]['amt_paid']),2);
                    $groupedData[$fee_type]["fee"][$year]['total'] = '$' . number_format(floatval( $groupedData[$fee_type]["fee"][$year]['amt_paid'] + $prevPaid),2);
                }
            }
        }

        // Convert the "fee" object into an array
        foreach ($groupedData as &$feeTypeData) {
            $feeTypeData["fee"] = array_values($feeTypeData["fee"]);
        }

        $title = 'Total Payment By Year';
        $sub_title = $start . '-' . $end;
        return (object)[
            'form' => 'total_payment',
            'title' => $title,
            'sub_title' => $sub_title,
            'list' => array_values($groupedData),
            'header' => $header,
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }


    static function getTotalPaymentByYearInfo($rows,$fee_type,$year,$key=null){
        $i=0;
        $c=null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->year == $year && $fee_type == $c->fee_type){
                return $c->total;
            }
            $i++;
        }while ($c);
        return 0;
    }



    function getTotalStudentPaymentHistory($arr,$ss){
        $d = (object)$arr;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $level_id = isset($d->level_id) ? $d->level_id : null;
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;

        //* Headers and keys
        $header_list = ['Student','School Fee'];
        $keys = ['name','tuition_fee'];
        $obj = self::getFeeCategory();//self::getOtherFeesList(1);
        // $obj['header_list'] = array_diff($obj['header_list'].["Tuition Fee"]);
        $obj['header_list'] = self::catagorySortByFeeType($obj['header_list'],null);
        $header_list = array_merge($header_list,$obj['header_list']);
        $index = array_search('School Fee', $header_list);

        if ($index !== false) {
            $keys[$index] = 'tuition_fee';
            $keys = array_merge($keys, $obj['key_list']);
        }
        $str_date = 'i.is_paid = 1';
        if($start_date && $end_date) {
            $str_date .= ' AND DATE(v.pmt_date) >= \''.$start_date.'\' AND DATE(v.pmt_date) <= \''.$end_date.'\'';
        }

        //**----- */
        $header_list = array_merge($header_list,['Deposit','Total']);
        $keys = array_merge($keys,['Deposit','Total']);
        $keys = $this->createKeyValue('key',self::stringToKeyCase($keys));

        $header = $this->createMulKeyValue('name',$header_list,$keys);
        $str_where = 'e.enrollment_status_id = 1';
        if($level_id) $str_where .= ' AND e.level_id = '.$level_id;
        if($campus_id) $str_where .= ' AND e.campus_id = '.$campus_id;
        // $main_q = 'SELECT DISTINCT s.name,e.level_id,s.id as student_id,(SELECT pl.name as level from program_levels as pl WHERE pl.id = e.level_id) as `level` FROM students as s INNER JOIN enrollments as e ON e.student_id = s.id INNER JOIN invoices as v ON e.id = v.enrollment_id '.$str_where;
        // $rows = DB::SELECT(DB::raw($main_q));
        $rows = DB::table('students as s')->join('enrollments as e','e.student_id','=','s.id')->join('program_levels as pl','pl.id','=','e.level_id')->selectRaw('DISTINCT s.name,pl.name as `level`,s.id as student_id,e.level_id')->whereRaw($str_where)->orderBy('pl.name','ASC')->get();
        // $getStudentID = ',(SELECT v.student_id FROM invoices as v WHERE v.id = i.invoice_id AND v.is_paid = 1 LIMIT 1) as student_id';
        $sub_q = 'SELECT SUM(i.net_amount) as total,displayMoney(SUM(i.net_amount),\'USD\') as total_currency,i.fee_type_id,v.student_id FROM invoice_items as i INNER JOIN invoices as v ON v.id = i.invoice_id WHERE '.$str_date.' GROUP BY i.fee_type_id,v.student_id;';
        $ivt_fee = DB::SELECT(DB::raw($sub_q));
        $groupedData = [];
        $fee_totals=['form'=>'total_student_payment_history'];
        foreach ($rows as $row) {
            $line_total = 0;
            $level = $row->level;

            if (!isset($groupedData[$level])) {
                $groupedData[$level] = [
                    "level" => $level,
                    "fee" => [],
                    "fee_totals" => [],
                ];
            }

            foreach ($header as $h) {
                $key = $h['key'];
                $fee_type = $h['name'];

                if ($fee_type == 'School Fee') {
                    $fee_type = $key;
                }
                if($key == 'name') continue;
                $fee_type_id = self::getFeeTypeID($fee_type);

                $items = self::getStudentPaymentHistoryInfo($ivt_fee, $row->student_id,$fee_type_id);
                $itemsWithoutSymbols = $items->total;
                $line_total += $items->total;
                $row->$key = '$'.number_format(str_replace('$','',$items->formated_total),2);
                $row->$key = $row->$key == '$0.00' ? '' : $row->$key;

                if (!isset($groupedData[$level]['sub_total'][$key])) {
                    $groupedData[$level]['sub_total'][$key] = 0;
                } 
                $row->total = $items->total;
                $groupedData[$level]['sub_total'][$key] += $items->total;
                $groupedData[$level]['fee_totals'][$key] = '$'.  number_format($groupedData[$level]['sub_total'][$key], 2);
                $groupedData[$level]['fee_totals']['total'] = number_format($items->total, 2);
            }
            
            $row->total = (int)$line_total <= 0 ? '$ -' : '$'.number_format($line_total, 2);
            $groupedData[$level]['fee'][] = $row;
        }

        // $groupedData['grand_total'] = 0;
        // foreach ($groupedData as &$levelData) {
        //     $levelData['fee_totals'] = [];
        //     foreach ($levelData['sub_total'] as $key => $subtotal) {
        //         $levelData['fee_totals'][$key] = (int)$subtotal <= 0 ? '$ -' : '$' . number_format($subtotal, 2); // Format subtotal
        //     }
        //     $levelData['fee_totals']['total'] = '$'.number_format(array_sum($levelData['sub_total']), 2); // Calculate total of all subtotals
        //     $groupedData['grand_total'] += floatval(str_replace('$', '', $levelData['fee_totals']['total'] ?? 0));;
            
        // }
        $fee_grand_totals['grand_total'] = []; // Initialize grand total array for each fee type

        foreach ($groupedData as $key => &$levelData) {
            // Skip 'grand_total' key to avoid processing it like a level
            if ($key === 'grand_total') {
                continue;
            }
            
            $levelData['fee_totals'] = []; // Initialize fee_totals for each level
        
            // Loop through the subtotals and format them
            foreach ($levelData['sub_total'] as $feeKey => $subtotal) {
                // Format subtotal and store in fee_totals
                $levelData['fee_totals'][$feeKey] = (float)$subtotal <= 0 ? '$ -' : '$' . number_format($subtotal, 2);

                // Initialize grand total for this feeKey if not already set
                if (!isset($fee_grand_totals['grand_total'][$feeKey])) {
                    $fee_grand_totals['grand_total'][$feeKey] = 0;
                }

                // Accumulate grand total for this feeKey
                $fee_grand_totals['grand_total'][$feeKey] += (float)$subtotal;
            }

            // Calculate the total for the level and format it
            $levelData['fee_totals']['total'] = '$' . number_format(array_sum($levelData['sub_total']), 2);
            // Accumulate the overall total for all fee types (across levels)
            if (!isset($fee_grand_totals['grand_total']['total'])) {
                $fee_grand_totals['grand_total']['total'] = 0;
            }
            $fee_grand_totals['grand_total']['total'] += array_sum($levelData['sub_total']);
        }

        // Format grand total values after accumulation
        foreach ($fee_grand_totals['grand_total'] as $feeKey => &$grandTotal) {
            $grandTotal = '$' . number_format($grandTotal, 2);
        }
        // return$fee_grand_totals;

        $main_group = [
            'all_fee' => array_values($groupedData),
            'fee_totals' => $fee_totals,
            'fee_grand_totals' => array_values($fee_grand_totals)
        ];

        $title = 'Total Student Payment History';
        $timestamp = strtotime($start_date);
        $startDate = date('d-M-Y', $timestamp);
        $timestamp = strtotime($end_date);
        $endDate = date('d-M-Y', $timestamp);
        $sub_title = $startDate.' To '.$endDate;
        return (object)[
            'title' => $title,
            'sub_title' => $sub_title,
            'header' => $header,
            'list' => $main_group,
            'form' => 'total_student_payment_history',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    static function getGrandTotalStudentPaymentHistory($student_id,$level_id=null,$str_date=null){
        $str_search = '1=1';
        if($level_id) $str_search = 'e.level_id = ' . $level_id;
        $row = DB::table('invoice_items as i')
            ->join('invoices as v','v.id','=','i.invoice_id')
            ->join('enrollments as e','e.id','=','v.enrollment_id')
            ->where('v.student_id',$student_id)
            ->whereRaw($str_date)
            ->whereRaw($str_search)
            ->selectRaw('displayMoney(SUM(i.net_amount),v.currency_code) as total,v.student_id')
            ->groupBy('v.student_id','v.currency_code')->first();
        if($row) return $row->total;
        return 0;
    }

    static function getStudentPaymentHistoryInfo($rows,$student_id,$fee_type_id){
        $i = 0;
        $c = null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];

            if($c->student_id == $student_id && $c->fee_type_id == $fee_type_id){
                return  (object)[
                    'total' =>$c->total,
                    'formated_total' => $c->total_currency,
                ];
            }

            $i++;
        }while($c);
        return  (object)[
            'total' =>0,
            'formated_total' =>0,
        ];
    }


    function getTotalPaymentHistoryByYear($arr,$ss){
        $d = (object)$arr;
        $header_list =['Month'];
        $key_list = ['month'];
        $obj = self::getFeeCategory();//self::getOtherFeesList(1);

        $header_list = array_merge($header_list, $obj['header_list']);
        $key_list = array_merge($key_list, $obj['key_list']);
        $campus_id = isset($d->campus_id)?$d->campus_id:null;

        $header_list = array_merge($header_list,['Total']);
        $key_list = array_merge($key_list,['Total']);
        $keys = $this->createKeyValue('key',self::stringToKeyCase($key_list));
        $header = $this->createMulKeyValue('name',$header_list,$keys);
        $main_q = 'SELECT DISTINCT YEAR(v.pmt_date) as `year`,MONTH(v.pmt_date) as `month_num` FROM invoices as v INNER JOIN receipts as r ON v.id = r.invoice_id';
        $rows = DB::select(DB::raw($main_q));
        $str_campus = $campus_id? ' WHERE  v.campus_id ='.$campus_id: '';
        $sub_q = 'SELECT i.fee_type_id,displayMoney(SUM(i.net_amount),\'USD\') as formated_total,SUM(i.net_amount) as total,YEAR(i.updated_at) as `year`,MONTH(i.updated_at) as `month` FROM invoice_items as i INNER JOIN invoices as v ON i.invoice_id = v.id  '.$str_campus.' GROUP BY i.fee_type_id,YEAR(i.updated_at), MONTH(i.updated_at)';
        $ivt_items = DB::SELECT($sub_q);

        $groupedData = [];
        $fee_totals = ['total'=>0];
        foreach($rows as $row){
            $mon = $row->month_num;
            $row->month = getMonthName($row->month_num);
            $except_keys = ['month'];
            if (!isset($groupedData[$mon])) {
                $groupedData[$mon] = [
                    "month" => $mon,
                ];
            }
            $except_fee_type = ['Tuition Fee','School Fee'];
            $total = 0;
            foreach($header as $h){
                $key = $h['key'];
                $fee_type = $h['name'];
                // if(in_array($fee_type,$except_fee_type)) $fee_type = 'tuition_fee';
                if(in_array($key, $except_keys)) continue;
                $fee_type_id = self::getFeeTypeID($fee_type);
                $item = self::getPaymentHistoryByYearInfo($ivt_items,$fee_type_id,$row->year,$row->month_num);
                $row->$key = $item->formated_total;
                $total += $item->total;

                if (!isset($groupedData[$mon]['fee_total'][self::stringToKeyCase($fee_type)])) {
                    $groupedData[$mon]['fee_total'][self::stringToKeyCase($fee_type)] = 0;
                }

                $groupedData[$mon]['fee_total'][self::stringToKeyCase($fee_type)] += round($item->total, 2);
                $feeTypeTotal = $groupedData[$mon]['fee_total'][self::stringToKeyCase($fee_type)];
                $feeTypeTotalString = $feeTypeTotal != 0?'$' . number_format($feeTypeTotal, 2):0;
                $row->total = $feeTypeTotalString;

                if(!isset($fee_totals[$key])){
                    $fee_totals[$key] = 0;
                }
                $fee_totals[$key] +=  round($item->total, 2);

            }
            $row->total_amount = "$".$total;
            $groupedData[$mon] = $row;

        }

        foreach($fee_totals as $key=>$f){
            $fee_totals[$key] = '$'. $f;
        }

        $fee_totals['form'] = 'total_payment_history_by_year';
        $fee_totals['label'] = 'Total';

        $main_group = [
            'fee' => array_values($groupedData),
            'fee_totals' =>  $fee_totals
        ];

        $title = 'Total Payment History by Year';
        $sub_title = '';
        return (object)[
            'title'=> $title,
            'sub_title'=> $sub_title,
            'header' => $header,
            'list' => $main_group,
            'form' => 'simple',
            'company_info' => self::getCompanyInfo($ss)
        ];
    }

    static function getPaymentHistoryByYearGrandTotal(){
        $q = 'SELECT displayMoney(SUM(i.net_amount),\'USD\') as grand_total FROM invoice_items as i GROUP BY YEAR(i.updated_at),MONTH(i.updated_at)';
        return DB::selectOne($q);
    }


    static function getPaymentHistoryByYearInfo($rows,$fee_type_id,$year,$month){
        $i = 0;
        $c = null;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->fee_type_id == $fee_type_id && $c->year == $year && $c->month == $month){
                return (object)[
                    'total' => $c->total,
                    'formated_total' => $c->formated_total
                ];
            }
            $i++;
        }while ($c);
        return (object)[
            'total' => 0,
            'formated_total' => 0
        ];
    }

    function LeaveStudents($arr,$ss){
        $d = (object)$arr;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-t');
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $leave_type_id = isset($d->leave_type_id)?$d->leave_type_id:2;
        $leave_type = '2';
        if($leave_type_id){
            $leave_type = 'l.leave_type_id = '.$leave_type_id;
        }
        $instance_inv = new Invoice();
        $header_first_row = ['Student Name','Student ID','Sex','Class','Time','Starting Date','Date','Period','Discount','Last Payment','Dropout','Last Date of Comming to School','Remaining Days','Tel','Reason for Drop'];
        $header_second_row = ['Payment','From','End Date','Amount','Date'];

        $replacements = [
            'Last Date of Comming to School' => 'last_seen_date',
        ];

        $keys_first_row = [];
        $campuses = [];
        foreach ($header_first_row as $h) {
            if (array_key_exists($h, $replacements)) {
                if (is_array($replacements[$h])) {
                    $replacement = array_shift($replacements[$h]);
                    array_push($keys_first_row, $replacement);
                } else {
                    array_push($keys_first_row, $replacements[$h]);
                }
            } else {
                array_push($keys_first_row, $h);
            }
        }


        $keys_first_row = self::createKeyValue('key',self::stringToKeyCase($keys_first_row));
        $first_row = self::createMulKeyValue('name',$header_first_row,$keys_first_row);

        $keys_second_row = self::createKeyValue('key',self::stringToKeyCase($header_second_row));
        $second_row = self::createMulKeyValue('name',$header_second_row,$keys_second_row);
        $header =[
            'first_row' => $first_row,
            'second_row' => $second_row
        ];

        $str_date = ' AND DATE(l.leave_date) BETWEEN \''.$start_date.'\' AND \''.$end_date.'\'';
        $str_campus = $campus_id>0 ? 'e.campus_id = '.$campus_id : '1=1';

        $getLastAttScanned = ',(SELECT sa.session_date FROM student_attendances as sa WHERE sa.student_id = s.id ORDER BY DATE(sa.session_date) DESC LIMIT 1) as last_seen_date';
        
        $selectCols = 'l.leave_remarks as reason_for_drop,formatDate(l.leave_date) as leave_date,formatDate(l.return_date) as return_date,s.phone_number as tel,formatDate(s.admission_date) as starting_date,s.name as student_name,s.code as student_id,s.sex,l.leave_term_id,s.id as student_pk_id'.$getLastAttScanned;
        $main_q = 'SELECT '.$selectCols.' FROM leaves as l INNER JOIN students as s on s.id = l.student_id WHERE l.has_returned = 0 AND '.$leave_type.$str_date.' ORDER BY l.id DESC';
        $rows = DB::SELECT(DB::raw($main_q));
        // $getDiscount = ',(SELECT DISTINCT SUM(ifnull(p.policy_discount,0) + ifnull(p.special_discount,0) + ifnull(p.second_child_discount,0)) FROM payments as p WHERE p.enrollment_id = e.id GROUP BY p.id,p.policy_discount,p.second_child_discount,p.special_discount ORDER BY p.id DESC LIMIT 1) as discount';
        // $enrollments = DB::table('enrollments as e')->selectRaw('e.id as enrollment_id,e.level_id,e.term_id,e.student_id,e.session_id,e.start_date,e.tuition_end_date as end_date,formatDate(e.start_date) as f_start_date,formatDate(e.tuition_end_date) as f_end_date'.$getDiscount.',(SELECT p.pmt_option_id FROM payments as p WHERE p.enrollment_id = e.id ORDER BY p.id DESC LIMIT 1) as pmt_id')->get();
        $getDiscount = ', (
            SELECT SUM(IFNULL(p.policy_discount, 0) + IFNULL(p.special_discount, 0) + IFNULL(p.second_child_discount, 0))
            FROM payments AS p
            WHERE p.enrollment_id = e.id
            GROUP BY p.enrollment_id
        ) AS discount';
        
        $enrollments = DB::table('enrollments as e')->whereRaw($str_campus)
            ->selectRaw( 'e.id AS enrollment_id, e.level_id, e.term_id, e.student_id, e.session_id, e.start_date, e.tuition_end_date AS end_date, formatDate(e.start_date) AS f_start_date, formatDate(e.tuition_end_date) AS f_end_date' . $getDiscount . ',
                ( SELECT p.pmt_option_id FROM payments AS p WHERE p.enrollment_id = e.id ORDER BY p.id DESC LIMIT 1) AS pmt_id')->get();


        $invoices = DB::table('invoices as v')->where('v.invoice_type','tuition_fee')->selectRaw('v.student_id,v.id,v.paid_amount,v.enrollment_id,v.pmt_date')->get();
        // return $rows;
        // $test = [];
        foreach ($rows as &$row){
            $enroll = self::getStudentEnrollment($enrollments,$row->student_pk_id,$row->leave_term_id);
            $lastPayment = self::getLeaveLastPayment($invoices,$enroll->enrollment_id,$row->student_pk_id);
            $row->period = $instance_inv->getPaymentDuration($enroll->start_date, $enroll->end_date,1);
            $row->class = $enroll->level;
            $row->time = $enroll->session;
            $row->discount = $enroll->discount;
            // $row->payment = $enroll->pmt_option;
            $row->from = $enroll->f_start_date;
            $row->end_date = $enroll->f_end_date;
            $row->amount = '$'.number_format($lastPayment->paid_amount,2);
            $row->payment = date('d M Y', strtotime($lastPayment->pmt_date));
            // $row->period = Invoice::getPaymentDuration($row->start_date, $row->tuition_end_date,1);
            $remaining_day = dateDiff_days($enroll->start_date, $enroll->end_date);
            $row->remaining_days = $remaining_day . 'day(s)';
            $row->date = $leave_type_id == 3 ? (($row->leave_date??'- - -') .' to ' .($row->return_date??'- - -')) : $row->leave_date;
            unset($row->leave_date,$row->return_date);
            // return$row;
        }
        $leave_type = DB::table('leave_types')->where('id',$leave_type_id)->take(1)->value('name');
        if($leave_type == 'dropout') $leave_type = 'Dropout';
        $campus = DB::table(DBX::$branch_table)->where('id',$campus_id)->value('name');
        $title = $leave_type.' School Fee Report For '.$campus;
        $timestamp = strtotime($start_date);
        $startDate = date('d-M-Y', $timestamp);
        $timestamp = strtotime($end_date);
        $endDate = date('d-M-Y', $timestamp);
        $sub_title = $startDate.' To '.$endDate;
        return (object)[
            'header' => $header,
            'list' => $rows,
            'title' => $title,
            'leave_type' => $leave_type ?? 'Droput',
            'sub_title' => $sub_title,
            'form' => 'leave_student',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    function ComeBackStudents($arr,$ss){
        $d = (object)$arr;
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) :date('Y-m-t');
        $campus_id = isset($d->campus_id) ? $d->campus_id : null;
        $leave_type_id = isset($d->leave_type_id)?$d->leave_type_id:2;
        $leave_type = '2';
        if($leave_type_id){
            $leave_type = 'l.leave_type_id = '.$leave_type_id;
        }
        $instance_inv = new Invoice();
        $header_first_row = ['Student Name','Student ID','Sex','Class','Time','Starting Date','Date','Period','Discount','Last Payment','Dropout','Last Date of Comming to School','Approved By','Approved Date','a Time','Return Date'];
        if($leave_type_id != '2')
            $header_second_row = ['Payment','From','End Date','Amount','s From','s End Date'];
        else
            $header_second_row = ['Payment','From','End Date','Amount','Date'];

        $replacements = [
            'Last Date of Comming to School' => 'last_seen_date',

        ];

        $keys_first_row = [];
        $campuses = [];
        foreach ($header_first_row as $h) {
            if (array_key_exists($h, $replacements)) {
                if (is_array($replacements[$h])) {
                    $replacement = array_shift($replacements[$h]);
                    array_push($keys_first_row, $replacement);
                } else {
                    array_push($keys_first_row, $replacements[$h]);
                }
            } else {
                array_push($keys_first_row, $h);
            }
        }


        $keys_first_row = self::createKeyValue('key',self::stringToKeyCase($keys_first_row));
        $first_row = self::createMulKeyValue('name',$header_first_row,$keys_first_row);

        $keys_second_row = self::createKeyValue('key',self::stringToKeyCase($header_second_row));
        $second_row = self::createMulKeyValue('name',$header_second_row,$keys_second_row);
        $header =[
            'first_row' => $first_row,
            'second_row' => $second_row
        ];
 
        $str_date = ' AND DATE(l.leave_date) BETWEEN \''.$start_date.'\' AND \''.$end_date.'\'';
        $str_campus = $campus_id>0 ? 'e.campus_id = '.$campus_id : '1=1';

        $getLastAttScanned = ',(SELECT sa.session_date FROM student_attendances as sa WHERE sa.student_id = s.id ORDER BY DATE(sa.session_date) DESC LIMIT 1) as last_seen_date';
        
        $selectCols = 'l.leave_remarks as reason_for_drop,formatDate(l.leave_date) as leave_date,l.updated_at,l.update_user,formatDate(l.return_date) as return_date,s.phone_number as tel,formatDate(s.admission_date) as starting_date,s.name as student_name,s.code as student_id,s.sex,l.leave_term_id,s.id as student_pk_id'.$getLastAttScanned;
        $main_q = 'SELECT '.$selectCols.' FROM leaves as l INNER JOIN students as s on s.id = l.student_id WHERE l.has_returned = 1 AND '.$leave_type.$str_date.' ORDER BY l.id DESC';
        $rows = DB::SELECT(DB::raw($main_q));
        // $getDiscount = ',(SELECT DISTINCT S  UM(ifnull(p.policy_discount,0) + ifnull(p.special_discount,0) + ifnull(p.second_child_discount,0)) FROM payments as p WHERE p.enrollment_id = e.id GROUP BY p.id,p.policy_discount,p.second_child_discount,p.special_discount ORDER BY p.id DESC LIMIT 1) as discount';
        // $enrollments = DB::table('enrollments as e')->selectRaw('e.id as enrollment_id,e.level_id,e.term_id,e.student_id,e.session_id,e.start_date,e.tuition_end_date as end_date,formatDate(e.start_date) as f_start_date,formatDate(e.tuition_end_date) as f_end_date'.$getDiscount.',(SELECT p.pmt_option_id FROM payments as p WHERE p.enrollment_id = e.id ORDER BY p.id DESC LIMIT 1) as pmt_id')->get();
        $getDiscount = ', (
            SELECT SUM(IFNULL(p.policy_discount, 0) + IFNULL(p.special_discount, 0) + IFNULL(p.second_child_discount, 0))
            FROM payments AS p
            WHERE p.enrollment_id = e.id
            GROUP BY p.enrollment_id
        ) AS discount';
        
        $enrollments = DB::table('enrollments as e')->whereRaw($str_campus)
            ->selectRaw( 'e.id AS enrollment_id, e.level_id, e.term_id, e.student_id, e.session_id, e.start_date, e.tuition_end_date AS end_date, formatDate(e.start_date) AS f_start_date, formatDate(e.tuition_end_date) AS f_end_date' . $getDiscount . ',
                ( SELECT p.pmt_option_id FROM payments AS p WHERE p.enrollment_id = e.id ORDER BY p.id DESC LIMIT 1) AS pmt_id')->get();


        $invoices = DB::table('invoices as v')->where('v.invoice_type','tuition_fee')->selectRaw('v.student_id,v.id,v.paid_amount,v.enrollment_id,v.pmt_date')->get();
        // return $rows;
        // $test = [];
        foreach ($rows as &$row){
            $enroll = self::getStudentEnrollment($enrollments,$row->student_pk_id,$row->leave_term_id);
            $lastPayment = self::getLeaveLastPayment($invoices,$enroll->enrollment_id,$row->student_pk_id);
            $row->period = $instance_inv->getPaymentDuration($enroll->start_date, $enroll->end_date,1);
            $row->class = $enroll->level;
            $row->time = $enroll->session;
            $row->discount = $enroll->discount;
            // $row->payment = $enroll->pmt_option;
            $row->from = $enroll->f_start_date;
            $row->end_date = $enroll->f_end_date;
            $row->amount = '$'.number_format($lastPayment->paid_amount,2);
            $row->payment = date('d M Y', strtotime($lastPayment->pmt_date));
            // $row->period = Invoice::getPaymentDuration($row->start_date, $row->tuition_end_date,1);
            $remaining_day = dateDiff_days($enroll->start_date, $enroll->end_date);
            $row->remaining_days = $remaining_day . 'day(s)';
            if($leave_type_id != '2'){
                $row->s_from =  $row->leave_date??'- - -' ;
                $row->s_end_date = $row->return_date??'- - -' ;
            }
            else{
                $row->date = $row->leave_date;
            }
            $row->approved_date = date('d M Y', strtotime($row->updated_at));
            $a_time = new \DateTime($row->updated_at);
            $row->a_time = $a_time->format('h : i a');
            $row->approved_by = $row->update_user;
            
            unset($row->leave_date);
            // return$row;
        }
        $leave_type = DB::table('leave_types')->where('id',$leave_type_id)->take(1)->value('name');
        if($leave_type == 'dropout') $leave_type = 'Dropout';
        $campus = DB::table(DBX::$branch_table)->where('id',$campus_id)->value('name');
        $title = 'Comeback Student From '.$leave_type.' Campus: '.$campus;
        $timestamp = strtotime($start_date);
        $startDate = date('d-M-Y', $timestamp);
        $timestamp = strtotime($end_date);
        $endDate = date('d-M-Y', $timestamp);
        $sub_title = $startDate.' To '.$endDate;
        return (object)[
            'header' => $header,
            'list' => $rows,
            'title' => $title,
            'leave_type' => $leave_type??'Dropout',
            'sub_title' => $sub_title,
            'form' => 'comeback_student',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    static function getLeaveLastPayment($rows,$enrollment_id,$student_id){
        $c=null;
        $i=0;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->enrollment_id == $enrollment_id){
                // $invoice_items = DB::table('invoice_items as i')->selectRaw('SUM(i.net_amount) as total')->where('i.invoice_id',$c->id)->groupBy('i.invoice_id');
                // return '$'.number_format($c->paid_amount,2);
                return $c;
            }
            $i++;
        }while($c);
        return 0;
    }


    static function getStudentEnrollment($rows,$student_id,$term_id){
        $c=null;
        $i=0;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($student_id == $c->student_id){
                $paid_amount = DB::table('invoices as v')->where('v.enrollment_id',$c->enrollment_id)->take(1)->value('paid_amount');
                return (object)[
                    'enrollment_id' => $c->enrollment_id,
                    'paid_amount' => $paid_amount,
                    'start_date' => $c->start_date,
                    'end_date' => $c->end_date,
                    'level' => GeneralSettings::getLevel($c->level_id)->name,
                    'session' => GeneralSettings::getSession($c->session_id)->name,
                    'f_start_date' => $c->f_start_date,
                    'f_end_date' => $c->f_end_date,
                    'discount' => $c->discount.'%',
                    'pmt_option' => GeneralSettings::getPmtOptions($c->pmt_id)
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'enrollment_id' => null,
            'paid_amount' => 0,
            'start_date' => null,
            'end_date' => null,
            'level' => null,
            'session' => null,
            'f_start_date' => null,
            'f_end_date' => null,
            'discount' => '0%',
            'pmt_option' => null
        ];
    }
    function getReceivers(){
        return GeneralSettings::getReceivers();
    }

    function getDepositFee($student_id,$invoice_id){
       return DB::table('deposits')->where('student_id',$student_id)->where('invoice_id',$invoice_id)->take(1)->value('deposit_amount');
    }
              


    static function getOtherFeesList($exceptTuition=0) {
        $header_list = [];
        $key_list = [];
        $str_except ='1=1';
        if($exceptTuition){
            $str_except = 'id <> 100';
        }

        $other_fees = DB::table('other_fees')
            ->whereRaw($str_except)
            ->select('name','id')
            ->get();

        foreach ($other_fees as $type) {
            $header_list[] = $type->name;
            $key_list[] = $type->name;
        }

        return ['header_list' => $header_list, 'key_list' => $key_list];
    }

    function getStudentPaymentHistory($arr,$ss){
        $d = (object)$arr;
        $student_id =isset($d->student_id)?$d->student_id:null;
        if(!$student_id) return DV::error('Student must be selected');

        //*
            $header_list = ['Receipt No.','Payment Date','Class','Time'];
            $tuition_header = ['Period','Duration','Version','Fee/Month','Full Amount','School','Child Policy','Referal Fee','Special Discount','Penalty','Net Payment']; // - 'Deposit',
            $tuition_header = array_merge($header_list,$tuition_header);
            $replacements = [
                'Time' => 'session',
                'Fee/Month' => 'monthly_fee',
                'School' => 'policy_discount',
                'Child Policy' => 'sibling_discount'
            ];
            $tuition_keys = self::keyReplacement($tuition_header,$replacements);
            $tuition_keys = $this->createKeyValue('key',self::stringToKeyCase($tuition_keys));
            // $tuition_keys = $this->createKeyValue('key',self::stringToKeyCase($tuition_header));
            $tuition_header = $this->createMulKeyValue('name',$tuition_header,$tuition_keys);

            $non_tuition_header = $header_list;
            $non_tuition_header = array_merge($header_list,['Full Amount','Discount','Net Payment']);
            $non_tuition_keys = $this->createKeyValue('key',self::stringToKeyCase($non_tuition_header));
            $non_tuition_header = $this->createMulKeyValue('name',$non_tuition_header,$non_tuition_keys);

            $return_fee_header = ['Receipt No.','Return Date','Class','Time','Description','Return Amount'];
            $return_fee_keys = $this->createKeyValue('key',self::stringToKeyCase($return_fee_header));
            $return_fee_header = $this->createMulKeyValue('name',$return_fee_header,$return_fee_keys);
        //*---
        $student = DB::table('students')->where('id',$student_id)->selectRaw('code as student_id,CONCAT(name, " (", name_kh, ")") as student_name,name,sex,formatDate(admission_date) as starting_date,date_of_birth as dob,phone_number')->get()->first();

        $getLevel = ',(SELECT pl.name FROM program_levels as pl WHERE pl.id = e.level_id) as level';
        // $getReferal = ',(SELECT rf.commission FROM referals as rf WHERE rf.student_id = v.student_id AND ifnull(rf.is_paid,0)=1) as referal';
        $getSpecialDis = ',(SELECT p.special_discount FROM payments as p WHERE e.id = p.enrollment_id) as p_special_discount';
        $getDeposit = ',(SELECT d.deposit_amount FROM deposits as d WHERE d.invoice_id = v.id) as deposit_amount';
        // $getPrepayment = ',(SELECT d.balance FROM prepaid_tuition as pt WHERE pt.student_id = v.id) as deposit_amount';
        // $main_q = 'SELECT '.$getLevel.$getReferal.$getSpecialDis.$getDeposit.',ifnull(i.policy_discount,0) as policy_discount,e.level_id,formatDate(v.pmt_date) as payment_date,i.fee_type,r.receipt_number as receipt_no,v.id as invoice_id FROM invoices as v INNER JOIN invoice_items as i ON v.id = i.invoice_id INNER JOIN receipts as r ON r.invoice_id = v.id INNER JOIN enrollments as e ON e.id = v.enrollment_id WHERE v.student_id = \''.$student_id.'\' GROUP BY i.fee_type,r.receipt_number,v.id,v.pmt_date,e.level_id,v.student_id,e.id,r.id';
        $getReferal = ',(SELECT rf.commission FROM referals as rf WHERE rf.use_invoice_id = v.id) as referal';
        $rows = DB::table('invoices as v')->where('v.student_id',$student_id)->join('receipts as r','r.invoice_id','=','v.id')->join('enrollments as e','v.enrollment_id','=','e.id')->join('sessions as ss','ss.id','=','e.session_id')->selectRaw('ss.id as session_id,r.id as receipt_id,e.program_id,ss.name as session,e.level_id,formatDate(v.pmt_date) as payment_date,i.fee_type,i.item_id,r.receipt_number as receipt_no,v.id as invoice_id'.$getReferal.$getLevel.$getDeposit)->join('invoice_items as i','i.invoice_id','=','v.id')->get();
        $inv_items = DB::select('SELECT i.special_discount_type,ifnull(i.special_discount,0) as special_discount,ifnull(i.policy_discount,0) as policy_discount,i.discount,i.date_range,displayMoney(SUM(i.net_amount),\'USD\') as formatted_total,SUM(i.net_amount) as total,i.invoice_id,i.fee_type,i.price,i.discount,formatDate(i.start_date) as `start_date`,formatDate(i.end_date) as `end_date` FROM invoice_items as i GROUP BY i.special_discount_type,i.special_discount,i.discount,i.policy_discount,i.fee_type,i.invoice_id,i.price,i.discount,i.start_date,i.end_date,i.date_range');
        $groupedData = [];
        $grand_total = 0;
        $sub_grand_total = 0;

        $studentPriceList = DB::table('student_pricelist as sl')->where('sl.student_id',$student_id)->whereRaw('ifnull(sl.inactive,0) = 0')->join('price_list as pl','pl.id','=','sl.price_list_id')->selectRaw('pl.name,pl.id')->first();
        $arr_fee_id = [1, 2, 3, 4, 5, 6, 9, 10];
        $feeTypes = DB::table('fee_types')
            ->whereIn('id', $arr_fee_id)
            ->where('subs_id', hex2bin($ss->subs_id))
            ->selectRaw('id, name')
            ->get();
        $feeTypes = self::catagorySortByFeeType($feeTypes);
        $feeTypes = array_merge($feeTypes, [
            (object)[
                "id" => null,
                "name" => 'Return Test Fee'
            ],
            (object)[
                "id" => null,
                "name" => 'Return Deposit' 
            ],
            (object)[
                "id" => null,
                "name" => 'Return Prepayment'
            ]
        ]);
        foreach ($feeTypes as $feeType) {
            $fee_type = $feeType->name; 
            $fee_type = strtolower(str_replace(' ', '_', $fee_type));
            $willExpire = self::isWillExpireFeeType($fee_type);

            if($fee_type == 'tuition_fee' || $fee_type == 'Tuition Fee') $fee_type = 'School Fee';

            if(!isset($groupedData[$fee_type])){
                $groupedData[$fee_type] = [
                    'fee_type' => $fee_type,
                    'fee' => [],
                    'header' => ($fee_type == 'School Fee') ? $tuition_header : (($fee_type === 'return_test_fee' || $fee_type === 'return_deposit' || $fee_type === 'return_prepayment') ? $return_fee_header : $non_tuition_header),
                    'fee_totals' => [
                        'total' => 0,
                        'label' => 'Total',
                        'sub_total' => 0,
                    ]
                ];
            }
        }
        $total_return = 0;
        foreach ($rows as $row) {
            foreach ($feeTypes as $ft) {
                $fee_type = $row->fee_type;
                $ft->name = strtolower(str_replace(' ', '_', $ft->name));

                
                $willExpire = self::isWillExpireFeeType($fee_type);
                if($fee_type == 'tuition_fee') $fee_type = 'School Fee';
                if($ft->name == 'tuition_fee') $ft->name = 'School Fee';
                if ($fee_type == $ft->name) {
                    $item = self::getStudentPaymentHistoryDetails($inv_items,$row->fee_type,$row->invoice_id);
                    $total = $item->total;

                    //|| $fee_type === "Penalty"
                    if($studentPriceList){
                        $row->monthly_fee = '$'.DB::table('price_list_items')->where('list_id',$studentPriceList->id)->where('session_id',$row->session_id)->where('program_id',$row->program_id)->take(1)->value('price');
                        $row->version = $studentPriceList->name;
                    }
                    $row->class = $row->level;
                    if($fee_type === "School Fee"){
                        $row->referal_fee = floatNumber($row->referal).'%';
                        $row->special_discount = $item->discount_info->special_discount;
                        $row->policy_discount = $item->discount_info->policy_discount;
                        $row->sibling_discount = $item->discount_info->sibling_discount;
                        $row->penalty =  '';
                        $row->class = $row->level;
                        $row->duration = $item->duration;
                        $row->period = $item->period;
                        // $row->deposit = ($row->deposit_amount ? number_format(str_replace('$','',$row->deposit_amount),2) : '0.00') . '%';
                    }
                    if ($willExpire>0 && $fee_type != "School Fee") {
                        $newItem = [
                            [
                                "name" => "Period",
                                "key" => "period"
                            ],
                            [
                                "name" => "Duration",
                                'key' => 'duration'
                            ]
                        ];
                        self::insertItemsAtIndex($groupedData[$fee_type]['header'], $newItem, [4, 5]);

                        $row->period = $item->period;
                    }

                    if($row->item_id == 98){
                        $newItem = [
                            [
                                "name" => "New Amount",
                                "key" => "new_amount"
                            ],
                            [
                                "name" => "Remaining Amount",
                                "key" => "remaining_amount"
                            ]
                        ];
                        self::insertItemsAtIndex($groupedData[$fee_type]['header'], $newItem, [6,7]);
                        $log = DB::table('upgrade_fee_logs')->where('receipt_id',$row->receipt_id)->selectRaw('old_day_fee,prev_payment,next_payment')->first();
                        if($log){
                            $row->new_amount = '$'.number_format($log->next_payment,2);
                            $row->remaining_amount = '$'.number_format(abs($log->prev_payment - $log->old_day_fee),2);
                        }
                    }

                    $row->full_amount = $item->price;
                    $row->net_payment = $item->formatted_total;
                    $row->discount = $item->discount;
                    $row->time = $row->session;
                    $groupedData[$fee_type]['fee_totals']['sub_total'] += $total;
                    $groupedData[$fee_type]['fee_totals']['total'] =  '$'.number_format($groupedData[$fee_type]['fee_totals']['sub_total'],2);
                    $groupedData[$fee_type]['fee'][] = $row;
                    $sub_grand_total += $total;
                    $grand_total = '$'.number_format($sub_grand_total,2);
                    unset($row->fee_type_id,$row->referal,$row->p_special_discount,$row->deposit_amount);
                }
                    
            }
        }

        $return ='';
        foreach ($feeTypes as $ft) {
            // $fee_type = $row->fee_type;
            $ft->name = strtolower(str_replace(' ', '_', $ft->name));
            // return$student;
            if($ft->id == null && $student){

                $prepayment = $test_fee = null;
                $return_fee = 0;
                $row_test_fee = $row_deposit = $row_prepaid = (object)[];
                if($ft->name == 'return_test_fee'){
                    $test_fee = TestFee::getTestFeeAmount($student->name,$student->sex,$student->dob,$student->phone_number);
                    if($test_fee){
                        $inv = DB::table('invoices')->where('id',$test_fee->invoice_id)->where('is_paid',1)->selectRaw('invoice_date,invoice_number,note as description')->first();
                        $test_fee = $test_fee?floatNumber($test_fee->amount):0;
                        $return_fee = $test_fee;
                        $row_test_fee->return_amount = $test_fee;
                        $row_test_fee->description = isset($prepayment->description) ? $prepayment->decription : "";                                                                                                       
                        $row_test_fee->class = isset($rows[0]->class) ? $rows[0]->class : $rows[0]->level ?? '';
                        $row_test_fee->time = isset($rows[0]->time) ? $rows[0]->time : $rows[0]->session ??'';
                        $row_test_fee->receipt_no = isset($inv->invoice_number) ? $inv->invoice_number : $inv->receipt_no;
                        $row_test_fee->return_date = isset($inv->invoice_date) ? date('d M Y',strtotime($inv->invoice_date)) : '';
                        $groupedData['return_test_fee']['fee_totals']['sub_total'] = $return_fee;
                        $groupedData['return_test_fee']['fee_totals']['total'] = '$'.number_format($groupedData['return_test_fee']['fee_totals']['sub_total'],2);
                        $groupedData['return_test_fee']['fee'][0] = $row_test_fee;
                    }
                }
                elseif($ft->name == 'return_deposit'){

                    // $return_fee = isset($row->deposit_amount) ? $row->deposit_amount : 0;
                    $get_type = 'obj';
                    $deposit = Invoice::studentDeposit($student->name,$student->sex,$student->dob,$student_id,$get_type);
                    if($deposit){
                        $inv = DB::table('invoices')->where('id',$deposit->invoice_id)->where('is_paid',1)->selectRaw('invoice_date,invoice_number,note as description')->first();
                        $return_fee = $deposit->deposit_amount;
                        $row_deposit->return_amount = $deposit->deposit_amount;
                        $row_deposit->description = isset($prepayment->description) ? $prepayment->decription : "";                                                                                                       
                        $row_deposit->class = isset($rows[0]->class) ? $rows[0]->class : $rows[0]->level ?? '';
                        $row_deposit->time = isset($rows[0]->time) ? $rows[0]->time : $rows[0]->session ??'';
                        $row_deposit->receipt_no = isset($inv->invoice_number) ? $inv->invoice_number : $inv->receipt_no;
                        $row_deposit->return_date = isset($inv->invoice_date) ? date('d M Y',strtotime($inv->invoice_date)) : '';
                        $groupedData['return_deposit']['fee_totals']['sub_total'] = $return_fee;
                        $groupedData['return_deposit']['fee_totals']['total'] = '$'.number_format($groupedData['return_deposit']['fee_totals']['sub_total'],2);
                        $groupedData['return_deposit']['fee'][0] = $row_deposit;
                    }
                }
                elseif($ft->name == 'return_prepayment'){
                    // $prepayment = DB::table('prepaid_tuition')->where('student_id',$student_id)->selectRaw('balance,updated_at as return_date,remarks as description')->get();
                    $prepaid =  CashAccount::getCashAccountInfo($student_id);
                    if($prepaid){
                        $inv = DB::table('invoices as i')->join('account_trans as at','at.invoice_id','=','i.id')->where('at.id',$prepaid->last_trx_id)->where('i.is_paid',1)->selectRaw('i.invoice_date,i.invoice_number,i.note as description')->first();
                        $prepaid_amount = floatNumber($prepaid->balance);
                        // foreach($prepayment as $pre){
                        $return_fee = $prepaid_amount;
                        $row_prepaid->return_amount = $prepaid_amount;
                        $row_prepaid->description = isset($prepayment->description) ? $prepayment->decription : "";                                                                                                       
                        $row_prepaid->class = isset($rows[0]->class) ? $rows[0]->class : $rows[0]->level ?? '';
                        $row_prepaid->time = isset($rows[0]->time) ? $rows[0]->time : $rows[0]->session ??'';
                        $row_prepaid->receipt_no = isset($inv->invoice_number) ? $inv->invoice_number : $inv->receipt_no??'';
                        $row_prepaid->return_date = isset($inv->invoice_date) ? date('d M Y',strtotime($inv->invoice_date)) : '';

                        // }
                        $groupedData['return_prepayment']['fee_totals']['sub_total'] = $return_fee;
                        $groupedData['return_prepayment']['fee_totals']['total'] =  '$'.number_format($groupedData['return_prepayment']['fee_totals']['sub_total'],2);
                        $groupedData['return_prepayment']['fee'][0] = $row_prepaid;
                    }
                }
                
                $total_return += $return_fee;
                // unset($row->fee_type_id,$row->referal,$row->p_special_discount,$row->deposit_amount,$row->return_amount);

            }
        }
        // $fee_totals = (object)[
        //     'label' => 'Grand Total',
        //     'total' => $grand_total
        // ];
        // $total_return = 0;
        $fee_total_key = ['total_payment','total_return','grand_total'];
        $fee_total_lable = ['Total Payment','Total Return','Grand Total'];
        $fee_totals = [
            'label' => [],
            'total' => [],
        ];
        foreach($fee_total_key as $i=>$kay){
            $fee_totals['label'][$kay] = $fee_total_lable[$i];
        }
        $fee_totals['total']['total_payment'] = $grand_total;
        $fee_totals['total']['grand_total'] = '$'.number_format((float)($sub_grand_total - $total_return));
        $fee_totals['total']['total_return'] = '$'.number_format($total_return,2);
        // return$fee_totals;

        $res = (object)[
            'form' => 'student_payment_history',
            'student_info' => $student,
            'title' => 'Student Payment History',
            'sub_title' => '',
            'list' => (object)[
                'all_fee' => array_values($groupedData),
                'fee_total' => $fee_totals,
                'fee_total_key' => $fee_total_key
            ],
            'company_profile' => self::getCompanyInfo($ss)
        ];
        return DV::success(['data'=>$res]);
    }

    static function getStudentPaymentHistoryDetails($rows,$fee_type,$invoice_id){
        $c=null;
        $i=0;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->fee_type == $fee_type && $c->invoice_id == $invoice_id){
                $special_discount = floatNumber($c->special_discount);
                $sibling_discount = $c->discount > 0 ? abs($c->discount - $c->policy_discount) : 0;
                $special_discount = $c->special_discount_type == 'percentage' ?$special_discount.'%':'$'.$special_discount;
                return (object)[
                    'price' => floatNumber($c->price),
                    'total' => floatNumber($c->total),
                    'discount' => floatNumber($sibling_discount + $c->policy_discount).'%',
                    'formatted_total' => $c->formatted_total,
                    'period' => $c->start_date .' To '.$c->end_date,
                    'discount_info' => (object)[
                        'special_discount' => $special_discount,
                        'special_discount_type' => $c->special_discount_type,
                        'policy_discount' => floatNumber($c->policy_discount).'%',
                        'sibling_discount' => floatNumber($sibling_discount).'%'
                    ],
                    'duration' => Invoice::getPaymentDuration($c->start_date,$c->end_date,1)
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'price' => 0,
            'total' => 0,
            'discount' => 0,
            'period' => 0,
            'duration' => 'N/A',
            'discount_info' => (object)[
                'special_discount' => 0,
                'special_discount_type' => '',
                'policy_discount' => '',
                'sibling_discount' => ''
            ],
            'formatted_total' => '$0'
        ];
    }

    function crossYearReceipt($filter,$ss){
        $receipt_number = ',(SELECT r.receipt_number FROM receipts as r INNER JOIN invoices as i ON r.invoice_id = i.id WHERE i.id = act.invoice_id) as receipt_number';
        $rows = DB::select('SELECT st.name as student_name,st.sex,st.code as student_id,ca.id as account_id FROM cash_accounts as ca INNER JOIN students as st ON st.id = ca.holder_id');
        $student_header = ['Class','Student ID','Student Name'];
        $student_head_key = self::createKeyValue('key',self::stringToKeyCase($student_header));
        $student_header = self::createMulKeyValue('name',$student_header,$student_head_key);
        $table_header = ['Date','Receipt No','Remark','Amount'];
        $table_key = self::createKeyValue('key',self::stringToKeyCase($table_header));
        $table_header = self::createMulKeyValue('name',$table_header,$table_key);
        $transactions = DB::select('SELECT cad.policy_discount,cad.policy_discount_type,cad.sibling_discount,cad.sibling_discount_type,cad.special_discount,cad.special_discount_type,formatDate(act.trx_date) as trx_date,act.source_account_id,(SELECT CASE otf.name WHEN \'tuition_fee\' THEN \'Tuition Fee\' ELSE otf.name END as `name` FROM other_fees as otf WHERE otf.id = act.fee_id) as fee_type,amount,remarks'.$receipt_number.' FROM account_trans as act INNER JOIN cash_account_discounts as cad ON cad.account_tran_id = act.id');
        foreach($rows as $row){
            $row->list = self::crossYearReceiptInfo($transactions,$row->account_id);
            unset($row->account_id);
        }
        return (object)[
            'form' => 'cross_year_payment',
            'student_info' => $rows,
            'title' => 'Cross Year',
            'student_header' => $student_header,
            'table_header' => $table_header,
            'sub_title' => '',
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    static function crossYearReceiptInfo($rows,$account_id){
        $c = null;
        $i = 0;
        $data = [];
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->source_account_id == $account_id){
                $data[] = (object)[
                    'date' => $c->trx_date,
                    'receipt_no' => $c->receipt_number,
                    'fee_type' => $c->fee_type,
                    'amount' => $c->amount,
                    'remarks' => $c->remarks
                ];
            }
            $i++;
        }while($c);
        return $data;
    }



    function studentRequestChange($arr,$ss){
        $d = (object)$arr;
        $request_type_id = isset($d->request_type_id)?$d->request_type_id:null;
        $to_campus_id = isset($d->to_campus_id)?$d->to_campus_id:null;
        $from_campus_id = isset($d->from_campus_id)?$d->from_campus_id:null;
        $str_where = ' AND 1';
        if($from_campus_id && $to_campus_id){
            $str_where = ' AND rc.to_id = '.$to_campus_id.' AND rc.from_id = '.$from_campus_id;
        }
        $from = null;
        $title = null;
        $rows = DB::select('SELECT formatDate(r.auth_date) as `date`,TIME(r.auth_date) as `time`,formatDate(r.created_at) as last_date,r.auth_user,rc.remarks,rc.from_id,rc.to_id,r.student_id,r.id,rc.enrollment_id,rc.from_id,rc.to_id,r.request_type_id FROM requests as r INNER JOIN request_changes as rc ON r.id = rc.request_id WHERE r.request_type_id = 2 '.$str_where);
        $students = DB::table('students as s')->selectRaw('s.id,s.name,s.sex,s.code,formatDate(s.admission_date) as starting_date')->get();
        $enrollments = DB::table('enrollments as e')->join('payments as p','p.enrollment_id','=','e.id')->selectRaw('p.price_list_id,p.pmt_option_id,p.tuition_paid,e.id,e.level_id,e.session_id,formatDate(e.start_date) as start_date,formatDate(e.tuition_end_date) as end_date')->get();

        foreach($rows as $row){
            $student = $students->filter(function ($s) use ($row){
                return $s->id == $row->student_id;
            })->first();
            $class = GeneralSettings::getStudentGroupInfo($row->student_id,$row->enrollment_id);
            if($class) $row->class = $class->group_name;
            if($student){
                $row->student_name = $student->name;
                $row->code = $student->code;
                $row->sex = $student->sex;
                $row->starting_date = $student->starting_date;
            }

            $from = GeneralSettings::getCampusName($row->from_id);
            $to = GeneralSettings::getCampusName($row->to_id);
            $title = 'Student Move Campus From '.$from.' to '.$to;

            $inv = new Invoice;
            $enr_info = self::getEnrollmentInfo($enrollments,$row->enrollment_id);
            $row->payment = $enr_info->payment;
            $row->from = $enr_info->start_date;
            $row->end_date = $enr_info->end_date;
            $row->last_paid = $enr_info->tuition_paid;
            $row->period = $inv->getPaymentDuration($enr_info->start_date,$enr_info->end_date);
            $row->discount = self::getStudentDiscount($row->student_id,$enr_info->pmt_option_id,$enr_info->session_id,$enr_info->price_list_id);
        }
            $header_list = ['Student ID','Student Name','Sex','Class','Time','Starting Date','Payment','From','End Date','Period','Discount %','Last Payment Amount','Last Date at '.$from,'Reason for Moving','Approved By','Date','Time'];
            $replacements = [
                'Reason for Moving' => 'remarks',
                'Discount %' => 'discount',
                'Last Payment Amount' => 'last_paid',
                'Student ID' => 'code',
                'Last Date at '.$from => 'last_date',
                'Approved By' => 'auth_user'
            ];
            $key_list = self::keyReplacement($header_list,$replacements);
            $key_list = self::stringToKeyCase($key_list);
            $headers = self::createMulKeyValue('name',$header_list,self::createKeyValue('key',$key_list));
        return (object)[
            'form' => 'student_change_campus',
            'title' => $title,
            'header' => $headers,
            'sub_title' => '',
            'list' => $rows,
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    static function getEnrollmentInfo($rows,$enrollment_id){
        $c = null;
        $i = 0;
        do{
            if(!isset($rows[$i])) break;
            $c = $rows[$i];
            if($c->id == $enrollment_id){
                return (object)[
                    'payment' => GeneralSettings::getPmtOptions($c->pmt_option_id),
                    'start_date' => $c->start_date,
                    'end_date' => $c->end_date,
                    'session_id' => $c->session_id,
                    'price_list_id' => $c->price_list_id,
                    'pmt_option_id' => $c->pmt_option_id,
                    'tuition_paid' => $c->tuition_paid
                ];
            }
            $i++;
        }while($c);
        return (object)[
            'payment' => 'N/A',
            'start_date' => 'N/A',
            'end_date' => 'N/A',
            'session_id' => null,
            'price_list_id' => null,
            'pmt_option_id' => null,
            'tuition_paid' => 0
        ];
    }

    static function isWillExpireFeeType($fee_type){
        $row = DB::table('other_fees')->where('name',$fee_type)->where('will_expire',1)->where('charge_as','<>','one_time')->take(1)->value('id');
        if($row) return $row;
        return false;
    }


    // to add flexible key and value at any index
    static function insertItemsAtIndex(&$array, $items, $indices) {
        $itemsToInsert = array_map(null, $items, $indices);
        rsort($itemsToInsert);
        foreach ($itemsToInsert as $item) {
            list($itemToInsert, $index) = $item;
            if (!in_array($itemToInsert, $array)) {
                if($index == count($array)){
                    $index ++;
                }else if ($index < count($array)){
                    $temp = $array[$index];
                    $array[$index] = $array[$index+1];
                    $array[$index+1] = $temp;
                }
                array_splice($array, $index, 0, [$itemToInsert]);
            }
        }
    }


    static function getFeeCategory($exceptTuition=0) {
        $header_list = [];
        $key_list = [];
        $str_except ='1=1';
        if($exceptTuition){
            $str_except = 'id <> 1';
        }

        $other_fees = DB::table('fee_types')
            ->whereRaw($str_except)
            ->select('name','id')
            ->get();

        foreach ($other_fees as $type) {
            $header_list[] = $type->name;
            $key_list[] = $type->name;
        }

        return ['header_list' => $header_list, 'key_list' => $key_list];
    }

    static function getFeeTypeID($typeName){
        return DB::table('fee_types')->where('name',$typeName)->take(1)->value('id');
    }
    static function getFeeTypeName($typeID){
        return DB::table('fee_types')->where('id',$typeID)->take(1)->value('name');
    }

    static function keyReplacement($header_list,$replacements=[]){
        $key_list=[];
        foreach ($header_list as $h) {
            if (array_key_exists($h, $replacements)) {
                if (is_array($replacements[$h])) {
                    $replacement = array_shift($replacements[$h]);
                    array_push($key_list, $replacement);
                } else {
                    array_push($key_list, $replacements[$h]);
                }
            } else {
                array_push($key_list, $h);
            }
        }
        return $key_list;
    }

    static function getStudentDiscount($student_id,$pmt_option_id,$session_id,$price_list_id){
        return self::getStudentPolicyDiscount($student_id,$pmt_option_id,$session_id,$price_list_id).'%';
    }

    static function getStudentPolicyDiscount($student_id,$pmt_option_id,$session_id,$price_list_id){
        $originalDis = DB::table('student_discounts')->where('student_id',$student_id)
                        ->where('pmt_option_id',$pmt_option_id)
                        ->where('price_list_id',$price_list_id)->where('session_id',$session_id)
                        ->selectRaw('SUM(sibling_discount + policy_discount) as discount')->take(1)->value('discount');
        if(!$originalDis){
            $default_discount = DB::table('student_discounts')->where('pmt_option_id',$pmt_option_id)
                            ->where('price_list_id',$price_list_id)->where('session_id',$session_id)
                            ->take(1)->value('policy_discount');
            return $default_discount;
        }
        return $originalDis;
    }

    function upgradeFee($filter,$ss){
        $d = (object)$filter;
        $request_type_id = isset($d->request_type_id)?$d->request_type_id:1;
        if(!$request_type_id) return DV::error('Request type must be provided');
        $type = null;
        $prev_req = '';
        $next_req = '';
        if($request_type_id == 1) {
            $type = 'Class';
            $prev_req = ',(SELECT pl.name FROM program_levels as pl WHERE pl.id = ug.prev_id) as prev_req_name';
            $next_req = ',(SELECT pl.name FROM program_levels as pl WHERE pl.id = ug.next_id) as next_req_name';
        }
        if($request_type_id == 3) {
            $type = 'Session';
            $prev_req = ',(SELECT ss.name FROM sessions as ss WHERE ss.id = ug.prev_id) as prev_req_name';
            $next_req = ',(SELECT ss.name FROM sessions as ss WHERE ss.id = ug.next_id) as next_req_name';
        }
        $newFee = "Fee(New $type)";
        $oldFee = "Remaining(Old $type)";
        $header_list = ['Date','Receipt No','Student Name','Sex','DOB','Starting Date',$type,'Period','Duration','Discount','Net Amount',$type,'Date','Period','Duration','Discount',$newFee,$oldFee,'Additional Payment','By','Date','Payment Date'];
        $replacements = [
            $type => ['prev_req_name','next_req_name'],
            'Period' => ['prev_period','next_period'],
            'Duration' => ['prev_duration','next_duration'],
            'Discount' => ['prev_discount','next_discount'],
            'Date' => ['date','upgrade_date','auth_date'],
            'By' => 'auth_user',
            $newFee => 'new_fee',
            $oldFee => 'old_fee',
            'Receipt No' => 'receipt_number'
        ];

        $studentCols = ',formatDate(ug.created_at) as `date`,formatDate(r.updated_at) as payment_date,r.receipt_number,s.name as student_name,s.sex,formatDate(s.date_of_birth) as dob,formatDate(s.admission_date) as starting_date'.$prev_req.$next_req;
        $selectCols = 'ug.student_id,ug.old_day_fee as old_fee,ug.prev_payment as net_amount,ug.prev_discount,ug.next_payment as new_fee,(ug.prev_payment - ug.old_day_fee) as old_fee,ug.prev_period,ug.prev_duration,ug.line_total as additional_payment,ug.next_period,ug.next_duration,ug.auth_user,formatDate(ug.auth_date) as auth_date'.$studentCols;
        $rows = DB::select("SELECT $selectCols FROM upgrade_fee_logs as ug LEFT JOIN receipts as r ON ug.receipt_id = r.id INNER JOIN students as s ON s.id = ug.student_id WHERE ug.request_type_id = $request_type_id");
        $key_list = self::keyReplacement($header_list,$replacements);
        $head_key = self::createKeyValue('key',self::stringToKeyCase($key_list));
        $header = self::createMulKeyValue('name',$header_list,$head_key);
        $additionalKeys = [
            'prev_req_name' => 'last payment',
            'prev_period' => 'last payment',
            'prev_duration' => 'last payment',
            'prev_discount' => 'last payment',
            'net_amount' => 'last payment',

            //-- upgraded
            'next_req_name' => 'upgraded',
            'upgrade_date' => 'upgraded',
            'next_period' => 'upgraded',
            'next_duration' => 'upgraded',
            'next_discount' => 'upgraded',

            //--approved
            'auth_user' => 'approved',
            'auth_date' => 'approved'
        ];
        $header = self::additionalKeys($header,$additionalKeys);
        $title = 'Upgrade Fee';
        return (object)[
            'form' => 'upgrade_fee',
            'title' => $title,
            'header' => $header,
            'sub_title' => '',
            'list' => $rows,
            'company_profile' => self::getCompanyInfo($ss)
        ];
    }

    static function additionalKeys(&$header, $keyMappings) {
        foreach ($header as &$item) {
            if (isset($keyMappings[$item["key"]])) {
                $item["merge_name"] = $keyMappings[$item["key"]];
            }
        }
        return $header;
    }
}