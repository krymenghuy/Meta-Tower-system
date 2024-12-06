<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BenefitDisbursement //extends Model
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
        $row = DB::table('benefit_disbursements')->where('id', $id)->selectRaw($cols)->first();
        return $row;
    }

    public function save($benefit_id, $id = null, $ss = null, $arr)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number|exists=employees.id',
            'benefit_id' => '1|number',
            'target_month' => '0|date',
            'target_year' => '0|date',
            'withdraw_rate' => '0|number'
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;
        $benefit_id = $arr['benefit_id'] ?? null;
        $emp_id = $arr['emp_id'] ?? null;

        if (!$emp_id) {
            return DV::error('Employee is required for saving benefit disbursement!');
        }

        // Check for existing benefit
        $existingBenefitDisbursement = DB::table('benefit_disbursements')
            ->where('emp_id', $emp_id)
            ->where('benefit_id', $inputs['benefit_id'])
            ->first();

        if ($existingBenefitDisbursement && (!$id || $id !== $existingBenefitDisbursement->id)) {
            return DV::error('This employee already has a benefit of this type.');
        }

        // Save benefit data
        $id = saveData($ss, 'benefit_disbursements', ['id' => $id], $inputs, [], 1, false);

        if ($id > 0) {
            
            $benefit = $this->getProps($id, ['benefit_type_id']);
            if (!$benefit) {
                return DV::error('Benefit type ID not found!');
            }
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
        $str_srch = '1=1';
        $str_where = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $str_srch = "(emp.name LIKE '%" . $search_value . "%' OR b.benefit_id LIKE '%" . $search_value . "%' OR b.amount LIKE '%" . $search_value . "%')";
        }
        $benefitsQuery = DB::table('benefit_disbursements as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
            ->whereRaw($str_srch)
            ->whereRaw($str_where)

            ->selectRaw(
                'b.id, emp.id as emp_id, emp.name as name, emp.email as email, bc.name as benefit_name,
                b.benefit_type_id,b.benefit_id,b.tax_option_id,b.flat_tax_rate,b.balance, b.amount, b.benefit_id, b.update_user,b.updated_at, b.create_date, emp.photo_file_name as emp_photo'
            )

            ->orderBy('b.id', 'desc');


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
        $query = DB::table('benefit_disbursements as b')
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
                b.benefit_id, 
                b.update_user,
                b.updated_at, 
                b.create_date, 
                emp.photo_file_name as emp_photo'
            )
            ->where('b.branch_id', $branch_id)->where('b.id', $id)->take(1)->first();
        return $query;
    }


    function deleteBenefit($id, $ss)
    {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $delete = DB::table('benefit_disbursements')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    static function getFormOptions($id, $ss)
    {
        $benefit_disbursements = null;
        if ($id) {
            $benefit_disbursements = self::getDetails($id, $ss);
        }
        return $data = (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'benefits' => DB::table('benefits')->selectRaw('id,name')->get(),
            'benefit_disbursements' => $benefit_disbursements,
        ];
    }
}
