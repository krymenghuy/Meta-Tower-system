<?php

namespace App\Models\Mhr;

use Illuminate\Support\Facades\DB;
use Vsd\Vsloquent\VSModel;

class Skill extends VSModel
{
    protected $table = 'skills';

    protected static function applySubsScope($query, $ss, $alias = 's')
    {
        if (!empty($ss->subs_id)) {
            $binSubsId = hex2bin($ss->subs_id);
            $query->where(function ($q) use ($binSubsId, $alias) {
                $q->where("{$alias}.subs_id", $binSubsId)
                    ->orWhereNull("{$alias}.subs_id");
            });
        }

        return $query;
    }

    public static function getOptions($ss)
    {
        $query = DB::table('skills as s')
            ->selectRaw('s.id, s.title, s.title AS skill_name, s.description')
            ->orderBy('s.title');

        self::applySubsScope($query, $ss);

        return $query->get()->values()->all();
    }

    /**
     * Skills available for an employee (join skills + emp_skills).
     * Excludes skills already assigned, except the current one when editing.
     */
    public static function getAvailableForEmployee($emp_id, $ss, $currentSkillId = null)
    {
        $query = DB::table('skills as s')
            ->leftJoin('emp_skills as es', function ($join) use ($emp_id) {
                $join->on('es.skill_id', '=', 's.id')
                    ->where('es.emp_id', '=', (int) $emp_id);
            })
            ->selectRaw('s.id, s.title, s.title AS skill_name, s.description')
            ->orderBy('s.title');

        self::applySubsScope($query, $ss);

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
