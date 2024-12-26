<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
use App\Models\Bhr\Event;
use App\Models\Bhr\Employee;

class EmployeeBenefit
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getProps($id, $props = [])
    {
        $cols = is_array($props) ? implode(',', $props) : $props;
        $row = DB::table('emp_benefits')->where('id', $id)->selectRaw($cols)->first();
        return $row;
    }

    public function save($benefit_type_id, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number|exists=employees.id',
            'benefit_type_id' => '1|choice|1,2,3|default=1',
            'benefit_id' => '1|number',
            'tax_option_id' => '1|choice|1,2,3|default=1',
            'flat_tax_rate' => '0|number',
            'balance' => '0|number|default=0',
            'amount' => '1|number',
            'remarks' => '0|string|1-250',
        ];

        $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $inputs['branch_id'] = $branch_id;

        $existingBenefitQuery = DB::table('emp_benefits')
        ->where('emp_id', $inputs['emp_id'])
        ->where('benefit_type_id', $inputs['benefit_type_id'])
        ->where('benefit_id', $inputs['benefit_id']);

        if ($id) {
            $existingBenefitQuery->where('id', '!=', $id);
        }

        $existingBenefit = $existingBenefitQuery->first();

        if ($existingBenefit) {
            return DV::error('Duplicate benefit is not allowed for the same employee and benefit type.');
        }

        if ($id) {
            $updated = DB::table('emp_benefits')
            ->where('id', $id)
                ->update($inputs);

            if ($updated) {
                return DV::depends($id, ['id' => $id], 'Update successful');
            } else {
                return DV::error('Update failed. Record may not exist or data is unchanged.');
            }
        } else {
            $newId = DB::table('emp_benefits')->insertGetId($inputs);

            if ($newId) {
                return DV::depends($newId, ['id' => $newId], 'Create successful');
            } else {
                return DV::error('Create failed.');
            }
        }
    }


    function getAllBenefitList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_benefit_id = $d->benefit_id ?? null;
        $str_srch = '1=1';
        $str_where = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $str_srch = "(emp.name LIKE '%" . $search_value . "%' OR b.remarks LIKE '%" . $search_value . "%' OR b.amount LIKE '%" . $search_value . "%')";
        }
        $benefitsQuery = DB::table('emp_benefits as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
            ->whereRaw($str_srch)
            ->whereRaw($str_where)

            ->selectRaw(
                'b.id, emp.id as emp_id, emp.name as name, emp.email as email, bc.name as benefit_name,
                b.benefit_type_id,b.benefit_id,b.tax_option_id,b.flat_tax_rate,b.balance, b.amount, b.remarks, b.update_user,b.updated_at, b.create_date, emp.photo_file_name as emp_photo'
            )

            ->orderBy('b.id', 'desc');

        if ($search_benefit_id) {
            $benefitsQuery->where('b.benefit_id', $search_benefit_id);
        }
        $clone_query = clone $benefitsQuery;

        $count = $clone_query->count('b.id');

        $rows = $benefitsQuery->skip($skip_rows)
            ->take($per_page)
            ->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('emp_benefits as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
            ->selectRaw(
                'b.id,
                emp.id as emp_id,
                emp.name as name,
                emp.email as email,
                bc.name as benefit_name,
                b.benefit_type_id,
                b.benefit_id,
                b.tax_option_id,
                b.flat_tax_rate,
                b.balance,
                b.amount,
                b.remarks,
                b.update_user,
                b.updated_at,
                b.create_date,
                emp.photo_file_name as emp_photo'
            )
            ->where('b.branch_id', $branch_id)->where('b.id', $id)->take(1)->first();
        return $query;
    }


    function deleteBenefit($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $delete = DB::table('emp_benefits')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    static function getFormOptions($id, $ss)
    {
        $emp_benefits = null;
        if ($id) {
            $emp_benefits = self::getDetails($id, $ss);
        }
        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'benefits' => DB::table('benefits')->selectRaw('id,name')->get(),
            'emp_benefits' => $emp_benefits,
        ];
    }
}
