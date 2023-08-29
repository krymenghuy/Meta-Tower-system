<?php

namespace App\Models;
use Illuminate\Pagination\LengthAwarePaginator;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Guardian //extends Model
{
    // use HasFactory;

    protected $img_dir = 'guardiains',$id = null, $ss = null;

    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }
    function save($arr=[],$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->ss;
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
            PublicStorage::saveImage($ss->branch_id,self::$img_dir,null,$image,null,['id'=>$newID,'store'=>'guardians.file_name']);
        }

        return $inputs;
    }


    function guardianList($filter,$ss=null){
        $ss = $ss?$ss:$this->ss;
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
            $str_search ="(.code ='$search_value' OR st.name LIKE '%$search_value%')";
        }

        $selectCols = 'g.id as guardian_id,g.role,g.name, g.phone_number, g.email, g.n_id, sg.family_code';
        $query =  DB::table('student_guardians as sg')
            ->join('guardians as g', 'g.id', '=', 'sg.guardian_id')
            ->selectRaw($selectCols);


        $count_query = clone $query;
        $count = $count_query->count('guardian_id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        $groupedParents = [];
        foreach ($rows as $p) {
            $familyCode = $p->family_code;

            if (!isset($groupedParents[$familyCode])) {
                $groupedParents[$familyCode] = [
                    "family_code" => $familyCode,
                    "parents" => []
                ];
            }

            $groupedParents[$familyCode]["parents"][] = [
                'id' => $p->guardian_id,
                "role" => $p->role,
                "name" => $p->name,
                "phone_number" => $p->phone_number,
                "email" => $p->email,
                "n_id" => $p->n_id
            ];
        }

        $groupedParents = array_values($groupedParents);

        return new LengthAwarePaginator($groupedParents, $count, $per_page, $current_page);
    }

    function connectToChild($arr,$ss){
        $d = (object)$arr;
        $inputs = [
            'student_id' => $d->student_id,
            'guardian_id' => $d->guardian_id,
        ];
        $exists =  DB::table('student_guardians')->where('student_id',$d->student_id)->where('guardian_id',$d->guardian_id)->exists();
        if($exists) return DV::error('Already connected');
        $newID = saveData($ss,'student_guardians',['id' => null],$inputs,[],1);
        return DV::depends($newID,'Connected');
    }

    function parentChildren($arr=[],$ss=null){
        $d = (object)$arr;
        $ss = $ss?$ss:$this->ss;
        $family_id = isset($d->family_id)?$d->family_id:null;
        $guardian_id = isset($d->guardian_id)?$d->guardian_id:null;
        $str_search = '1=1';
        if($family_id || $guardian_id){
            $str_search = "family_code='$family_id' OR guardian_id = '$guardian_id'";
        }
        // $group_data = [];
        $rows = DB::table('student_guardians')
            ->whereRaw($str_search)
            ->select('student_id','family_code')
            ->distinct()
            ->get();
        // if ($family_id || $guardian_id) {
        //     $str_search = "family_code = '$family_id' OR guardian_id = '$guardian_id'";
        // }

        $groupedData = [];

        // $rows = DB::table('student_guardians')
        //     ->whereRaw($str_search)
        //     ->select('student_id', 'family_code as family_id')
        //     ->distinct()
        //     ->get();

        foreach ($rows as $row) {
            $studentId = $row->student_id;
            $familyId = $row->family_code;

            if (!isset($groupedData[$familyId])) {
                $groupedData[$familyId] = [
                    'family_id' => $familyId,
                    'children' => []
                ];
            }

            $groupedData[$familyId]['children'][] = [
                'student_id' => $studentId
            ];
        }

        // foreach($rows as $row){
        //     $studentId = $row->student_id;
        //     $familyId = $row->family_code;
        //     if (!isset($group_data[$family_id])) {
        //         $group_data[$family_id] = [
        //             'family_id' => $family_id,
        //             'students' => [],
        //         ];
        //     }

        //     $group_data[$familyId]['students'][] = [
        //         'student_id' => $studentId
        //     ];
        // }

        if(!isset($rows)) return  null;
        return array_values($groupedData);
    }

}
