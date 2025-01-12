<?php

namespace App\Models\Bhr;

use App\Models\DBX;
use App\Models\DV;
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
    public function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-250',
            'emp_id' => '1|number',
            'is_finished' => '1|choice|0,1|default=0',
        ];
        $name = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];
        $checkUnique = ["$branch_id|exit_forms|name|id=id|text=Name already exists."];
        $res = validateObject($arr, $v_rule, true, ['name' => $name], $ss->lang, false, $checkUnique);

        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $id = $res->id;
        $d = (object)$inputs;

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

        $id = saveData($ss, 'exit_forms', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            if ($d->is_finished == 1) {
                $check_points = DB::table('check_points')->selectRaw('id,name')->get();
                foreach ($check_points as $check_point) {
                    self::saveExitItem(['form_id' => $id, 'check_point_id' => $check_point->id, 'status_id' => 1, 'check_id' => 1], $ss);
                    // DB::table('exit_form_items')->where('form_id', $id)->where('check_point_id', $check_point->id)->update(['status_id'=>1]);
                }
            } else {
                $check_points = DB::table('check_points')->selectRaw('id,name')->get();
                foreach ($check_points as $check_point) {
                    DB::table('exit_form_items')->where('form_id', $id)->where('check_point_id', $check_point->id)->update(['status_id' => 0]);
                }
            }
            return DV::depends(1, ['exit_forms' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving exit form');
    }

    static function saveExitItem($arr = [], $ss = null)
    {
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'form_id' => '1|number',
            'check_point_id' => '1|number',
            'check_id' => '0|number',
            'status_id' => '0|number|default=1',
            'amount' => '0|number|default=00',
            'remarks' => '0|string|default=N/A',
            'item_type' => '0|choice|default=general',
            'currency' => '0|choice|KHR,USD|default=KHR'
        ];

        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['remarks' => $pos_char], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;
        $inputs['branch_id'] = $branch_id;
        $d = (object)$inputs;

        $checkPointName = DB::table('check_points')->where('id', $d->check_point_id)->value('name');
        if ($checkPointName && (strpos($checkPointName, 'ប្រាក់') !== false || strpos($checkPointName, 'ការផាក') !== false)) {
            $inputs['item_type'] = 'loan';
        } elseif ($checkPointName && (strpos($checkPointName, 'ឯកសារកម្ចី') !== false || strpos($checkPointName, 'សៀវភៅ') !== false || strpos($checkPointName, 'របាយការណ៍') !== false)) {
            $inputs['item_type'] = 'document';
        } elseif ($checkPointName && (strpos($checkPointName, 'ផ្សេងៗ') !== false || strpos($checkPointName, 'មតិយោបល់') !== false)) {
            $inputs['item_type'] = 'general';
        } else {
            $inputs['item_type'] = 'item';
        }

        $isExist = DB::table('exit_form_items')
        ->where('check_point_id', $d->check_point_id)
            ->where('form_id', $d->form_id)
            ->take(1)
            ->value('id');

        if ($isExist) {
            $id = $isExist;
        }

        unset($inputs['check_id']);

        if ($id) {
            DB::table('exit_form_items')->where('id', $id)->update(['status_id' => $d->status_id]);
        } else {
            $id = saveData($ss, 'exit_form_items', [], $inputs, [], 0);
            if ($id <= 0) {
                return DV::error('Create failed.');
            }
        }

        $totalItems = DB::table('exit_form_items')
        ->where('form_id', $d->form_id)
            ->count();

        $checkedItems = DB::table('exit_form_items')
        ->where('form_id', $d->form_id)
            ->where('status_id', 1)
            ->count();

        $isFinished = $totalItems > 0 && $totalItems == $checkedItems ? 1 : 0;

        DB::table('exit_forms')
        ->where('id', $d->form_id)
            ->update(['is_finished' => $isFinished]);

        return DV::depends(1, ['id' => $id, 'is_finished' => $isFinished], $id ? 'Update successful' : 'Create successful');
    }


    public function getList($arr, $ss = null)
    {
        $d = (object) $arr;
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
                'ef.id,
                ef.emp_id,
                ef.name,
                emp.id as emp_id,
                ef.is_finished,
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
                '
                ef.id,
                ef.emp_id,
                ef.name,
                ef.is_finished,
                emp.id as emp_id,
                emp.name as emp_name,
                br.name as branch_name,
                emp.email,
                emp.position_id,
                pos.title as position,
                emp.photo_file_name as emp_photo'
            )
            ->where('ef.id', $id)->get()->first();

        return $details;
    }


    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $deleted = DB::table('exit_forms')->where('id', $id)->delete();

        return DV::depends($deleted, null, 'Error deleting the exit form');
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
                ef.name,
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
        $forms = DB::table('exit_forms')->selectRaw('id, emp_id')->where('emp_id', $emp_id)->first();

        $form_items = [];
        if ($forms) {
            $form_items = DB::table('exit_form_items')
                ->selectRaw('id, form_id, check_point_id as item_id, item_type, amount, currency, remarks')
                ->where('form_id', $forms->id)
                ->where('status_id', 1)
                ->get();
        }

        $groupedData = [];
        $number_cat = [];

        foreach ($check_point_categories as $category) {
            foreach ($exit_items as $item) {
                if ($item->check_point_cat_id == $category->id) {
                    $item->check = '<input data-id="' . $item->id . '" type="checkbox" value="check_point_id" onclick="check_box(event)" >';

                    foreach ($form_items as $form_item) {
                        if ($form_item->item_id == $item->id) {
                            $item->check = '<input data-id="' . $item->id . '" type="checkbox" value="check_point_id" checked onclick="check_box(event)" >';
                            $item->item_type = $form_item->item_type;
                            $item->amount = $form_item->amount;
                            $item->remarks = $form_item->remarks;
                            $item->currency = $form_item->currency;
                            break;
                        }
                    }

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
        // $count = count($arr);

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
