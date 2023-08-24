<?php

namespace App\Models\MobileSetting;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
class Banner //extends Model
{
    // use HasFactory;
    protected $id=null,$ss=null,$img_dir = 'banners' ;
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function save($arr=[],$id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $v_rule = [
            'title' => '0|string|1,150|default',
            'photo' => '0|image',
        ];

        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return $ss;
        $inputs = $res->values;
        $image = $inputs['photo'];
        unset($inputs['photo']);

        $x = PublicStorage::saveImage(1,$this->img_dir,null,$image,null,['id' => $id,'store'=>'banners.file_name']);
        if($x->status == 'OK'){
            $id = saveData($ss,'banners',['id' => $id],[
                'file_name' => $x->file_name
            ],[],1);
        }
        return DV::depends($id,'Created');

    }

    function list($ss=null){
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $rows = DB::table('banners')->selectRaw('file_name')->get();
        foreach($rows as $row){
            $row->image_url = PublicStorage::getUrl($branch_id,$this->img_dir,'image').$row->file_name;
        }
        return $rows;
    }

    function details($id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $branch_id = $ss->branch_id;
        $row = DB::table('banners')->selectRaw('file_name')->where('id',$id)->first();
        $row->image_url = PublicStorage::getUrl($branch_id,$this->img_dir,'image').$row->file_name;
        return $row;
    }

    function delete($id=null,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $id = $id?$id:$this->id;
        $file_name = DB::table('banners')->where('id',$id)->take(1)->value('file_name');
        if($file_name){
            PublicStorage::delete($ss->branch_id,$this->img_dir,'image',$file_name);
        }
        $row = DB::table('banners')->where('id',$id)->delete();
        return $row;
    }
}
