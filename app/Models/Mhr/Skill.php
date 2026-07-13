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

    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('skills as s')->selectRaw('s.id,s.title,s.title AS skill_name,s.description')->where('s.id', $id)->first();
        return $row;
    }
    static function getFormOptions($id, $ss)
    {
        $skill = null;
        if ($id) {
            $skill = self::getDetails($id, $ss);
        }
        return (object) [
            'skills' => DB::table('skills')->selectRaw('id,title,title AS skill_name,description')->orderBy('id', 'ASC')->get(),
            'skill' => $skill,
        ];
    }
}
