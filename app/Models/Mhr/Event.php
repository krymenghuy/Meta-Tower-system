<?php

namespace App\Models\Mhr;

use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Event
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    static function createEvent($arr, $ss){

        $branch_id = $ss->branch_id;

        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string',
            'event_type' => '0|string|default = General',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $id = DBX::saveData($ss, 'events', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['events' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }

    function getEventListPaginate($arr, $ss) {
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

        $query = DB::table('events as e')
            ->selectRaw('e.id, e.name, e.event_type')
            ->where('e.branch_id', $ss->branch_id);

        if ($search_id) {
            $query->where('e.id', $search_id);
        }
        if ($search_value) {
            $query->where('e.name', 'like', '%' . $search_value . '%' . 'or' . 'e.event_type', 'like', '%' . $search_value . '%');
        }
        $query->skip($skip_rows)->take($per_page);
        $count_query = clone $query;
        $count = $count_query->count('e.id');
        $rows = $query->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id, $ss) {
        $branch_id = $ss->branch_id;
        $query = DB::table('events as e')
            ->selectRaw('e.id, e.name, e.event_type')
            ->where('e.branch_id', $ss->branch_id)
            ->where('e.id', $id)
            ->first();
        return $query;
    }

    function deleteEvent($id, $ss) {
        $branch_id = $ss->branch_id;
        $query = DB::table('events')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Invalid ID');
        }
        return DV::depends($query, null, 'Error deleting event');
    }
    function getFormOptions($id, $ss){
        if($id)
        return $data = (object) [
            'event' => $this->getDetails($id, $ss)
        ];
        else return $data = (object) [];
    }
}
