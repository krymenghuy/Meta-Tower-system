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
        $title = 'Tenant List ' . ($statusLabels[$status_id] ?? '(All Statuses)');
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

function getPaymentReport($arr, $ss)
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
            'form' => 'payments',
            'vendor_info' => $vendor,
            'list' => $rows,
            'title' => 'Vendor Payment',
            'sub_title' => '',
            
            'company_profile' => self::getCompanyInfo($ss)
        ];
        return DV::success(['data' => $res]);
    }
   
// function getTenantDepositList($arr, $ss) {
//     $d = (object)$arr;
//     $is_paid = isset($d->is_paid) ? (int)$d->is_paid : null;
//     $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
//     $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
//     $str_date = "DATE(d.deposit_date) >= '$start_date' AND DATE(d.deposit_date) <= '$end_date'";
//     $sub_title = 'Deposit Date From: ' . date('d-M-Y', strtotime($start_date)) . ' To ' . date('d-M-Y', strtotime($end_date));

//     $rows = DB::table('deposits as d')
//         ->join('tenants as t', 'd.tenant_id', '=', 't.id')
//         ->selectRaw('
//             t.name as tenant_name,
//             t.code as tenant_id,
//             d.deposit_date,
//             d.created_at as payment_date,
//             d.amount as deposit,
//             d.updated_at as valid_date,
//             d.remarks
//         ')
//         ->whereRaw($str_date)
//         ->get();

    

//     $campuses = empty($campuses) ? ['N/A'] : $campuses;

//     $title_status = '(All)';
//     if ($is_paid !== null) {
//         $title_status = $is_paid == 1 ? '(Paid) ' : '(Unpaid) ';
//     }

//     $title = $title_status . 'Tenant Deposit Report';

//     $startDate = date('d-M-Y', strtotime($start_date));
//     $endDate = date('d-M-Y', strtotime($end_date));
//     $campus_name = 'Ç1';
//     $sub_title = '(' . ($campus_name ?: 'All Campus') . ')';
//     $sub_title_2 = $startDate . ' To ' . $endDate;

//     $date_rank = (object)[
//         'start_date' => $startDate,
//         'end_date' => $endDate
//     ];

//     $company_profile = self::getCompanyInfo($ss);

   

//     return (object)[
//         // 'header' => $header,
//         'title' => $title,
//         'sub_title' => $sub_title,
//         'sub_title_2' => $sub_title_2,
//         'date_rank' => $date_rank,
//         'list' => $rows,
//         'form' => 'deposit_list',
//         'company_profile' => $company_profile
//     ];
// }
}
