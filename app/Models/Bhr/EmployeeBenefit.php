<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
use App\Models\Bhr\Event;
use App\Models\Bhr\Employee;

class EmployeeBenefit
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getProps($id, $props = [])
    {
        $cols = is_array($props) ? implode(',', $props) : $props;
        $row = DB::table('emp_benefits')->where('id', $id)->selectRaw($cols)->first();
        return $row;
    }

    public function save($benefit_type_id, $id = null, $ss = null, $arr)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $id = $id ?? $this->id;

        $v_rule = [
            'id' => '0|identity=1',
            'emp_id' => '1|number|exists=employees.id',
            'benefit_type_id' => '1|choice|1,2,3|default=1',
            'benefit_id' => '1|number',
            'tax_option_id' => '1|choice|1,2,3|default=1',
            'flat_tax_rate' => '0|number',
            'balance' => '0|number',
            'amount' => '1|number',
            'remarks' => '0|string|1-255',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;
        $remarks = $arr['remarks'] ?? null;
        $emp_id = $arr['emp_id'] ?? null;

        if (!$emp_id) {
            return DV::error('Employee is required for saving benefit!');
        }

        // Check for existing benefit
        // $existingBenefit = DB::table('emp_benefits')
        //     ->where('emp_id', $emp_id)
        //     ->where('benefit_type_id', $inputs['benefit_type_id'])
        //     ->first();

        // if ($existingBenefit && (!$id || $id !== $existingBenefit->id)) {
        //     return DV::error('This employee already has a benefit of this type.');
        // }

        // Save benefit data
        $id = saveData($ss, 'emp_benefits', ['id' => $id], $inputs, [], 1, false);

        if ($id > 0) {
            $events = [
                '1' => 'remuneration',
                '2' => 'fringe benefit',
                '3' => 'insurance',
            ];

            $benefit = $this->getProps($id, ['benefit_type_id']);
            if (!$benefit) {
                return DV::error('Benefit type ID not found!');
            }

            $event_name = $events[$benefit->benefit_type_id] ?? null;
            if (!$event_name) {
                return DV::error("No matching event name found for benefit type ID: {$benefit->benefit_type_id}");
            }

            $event_id = Employee::getEventId($event_name);
            if (!$event_id) {
                $event_res = Event::createEvent(['name' => $event_name], $ss);
                if ($event_res->status_code === 200 && !empty($event_res->data['id'])) {
                    $event_id = $event_res->data['id'];
                } else {
                    return DV::error("Failed to create or fetch event for: {$event_name}");
                }
            }
            $event_inputs = [
                'emp_id' => $emp_id,
                'event_id' => $event_id,
                'impact' => 'Positive',
                'remarks' => $remarks ?? '',
                'event_date' => date('Y-m-d'),
            ];

            $event_saved = saveData($ss, 'emp_events', [], $event_inputs, [], 1, false);
            if (!$event_saved) {
                return DV::error('Failed to log event.');
            }
        }

        return DV::depends($id, ['id' => $id], 'Save failed');
    }

    function getAllBenefitsList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_benefit_id = $d->benefit_id ?? null;
        $str_srch = '1=1';
        $str_where = "2=2";
        if ($search_value) {
            $skip_rows = 0;
            $str_srch = "(emp.name LIKE '%" . $search_value . "%' OR b.remarks LIKE '%" . $search_value . "%' OR b.amount LIKE '%" . $search_value . "%')";
        }
        $benefitsQuery = DB::table('emp_benefits as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
            ->whereRaw($str_srch)
            ->whereRaw($str_where)

            ->selectRaw(
                'b.id, emp.id as emp_id, emp.name as name, emp.email as email, bc.name as benefit_name,
                b.benefit_type_id,b.benefit_id,b.tax_option_id,b.flat_tax_rate,b.balance, b.amount, b.remarks, b.update_user,b.updated_at, b.create_date, emp.photo_file_name as emp_photo'
            )

            ->orderBy('b.id', 'desc');

        if ($search_benefit_id) {
            $benefitsQuery->where('b.benefit_id', $search_benefit_id);
        }
        $clone_query = clone $benefitsQuery;

        $count = $clone_query->count('b.id');

        $rows = $benefitsQuery->skip($skip_rows)
            ->take($per_page)
            ->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query = DB::table('emp_benefits as b')
            ->join('employees as emp', 'emp.id', '=', 'b.emp_id')
            ->join('benefits as bc', 'bc.id', '=', 'b.benefit_id')
            ->selectRaw(
                'b.id,
                emp.id as emp_id,
                emp.name as name,
                emp.email as email,
                bc.name as benefit_name,
                b.benefit_type_id,
                b.benefit_id,
                b.tax_option_id,
                b.flat_tax_rate,
                b.balance,
                b.amount,
                b.remarks,
                b.update_user,
                b.updated_at,
                b.create_date,
                emp.photo_file_name as emp_photo'
            )
            ->where('b.branch_id', $branch_id)->where('b.id', $id)->take(1)->first();
        return $query;
    }


    function deleteBenefit($id, $ss)
    {
        $id = $id ?? $this->id;
        $branch_id = $ss->branch_id;

        $delete = DB::table('emp_benefits')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    static function getFormOptions($id, $ss)
    {
        $emp_benefits = null;
        if ($id) {
            $emp_benefits = self::getDetails($id, $ss);
        }
        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'benefits' => DB::table('benefits')->selectRaw('id,name')->get(),
            'emp_benefits' => $emp_benefits,
        ];
    }
}
