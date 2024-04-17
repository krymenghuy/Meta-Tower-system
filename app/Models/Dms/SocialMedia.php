<?php

namespace App\Models\Dms;
use App\Models\Dms\DV;
use App\Models\Dms\PublicStorage;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
class SocialMedia //extends Model
{
    // use HasFactory;
    protected $id=null,$ss=null;
    protected static $img_dir = 'social_media';
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function save($arr,$id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'name' => '1|string|1-100',
            'url'=>'0|string|1-300',
            'photo' => '0|image'
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inputs['title'] = $inputs['name'];
        unset($inputs['name']);
        $image = $inputs['photo'];
        unset($inputs['photo']);
        $to_delete_image = $id && (!$image || isImage($image));
        if($to_delete_image){
          $prev_file_name = DB::table('social_media')->where('id',$id)->take(1)->value('file_name');
          if($prev_file_name) PublicStorage::delete($branch_id,'students','image',$prev_file_name);
        }
 
        $existName = isExists('social_media',['title'=>$inputs['title']],'title',$inputs['title'],$id);
        if($existName) return DV::error('Social media name is already used');


        $newID = saveData($ss,'social_media',['id' => $id],$inputs,[],1);
        if($newID>0){
            PublicStorage::saveImage($branch_id,self::$img_dir,null,$image,null,['id' => $newID,'store' => 'social_media.file_name']);
        }
        return DV::depends($newID,null,'Failed to save social media');
    }

    function listAll($ss){
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $rows = DB::table('social_media')->where('branch_id',$branch_id)->selectRaw('file_name,title as name,url,id')->get();
        foreach($rows as $row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl($branch_id,self::$img_dir,'image').$row->file_name;
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
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $row = DB::table('social_media')->where('id',$id)->where('branch_id',$branch_id)->selectRaw('file_name,title as name,url,id')->first();
        if($row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl($branch_id,self::$img_dir,'image').$row->file_name;
            }else  $row->image_url = $row->file_name;
            return $row;
        }
        unset($row->file_name);
        return null;
    }

    function delete($id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $file_name = DB::table('social_media')->where('id',$id)->take(1)->value('file_name');
        if($file_name){
            PublicStorage::delete($ss->branch_id,self::$img_dir,'image',$file_name);
        }
        $row = DB::table('social_media')->where('id',$id)->delete();
        return DV::depends($row,'Deleted');
    }
}
