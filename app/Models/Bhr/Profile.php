<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Profile
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'profiles';

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'first_name' => '1|string|0-100',
            'last_name' => '1|string|0-100',
            'sex' => '1|choice|M,F',
            'date_of_birth' => '1|date',
            'email' => '0|email',
            'address' => '0|string|0-250',
            'phone' => '1|phone|0-20',
            'cp_name' => '0|string|0-100',
            'photo' => '0|string|0-100',
        ];

        $checkUnque = [
            "$branch_id|profiles|phone|id=id|text=Profile already exists by phone number",
            "$branch_id|profiles|email|id=id|text=Profile already exists by email",
        ];

        $res = validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnque);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $d = (object) $inputs;
        $photo = $d->photo;

        $d->phone_nuper = str_replace(' ', '', $inputs['phone']);
        $inputs['phone'] = $d->phone_nuper;
        if (!$d->phone_nuper) {
            error_log('Phone nuper is required for valid  product');
            return DV::error('Phone nuper is required for valid  product');
        }
        unset($inputs['photo']);
        $profile_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'profiles', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('profiles as pf')->where('pf.id', $id)->take(1)->value('pf.photo_file_name');

                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }
                DB::table('profiles as pf')->where('pf.id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'profiles.photo_file_name']);
            return DV::depends(1, ['products' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save data');
    }

    function getProfile($ss)
    {

        return DB::table('profiles')->selectRaw('id,first_name,last_name,sex,date_of_birth,email,address,phone,cp_name,photo_file_name')->get();

    }

    function getProfilePicture($id)
    {
        $col_subs_id = DBX::getHex('p.subs_id', 'subs_id');
        $row = DB::table('profiles as p')->where('id', $id)->selectRaw($col_subs_id . ',p.branch_id,p.photo_file_name')->first();
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'profiles'], 'images') . $row->photo_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getProfilePaginate($arr, $ss)
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
        $search_sex = $d->sex ?? null;

        $str_search = '1=1';

        $query = DB::table('profiles as p')
            ->selectRaw('p.id, p.first_name, p.last_name, p.sex, p.email, p.address,p.cp_name, p.phone, p.photo_file_name, p.created_at')
            ->where('p.branch_id', $branch_id);

        if ($search_id) {
            $query->where('p.id', $search_id);

        } elseif ($search_sex) {
            $query->where('p.sex', $search_sex);
        }
        elseif ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "p.first_name LIKE '%{$search_value}%' OR p.last_name LIKE '%{$search_value}%' OR p.email LIKE '%{$search_value}%' OR p.phone LIKE '%{$search_value}%' OR p.address LIKE '%{$search_value}%' OR p.cp_name LIKE '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count();
        $query->orderBy('p.id', 'asc');
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

    function getDetails($id)
    {
        // Fetch the profile with the given ID
        $row = DB::table('profiles')->where('id', $id)->first();

        // Initialize image_url
        $image_url = null;

        // If the profile exists, update its image URL
        if ($row) {
            $image_url = self::getProfilePicture($id);
        }

        // Return the updated profile details
        return DB::table('profiles as pf')
            ->selectRaw('pf.id, pf.first_name, pf.last_name, pf.sex, pf.date_of_birth, pf.email, pf.address, pf.phone, pf.created_at, ? as image_url', [$image_url])
            ->where('pf.id', $id)
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

        // Retrieve the file name associated with the profile
        $file_name = DB::table('profiles')->where('id', $id)->value('photo_file_name');
        if ($file_name) {
            // Delete the file from the storage
            PublicStorage::delete([
                'branch_id' => null,
                'subs_id' => $ss->subs_id,
                'dir' => self::$img_dir,
            ], 'images', $file_name);
        }

        // Update the profile to remove the photo file name
        DB::table('profiles')->where('id', $id)->update(['photo_file_name' => null]);

        // Delete the profile
        $deleted = DB::table('profiles')->where('id', $id)->delete();

        // Check if the query was successful
        if (!$deleted) {
            return DV::error('Profile not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

}
