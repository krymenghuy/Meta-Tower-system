<?php

namespace App\Models\Ypg;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class DeceasedRegistration
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
            'member_id' => '1|number',
            'name' => '1|string|0-100',
            'sex' => '1|string|0-10',
            'relation' => '1|string|0-100',
            'date_of_birth' => '1|date',
            'date_of_death' => '1|date',
            'burial_date' => '1|date',
        ];

        if(!$id){
            $exist = DB::table('deceased_registrations')
                ->where('member_id', $arr['member_id'])
                ->where('name', $arr['name'])
                ->where('sex', $arr['sex'])
                ->where('date_of_birth', $arr['date_of_birth'])
                ->where('date_of_death', $arr['date_of_death'])
                ->exists();
            if ($exist) {
                return DV::error('Deceased registration already exist');
            }
        }

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $d = (object)$inputs;
        $id = DBX::saveData($ss, 'deceased_registrations', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends($id, ['deceased_registrations' => $inputs, 'id' => $id]);
        } else {
            return DV::error('Failed to save');
        }
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
        $start_date = $d->start_date ?? null;
        $end_date = $d->end_date ?? null;

        $str_search = '1=1';
        $str_moreWhere = '1=1';

        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(dr.name LIKE '%" . $search_value . "%' OR m.name LIKE '%" . $search_value . "%')";
        }

        if($start_date && $end_date){
            $start_date = date('Y-m-d', strtotime($start_date));
            $end_date = date('Y-m-d', strtotime($end_date));
            $str_moreWhere .= ' AND dr.burial_date BETWEEN \'' . $start_date . '\' AND \'' . $end_date . '\'';
        }

        $date_of_birth = DBX::formatDate("dr.date_of_birth", 'date_of_birth');
        $date_of_death = DBX::formatDate("dr.date_of_death", 'date_of_death');
        $burial_date = DBX::formatDate("dr.burial_date", 'burial_date');

        $query = DB::table('deceased_registrations as dr')
            ->join('members as m', 'm.id', '=', 'dr.member_id')
            ->join('grave_slots as gs' ,'gs.used_id','dr.id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('dr.id, dr.name, dr.sex,dr.relation,'. $date_of_birth . ',' . $date_of_death . ',' . $burial_date . ', dr.member_id,m.code, m.name as member_name,gs.id,gs.slot_number,gs.zone,location_note,used_id')
            ->orderBy('dr.id', 'desc');

        $clone_query = clone $query;
        $count = $clone_query->count('dr.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public function getDetails($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $date_of_birth = DBX::formatDate("dr.date_of_birth", 'date_of_birth');
        $date_of_death = DBX::formatDate("dr.date_of_death", 'date_of_death');
        $burial_date = DBX::formatDate("dr.burial_date", 'burial_date');

        $query = DB::table('deceased_registrations as dr')
            ->join('members as m', 'm.id', '=', 'dr.member_id')
            ->where('dr.id', $id)
            ->selectRaw('dr.id, dr.name, dr.sex,dr.relation,'. $date_of_birth . ',' . $date_of_death . ',' . $burial_date . ', dr.member_id, m.name as member_name')
            ->first();

        return $query;
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $deceased_registration = self::getDetails($id) ?? null;

        return (object) [
            'deceased_registration' => $deceased_registration,
            'members' => GeneralSettings::options_member($ss),
        ];

    }

    public function delete($id)
    {
        $id = $id ?? $this->id;
        if (empty($id)) {
            return DV::error('Invalid ID');
        }
        $res = DB::table('deceased_registrations')->where('id', $id)->delete();
        if ($res) {
            return DV::depends(1, ['id' => $id]);
        }
        return DV::error('Error deleting deceased registration');
    }
}
