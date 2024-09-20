<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use App\Models\DBX;
use Illuminate\Pagination\LengthAwarePaginator;
class LeaveManagement
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'leave_managements';

    function getDefaultOptions()
    {
        //price_list_id =11 (Normal Condition)
        $data = (object) [
            'price_list_id' => self::getDefaultPriceList()->id,
            'cod' => 0,
            'cod_fee' => 0,
        ];
        return $data;
    }

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    //saveSender()
    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'position_id' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'durations' => '1|string|0-100',
            'permission_details' => '1|string|0-250',
            'action_id' => '1|number|default = 1',
            'photo' => '0|image',
        ];

        $res = validateObject($arr, $v_rule, true, ['photo' => GeneralSettings::$image_chars], $ss->lang );
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }
        $id = $res->id;
        $inputs = $res->values;
        $d = (object) $inputs;
        $photo = $d->photo ?? null; // Ensure photo is set

        unset($inputs['photo']);
        $leavemanagement_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'leave_managements', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('leave_managements as lm')->where('lm.id', $id)->value('lm.photo_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('leave_managements')->where('id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'leave_managements.photo_file_name']);
            return DV::depends(1, ['leave_managements' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save data');
    }

    function getLeaveManagementListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('leave_managements as lm')
            ->join('positions as pos', 'pos.id', '=', 'lm.position_id')
            ->join('action as a', 'a.id', '=', 'lm.action_id')
            ->selectRaw('lm.id,lm.name,lm.position_id,pos.name as position_name,lm.start_date,lm.end_date,lm.durations,lm.permission_details,a.name as action_name,lm.photo_file_name')
            ->where('lm.branch_id', $branch_id);

        if ($search_id) {
            $query->where('lm.id', $search_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = 'lm.name LIKE "%' . $search_value . '%" OR ' .
                          'pos.name LIKE "%' . $search_value . '%" OR ' .
                          'a.name LIKE "%' . $search_value . '%" OR ' .
                          'lm.permission_details LIKE "%' . $search_value . '%" OR ' .
                          'lm.durations LIKE "%' . $search_value . '%" OR ' .
                          'lm.start_date LIKE "%' . $search_value . '%" OR ' .
                          'lm.end_date LIKE "%' . $search_value . '%" OR ' .
                          'a.name LIKE "%' . $search_value . '%"';
             $query->whereRaw($str_search);
        }

        $count = $query->count();
        $query->orderBy('lm.id', 'asc');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->photo_file_name) {
              $row->image_url = self::getProfilePicture($row->id);
            }
            unset($row->photo_file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getProfilePicture($id)
    {
        $col_subs_id = DBX::getHex('lm.subs_id', 'subs_id');
        $row = DB::table('leave_managements as lm')->where('lm.id', $id)->selectRaw($col_subs_id . ',lm.branch_id,lm.photo_file_name')->first();
        $url = '';
        if ($row) {
           $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'leave_managements'], 'images') . $row->photo_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getDetails($id)
    {
        $row = DB::table('leave_managements as lm')
            ->join('positions as pos', 'pos.id', '=', 'lm.position_id')
            ->join('action as a', 'a.id', '=', 'lm.action_id')
            ->where('lm.id', $id)->first();

        if ($row) {
            $image_url = self::getProfilePicture($id);
        } else {
            $image_url = null;
        }

        return DB::table('leave_managements as lm')
            ->join('positions as pos', 'pos.id', '=', 'lm.position_id')
            ->join('action as a', 'a.id', '=', 'lm.action_id')
            ->selectRaw('lm.id,lm.name,lm.position_id,pos.name as position_name,lm.start_date,lm.end_date,lm.durations,lm.permission_details,a.name as action_name,? as image_url', [$image_url])
            ->where('lm.id', $id)->first();
    }



}
