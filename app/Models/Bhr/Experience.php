<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class Experience //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function saveExperience($arr, $id = null, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identify=1',
            'emp_id' => '1|number|exists=employees.id',
            'position_id' => '1|number|exists=positions.id',
            'organization_id' => '1|number|exists=organizations.id',
            'description' => '0|string|0-300',
            'period_type' => '0|string|0-150',
            'start_date' => '0|date',
            'end_date' => '0|date'

        ];
        $exp_char = ['$', '#', '@', '!', '.', '-', '_', '=', '?'];
        // $checkUnque = ["$branch_id|emp_experience|emp_id|school_id|period|id=id|text=Employee Eduction is already Save "];


        $res = validateObject($arr, $v_rule, true, ['period_type' => $exp_char], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $id = saveData($ss, 'emp_experiences', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['emp_experiences' => $inputs, 'id' => $id]);
        }
        return DV::depends($id, ['action', 'saved']);
    }
    function getListAll($arr, $ss)
    {
        $branch_id = $ss->branch_id;
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $search_value = $d->search_value ?? null;
        $emp_id = $d->emp_id ?? null; 

        $skip_rows = ($current_page - 1) * $per_page;

        $str_search = '1=1'; // Default condition (returns all results if no search value is provided)

        if ($search_value) {
            $skip_rows = 0; // Reset pagination if search is applied
            $str_search = "(exp.emp_id LIKE '%" . $search_value . "%' OR exp.description LIKE '%" . $search_value . "%')";
        }

        $query = DB::table('emp_experiences as exp')
            ->join('employees as emp', 'emp.id', '=', 'exp.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'exp.position_id')
            ->join('organizations as org', 'org.id', '=', 'exp.organization_id')
            ->where('exp.branch_id', $branch_id)
            ->whereRaw($str_search)
            ->where('exp.emp_id', $emp_id)
            ->selectRaw('exp.id, exp.description, pos.id, pos.title as position,org.id as organization_id, org.name as organization_id, exp.period_type, formatDate(exp.end_date) as end_date, formatDate(exp.start_date) as start_date')
            ->orderBy('exp.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('exp.id');

        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function details($id, $ss = null)
    {
        $branch_id = $ss->branch_id;
        $rows = DB::table('emp_experiences')->selectRaw('id,emp_id,position_id,period_type,organization_id,start_date,end_date')
            ->where('branch_id', $branch_id)
            ->where('id', $id)
            ->take(1)->first();
        if (!$rows) return null;
        return $rows;
    }


    function formOptions($id, $ss)
    {
        $experience = null;
        if ($id) {
            $experience = self::details($id, $ss);
        }
        return (object) [
            'positions' => DB::table('positions')->selectRaw('id, title')->get(),   
            'organizations' => DB::table('organizations')->selectRaw('id,name')->get(),
            'emp_experience' => $experience,
        ];
    }

    function delete($id, $ss)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('emp_experiences')->where('id', $id)->delete();
        return DV::depends($delete, ['action' => 'deleted']);
    }
}
