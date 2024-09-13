<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Members
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'members';

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
            'email' => '0|email',
            'address' => '0|string|0-250',
            'phone' => '1|phone|0-20',
            'photo' => '0|image',
        ];

        $checkUnque = [
            "$branch_id|members|phone|id=id|text=Member already exists by phone number",
            "$branch_id|members|email|id=id|text=Member already exists by email"
        ];

        $res = validateObject($arr, $v_rule, true, ['email' => GeneralSettings::$email_chars, 'photo' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnque);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        // Continue with the rest of your save logic...


        $id = $res->id;
        $inputs = $res->values;
        $d = (object) $inputs;
        $photo = $d->photo;

        $d->phone_number = str_replace(' ', '', $inputs['phone']);
        $inputs['phone'] = $d->phone_number;
        if (!$d->phone_number) {
            error_log('Phone number is required for valid member account');
            return DV::error('Phone number is required for valid member account');
        }

        unset($inputs['photo']);
        $member_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'members', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('members as mb')->where('mb.id', $id)->take(1)->value('mb.photo_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }
                DB::table('members as mb')->where('mb.id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'members.photo_file_name']);
            return DV::depends(1, ['members' => $inputs, 'id' => $id]);
        }

        error_log('Failed to save member');
        return DV::error('Failed to save member');
    }


    function getMembers($ss)
    {
        return DB::table('members as mb')->selectRaw('id, first_name, last_name, sex, email, address, phone')->get();
    }

    function getMembersPaginate($arr, $ss)
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

        $query = DB::table('members as mb')
            ->selectRaw('mb.id, mb.first_name, mb.last_name, mb.sex, mb.email, mb.address, mb.phone, mb.photo_file_name, mb.created_at')
            ->where('mb.branch_id', $branch_id);

        if ($search_id) {
            $query->where('mb.id', $search_id);
        } elseif ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "mb.first_name LIKE '%{$search_value}%' OR mb.last_name LIKE '%{$search_value}%' OR mb.email LIKE '%{$search_value}%' OR mb.phone LIKE '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $query->orderBy('mb.id', 'asc');

        $count_query = clone $query;
        $count = $count_query->count('mb.id');
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

    public static function getProfilePicture($id)
    {
        $col_subs_id = DBX::getHex('mb.subs_id', 'subs_id');
        $row = DB::table('members as mb')->where('id', $id)->selectRaw($col_subs_id . ',mb.branch_id,mb.photo_file_name')->first();
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'members'], 'image') . $row->photo_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
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

        // Retrieve the file name associated with the member
        $file_name = DB::table('members as mb')
            ->where('mb.id', $id)
            ->take(1)
            ->value('mb.photo_file_name');
            if ($file_name) {
                 PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir],'images', $file_name);
            }
            DB::table('members as mb')->where('mb.id', $id)->update(['photo_file_name' => null]);


        // Proceed to delete the member from the database
        $query = DB::table('members')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();

        // Check if the query was successful
        if (!$query) {
            return DV::error('Member not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
}

   
}
