<?php

namespace App\Models\Ypg;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\CompanyProfile;
use XPublicStorage;

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
        return $ss;
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
    function getBranchInfo($branch_id = 0,$ss)
    {
        $branch_ids = getAccessBranches($ss, $branch_id);
        $rows = DB::table('um_branches AS b')->whereIn('b.branch_id', $branch_ids)->selectRaw("b.branch_id,b.logo_file_name,b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
        foreach ($rows as $row) {
            $user_class = "general";
            $category = "image";
            $dir = XPublicStorage::getUrl($branch_id, $user_class, $category);
            $row->logo_url =  $dir . $row->logo_file_name;
            return $row;
        }
        return (object)array("name" => '(Company Name)', 'phone_number' => '(Unvailaible phone)', 'website' => 'Unvailable');
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

    function getMemberListByStatus($filter, $ss = null)
    {
        $title = 'Membership List Report';
        // $sub_title = 'By Status';
        $header_list = ['ID', 'Name','Sex','Phone Number', 'Email', 'Nationality','Expiry Date', 'Address', 'Status'];
        $key_list = ['code', 'name','sex','phone_number', 'email', 'nationality','expiry_date', 'address', 'status'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $status_id = isset($d->status_id) ? $d->status_id : null;
        $expiry_date = DBX::formatDate("m.expiry_date", 'expiry_date');

        $str_moreWhere = '1=1';
        if ($status_id) {
            $str_moreWhere .= ' AND m.status_id =\'' . $status_id . '\'';
        }

        $query = DB::table('members as m')
            ->join('member_statuses as ms', 'm.status_id', '=', 'ms.id')
            ->join('loc_countries as c', 'c.id', '=', 'm.nationality_id')
            ->whereRaw($str_moreWhere)
            ->selectRaw('m.id,m.code, m.name,m.sex, m.phone_number, m.email, m.address, m.nationality_id, c.name as nationality, m.status_id, ms.name as status, m.is_expiry,'.$expiry_date.' ');

        $rows = $query->get();

        foreach ($rows as $row) {
            unset($row->id);
            if($row->is_expiry == 0){
                $row->expiry_date = 'Forever';

            }
        }
        return (object)[
            'title' => $title??null,
            'sub_title' => $sub_title??null,
            'form' => 'simple',
            'header' => $headers,
            'data' => $rows,
        ];
    }

    function getExpiredMembers($filter, $ss = null)
    {
        $title = 'Expired Memberships Report';
        $sub_title = 'Members having expired date';
        $header_list = ['ID', 'Name','Sex','Phone Number', 'Email', 'Nationality','Expiry Date', 'Status','Expiry Status'];
        $key_list = ['code', 'name','sex','phone_number', 'email', 'nationality','expiry_date', 'status', 'expiry_status'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

         $d = (object)$filter;
        $status_id = isset($d->status_id) ? $d->status_id : null;

        $str_moreWhere = '1=1';
        if ($status_id) {
            $str_moreWhere .= ' AND m.status_id =\'' . $status_id . '\'';
        }

        $expiry_date = DBX::formatDate("m.expiry_date", 'expiry_date');
        $query = DB::table('members as m')
            ->join('member_statuses as ms', 'm.status_id', '=', 'ms.id')
            ->join('loc_countries as c', 'c.id', '=', 'm.nationality_id')
            ->where('m.is_expiry', 1)
            ->whereRaw($str_moreWhere)
            ->whereDate('m.expiry_date', '<', date('Y-m-d'))
            ->selectRaw('m.id, m.code, m.name, m.sex, m.phone_number, m.email, m.nationality_id, c.name as nationality, m.status_id, ms.name as status, m.is_expiry, '.$expiry_date);

        $rows = $query->get();

        foreach ($rows as $row) {
            unset($row->id);
            $row->expiry_status = 'Expired';
        }

        return (object)[
            'title' => $title ?? null,
            'sub_title' => $sub_title ?? null,
            'form' => 'simple',
            'header' => $headers,
            'data' => $rows,
        ];
    }

    function getTaskAssign($filter, $ss = null)
    {
        $title = 'Task Assignments Report';
        // $sub_title = 'Task Assign';
        $header_list = ['Member ID','Member Name', 'Task Title','Assign Date', 'Status'];
        $key_list = ['code','member_name', 'task_type_title','assign_date', 'status'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $member_id = isset($d->member_id) ? $d->member_id : null;
        $task_id = isset($d->task_id) ? $d->task_id : null;
        $task_status_id = isset($d->task_status_id) ? $d->task_status_id : null;
        $assign_date = DBX::formatDate("ta.assign_date", 'assign_date');

        $str_moreWhere = '1=1';
        if ($member_id) {
            $str_moreWhere .= ' AND ta.member_id =\'' . $member_id . '\'';
        }
        if ($task_id) {
            $str_moreWhere .= ' AND ta.task_type_id =\'' . $task_id . '\'';
        }
        if ($task_status_id) {
            $str_moreWhere .= ' AND ta.status_id =\'' . $task_status_id . '\'';
        }

    $query = DB::table('task_assigns as ta')
                ->join('members as m', 'm.id', '=', 'ta.member_id')
                ->join('task_types as ty', 'ty.id', '=', 'ta.task_type_id')
                ->join('statuses as s', 's.id', '=', 'ta.status_id')
                ->whereRaw($str_moreWhere)
                ->selectRaw('
                    ta.id,
                    ta.member_id,
                    ta.task_type_id,
                    ta.status_id,
                    ' . $assign_date .',
                    m.name as member_name,
                    ty.title as task_type_title,
                    s.name as status,
                    ta.update_user,
                    m.code
                ')
                ->orderBy('ta.id', 'DESC');

        $rows = $query->get();

        return (object)[
            'title' => $title ?? null,
            'sub_title' => $sub_title ?? null,
            'form' => 'simple',
            'header' => $headers,
            'data' => $rows,
        ];
    }

    function getGraveOwnership($filter, $ss = null)
    {
        $title = 'Grave Ownership Report';
        $sub_title = 'Reversed and Used';
        $header_list = ['Member ID','Member Name','Sex','Phone', 'Relation','Tomb Owner','Sex','Slot Number', 'Status'];
        $key_list = ['code','member_name','member_sex','phone_number','tomb_owner_relation', 'tomb_owner','tomb_owner_sex','slot_number', 'status'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $member_id = isset($d->member_id) ? $d->member_id : null;

        $str_moreWhere = '1=1';
        if ($member_id) {
            $str_moreWhere .= ' AND m.id =\'' . $member_id . '\'';
        }

        $query = DB::table('members as m')
                ->join('grave_slots as gs', 'gs.reversed_id', '=', 'm.id')
                ->whereRaw($str_moreWhere)
                ->selectRaw('m.id,m.code,m.name as member_name,m.sex as member_sex,m.phone_number,gs.slot_number,gs.used_id,gs.status_id')
                ->orderBy('m.id', 'DESC');

        $rows = $query->get();

        foreach ($rows as $row) {

            $row->status = DB::table('slot_statuses')->where('id', $row->status_id)->value('name') ?? null;

            $tomb_owner_info = null;
            $tomb_owner_info = DB::table('deceased_registrations')->where('id', $row->used_id)->selectRaw('id,name as tomb_owner,sex as tomb_owner_sex,relation')->first();
            $row->tomb_owner = $tomb_owner_info->tomb_owner ?? 'N/A';
            $row->tomb_owner_sex = $tomb_owner_info->tomb_owner_sex ?? 'N/A';
            $row->tomb_owner_relation = $tomb_owner_info->relation ?? 'N/A';
        }

        return (object)[
            'title' => $title ?? null,
            'sub_title' => $sub_title ?? null,
            'form' => 'simple',
            'header' => $headers,
            'data' => $rows,
        ];
    }

    function getUnusedGraveSlot($filter, $ss = null)
    {
        $title = 'Unused Grave Slots Report';
        // $sub_title = 'Unused Grave Slot';
        $header_list = ['Slot Number','Section/Zone','Grave Row','Position','Location Note', 'Status'];
        $key_list = ['slot_number','zone','grave_row','position','location_note', 'status'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $status_id = isset($d->status_id) ? $d->status_id : null;

        $str_moreWhere = '1=1';
        if ($status_id) {
            $str_moreWhere .= ' AND gs.status_id =\'' . $status_id . '\'';
        }

        $query = DB::table('grave_slots as gs')
                ->whereRaw($str_moreWhere)
                ->where('gs.status_id', 1)
                ->selectRaw('gs.slot_number,gs.zone,gs.grave_row,gs.position,gs.location_note,gs.status_id')
                ->orderBy('gs.id', 'DESC');

        $rows = $query->get();

        foreach ($rows as $row) {
            $row->status = DB::table('slot_statuses')->where('id', $row->status_id)->value('name') ?? null;
        }

        return (object)[
            'title' => $title ?? null,
            'sub_title' => $sub_title ?? null,
            'form' => 'simple',
            'header' => $headers,
            'data' => $rows,
        ];
    }

    function getDeceasedRegistration($filter, $ss = null)
    {
        $title = 'Deceased Registry Report';
        $sub_title = 'Start date and end date filter by burial date.';
        $header_list = ['Member ID','Member Name','Gender', 'Relation','Tomb Owner','Gender','Date of Birth','Date of Death','Burial Date'];
        $key_list = ['code','member_name','member_sex','relation', 'tomb_owner','tomb_owner_sex','date_of_birth','date_of_death','burial_date'];

        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object)$filter;
        $member_id = isset($d->member_id) ? $d->member_id : null;
        $start_date = isset($d->start_date) ? date('Y-m-d', strtotime($d->start_date)) : null;
        $end_date = isset($d->end_date) ? date('Y-m-d', strtotime($d->end_date)) : null;
        $str_moreWhere = '1=1';

        if ($start_date && $end_date) {
            $str_moreWhere .= " AND DATE(dr.burial_date) BETWEEN '$start_date' AND '$end_date'";
        }

        if ($member_id) {
            $str_moreWhere .= " AND m.id ='$member_id'";
        }


        $date_of_birth = DBX::formatDate("dr.date_of_birth", 'date_of_birth');
        $date_of_death = DBX::formatDate("dr.date_of_death", 'date_of_death');
        $burial_date = DBX::formatDate("dr.burial_date", 'burial_date');

        $query = DB::table('deceased_registrations as dr')
                ->join('members as m', 'm.id', '=', 'dr.member_id')
                ->whereRaw($str_moreWhere)
                ->selectRaw('m.id,m.code,m.name as member_name,m.sex as member_sex,dr.relation,dr.name as tomb_owner,dr.sex as tomb_owner_sex,' . $date_of_birth . ',' . $date_of_death . ',' . $burial_date)
                ->orderBy('dr.id', 'DESC');

        $rows = $query->get();

        return (object)[
            'title' => $title ?? null,
            'sub_title' => $sub_title ?? null,
            'form' => 'simple',
            'header' => $headers,
            'data' => $rows,
        ];
    }

}
