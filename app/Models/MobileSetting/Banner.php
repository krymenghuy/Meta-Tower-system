<?php

namespace App\Models\MobileSetting;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
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
        $v_rule = [
            'title' => '0|string|1,150',
            'photo' => '0|image',
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return $ss;
        $inputs = $res->values;
        $image = $inputs['photo'];
        unset($inputs['photo']);

        $newID = saveData($ss,'banners',['id' => $id],$inputs,[],1);
        if($newID){
            PublicStorage::saveImage(1,$this->img_dir,null,$image,null,['id' => $newID,'store'=>'banners.file_name']);
        }
    }

    function list($ss){
        $rows = DB::table('banners')->selectRaw('file_name')->get();
        foreach($rows as $row){
            $row->image_url = PublicStorage::getUrl($ss->branch_id,$this->img_dir,'image').$row->file_name;
        }
        return $rows;
    }

    function details($id=null,$ss){
        $row = DB::table('banners')->selectRaw('file_name')->get()->first();
        $row->image_url = PublicStorage::getUrl($ss,$this->img_dir,'image').$row->file_name;
        return $row;
    }
}
