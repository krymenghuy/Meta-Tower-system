<?php

namespace App\Models;
use App\Models\DV;
use App\Models\PublicStorage;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
// use Illuminate\Pagination\LengthAwarePaginator;
class SocialMedia //extends Model
{
    // use HasFactory;
    protected $id=null,$userInfo=null;
    protected static $img_dir = 'social_media';
    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    
    function save($arr,$id=null,$ss=null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $subs_id = $ss->subs_id;
        $customer_id = $ss->subscriber_id; 
        $bin_customer_id = hex2bin($customer_id); 
        $v_rule = [
            'name' => '1|string|1-100',
            'url'=>'0|string|1-300',
            'photo' => '0|image',
            'branch_id'=>'0|number|exists.um_branches.id'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $branch_id = $inputs['branch_id'] ?? $ss->branch_id;
        $inputs['branch_id'] = $branch_id;
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $inputs['customer_id'] = $bin_customer_id; 
        $to_delete_image = $id && (!$image || isImage($image));
        if($to_delete_image){
          $prev_file_name = DB::table('social_media')->where('id',$id)->value('file_name');
          if($prev_file_name) PublicStorage::delete(['subs_id'=>$subs_id,'dir'=>self::$img_dir],'image',$prev_file_name);
        }
 
        $existName = isExists('social_media',['name'=>$inputs['name']],'name',$inputs['name'],$id);
        if($existName) return DV::error('Social media name is already used');


        $newID = saveData($ss,'social_media',['id' => $id],$inputs,[],1);
        if($newID){
            PublicStorage::saveImage(['subs_id'=>$subs_id,'dir'=>self::$img_dir],null,$image,null,['id' => $newID,'store' => 'social_media.file_name']);
        }
        return DV::depends($newID,null,'Failed to save social media');
    }

    function listAll($branch_id =null,$ss =null){
        $ss = $ss ??  $this->userInfo;
        $branch_id = $ss->branch_id;
        $subs_id = $ss->subs_id ?? getCurrentSubsId(true);
        $customer_id = $ss->subscriber_id;
        $str_branch_id = $branch_id > 0? 's.branch_id ='.$branch_id : '1=1';
        $col_customer_id = DBX::getHEX('customer_id','customer_id');
        $rows = DB::table('social_media AS s')->whereRaw($str_branch_id)->where('s.customer_id',hex2bin( $customer_id))->selectRaw('branch_id,file_name,name,url,id,'.$col_customer_id)->get();
        foreach($rows as $row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl(['subs_id'=>$subs_id,'dir'=>self::$img_dir],'image').$row->file_name;
            }else  $row->image_url = $row->file_name;
            unset($row->file_name);
        }
        return $rows;
    }
    
    // function list($filter,$ss=null){
    //     $ss = $ss?$ss:$this->ss;
    //     $branch_id = $ss->branch_id;
    //     $d = (object)$filter;
    //     $search_value =isset($d->search_value)?$d->search_value:null;
    //     $current_page =isset($d->current_page)?$d->current_page:1;
    //     $per_page =isset($d->per_page)?$d->per_page:10;
    //     if(!is_numeric($current_page)) $current_page=1;
    //     $skip_rows = ($current_page -1) * $per_page;
    //     $str_search ="1=1";
    //     $str_moreWhere="1=1";
    //     if($search_value){
    //         $skip_rows =0;
    //         $search_value = escape_like_str($search_value);
    //     }
    //     $q = DB::table('social_media')->where('branch_id',$branch_id)->selectRaw('file_name,title as name,url,id,update_user,formatTime(update_date) as updated_at');
    //     $count_query = clone $q;
    //     $count = $count_query->count('id');
    //     $rows = $q->get();
    //     foreach($rows as $row){
    //         if($row->file_name){
    //             $row->image_url = PublicStorage::getUrl($branch_id,self::$img_dir,'image').$row->file_name;
    //         }else  $row->image_url = null;
    //         unset($row->file_name);
    //     }
    //     return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    // }

    function details($id=null,$ss=null){
        $ss = $ss?? $this->userInfo;
        $id = $id?? $this->id;
        $subs_id = $ss->susb_id ?? getCurrentSubsId(true);
        $customer_id = $ss->subscriber_id;
        $row = DB::table('social_media')->where('id',$id)->where('customer_id',hex2bin($customer_id))->selectRaw('file_name,name,url,id')->first();
        if($row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl(['subs_id'=>$subs_id,'dir'=>self::$img_dir],'image').$row->file_name;
            }else  $row->image_url = $row->file_name;
            return $row;
        }
        unset($row->file_name);
        return null;
    }

    function delete($id=null,$ss=null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $customer_id = $ss->subscriber_id;
        $file_name = DB::table('social_media')->where('customer_id',hex2bin($customer_id))->where('id',$id)->value('file_name');
        if($file_name){
            PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$file_name);
        }
        $row = DB::table('social_media')->where('customer_id',hex2bin($customer_id))->where('id',$id)->delete();
        return DV::depends($row,'Deleted');
    }
}
