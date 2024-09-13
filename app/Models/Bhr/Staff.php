<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Staff
{
    protected $id = null;
    protected $userInfo = null;

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'position_id' => '1|number',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'staffs', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getListPaginate($arr, $ss)
    {

        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $status = isset($d->status_code) ? $d->status_code : 'active';
        //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
        $search_value = isset($d->search_value) ? $d->search_value : null;
        $position_id = isset($d->position_id) ? $d->position_id : null;
        $str_position = '11=11';
        /** $position_id = -1 means "To query merchants who are not referred by any sales agent "
         *  $position_id = null or zero => means query merchants either refered by agent or no referrer
         */
        if ($position_id ==-1) $str_position = 's.position_id IS NULL';
        else if ($position_id > 0) $str_position = 's.position_id ='.$position_id;
        //$str_sender_type = null;
        $str_status = '3=3'; // Active, Inactive
        $str_search = '2=2';
        //$str_agent = null;

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(s.name LIKE '%" . $search_value . "%' )";
        }
        // else {
        //     //if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
        //     if (in_array(strtolower($status), ['active', 'inactive'])) {
        //         $str_status = 's.status_code =\'' . $status . '\'';
        //     }
        // }
        $query = DB::table('staffs as s')->selectRaw('name, position_id')->whereRaw($str_search)->whereRaw($str_position);
        if ($position_id > 0) {
            $query = $query->whereRaw('position_id = ' . $position_id);
        }
        $query = $query->orderBy('id', 'asc');//desc or asc
        $count = $query->count('id');
        $query = $query->skip($skip_rows)->take($per_page);
        $query = $query->get();
        return new LengthAwarePaginator($query, $count, $per_page, $current_page);

    }

    function getListAll ($ss){
       return DB::table('staffs as s')->selectRaw('id,name, position_id')->get();
    }

    public function getDetails($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('staffs as s')
            ->selectRaw('id, name, position_id')
            ->where('id', $id)
            ->first();

        // Return the query result
        return $query ?: DV::error('Staff member not found');
    }

    public function deleteStaff($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('staffs')
            ->where('id', $id)
            ->delete();

        // Return the query result
        return $query ?: DV::error('Staff member not found');
    }



}
