<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Payroll
{
    protected $id = null;
    protected static $img_dir = 'payrolls';
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'email' => '1|string|0-250',
            'phone_number' => '1|string|0-20',
            'position_id' => '1|numeric|0-1000000',
            'rate' => '1|numeric|0-100',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'working_hours' => '1|string|0-100',
            'salary' => '1|numeric|0-1000000',
            'status_id' => '1|number|default = 1',
            'photo' => '0|image',
        ];

        $checkUnque = [
            "$branch_id|payrolls|phone_number|id=id|text=Employee already exists by phone number",
            "$branch_id|payrolls|email|id=id|text=Employee already exists by email",
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
        $d->phone_nuper = str_replace(' ', '', $inputs['phone_number']);
        $inputs['phone_number'] = $d->phone_nuper;
        if (!$d->phone_nuper) {
            error_log('Phone numer is required for valid  Payroll');
            return DV::error('Phone numer is required for valid  Payroll');
        }
        unset($inputs['photo']);
        $payroll_created = !$id;
        $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('payrolls as pay')->where('pay.id', $id)->take(1)->value('pay.photo_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('payrolls')->where('id', $id)->update(['photo_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $photo, null, ['id' => $id, 'store' => 'payrolls.photo_file_name']);
            return DV::depends(1, ['payrolls' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save data');
    }

    function getPayrollListPaginate($arr, $ss)
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
        $sort_by = $d->sort_by ?? null;
        $search_position_id = $d->position_id ?? null;
        $search_status_id = $d->status_id ?? null;

        $query = DB::table('payrolls as pay')
            ->join('positions as pos', 'pos.id', '=', 'pay.position_id')
            ->join('statuses as s', 's.id', '=', 'pay.status_id')
            ->selectRaw('pay.id, pay.name, pay.email, pay.phone_number, pay.position_id, pos.name as position, pay.rate, pay.start_date, pay.end_date, pay.working_hours, pay.salary, s.name as status, pay.photo_file_name');

        if ($search_id) {
            $query->where('pay.id', $search_id);
        }

        if ($search_position_id) {
            $query->where('pay.position_id', $search_position_id);
        }

        if ($search_status_id) {
            $query->where('pay.status_id', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->where(function ($q) use ($search_value) {
                $q->where('pay.name', 'like', "%{$search_value}%")
                    ->orWhere('pay.email', 'like', "%{$search_value}%")
                    ->orWhere('pay.phone_number', 'like', "%{$search_value}%")
                    ->orWhere('pos.name', 'like', "%{$search_value}%")
                    ->orWhere('s.name', 'like', "%{$search_value}%")
                    ->orWhere('pay.rate', 'like', "%{$search_value}%")
                    ->orWhere('pay.start_date', 'like', "%{$search_value}%")
                    ->orWhere('pay.end_date', 'like', "%{$search_value}%")
                    ->orWhere('pay.working_hours', 'like', "%{$search_value}%")
                    ->orWhere('pay.salary', 'like', "%{$search_value}%");
            });
        }

        if ($sort_by) {
            $query->orderBy($sort_by, 'ASC');
        }

        $count = $query->count('pay.id');
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
        $col_subs_id = DBX::getHex('pay.subs_id', 'subs_id');
        $row = DB::table('payrolls as pay')->where('pay.id', $id)->selectRaw($col_subs_id . ',pay.branch_id,pay.photo_file_name')->first();
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'payrolls'], 'images') . $row->photo_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getDetails($id, $ss)
    {
        $row = DB::table('payrolls as pay')
            ->join('positions as pos', 'pos.id', '=', 'pay.position_id')
            ->join('statuses as s', 's.id', '=', 'pay.status_id')
            ->where('pay.id', $id)->first();
        if ($row) {
            $image_url = self::getProfilePicture($id);
        } else {
            $image_url = null;
        }

        return DB::table('payrolls as pay')
            ->join('positions as pos', 'pos.id', '=', 'pay.position_id')
            ->join('statuses as s', 's.id', '=', 'pay.status_id')
            ->selectRaw('pay.id, pay.name, pay.email, pay.phone_number, pay.position_id, pos.name as position, pay.rate, pay.start_date, pay.end_date, pay.working_hours, pay.salary, s.name as status,? as image_url', [$image_url])
            ->where('pay.id', $id)->first();
    }

    function deletePayroll($id, $ss)
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
        $file_name = DB::table('payrolls')->where('id', $id)->value('photo_file_name');
        if ($file_name) {
            // Delete the file from the storage
            PublicStorage::delete([
                'branch_id' => null,
                'subs_id' => $ss->subs_id,
                'dir' => self::$img_dir,
            ], 'images', $file_name);
        }

        // Update the profile to remove the photo file name
        DB::table('payrolls')->where('id', $id)->update(['photo_file_name' => null]);

        // Delete the profile
        $deleted = DB::table('payrolls')->where('id', $id)->delete();

        // Check if the query was successful
        if (!$deleted) {
            return DV::error('Payroll not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

    function getFormOptions($id, $ss)
    {
        $payroll = null;
        if ($id) {
            $payroll = self::getDetails($id, $ss);
        }
        return (object) [
            'sort_by' => [
                ['id' => 'pay.name', 'name' => 'By Name'],
                ['id' => 'pay.email', 'name' => 'By Email'],
                ['id' => 'pay.phone_number', 'name' => 'By Phone Number'],
                ['id' => 'pos.name', 'name' => 'By Position'],
                ['id' => 'pay.rate', 'name' => 'By  Rate'],
                ['id' => 'pay.salary', 'name' => 'By Salary'],
                ['id' => 'pay.start_date', 'name' => 'By Start Date'],
                ['id' => 'pay.end_date', 'name' => 'By End Date'],
                ['id' => 'pay.working_hours', 'name' => 'By Working Hours'],
                ['id' => 'pay.photo_file_name', 'name' => 'By Photo'],

            ],
            'status' => DB::table('statuses')->selectRaw('id,name')->get(),
            'positions' => DB::table('positions')->selectRaw('id,name')->get(),

            'payrolls' => $payroll,
        ];

    }
}
