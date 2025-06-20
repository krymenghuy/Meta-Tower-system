<?php

namespace App\Models\Ypg;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class GraveSlot
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr, $id = null)
    {
        $id = $id ?? $this->id;
        $ss = $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'slot_number' => '1|string|0-20',
            'deceased_name' => '1|string|0-100',
            'size' => '1|choice|S,M,L',
            'recommender' => '0|string|0-100',
            'file_name'=> '0|image',
            'location_note'=>'0|string|0-250',
            'status_id' => '1|number|default = 1',

        ];

        $res = DBX::validateObject($arr, $v_rule, true, ['slot_number' => GeneralSettings::$address_map_chars], $ss->lang, false);
        if($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object)$inputs;
        $slot_number = $d->slot_number ?? null;
        if($slot_number){
            $checkUnque = DB::table('grave_slots')->where('slot_number',$inputs['slot_number'])->where('branch_id', $branch_id)->select('id')->first();
            if ($checkUnque) {
                return DV::error('This Grave Slot already exists.');
            }
        }
        return $id = DBX::saveData($ss, 'grave_slots', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends($id, ['grave_slots' => $inputs, 'id' => $id]);
        }
        return DV::error('Error saving grave slot');
    }

    public function getList($arr, $ss = null)
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
        $status_id = $d->status_id ?? null;


        $str_search = '1=1';
        $str_moreWhere = '1=1';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(gs.name LIKE '%" . $search_value . "%' OR gs.slot_number LIKE '%" . $search_value . "%' OR gs.zone LIKE '%" . $search_value . "%')";
        }
        if($status_id){
            $str_moreWhere .= ' AND ta.status_id =\'' . $status_id . '\'';
        }

        $query = DB::table('grave_slots as gs')
            ->join('slot_statuses as s', 's.id', '=', 'gs.status_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('gs.id,gs.slot_number,gs.zone,gs.grave_row,gs.position,gs.reversed_id,gs.used_id,gs.location_note,gs.status_id,s.name AS status')
            ->orderBy('gs.id', 'DESC');



        $clone_query = clone $query;
        $count = $clone_query->count('gs.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as &$row) {

            $row->reversed_by = DB::table('members')->where('id', $row->reversed_id)->value('name');
            $row->used_by = DB::table('deceased_registrations')->where('id', $row->used_id)->value('name');

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $query = DB::table('grave_slots as gs')
            ->join('slot_statuses as s', 's.id', '=', 'gs.status_id')
            ->where('gs.id', $id)
            ->selectRaw('gs.id,gs.slot_number,gs.zone,gs.grave_row,gs.position,gs.reversed_id,gs.used_id,gs.location_note,gs.status_id,s.name AS status')
            ->first();

        if($query){
            $query->reversed_by = DB::table('members')->where('id', $query->reversed_id)->value('name');
            $query->used_by = DB::table('deceased_registrations')->where('id', $query->used_id)->value('name');

        }
        return $query;
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $grave_slot = self::getDetails($id) ?? null;

        return (object) [
            'grave_slot' => $grave_slot,
            'statuses' => GeneralSettings::options_slot_status($ss),
            'members' => GeneralSettings::options_member($ss),
            'deceased_names' => GeneralSettings::options_deceased($ss),
        ];
    }

    public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('grave_slots')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting grave slot');
    }

    function updateStatus($status_id, $id = null, $ss = null)
    {
        $ss = $ss ? $ss : $this->userInfo;

        $currentStatus = DB::table('grave_slots')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }

        $x = DB::table('grave_slots')->where('id', $id)->update([
            'status_id'   => $status_id,
            'update_user' => $ss->full_name,
            'update_date' => getNowTime(),
            'update_uid'  => $ss->user_id
        ]);

        return DV::depends($x, ['grave slot status', 'updated']);
    }


}
