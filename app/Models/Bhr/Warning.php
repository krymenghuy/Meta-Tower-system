<?php

namespace App\Models\Bhr;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;

class Warning extends Model // Extend the Eloquent Model
{
    use HasFactory; // Use Eloquent's factory features

    protected $table = 'warnings'; // Define the table name if it's not plural
    protected $fillable = [
        'first_name',
        'last_name',
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

        $v_rule = [
            'id' => 'nullable|numeric', // Allow id for update
            'emp_id' => '1|numeric',
            'position' => '1|string|max:250',
            'issues' => '1|string|max:250',
            'promises' => '1|string|max:250',
            'warning' => '1|string|max:100',
            'subs_id' => '1|numeric', // Ensure subs_id is provided
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang); // Make sure validateObject is defined
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values; // Get validated inputs

        // Check if an id is provided to determine if we're updating or creating
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

        return DV::error('Error saving warnings');
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
            ->selectRaw('war.id, e.id as emp_id, e.first_name, e.last_name, e.positions_id as emp_position_id,e.email as email, pos.name as position, war.issues, war.promises, war.warning, e.photo_file_name as emp_photo');
            // ->where('war.branch_id', $branch_id);

        if ($search_id) {
            $query->where('war.id', $search_id);
        }

        if ($search_status_id) {
            $query->where('war.issues', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.first_name like '%{$search_value}%' or e.last_name like '%{$search_value}%' or war.promises like '%{$search_value}%' or pos.name like '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count();
        // $query->orderBy('war.id', 'desc');
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
            return DV::error('Warning not found'); // Return error if the warning doesn't exist
        }

        // Attempt to delete the warning
        $deleted = DB::table('warnings')->where('id', $id)->delete();

        // Check if the deletion was successful
        if ($deleted) {
            return DV::result(['message' => 'Warning deleted successfully']);
        }

        return DV::error('Error deleting the warning'); // Return an error response if deletion fails
    }

}
