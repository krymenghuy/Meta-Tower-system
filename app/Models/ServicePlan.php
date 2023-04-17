<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\Invoice\InvoiceSettings;
//use App\Models\PublicStorage;
use DB;

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
        'photo'=>'0|image',
        'is_package'=>'1|number|default=1',
        'category_id'=>'1|number|default=3'
      ];
      $table_name = self::$table_name; 
      $uniqu = ["$branch_id|$table_name|name|id=id"];
      $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,$uniqu);
      if($res->error) return DV::error($res->error);
      $id = $res->id;
      $inputs = $res->values;
      $photo = $inputs['photo'];
      unset($inputs['photo']);

      $id = saveData($ss,self::$table_name,['id'=>$id],$inputs,[],1);
      if($id>0){
          if($photo){
             $mx = PublicStorage::saveImage($branch_id,"service_plan",null,$photo,['id'=>$id,'store'=>self::$table_name.".photo_file_name"]);
             $inputs['image_url'] = $mx->image_url;
          }
      }
      return DV::depends($id,['id'=>$id,'service_plan'=>$inputs],"Something went wrong in saving Servie Plan"); 
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

    function delete($id=null,$ss=null){
      $id =$id?$id:$this->getId();
      $ss =$ss?$ss:$this->getUserInfo();
      $x = DB::table(self::$table_name)->where('is_package',1)->where('id',$id)->delete();
      return DV::depends($x,null,"Failed to delete service plan");
    }

    function getList($arr=[],$ss=null){
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id =$ss->branch_id;
        $cols ="s.id,s.name,s.description,s.price,s.currency_code,s.created_at,s.create_user";
        return DB::table(self::$table_name." as s")->where('is_package',1)->where('s.branch_id',$branch_id)->selectRaw($cols)->orderBy('s.id','DESC')->get();
    }

    function getDetails($id=null,$ss=null){
        $id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id =$ss->branch_id;
        $cols ="s.id,s.name,s.description,s.price,s.currency_code,s.created_at,s.create_user";
        $rows = DB::table(self::$table_name." as s")->where('is_package',1)->where('s.id',$id)->where('branch_id',$branch_id)->selectRaw($cols)->take(1)->get();
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
   
    function addSubscriber($client_id,$id=null,$ss=null){
        $service_plan_id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        if(!$client_id) return Dv::error("Invalid client ID");
        $remarks ="";
        $rows = DB::table('plan_subscriptions')->where('branch_id',$branch_id)->where('client_id',$client_id)->where('service_plan_id',$service_plan_id)->select('id')->take(1)->get();
        $id =null;
        if(!isset($rows[0])){
            $id = saveData($ss,'plan_subscriptions',['id'=>null],[
                'client_id'=>$client_id,
                'service_plan_id'=>$service_plan_id,
                'remarks'=>$remarks
            ],[],1);
            self::refreshMemberCount($branch_id,$service_plan_id);
        }else $id = $rows[0]->id;
       
        return DV::depends($id,['id'=>$id,'members'=>$this->getSubscribers($service_plan_id,$ss)],"Something went wrong saving Service Plan Subscription");
    }

    function removeSubscriber($client_id,$id=null,$ss=null){
        $service_plan_id =$id?$id:$this->getId();
        $ss =$ss?$ss:$this->getUserInfo();
        $branch_id = $ss->branch_id;
        $x = DB::table('plan_subscriptions')->where('branch_id',$branch_id)->where('client_id',$client_id)->where('service_plan_id',$service_plan_id)->delete();
        self::refreshMemberCount($branch_id,$service_plan_id);
        return DV::depends(1,['members'=>$this->getSubscribers($id,$ss)]);
    }
   static function refreshMemberCount($branch_id,$id){
      DB::statement(DB::raw("update service_plans set member_count = (select COUNT(p.id) FROM plan_subscriptions as p where p.service_plan_id =$id AND p.branch_id =$branch_id) where id =$id and $branch_id =$branch_id"));
   }

   function getSubscribers($id=null,$ss=null){
     $service_plan_id =$id?$id:$this->getId();
     $ss =$ss?$ss:$this->getUserInfo();
     $customer_table = InvoiceSettings::$customer_table;
     return DB::table("plan_subscriptions as l")->join($customer_table." as c","c.id",'=',"l.client_id")->join('persons as p','p.id','=','c.person_id')->where('l.service_plan_id',$service_plan_id)->selectRaw("l.id,c.id as client_id,c.code,concat(p.last_name,' ',p.first_name) as name,p.sex,p.email,p.phone_number, p.address,p.created_at,p.create_user")->orderBy('name','ASC')->get();
   }
   function getSubscriberCount($id=null,$ss=null){
    $service_plan_id =$id?$id:$this->getId();
    $ss =$ss?$ss:$this->getUserInfo();
    return 1;
  }
}
