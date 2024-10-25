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

                $existing_bonus = DB::table('emp_bonuses')->where('benefit_id', $id)->first();

                if ($existing_bonus) {
                    $bonus_id = saveData($ss, 'emp_bonuses', ['id' => $existing_bonus->id], $bonus_inputs, [], 1, false);
                } else {
                    $bonus_id = saveData($ss, 'emp_bonuses', ['id' => null], $bonus_inputs, [], 1, false);
                }

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

                $existing_seniority = DB::table('emp_seniorities')->where('benefit_id', $id)->first();

                if ($existing_seniority) {
                    $seniority_id = saveData($ss, 'emp_seniorities', ['id' => $existing_seniority->id], $seniority_inputs, [], 1, false);
                } else {
                    $seniority_id = saveData($ss, 'emp_seniorities', ['id' => null], $seniority_inputs, [], 1, false);
                }

                return DV::depends($seniority_id, ['Seniority data saved']);
            }

            return DV::depends(1, ['Benefits saved' => $inputs, 'Benefit ID' => $id]);
        }


        return DV::depends($id, ['id' => $id], 'Save failed');
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
            ->join('benefit_categories as bc', 'bc.id', '=', 'b.benefit_type_id')

            ->Where('bs.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->whereRaw($str_bonus_type)
            ->selectRaw('bs.id,emp.id as emp_id,bs.benefit_id,emp.name as name, emp.email as email,b.benefit_type_id,bs.bonus_type,b.amount,b.remarks,b.create_date, b.update_user,emp.photo_file_name as emp_photo');
        $count_query = clone $query;
        $count = $count_query->count('bs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);  // Clean up unnecessary data
        }
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
            ->selectRaw('se.id,emp.id as emp_id,se.benefit_id,emp.name as name, emp.email as email, b.benefit_type_id,se.seniority_type,b.amount');
        $count_query = clone $query;
        $count = $count_query->count('se.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;

        $benefit = DB::table('emp_benefits as b')
            ->where('b.id', $id)
            ->select('b.id', 'b.emp_id', 'b.benefit_type_id', 'b.amount', 'b.remarks')
            ->first();

        if (!$benefit) {
            return null;
        }


        $query = DB::table('emp_benefits as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->where('b.id', $id);

        if ($benefit->benefit_type_id == 1) {
            $query->join('emp_bonuses as bs', 'bs.benefit_id', '=', 'b.id')
                ->selectRaw('b.id, b.emp_id, b.benefit_type_id, b.amount, b.remarks, bs.benefit_id, bs.bonus_type, emp.name as employee');
        } elseif ($benefit->benefit_type_id == 2) {
            $query->join('emp_seniorities as se', 'se.benefit_id', '=', 'b.id')
                ->selectRaw('b.id, b.emp_id, b.benefit_type_id, b.amount, b.remarks, se.benefit_id, se.seniority_type, emp.name as employee, se.start_date, se.end_date');
        } else {
            return null;
        }
        $row = $query->take(1)->first();

        return $row ?: null;
    }



    function deleteBenefit($id, $as, $ss)
    {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $delete = DB::table('emp_benefits')->where('id', $id)->delete();
        if ($as == 'bonus') {
            DB::table('emp_bonuses')->where('benefit_id', $id)->delete();
        } else
            DB::table('emp_seniorities')->where('benefit_id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    function getFormOptions($id, $ss)
    {


        $benefit = null;
        if ($id) {
            $benefit = self::getDetails($id, $ss);
        }
        return $data = (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'categories' => DB::table('benefit_categories')->selectRaw('id,name')->get(),
            'benefit' => $benefit
        ];
    }
}
