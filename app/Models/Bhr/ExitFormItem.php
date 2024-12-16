<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExitFormItem
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
        return DB::table('exit_form_items')->where('id', $id)->selectRaw($cols)->first();
    }

    public function save($form_item,$ss,$arr)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'form_id' => '1|number',
            'check_point_id' => '1|number',
            'amount'=>'1|number',
            'remarks' => '0|string'
        ];
        $item = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        // Validate inputs
        $res = validateObject($arr, $v_rule, true, ['item' => $item], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $arr['emp_id'] ?? null;
        $form_id = $arr['form_id'] ?? null;

        // Check if emp_id exists in the resignations table
        $resignation = DB::table('resignations')
            ->where('emp_id', $emp_id)
            ->first();

        $isValidEmployee = DB::table('employees')->where('id', $emp_id)->where('status_id', 20)->exists();
        if (!$isValidEmployee) {
            return DV::error("Employee ID {$emp_id} is not stay in resign.");
        }

        // Check if effective_date has expired
        $currentDate = date('Y-m-d');
        if ($resignation->effective_date < $currentDate) {
            return DV::error("Employee ID {$emp_id} cannot create an exit item because their resignation effective date has expired.");
        }
        $id = saveData($ss, 'exit_form_items', ['id' => $id], $inputs, [], 1, false);
        if ($id > 0) {
            $check_point_id = $this->getProps($id, ['check_point_id']);
            if (!$check_point_id) {
                return DV::error('Item ID not found!');
            }
        }

        return DV::depends($id, ['id' => $id], 'Save failed');
    }



    public function getExitFormItemPaginate($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_item = $d->item ?? null;

        $query = DB::table('exit_form_items as efi')
            ->join('employees as emp', 'emp.id', '=', 'efi.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
            ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
            ->where('emp.status_id', 20)
            ->select(
                'efi.id',
                'efi.emp_id',
                'efi.check_point_id',
                'efi.form_id',
                'ef.name as form_name',
                'efi.amount',
                'efi.remarks',
                'cp.item_name as item_name',
                'cp.check_point_cat_id',
                'emp.id as emp_id',
                'emp.name',
                'emp.email',
                'emp.position_id',
                'pos.title as position',
                'emp.photo_file_name as emp_photo'
            )
            ->orderBy('efi.id', 'desc');

        if ($search_item) {
            $query->where('efi.check_point_id', $search_item);
        }
        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('emp.name', 'LIKE', "%{$search_value}%")
                    ->orWhere('cp.item_name', 'LIKE', "%{$search_value}%");
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
        return DB::table('exit_form_items as efi')
            ->join('employees as emp', 'emp.id', '=', 'efi.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
            ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
            ->where('emp.status_id', 20)
            ->select(
                'efi.id',
                'efi.emp_id',
                'efi.check_point_id',
                'efi.form_id',
                'ef.name as form_name',
                'efi.amount',
                'efi.remarks',
                'cp.item_name as item_name',
                'cp.check_point_cat_id',
                'emp.id as emp_id',
                'emp.name',
                'emp.email',
                'emp.position_id',
                'pos.title as position',
                'emp.photo_file_name as emp_photo'
            )
            ->orderBy('efi.id', 'desc')
            ->where('efi.id', $id)
            ->first();
    }

    public function deleteExitFormItem($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('exit_form_items')->where('id', $id)->delete();

        return DV::depends($deleted, ['action' => 'deleted']);
    }

    public static function getFormOptions($id, $ss)

    {
        $exit_form_items = $id ? self::getDetails($id, $ss) : null;

        return (object) [
            'employees' => GeneralSettings::options_employee(20, $ss),
            'check_points' => DB::table('check_points')->select('id', 'item_name')->get(),
            'exit_forms' => DB::table('exit_forms')->select('id', 'name')->get(),
            'check_point_categories' => DB::table('check_point_categories')->select('id', 'name')->get(),
            'exit_form_items' => $exit_form_items,
        ];
    }

    public function getExitFormItemList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $query = DB::table('exit_form_items as efi')
            ->select('efi.id', '')
            ->where('efi.branch_id', $branch_id);

        if (!empty($d->search_value)) {
            $query->where('efi.remarks', 'LIKE', "%{$d->search_value}%");
        }
        return $query->get();
    }
}
