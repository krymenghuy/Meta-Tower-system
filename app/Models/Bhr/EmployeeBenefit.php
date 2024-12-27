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

    public function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [

            'emp_id' => '1|number|exists=employees.id',
            'benefit_id' => '1|number',
            'tax_option_id' => '1|choice|1,2,3|default=1',
            'flat_tax_rate' => '0|number',
            'balance' => '0|number|default=0',
            'amount' => '1|number',
            'remarks' => '0|string|1-250',
        ];

        $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        if (!$id) {
            $checkExist = DB::table('emp_benefits')->where('emp_id', $inputs['emp_id'])->where('benefit_id', $inputs['benefit_id'])->take(1)->value('id');
            if ($checkExist) {
                return DV::error('Benefit already exists');
            }
        }

        $id = saveData($ss, 'emp_benefits', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['emp_benefits' => $inputs, 'id' => $id]);
        }
        return DV::error('Error Saving Employee Benefit');
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
        $query = DB::table('emp_benefits as eb')
            ->join('employees as emp', 'emp.id', '=', 'eb.emp_id')
            ->join('benefits as b', 'b.id', '=', 'eb.benefit_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->selectRaw('
                eb.id,
                emp.id as emp_id,
                emp.name as emp_name,
                p.title as position,
                b.name as benefit_name,
                b.type_id as benefit_type_id,
                eb.benefit_id,
                eb.tax_option_id,
                eb.flat_tax_rate,
                eb.balance,
                eb.amount,
                eb.remarks,
                emp.photo_file_name as emp_photo
            ')
            ->where('eb.branch_id', $branch_id)
            ->whereRaw($str_srch);

        if ($search_benefit_id) {
            $query->where('eb.benefit_id', $search_benefit_id);
        }
        $clone_query = clone $query;

        $count = $clone_query->count('eb.id');

        $rows = $query->skip($skip_rows)
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
        $query =DB::table('emp_benefits as eb')
        ->join('employees as emp', 'emp.id', '=', 'eb.emp_id')
        ->join('benefits as b', 'b.id', '=', 'eb.benefit_id')
        ->join('positions as p', 'p.id', '=', 'emp.position_id')
        ->selectRaw('
            eb.id,
            emp.id as emp_id,
            emp.name as emp_name,
            p.title as position,
            b.name as benefit_name,
            b.type_id as benefit_type_id,
            eb.benefit_id,
            eb.tax_option_id,
            eb.flat_tax_rate,
            eb.balance,
            eb.amount,
            eb.remarks,
            emp.photo_file_name as emp_photo
        ')
            ->where('eb.branch_id', $branch_id)->where('eb.id', $id)->take(1)->first();
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
