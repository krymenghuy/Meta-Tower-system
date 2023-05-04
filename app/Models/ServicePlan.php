<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\Invoice\InvoiceSettings;
//use App\Models\PublicStorage;
use DB;
use Carbon\Carbon;

class ServicePlan //extends Model
{
    //use HasFactory;
     protected $id = null;
     protected $userInfo = null;
     protected static $table_name ="medical_services";
    //medical_services.category_id =3 => "Loyalty package"
    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function getUserInfo(){
        return $this->userInfo;
    }

    function getId(){
        return $this->id;
    }

    static function saveServices($ss,$id,$services){
      $i=0;
      $c =null;
      do{
        if(!isset($services[$i])) break;
        $c = (object)$services[$i];
         $x = DB::table('service_plan_items')->where('service_plan_id',$id)->where('service_id',$c->service_id)->update(['max_sku'=>$c->max_sku,'updated_at'=>getNowTime(),'update_user'=>$ss->full_name]);
         if(!$x){
            saveData($ss,'service_plan_items',['id'=>null],['service_plan_id'=>$id,'service_id'=>$c->service_id,'max_sku'=>$c->max_sku],[],1);
         } 
        $i++;
      }while($c);
    }

    //function create()
    //NOTE: todo: when there are service tracking already => must log any changes in Price, Service, max_sku
    function save($arr=[],$id=null,$ss=null){
      $id =$id?$id:$this->getId();
      $ss =$ss?$ss:$this->getUserInfo();
      $branch_id = $ss->branch_id;
      $v_rule = ['id'=>'0|number|identity=1',
        'name'=>'1|string|0-150',
        'description'=>'0|string|0-200',
        'price'=>'1|number|default=0',
        "department_id"=>"0|number|default=0", /** for Service Plan or Promition package does not have a department **/
        'currency_code'=>'1|choice|USD,KHR|default=USD',
        'service_id'=>'1|number|exists=medical_services.id',
        'max_sku'=>'1|positive|text=Maximum repeats is not correct!',
        'photo'=>'0|image',
        'is_package'=>'1|number|default=1',
        'category_id'=>'1|number|default=3'
      ];
      $table_name = self::$table_name; 
      $uniqu = ["$branch_id|$table_name|name|id=id"];
      $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,$uniqu);
      if($res->error) return DV::error($res->error);
      $id = $res->id;
      $service_plan_created = $id>0? false:true;
      $inputs = $res->values;

      //create services array
      $max_sku = $inputs['max_sku'];
      $service_id = $inputs['service_id'];
      $services =[];
      $services[] = ['max_sku'=>$max_sku,'service_id'=>$service_id];
      unset($inputs['max_sku']);
      unset($inputs['service_id']);
      //End of creating service array
      
      $photo = $inputs['photo'];
      unset($inputs['photo']);
    

      if(!isset($services) || !isset($services[0])) return DV::error("At least one service is required in a service plan");
      $price = $inputs['price'];
      $currency_code = $inputs['currency_code'];
      $id = saveData($ss,self::$table_name,['id'=>$id],$inputs,[],1);
      if($id>0){
          self::saveServices($ss,$id,$services);
          if(isImage($photo)){
             $mx = PublicStorage::saveImage($branch_id,"service_plan",null,$photo,['id'=>$id,'store'=>self::$table_name.".photo_file_name"]);
             $inputs['image_url'] = $mx->image_url;
          }
          if($service_plan_created) saveData($ss,'service_plans',['id'=>null],['id'=>$id,'member_count'=>0,'price'=>$price,'currency_code'=>$currency_code],[],1);
      }
      $inputs['id'] =$id;
      $inputs['member_count'] = self::countMember($branch_id,$id);
      return DV::depends($id,$inputs,"Something went wrong in saving Servie Plan"); 
    }
    
    // static function verifyServicePlan($inputs,$id,$service_id){
    //    //$inputs = ['pmt_cycle','currency_code'] 
    //    $x = DB::table('service_plans')->where('id',$id)->where('service_id',$service_id)->update($inputs);
    //    if(!$x){
    //     $inputs['id']=$id;
    //     $inputs['service_id']=$service_id; 
    //     DB::table('service_plans')->insert($inputs);
    //    }
    //    return null;
    // }
   
    static function getDeleteError($id){
      $member_count = DB::table('plan_subscriptions')->where('service_plan_id',$id)->count('id');
      if($member_count>0) return "Service Plan cannot be deleted because there are some enrolled subscribers";
      return null;
   }

    function delete($id=null,$ss=null){
      $id =$id?$id:$this->id;
      $ss =$ss?$ss:$this->userInfo;
      $err = self::getDeleteError($id);
      if($err) return DV::error($err);
      $x = DB::table(self::$table_name)->where('is_package',1)->where('id',$id)->delete();
      DB::table('service_plans')->where('id',$id)->delete();
      DB::table('service_plan_items')->where('service_plan_id',$id)->delete();
      DB::table('plan_subscriptions')->where('service_plan_id',$id)->delete();
      return DV::depends($x,null,"Failed to delete service plan");
    }

    static function form_options($ss){
      return (object)[
        'services'=>DB::table('medical_services as s')->where('s.branch_id',$ss->branch_id)->where('is_package',0)->selectRaw("s.id,s.name as service_name")->orderBy('s.name','ASC')->get()  
      ];
    }

    function getList($arr=[],$ss=null){
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id =$ss->branch_id;
        $search_value = isset($arr['search_value'])?$arr['search_value']:null;
        $str_search="1=1";
        //$str_client="1=1";
        if($search_value){
            $search_value = escape_like_str($search_value);
            // if($search_value>0){
            //     //$customer_table = InvoiceSettings::$customer_table;
            //     //$cols ="c.id as client_id";
            //     //$str_where ="(p.email = '$search_value' OR p.phone_number ='$search_value' OR CONCAT(last_name,' ',p.first_name) LIKE '%$search_value%')";
            //     //$rows = DB::table($customer_table." as c")->join('persons as p','p.id','=','c.person_id')->whereRaw($str_where)->where('c.branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
            //     //$client_id = isset($rows[0])?$rows[0]->client_id:null;
            //     //if($client_id>0)
            //     //$str_client = "(s.id = (SELECT l.service_plan_id FROM plan_subscriptions as l WHERE l.client_id =$client_id AND l.branch_id = $branch_id LIMIT 1))";
            // };
            $str_search ="(s.name LIKE '%$search_value%' OR s.description LIKE '%$search_value%')";
        }
        $cols ="s.id,s.name,s.description,sp.member_count,s.price,s.currency_code,date_format(s.created_at,'%d %b %Y') as created_at,s.create_user";
        //NOTE: table "service_plans" is just extended details of medical_services
        return DB::table(self::$table_name." as s")->join('service_plans as sp','sp.id','=','s.id')->where('is_package',1)->whereRaw($str_search)->where('s.branch_id',$branch_id)->selectRaw($cols)->orderBy('s.id','DESC')->get();
    }

    static function getApplicableServices($branch_id,$id){
      return DB::table('service_plan_items as i')->where('service_plan_id',$id)->where('branch_id',$branch_id)->selectRaw("i.service_id,i.service_plan_id,i.max_sku")->get();
    }

    function getDetails($id=null,$ss=null){
        $id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id =$ss->branch_id;
        $cols ="s.id,s.name,s.description,s.price,s.currency_code,s.created_at,s.create_user";
        $rows = DB::table(self::$table_name." as s")->where('is_package',1)->where('s.id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
        foreach($rows as $row){
            $items = self::getApplicableServices($branch_id,$id);
            //Take only the first service that is included or part of the Service Plan
            if(isset($items[0])){
                $row->service_id =$items[0]->service_id; 
                $row->max_sku = $items[0]->max_sku; 
            }
        }
        return isset($rows[0])?$rows[0]:null;
    }
 
    function addItem($arr, $id=null,$ss=null){
        $id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $res = validateObject($arr,['service_id'=>'1|number|exists=medical_services.id','max_sku'=>'1|number|default=0'],true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs= $res->values;
        //service_plan_id is also s service_id in table "medical_services", but its category_id =3, and thus it is "Loyalty package" that contains other services
        Db::table('service_plan_items')->where('service_plan_id',$id)->where('service_id',$inputs['service_id'])->delete();
        DB::table('service_plan_items')->insert([
            'service_plan_id'=>$id,
            'service_id'=>$inputs['service_id']
        ]);
        return Dv::success();
    }
    
    function deleteItem($service_id, $id=null,$ss=null){
        $id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        Db::table('service_plan_items')->where('service_plan_id',$id)->where('service_id',$service_id)->delete();
        return Dv::success();
    }

    function getItems($id=null,$ss=null){
        $id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $cols ="s.id,s.name,s.price,s.service_type";
        return Db::table('service_plan_items as t')->join('medical_services as s','s.id','=','t.service_id')->where('t.service_plan_id',$id)->selectRaw($cols)->orderBy('s.id','DESC')->get();
 
    }
   
    function addSubscriber($arr =[],$id=null,$ss=null){
        $service_plan_id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $customer_table = InvoiceSettings::$customer_table;
        $v_rule = [
          'id'=>"0|number|identity=1",  
          'client_id'=>"1|number|exists=$customer_table.id",
          'service_plan_id'=>"1|number|exists=service_plans.id|text=Service Plan identity is not a valid",
          'sales_agent_id'=>'0|number|exists=employees.id|text=Sales agent must be a valid employee',
          'expiration_date'=>'0|date',
          'agent_commission'=>'0|number|default=0',
          'sales_agent_type'=>'0|string|0-35|default=Staff',
          'price'=>'0|number|default=0',
          'remarks'=>'0|string|0-150'
        ];
        $res = validateObject($arr,$v_rule,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $id = $res->id;
        $inputs = $res->values;
        $expiration_date = $inputs['expiration_date'];
        if(!(bool)strtotime($expiration_date)) $expiration_date = Carbon::now()->addDays(30);
        $inputs['expiration_date'] = convertDate($expiration_date);

        //$rows = DB::table('plan_subscriptions')->where('branch_id',$branch_id)->where('client_id',$client_id)->where('service_plan_id',$service_plan_id)->select('id')->take(1)->get();
        //$id =null;
        //if(!isset($rows[0])){
            $id = saveData($ss,'plan_subscriptions',['id'=>$id],$inputs,[],1);
            if($id>0){
                self::refreshMemberCount($branch_id,$service_plan_id);
            }
        //}else $id = $rows[0]->id;
       
        return DV::depends($id,['id'=>$id,'members'=>$this->getSubscribers($service_plan_id,$ss)],"Something went wrong saving Service Plan Subscription");
    }

    function removeSubscriber($client_id,$id=null,$ss=null){
        $service_plan_id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $x = DB::table('plan_subscriptions')->where('branch_id',$branch_id)->where('client_id',$client_id)->where('service_plan_id',$service_plan_id)->delete();
        if($x) DB::table('services_performed')->where('branch_id',$branch_id)->where('service_plan_id',$service_plan_id)->where('client_id',$client_id)->delete();
        
        self::refreshMemberCount($branch_id,$service_plan_id);
        return DV::depends(1,['members'=>$this->getSubscribers($id,$ss)]);
    }

    static function countMember($branch_id,$id){
      $rows = DB::table('plan_subscriptions as c')->where('c.service_plan_id',$id)->where('c.branch_id',$branch_id)->selectRaw("COUNT(c.id) AS cnt")->get();
      foreach($rows as $row) return $row->cnt;
      return 0;
    }

   static function refreshMemberCount($branch_id,$id){
      $x = DB::statement(DB::raw("update service_plans set member_count = (select COUNT(p.id) FROM plan_subscriptions as p where p.service_plan_id =$id AND p.branch_id =$branch_id) where id =$id and $branch_id =$branch_id"));
      if(!$x){
        DB::table('service_plans')->insert([
            'id'=>$id,
            'member_count'=>self::countMember($branch_id,$id)
        ]);
      }
   }

   function getSubscribers($id=null,$ss=null){
     $service_plan_id =$id?$id:$this->getId();
     $ss =$ss?$ss:$this->getUserInfo();
     $customer_table = InvoiceSettings::$customer_table;
     $rows= DB::table("plan_subscriptions as l")->join($customer_table." as c","c.id",'=',"l.client_id")->join('persons as p','p.id','=','c.person_id')->where('l.service_plan_id',$service_plan_id)->selectRaw("l.id,c.id as client_id,c.code,concat(p.last_name,' ',p.first_name) as name,p.sex,p.email,p.phone_number, l.price, l.sales_agent_id, getEmpName(l.sales_agent_id) AS sales_agent_name, l.sales_agent_type,p.address,p.created_at,p.create_user,l.expiration_date")->orderBy('name','ASC')->get();
     foreach($rows as $row){
        $row->subscription_status = convertDate($row->expiration_date) > date('Y-m-d')? 'Expired':'Active';
     }
     return $rows;
   }

   function getSubscriberCount($id=null,$ss=null){
    $service_plan_id =$id?$id:$this->getId();
    $ss =$ss?$ss:$this->getUserInfo();
    return 1;
  }
}
