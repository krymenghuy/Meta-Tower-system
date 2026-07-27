<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Vsloquent\VSModel;

class Skill extends VSModel
{
    protected $userInfo = null;
    protected $table = 'skills';

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function upsert($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;

        $v_rule = [
            'title' => '1|string|0-100|text=name_required::@key;@max;@value',
            'description' => '0|string|0-300',
        ];
        $chars = ['$', '#', '@', '!', '/', '.', '-', '_', '=', '?', "'"];
        $res = DBX::validateObject($arr, $v_rule, true, ['title' => $chars, 'description' => $chars], $ss->lang, false, null);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $exists = DB::table('skills')
            ->where('title', $inputs['title'])
            ->when($id, function ($q) use ($id) {
                $q->where('id', '<>', $id);
            })
            ->exists();
        if ($exists) {
            return DV::error('Skill name already exists.');
        }

        $id = DBX::saveData($ss, 'skills', ['id' => $id], $inputs, [], 1, false);
        return DV::depends($id, ['action', 'skill saved'], 'Failed to save Skill Information');
    }

    public function getSkillListPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;

        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $search_value = $d->search_value ?? null;
        $str_search = '1=1';

        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $str_search = "(s.title LIKE '%" . $search_value . "%')";
        }

        $skip_rows = ($current_page - 1) * $per_page;
        if ($search_value) {
            $skip_rows = 0;
        }

        $query = DB::table('skills as s')
            ->whereRaw($str_search)
            ->selectRaw('s.id, s.title, s.title AS name, s.description, s.updated_at, s.update_user')
            ->orderBy('s.id', 'DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            setOfficialDates($row, [''], ['updated_at'], ['']);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getDetails($id, $ss = null)
    {
        $row = DB::table('skills as s')
            ->selectRaw('s.id, s.title, s.title AS name, s.title AS skill_name, s.description, s.updated_at, s.update_user')
            ->where('s.id', $id)
            ->first();

        if ($row) {
            setOfficialDates($row, [], ['updated_at'], []);
        }

        return $row;
    }

    public function deleteSkill($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $inUse = DB::table('emp_skills')->where('skill_id', $id)->exists();
        if ($inUse) {
            return DV::error('Cannot delete this skill because it is assigned to one or more employees.');
        }

        $deleted = DB::table('skills')->where('id', $id)->delete();
        return DV::depends($deleted, null, 'Error deleting skill');
    }

    public static function getFormOptions($id, $ss)
    {
        $skill = null;
        if ($id) {
            $skill = self::getDetails($id, $ss);
        }

        return (object) [
            'skills' => DB::table('skills')->selectRaw('id, title, title AS skill_name, description')->orderBy('title', 'ASC')->get(),
            'skill' => $skill,
        ];
    }

    public function getAdminFormOptions($id, $ss = null)
    {
        $skill = null;
        if ($id) {
            $skill = self::getDetails($id, $ss);
        }

        return (object) [
            'skills' => $skill,
        ];
    }
}
