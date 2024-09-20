<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Department
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'departments';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'status_id' => '1|number|default = 1',
            'photo' => '0|image',
        ];

        $checkUnque = [
            "$branch_id|departments|name|id=id|text=Department already exists.",
        ];

        $res = validateObject($arr, $v_rule, true, ['photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnque);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }


        $id = $res->id;
        $inputs = $res->values;
        $d = (object) $inputs;
        $photo = $d->photo;

        unset($inputs['photo']);
        $department_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'departments', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('departments')->where('id', $id)->value('photo_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('departments')->where('id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'departments.photo_file_name']);
            return DV::depends(1, ['departments' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save data');
    }

    function getDepartmentListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_status_id = $d->status_id ?? null;

        $query = DB::table('departments as d')
            ->join('dep_status as da', 'da.id', '=', 'd.status_id')
            ->selectRaw('d.id, d.name, da.name as status, d.photo_file_name');

        if ($search_id) {
            $query->where('d.id', $search_id);
        }

        if ($search_status_id) {
            $query->where('d.status_id', $search_status_id);
        }

        if ($search_value) {
            $search_value = '%' . addcslashes($search_value, '%_') . '%';
            $query->where(function ($q) use ($search_value) {
                $q->where('d.name', 'like', $search_value)
                    ->orWhere('da.name', 'like', $search_value); // Search action name
            });
        }

        $count = $query->count('d.id');
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
        $col_subs_id = DBX::getHex('d.subs_id', 'subs_id');
        $row = DB::table('departments as d')->where('d.id', $id)->selectRaw($col_subs_id . ',d.branch_id,d.photo_file_name')->first();
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'departments'], 'images') . $row->photo_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getDetails($id, $ss)
    {
        $row = DB::table('departments as d')
            ->join('dep_status as da', 'da.id', '=', 'd.status_id')
            ->where('d.id', $id)->first();
        if ($row) {
            $image_url = self::getProfilePicture($id);
        } else {
            $image_url = null;
        }

        return DB::table('departments as d')
            ->join('dep_status as da', 'da.id', '=', 'd.status_id')
            ->selectRaw('d.id, d.name, da.name as status,? as image_url', [$image_url])
            ->where('d.id', $id)->first();

    }
    function deleteDepartment($id, $ss)
    {

        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Ensure $ss contains necessary data
        if (!isset($ss->branch_id) || !isset($ss->subs_id)) {
            return DV::error('Invalid session data');
        }

        // Retrieve the file name associated with the profile
        $file_name = DB::table('departments')->where('id', $id)->value('photo_file_name');
        if ($file_name) {
            // Delete the file from the storage
            PublicStorage::delete([
                'branch_id' => null,
                'subs_id' => $ss->subs_id,
                'dir' => self::$img_dir,
            ], 'images', $file_name);
        }

        // Update the profile to remove the photo file name
        DB::table('departments')->where('id', $id)->update(['photo_file_name' => null]);

        // Delete the profile
        $deleted = DB::table('departments')->where('id', $id)->delete();

        // Check if the query was successful
        if (!$deleted) {
            return DV::error('Department not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

    function getFormOptions($id, $ss)
    {
        $department = null;
        if ($id) {
            $department = self::getDetails($id, $ss);
        }
        return (object) [

            'status' => DB::table('dep_status')->selectRaw('id,name')->get(),


            'departments' => $department,
        ];

    }
}
