<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class StaffBenefit
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
            'emp_id'=> '1|number',
            'benefit_id' => '1|number',
            'amount' => '1|number',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss,'staff_benefits', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['staff_benefits' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving benefit');

    }

    function getStaffBenefitListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_emp_id = $d->emp_id ?? null;
        $search_benefit_id = $d->benefit_id ?? null;

        $str_search = '1=1';

        $query = DB::table('staff_benefits as sb')
        ->join('employees as em', 'em.id', '=', 'sb.emp_id')
        ->join('benefits as b', 'b.id', '=', 'sb.benefit_id')
        ->selectRaw('sb.id, sb.emp_id, sb.benefit_id, sb.amount, em.first_name, em.last_name, b.name as benefit_name')
        ->where('sb.branch_id', $branch_id)
        ->whereRaw($str_search)
        ->orderBy('sb.id', 'asc');


        if ($search_id) {
            $query->whereRaw('sb.id =' . $search_id);

        }

        if ($search_emp_id) {
            $query->whereRaw('sb.emp_id =' . $search_emp_id);
        }

        if ($search_benefit_id) {
            $query->whereRaw('sb.benefit_id =' . $search_benefit_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw('em.first_name like "%' . $search_value . '%"');
            $query->orWhereRaw('em.last_name like "%' . $search_value . '%"');
            $query->orWhereRaw('b.name like "%' . $search_value . '%"');
            $query->orWhereRaw('sb.amount like "%' . $search_value . '%"');
            $query->whereRaw($str_search);

        }


        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('sb.id');
        $rows = $query->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    }

    function getDetails($id, $ss)
    {

        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        $branch_id = $ss->branch_id;

        $query = DB::table('staff_benefits as sb')
        ->join('employees as em', 'em.id', '=', 'sb.emp_id')
        ->join('benefits as b', 'b.id', '=', 'sb.benefit_id')
        ->selectRaw('sb.id, sb.emp_id, sb.benefit_id, sb.amount, em.first_name, em.last_name, b.name as benefit_name')
        ->where('sb.branch_id', $branch_id)
        ->where('sb.id', $id)
        ->first();
        if (!$query) {
            return DV::error('Staff Benefit not found');
        }
        // Return the query result
        return $query;
    }


    function delete($id, $ss)
    {
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }
        $branch_id = $ss->branch_id;
        $query = DB::table('staff_benefits')
        ->where('id', $id)
        ->delete();
        if (!$query) {
            return DV::error(' Staff Benefit not found');
        }
        // Return the query result
        return $query;
    }


}
