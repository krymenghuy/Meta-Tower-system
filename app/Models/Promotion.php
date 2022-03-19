<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use Carbon\Carbon;
use App\Models\PublicStorage;
use Session;
use DB;
 
class Promotion extends Model
{
    use HasFactory;
 
    //$d = {[user_class],'start_date','end_date','description','title',photo_data,'file_type',[days_to_expire]=30}
    function savePromotion($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $user_class = isset($d->user_class)?sanitize($d->user_class):null;
        $id = isset($d->id)?$d->id:null;;
        if(!$id) $id = isset($d->promo_id)?$d->prom_id:null;
        $category_id = isset($d->category_id)?$d->category_id:null;
        $category = isset($d->category)?$d->category:null;
        $title = isset($d->title)?sanitize($d->title):null;
     
        $description = isset($d->description)?sanitize($d->description):null;
        $file_type = isset($d->file_type)?sanitize($d->file_type):null;
        //do not sanitize photo_data using 
        $photo_data = isset($d->photo_data)?$d->photo_data:null;
 
        //by default, any expiration date up to 10 days after creation date
        $days_to_expire = isset($days_to_expire)?$d->days_to_expire:30;
        
        $new_promo_id = null;

        if($user_class !='merchant') {
            return DV::error('User class must be merchant');
        }

        if(empty($title))  return DV::error("Title or Promotion cannot be empty");
        if(empty($description)) return DV::error("Please describe something about the promotion");
        //if(empty($category_id)) return "Category is not valid";
        if ($id > 0){
            $file_name = null;
            $org_start_date = null;
            $e= $this->getProps($id,['start_date','file_name']);
            if($e){
                $org_start_date =$e->start_date;
                $file_name = $e->file_name;
            } 
          

            if(!(bool)strtotime($org_start_date)) $org_start_date = date('Y-m-d'); 
            $expiry_date = Date("Y-m-d",strtotime($org_start_date."+$days_to_expire days")); 
            DB::table('promotions')->where('id',$id)->update(array(
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
            ));
            
            $new_promo_id = $id;
             //delete photo file
             if($file_name){
                $path = PublicStorage::getDiskPath($branch_id,$user_class,'image').$file_name;
                $err= deleteFile($path);
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
       

        if($new_promo_id > 0){
           $m = PublicStorage::saveImage($branch_id,$user_class,$file_type,$photo_data);
           if($m->status =='OK'){
              DB::table('promotions')->where('id',$new_promo_id)->update(array('file_name'=>$m->file_name,'file_type'=>$m->file_type));   
              $url = htmlspecialchars(PublicStorage::getUrl($branch_id,$user_class,'image').$m->file_name);
              return DV::success(["image_url"=>$url]);
           }else return DV::success(['create_image_error'=>$m->error_message]); 
        } else return DV::error("Unexpected error in creating promotion ");
        
    }

    //$d = {'user_class','id'}
    function deletePromotion($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $user_class = isset($d->user_class)?$d->user_class:null;
        $id = isset($d->id)?sanitize($d->id):null;
        if(!$id) $id = isset($d->promo_id)?sanitize($d->promo_id):null;
         
        if (!UM::correctUserClass( $user_class)) return "User class is not correct!";
        //get previous image file name if exists
        $file_name = null;
        $x= $this->getProps($id,['file_name']);
        if ($x) $file_name = $x->file_name;

        $del_count = DB::table('promotions')->where('branch_id',$branch_id)->where('id',$id)->delete();
        if($del_count >0){
          if($file_name){
            $path = PublicStorage::getDiskPath($branch_id,$user_class,'image').$file_name;
            $err = deleteFile($path);
            //if($err) return "record deleted, but file was not deleted"; 
          }  
         
        }else return "Failed to delete promotion ".$del_count;  
        return null;
    }

    //$d = {user_class,id}
    function getPromotionInfo($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);
        $user_class = isset($d->user_class)?$d->user_class:null;
        $id = isset($d->id)?$d->id:null;
        if(!$id) $id = isset($d->promo_id)?$d->promo_id:null;
        
        $today = date('Y-m-d'); 
        $rows = DB::table('promotions as p')->where('id',$id)->selectRaw("id,title,description,user_class,category,file_name,create_user,start_date,DATEDIFF('$today',start_date) AS days_to_expire, DATE_FORMAT(expiry_date,'%d %b %Y') AS expiry_date")->limit(1)->get();
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
    function getPromotionList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(2)) return '@'; //need permission to do this task
        $branch_id = sanitize($ss->branch_id);

        //shoudl default @user_class to "merchant"???
        $user_class = isset($d->user_class)?sanitize($d->user_class):null;
        $category_id = isset($d->category_id)?sanitize($d->category_id):null;
        $category = isset($d->category)?sanitize($d->category):null;

        //time zone is important for this query of promotion
        $this_time = getNowTime();
        $str_cat = null;
        if(!empty($category)) $str_cat =" AND p.category ='$category'";
        $more_where ="p.expiry_date >='$this_time' ".$str_cat;
        $rows = DB::table('promotions AS p')->where('p.branch_id',$branch_id)->whereRaw($more_where)->selectRaw("p.id,DATE_FORMAT(p.start_date,'%d %b %Y') AS start_date,DATE_FORMAT( p.expiry_date,'%d %b %Y') AS expiry_date,p.title,category,p.user_class,description,file_name,file_type")->orderByRaw("p.create_date DESC,p.expiry_date ASC")->get();
        foreach($rows as $row){
            $url = null;
            if($row->file_name) $url = PublicStorage::getUrl($branch_id,$user_class,'image').$row->file_name;
            $row->image_url = htmlspecialchars($url);
            $row->file_name = null;
        }
        return $rows;
    }

}
