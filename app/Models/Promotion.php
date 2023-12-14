<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use Carbon\Carbon;
use App\Models\Notifier;
use App\Models\PublicStorage;
use Sanitizer;
use DB;
 
class Promotion //extends Model
{
    //use HasFactory;
 
    //$d = {[user_class],'start_date','end_date','description','title',photo_data,'file_type',[days_to_expire]=30}
    function savePromotion($ss,$arr){
        //$ss = UM::getUserInfoByToken($d);
        //if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $d = (object)$arr;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $user_class = isset($d->user_class)?Sanitizer::sanitize($d->user_class):null;
        $id = isset($d->id)?$d->id:null;;
        if(!$id) $id = isset($d->promo_id)?$d->promo_id:null;
        //$category_id = isset($d->category_id)?$d->category_id:null;
        $category = isset($d->category)?$d->category:null;
        $title = isset($d->title)?Sanitizer::sanitize($d->title):null;
     
        $description = isset($d->description)?Sanitizer::sanitize($d->description):null;
        $file_type = isset($d->file_type)?Sanitizer::sanitize($d->file_type):null;
        //do not sanitize photo_data using 
        $photo_data = isset($d->photo_data)?$d->photo_data:null;
        
        //by default, any expiration date up to 10 days after creation date
        $days_to_expire = isset($days_to_expire)?$d->days_to_expire:30;
        
        $new_promo_id = null;

        if($user_class !=='merchant') return DV::error('User class must be merchant');
        

        if(empty($title))  return DV::error("Title or Promotion cannot be empty");
        if(empty($description)) return DV::error("Please describe something about the promotion");
        //if(empty($category_id)) return "Category is not valid";
        $file_name = null;

        if ($id > 0){
            $org_start_date = null;
            $e= $this->getProps($id,['start_date','file_name']);
            if($e){
                $org_start_date =$e->start_date;
                $file_name = $e->file_name;
            } 
           
            if(!(bool)strtotime($org_start_date)) $org_start_date = date('Y-m-d'); 
            $expiry_date = Date("Y-m-d",strtotime($org_start_date."+$days_to_expire days")); 
            DB::table('promotions')->where('id',$id)->update([
                'category'=>$category,
                'title'=>$title,
                'file_name'=>null,
                'file_type'=>null,
                'user_class'=>$user_class,
                'description'=>$description,
                //'start_date'=>date('Y-m-d'),
                'expiry_date'=>$expiry_date
                //'create_user'=>$ss->login_name,
                //'create_date'=>getNowTime()
            ]);
            
            $new_promo_id = $id;
             //delete photo file if there is new image supplied
             if (isImage($photo_data)){
                if($file_name) PublicStorage::delete($branch_id,$user_class,'image',$file_name);
             }
            
              
        }else{
            $expiry_date = Carbon::now()->addDay($days_to_expire);
            DB::table('promotions')->insert(array(
                'branch_id'=>$branch_id,
                'category'=>$category,
                'title'=>$title,
                'file_name'=>null,
                'file_type'=>null,
                'user_class'=>$user_class,
                'description'=>$description,
                'start_date'=>date('Y-m-d'),
                'expiry_date'=>$expiry_date,
                'create_user'=>$ss->login_name,
                'create_date'=>getNowTime()
            ));
            $new_promo_id = DB::getPdo()->lastInsertId();
        }
        $promo = null; 
        if($new_promo_id > 0){
           $m = PublicStorage::saveImage($branch_id,$user_class,$file_type,$photo_data);
           if($m->status ==='OK'){
              DB::table('promotions')->where('id',$new_promo_id)->update(array('file_name'=>$m->file_name,'file_type'=>$m->file_type));   
              $url = htmlspecialchars(PublicStorage::getUrl($branch_id,$user_class,'image').$m->file_name);
              //$img_url = PublicStorage::getUrl($branch_id,$user_class,'image').$m->file_name;
              $promo = [
                  'image_url'=>$url,
                  "category"=>$category,
                  "title"=>$title
              ];

              //begin:: notification to Merchant 
              if(!$id || $id <=0){
                    $p = $this->getProps($id,['id','title','description','user_class','category','file_name','create_user','start_date','expiry_date']);
                    $cdata =[
                        [
                            'user_class'=>'merchant',
                            'target_user_id'=>0,
                            'persist'=>1,
                            'image_url'=>$url,
                            'title'=>$title,
                            "message"=>$description,
                            'data'=>$p
                        ]
                    ];
                    $res = Notifier::notify_mobile($branch_id,$cdata);
              }
              //end:: notification to Merchant

              return DV::depends(1,["image_url"=>$url,'promotion'=>$promo]);

           }else {
                return DV::depends(1,['create_image_error'=>$m->error_message,'promotion'=>$promo]);
           } 
        } else return DV::error("Unexpected error in creating promotion");
        
    }
 
    //$d = {'user_class','id'}
    function deletePromotion($ss,$arr){
        ///$ss = UM::getUserInfoByToken($d);
        ///if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $d = (object)$arr;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $user_class = isset($d->user_class)?$d->user_class:null;
        $id = isset($d->id)?Sanitizer::sanitize($d->id):null;
        if(!$id) $id = isset($d->promo_id)?Sanitizer::sanitize($d->promo_id):null;
         
        //if (!UM::correctUserClass($user_class)) return DV::error("User class is not correct!",$ss->lang);
        //get previous image file name if exists
        $file_name = null;
        $x= $this->getProps($id,['file_name']);
        if ($x) $file_name = $x->file_name;

        $x = DB::table('promotions')->where('branch_id',$branch_id)->where('id',$id)->delete();
        //if($x){
          if($file_name){
            $path = PublicStorage::getDiskPath($branch_id,$user_class,'image').$file_name;
            $err = deleteFile($path);
            //if($err) return "record deleted, but file was not deleted"; 
          }  
          return DV::success();
        //}else return DV::error("Failed to delete promotion $id",$ss->lang);  
       
    }
 
    //$d = {user_class,id}
    function getPromotionInfo($ss,$arr){
        //$ss = UM::getUserInfoByToken($d);
        //if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $d = (object)$arr; 
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $user_class = isset($d->user_class)?$d->user_class:null;
        $id = isset($d->id)?$d->id:null;
        if(!$id) $id = isset($d->promo_id)?$d->promo_id:null;
        
        $today = date('Y-m-d'); 
        //$rows = DB::table('promotions as p')->where('id',$id)->selectRaw("id,title,description,user_class,category,file_name,create_user,start_date,DATEDIFF('$today',start_date) AS days_to_expire, DATE_FORMAT(expiry_date,'%d %b %Y') AS expiry_date")->limit(1)->get();
        $row = $this->getProps($id,['id','title','description','user_class','category','file_name','create_user','start_date','expiry_date']);
        if($row){
            $file_name = $row->file_name;
           if($file_name){
               $url = PublicStorage::getUrl($branch_id,$user_class,'image').$file_name;
               $row->image_url = htmlspecialchars($url);
           }
        } 
        return $row;
    }

    function getProps($id,$props=[]){
        $cols = implode(',',$props);
        $rows = DB::table('promotions AS p')->where('id',$id)->selectRaw($cols)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    //getPromotions() | getPromoImages()
    //$d = {'user_class','category'}
    //This method is used by both backend and Mobile App api called throu ApiController.php
    function getPromotionList($ss,$arr){
        //$ss = UM::getUserInfoByToken($d);
        //if ($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $d = (object)$arr;
         $branch_id = Sanitizer::sanitize($ss->branch_id);

        //shoudl default @user_class to "merchant"???
        //$user_class = isset($d->user_class)?Sanitizer::sanitize($d->user_class):null;
        $category_id = isset($d->category_id)?Sanitizer::sanitize($d->category_id):null;
        $category = isset($d->category)?Sanitizer::sanitize($d->category):null;

        //time zone is important for this query of promotion
        $this_time = getNowTime();
        $str_cat = null;
        if(!empty($category)) $str_cat =" AND p.category ='$category'";
        $more_where ="1=1";
        //$more_where ="p.expiry_date >='$this_time' ".$str_cat;
        $rows = DB::table('promotions AS p')->where('p.branch_id',$branch_id)->whereRaw($more_where)->selectRaw("p.id,DATE_FORMAT(p.start_date,'%d %b %Y') AS start_date,DATE_FORMAT( p.expiry_date,'%d %b %Y') AS expiry_date,p.title,category,p.user_class,description,file_name,file_type")->orderByRaw("p.id DESC,p.expiry_date ASC")->get();
        foreach($rows as $row){
            $url = null;
            if($row->file_name) $url = PublicStorage::getUrl($branch_id,"merchant",'image').$row->file_name;
            $row->image_url = htmlspecialchars($url);
            $row->file_name = null;
        }
        return $rows;
    }

}
