<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class PriceList //extends Model
{
    //use HasFactory;
    protected $id =null, $user_info = null;
    function __cosntruct($id=null,$user_info){
        $this->id = $id;
        $this->user_info = $user_info;
    }

    static function checkDateOverlap($start_date, $end_date,$id=null){

    }

    function save($arr=[],$id=null,$ss=null){
       $id = $id?$id:$this->id;
       $ss =$ss?$ss:$this->user_info;

       $v_rule = [
         'name'=>'1|string|1-200',
         'start_date'=>'1|date',
         'start_date'=>'1|date',
         'academic_year'=>'1|string|35'
       ];

       $created = false;
       if (!$id) $created = true; 
       $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
       if($res->error) return DV::error($res->error);
       $inputs = $res->values;
       $start_date = $inputs['start_date'];
       $end_date = $inputs['end_date'];
       $inputs['end_date'] = convertDate($end_date);
       $inputs['start_date'] = convertDate($end_date);

        $err = self::checkDateOverlap($start_date,$end_date,$id);
       if($err){
          return DV::error($err);
       }
       $id = saveData($ss,'price_list',['id'=>$id],$inputs,[],1,false); 
       return DV::depends($id,null,'Failed to save price list');
    }

    function delete($id=null){
        $id = $id?$id:$this->id;
        DB::table('price_list_items')->where('id',$id)->delete();
        DB::table('price_list')->where('id',$id)->delete();
        return Dv::success();
    }

    /**
     *add item to a price list
     * $arr = ['class_name'] 
    */
    function addItem($arr=[],$id=null,$ss=null){

    }
}
