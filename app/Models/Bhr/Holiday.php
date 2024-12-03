<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class Holiday
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'holiday_type_id' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'description' => '0|string|0-300',
        ];

        $pos_char = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?',','];
        $checkUnique = ["$branch_id|holidays|name|id=id|text=Holiday already exists."];

        $res = validateObject($arr, $v_rule, true, ['description' => $pos_char], $ss->lang, false, $checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = saveData($ss, 'holidays', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['holidays' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving holiday');
    }

    public function getHolidayListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_authorized = $d->authorized ?? null;

        // Convert date range filters to 'Y-m-d' format
        $start_date = isset($d->start_date) ? date('Y-m-d', strtotime($d->start_date)) : null;
        $end_date = isset($d->end_date) ? date('Y-m-d', strtotime($d->end_date)) : null;

        // Get sort field and direction
        $sort_by = $d->sort_by ?? 'start_date';
        $sort_direction = $d->sort_direction ?? 'asc';

        // Ensure sort field is either 'start_date' or 'end_date'
        if (!in_array($sort_by, ['start_date', 'end_date'])) {
            $sort_by = 'start_date';
        }

        // Ensure sort direction is either 'asc' or 'asc'
        $sort_direction = strtolower($sort_direction) === 'asc' ? 'asc' : 'asc';

        $query = DB::table('holidays as h')
        ->join('holiday_types as ht', 'ht.id', '=', 'h.holiday_type_id')
        ->selectRaw('
            h.id,
            h.name,
            h.start_date,
            DATE_FORMAT(h.start_date, "%Y-%m-%d") as formatted_start_date,
            h.end_date,
            DATE_FORMAT(h.end_date, "%Y-%m-%d") as formatted_end_date,
            DATEDIFF(h.end_date, h.start_date) + 1 as duration,
            ht.id as holiday_type_id,
            ht.name as holiday_type,
            h.description
        ')
        ->where('h.branch_id', $branch_id);

        // Apply additional filters
        if ($search_id) {
            $query->where('h.id', $search_id);
        }
        if ($search_value) {
            $query->where('h.name', 'like', '%' . $search_value . '%');
        }
        if ($search_authorized) {
            $query->where('h.authorized', $search_authorized);
        }

        // Apply date range filter for holidays falling within or overlapping the specified range
        if ($start_date && $end_date) {
            $query->where(function ($q) use ($start_date, $end_date) {
                $q->whereDate('h.start_date', '<=', $end_date)
                    ->whereDate('h.end_date', '>=', $start_date);
            });
        }

        // Apply sorting
        $query->orderBy("h.$sort_by", $sort_direction);
        

        $count = $query->count();
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->formatted_start_date = date('d-M-Y', strtotime($row->formatted_start_date));
            $row->formatted_end_date = date('d-M-Y', strtotime($row->formatted_end_date));
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }





    public function getDetails($id, $ss)
    {
        $row = DB::table('holidays as h')
            ->join('holiday_types as ht', 'ht.id', '=', 'h.holiday_type_id')
            ->selectRaw('
                h.id,
                h.name,
                h.start_date,
                DATE_FORMAT(h.start_date, "%Y-%m-%d") as formatted_start_date,
                h.end_date,
                DATE_FORMAT(h.end_date, "%Y-%m-%d") as formatted_end_date,
                ht.id as holiday_type_id,
                ht.name as holiday_type,
                h.description
            ')
            ->where('h.branch_id', $ss->branch_id)
            ->where('h.id', $id)
            ->first();

        if ($row) {
            $row->formatted_start_date = date('D-M-Y', strtotime($row->formatted_start_date));
            $row->formatted_end_date = date('D-M-Y', strtotime($row->formatted_end_date));
        }

        return $row;
    }

    function deleteHoliday($id, $ss)
    {
        $id = $id ?? $this->id;

        $delete = DB::table('holidays')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

    public function getFormOptions($id, $ss)
    {
        $holidays = null;
        if ($id) {
            $holidays = $this->getDetails($id, $ss);
        }
        return (object) [

            'sort_by' => [
                ['id' => 'h.start_date', 'name' => 'By Start Date'],
                ['id' => 'h.end_date', 'name' => 'By End Date'],

            ],
            'holiday_types' => DB::table('holiday_types')->selectRaw('id,name')->get(),
            'branches' => GeneralSettings::options_branch($ss),
            'holidays' => $holidays,
        ];
    }
    function getHolidayList($arr, $ss = null)
    {
        $d = (object) $arr;

        $search_value = $d->search_value ?? null;

        $str_search = '1=1';
        $query = DB::table('holidays as hd')
        ->join('holiday_types as ht', 'ht.id', '=', 'hd.holiday_type_id')
        ->selectRaw('hd.id, hd.holiday_type_id, hd.name, hd.start_date, hd.end_date, hd.description')
        ->where('hd.branch_id', $ss->branch_id);  // Ensure only records for the current branch are fetched
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("hd.name LIKE '%" . $search_value . "%' OR hd.code LIKE '%" . $search_value . "%'");
        }
        $rows = $query->get();
        return $rows;
    } 
}
