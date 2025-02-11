<?php

namespace App\Models\Bhr;

use DV;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use DBX;

class Experience //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function saveExperience($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'position' => '1|string|1-200',
            'organization_id' => '1|number|exists=organizations.id',
            'description' => '0|string|0-300',
            'period' => '0|string|0-150',
            'start_date' => '0|date',
            'end_date' => '0|date',
        ];

        $exp_char = ['$', '#', '@', '!', '.', '-', '_', '=', '?'];
        // Validate input
        $res = DBX::validateObject($arr, $v_rule, true, ['period' => $exp_char], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $start_date = convertDate($d->start_date);
        $end_date = convertDate($d->end_date);
        $period = $d->period;
        if($start_date && $end_date){
            $period = date('d-M-Y',strtotime($start_date)).' to '. date('d-M-Y',strtotime($end_date));  
        }else if ($start_date && !$end_date){
            $period = "$start_date until now";
            $period = date('d-M-Y',strtotime($start_date)).' until now';
        }else if (!$start_date){
            if(!$period) return DV::error('If you dont exactly remember start date or end date. You can specify the period of experience like this "10-Jan-2023 to 15-Dec-2025" or "Jan-2023 to Dec-2025"'); 
        }
        $inputs['start_date'] =  $start_date;
        $inputs['end_date'] = $end_date;
        $inputs['period'] = $period;
        $id = DBX::saveData($ss,'emp_experiences',['id'=>$id],$inputs,1,false);
        return DV::depends($id, ['emp_experiences' => $inputs, 'id' => $id], 'Failed to save experience');
    }

    function getListAll($emp_id, $ss)
    {
        $start_date = DBX::formatDate('exp.start_date', 'start_date');
        $end_date = DBX::formatDate('exp.end_date', 'end_date');

        $query = DB::table('emp_experiences as exp')
            ->join('employees as emp', 'emp.id', '=', 'exp.emp_id')
            ->join('organizations as org', 'org.id', '=', 'exp.organization_id')
            ->where('exp.emp_id', $emp_id)
            ->selectRaw('exp.id, exp.description,exp.position,org.id as organization_id, org.name as organization_id,exp.period,'.$start_date.','.$end_date)
            ->orderBy('exp.id', 'DESC');
        return $query->get();
    }

    function details($id)
    {
        return DB::table('emp_experiences')->selectRaw('id,emp_id,position,period,description,organization_id,start_date,end_date')
            ->where('id', $id)
            ->first();
    }
 
    function formOptions($id, $ss)
    {
        $experience = null;
        if ($id) {
            $experience = self::details($id);
        }
        return (object) [
            'positions' => DB::table('positions')->selectRaw('id, title')->get(),
            'organizations' => DB::table('organizations')->selectRaw('id,name')->get(),
            'emp_experience' => $experience,
        ];
    }

    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $delete = DB::table('emp_experiences')->where('id', $id)->delete();
        return DV::depends($delete, null, 'Error deleting experience');
    }
}
