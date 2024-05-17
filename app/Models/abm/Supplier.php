<?php

namespace App\Models\Abm;
use DB;
use App\Models\DV;
use App\Models\JDV;
use App\Models\Dms\PublicStorage;
use Illuminate\Pagination\LengthAwarePaginator;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Sanitizer;
class Supplier //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'supplier';
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    function save($arr, $id=null,$ss=null){
        // $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id'=>'0|identity=1',
            'name' => '1|string|1-150',
            'phone_number'=>'1|string|1-20',
            'email'=>'0|string',
            'address'=>'0|number',
            'sales_agent_id'=>'0|number',
            'code'=>'0|string|0-25',         //Add new code column to table supplier
            'price_list_id'=>'0|number',
            'status_code'=>'0|string|default =Active',
            'photo'=>'0|image'        //Add new photo_file_n33ame to table supplier
    ];
        $eml_char = ['$','#','@','!','.','-','_','=','?'];
        $img_char = ['+',':',',',';','/','\\','=','?'];

        $res = validateObject($arr,$v_rule,1,['email'=>$eml_char,'photo'=>$img_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id; 
        $d = (object)$inputs;
        $photo = $d->photo;
        // return JDV::result($inputs);
        $phone_err = $this->checkUniquePerson($branch_id,$inputs['phone_number'],$id);
        if ($phone_err) return DV::error( $phone_err);  
        // $check = isExist('suppliers',$id,['phone_number'=>$inputs['phone_number']]);
        // if($check) return DV::error('Phone number is already save...');
        unset($inputs['photo']);
        $supplier_created = !$id;
        // return JDV::result($inputs);

        $delete_prev_image =($id > 0 && (!$photo || isImage($photo)));
        $id = saveData($ss,'suppliers',['id'=>$id],$inputs,[],1,0);   
        if($id > 0){
            $new_code = null;
            if($delete_prev_image){
                $file_name = DB::table('suppliers as s')->where('s.id',$id)->take(1)->value('s.photo_file_name');
                if($file_name) PublicStorage::delete($branch_id,self::$img_dir,'image',$file_name);
                DB::table('suppliers as s')->where('s.id',$id)->update(['photo_file_name'=>null]);
            }
            PublicStorage::saveImage($branch_id,self::$img_dir,null,$photo,null,['id'=>$id,'store'=>'suppliers.photo_file_name']);  
            
            if ($supplier_created){
                $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
                //$inputs['code'] = $new_code;
                DB::table('suppliers')->where('id',$id)->update(['code'=>$new_code]);
             }

        }
    //    return DV::error('Something went wrong in saving sender profile');
        return DV::depends($id,['action'=>'saved']);

    }

    function getSuplierList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('suppliers')->selectRaw('id,name, phone_number, email, address,status_code,price_list_id,formatDate(create_date) as create_date,DATE_FORMAT(create_date,\'%r\') AS request_time')->get();
    }

    function checkUniquePerson($branch_id,$phone_number,$id=null){
        $str_id ="1=1";
        if(!$phone_number) return 'Phone number cannot be empty';
        if ($id>0) $str_id="s.id <> $id";
        $x = DB::table('suppliers as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'Phone number "'.$phone_number.'" is already save...';
        return null;
      }

    function getOverseaItemList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('oversea_items')->selectRaw('item_type, billed_weight, actual_weight, allocated_kg, heigth, weigth, length')->get();
    }

    function List(){
        return DB::table('requirements')->selectRaw('project_id,description,status_id')->get();
    }

    
    function getSuplierListPaginate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $status_code = isset($d->status_code)?$d->status_code:null;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $str_srch = '1=1';
        $str_where = '1=1';
        if($search_value){
            $skip_row = 0;
            $str_srch = '(s.name LIKE \'%'.$search_value.'%\')';
        }
        if($status_code){
            $str_where = 's.status_code = \''.$status_code.'\'';
        }
        // if($price_list_id){
        //     $str_where = 's.price_list_id = '.$price_list_id;
        // }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('suppliers as s')
                ->join('affiliates as sa','sa.id','s.sales_agent_id')
                ->whereRaw($str_srch)
                ->whereRaw($str_where)
                ->selectRaw('s.id ,s.code, s.name, s.phone_number,s.photo_file_name, s.email, s.address, s.status_code,s.branch_id, s.price_list_id,getPriceListName(s.price_list_id) AS price_list_name,s.sales_agent_id,sa.agent_type,sa.name as sales_agent,s.create_user,formatDate(s.create_date) as created_at,DATE_FORMAT(s.create_date,\'%r\') AS request_time' )->orderBy('s.id', 'DESC');;
       
        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        $rows = $query->skip($skip_row)->take($per_page)->get();
        foreach($rows as $row){
            $row->image_url = '';
            if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'general','image').$row->photo_file_name;
            unset($row->photo_file_name);
            if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        }
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
        // return $rows;

    }

    static function defaultImage($branch_id){
        return PublicStorage::getUrl($branch_id,'default','image').'mr3.jpg';
    }

    function setPriceList($price_list_id,$id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $p = getDataRow('price_list_names',["id"=>$price_list_id],"id,name");
        if(!$p) return DV::error("Price list ID is not valid");
        $p_name = $p->name;
        DB::table('suppliers')->where('id',$id)->update(array(
        'price_list_id'=>$price_list_id));
        // return JDV::result($price_list_id );
        return DV::success(['list_name'=>$p_name,'list_id'=>$price_list_id]);
    }

    // function details($id,$ss){
    //     $id = $id ?? $this->id;
    //     $branch_id = $ss->branch_id;

    //     $row = DB::table('requirements as r')->where('r.id',$id)->where('r.branch_id',$branch_id)->selectRaw('r.id,r.project_id,r.description,r.status_id')->first();
    //     return $row;
    // }
    
    function delete($id){

        $id = $id ?? $this->id;

        $delete = DB::table('suppliers')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }

    function getNextSenderCode($uss,$len =4){
        $branch_id = $uss->branch_id;
        $prefix ='SP';
        $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
        $row = DB::table('sender_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
        if($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('sender_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('sender_code_control')->insert(array('branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix));
        return $prefix.$branch_id.formatNumber(1,$len);
    }
    
    function updateStatus($status_code,$id=null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;
        if(in_array(strtolower($status_code),['inactive','locked','disabled'])){
            $err = self::getOutstandingBalanceError($id);
            if($err) return DV::error($err);
            }
        $x = DB::table('suppliers')->where('id',$id)->update([
            'status_code'=>$status_code
        ]);
        return DV::depends($x,['Supplier status','updated']);
        //if(!$x) return DV::error('It seems that provided merchant identity does not exist');
        // $um = new \App\Models\UM();
        // $user_id = DB::table('um_users')->where('official_id',$id)->take(1)->value('id');
        // $res = $um->setUserStatus($status_code,$user_id);
        // return $res;
    }
    static function getOutstandingBalanceError($id){
     $row = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->where('p.status_id',8)->where('s.id',$id)->whereRaw('IFNULL(p.sender_pmt_status_id,0) =0')->selectRaw('COUNT(p.id) AS item_count,SUM(IFNULL(p.sender_total,0)) AS amount')->get()->first();
     if(!$row) return null;
     if ($row->item_count > 0 ) return 'មិន​អាច​លុប ឬ​បិទ​គណនី​នេះ​បាន​ទេ ព្រោះ​មាន​កញ្ចប់ '.$row->item_count.' ដែល​មិន​ទាន់​បាន​ទូទាត់​ប្រាក់';
     return null;
  }
    static function getFormOptions($id,$ss){   
        $branch_id = $ss->branch_id;
        $supplier_details = null;
        if($id>0) $supplier_details = self::details($id,$ss);
        $data= (object)[];
        $data->supplier = $supplier_details;
        // $data->branches = [(object)['id'=>1,'branch_name'=>'Head Quarter']];
        // $data->sender_types = DB::table('sender_type')->where('branch_id',$branch_id)->selectRaw('id,name AS sender_type')->get();
        $data->business_types = DB::table('sender_business_types')->selectRaw('business_type AS code,business_type')->get();
        $data->sender_statuses = DB::table('sender_statuses')->selectRaw('code as status_code, name AS status_name')->get();
        $data->sales_agents = DB::table('affiliates AS sa')->where('branch_id',$branch_id)->selectRaw('sa.id,sa.name AS agent_name')->get();
        $data->price_list = DB::table('price_list_names AS l')->where('branch_id',$branch_id)->selectRaw('l.id,l.name')->get();
        return $data;
    }
    static function details($id,$ss,$includeProfilePicture=false,$includeBankAccount=true){
        $branch_id = $ss->branch_id;    
        $row = DB::table('suppliers')->selectRaw('id,name,code, phone_number, email,sales_agent_id,photo_file_name, address,status_code,price_list_id,formatDate(create_date) as create_date,DATE_FORMAT(create_date,\'%r\') AS request_time')->where('branch_id',$branch_id)->where('id',$id)->take(1)->first();
        if (!$row) return null;
            //$accounts = self::bankAccounts($id,1);
            // if($row->loc_lat ==0) $row->loc_lat = null;
            // if($row->loc_lng ==0) $row->loc_lng = null;
            // if ($includeBankAccount) $row->bank_accounts = self::bankAccounts($id);
            // if($includeProfilePicture) $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
            $url = $row->photo_file_name? PublicStorage::getUrl($branch_id,'general' ,'image').$row->photo_file_name: null;
            $url = validateUrl($url,self::defaultImage($branch_id));
            $row->photo = $url;
            $row->image_url = $url;

            if ($includeProfilePicture)
            $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
        return $row;
     }

     function saveProfilePicture($photo_data,$file_type = null,$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $supplier = DB::table('suppliers')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if(!$supplier)return DV::error('Supplier identity is not correct!');
        if($delete_image){
          PublicStorage::delete($ss->branch_id,'general','image',$supplier->photo_file_name);
          DB::table('suppliers')->where('id',$id)->update(['photo_file_name'=>null]);
        }
        return PublicStorage::saveImage($ss->branch_id,self::$img_dir, null,$photo_data,null,['id'=>$id,'store'=>'suppliers.photo_file_name']);  
        
      }
      static function getProfilePicture($id)
  {
    $row = DB::table('suppliers ')->where('id', $id)->selectRaw('branch_id,photo_file_name')->first();
    if (!$row) {
      return self::defaultImage(1);
    }
    $url = PublicStorage::getUrl($row->branch_id, 'supplier', 'image') . $row->photo_file_name;
    return validateUrl($url, '');
  }

      function deleteProfilePicture($id = null, $ss = null)
      {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $supplier = DB::table('suppliers')->where('id', $id)->selectRaw('id,branch_id,photo_file_name')->first();
        if (!$supplier)
          return DV::error('Supplier identity is not correct!');
        PublicStorage::delete($ss->branch_id, 'supplier', 'image', $supplier->photo_file_name);
        DB::table('suppliers')->where('id', $id)->update(['photo_file_name' => null]);
        return DV::depends($id,['Supplier are','update']);
      }
}
