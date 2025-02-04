<?php

namespace App\Models\Umt;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;
use App\Services\Umt\AuthService;
use App\Models\DBX;
use DB;
class Branch //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    function __construct($id = null,$userInfo=null)
    {
       $this->id = $id;
       $this->userInfo = $userInfo;   
    }

    static function list($arr, $ss){
        $d = (object)$arr;
        $subs_id =  $ss->subs_id ?? getCurrentSubsId(true);
        $bin_subs_id = hex2bin($subs_id);
        $search_value = $d->search_value ?? null;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;
        
        $audit_info = DBX::query_user_info('b','updated_at',true,'created_at');
        $str_search = $search_value ? ' b.name LIKE \'%'.escape_like_str($search_value).'%\'': '3=3';

        $query =  DB::table(DBX::$branch_table.' as b')->where('b.subs_id',$bin_subs_id)->whereRaw($str_search)->selectRaw('b.id,b.name,b.name_kh,b.address_kh,b.address,b.shortcut,email,b.phone_number,b.first_cp_name,b.second_cp_name,b.first_cp_phone,b.second_cp_phone,'.$audit_info);
        $count_query = clone $query;
        $count = $count_query->count('b.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as &$row){
            $director_id = $row->director_id ?? null;
            $row->director_name = $director_id ? self::getDirectorName($director_id): '';

        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

 static function getDirectorName($director_id){
    try{
        $name = DB::table('employees as e')->where('id',$director_id)->value('name');
        return $name;
    }catch (\Exception $e) {
        return '';
    }
 }
    static function details($id,$ss){
        $ss = $ss ?? AuthService::user();
        $subs_id = $ss->subs_id;
        return DB::table(DBX::$branch_table.' as b')->where('b.subs_id',hex2bin($subs_id))->where('b.id',$id)->selectRaw('b.id,b.name,b.director_id,b.website,director_id,b.address,b.address_kh,b.shortcut,b.phone_number,b.first_cp_name,b.second_cp_name,b.first_cp_phone,b.second_cp_phone')->first();
    }

    function save($arr,$id = null, $ss = null){
        $ss = $ss ?? AuthService::user();
        $subs_id = $ss->subs_id;
        $id = $id ?? $this->id;
        $v_rule = [
            'name'=>'1|string|1-250',
            'name_kh'=>'0|string|1-250',
            'website'=>'0|string|0-250',
            'address'=>'0|string|0-250',
            // 'shortcut'=>'1|string|1-30',
            'phone_number'=>'0|string|1-20',
            'first_cp_name'=>'0|string|1-25',
            'first_cp_phone'=>'0|string|1-20',
            'second_cp_name'=>'0|string|0-25',
            'second_cp_phone'=>'0|string|0-20'
        ];
        $website_char = ['.',':',',',';','=','/','-','_','?'];
        $res = validateObject($arr, $v_rule,true,['website'=>$website_char],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $name_kh = $inputs['name_kh'];
        $inputs['name_kh'] = $name_kh ?? $inputs['name'];
        $inputs['subs_id'] = hex2bin($subs_id);
        $subs_id = $inputs['subs_id'];

        $branch_id = $id;
        $action = $id ? 'update':'create';
        $inputs['phone_number'] = str_replace(' ','',$inputs['phone_number']);
        $branch_id = saveData($ss,DBX::$branch_table,['id'=>$branch_id],$inputs,[],0);
        return DV::depends($branch_id, ['branch_id'=>$branch_id]);
        // return DV::depends($id); 
    }
 
    function delete($id,$ss=null){
        $ss = $ss ?? AuthService::user();
        $subs_id = $ss->subs_id;
        // $bin_app_id = hex2bin($id);
        $delete = DB::table(DBX::$branch_table)->where('id',$id)->where('subs_id',hex2bin($subs_id))->delete();
        if($delete)
            DB::table('um_user_Branches')->where('branch_id',$id)->delete();
        return DV::depends($delete);
    }

    static function getFormOptions($id,$user_id = 0 ,$ss){
       
        $ss = $ss ?? AuthService::user();
        $subs_id = $ss->subs_id;

        $branches = DB::table(DBX::$branch_table.' as b')->join('um_subscriptions as sb','sb.id','=','b.subs_id')->where('sb.id',hex2bin($subs_id))->selectRaw('b.id,b.name as branch_name')->get();
        if ($user_id){
            foreach($branches as $branch){
                $check = DB::table('um_user_branches as ub')->where('ub.branch_id',$branch->id)->where('ub.user_id',$user_id)->value('ub.id');
                if($check)$branch->allowed = 1;
                else $branch->allowed = 0;
            }
        }
        
      return (object)[
        'branch'=>self::details($id,$ss),
        'users'=>UMTSettings::options_user(null,$ss),
        'branches'=>$branches,
      ];

    }
     static function setDirector($arr, $ss){
        $d = (object)$arr;
        $branch_id = $d->branch_id ?? null;
        if (empty($d->id) || empty($branch_id)) {
            return ['success' => 0, 'message' => 'Invalid director or branch ID'];
        }
        $exist = DB::table('um_branches')->where('director_id',$d->id)->where('id','!=',$branch_id)->exists();
        if($exist){
            return DV::error('This employee is already a director of another branch');
        }
       
    
        $updated = DB::table('um_branches')->where('id', $branch_id)->update(['director_id' => $d->id]);
    
        if ($updated) {
            return DV::success(['message' => 'Director assigned successfully']);
        } else {
            return DV::error('No changes made or branch not found');
        }

    }

  
}

