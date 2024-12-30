<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Skill
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'skills';

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
            'title' => '1|string|0-150',
            'description' => '0|string|1-250',
            'image' => '0|image',
        ];
        $checkUnique = [
            "$branch_id|skills|title|id=id|text=Skill already exists by title",
        ];
        $res = validateObject($arr, $v_rule, true, ['image' => GeneralSettings::$image_chars], $ss->lang, false,$checkUnique);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $d = (object) $inputs;
        $image = $d->image;

        unset($inputs['image']);
        $skill_create = !$id;

        $delete_prev_image = ($id > 0 && (!$image || isImage($image)));
        $id = saveData($ss, 'skills', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('skills')->where('id', $id)->take(1)->value('image_file_name');
                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }
                DB::table('skills')->where('id', $id)->update(['image_file_name' => null]);
            }
            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $image, null, ['id' => $id, 'store' => 'skills.image_file_name']);
            return DV::depends(1, ['skills' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving data');
    }
    function getSkills($arr, $ss)
    {
        $d = (object) $arr;
    
        $search_value = $d->search_value ?? null;
    
        $query = DB::table('skills as s')
            ->selectRaw('s.id, s.title, s.description, s.image_file_name')
            ->where('s.branch_id', $ss->branch_id);
    
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("(s.title LIKE '%" . $search_value . "%' OR s.description LIKE '%" . $search_value . "%')");
        }
    
        $query->orderBy('s.id', 'asc');
        $rows = $query->get();
    
        foreach ($rows as $row) {
            $row->image_url = $row->image_file_name ? self::getProfilePicture($row->id) : '';
            unset($row->image_file_name);
        }
    
        return $rows;
    }
    function getSkillsPaginate($arr, $ss)
{
    $subs_id = $ss->subs_id;
    $d = (object) $arr;
    $branch_id = $ss->branch_id;
    $current_page = $d->current_page ?? 1;
    $per_page = $d->per_page ?? 12;
    if (!is_numeric($current_page)) {
        $current_page = 1;
    }
    $skip_rows = ($current_page - 1) * $per_page;
    $search_value = $d->search_value ?? null;
    $str_search = '1=1';
    if ($search_value) {
        $search_value = escape_like_str($search_value);
        $str_search = "(s.title LIKE '%" . $search_value . "%')";
    }

    $query = DB::table('skills as s')
        ->leftJoin('emp_skills as es', 's.id', '=', 'es.skill_id')
        ->whereRaw($str_search)
        ->selectRaw('
            s.id, 
            s.title, 
            s.description, 
            s.image_file_name, 
            COUNT(es.emp_id) as count_member
        ')
        ->groupBy('s.id', 's.title', 's.description', 's.image_file_name')
        ->orderBy('s.id', 'DESC');

    $count_query = clone $query;
    $count = $count_query->count('s.id');
    $rows = $query->skip($skip_rows)->take($per_page)->get();

    foreach ($rows as $row) {
        $row->image_url = '';
        if ($row->image_file_name) {
            $row->image_url = self::getSkillPhoto($row->id);
        }
        unset($row->image_file_name);
    }

    return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

   

    function getDetails($id)
    {
        $row = DB::table('skills')
            ->selectRaw('id, title, description, image_file_name')
            ->where('id', $id)
            ->first();
            if ($row) {
                $row->image_url = self::getSkillPhoto($id);
            } else {
                $row = null; // Or handle the case where employee is not found
            }

            return $row;
        }
    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
       
        $file_name = DB::table('skills as s')
            ->where('s.id', $id)
            ->take(1)
            ->value('s.image_file_name');
        if ($file_name) {
            PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
        }
        $deleted = DB::table('skills')->where('id', $id)->delete();
        if (!$deleted) {
            return DV::error('skill not found or not deleted');
        }
        $query = DB::table('skills')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();
       

        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

    function getFormOptions($id, $ss)
    {
        $skill = null;
        if ($id) {
            $skill = self::getDetails($id, $ss);
        }
        return (object) [


            'skill' => $skill,
        ];

    }


    static function saveSkillPhoto($d,$ss)
  {
    $skill_id = $d->id;
    if(!$skill_id) return DV::error('Invalid skill ID');

	  $file_type = isset($d['file_type'])?$d['file_type']:'png';
    $photo = isset($d['photo_data'])?$d['photo_data']: (isset($d['photoData'])?$d['photoData']:null);
    $delete_photo = (!$photo || isImage($photo));
    $logo_file_name = DB::table('skills')->where('id',$skill_id)->selectRaw('image_file_name')->value('image_file_name');
    if ($delete_photo){
      PublicStorage::delete (['subs_id'=>$ss->subs_id, 'branch_id'=>null,'dir'=>self::$img_dir],'image',$logo_file_name);
      DB::table('skills')->where('id', $skill_id)->update(['image_file_name' => null]);
    }
    $maxSize =500;
	  $res = PublicStorage::saveImage(['subs_id'=>$ss->subs_id,'branch_id'=>null,'dir'=>self::$img_dir],$file_type,$photo,$maxSize,['id'=>$skill_id,'store'=>'skills.image_file_name']);
    if($res->status ==='Error') return DV::error($res->error_message);
    $img = self::getSkillPhoto($skill_id);
    return DV::depends(1, ['image_url'=>$img]);
    }
    static function defaultPhoto($subs_id)
    {
        return url('') . '/assets/images/default/default-skill.svg';
    }
    public static function getSkillPhoto($id)
    {
       
        $col_subs_id = DBX::getHex('s.subs_id', 'subs_id');
        $row = DB::table('skills as s')->where('id', $id)->selectRaw($col_subs_id . ',s.branch_id,s.image_file_name')->first();
        $def_image = self::defaultPhoto($row ? $row->subs_id : null);
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'skills'], 'images') . $row->image_file_name;
            return validateUrl($url,$def_image);
        } else return $def_image;
    }
    function deleteSkillPhoto($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $skill = DB::table('skills as s')->where('id', $id)->selectRaw('id,image_file_name')->first();
        if (!$skill) return DV::error('Skill identity is not correct!');
        PublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'image', $skill->image_file_name);
        DB::table('skills')->where('id', $id)->update(['image_file_name' => null]);
        return DV::success();
    }

}



