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
            'id' => '0|identity=1', // Allow id for update
            'emp_id' => '1|number|exits.employees.id',
            'position' => '0|string|0-100',
            'issues' => '0|string|max:250',
            'promises' => '0|string|max:250',
            'warning' => '0|string|max:100',
            'remarks' => '0|string|0-300',
        ];
        // $checkUnque = ["$branch_id|warnings|emp_id|warning|id=id|text=Employee has already warning "];

        // Validate inputs
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);//,$checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }
        $id = $res->id;

        $inputs = $res->values;

        $warning = saveData($ss, 'warnings', ['id' => $id], $inputs, [], 1);
        if ($warning > 0) {
            return DV::depends(1, ['warnings' => $inputs, 'id' => $id]);
        }

        return DV::depends($warning, ['warnings' => $inputs, 'id' => $id]);
        
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
            ->selectRaw('war.id, e.id as emp_id, e.name, e.name_kh,war.position,war.remarks,e.email as email, war.issues, war.promises, war.warning, e.photo_file_name as emp_photo')
            ->orderBy('war.id', 'DESC');
        if ($search_id) {
            $query->where('war.id', $search_id);
        }

        if ($search_status_id) {
            $query->where('war.issues', $search_status_id);
        }

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "e.name like '%{$search_value}%' or e.name_kh like '%{$search_value}%' or war.promises like '%{$search_value}%'";
            $query->whereRaw($str_search);
        }

        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->emp_photo) {
                $row->image_url = Employee::ProfilePicture($row->emp_id);
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
    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('warnings as w')->selectRaw('w.id,w.emp_id,w.remarks,w.position,w.issues,w.promises,w.warning')->where('w.branch_id', $branch_id)->where('w.id', $id)->take(1)->first();
        return $row;
    }
    static function getFormOptions($id, $ss)
    {
        $warning = null;
        if ($id) {
            $warning = self::getDetails($id, $ss);
        }
        return (object) [
            'sort_by' => [
                ['id' => 'e.name', 'name' => 'By Name'],
                ['id' => 'pay.salary', 'name' => 'By Salary'],
                ['id' => 'e.phone_number', 'name' => 'By Phone Number'],
                ['id' => 'pay.rate', 'name' => 'By  Rate'],

            ],
            'employees' => GeneralSettings::options_employee(10, $ss),
            'warnings' => $warning,
        ];
    }
}
