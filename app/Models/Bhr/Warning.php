<?php

namespace App\Models\Bhr;


use Illuminate\Support\Facades\DB;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;

class Warning 
{
    protected $table = 'emp_warnings';
    protected $id = null;
    protected $userInfo = null;
    public function __construct($id=null , $userInfo = null){
        $this->id = $id;
        $this->$userInfo = $userInfo;

    }
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
    ]; 

    protected static $img_dir = 'warnings/profile';

    public function saveWarnings($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1', 
            'emp_id' => '1|number|exits.employees.id',
            'warning_type' => '0|string|50',
            'warning_date' => '1|date',
            'reason' => '0|string|255',
            'remarks' => '0|string|255',
        ];
       
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);//,$checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }
        $id = $res->id;

        $inputs = $res->values;

        $warning = saveData($ss, 'emp_warnings', ['id' => $id], $inputs, [], 1);
        if ($warning > 0) {
            
            return DV::depends(1, ['emp_warnings' => $inputs, 'id' => $id]);
        }

        return DV::depends($warning, ['emp_warnings' => $inputs, 'id' => $id]);
        
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

        $query = DB::table('emp_warnings as w')
            ->join('employees as emp', 'emp.id', '=', 'w.emp_id')
            ->selectRaw('w.id, emp.id as emp_id, emp.name, emp.name_kh,formatDate(w.warning_date) as warning_date,w.warning_type,w.remarks,w.reason,emp.position_id, emp.photo_file_name as emp_photo')
            ->orderBy('w.id', 'DESC');
        if ($search_id) {
            $query->where('w.id', $search_id);
        }

       

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "emp.name like '%{$search_value}%' or emp.name_kh like '%{$search_value}%' or w.reason like '%{$search_value}%'";
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
        $warningExists = DB::table('emp_warnings')->where('id', $id)->exists();
        if (!$warningExists) {
            return DV::error('Warning not found');
        }

        // Attempt to delete the warning
        $deleted = DB::table('emp_warnings')->where('id', $id)->delete();

        if ($deleted) {
            return DV::result(['message' => 'Warning deleted successfully']);
        }

        return DV::error('Error deleting the warning');
    }
    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('emp_warnings as w')->selectRaw('w.id,w.emp_id,w.remarks,w.position,w.issues,w.promises,w.warning')->where('w.branch_id', $branch_id)->where('w.id', $id)->take(1)->first();
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
