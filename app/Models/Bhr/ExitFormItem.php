<?php

namespace App\Models\Bhr;

use App\Models\DBX;
use App\Models\DV;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    public function save($form_item, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'form_id' => '1|number',
            'check_point_id' => '1|number',
            'amount' => '1|number',
            'remarks' => '0|string',
            'is_settled' =>'1|choice|1,2,3|default=1',
            'item_type' =>'1|choice|1,2,3|default=1'
        ];

        $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        // $emp_id = $arr['emp_id'] ?? null;
        $form_id = $arr['form_id'] ?? null;
        $subs_id = $arr['subs_id'] ?? null;
        $inputs['subs_id'] = $subs_id;
        $inputs['branch_id'] = $branch_id;

        // $resignation = DB::table('resignations')
        // ->where('emp_id', $emp_id)
        //     ->first();

        // if (!$resignation) {
        //     return DV::error("Resignation record not found for Employee ID {$emp_id}.");
        // }

        // $isValidEmployee = DB::table('employees')->where('id', $emp_id)->where('status_id', 20)->exists();
        // if (!$isValidEmployee) {
        //     return DV::error("Employee ID {$emp_id} is not active for resignation.");
        // }

        $currentDate = date('Y-m-d');
        // if ($resignation->effective_date < $currentDate) {
        //     return DV::error("Employee ID {$emp_id} cannot create or edit an exit item because their resignation effective date has expired.");
        // }

        if (!$id) {
            $existingExitItem = DB::table('exit_form_items')
            // ->where('emp_id', $emp_id)
                ->where('check_point_id', $inputs['check_point_id'])
                ->first();

            // if ($existingExitItem) {
            //     return DV::error("An exit form item already exists for Employee ID {$emp_id}.");
            // }
        }
        if ($id) {
            $updated = DB::table('exit_form_items')
            ->where('id', $id)
            ->update($inputs);

            if ($updated) {
                return DV::depends($id, ['id' => $id], 'Update successful');
            } else {
                return DV::error('Update failed. Record may not exist or data is unchanged.');
            }
        } else {
            $newId = DB::table('exit_form_items')->insertGetId($inputs);

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
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        $search_item = $d->item ?? null;

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

        $query = DB::table('exit_form_items as efi')
        ->join('employees as emp', 'emp.id', '=', 'efi.emp_id')
        ->join('um_branches as br', 'br.id', '=', 'emp.branch_id')
        ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
        ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
        ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
        ->where('emp.status_id', 20)
        ->selectRaw(
            'efi.id,
            efi.emp_id,
            efi.check_point_id,
            efi.form_id,
            ef.name as form_name,
            efi.amount,
            efi.remarks,
            cp.name as item_name,
            cp.check_point_cat_id,
            emp.id as emp_id,
            emp.name,
            emp.code,
            emp.branch_id,
            br.name as branch_name,
            emp.email,
            emp.position_id,
            pos.title as position,
            emp.photo_file_name as emp_photo'
        )
            ->orderBy('efi.id', 'desc');

        if ($branch_id) {
            $query->where('efi.branch_id', $branch_id);
        }

        if ($search_item) {
            $query->where('efi.check_point_id', $search_item);
        }

        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('emp.name', 'LIKE', "%{$search_value}%")
                ->orWhere('cp.name', 'LIKE', "%{$search_value}%");
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
        $details = DB::table('exit_form_items as efi')
            ->join('employees as emp', 'emp.id', '=', 'efi.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
            ->join('um_branches as br', 'br.id', '=', 'emp.branch_id')
            ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
            ->where('emp.status_id', 20)
            ->where('efi.id', $id)
            ->selectRaw(
                'efi.id,
                efi.emp_id,
                efi.check_point_id,
                efi.form_id,
                ef.name as form_name,
                efi.amount,
                efi.remarks,
                cp.name as item_name,
                cp.check_point_cat_id,
                emp.id as emp_id,
                emp.joining_date as start_date,
                emp.name,
                emp.email,
                emp.code,
                emp.position_id,
                br.name as branch_name,
                pos.title as position,
                emp.photo_file_name as emp_photo'
            )
            ->orderBy('efi.id', 'desc')
            ->first();

        if (!$details) {
            return null;
        }
        $resignation = DB::table('resignations')
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
            'check_points' => DB::table('check_points')->select('id', 'name')->get(),
            'exit_forms' => DB::table('exit_forms')->select('id', 'name')->get(),
            'check_point_categories' => DB::table('check_point_categories')->select('id', 'name')->get(),
            'exit_form_items' => $exit_form_items,
        ];
    }

    public function getAllList($arr, $ss = null)
    {
        $header_list = ['អ្នកទទួល ខុសត្រូវ', 'បរិយាយព័ត៌មានលំអិត', 'កាលបរិច្ឆេទត្រូវបានជម្រះ', 'ទឹកប្រាក់ទូទាត់', 'ចំណាំ'];
        $key_list = ['name', 'item', 'description', 'effective_date', 'amount', 'remarks'];
        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $d = (object) $arr;
        $campus_id = $d->campus_id ?? null;
        $branch_id = $d->branch_id ?? $campus_id;
        $emp_id = $d->emp_id ?? null;
        $branch_ids = getAccessBranches($ss, $branch_id);
        $start_date = isset($d->start_date) ? convertDate($d->start_date) : date('Y-m-01');
        $end_date = isset($d->end_date) ? convertDate($d->end_date) : date('Y-m-t');
        $str_between_date = $start_date && $end_date ? "DATE(emp.created_at) BETWEEN '$start_date' AND '$end_date'" : '';
        $col_start_date = DBX::formatDate('emp.joining_date', 'joining_date');
        $col_effective_date = DBX::formatDate('r.effective_date', 'effective_date');

        $query = DB::table('exit_form_items as efi')
        ->join('employees as emp', 'emp.id', '=', 'efi.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
        ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
        ->join('um_branches as br', 'br.id', '=', 'emp.branch_id')
        ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
        ->join('resignations as r', 'r.emp_id', '=', 'efi.emp_id')
        ->where('emp.status_id', 20)
        ->selectRaw(
            'efi.id,
            efi.emp_id,
            efi.check_point_id,
            efi.form_id,
            ef.name as form_name,
            efi.amount,
            efi.remarks,
            efi.settled,
            cp.item_name as item_name,
            cp.check_point_cat_id,
            emp.id as emp_id,
            emp.name as employee_name,
            emp.code,
            '.$col_start_date.',
            emp.position_id,
            emp.branch_id,
            br.name as branch_name,
            pos.title as position,
            emp.photo_file_name as emp_photo,
            '.$col_effective_date.''
        )
            ->where('efi.emp_id', $emp_id);

        if (!empty($d->search_value)) {
            $query->where(function ($q) use ($d) {
                $q->where('efi.remarks', 'LIKE', "%{$d->search_value}%")
                ->orWhere('emp.name', 'LIKE', "%{$d->search_value}%");
            });
        }

        $exitFormItems = $query->get();

        $check_point_category = DB::table('check_point_categories')->selectRaw('id, name')->get();
        $check_point = DB::table('check_points')->selectRaw('id, name, check_point_cat_id')->get();
        $form_item = DB::table('exit_form_items')->selectRaw('id, check_point_id, emp_id')->get()->where('emp_id', $emp_id);

        $groupedData = [];
        $number_cat = [];

        foreach ($check_point_category as $cat) {
            foreach ($check_point as $point_item) {
                if ($point_item->check_point_cat_id == $cat->id) {
                    foreach ($form_item as $item) {
                        if ($item->check_point_id == $point_item->id) {
                            $groupedData[$cat->id]['name'] = $cat->name;
                            $groupedData[$cat->id]['item'][] = $point_item;

                            if (!in_array($cat->id, $number_cat)) {
                                $number_cat[] = $cat->id;
                            }
                        }
                    }
                }
            }
        }

        // Modify the employee data mapping to include the effective_date
        $employeeData = $exitFormItems->map(function ($efi) {
            return [
                'emp_name' => $efi->employee_name,
                'position' => $efi->position,
                'code' => $efi->code,
                'joining_date' => $efi->joining_date,
                'branch_name' => $efi->branch_name,
                'effective_date' => $efi->effective_date,  // Include the effective_date
            ];
        });

        $title = 'ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ';

        return (object) [
            'title' => $title,
            'header' => $headers,
            'num_cat' => $number_cat,
            'list' => $groupedData,
            'employee' => $employeeData,
        ];
    }


    function createKeyValue($key_name, $arr)
    {
        $result = [];
        foreach ($arr as $d) {
            $result[] = [$key_name => $d];
        }
        return $result;
    }
    static function stringToKeyCase($cnvtString, $exit_form_string = null, $front = 1)
    {

        $removeSpecialChars = function ($str) {
            $pattern = '/[^a-zA-Z0-9\s' . preg_quote('_', '/') . ']/u';
            return preg_replace($pattern, '', $str);
        };
        $exit_form_string = $removeSpecialChars(strtolower($exit_form_string));
        if (is_array($cnvtString)) {

            $result = [];
            foreach ($cnvtString as $string) {
                $string = $removeSpecialChars($string);
                $convertedString = strtolower(str_replace(' ', '_', $string));

                if ($exit_form_string) {
                    $result[] = $front == 1 ? $exit_form_string . '_' . $convertedString : $convertedString . '_' . $exit_form_string;
                } else {
                    $result[] = $convertedString;
                }
            }
            return $result;
        }
        $cnvtString = $removeSpecialChars($cnvtString);
        $convertedString = strtolower(str_replace(' ', '_', $cnvtString));

        if ($exit_form_string) {
            return $front == 1 ? $exit_form_string . '_' . $convertedString : $convertedString . '_' . $exit_form_string;
        }
        return $convertedString;
    }
    function createMulKeyValue($key_name, $arr, $bonus_data = null)
    {
        $result = [];
        $count = count($arr);

        foreach ($arr as $index => $header) {
            $headerData = [$key_name => $header];

            if (isset($bonus_data[$index])) {
                foreach ($bonus_data[$index] as $bonus_key => $bonus_value) {
                    $headerData[$bonus_key] = $bonus_value;
                }
            }

            $result[] = $headerData;
        }
        return $result;
    }

}
