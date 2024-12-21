<?php

namespace App\Models\Bhr;

use App\Models\DBX;
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

    public function save($exit_form, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number',
            'is_finished' => '1|choice|1,2|default=1',
        ];
        $remark = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['remarks' => $remark], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $emp_id = $inputs['emp_id'];

        if (!$id) {
            $existingExitForm = DB::table('exit_forms')
                ->where('emp_id', $emp_id)
                ->first();

            if ($existingExitForm) {
                return DV::error('This item already exists for the same employee. Please choose a different item.');
            }
        }

        if ($id) {
            $updated = DB::table('exit_forms')
            ->where('id', $id)
                ->update($inputs);

            if ($updated) {
                return DV::depends($id, ['id' => $id], 'Update successful');
            } else {
                return DV::error('Upda  te failed. Record may not exist or data is unchanged.');
            }
        } else {
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
        ->selectRaw(
            'ef.emp_id,
            ef.id,'.'
            ef.is_finished,
            emp.id as emp_id,
            emp.name as emp_name,
            br.name as branch_name,
            emp.email,
            emp.position_id,
            pos.title as position,
            emp.photo_file_name as emp_photo'
        )
            ->orderBy('ef.id', 'desc');

        if ($search_name) {
            $query->where('ei.name', $search_name);
        }

        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('emp.name', 'LIKE', "%{$search_value}%");
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
            ->selectRaw(
                'ef.emp_id,
            ef.id,
            ef.is_finished,
            emp.id as emp_id,
            emp.name as emp_name,
            br.name as branch_name,
            emp.email,
            emp.position_id,
            pos.title as position,
            emp.photo_file_name as emp_photo'
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
        $header_list = ['អ្នកទទួល ខុសត្រូវ', 'បរិយាយព័ត៌មានលំអិត', 'កាលបរិច្ឆេទត្រូវបានជម្រះ', 'ទឹកប្រាក់ទូទាត់', 'ចំណាំ'];
        $key_list = ['name', 'item', 'description', 'effective_date', 'amount', 'remarks'];
        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $data = (object) $arr;
        $campus_id = $data->campus_id ?? null;
        $branch_id = $data->branch_id ?? $campus_id;
        $emp_id = $data->emp_id ?? null;
        $branch_ids = getAccessBranches($ss, $branch_id);
        $start_date = isset($data->start_date) ? convertDate($data->start_date) : date('Y-m-01');
        $end_date = isset($data->end_date) ? convertDate($data->end_date) : date('Y-m-t');
        $date_condition = $start_date && $end_date ? "DATE(emp.created_at) BETWEEN '$start_date' AND '$end_date'" : '';

        $col_start_date = DBX::formatDate('emp.joining_date', 'joining_date');
        $col_effective_date = DBX::formatDate('r.effective_date', 'effective_date');

        $query = DB::table('exit_forms as ef')
        ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
        ->join('positions as pos', 'pos.id', '=', 'emp.position_id')
        ->join('um_branches as br', 'br.id', '=', 'emp.branch_id')
        ->join('resignations as r', 'r.emp_id', '=', 'ef.emp_id')
        ->where('emp.status_id', 20)
        ->selectRaw("
            ef.id,
            ef.emp_id,
            ef.is_finished,
            emp.id as emp_id,
            emp.name as employee_name,
            emp.code,
            $col_start_date,
            emp.position_id,
            emp.branch_id,
            br.name as branch_name,
            pos.title as position,
            emp.photo_file_name as emp_photo,
            $col_effective_date
        ")
        ->where('ef.emp_id', $emp_id);

        if (!empty($data->search_value)) {
            $query->where(function ($q) use ($data) {

                $q->where('emp.name', 'LIKE', "%{$data->search_value}%");
            });
        }

        $exitFormItems = $query->get();
        $check_point_categories = DB::table('check_point_categories')->selectRaw('id, name')->get();
        $exit_items = DB::table('check_points')->selectRaw('id, name, check_point_cat_id')->get();
        $forms = DB::table('exit_forms')->selectRaw('id, is_finished, emp_id')->where('emp_id', $emp_id)->first();

        // Ensure $forms is not null before proceeding
        $form_items = [];
        if ($forms) {
            $form_items = DB::table('exit_form_items')
            ->selectRaw('id, form_id, check_point_id as item_id')
            ->where('form_id', $forms->id)
            ->get();
        }

        $groupedData = [];
        $number_cat = [];

        foreach ($check_point_categories as $category) {
            foreach ($exit_items as $item) {
                if ($item->check_point_cat_id == $category->id) {
                    $check = '<svg style="width:10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>'; 

                    foreach ($form_items as $form_item) {
                        if ($form_item->item_id == $item->id) {
                            $check = '<svg style="width:10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>'; 
                            break;
                        }
                    }

                    $item->check = $check;
                    $groupedData[$category->id]['item'][] = $item;
                    $groupedData[$category->id]['name'] = $category->name;

                    if (!in_array($category->id, $number_cat)) {
                        $number_cat[] = $category->id;
                    }
                }
            }
        }



        $employeeData = $exitFormItems->map(function ($ef) {
            return [
                'emp_name' => $ef->employee_name,
                'position' => $ef->position,
                'code' => $ef->code,
                'joining_date' => $ef->joining_date,
                'branch_name' => $ef->branch_name,
                'effective_date' => $ef->effective_date,
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
