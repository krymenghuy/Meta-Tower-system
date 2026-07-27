<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use DV;
use Vsd\Vsloquent\VSModel;

class ExitForm extends VSModel
{
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    /** Active resigned/inactive employees (setResign uses 11; legacy data may use 20) */
    protected static function resignedStatusIds()
    {
        return [11, 20];
    }

    /** DB stores finished state in status_id; UI/API uses is_finished */
    protected static function mapFinishedInput(array &$inputs)
    {
        $inputs['status_id'] = (int) ($inputs['is_finished'] ?? 0);
        unset($inputs['is_finished']);
    }

    function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'name' => '1|string|0-250|text=name_required::@key;@max;@value',
            'emp_id' => '1|number',
            'is_finished' => '1|choice|0,1|default=0',
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];
        $res = DBX::validateObject($arr, $v_rule, true, ['name' => $pos_char], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $err = self::checkDuplicateName($res->values['name'], $id, $branch_id);
        if ($err) {
            return DV::error($err);
        }

        $inputs = $res->values;
        if (!$id) {
            $inputs['is_finished'] = 0;
        }
        $d = (object) $inputs;
        self::mapFinishedInput($inputs);

        $existingData = DB::table('exit_forms')->where('id', $id)->first();
        if ($existingData) {
            $existingDataArray = (array) $existingData;
            $unchanged = true;
            foreach ($inputs as $key => $value) {
                if (array_key_exists($key, $existingDataArray) && $existingDataArray[$key] != $value) {
                    $unchanged = false;
                    break;
                }
            }
            if ($unchanged) {
                return DV::error('No changes were made to the exit form.');
            }
        }

        $is_update = $id ? true : false;
        $id = DBX::saveData($ss, 'exit_forms', ['id' => $id], $inputs, [], 1, false);
        if ($id > 0) {
            if ($d->is_finished == 1 && $is_update) {
                DB::table('exit_form_items')->where('form_id', $id)->update(['status_id' => 1]);
            } elseif (!$d->is_finished) {
                if (self::hasUnfinishedItems($id)) {
                    DB::table('exit_forms')->where('id', $id)->update(['status_id' => 1]);
                } else {
                    self::createExitFormItems($id, $ss);
                }
            }
            $inputs['is_finished'] = $inputs['status_id'] ?? 0;
            return DV::depends($id, ['exit_forms' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving exit form');
    }

    static function checkDuplicateName($name, $id, $branch_id)
    {
        $query = DB::table('exit_forms')
            ->where('branch_id', $branch_id)
            ->where('name', $name);
        if ($id) {
            $query->where('id', '!=', $id);
        }
        if ($query->exists()) {
            return 'exit_form_name_already_exists';
        }
        return null;
    }

    static function createExitFormItems($form_id, $ss)
    {
        $is_finished = DB::table('exit_forms')->where('id', $form_id)->value('status_id');
        if ($is_finished == 1) {
            return;
        }
        DB::table('exit_form_items')->where('form_id', $form_id)->delete();
        $rows = DB::table('check_points as cp')
            ->join('check_point_categories as cc', 'cc.id', '=', 'cp.category_id')
            ->selectRaw('cp.id, cp.name as name, cp.category_id, cc.name as category, cc.id as category_id')
            ->get();
        foreach ($rows as $row) {
            $inputs = [
                'form_id' => $form_id,
                'name' => $row->name,
                'check_point_id' => $row->id,
                'status_id' => 0,
                'category' => $row->category,
                'category_id' => $row->category_id,
                'item_type' => $row->item_type ?? 'General',
                'amount' => 0,
            ];
            DBX::saveData($ss, 'exit_form_items', ['id' => null], $inputs, [], 1, false);
        }
    }

    /** Returns true when the form still has unchecked items */
    static function hasUnfinishedItems($id)
    {
        $q_status_id = DBX::ifNull('i.status_id', 0);
        $test = DB::table('exit_form_items as i')
            ->where('i.form_id', $id)
            ->whereRaw($q_status_id . '= 0')
            ->selectRaw('id')
            ->value('id');
        return $test ? true : false;
    }

    static function updateCheckboxItem($arr, $ss)
    {
        $d = (object) $arr;
        $exit_form_item_id = $d->id;
        $form_id = DB::table('exit_form_items as i')
            ->where('i.id', $exit_form_item_id)
            ->value('form_id');
        if ($exit_form_item_id && $form_id) {
            DB::table('exit_form_items as efi')
                ->where('efi.id', $exit_form_item_id)
                ->where('efi.form_id', $d->form_id)
                ->update(['status_id' => $d->status_id]);
            $is_finished = self::hasUnfinishedItems($form_id) ? 0 : 1;
            DB::table('exit_forms')->where('id', $form_id)->update(['status_id' => $is_finished]);
        }
        return DV::depends(1, 'success');
    }

    static function saveExitItem($arr = [], $item_id, $ss)
    {
        $id = $item_id;
        $v_rule = [
            'id' => '0|identity=1',
            'form_id' => '1|number',
            'check_point_id' => '1|number',
            'check_id' => '0|number',
            'status_id' => '0|number|default=1',
            'amount' => '0|number|default=0.00',
            'name' => '0|string|0-250',
            'category_id' => '1|number|exists=check_point_categories.id',
            'remarks' => '0|string|default=N/A',
            'item_type' => '0|choice|default=general',
            'currency_code' => '0|choice|KHR,USD|default=KHR',
        ];
        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];
        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $pos_char], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }
        $id = $id ?? $res->id ?? null;
        $inputs = $res->values;
        $id = DBX::saveData($ss, 'check_points', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, null, 'Failed to save checkpoint item');
    }

    function getExitFormListPaginate($arr, $ss)
    {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(emp.name LIKE '%" . $search_value . "%' OR ef.name LIKE '%" . $search_value . "%')";
        }

        $employeesWithStatus = DB::table('employees')
            ->whereIn('status_id', self::resignedStatusIds())
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
            ->where('ef.branch_id', $branch_id)
            ->whereIn('emp.status_id', self::resignedStatusIds())
            ->whereRaw($str_search)
            ->selectRaw(
                'ef.id,
                ef.emp_id,
                ef.name,
                ef.status_id as is_finished,
                emp.name as emp_name,
                br.name as branch_name,
                emp.email,
                emp.position_id,
                pos.name as position,
                emp.photo_file_name as emp_photo'
            )
            ->orderBy('ef.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('ef.id');
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
                $row->error_message = 'Resignation effective date has expired.';
            } else {
                $row->can_edit_exit_item = true;
            }
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $exitFormExist = DB::table('exit_forms')
            ->where('id', $id)
            ->exists();
        if (!$exitFormExist) {
            return DV::error('Exit form not found');
        }

        DB::table('exit_form_items')->where('form_id', $id)->delete();
        $deleted = DB::table('exit_forms')
            ->where('id', $id)
            ->delete();

        return DV::depends($deleted, null, 'Error deleting exit form');
    }

    static function getDetails($id, $ss)
    {
        $row = DB::table('exit_forms as ef')
            ->selectRaw('ef.id, ef.emp_id, ef.name, ef.status_id as is_finished')
            ->where('ef.id', $id)
            ->first();
        return $row;
    }

    static function getFormOptions($id, $ss)
    {
        $exit_forms = null;
        if ($id) {
            $exit_forms = self::getDetails($id, $ss);
        }
        $employees = GeneralSettings::options_employee(self::resignedStatusIds(), $ss);
        foreach ($employees as $row) {
            $row->image_url = Employee::profilePicture($row->id);
        }
        return (object) [
            'employees' => $employees,
            'exit_forms' => $exit_forms,
        ];
    }

    public function getCheckpoints($form_id)
    {
        $header_list = ['អ្នកទទួល ខុសត្រូវ', 'បរិយាយព័ត៌មានលំអិត', 'កាលបរិច្ឆេទត្រូវបានជម្រះ'];
        $key_list = ['name', 'item', 'cleared_date'];
        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        $col_start_date = DBX::formatDate('emp.joining_date', 'joining_date');
        $col_effective_date = DBX::formatDate('r.effective_date', 'effective_date');

        $exitForm = DB::table('exit_forms as ef')
            ->join('employees as emp', 'emp.id', '=', 'ef.emp_id')
            ->leftJoin('positions as pos', 'pos.id', '=', 'emp.position_id')
            ->leftJoin('um_branches as br', 'br.id', '=', 'emp.branch_id')
            ->leftJoin('resignations as r', 'r.emp_id', '=', 'ef.emp_id')
            ->where('ef.id', $form_id)
            ->selectRaw("
                ef.id,
                ef.name,
                ef.emp_id,
                ef.status_id as is_finished,
                ef.updated_at,
                emp.id as emp_id,
                emp.name as emp_name,
                emp.code,
                $col_start_date,
                emp.position_id,
                emp.branch_id,
                br.name as branch_name,
                pos.name as position,
                emp.photo_file_name as emp_photo,
                $col_effective_date
            ")
            ->first();

        if (!$exitForm) {
            return (object) [];
        }

        $check_point_categories = DB::table('check_point_categories')->selectRaw('id, name')->get();
        $exit_items = DB::table('exit_form_items as ef')
            ->join('check_points as cp', 'cp.id', '=', 'ef.check_point_id')
            ->where('ef.form_id', $form_id)
            ->selectRaw('ef.id, cp.name, cp.category_id, ef.status_id, ef.item_type, ef.amount, ef.remarks, ef.currency')
            ->get();

        $groupedData = [];
        foreach ($check_point_categories as $category) {
            $filtered_items = [];
            foreach ($exit_items as $item) {
                if ($item->category_id === $category->id) {
                    $filtered_items[] = $item;
                }
            }
            if (count($filtered_items) === 0) {
                continue;
            }
            $category->item_count = count($filtered_items);
            $category->items = $filtered_items;
            $groupedData[] = $category;
        }

        $employeeData = [
            'emp_name' => $exitForm->emp_name,
            'position' => $exitForm->position,
            'code' => $exitForm->code,
            'joining_date' => $exitForm->joining_date,
            'branch_name' => $exitForm->branch_name,
            'efective_date' => $exitForm->effective_date,
        ];

        return (object) [
            'title' => 'ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ',
            'headers' => $headers,
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
