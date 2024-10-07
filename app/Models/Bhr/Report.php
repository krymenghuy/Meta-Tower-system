<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Report {
    protected $id = null;
    protected static $img_dir = 'reports';
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
            'position_id' => '1|number',
            'description' => '1|string|0-250',
            'report_type' => '1|string|0-250',
        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'reports', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['reports' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving report');
    }
}
