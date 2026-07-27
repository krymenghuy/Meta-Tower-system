<?php

namespace App\Models\Mhr;

use DV;
use DBX;
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

    public function save($form_item, $ss, $arr)
    {
        $id = $this->id ?? ($arr['id'] ?? null);
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'form_id' => '1|number',
            'check_point_id' => '1|number',
            'amount' => '0|number',
            'remarks' => '0|string',
            'item_type' => '0|choice|1,2,3,4|default=general',
            'currency' => '1|choice|KHR,USD|default=KHR'
        ];

        $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $form_id = $arr['form_id'] ?? null;
        $subs_id = $arr['subs_id'] ?? null;
        $inputs['subs_id'] = $subs_id;
        $inputs['branch_id'] = $branch_id;

        $existingItemQuery = DB::table('exit_form_items')
        ->where('form_id', $inputs['form_id'])
        ->where('check_point_id', $inputs['check_point_id']);

        if ($id) {
            $existingItemQuery->where('id', '!=', $id);
        }

        $existingItem = $existingItemQuery->first();

        if ($existingItem) {
            return DV::error('Duplicate check_point_id in the same form is not allowed.');
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

        $currentDate = date('Y-m-d');

        $query = DB::table('exit_form_items as efi')
        ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
        ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
        ->selectRaw(
            'efi.id,
            efi.check_point_id,
            efi.form_id,
            efi.currency,
            ef.name as form_name,
            efi.amount,
            efi.remarks,
            efi.item_type,
            efi.status_id,
            cp.name as item_name,
            cp.category_id',
        )
            ->orderBy('efi.id', 'desc');


        if ($search_item) {
            $query->where('efi.check_point_id', $search_item);
        }

        if (!empty($d->search_value)) {
            $search_value = $d->search_value;
            $query->where(function ($q) use ($search_value) {
                $q->where('cp.name', 'LIKE', "%{$search_value}%");
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
        $details = DB::table('exit_form_items as efi')
            ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
            ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
            ->where('efi.id', $id)
            ->selectRaw(
                'efi.id,

                efi.check_point_id,
                efi.form_id,
                efi.currency,
                ef.name as form_name,
                efi.amount,
                efi.remarks,
                efi.item_type,
                efi.status_id,
                cp.name as item_name,
                cp.category_id',

            )
            ->orderBy('efi.id', 'desc')
            ->first();

        if (!$details) {
            return null;
        }
        $details->effective_date = $resignation->effective_date ?? null;

        $details->image_url = '';
        if (!empty($details->emp_id) && $details->emp_photo) {
            $details->image_url = Employee::profilePicture($details->emp_id);
        }

        return $details;
    }

    public function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $deleted = DB::table('exit_form_items')->where('id', $id)->delete();

        return DV::depends($deleted,null,'Error deleting the exit form item');
    }

    public static function getFormOptions($id, $ss)

    {
        $exit_form_items = $id ? self::getDetails($id, $ss) : null;

        return (object) [
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

        $query = DB::table('exit_form_items as efi')
            ->join('check_points as cp', 'cp.id', '=', 'efi.check_point_id')
            ->join('exit_forms as ef', 'ef.id', '=', 'efi.form_id')
            ->selectRaw(
            'efi.id,

            efi.check_point_id,
            efi.form_id,
            efi.amount,
            efi.remarks,
            efi.status_id,
            cp.name as item_name,
            cp.category_id'
            );
        if (!empty($d->search_value)) {
            $query->where(function ($q) use ($d) {
                $q->where('efi.remarks', 'LIKE', "%{$d->search_value}%");
            });
        }

        $exitFormItems = $query->get();

        $check_point_categories = DB::table('check_point_categories')->selectRaw('id, name')->get();
        $exit_items = DB::table('check_points')->selectRaw('id, name, category_id')->get();
        $form_item = DB::table('exit_form_items')->selectRaw('id, check_point_id')->get();
        $forms = DB::table('exit_forms')->selectRaw('id, status_id as is_finished, emp_id')->where('emp_id', $emp_id)->first();

        $groupedData = [];
        $number_cat = [];
        $form_items = [];
        if ($forms) {
            $form_items = DB::table('exit_form_items')
            ->selectRaw('id, form_id, check_point_id as item_id')
            ->where('form_id', $forms->id)
                ->get();
        }
        foreach ($check_point_categories as $category) {
            foreach ($exit_items as $item) {
                if ($item->category_id == $category->id) {
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

        $title = 'ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ';

        return (object) [
            'title' => $title,
            'header' => $headers,
            'num_cat' => $number_cat,
            'list' => $groupedData,
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
