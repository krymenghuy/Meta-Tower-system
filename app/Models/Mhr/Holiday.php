<?php

namespace App\Models\Mhr;

use App\Models\Prm\GeneralSettings;
use DV;
use DBX;
use Vsd\Vsloquent\VSModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
class Holiday extends VSModel
{
    protected $table = 'holidays';

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|0-150',
            'holiday_type_id' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'description' => '0|string|0-300',
        ];

        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ',', '(', ')', ' '];
        $allow_chars = [
            'name' => ['(', ')', '-', '/', '.', ' ', ','],
            'description' => $pos_char,
        ];

        $res = DBX::validateObject($arr, $v_rule, true, $allow_chars, $ss->lang, false, $checkUnique=null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $inputs['description'] = $inputs['description'] ?? '';

        $err = self::checkDuplicateName($inputs['name'], $id, $branch_id);
        if ($err) {
            return DV::error($err);
        }

        $id = DBX::saveData($ss, 'holidays', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['holidays' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving holiday');
    }
    static function checkDuplicateName($name, $id, $branch_id)
    {
        $query = DB::table('holidays as h')
            ->where('h.branch_id', $branch_id)
            ->where('h.name', $name);

        if ($id) {
            $query->where('h.id', '<>', $id);
        }

        $test = $query->select('id')->first();
        if ($test) {
            return 'Holiday already exists::' . $name;
        }

        return null;
    }

    public function getHolidayListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)) {
            $current_page = 1;
        }
        $search_value = $d->search_value ?? null;
        $year = $d->year ?? date('Y');
        $skip_rows = ($current_page - 1) * $per_page;
        $start_date = DBX::formatDate('h.start_date','start_date');
        $end_date = DBX::formatDate('h.end_date','end_date');
        $updated_at = DBX::formatTime('h.updated_at','updated_at');
        $str_search = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(h.name LIKE '%" . $search_value . "%')";
        }


        $selectRow = 'h.id,h.name,h.holiday_type_id,ht.name as holiday_type,'.$start_date.','.$end_date.',h.description,h.update_user,'.$updated_at.'';
        $query = DB::table('holidays as h')->join('holiday_types as ht', 'ht.id', '=', 'h.holiday_type_id')->whereYear('h.start_date', $year)->whereRaw($str_search)->selectRaw($selectRow);

        $holiday_type_id = $d->holiday_type_id ?? null;
        if ($holiday_type_id) {
            $query->where('h.holiday_type_id', $holiday_type_id);
        }

        $count_query = clone $query;
        $count = $count_query->count('h.id');
        $rows = $query->skip($skip_rows)->take($per_page)->orderByRaw('h.id ASC')->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id=null, $ss=null)
    {
        $row = DB::table('holidays as h')
            ->selectRaw('h.id,h.name,h.holiday_type_id,h.start_date,h.end_date,h.description,h.updated_at,h.update_user')
            ->where('h.id', $id)->get()->first();
        if($row) {
            setOfficialDates($row, ['start_date','end_date'], ['updated_at'],['']);
        }
        return $row;
    }

    function deleteHoliday($id=null, $ss=null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $delete = DB::table('holidays')->where('id', $id)->delete();
        return DV::depends($delete, null, 'Error deleting holiday');
    }

    public function getFormOptions($id, $ss)
    {
        $holidays = null;
        if ($id) {
            $holidays = $this->getDetails($id, $ss);
        }
        return (object) [
            'holiday_types' => DB::table('holiday_types')->selectRaw('id,name')->get(),
            'holidays' => $holidays,
        ];
    }
    function getHolidayList($arr, $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;
        $year = $d->year ?? date('Y');
        $query = DB::table('holidays as hd')
        ->join('holiday_types as ht', 'ht.id', '=', 'hd.holiday_type_id')
        ->selectRaw('hd.id, hd.holiday_type_id, hd.name, hd.start_date, hd.end_date, hd.description')
        ->where('hd.branch_id', $ss->branch_id)
        ->where('hd.start_date', $year);
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("hd.name LIKE '%" . $search_value . "%' OR hd.code LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();
        return $rows;
    }
}
