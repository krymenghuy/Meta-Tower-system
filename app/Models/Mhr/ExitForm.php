<?php

namespace App\Models\Mhr;

use DBX;
use DV;
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
            'name' => '1|string|0-250',
            'emp_id' => '1|number',
            'is_finished' => '1|choice|0,1|default=0',
        ];
        $name = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];
        $checkUnique = ["$branch_id|exit_forms|name|id=id|text=Name already exists."];
        $res = DBX::validateObject($arr, $v_rule, true, ['name' => $name], $ss->lang, false, $checkUnique);

        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        if (!$id) $inputs['is_finished'] = 0;
        $d = (object)$inputs;

        $existingData = DB::table('exit_forms')->where('id', $id)->first(); //Hello Ratanak! do not select all fields if NOT necessary
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
        $id = DBX::saveData($ss, 'exit_forms', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            if ($d->is_finished == 1 && $is_update) {
                DB::table('exit_form_items')->where('form_id', $id)->update(['status_id' => 1]);
                //$check_points = DB::table('check_points')->selectRaw('id,name')->get();
                // foreach ($check_points as $check_point) {
                //     self::saveExitItem(['form_id' => $id, 'check_point_id' => $check_point->id,'', 'check_id' => 1], $ss);
                //     // DB::table('exit_form_items')->where('form_id', $id)->where('check_point_id', $check_point->id)->update(['status_id'=>1]);
                // }

            } else if (!$d->is_finished) {
                if (self::isFinished($id)) {
                    DB::table('exit_forms')->where('id', $id)->where('id', $id)->update(['is_finished' => 1]);
                } else {
                    //Copy all items from table "check_points" to table "exit_form_items", so that when user changes name of any items, the existing exit form is not affected
                    self::createExitFormItems($id, $ss);
                }
            }
            return DV::depends(1, ['exit_forms' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving exit form');
    }

    static function createExitFormItems($form_id, $ss)
    {
        $is_finished =  Db::table('exit_forms')->where('id', $form_id)->value('is_finished');
        if ($is_finished == 1) return;
        DB::table('exit_form_items')->where('form_id', $form_id)->delete();
        $rows = DB::table('check_points as cp')
            ->join('check_point_categories as cc', 'cc.id', '=', 'cp.category_id')
            ->selectRaw('cp.id,cp.name as name,cp.category_id, cc.name as category, cc.id as category_id')
            ->get();
        $success_cnt = 0;
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
            $new_id = DBX::saveData($ss, 'exit_form_items', ['id' => null], $inputs, [], 1, false);
            if ($new_id) $success_cnt++;
        }
    }

    /** Check if exit form is actually finished, by checking all its items status */
    static function isFinished($id)
    {
        $q_status_id = DBX::ifNull('i.status_id', 0);
        $test = DB::table('exit_form_items as i')->where('i.form_id', $id)->whereRaw($q_status_id . '= 0')->selectRaw('id')->value('id');
        return $test ? true : false;
    }

    static function updateCheckboxItem($arr, $ss)
    {
        $d = (object) $arr;
        $exit_form_item_id = $d->id;
        $form_id = DB::table('exit_form_items as i')->where('i.id', $exit_form_item_id)->value('form_id');      
         if ($exit_form_item_id && $form_id){
            DB::table('exit_form_items as efi')
            ->where('efi.id', $exit_form_item_id)
            ->where('efi.form_id', $d->form_id)
            ->update(['status_id'=>$d->status_id]);
            $is_finished = self::isFinished($form_id) ? 0 : 1;
            DB::table('exit_forms')->where('id', $form_id)->update(['is_finished' => $is_finished ]);

        };
        return DV::depends(1, "success");
    }

    static function saveExitItem($arr = [], $item_id, $ss)
    {
        $id = $item_id;
        //$branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'form_id' => '1|number',
            'check_point_id' => '1|number',
            'check_id' => '0|number',
            'status_id' => '0|number|default=1',  // Ensure a default value for status_id
            'amount' => '0|number|default=0.00',
            'name' => '0|string|0-250',
            'category_id' => '1|number|exists=check_point_categories.id',
            'remarks' => '0|string|default=N/A',
            'item_type' => '0|choice|default=general',
            'currency_code' => '0|choice|KHR,USD|default=KHR'
        ];

        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $pos_char], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }
        $id = $id  ?? $res->id ?? null;
        $inputs = $res->values;
        //$inputs['branch_id'] = $branch_id;
        $d = (object)$inputs;
        $id = DBX::saveData($ss, 'check_points', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, null, 'Failed to save cehckpoint item');

        // $checkPointName = DB::table('check_points')->where('id', $d->check_point_id)->value('name');
        // if ($checkPointName) {
        //     if (strpos($checkPointName, 'ប្រាក់') !== false || strpos($checkPointName, 'ការផាក') !== false) {
        //         $inputs['item_type'] = 'loan';
        //     } elseif (strpos($checkPointName, 'ឯកសារកម្ចី') !== false || strpos($checkPointName, 'សៀវភៅ') !== false || strpos($checkPointName, 'របាយការណ៍') !== false) {
        //         $inputs['item_type'] = 'document';
        //     } elseif (strpos($checkPointName, 'ផ្សេងៗ') !== false || strpos($checkPointName, 'មតិយោបល់') !== false) {
        //         $inputs['item_type'] = 'general';
        //     } else {
        //         $inputs['item_type'] = 'item';
        //     }
        // }

        // // Handling Checkbox State (status_id)
        // if (isset($arr['status_id']) && $arr['status_id'] == 'on') {
        //     // If checkbox is checked, set status_id to 1 (or appropriate value)
        //     $inputs['status_id'] = 1;
        // } else {
        //     // If checkbox is unchecked, set status_id to 0 (or appropriate value)
        //     $inputs['status_id'] = 0;
        // }

        // $isExist = DB::table('exit_form_items')
        // ->where('check_point_id', $d->check_point_id)
        //     ->where('form_id', $d->form_id)
        //     ->take(1)
        //     ->value('id');

        // if ($isExist) {
        //     $id = $isExist;
        // }

        // unset($inputs['check_id']);

        // if ($id) {
        //     DB::table('exit_form_items')->where('id', $id)->update(['status_id' => $d->status_id]);
        // } else {
        //     $id = DBX::saveData($ss, 'exit_form_items', [], $inputs, [], 0);
        //     if ($id <= 0) {
        //         return DV::error('Create failed.');
        //     }
        // }

        // // Update form status based on the items' status
        // $totalItems = DB::table('exit_form_items')
        // ->where('form_id', $d->form_id)
        //     ->count();

        // $checkedItems = DB::table('exit_form_items')
        // ->where('form_id', $d->form_id)
        //     ->where('status_id', 1)
        //     ->count();

        // $isFinished = $totalItems > 0 && $totalItems == $checkedItems ? 1 : 0;

        // DB::table('exit_forms')
        // ->where('id', $d->form_id)
        //     ->update(['is_finished' => $isFinished]);

        //return DV::depends(1, ['id' => $id, 'is_finished' => $isFinished], $id ? 'Update successful' : 'Create successful');
    }


    public function getList($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
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

    public function getCheckpoints($form_id)
    {
        $header_list = ['អ្នកទទួល ខុសត្រូវ', 'បរិយាយព័ត៌មានលំអិត', 'កាលបរិច្ឆេទត្រូវបានជម្រះ', 'ទឹកប្រាក់ទូទាត់', 'ចំណាំ'];
        $key_list = ['name', 'item', 'description', 'effective_date', 'amount', 'remarks'];
        $key_props = $this->createKeyValue('key', self::stringToKeyCase($key_list));
        $headers = $this->createMulKeyValue('name', $header_list, $key_props);

        //$campus_id = $data->campus_id ?? null;
        //$branch_id = $data->branch_id ?? $campus_id;
        //$emp_id = $data->emp_id ?? null;
        //$branch_ids = getAccessBranches($ss, $branch_id);
        // $start_date = isset($data->start_date) ? convertDate($data->start_date) : date('Y-m-01');
        // $end_date = isset($data->end_date) ? convertDate($data->end_date) : date('Y-m-t');
        //$date_condition = $start_date && $end_date ? "DATE(emp.created_at) BETWEEN '$start_date' AND '$end_date'" : '';

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
                ef.update_date,
                emp.id as emp_id,
                emp.name as emp_name,
                emp.code,
                $col_start_date,
                emp.position_id,
                emp.branch_id,
                br.name as branch_name,
                pos.title as position,
                emp.photo_file_name as emp_photo,
                $col_effective_date
            ")
            ->where('ef.id', $form_id);

        // **** WHY you need search value for this function ???
        // if (!empty($data->search_value)) {
        //     $query->where(function ($q) use ($data) {

        //         $q->where('emp.name', 'LIKE', "%{$data->search_value}%");
        //     });
        // }

        $exitForm = $query->first();
        if (!$exitForm) {
            return (object)[];
        }
        $check_point_categories = DB::table('check_point_categories')->selectRaw('id, name')->get();
        $exit_items = DB::table('exit_form_items as ef')
            ->join('check_points as cp', 'cp.id', '=', 'ef.check_point_id')
            ->where('ef.form_id', $form_id)
            ->selectRaw('ef.id, cp.name, cp.category_id, ef.status_id, ef.item_type, ef.amount, ef.remarks, ef.currency')
            ->get();
        // $form = DB::table('exit_forms')->selectRaw('id, emp_id')->where('id', $form_id)->first(); //WHY YOU NEED THIS Query again?

        // $form_items = [];
        //if ($form) {
        // $form_items = DB::table('exit_form_items')
        //     ->selectRaw('id, form_id, check_point_id as item_id, status_id, item_type, amount, currency, remarks')
        //     ->where('form_id', $form_id)
        //     ->where('status_id', 1)
        //     ->get();
        //}

        $groupedData = [];
        $number_cat = [];

        foreach ($check_point_categories as $category) {
            $cat_id = $category->id;
            $filtered_items = [];
            foreach ($exit_items as $item) {
                if ($item->category_id === $cat_id)
                    $filtered_items[] = $item;
            }

            // \Log::info(json_encode($filtered_items));


            $category->item_count = count($filtered_items);
            $category->items = $filtered_items;
            $groupedData[] = $category;

            // $groupedData['category_id'] = $category->id;
            // foreach ($exit_items as $item) {
            //     // if ($item->category_id == $category->id) {

            //     //     // foreach ($form_items as $form_item) {
            //     //     // if ($form_item->item_id == $item->id) {
            //     //     // $item->item_type = $item->item_type;
            //     //     // $item->amount = $item->amount;
            //     //     // $item->remarks = $item->remarks;
            //     //     // $item->currency = $item->currency;
            //     //     // break;                        // }
            //     //     // }

            //     //     // $groupedData['category_id'] = $category->id;
            //     //     // $groupedData[$category->id]['items'][] = $item;

            //     //     if (!in_array($category->id, $number_cat)) {
            //     //         $number_cat[] = $category->id;
            //     //     }
            //     // }
            // }
        }

        $employeeData = [
            'emp_name' => $exitForm->emp_name,
            'position' => $exitForm->position,
            'code' => $exitForm->code,
            'joining_date' => $exitForm->joining_date,
            'branch_name' => $exitForm->branch_name,
            'efective_date' => $exitForm->effective_date,
        ];

        $title = 'ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ';
        return (object) [
            'title' => $title,
            'headers' => $headers,
            'num_cat' => $number_cat,
            'list' => $groupedData,
            'employee' => $employeeData,
        ];
    }

    public static function objectToArray($obj)
    {
        return json_decode(json_encode($obj), true);
        // if (is_object($obj)) {
        //     $obj = get_object_vars($obj);
        // }
        // if (is_array($obj)) {
        //     return array_map('objectToArray', $obj);
        // }
        // return $obj;
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
