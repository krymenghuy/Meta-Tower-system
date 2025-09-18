<?php

namespace App\Models\Prm;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;


class Contract 
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'contracts';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function createContract($arr = [],$id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'name' => '1|string|0-200|text=Tenant name must be provided',
            'legal_name' => '0|string|0-250',
            'phone_number' => '0|phone|0-23',
            'email' => '0|email|1-50',
            'address' => '0|string|0-350',
        ];
        $email_char = ['@','.','-','_'];
        $address_char = ['@',',','.','#'];
        $res = DBX::validateObject($arr,$v_rule,1,['email'=>$email_char,'address'=> $address_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        if(!$id) {
            $exist = DB::table('contracts')->where('phone_number',$inputs['phone_number'])
                ->where('name',$inputs['name'])
                ->exists();
                if($exist){
                    return DV::error('Create failed: This Tenant already exists');
                }
        }
        $id = DBX::saveData($ss,'contracts',['id'=>$id],$inputs,[],1);
        if($id > 0){
            return DV::depends(1,['contracts'=>$inputs,'id'=>$id]);
        }
        return DV::error('Error saving tenant...!');
    }

    public function getListPaginate($arr, $ss = null){
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = isset($arr['search_value']) ? $arr['search_value'] : null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $search_value = $d->search_value ?? null;
        $str_search = "1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" . $search_value ."%' OR t.phone_number LIKE '%" . $search_value . "%' OR t.legal_name LIKE '%" . $search_value . "%')";
        }
        $updated_at = DBX::formatTime("t.updated_at", 'updated_at');
        $query = DB::table('contracts as t')
            ->whereRaw($str_search)
            ->selectRaw("t.id,t.name,t.legal_name,t.phone_number,t.email,t.address,$updated_at,t.update_user")->orderBy('t.id','DESC');
        $clone_query = clone $query;
        $count = $clone_query->count('t.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);

    }

    public static function getDetails($id){
        return DB::table('contracts as t')
            ->where('t.id',$id)
            ->selectRaw('t.id,t.name,t.legal_name,t.phone_number,t.email,t.address')
            ->first();
    }

    public static function getFormOptions($id){
        $details = $id ? self::getDetails($id) : null;
        return (object) [
            'contracts' => $details,
        ];
    }
    
    public function delete($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('contracts')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }
    
}
