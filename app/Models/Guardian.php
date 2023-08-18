<?php

namespace App\Models;
use Illuminate\Pagination\LengthAwarePaginator;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Guardian //extends Model
{
    // use HasFactory;

    protected static $img_dir = 'guardiains';
    static function save($arr=[],$id=null,$ss){
        $v_rule = [
            'name' => '0|string|1,30',
            'email' => '0|string',
            'photo' => '0|image',
            'phone_number' => '0|number|9,16',
            'profession' => '0|string',
            'address' => '0|string',
            'religion' => '0|string',
            'n_id' => '0|string|1,30'
        ];

        $res = validateObject($arr,$v_rule,1,['email' => ['@','.']],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $existPhone = DB::table('guardians')->where('phone_number',$inputs['phone_number'])->exists();
        if($existPhone) return DV::error('Phone number is already used');
        $existEmail = DB::table('guardians')->where('email',$inputs['email'])->exists();
        if($existEmail) return DV::error('Email is already used');

        $newID = saveData($ss,'guardians',['id' => $id],$inputs,[],1);
        if($newID){
            PublicStorage::saveImage($ss->branch_id,self::$img_dir,);
        }

        return $inputs;
    }


    static function guardianList($filter,$ss){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%')";
        }

        $selectCols = 's.id as student_id,inv.due_amount,inv.paid_amount,inv.is_paid,inv.id,inv.updated_at as paid,e.session_id,s.code as student_code,inv.invoice_date,inv.due_date,e.program_id,e.level_id,s.name as student_name,p.status_id as pstatus_id,e.academic_year,e.start_date,e.tuition_end_date,inv.due_date,inv.invoice_number,inv.amount';
        $query =  DB::table('guardians')
                ->whereRaw($str_search)
                // ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->orderBy('inv.id','desc');

        $count_query = clone $query;
        $count = $count_query->count('inv.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach($rows as $row) {

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
}
