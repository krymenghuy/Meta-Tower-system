<?php

namespace App\Models;
use Illuminate\Pagination\LengthAwarePaginator;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Guardian //extends Model
{
    // use HasFactory;

    protected $img_dir = 'guardians',$id = null, $ss = null;
    protected static $def_password = '123456'; // default password for request parent account

    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }
    function save($arr=[],$id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $parent_info = isset($d->parent_info) ?$d->parent_info:null;
        if(!$parent_info) return DV::error('parent_info is required');
        $success=0;
        foreach($parent_info as $info){
            $v_rule = [
                // 'name' => '0|string|1,30',
                // 'email' => '0|string',
                'photo' => '0|image',
                // 'phone_number' => '0|number|9,16',
                // 'profession' => '0|string',
                // 'address' => '0|string',
                // 'religion' => '0|string',
                // 'n_id' => '0|string|1,30'
            ];
            $img_char = ['+',':',',',';','=','/','\\','?'];
            $res = validateObject($info,$v_rule,1,['email'=>['@','.','_'],'photo'=>$img_char],$ss->lang,0,null);
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            // $email = $inputs['email'];
            $image = $inputs['photo'];

            unset($inputs['photo']);
            $id = $info['id'];
            // $user = DB::table('guardians')->where('id',$id)->first();
            // if ($user->email !== $email) {
            //     $existingUser = DB::table('guardians')
            //         ->where('email', $email)
            //         ->first();
            //     if ($existingUser) {
            //         return DV::error('Email already exists');
            //     }
            // }

            $newID = saveData($ss,'guardians',['id' => $id],$inputs,[],1);

            if($newID){
                PublicStorage::saveImage($ss->branch_id,$this->img_dir,null,$image,null,['id'=>$newID,'store'=>'guardians.file_name']);
            }
            $success++;
        }

        return DV::depends($success,'Updated');

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

        $selectCols = 'g.id as guardian_id,g.role,g.name, g.phone_number, g.email, g.n_id, sg.family_code,g.file_name';
        $query =  DB::table('student_guardians as sg')
            ->join('guardians as g', 'g.id', '=', 'sg.guardian_id')
            ->distinct()
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
            $p->image_url = PublicStorage::getUrl($branch_id,'guardians','image').$p->file_name;

            $groupedParents[$familyCode]["parents"][] = [
                'id' => $p->guardian_id,
                "role" => $p->role,
                "name" => $p->name,
                "phone_number" => $p->phone_number,
                "email" => $p->email,
                "n_id" => $p->n_id,
                'image_url' => $p->image_url
            ];
            unset($p->file_name);

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
        $branch_id = $ss->branch_id;
        $family_id = isset($d->family_id)?$d->family_id:null;
        $guardian_id = isset($d->guardian_id)?$d->guardian_id:null;
        $str_search = '1=1';
        if($family_id || $guardian_id){
            $str_search = "family_code='$family_id' OR guardian_id = '$guardian_id'";
        }
        $rows = DB::table('student_guardians')
            ->whereRaw($str_search)
            ->select('student_id', 'family_code')
            ->groupBy('student_id', 'family_code')
            ->get();

        $groupedData = [];

        foreach ($rows as $row) {

            $studentId = $row->student_id;
            $familyId = $row->family_code;

            $child = DB::table('students')->where('id', $studentId)->first();
            if ($child) {
                if(isset($child->file_name) == null) {
                    $child->image_url = '';
                }else $child->image_url = PublicStorage::getUrl($branch_id,'students','image').$child->file_name;
                $groupedData[] = $child;
            }
        }

        return $groupedData;
    }


    function requestAccount($arr=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|1-50',
            'sex' => '1|choice|F,M',
            'phone_number' => '1|string|1-20',
            'email' => '0|string',
            'address' => '1|string|1-200',
            'religion' => '0|string|1-100',
            'national_id' => '1|string',
            'photo' => '0|image',
            'student_id' => '1|number|exists=students.id',
            'password' => '0|string',
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $student_id = $inputs['student_id'];
        unset($inputs['student_id']);
        $inputs['n_id'] = $inputs['national_id'];
        unset($inputs['national_id']);
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $password = isset($inputs['password'])?$inputs['password']:null;
        unset($inputs['password']);

        $inputs['role'] = $inputs['sex'] == 'F'?'mother':'father';

        $uniqueEmail = isUnique('guardians','email',$inputs['email']);
        $uniquePhoneNumber = isUnique('guardians','phone_number',$inputs['phone_number']);
        if($uniqueEmail) return DV::error('Email already exists');
        if($uniquePhoneNumber) return DV::error('Phone number already exists');

        $family_code = DB::table('student_guardians')->where('student_id',$student_id)->selectRaw('student_id,family_code')->distinct()->first()->family_code;
        $new_guardianID = saveData($ss,'guardians',['id' => null],$inputs,[],1);
        if($new_guardianID>0){
            $um = new UM();

            PublicStorage::saveImage($branch_id,'guardians',null,$image,null,['id' => $new_guardianID,'store'=>'guardians.file_name']);

            $um_info= [
                'login_name' => $inputs['phone_number'],
                'user_class' => 'parent',
                'role_id' => '16',
                'official_id' => $new_guardianID,
                // 'official_code' =>$student_code,
                'email' => $inputs['email'],
                'password' => $password?$password:self::$def_password,
                'full_name' => $inputs['name'],
            ];
            $um_ = $um->saveUser($um_info,$ss);

            //** link student to requested guardian */
            $newGuardian = DB::table('student_guardians')->insert([
                'student_id' => $student_id,
                'guardian_id' => $new_guardianID,
                'family_code' => $family_code,
                'guardian_role' => $inputs['sex'] == 'F'?'mother':'father'
            ]);

        }
        return DV::depends($new_guardianID,'Created');
    }



    // function isUnique($tableName, $columnName, $value, $exceptId = null)
    // {
    //     $query = DB::table($tableName)->where($columnName, $value);

    //     if (!is_null($exceptId)) {
    //         $query->where('id', '!=', $exceptId);
    //     }

    //     return $query->count() === 0;
    // }

}
