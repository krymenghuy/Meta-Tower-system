<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExitForm //extends Model
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

    public function save($exit_form, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string',
            'emp_id' => '1|number',
            'amount' => '0|number',
            'remarks' => '0|number',
            'status' => '1|choice|1,2|default=1',
        ];
        $name = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['name' => $name], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $arr['emp_id'] ?? null;

        // Check for existing name only if it's a new record (not an update)
        if (!$id) {
            $existingExitForm = DB::table('exit_forms')
            ->where('name', $inputs['name'])
            ->first();

            if ($existingExitForm) {
                return DV::error('The name already exists. Please choose a different name.');
            }
        }
        
        if ($id) {
            // Update existing exit form
            $updated = DB::table('exit_forms')
            ->where('id', $id)
                ->update($inputs);

            if ($updated) {
                return DV::depends($id, ['id' => $id], 'Update successful');
            } else {
                return DV::error('Update failed. Record may not exist or data is unchanged.');
            }
        } else {
            // Insert a new exit form
            $newId = DB::table('exit_forms')->insertGetId($inputs);

            if ($newId) {
                return DV::depends($newId, ['id' => $newId], 'Create successful');
            } else {
                return DV::error('Create failed.');
            }
        }
    }



    public function getList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_name = $d->name ?? null;

        $employeesWithStatus = DB::table('employees')
        ->where('status_id', 20)
        ->pluck('id');

        if ($employeesWithStatus->isEmpty()) {
            return new LengthAwarePaginator([], 0, $per_page, $current_page);
        }
        $resignations = DB::table('resignations')
        ->whereIn('emp_id', $employeesWithStatus)
            ->get()
            ->keyBy('emp_id');

        $currentDate = date('Y-m-d');

        $query = DB::table('exit_forms as ef')
        ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
        ->join('um_branches as br', 'br.id', '=', 'emp.branch_id')
        ->where('emp.status_id', 20)
        ->select(
            'ef.emp_id',
            'ef.id',
            'ef.name as name',
            'ef.amount',
            'ef.remarks',
            'ef.status',
            'emp.id as emp_id',
            'emp.name as emp_name',
            'br.name as branch_name',
            'emp.email',
            'emp.position_id',
            'pos.title as position',
            'emp.photo_file_name as emp_photo'
        )
            ->orderBy('ef.id', 'desc');

        if ($search_name) {
            $query->where('ef.name', $search_name);
        }

        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('emp.name', 'LIKE', "%{$search_value}%")
                ->orWhere('ef.name', 'LIKE', "%{$search_value}%");
            });
        }

        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (!empty($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);

            $resignation = $resignations->get($row->emp_id);
            $row->effective_date = $resignation->effective_date ?? null;

            if ($resignation && $resignation->effective_date < $currentDate) {
                $row->can_edit_exit_item = false;
                $row->error_message = "Resignation effective date has expired.";
            } else {
                $row->can_edit_exit_item = true;
            }
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    public static function getDetails($id, $ss)
    {
        $details = DB::table('exit_forms as ef')
        ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
        ->join('um_branches as br', 'br.id', '=', 'emp.branch_id')
        ->where('emp.status_id', 20)
        ->where('ef.id', $id)
            ->select(
                'ef.id',
                'ef.emp_id',
                'ef.name as name',
                'ef.amount',
                'ef.status',
                'ef.remarks',
                'emp.id as emp_id',
                'emp.name as emp_name',
                'emp.email',
                'emp.joining_date as start_date',
                'emp.position_id',
                'emp.branch_id',
                'br.name as branch_name',
                'emp.code',
                'pos.title as position',
                'emp.photo_file_name as emp_photo'
            )
            ->orderBy('ef.id', 'desc')
            ->first();

        if (!$details) {
            return null;
        }

        $resignation = DB::table('resignations as res')
        ->where('emp_id', $details->emp_id)
            ->select('effective_date')
            ->first();

        $details->effective_date = $resignation->effective_date ?? null;

        $details->image_url = '';
        if (!empty($details->emp_id) && $details->emp_photo) {
            $details->image_url = Employee::profilePicture($details->emp_id);
        }

        unset($details->emp_photo);
        $currentDate = date('Y-m-d');
        $details->can_edit_exit_item = true;
        if ($resignation && $resignation->effective_date < $currentDate) {
            $details->can_edit_exit_item = false;
            $details->error_message = "Resignation effective date has expired.";
        }

        return $details;
    }


    public function delete($id = null)
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
