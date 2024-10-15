<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Movement
{
    protected $id = null;
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
            'emp_id' => '1|number',
            'new_branch_id' => '1|number',
            'new_position_id' => '1|number',
            'move_date' => '1|date',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'movements', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['movements' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    function getMovementListPaginate($arr, $ss)
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

        $str_search = '1=1';
         $query = DB::table('movements as m')
            ->join('employees as e', 'e.id', '=', 'm.emp_id')
            ->join('positions as pos', 'pos.id', '=', 'e.positions_id')
            ->join('um_branches as b', 'b.id', '=', 'm.new_branch_id')
            ->selectRaw('m.id,
                        e.id as emp_id,
                        e.name,
                        e.name_kh,
                        e.email,
                        e.phone_number,
                        e.positions_id as emp_position_id,
                        pos.title as position,
                        b.name as branch,
                        m.new_branch_id,
                        m.new_position_id,
                        m.move_date')
            ->where('m.new_branch_id', $branch_id);

        if ($search_value) {
            $query->where(function ($q) use ($search_value) {
                $q->where('e.name', 'like', '%' . $search_value . '%')
                    ->orWhere('pos.title', 'like', '%' . $search_value . '%');
            });
        }
        if ($search_id) {
            $query->where('m.id', $search_id);
        }
        
    }
}
