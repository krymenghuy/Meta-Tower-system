<?php

namespace App\Models\Bhr;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;

class Warning extends Model
{
    use HasFactory;

    protected $table = 'warnings'; // Define the table name
    protected $fillable = [
        'name',
        'name_kh',
        'emp_id',
        'email',
        'position',
        'issues',
        'promises',
        'warning',
        'subs_id'
    ]; // Fillable fields for mass assignment

    protected static $img_dir = 'warnings/profile';

    public function saveWarnings($arr = [], $userInfo = null)
    {
        $ss = $userInfo ?? $this->userInfo; // Fallback to the instance's userInfo
        $branch_id = $ss->branch_id;

        // Validation rules
        $v_rule = [
            'id' => 'nullable|numeric', // Allow id for update
            'emp_id' => '1|numeric',
            'position' => '1|numeric',
            'issues' => '1|string|max:250',
            'promises' => '1|string|max:250',
            'warning' => '1|string|max:100',
            'subs_id' => '1|numeric', // Ensure subs_id is provided
        ];

        // Validate inputs
        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        // Check if the employee exists in the database
        $employee = DB::table('employees')->where('id', $inputs['emp_id'])->first();
        if (!$employee) {
            return DV::error('Employee not found for the provided employee ID.');
        }

        // Check if the position exists in the database
        $position = DB::table('positions')->where('id', $inputs['position'])->first();
        if (!$position) {
            return DV::error('Position not found for the provided position ID.');
        }

        // Check if we're updating or creating
        if (isset($inputs['id'])) {
            // Update existing warning
            $warning = self::find($inputs['id']);
            if ($warning) {
                $warning->update($inputs);
                return DV::depends(1, ['warnings' => $warning]);
            } else {
                return DV::error('Warning not found for the provided ID.');
            }
        } else {
            // Create a new warning
            $warning = self::create($inputs);
            if ($warning) {
                return DV::depends(1, ['warnings' => $warning]);
            }
        }

        return DV::error('Error saving warnings.');
    }

    function getWarningsListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 20;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_status_id = $d->status_id ?? null;

        $str_search = '1=1';

        $query = DB::table('warnings as war')
            ->join('employees as e', 'e.id', '=', 'war.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
            ->selectRaw('war.id, e.id as emp_id, e.name, e.name_kh, e.positions_id as emp_position_id,e.email as email, pos.name as position, war.issues, war.promises, war.warning, e.photo_file_name as emp_photo');

        if ($search_id) {
            $query->where('war.id', $search_id);
        }

        if ($search_status_id) {
            $query->where('war.issues', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%{$search_value}%' or e.name_kh like '%{$search_value}%' or war.promises like '%{$search_value}%' or pos.name like '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::getProfilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function deleteWarning($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Check if the warning exists before attempting to delete
        $warningExists = DB::table('warnings')->where('id', $id)->exists();
        if (!$warningExists) {
            return DV::error('Warning not found');
        }

        // Attempt to delete the warning
        $deleted = DB::table('warnings')->where('id', $id)->delete();

        if ($deleted) {
            return DV::result(['message' => 'Warning deleted successfully']);
        }

        return DV::error('Error deleting the warning');
    }
    static function details($id)
    {
        return DB::table('warnings')->where('id', $id)->selectRaw('id, position, issues, promises, warning')->first();
    }
    static function getFormOptions($id, $ss)
    {
        return (object)[
            "warning" => self::details($id),
            "warning_types" => GeneralSettings::options_warning_types($ss)
        ];
    }
}
