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

    function save($arr = [], $id = null, $ss = null) {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'emp_id' => '1|number',
            'period' => '1|string|0-100',
            'description' => '0|string|0-100',
            'amount' => '1|number',
        ];


        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

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
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $sort_by = $d->sort_by ?? 's.id';
        $sort_order = $d->sort_order ?? 'asc';
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('seniorities as s')
            ->join('employees as e', 'e.id', 's.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
            ->selectRaw('s.id, s.emp_id, e.name as emp_name, pos.title as position, s.period, s.description, s.amount,e.photo_file_name as emp_photo')
            ->where('s.branch_id', $branch_id);

        if ($search_id) {
            $query->where('s.id', $search_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%" . $search_value . "%' or s.period like '%" . $search_value . "%' or s.amount like '%" . $search_value . "%'";

        }
        $query->whereRaw($str_search);

        $query->orderBy($sort_by, $sort_order);

        $count = $query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id, $ss) {
        $row = DB::table('seniorities as s')
            ->join('employees as e', 'e.id', 's.emp_id')
            ->selectRaw('s.id, s.emp_id, e.name as emp_name, s.period, s.description, s.amount,e.photo_file_name as emp_photo')
            ->where('s.id', $id)->first();
        if ($row) {
            $row->image_url = Employee::profilePicture($row->emp_id);
            unset($row->emp_photo);
        } else {
            $row = null;
        }
        return $row;
    }

    function delete($id = null) {
        $id = $id ?? $this->id;
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $branch_id = $ss->branch_id;

        $query = DB::table('seniorities')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Seniority not found');
        }
        return DV::depends($query, null, 'Error deleting seniority');

    }

    function getFormOptions($id, $ss)
    {
        $seniority = null;
        if ($id) {
            $seniority = self::getDetails($id, $ss);
        }
        return (object) [

            'sort_by' => [
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 's.period', 'name' => 'By Period'],
                ['id' => 's.amount', 'name' => 'By Amount'],

            ],

          'employees' => GeneralSettings::options_employee(10,$ss),
            'seniority' => $seniority,
        ];

    }

}
