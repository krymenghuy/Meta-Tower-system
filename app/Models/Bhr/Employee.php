<?php

namespace App\Models\Bhr;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\Bhr\GeneralSettings;
use App\Models\PublicStorage;
use App\Models\DV;
use App\Models\DBX;
use App\Models\Umt\UMTSession;
use App\Services\Umt\AuthService;
use DB;
use Sanitizer;
use Carbon\Carbon;
use Config;
use Illuminate\Pagination\LengthAwarePaginator; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
class Employee //extends Model
{
    //use HasFactory;
    
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'merchant';
    //Merchant Regitration default options | senderDetaultOptions() | merchantDefaultOptions
    function getDefaultOptions(){
      //price_list_id =11 (Normal Condition)
      $data =(object)[
        'price_list_id'=>self::getDefaultPriceList()->id,
        'cod'=>0,
        'cod_fee'=>0
      ];
      return $data;
    }
    
    function __construct($id=null,$userInfo=null){
         $this->id =$id;
         $this->userInfo = $userInfo;
    }
    
    //saveSender()
    function save($arr=[],$ss=null){
      $ss = $ss ?? $this->userInfo;
      $branch_id = $ss->branch_id; 
      $v_rule =[
        'id'=>'0|identity=1',
        'first_name'=>'1|string|0-100',
        'last_name'=>'1|string|0-100',
        'sex'=>'1|choice|M,F',
        'date_of_birth'=>'0|string|0-150',
        'email'=>'0|email',
        'address'=>'0|string|0-250',
        'phone_number'=>'1|phone|0-20',
        'positions_id'=>'1|number',
        'departments_id'=>'1|number',
        'cp_name'=>'0|string|0-100',
        'cp_phone_number'=>'0|number|0-20',
        'cp_email'=>'0|email',
        'photo_file_type'=>'0|number|default=0',
        'photo'=>'0|image',
      ];
      $checkUnque = ["$branch_id|employees|phone_number|id=id|text=Employee or merchant already exists by name, phone number, or email"];
      $res = validateObject($arr,$v_rule,true,['email'=>GeneralSettings::$email_chars],$ss->lang,false,$checkUnque);
      if ($res->error) return DV::error($res->error);
      $id = $res->id;
      $inputs = $res->values;
      $d = (object)$inputs;
      $photo = $d->photo;

      $d->phone_number = str_replace(' ','',$inputs['phone_number']);
      $inputs['phone_number'] = $d->phone_number;
      if(!$d->phone_number) return DV::error('Phone number is required for valid merchant account');

      $address = $d->address;
      
      //Additional check
     
      
      unset($inputs['photo']);
      $employee_created = !$id;
      $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
      // if($id > 0){
      //    $org_sender = DB::table('employees as em')->where('em.id',$id)->selectRaw('em.name,em.phone_number')->take(1)->first();
      //    if(!$org_sender) return DV::error('Failed to identify existing merchant for updating their information');
      //    if ($d->phone_number != $org_sender->phone_number){
      //         //Change merchant's phone number in tables "um_users","package","order_receivers", and then notify merchant Mobile App
      //         $change_phone_error = self::updateMerchantPhone($id,$d->phone_number);
      //         if( $change_phone_error) return DV::error($change_phone_error);
      //    }
      //    if ($org_sender->name != $d->name){
      //      //Change merchant's name in tables "um_users","package","order_receivers", and then notify Merchant mobile App
      //      $change_name_error = self::updateMerchantName($id,$d->name);
      //      if($change_name_error) return DV::error($change_name_error);
      //    }
      // }
      $id = saveData($ss,'employees',['id'=>$id],$inputs,[],1);
      if($id > 0){
           $new_code = null;

           if($delete_prev_image){
            $file_name = DB::table('employees as em')->where('em.id',$id)->take(1)->value('em.photo_file_name');
            if($file_name) PublicStorage::delete($branch_id,self::$img_dir,'image',$file_name);
            DB::table('employees as em')->where('em.id',$id)->update(['photo_file_name'=>null]);
           }
           PublicStorage::saveImage(['branch_id'=>null,'subs_id'=>$ss->subs_id,'dir'=>self::$img_dir],null,$photo,null,['id'=>$id,'store'=>'employees.photo_file_name']);  
          //  if ($sender_created){
          //     $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
          //     //$inputs['code'] = $new_code;
          //     DB::table('employees')->where('id',$id)->update(['code'=>$new_code]);
          //  }
           
           return DV::depends(1,['sender'=>$inputs,'id'=>$id]);
           //return DV::success(['sender_id'=>$sender_id,'code'=>$sender_code]);
      }
      return DV::error('Something went wrong in saving employee profile');
    }

    /** return Employee List paginated */
   static function list($arr,$ss){
    $d = (object)$arr;
    $branch_id =$ss->branch_id;

    $current_page =isset($d->current_page)?$d->current_page:1;
    $per_page =isset($d->per_page)?$d->per_page:10;
    if(!is_numeric($current_page)) $current_page=1;
    $skip_rows = ($current_page -1) * $per_page;

    $status = isset($d->status_code)?$d->status_code:'active';
    //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
    $search_value = isset($d->search_value)?$d->search_value:null;
    $sales_agent_id = isset($d->sales_agent_id)?$d->sales_agent_id: null;
    $str_agent = '11=11';
    /** $sales_agent_id = -1 means "To query merchants who are not referred by any sales agent " 
     *  $sales_agent_id = null or zero => means query merchants either refered by agent or no referrer
    */
    // if ($sales_agent_id ==-1) $str_agent = 'em.sales_agent_id IS NULL';
    // else if ($sales_agent_id > 0) $str_agent = 'em.sales_agent_id ='.$sales_agent_id; 
    //$str_sender_type = null;
    $str_status ='3=3'; // Active, Inactive
    $str_search ='2=2';
    //$str_agent = null;

    if ($search_value){
      $search_value = escape_like_str($search_value);
      $str_search = "(em.code ='$search_value' OR em.name LIKE '%". $search_value."%' OR em.phone_number ='".$search_value."' )";
    }else{
       //if($sender_type_id>0) $str_sender_type ="AND em.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
      if(in_array(strtolower($status),['active','inactive'])) $str_status = 'em.status_code =\''.$status.'\'';
    }
    //  $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = em.sales_agent_id LIMIT 1) AS referrer_name'; 
     $query = DB::table('employees as em')->selectRaw('em.id	,em.branch_id	,em.first_name	,em.last_name	,em.sex	,em.date_of_birth	,em.phone_number	,em.email	,em.address	,em.positions_id	,em.departments_id	,em.cp_name	,em.cp_phone_number	,em.cp_email	,em.photo_file_type	,em.photo_file_name ,em.create_user,formatTime(em.created_at) AS created_at')->where('em.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_status)->orderBy('em.id','DESC');
     
     $count_query = clone $query;
     $count = $count_query->count('em.id');
     $rows = $query->skip($skip_rows)->take($per_page)->get();
     foreach($rows as $row){
       $row->image_url = '';
       if($row->photo_file_name) $row->image_url =  self::getProfilePicture($row->id); 
       unset($row->photo_file_name);
     }
    
     return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }
 
   
}
