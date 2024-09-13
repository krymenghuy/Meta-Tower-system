<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Skill
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'skills';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'title' => 'required|string|max:100',
            'description' => 'nullable|string|max:250',
            'image' => 'nullable|image',
        ];
        $checkUnique = [
            "$branch_id|skills|title|id=id|text=Skill already exists by title",
        ];
        $res = validateObject($arr, $v_rule, true, ['image' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnique);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }
        $id = $res->id;
        $inputs = $res->values;
        $d = (object) $inputs;
        $image = $d->image;

        unset($inputs['image']);
        $skill_create = !$id;

        $delete_prev_image = ($id > 0 && (!$image || isImage($image)));
        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'skills', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            $count_member = DB::table('skills')->count('id');
            if ($count_member > 0) {
                DB::table('skills')->update(['count_member' => $count_member]);
            }
            if ($delete_prev_image) {
                $file_name = DB::table('skills')->where('id', $id)->value('image_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }
                DB::table('skills')->where('id', $id)->update(['image_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $image, null, ['id' => $id, 'store' => 'skills.image_file_name']);
            return DV::depends(1, ['skills' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getSkills($arr, $ss)
    {
        $d = (object) $arr;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        $query = DB::table('skills as s')
            ->selectRaw('s.id, s.title, s.description, s.image_file_name, s.count_member')
            ->where('s.branch_id', $ss->branch_id);
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("s.title like '%" . $search_value . "%'" . " or s.description like '%" . $search_value . "%'");
            $query->whereRaw($str_search);
        }

        $query->orderBy('s.id', 'asc');
        $count_query = clone $query;
        $count = $count_query->count('s.id');
        $rows = $query->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->image_file_name) {
                $row->image_url = self::getProfilePicture($row->id);
            }
            unset($row->image_file_name);
        }
        return $rows;
    }

    function getSkillsPaginate($arr, $ss)
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

        $query = DB::table('skills as s')
            ->selectRaw('s.id, s.title, s.description, s.image_file_name, s.count_member')
            ->whereRaw('s.branch_id =' . $branch_id);
        if ($search_id) {
            $query->whereRaw('s.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("s.title like '%" . $search_value . "%'" . " or s.description like '%" . $search_value . "%'");
            $query->whereRaw($str_search);
        }

        $query->orderBy('s.id', 'asc');
        $count_query = clone $query;
        $count = $count_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->image_file_name) {
                $row->image_url = self::getProfilePicture($row->id);
            }
            unset($row->image_file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getProfilePicture($id)
    {
        $col_subs_id = DBX::getHex('s.subs_id', 'subs_id');
        $row = DB::table('skills as s')->where('id', $id)->selectRaw($col_subs_id . ',s.branch_id,s.image_file_name')->first();
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'skills'], 'images') . $row->image_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getDetails($id)
    {
        $row = DB::table('skills')->where('id', $id)->first();

        if ($row) {
            $row->image_url = self::getProfilePicture($id);
        }

        return DB::table('skills')
            ->select('id', 'title', 'description', 'count_member')
            ->addSelect(DB::raw("'{$row->image_url}' as image_url"))
            ->where('id', $id)
            ->first();
    }

    function delete($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Ensure $ss contains necessary data
        if (!isset($ss->branch_id) || !isset($ss->subs_id)) {
            return DV::error('Invalid session data');
        }

        // Retrieve the file name associated with the meper
        $file_name = DB::table('skills as s')
            ->where('s.id', $id)
            ->take(1)
            ->value('s.image_file_name');
        if ($file_name) {
            PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
        }
        DB::table('skills as s')->where('s.id', $id)->update(['image_file_name' => null]);

        // Proceed to delete the meper from the database
        $query = DB::table('skills')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();
        $count_member = DB::table('skills')->count('id');
        if ($count_member > 0) {
            DB::table('skills')->update(['count_member' => $count_member]);
        }
        // Check if the query was successful
        if (!$query) {
            return DV::error('Skill not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

}
