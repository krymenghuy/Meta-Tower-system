<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Vsloquent\VSModel;

class Skill extends VSModel
{
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    static function getOptions($ss)
    {
        $query = DB::table('skills as s')
            ->selectRaw('s.id, s.title, s.title AS skill_name, s.description')
            ->orderBy('s.title');

        return $query->get()->values()->all();
    }

    static function getAvailableForEmployee($emp_id, $ss, $currentSkillId = null)
    {
        $query = DB::table('skills as s')
            ->leftJoin('emp_skills as es', function ($join) use ($emp_id) {
                $join->on('es.skill_id', '=', 's.id')
                    ->where('es.emp_id', '=', (int) $emp_id);
            })
            ->selectRaw('s.id, s.title, s.title AS skill_name, s.description')
            ->orderBy('s.title');

        if ($emp_id && is_numeric($emp_id)) {
            $query->where(function ($q) use ($currentSkillId) {
                $q->whereNull('es.id');
                if ($currentSkillId) {
                    $q->orWhere('s.id', (int) $currentSkillId);
                }
            });
        }

        return $query->get()->values()->all();
    }
}
