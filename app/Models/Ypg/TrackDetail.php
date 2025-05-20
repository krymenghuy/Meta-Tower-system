<?php

namespace App\Models\Formal;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Vsd\Database\DBX;
use Vsd\Response\DV;
use App\Models\GeneralSettings;
class TrackDetail
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'track_id' => '1|number',
            'attendance_circle_id' => '1|number',
            'checkin_time' => '0|string',
            'checkout_time' => '0|string',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;

        if(!$id){
            $exist = DB::table('track_details')
                ->where('track_id', $inputs['track_id'])
                ->where('attendance_circle_id', $inputs['attendance_circle_id'])
                ->selectRaw('id')
                ->first();
            if($exist){
                return DV::error('Track detail already exist');
            }
        }
        $id = DBX::saveData($ss, 'track_details', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['track_details' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving track details.');
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
        $attendance_circle_id = $d->attendance_circle_id ?? null;
        $track_id = $d->track_id ?? null;
        $str_search = '1=1';
        $str_wheres = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = addslashes($search_value);
            $str_search = DBX::whereLowerCase('at.name',"%$search_value%",'like');

        }
        if ($attendance_circle_id) {
            $str_wheres = "td.attendance_circle_id = " . $attendance_circle_id;
        }
        if ($track_id) {
            $str_wheres = "td.track_id = " . $track_id;
        }

        $query = DB::table('track_details as td')
            ->join('attendance_tracks as at', 'at.id', '=', 'td.track_id')
            ->join('attendance_circles as ac', 'ac.id', '=', 'td.attendance_circle_id')
            ->whereRaw($str_search)
            ->whereRaw($str_wheres)
            ->selectRaw('td.id,td.track_id,at.name as track_name,td.attendance_circle_id as attendance_circle_id,ac.name as attendance_circle,td.checkin_time,td.checkout_time')
            ->orderBy('td.id', 'desc');

            $clone_query = clone $query;
            $count = $clone_query->count('td.id');
            $rows = $query->skip($skip_rows)->take($per_page)->get();
            return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    public function getDetails($id)
    {
        $row =  DB::table('track_details as td')
            ->join('attendance_tracks as at', 'at.id', '=', 'td.track_id')
            ->join('attendance_circles as ac', 'ac.id', '=', 'td.attendance_circle_id')
            ->selectRaw('td.id,td.track_id,at.name as track_name,td.attendance_circle_id,ac.name as attendance_circle,td.checkin_time,td.checkout_time')
            ->where('td.id',$id)
            ->first();
        return $row;
    }

    public function delete($id = null)
    {
        $id = $id ?? $this->id;
        $deleted = DB::table('track_details')->where('id', $id)->delete();
        return $deleted ? DV::depends($deleted, ['action' => 'deleted']) : DV::error('Delete failed.');
    }

    public function getFormOptions($id,$ss)
    {
        $subs_id = $ss->subs_id;
        $track_details = self::getDetails($id) ?? null;

        return (object) [
            'track_details' => $track_details,
            'attendance_circles'=> DB::table('attendance_circles')->selectRaw('name, id')->get(),
            'attendance_tracks'=>GeneralSettings::options_attandance_track($ss),

        ];

    }

}
