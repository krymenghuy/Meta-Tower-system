<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Seniority
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'period' => '1|string|0-100',
            'description' => '0|string|0-100',
            'amount' => '1|number',
        ];


        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'seniorities', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['seniorities' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving seniority');
    }

    function getSeniorityListPaginate($arr, $ss) {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('seniorities as s')
            ->join('employees as e', 'e.id', 's.emp_id')
            ->selectRaw('s.id, s.emp_id, e.first_name as emp_first_name, e.last_name as emp_last_name, s.period, s.description, s.amount,e.photo_file_name as emp_photo')
            ->where('s.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->orderby('s.id', 'asc');

        if ($search_id) {
            $query->where('s.id', $search_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "s.description like '%" . $search_value . "%' or e.first_name like '%" . $search_value . "%' or e.last_name like '%" . $search_value . "%' or s.period like '%" . $search_value . "%' or s.amount like '%" . $search_value . "%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::getProfilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
        $row = DB::table('seniorities as s')
            ->join('employees as e', 'e.id', 's.emp_id')
            ->selectRaw('s.id, s.emp_id, e.first_name as emp_first_name, e.last_name as emp_last_name, s.period, s.description, s.amount,e.photo_file_name as emp_photo')
            ->where('s.id', $id)->first();
        if ($row) {
            $row->image_url = Employee::getProfilePicture($row->emp_id);
            unset($row->emp_photo);
        } else {
            $row = null;
        }
        return $row;
    }

    function deleteSeniority($id, $ss) {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('seniorities')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Seniority not found');
        }
        // Return the query result
        return $query;

    }

    function getFormOptions($id, $ss)
    {
        $seniority = null;
        if ($id) {
            $seniority = self::getDetails($id, $ss);
        }
        return (object) [

            'employees' => DB::table('employees')->selectRaw('id,CONCAT(first_name," ",last_name) as name')->get(),



            'seniority' => $seniority,
        ];

    }

}
