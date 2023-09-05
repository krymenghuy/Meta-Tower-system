<?php

namespace App\Models\MobileSetting;
use App\Models\DV;
use App\Models\PublicStorage;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
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
        $newID = saveData($ss,'social_media',['id' => $id],$inputs,[],1);
        if($newID>0){
            PublicStorage::saveImage($branch_id,self::$img_dir,null,$image,null,['id' => $newID,'store' => 'social_media.file_name']);
        }
        return DV::depends($newID,'Created');
    }

    function list($ss=null){
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $rows = DB::table('social_media')->where('branch_id',$branch_id)->selectRaw('file_name,title as name,url')->get();
        foreach($rows as $row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl($branch_id,self::$img_dir,'image').$row->file_name;
            }else  $row->image_url = $row->file_name;
            unset($row->file_name);
        }
        return $rows;
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $row = DB::table('social_media')->where('id',$id)->where('branch_id',$branch_id)->selectRaw('file_name,title as name,url')->first();
        if($row){
            if($row->file_name != null){
                $row->image_url = PublicStorage::getUrl($branch_id,self::$img_dir,'image');
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
            PublicStorage::delete($ss->branch_id,$this->img_dir,'image',$file_name);
        }
        $row = DB::table('social_media')->where('id',$id)->delete();
        return DV::depends($id,'Deleted');
    }
}
