<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExitForm
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
        return DB::table('exit_forms')->where('id', $id)->selectRaw($cols)->first();
    }

    public function save( $arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number',
            'name' => '1|string'
        ];
        $item = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['item' => $item], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $arr['emp_id'] ?? null;

        $isValidEmployee = DB::table('employees')->where('id', $emp_id)->where('status_id', 20)->exists();
        if (!$isValidEmployee) {
            return DV::error("Employee ID {$emp_id} is not stay in resign.");
        }

        $existingBenefitDisbursement = DB::table('exit_forms')
            ->where('emp_id', $emp_id)
            ->where('name', $inputs['name'])
            ->first();

        $id = saveData($ss, 'exit_forms', ['id' => $id], $inputs, [], 1, false);
        if ($id > 0) {
            // return DV::depends(1, ['exit_forms' => $inputs, 'id' => $id]);
        }

        return DV::depends($id, ['id' => $id], 'Save failed');
    }

    public function getExitFormPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_item = $d->item ?? null;

        $query = DB::table('exit_forms as ef')
            ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->where('emp.status_id', 20) // Filter employees with status_id 20
            ->select(
                'ef.id',
                'ef.emp_id',
                'ef.name as form_name',
                'emp.id as emp_id',
                'emp.name',
                'emp.email',
                'emp.position_id',
                'pos.title as position',
                'emp.photo_file_name as emp_photo'
            )
            ->orderBy('ef.id', 'desc');

        if ($search_item) {
            $query->where('ef.name', $search_item);
        }
        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('emp.name', 'LIKE', "%{$search_value}%")
                    ->orWhere('ef.name', 'LIKE', "%{$search_value}%");
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
        return DB::table('exit_forms as ef')
            ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->where('emp.status_id', 20)
            ->select(
                'ef.id',
                'ef.emp_id',
                'ef.name as name',
                'emp.id as emp_id',
                'emp.name as emp_name',
                'emp.email',
                'emp.position_id',
                'pos.title as position',
                'emp.photo_file_name as emp_photo'
            )
            ->orderBy('ef.id', 'desc')
            ->where('ef.id', $id)
            ->first();
    }

    public function deleteExitForm($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('exit_forms')->where('id', $id)->delete();

        return DV::depends($deleted, ['action' => 'deleted']);
    }

    public static function getFormOptions($id, $ss)
    {
        $exit_forms = $id ? self::getDetails($id, $ss) : null;

        return (object) [
            'employees' => GeneralSettings::options_employee(20, $ss),
            'exit_forms' => $exit_forms,
        ];
    }

    public function getExitFormList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('exit_forms as ef')
            ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
            ->where('emp.status_id', 20)
            ->select('ef.id', 'ef.name', 'emp.name as emp_name')
            ->where('ef.branch_id', $branch_id);

        if (!empty($d->search_value)) {
            $query->where('ef.name', 'LIKE', "%{$d->search_value}%");
        }

        return $query->get();
    }
}
