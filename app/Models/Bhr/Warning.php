<?php

namespace App\Models\Bhr;

use App\Models\DBX;
use Illuminate\Support\Facades\DB;
use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Bhr\Event;


class Warning
{
    protected $table = 'emp_warnings';
    protected $id = null;
    protected $userInfo = null;
    public function __construct($id = null, $userInfo = null)
    {
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

    public function saveWarnings($arr = [], $ss = null, $id = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number|exists.employees.id',
            'warning_type' => '1|string|50',
            'warning_date' => '1|date',
            'reason' => '0|string|255',
            'remarks' => '0|string|255',
        ];

        // Validate input
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;

        // Check for duplicate warning_type for the employee
        $exists = DB::table('emp_warnings')
            ->where('emp_id', $inputs['emp_id'])
            ->where('warning_type', $inputs['warning_type'])
            ->exists();

        if ($exists) {
            return DV::error("The employee already has a warning of this type.");
        }

        // Save warning data
        $warning = saveData($ss, 'emp_warnings', ['id' => $id], $inputs, [], 1);
        if ($warning > 0) {
            // Define event details
            $event_name = 'Employee Warnings';
            $event_id = Employee::getEventId($event_name);

            // If event ID doesn't exist, create a new event
            if (!$event_id) {
                $event_arr = ['name' => $event_name];
                $event_res = Event::createEvent($event_arr, $ss);

                if ($event_res->status_code == 200 && !empty($event_res->data['id'])) {
                    $event_id = $event_res->data['id'];
                } else {
                    return DV::error("Failed to create or fetch event for: {$event_name}");
                }
            }

            // Prepare event inputs
            $event_date = $inputs['warning_date'];
            $event_inputs = [
                'emp_id' => $inputs['emp_id'],
                'event_id' => $event_id,
                'impact' => 'Neutral', // Adjust impact as needed (e.g., Positive, Neutral, Negative)
                'remarks' => $inputs['remarks'] ?? '',
                'event_date' => $event_date,
                'branch_id' => $branch_id
            ];

            // Save event data
            $event_saved = saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
            if (!$event_saved) {
                return DV::error('Failed to log event.');
            }

            return DV::depends(1, ['emp_warnings' => $inputs, 'id' => $id]);
        }

        return DV::depends($warning, ['emp_warnings' => $inputs, 'id' => $id]);
    }



    function getWarningsListPaginate($arr, $ss)
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
        $str_search = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $str_search = "(emp.name LIKE '%" . $search_value . "%' OR emp.code = '" . $search_value . "')";
        }
        $col_update_date = DBX::formatTime('w.updated_at', 'updated_at');
        $col_warning_date = DBX::formatTime('w.warning_date', 'warning_date');
        $query = DB::table('emp_warnings as w')
            ->join('employees as emp', 'emp.id', '=', 'w.emp_id')
            ->whereRaw($str_search)
            ->selectRaw('w.id, emp.id as emp_id, emp.name, emp.name_kh,'.$col_warning_date.',w.warning_type,w.remarks,w.reason,emp.position_id, emp.photo_file_name as emp_photo,'.$col_update_date.',w.update_user')
            ->orderBy('w.id', 'ASC');

        $clone_query = clone $query;
        $count = $clone_query->count('w.id');
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

    function deleteWarning($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
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
        $row = DB::table('emp_warnings as w')->selectRaw('w.id,w.emp_id,w.remarks,w.reason,w.warning_type,w.warning_date')->where('w.branch_id', $branch_id)->where('w.id', $id)->take(1)->first();
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
    function warningList($arr, $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        // Query to fetch attendance records
        $query = DB::table('emp_warnings as war')
            ->join('employees as emp', 'emp.id', '=', 'war.emp_id')  // Join with the employees table
            ->selectRaw('war.id, war.emp_id, war.warning_date, war.reason, war.remarks')
            ->where('war.branch_id', $ss->branch_id);  // Ensure only records for the current branch are fetched

        // Apply search filters if a search value is provided
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("war.name LIKE '%" . $search_value . "%' OR emp.code LIKE '%" . $search_value . "%' OR warning 'warning_type' '%" . $search_value . "%'");
        }

        // Execute the query and fetch all matching records
        $rows = $query->get();

        // Return the rows as a result
        return $rows;
    }
}
