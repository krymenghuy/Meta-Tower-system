<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BenefitDisbursement
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function getProps($id, $props = [])
    {
        $cols = is_array($props) ? implode(',', $props) : $props;
        return DB::table('benefit_disbursements')->where('id', $id)->selectRaw($cols)->first();
    }

    public function save($benefit_id, $ss, $arr )
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'benefit_id' => '1|number',
            'target_month' => '0|number|min=1|max=12',
            'target_year' => '0|number|min=1900|max=2100',
            'withdraw_rate' => '0|number'
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        $inputs['target_month'] = intval($arr['target_month'] ?? date('m'));
        $inputs['target_year'] = intval($arr['target_year'] ?? date('Y'));

        $emp_id = $arr['emp_id'] ?? null;
        if (!$emp_id) {
            return DV::error('Employee is required for saving benefit disbursement!');
        }

        if(!$id) {
            $existingBenefitDisbursement = DB::table('benefit_disbursements')
            ->where('emp_id', $emp_id)
            ->where('benefit_id', $inputs['benefit_id'])
            ->first();

            if ($existingBenefitDisbursement && (!$id || $id !== $existingBenefitDisbursement->id)) {
                return DV::error('This employee already has a benefit of this type.');
            }
        }

        $id = saveData($ss, 'benefit_disbursements', ['id' => $id], $inputs, [], 1, false);

        return DV::depends($id, ['id' => $id], 'Save failed');
    }

    public function getBenefitDisbursementListPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_benefit_id = $d->benefit_id ?? null;
        $query = DB::table('benefit_disbursements as bd')
            ->join('employees as emp', 'emp.id', '=', 'bd.emp_id')
            ->join('benefits as b', 'b.id', '=', 'bd.benefit_id')
            ->selectRaw(
                'bd.id,
            emp.id as emp_id,
            emp.name as name,
            emp.email as email,
            b.name as benefit_name,
            bd.benefit_id,
            bd.target_month,
            bd.target_year,
            bd.withdraw_rate,
            bd.update_user,
            bd.updated_at,
            bd.create_date,
            emp.photo_file_name as emp_photo'
            )
            ->orderBy('bd.id', 'desc');
        if ($search_benefit_id) {
            $query->where('bd.benefit_id', $search_benefit_id);
        }
        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('emp.name', 'LIKE', "%{$search_value}%")
                    ->orWhere('bd.benefit_id', 'LIKE', "%{$search_value}%")
                    ->orWhere('bd.withdraw_rate', 'LIKE', "%{$search_value}%");
            });
        }
        $count = $query->count();

        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (!empty($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    public static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        return DB::table('benefit_disbursements as bd')
            ->join('employees as emp', 'emp.id', '=', 'bd.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'bd.benefit_id')
            ->selectRaw(
                'bd.id,
                emp.id as emp_id,
                emp.name as name,
                emp.email as email,
                bc.name as benefit_name,
                bd.benefit_id,
                bd.target_month,
                bd.target_year,
                bd.withdraw_rate,
                emp.photo_file_name as emp_photo'
            )
            ->where('bd.id', $id)
            ->first();
    }

    public function deleteBenefitDisbursement($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('benefit_disbursements')->where('id', $id)->delete();

        return DV::depends($deleted,null,'Error deleting the benefit disbursement');
    }

    public static function getFormOptions($id, $ss)
    {
        $benefit_disbursements = $id ? self::getDetails($id, $ss) : null;

        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'benefits' => DB::table('benefits')->select('id', 'name')->get(),
            'benefit_disbursements' => $benefit_disbursements,
        ];
    }

    public function getBenefitDisbursementList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('benefit_disbursements as bd')
            ->select('bd.id', 'bd.benefit_id', 'bd.target_month', 'bd.target_year', 'bd.withdraw_rate')
            ->where('bd.branch_id', $branch_id);

        if (!empty($d->search_value)) {
            $query->where('bd.name', 'LIKE', "%{$d->search_value}%");
        }

        return $query->get();
    }
}
