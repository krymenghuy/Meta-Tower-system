<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Psy\Command\WhereamiCommand;


class Benefit
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $id = $this->id ?? null;
        $d = (object) $arr;
        $emp_id = $d->emp_id ?? null;
        if (!$emp_id) return DV::error('Employee is required for saving benefit!');

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number|exists=employees.id',
            'benefit_type_id' => '1|choice|1,2|default=1',
            'amount' => '0|number',
            'remarks' => '0|string|1-255'
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'emp_benefits', ['id' => $id], $inputs, [], 1, false);
        if ($id > 0) {
            if ($d->benefit_type_id == 1) {
                $bonus_arr = ['benefit_id' => $id, 'remarks' => $d->remarks];
                $bonus_v_rule = [
                    'benefit_id' => '1|number',
                    'remarks' => '0|string|1-250'
                ];
                $bonus_res = validateObject($bonus_arr, $bonus_v_rule, true, [], $ss->lang, false, null);
                if ($bonus_res->error) return DV::error($bonus_res->error);

                $bonus_inputs = $bonus_res->values;
                $bonus_id = saveData($ss, 'emp_bonuses', ['id' => null], $bonus_inputs, [], 1, false);

                return DV::depends($bonus_id, ['Bonuses data saved']);
            } else if ($d->benefit_type_id == 2) {
                $seniority_arr = [
                    'benefit_id' => $id,
                    'start_date' => $d->start_date ?? null,
                    'end_date' => $d->end_date ?? null,
                    'seniority_type' => $d->seniority_type ?? null
                ];
                $seniority_v_rule = [
                    'benefit_id' => '1|number',
                    'start_date' => '0|date',
                    'end_date' => '0|date',
                    'seniority_type' => '0|string|1-50'
                ];
                $seniority_res = validateObject($seniority_arr, $seniority_v_rule, true, [], $ss->lang, false, null);
                if ($seniority_res->error) return DV::error($seniority_res->error);

                $seniority_inputs = $seniority_res->values;
                $seniority_id = saveData($ss, 'emp_seniorities', ['id' => null], $seniority_inputs, [], 1, false);

                return DV::depends($seniority_id, ['Seniority data saved']);
            }

            return DV::depends(1, ['Benefits saved' => $inputs, 'Benefit ID' => $id]);
        }

        return DV::error('Error saving benefit');
    }





    function getBonusList($arr, $ss = null)
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
        $benefit_type_id = $d->benefit_type_id ?? null;
        $str_bonus_type = '1=1';
        $str_search = '2=2';
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '\')';
        } else {
            $str_bonus_type = $benefit_type_id ? 'b.benefit_type_id =\'' . $benefit_type_id . '\'' : '1=1';
        }

        $query = DB::table('emp_bonuses as bs')
            ->join('emp_benefits as b', 'b.id', '=', 'bs.benefit_id')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')

            ->Where('bs.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->whereRaw($str_bonus_type)
            ->selectRaw('bs.id,bs.benefit_id,emp.name as employee,b.benefit_type_id,bs.bonus_type,b.amount,b.remarks');
        $count_query = clone $query;
        $count = $count_query->count('bs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getSeniorityList($arr, $ss = null)
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
        $benefit_type_id = $d->benefit_type_id ?? null;
        $str_seniority_type = '1=1';
        $str_search = '2=2';
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = '(emp.name LIKE \'%' . $search_value . '\')';
        } else {
            $str_seniority_type = $benefit_type_id ? 'b.benefit_type_id =\'' . $benefit_type_id . '\'' : '1=1';
        }

        $query = DB::table('emp_seniorities as se')
            ->join('emp_benefits as b', 'b.id', '=', 'se.benefit_id')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')

            ->Where('se.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->whereRaw($str_seniority_type)
            // ->selectRaw('se.id,se.benefit_id,emp.name as employee, b.benefit_type_id,se.seniority_type,b.amount,se.start_date,se.end_date,b.remarks');
            ->selectRaw('se.id,se.benefit_id,emp.name as employee, b.benefit_type_id,se.seniority_type,b.amount');
        $count_query = clone $query;
        $count = $count_query->count('se.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($benefit_type_id, $id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = null;
        if ($benefit_type_id == 1) {
            $row = DB::table('emp_benefits as b')
                ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
                ->join('emp_bonuses as bs', 'bs.benefit_id', '=', 'b.id')
                ->where('b.id', $id)
                ->selectRaw('b.id,b.emp_id,b.benefit_type_id,b.amount,b.remarks,bs.benefit_id,bs.bonus_type,emp.name as employee')->take(1)->first();
        } else {
            $row = DB::table('emp_benefits as b')
                ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
                ->join('emp_seniorities as se', 'se.benefit_id', '=', 'b.id')
                ->where('b.id', $id)
                ->selectRaw('b.id,b.emp_id,b.benefit_type_id,b.amount,b.remarks,se.benefit_id,se.seniority_type,emp.name as employee,se.start_date,se.end_date')->take(1)->first();
        }
        if (!$row) return null;

        return $row;
    }

    function deleteBenefit($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('emp_benefits')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Benefit not found');
        }
        // Return the query result
        return $query;
    }

    function getFormOptions($id, $ss)
    {

        $benifit = null;
        if ($id) {
            $benifit = self::getDetails($benefit_type_id = null, $id, $ss);
        }
        return $data = (object) [

            'categories' => DB::table('benefit_categories')->selectRaw('id,name')->get(),
            'benefit' => $benifit
        ];
    }
}
