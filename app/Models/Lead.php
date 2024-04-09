<?php

namespace App\Models;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\PublicStorage;
use App\Models\DV;
use DB;
//use Sanitizer;
//use Config;
use Illuminate\Pagination\LengthAwarePaginator; 
use Illuminate\Support\Facades\Log;
class Lead //extends Model
{
    //use HasFactory;
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'lead', $photo_dir='merchant';
    //Merchant Regitration default options | senderDetaultOptions() | merchantDefaultOptions
    function getDefaultOptions(){
      //price_list_id =11 (Normal Condition)
      $data =(object)[
        'price_list_id'=>DB::table('price_list_names AS l')->where('is_default',1)->take(1)->value('id'),
        'cod'=>0,
        'cod_fee'=>0
      ];
      return $data;
    }

    function __construct($id=null,$userInfo=null){
         $this->id =$id;
         $this->userInfo = $userInfo;
    }
 
    function getDetails($id=null,$ss=null,$includeProfilePicture=false,$includeBankAccount=true){
        $id = $id ?? $this->id;
        $ss = $ss?? $this->userInfo;
        //$branch_id = $ss->branch_id;
        return self::details($id,$ss,$includeProfilePicture); 
    }

  static function details($id,$ss,$includeProfilePicture=false){
      $branch_id = $ss->branch_id;
      $cols = 's.id,s.code,s.name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id,s.phone_number,s.email,s.business_type,s.price_list_id,sales_agent_id,s.category_id,c.`name` AS category,s.status_id,ls.`name` AS status,s.reopen_count,s.closing_status_id';    
      $row = DB::table('leads as s')->join('lead_statuses as ls','ls.id','=','s.status_id')->join('lead_categories as c','c.id','=','s.category_id')->selectRaw($cols)->where('s.branch_id',$branch_id)->where('s.id',$id)->take(1)->first();
      if (!$row) return null;
          if($includeProfilePicture) $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
          return $row;
   }
 
    function getRandomNumbers($min, $max, $total) {
      $temp_arr = array();
      while(sizeof($temp_arr) < $total) $temp_arr[rand($min, $max)] = true;
      return $temp_arr;
    }
 
    function leadCodeExists($uss,$code,$id) {
        $branch_id = $uss->branch_id;
        if (!$code) return false;
        $str_id = $id > 0 ? 's.id <>'.$id : '1=1';
        $row = DB::table('leads AS s')->where('s.branch_id',$branch_id)->where('s.code',$code)->whereRaw($str_id)->selectRaw('s.id')->take(1)->first();
        return $row? true:false; 
    }
  
    //   //getSenderAddress()
    //   function getVendorAddress($d){
    //     $ss = UM::getUserInfoByToken($d);
    //     if ($ss->status_code !==200) return $ss; //user not authenticated
    //     $branch_id = $ss->branch_id;
    //     $sender_id = isset($d->sender_id)? Sanitizer::sanitize($d->sender_id):0;
    //     $rows = DB::table('sender AS s')->where('branch_id',$branch_id)->where('id',$sender_id)->selectRaw("s.address")->limit(1)->get();
    //     foreach($rows as $row) return $row->address;
    //     return null;
    //  }
      
    function newOTP($length=6)
    {
        return join('', array_map(function($value) { return $value == 1 ? mt_rand(1, 9) : mt_rand(0, 9); }, range(1, $length)));
    }

    function saveProfilePicture($photo_data,$id=null,$ss=null){
      $id = $id ?? $this->id;
      $ss = $ss ?? $this->userInfo;

      $leadInfo = DB::table('leads as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
      $delete_image = (!$photo_data || isImage($photo_data));
      if(!$leadInfo) return DV::error('Lead identity is not correct!');
      if($delete_image){
        PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$leadInfo->photo_file_name);
        DB::table('leads')->where('id',$id)->update(['photo_file_name'=>null]);
      }
       return PublicStorage::saveImage($ss->branch_id,self::$img_dir, null,$photo_data,null,['id'=>$id,'store'=>'leads.photo_file_name']);  
    }

    function deleteProfilePicture($id=null,$ss=null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $sender = DB::table('leads as s')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
        if(!$sender) return DV::error('Lead identity is not correct!');
        PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$sender->photo_file_name);
        DB::table('leads AS s')->where('s.id',$id)->update(['photo_file_name'=>null]);
        return DV::success();
    }

    static function getProfilePicture($id){
      $branch_id =1;
      $row = DB::table('leads as s')->where('s.id',$id)->selectRaw('s.branch_id,s.photo_file_name')->first();
      if(!$row){
         return self::defaultImage($branch_id);
      }
      $url = PublicStorage::getUrl($row->branch_id,self::$img_dir,'image').$row->photo_file_name;
      return validateUrl($url,'');
    }
    
    static function validateBusinessType($biz_type){
       $allowed = DB::table('sender_business_types as t')->where('business_type',$biz_type)->take(1)->value('allow_register');
       if( $allowed ===null) return 'Business Type does not exist';
       return $allowed ==0? 'Business type '.$biz_type.' is not yet open for registration':null;
    }

    //saveSender()
    function save($arr=[],$id =null,$ss=null){
      $ss = $ss ?? $this->userInfo;
      $branch_id = $ss->branch_id; 
      $id = $id ?? $this->id;
      $v_rule =[
        'id'=>'0|identity=1',
        'name'=>'1|string|0-100',
        'name_kh'=>'0|string|0-100',
        'business_type'=>'1|string|0-150',
        'email'=>'0|email',
        'address'=>'0|string|0-400',
        'phone_number'=>'1|phone|0-50',
        'sales_agent_id'=>'0|number',
        'adr_country_id'=>'0|number',
        'adr_city_id'=>'0|number',
        'adr_district_id'=>'0|number',
        'cod'=>'0|choice|0,1|default=1',
        'cod_fee'=>'0|number|default=0',
        'price_list_id'=>'0|number',
        'code'=>'0|string|0-25',
        'loc_lat'=>'0|number|default=0.00',
        'loc_lng'=>'0|number|default=0.00',
        'status_id'=>'1|choice|1,2,3,4,5,6|default=1',
        'closing_status_id'=>'1|choice|1,2,3,4|default=1',
        'category_id'=>'1|number|default=1',
        'bank_name'=>'0|string|0-150',
        'account_number'=>'0|string|0-100',
        'account_name'=>'0|string|0-150',
        'photo'=>'0|image',
      ];
    
      $checkUnque = ["$branch_id|leads|name,phone_number,email|id=id|text=Lead or prospect already exists by name, phone number"];
      $res = validateObject($arr,$v_rule,true,['email'=>['-','.','@','_'],'photo'=>GeneralSettings::$image_chars],$ss->lang,false,$checkUnque);
      if ($res->error) return DV::error($res->error);
      $id = $id ?? $res->id;
      $inputs = $res->values;
      $photo = (object)$arr;
      unset($inputs['photo']);
      $is_from_mobile = strtolower($ss->user_class) =='sales-agent';
      if($is_from_mobile && !in_array($inputs['status_id'],[1,2,3])) return DV::error('Status ID must be 1,2, or 3'); 
      if ($id > 0){
        $lead = DB::table('leads as l')->where('id',$id)->selectRaw('id')->take(1)->first();
        if(!$lead) return DV::error('It seems the prospect ID ? does not exist::'.$id);
      }
      $biz_type_err = self::validateBusinessType($inputs['business_type']);
      if($biz_type_err) return DV::error($biz_type_err);
      if(!$id) $id = $res->id;
      $inputs['phone_number'] = str_replace(' ','',$inputs['phone_number']);
 
      //if($inputs['cod_fee'] <0) return DV::error("COD fee is not correct!");
      if ($this->leadCodeExists($ss,$inputs['code'],$id)) return DV::error('Lead ID already exists');
      $phone_err = $this->checkUniquePerson($branch_id,$inputs['phone_number'],$id);
      if ($phone_err) return DV::error( $phone_err);   
       
      if(!isset($inputs['name_kh'])) $inputs['name_kh'] = $inputs['name'];
      $by_sales_agent =  (strtolower($ss->user_class) =='sales_agent');
      if($by_sales_agent) $inputs['sales_agent_id'] = $ss->official_id;
      
      $delete_prev_image = ($id > 0 && (!$photo || isImage($photo)));
      $lead_created = !$id;
      $id = saveData($ss,'leads',['id'=>$id],$inputs,[],1);
      if($id > 0){
           $new_code = null;

           if($delete_prev_image){
             $file_name = DB::table('leads as l')->where('l.id',$id)->take(1)->value('l.photo_file_name');
             if($file_name) PublicStorage::delete($branch_id,self::$photo_dir,'image',$file_name);
             DB::table('leads as l')->where('l.id',$id)->update(['photo_file_name'=>null]);
           }
           if ($lead_created){
              $new_code = $this->getNextLeadCode($ss); // formatNumber($sender_id,5);
              //$inputs['code'] = $new_code;
              DB::table('leads')->where('id',$id)->update(['code'=>$new_code]);
           }
           PublicStorage::saveImage($branch_id,self::$photo_dir,null,$photo,null,['id'=>$id,'store'=>'leads.photo_file_name']);  
           $inputs['id']=$id;
           $inputs['code']=$new_code;
           return DV::success(['lead'=>$inputs]);
           //return DV::success(['sender_id'=>$sender_id,'code'=>$sender_code]);
      }
      return DV::error('Something went wrong saving lead or prospect profile');
    }
 
    function checkUniquePerson($branch_id,$phone_number,$id=null){
      $str_id ="1=1";
      if(!$phone_number) return 'Phone number cannot be empty';
      if ($id > 0) $str_id='s.id <>'.$id;
      $x = DB::table('leads as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
      if ($x) return 'Phone number "'.$phone_number.'" has been used by another registered lead or prospect';
      $x = DB::table('sender as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
      if ($x) return 'Phone number "'.$phone_number.'" has been used by another registered merchant';
      $x = DB::table('driver as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
      if($x) return 'Phone number "'.$phone_number.'" has been used by a driver';
      return null;
    }

    function getNextLeadCode($uss,$len =4){
      $branch_id = $uss->branch_id;
      $prefix ='P';
      $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
      $row = DB::table('lead_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
      if($row) {
          $num = $row->last_id;
          $prefix = trim($row->prefix);
          $num +=1;
          DB::table('lead_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
          return $prefix.$branch_id.formatNumber($num,$len);
      }
      DB::table('lead_code_control')->insert(['branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix]);
      return $prefix.$branch_id.formatNumber(1,$len);
    }
  
  static function getChangeStatusError($status_id,$id = null){
     if($status_id == 5) return null;
     $row = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->join('leads as l','l.id','=','s.lead_id')->where('l.id',$id)->selectRaw('s.id, s.name,s.code,s.phone_number')->take(1)->first();
     if($row) return 'Cannot change status because this lead already become a merchant ? and has booked some packages or had some transactions::'.' named '.$row->name;
     return null;
  }

  static function getDeleteError($status_id,$id = null){
    if($status_id == 5) return null;
    $row = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->join('leads as l','l.id','=','s.lead_id')->where('l.id',$id)->selectRaw('s.id, s.name,s.code,s.phone_number')->take(1)->first();
    if($row) return 'Cannot delete because this lead alreay become a merchant ? and has had some packages or transactions::'.' named '.$row->name;
    return null;
 }

  static function getMessageByStatus($status_id){
     switch($status_id){
       case 1:
         return 'The lead or prospect is not yet summitted for review';
       case 2:
        return 'The lead is currently in review';  
      case 3:
          return 'The lead has become a qualified prospect';
      case 4:
            return 'The lead has is disqualified or not accepted';
      case 5:
          return 'The prospect already become a merchant';
      case 6:
          return 'We didn\'t secure the agreement with the prospect';
      default:
      return null;                    
     }
  }

  /** This is called when Agent submits leads for review. This will update lead's status_id from 1 to 2  */
  function setForReview($id =null,$ss=null){
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    $lead = DB::table('leads')->where('id',$id)->selectRaw('id,status_id')->take(1)->first();
    if(!$lead) return DV::error('Lead ID does not exist');
    if($lead->status_id >=2) return DV::error('Lead is already in review or may have passed through other steps of evaluation');
    DB::table('leads')->where('id',$id)->update([
      'status_id'=>2
    ]);
    return DV::depends(1);
  }

  function updateStatus($status_id,$id=null,$ss=null){
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    $test_id = DB::table('lead_statuses')->where('id',$status_id)->take(1)->value('id');
    if(!$test_id) return DV::error('Status ID does not exist');
    $lead = DB::table('leads')->where('id',$id)->selectRaw('id,status_id')->take(1)->first();
    $is_from_mobile = (in_array(strtolower($ss->user_class),['sales_agent',self::$img_dir,'driver']));
    if($is_from_mobile) {
      if($status_id > 2) return DV::error('This status is not allowed to be updated');
        $err = self::getMessageByStatus($lead->status_id);
      if($err) return DV::error($err);
    }
    if(!$lead) return DV::error('prospect ID ? does dot exist::'.$id);
    if ($status_id ==5) return DV::error('You are supposed to convert prospect to merchant instead of updating status');
    
     //Delete corresponding merchant when user updates lead status to non-success such as updating to "Lost","Disqualified","In Review","Qualified"
     if($lead->status_id ==5 && $status_id !=5){
        $err = self::getChangeStatusError($status_id,$id);
        if($err) return DV::error($err);
        DB::table('sender')->where('lead_id',$id)->delete();
     }
    $x = DB::table('leads')->where('id',$id)->update([
        'status_id'=>$status_id,
        'client_id'=>null
    ]);
    $new_status = DB::table('lead_statuses as ls')->where('id',$status_id)->take(1)->value('name');
    return DV::depends(1,['new_status'=>$new_status],'Failed to update Lead or prospect status'); 
  }
  
  static function getBankAccounts($id = null){
    $row = DB::table('leads as l')->where('id',$id)->selectRaw('bank_name,account_number,account_name')->first();
    if(!$row) return null;
    return [
       'bank_name'=>$row->bank_name,
       'account_number'=>$row->account_number,
       'account_name'=>$row->account_name
    ];
  }

  function convertToMerchant($id=null,$ss =null){
     $ss = $ss ?? $this->userInfo;
     $id = $id ?? $this->id;
     $default_price_list = Sender::getDefaultPriceList();
     $lead =  DB::table('leads as l')->where('l.id',$id)->selectRaw('name,sales_agent_id,id,phone_number,status_id')->take(1)->first();
     if(!$lead) return DV::error('Lead ID ?::'.$id.' is not correct');
     if($lead->status_id ==5) return DV::error('This prospect already become a merchant');

     $sender = DB::table('sender as s')->where('s.lead_id',$id)->selectRaw('s.id,s.phone_number,code')->take(1)->first();
     $phone = '';
     if($sender){
        $phone =  ' with phone number: '.$sender->phone_number;
        return DV::error('This prospect already become a merchant '.$phone); 
     }
     $senderModel = new \App\Models\Sender(null,$ss);
     $input =DB::table('leads as l')->where('l.id',$id)->selectRaw('l.name,sales_agent_id,l.phone_number,l.email,address,business_type')->first();
     $input->name_kh = $input->name;
     $input->sender_type_id =1;
     $input->cod_fee = 0;
     $input->cod = 1;
     //Lead_id is important to calculate converstion rate.
     $input->lead_id = $id;
     unset($input->id);

     //$input->price_list = self::getDefaultPriceList();
     $input->banks = self::getBankAccounts($id);
     $res = $senderModel->save((array)$input, $ss);
     if($res->status =='OK'){
      $sender = (object) ($res->data['sender']);
       //Set default price list  
        DB::table('sender')->where('id',$sender->id)->update(['price_list_id'=>$default_price_list->id]);
      $x = DB::table('leads')->where('id',$id)->update([
        'status_id'=>5,
        'client_id'=> $sender->id,
        'update_user'=>$ss->full_name,
        'update_date'=>getNowTime(),
        'update_uid'=>$ss->user_id
       ]);

       if($x){
         //Notify to Sales mobile app
             $cdata =[
                        [
                            'user_class'=>'sales_agent',
                            'target_user_id'=>$lead->sales_agent_id,
                            'title'=>'Deal Success',
                            'message'=>'Another prospect '.$lead->name.' deal is successful',
                            'persist'=>1,
                            'data'=>[]
                        ]
                   ];
          Notifier::notify_mobile($ss->branch_id,$cdata);
       }
       return DV::depends(1);
     }else return DV::error($res->error_message);

  }

  function deleteSpecial($id=null,$ss=null){
    $id =$id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $lead = DB::table('leads as l')->where('id',$id)->selectRaw('l.id,l.name,l.code,l.client_id')->first();
    if(!$lead) return DV::error('Lead ID ? is does not exist::'.$id);
    $senderModel = new \App\Models\Sender(null,$ss);
    if($lead->client_id){
      $res = $senderModel->deleteSpecial($lead->client_id,$ss);
      if($res->status === 'Error') return DV::error('This lead was once converted to merchant. Problem in deleting the merchant: '.$res->error_message);
    }
    return $this->delete($id,$ss); 
  }

  function delete($id=null,$ss = null){
    $id =$id ?? $this->id;
    $ss = $ss ?? $this->userInfo;
    $lead = DB::table('leads as l')->where('l.id',$id)->selectRaw('l.id,l.sales_agent_id,l.status_id,l.name')->first();
    if(!$lead) return DV::error('Lead does not exist');
    if($lead->status_id >=2){
      $user_class = strtolower($ss->user_class);
      if($user_class =='sales_agent') return DV::error('Cannot delete lead that has been submitted for review or has passed through other evaluation steps');
    }
    $err = self::getDeleteError($id);
    if($err) return DV::error($err);
    $sender = DB::table('sender as s')->where('lead_id',$id)->selectRaw('s.id,s.name,s.phone_number,s.status_code')->first();
    if($sender){
      $senderModel = new \App\Models\Sender(null,$ss);
      $res = $senderModel->delete($sender->id,$ss);
      if($res->status ==='Error') return DV::error($res->error_message);
    }
    $x = DB::table('leads')->where('id',$id)->delete();
    if($x){
      //Notify to Sales mobile app
          $cdata =[
                     [
                         'user_class'=>'sales_agent',
                         'target_user_id'=>$lead->sales_agent_id,
                         'title'=>'Lead Deleted',
                         'message'=>'Lead '.$lead->name.' deal is deleted',
                         'persist'=>1,
                         'data'=>[]
                     ]
                ];
       Notifier::notify_mobile($ss->branch_id,$cdata);
    }
    return DV::depends($x,null,'Failed to delete lead or prospect');
  }
  
  function setPriceList($price_list_id,$id=null,$ss =null){
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    //$branch_id = Sanitizer::sanitize($ss->branch_id);
    $p = getDataRow('price_list_names',["id"=>$price_list_id],"id,name");
    if(!$p) return DV::error("Price list ID is not valid");
    $p_name = $p->name;
    DB::table('leads')->where('id',$id)->update(array(
    'price_list_id'=>$price_list_id));
    return DV::success(['list_name'=>$p_name,'list_id'=>$price_list_id]);
 }
   
 static function list_all($arr,$ss){
  $d = (object)$arr;
  $branch_id =$ss->branch_id;
 
  $status_id = isset($d->status_id)?$d->status_id:null;
  //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
  $business_type = isset($d->business_type)?$d->business_type:null;
  $search_value = isset($d->search_value)?$d->search_value:null;
  $sales_agent_id = isset($d->sales_agent_id)?$d->sales_agent_id:null;

  $str_agent = '7=7';
  $str_business_type ='1=1';
  $str_search ='2=2';
  $is_from_mobile = (strtolower($ss->user_class) =='sales_agent');
  $str_base_status =  $is_from_mobile? '' : ' AND s.status_id > 1';
  $str_status = '9=9';

  if ($search_value) 
  {
    $search_value = escape_like_str($search_value);
    $str_search = "(s.name LIKE '%". $search_value."%' OR s.phone_number ='".$search_value."' )";
  }else{
     //if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
     if($business_type) { 
       $business_type = escape_like_str($business_type);
       $str_business_type ='s.business_type LIKE \'%'.$business_type.'%\'';
    }
     if($status_id > 0) $str_status = 's.status_id ='.$status_id;
     if($sales_agent_id > 0) $str_agent = 's.sales_agent_id = '.$sales_agent_id;
     else if(!$sales_agent_id) $str_agent = '7=7';

   }
   /** $str_user_class => to allow Admin or backend to see lead list including list of "Won" leads who become customers, but for Mobile App user can only see lead list that is not yet "Won" */
   $str_user_class = strtolower($ss->user_class) =='sales_agent'? 's.status_id <> 5' : '3=3';
   $can_edit = ',(DATEDIFF(now(),s.create_date) < 7 AND s.status_id =1) AS can_edit';
   $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = s.sales_agent_id LIMIT 1) AS referrer_name'; 
   $cols = 's.photo_file_name,s.id,s.code,s.name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.phone_number,s.email,s.business_type,s.price_list_id,sales_agent_id,s.category_id,c.`name` AS category,s.status_id,ls.`name` AS status,s.reopen_count,s.closing_status_id,s.sales_agent_id,s.update_user,formatTime(s.update_date) AS update_date,s.create_user,formatTime(s.create_date) AS create_date'.$select_referrer_name.$can_edit;
   $query = DB::table('leads as s')->join('lead_statuses as ls','ls.id','=','s.status_id')->join('lead_categories as c','c.id','=','s.category_id')->where('s.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_user_class)->whereRaw($str_agent)->whereRaw($str_status.$str_base_status)->whereRaw($str_business_type)->selectRaw($cols)->orderBy('s.id','DESC');
   $rows = $query->get();
   foreach($rows as $row){
     $url = null;
     if($row->photo_file_name) $url = PublicStorage::getUrl($row->branch_id,self::$img_dir,'image').$row->photo_file_name;
     unset($row->photo_file_name);
     $row->image_url = validateUrl($url,self::defaultImage($ss->branch_id));
    }
    return $rows;
  }
  
   /** return Sender List paginated */
   static function list($arr,$ss){
    $d = (object)$arr;
    $branch_id =$ss->branch_id;

    $current_page =isset($d->current_page)?$d->current_page:1;
    $per_page =isset($d->per_page)?$d->per_page:10;
    if(!is_numeric($current_page)) $current_page=1;
    $skip_rows = ($current_page -1) * $per_page;

    $status_id = isset($d->status_id)?$d->status_id:null;
    //$sender_type_id = isset($d->sender_type_id)? $d->sender_type_id:null;
    $start_date = convertDate(isset($d->start_date)?$d->start_date:null);
    $end_date = convertDate(isset($d->end_date)?$d->end_date:null);

    $business_type = isset($d->business_type)?$d->business_type:null;
    $sales_agent_id = isset($d->sales_agent_id)? $d->sales_agent_id: null;
    $search_value = isset($d->search_value)?$d->search_value:null;
   
    $str_agent = '7=7';
    $str_business_type ='1=1';
    $is_from_mobile = (strtolower($ss->user_class) =='sales_agent');
    $str_base_status =  $is_from_mobile? '' : ' AND s.status_id > 1';
    $str_status = '9=9';
    
    $str_search ='2=2';
    if ($search_value) 
    {
      $search_value = escape_like_str($search_value);
      $str_search = "(s.name LIKE '%". $search_value."%' OR s.phone_number ='".$search_value."' ) ".' AND '.$str_status;
    }else{
       //if($sender_type_id>0) $str_sender_type ="AND s.sender_type_id ='".Sanitizer::sanitize($sender_type_id)."' ";
       if($business_type) { 
         $business_type = escape_like_str($business_type);
         $str_business_type ='s.business_type LIKE \'%'.$business_type.'%\'';
      }
      $str_dates = '9=9';
      if($start_date && $end_date) $str_dates = 'DATE(s.create_date) >=\''.$start_date.'\' AND DATE(s.create_date) <= \''.$end_date.'\'' ;
      if($status_id > 0) $str_status = 's.status_id = '.$status_id;  
      if ($sales_agent_id > 0) $str_agent = 's.sales_agent_id = '.$sales_agent_id;
      else if (!$sales_agent_id) $str_agent = '7=7';
    }
     /** $str_user_class => to allow Admin or backend to see lead list including list of "Won" leads who become customers, but for Mobile App user can only see lead list that is not yet "Won" */
     $str_user_class = strtolower($ss->user_class) =='sales_agent'? 's.status_id <> 5' : '3=3';
     $select_referrer_name = ',(SELECT r.`name` FROM sales_agents as r WHERE r.id = s.sales_agent_id LIMIT 1) AS referrer_name'; 
     $can_edit = ',(DATEDIFF(now(),s.create_date) < 7) AS can_edit';
     $cols = 's.branch_id,s.photo_file_name,s.id,s.code,s.name,s.name_kh,s.address,s.cod,s.cod_fee,s.price_list_id, getPriceListName(s.price_list_id) AS price_list_name,s.phone_number,s.email,s.business_type,s.price_list_id,sales_agent_id,s.category_id,c.`name` AS category,s.status_id,ls.`name` AS status,s.reopen_count,s.closing_status_id,s.sales_agent_id,s.update_user,formatTime(s.update_date) AS update_date,s.create_user,formatTime(s.create_date) AS create_date'.$select_referrer_name.$can_edit;
     $query = DB::table('leads as s')->join('lead_statuses as ls','ls.id','=','s.status_id')->join('lead_categories as c','c.id','=','s.category_id')->where('s.branch_id',$branch_id)->whereRaw($str_search)->whereRaw($str_user_class)->whereRaw($str_dates)->whereRaw($str_agent)->whereRaw($str_status.$str_base_status)->whereRaw($str_business_type)->selectRaw($cols)->orderBy('s.id','DESC');
     
     $count_query = clone $query;
     $count = $count_query->count('s.id');
     $rows = $query->skip($skip_rows)->take($per_page)->get();
     foreach($rows as $row){
       $url = null;
       if($row->photo_file_name) $url = PublicStorage::getUrl($row->branch_id,self::$img_dir,'image').$row->photo_file_name;
       unset($row->photo_file_name);
       $row->image_url = validateUrl($url,self::defaultImage($ss->branch_id));
     }
     return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
  }
 
  static function defaultImage($branch_id){
    return PublicStorage::getUrl($branch_id,'default','image').'default_lead.png';
  }

   //static method getLeadProp($lead_id,$prop)
   static function getLeadProp($id,$prop){
      $rows = DB::table('leads')->where('id',$id)->selectRaw($prop)->take(1)->get();
      foreach($rows as $row) return $row->{$prop};
      return null;
   }
  
   /** returns object {"latitude","longitude"} */
   static function getLocation($googleMapLink) {
    // Define regular expression patterns for both types of Google Maps links
    $patterns = [
        '/@([-0-9.]+),([-0-9.]+)/',  // Matches links with @latitude,longitude
        '/\/place\/([-0-9.]+),([-0-9.]+)/'  // Matches links with /place/latitude,longitude
    ];

    foreach ($patterns as $pattern) {
        // Perform a regular expression match and return the result if successful
        if (preg_match($pattern, $googleMapLink, $matches)) {
            return (object)['latitude' => $matches[1], 'longitude' => $matches[2]];
        }
    }

    // Return false if no match is found
    return false;
}

function leadExists($uss,$name,$id) {
  $branch_id = $uss->branch_id;
  $str_id = $id > 0? 's.id <> '.$id : '1=1';
  $row  = DB::table('leads AS s')->where('s.branch_id',$branch_id)->where('s.name',$name)->whereRaw($str_id)->selectRaw('id')->take(1)->first();
  return $row? true:false;
}
     
    static function getFormOptions($id,$ss){   
        $branch_id = $ss->branch_id;
        $lead_details = null;
        if($id>0) $lead_details = self::details($id,$ss);
        $data= (object)[];
        $data->lead = $lead_details;
        $data->sales_agents = DB::table('sales_agents as a')->where('a.branch_id',$branch_id)->selectRaw('id,name AS agent_name,code')->get();
        $data->categories = DB::table('lead_categories as c')->selectRaw('id,name AS category')->get();
        $data->business_types = DB::table('sender_business_types')->selectRaw('business_type')->get();
        $data->lead_statuses = DB::table('lead_statuses')->selectRaw('id, name as status')->get();
        //$data->closing_statuses = DB::table('closing_statuses AS cs')->selectRaw('scs.id,cs.name AS closing_status')->get();
        //$data->price_list = DB::table('price_list_names AS l')->where('branch_id',$branch_id)->selectRaw('l.id,l.name')->get();
        return $data;
    }
}
