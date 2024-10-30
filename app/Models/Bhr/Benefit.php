<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Psy\Command\WhereamiCommand;
use App\Models\DBX;

class Benefit
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function save($arr, $id,$ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;
        $d = (object) $arr;
        $emp_id = $d->emp_id ?? null;
        if (!$emp_id) return DV::error('Employee is required for saving benefit!');

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number|exists=employees.id',
            'benefit_type_id' => '1|choice|1,2,3|default=1',
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
                if ($bonus_id){
                    
                }

                return DV::depends($bonus_id, ['Bonuses data saved']);
            } else if ($d->benefit_type_id == 2) {
                $seniority_arr = [
                    'benefit_id' => $id,
                    'start_date' => $d->start_date ?? null,
                    'end_date' => $d->end_date ?? null,
                    'seniority_type' => $d->seniority_type ?? null,
                    'remarks' => $d->remarks
                ];
                $seniority_v_rule = [
                    'benefit_id' => '1|number',
                    'start_date' => '0|date',
                    'end_date' => '0|date',
                    'seniority_type' => '0|string|1-50',
                    'remarks' => '0|string|1-250'
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
            else if ($d->benefit_type_id == 3) {
                $life_insurances_arr = [
                    'benefit_id' => $id,
                    'start_date' => $d->start_date ?? null,
                    'end_date' => $d->end_date ?? null,
                    'life_insurance_type' => $d->life_insurance_type ?? null,
                    'remarks' => $d->remarks
                ];
                $life_insurances_v_rule = [
                    'benefit_id' => '1|number',
                    'start_date' => '0|date',
                    'end_date' => '0|date',
                    'life_insurance_type' => '0|string|1-50',
                    'remarks' => '0|string|1-250'
                ];
                $life_insurances_res = validateObject($life_insurances_arr, $life_insurances_v_rule, true, [], $ss->lang, false, null);
                if ($life_insurances_res->error) return DV::error($life_insurances_res->error);

                $life_insurances_inputs = $life_insurances_res->values;

                $existing_life_insurances = DB::table('emp_life_insurances')->where('benefit_id', $id)->first();

                if ($existing_life_insurances) {
                    $life_insurances_id = saveData($ss, 'emp_life_insurances', ['id' => $existing_life_insurances->id], $life_insurances_inputs, [], 1, false);
                } else {
                    $life_insurances_id = saveData($ss, 'emp_life_insurances', ['id' => null], $life_insurances_inputs, [], 1, false);
                }

                return DV::depends($life_insurances_id, ['life_insurances data saved']);
            }

            return DV::depends(1, ['Benefits saved' => $inputs, 'Benefit ID' => $id]);
        }


        return DV::depends($id, ['id' => $id], 'Save failed');
    }

    function getAllBenefitsList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $benefit_type_id = $d->benefit_type_id ?? null;

        $str_benefit_type = $benefit_type_id ? 'b.benefit_type_id = \'' . $benefit_type_id . '\'' : '1=1';
        $str_search = $search_value ? "(emp.name LIKE '%" . addslashes($search_value) . "%' OR b.remarks LIKE '%" . addslashes($search_value) . "%' OR b.amount LIKE '%" . addslashes($search_value) . "%')" : '1=1';
        $col_seniority_dates = DBX::formatDate('se.start_date', 'se_start_date') . ',' . DBX::formatDate('se.end_date', 'se_end_date');
        $col_insurance_dates = DBX::formatDate('li.start_date', 'li_start_date') . ',' . DBX::formatDate('li.end_date', 'li_end_date');

        $benefitsQuery = DB::table('emp_benefits as b')
        ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
        ->leftJoin('emp_seniorities as se', 'se.benefit_id', '=', 'b.id') // Use LEFT JOIN if seniorities are optional
        ->leftJoin('emp_life_insurances as li', 'li.benefit_id', '=', 'b.id') // Use LEFT JOIN if life insurances are optional
        ->whereRaw($str_search)
        ->whereRaw($str_benefit_type)
        
        ->selectRaw(
            'b.id, emp.id as emp_id, emp.name as name, emp.email as email, 
                b.benefit_type_id, b.amount, b.remarks, b.update_user, b.create_date, emp.photo_file_name as emp_photo, '
           . $col_seniority_dates . ', ' 
           . $col_insurance_dates
        )

        ->orderBy('b.id', 'desc');


        // Count the total benefits for pagination
        $count = $benefitsQuery->count();

        // Get paginated results
        $rows = $benefitsQuery->skip($skip_rows)
            ->take($per_page)
            ->get();

        // Process the image URLs and clean up
        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);  // Remove unnecessary data
        }

        // Paginate the results
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getBonusList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $benefit_type_id = $d->benefit_type_id ?? null;

        $str_bonus_type = $benefit_type_id ? 'b.benefit_type_id = \'' . $benefit_type_id . '\'' : '1=1';
        $str_search = $search_value ? "(emp.name LIKE '%" . ($search_value) . "%')" : '1=1';

        $query = DB::table('emp_bonuses as bs')
            ->join('emp_benefits as b', 'b.id', '=', 'bs.benefit_id')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefit_categories as bc', 'bc.id', '=', 'b.benefit_type_id')
            ->where('bs.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->whereRaw($str_bonus_type)
            ->selectRaw('bs.id, emp.id as emp_id, bs.benefit_id, emp.name as name, emp.email as email, b.benefit_type_id, bs.bonus_type, b.amount, b.remarks, b.create_date, b.update_user, emp.photo_file_name as emp_photo');

        $count_query = clone $query;
        $count = $count_query->count('bs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);  // Remove unnecessary data
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getSeniorityList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $benefit_type_id = $d->benefit_type_id ?? null;

        $str_seniority_type = $benefit_type_id ? 'b.benefit_type_id = \'' . $benefit_type_id . '\'' : '1=1';
        $str_search = $search_value ? "(emp.name LIKE '%" . addslashes($search_value) . "%')" : '1=1';

        $query = DB::table('emp_seniorities as se')
            ->join('emp_benefits as b', 'b.id', '=', 'se.benefit_id')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->where('se.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->whereRaw($str_seniority_type)
            ->selectRaw('se.id, se.benefit_id, emp.name as employee, b.benefit_type_id, se.seniority_type, b.amount');

        $count_query = clone $query;
        $count = $count_query->count('se.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    function getLifeInsurancesList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $benefit_type_id = $d->benefit_type_id ?? null;

        $str_seniority_type = $benefit_type_id ? 'b.benefit_type_id = \'' . $benefit_type_id . '\'' : '1=1';
        $str_search = $search_value ? "(emp.name LIKE '%" . addslashes($search_value) . "%')" : '1=1';

        $query = DB::table('emp_life_insurances as li')
            ->join('emp_benefits as b', 'b.id', '=', 'li.benefit_id')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->where('li.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->whereRaw($str_seniority_type)
            ->selectRaw('li.id, li.benefit_id, emp.name as employee, b.benefit_type_id, li.life_insurance_type, b.amount');

        $count_query = clone $query;
        $count = $count_query->count('li.id');
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
            ->selectRaw('b.id, b.emp_id, b.benefit_type_id, b.amount, b.remarks, bs.bonus_type as type, emp.name as employee,bs.created_at,bs.updated_at,bs.update_user');
        } elseif ($benefit->benefit_type_id == 2) {
            $query->join('emp_seniorities as se', 'se.benefit_id', '=', 'b.id')
            ->selectRaw('b.id, b.emp_id, b.benefit_type_id, b.amount, b.remarks, se.seniority_type as type, se.start_date, se.end_date, emp.name as employee,se.created_at,se.updated_at,se.update_user');
        } elseif ($benefit->benefit_type_id == 3) {
            $query->join('emp_life_insurances as li', 'li.benefit_id', '=', 'b.id')
            ->selectRaw('b.id, b.emp_id, b.benefit_type_id, b.amount, b.remarks, li.life_insurance_type as type, li.start_date, li.end_date, emp.name as employee,li.created_at,li.updated_at,li.update_user');
        }

        return $query->first();
    }


    function deleteBenefit($id, $ss)
    {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $delete = DB::table('emp_benefits')->where('id', $id)->delete();
        if ($delete) {
            DB::table('emp_bonuses')->where('benefit_id', $id)->delete();
            DB::table('emp_seniorities')->where('benefit_id', $id)->delete();
            DB::table('emp_life_insurances')->where('benefit_id', $id)->delete();
        }
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
