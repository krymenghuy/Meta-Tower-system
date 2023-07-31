<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;
use DB;
class PriceList //extends Model
{
    //use HasFactory;
    protected $id =null, $user_info = null;
    function __construct($id=null,$user_info){
        $this->id = $id;
        $this->user_info = $user_info;
    }

    static function checkDateOverlap($start_date, $end_date,$id=null){
        return false;
    }

    static function validateAcademicYear($ac_year){
      $sts = explode('-',$ac_year);
      if(!isset($sts[1])) return 'Invalid academic year '.$ac_year;
      if (!is_numeric($sts[0]) || !is_numeric($sts[1])) return 'Invalid academic year '.$ac_year;
      if (intval($sts[0]) >= intval($sts[1])) return 'Invalid academic year '.$ac_year;
      return null;
    }

    function save($arr=[],$id=null,$ss=null){
       $id = $id? $id : $this->id;
       $ss =$ss? $ss: $this->user_info;

       $v_rule = [
         'name'=>'1|string|1-200',
         'start_date'=>'1|date',
         'end_date'=>'1|date',
         'academic_year'=>'1|string|35',
         'description'=>'0|string|0-250'
       ];

       $created = false;
       if (!$id) $created = true;
       $res = validateObject($arr,$v_rule,true,['academic_year'=>['-']],$ss->lang,false,null);
       if($res->error) return DV::error($res->error);
       $inputs = $res->values;
       $start_date = $inputs['start_date'];
       $end_date = $inputs['end_date'];
       $ac_year = $inputs['academic_year'];
       $err = self::validateAcademicYear($ac_year);
       if($err) return DV::error($err);

       $inputs['end_date'] = convertDate($end_date);
       $inputs['start_date'] = convertDate($start_date);

        $err = self::checkDateOverlap($start_date,$end_date,$id);
       if($err){
          return DV::error($err);
       }
       $id = saveData($ss,'price_list',['id'=>$id],$inputs,[],1,false);
       return DV::depends($id,['action'=>'Saved','price_list'=>$this->list_price_list()],'Failed to save price list');
    }

    function delete($id=null){
        $id = $id?$id:$this->id;
        DB::table('price_list_items')->where('id',$id)->delete();
        $x = DB::table('price_list')->where('id',$id)->delete();
        return Dv::depends($x,null,'Failed to delete price list');
    }

    static function details($id = null){
       $row = DB::table('price_list as l')->where('id',$id)
       ->selectRaw('l.id,l.name,l.description,l.start_date,l.end_date,l.academic_year,l.create_user,formatDate(l.created_at) As created_at')
       ->get()->first();
       if(!$row) return null;
       $row->items = self::items($id);
       return $row;
    }

    function list_price_list(){
        return DB::table('price_list')->selectRaw('start_date,end_date,description,academic_year')->get();
    }

    // function price_list_item_details($id = null){

    // }

    static function items($id=null){
        return DB::table('price_list_items as i')
                ->join('programs as p','p.id','=','i.program_id')
                ->join('sessions as s','s.id','=','i.session_id')
                ->where('list_id',$id)
                ->selectRaw('i.id,i.price,i.currency_code,i.program_id,i.session_id,p.name as program_name, s.name as session')->get();
    }
    function getItems($id=null){
        $id = $id?$id:$this->id;
        return self::items($id);
    }
    /**
     *add item to a price list
     * $arr = ['class_name','session','price','currency_code']
    */
    function saveItem($arr=[],$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss =$ss?$ss:$this->user_info;
        $v_rule = [
            'id'=>'0|number|identity=1',
            'program_id'=>'1|number|exists=programs.id',
            'list_id'=>'1|number|exists=price_list.id',
            'session_id'=>'1|choice|1,2',
            'price'=>'0|number',
            'currency_code'=>'0|string|default=USD'
        ];

        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $item_id =$res->id;
        $item_id = saveData($ss,'price_list_items',['id'=>$item_id],$inputs,[],1,false);
        return DV::depends($item_id,['action'=>'Saved','price_list_items'=>$this->listPriceListItem($inputs['list_id'])],'Failed to save Item');
    }

    static function itemDetails($id){
        return DB::table('price_list_items')->where('id',$id)->selectRaw('list_id,program_id,price,currency_code,session_id')->first();
    }

    function deleteItem($d){
        $id = isset($d->id)?$d->id:$d->item_id;
        $list_id = $d->list_id;
        $x = DB::table('price_list_items')->where('id',$id)->delete();
        return DV::depends($x,['action'=>'Deleted','price_list_items'=>$this->listPriceListItem($list_id)],'Failed to delete price list item');
    }

    function listPriceListItem($list_id){
        return DB::table('price_list_items as i')
                ->join('programs as p','p.id','=','i.program_id')
                ->join('sessions as s','s.id','=','i.session_id')
                ->join('price_list as l','l.id','=','i.list_Id')
                ->where('l.id',$list_id)
                ->selectRaw('i.id,i.list_id,p.name as program_name,i.currency_code,s.name as session,i.price')->get();
    }





    function list_paginate($arr=[],$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $branch_id =$ss->branch_id;

        $current_page =isset($arr['current_page'])?$arr['current_page']:1;
        $per_page =isset($arr['per_page'])?$arr['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;
        $str_moreWhere ="1=1";
        $str_search="1=1";

        $cols = 'l.id, l.name,l.academic_year, formatDate(l.start_date) as start_date,formatDate(l.end_date) as end_date,l.description,l.create_user,formatDate(l.created_at) as created_at, NULL AS auth_user, NULL AS auth_date';
        $query = DB::table('price_list as l')->where('l.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw($cols);

        $count_query = clone $query;
        $count = $count_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    /**
     * $arr ['start_date','acadmic_year','program_id','session_id'] // pmt_option_id (optional)
    */
    function getTuitionDue($arr){
        $d = (object)$arr;
        $session_id = $d->session_id;
        $program_id = $d->program_id;
        $academic_year = $d->academic_year;
        $pmt_option_id = isset($d->pmt_option_id) ? $d->pmt_option_id : null;
        $start_date = convertDate($d->start_date);
        $str_date = 'Date(l.start_date)<=\''.$start_date.'\' AND Date(l.end_date)>=\''.$start_date.'\'';
        $row = DB::table('price_list as l')
                // ->whereRaw($str_date)
                ->where('i.program_id',$program_id)
                ->where('l.academic_year',$academic_year)
                ->where('i.session_id',$session_id)
                ->join('price_list_items as i','i.list_id','=','l.id')
                ->selectRaw('l.id as price_list_id,i.price')
                ->first();
        // if(!$row){
        //     return (object)['price' => 0,'dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];
        // }
        // if($pmt_option_id>0){
        //     $discount_info = $this->getPolicyDiscount($row->price,$pmt_option_id,$row->price_list_id);
        // }

        // $tuition_due = $row->price - $discount_info->discount_amount;
        // $discount_info->tuition = $row->price;
        // $discount_info->tuition_due = $tuition_due;
        // return $discount_info;
        // return (object)['price' => 0,'dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];
        return $row;
    }


    function getPolicyDiscount($price,$pmt_option_id,$id=null) {
        $id = $id?$id:$this->id;
        $row = DB::table('policy_discounts')
                ->where('pmt_option_id',$pmt_option_id)
                ->where('price_list_id',$id)
                ->selectRaw('discount,discount_type')
                ->get()->first();
        if(!$row)  return (object)['price' => 0,'dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0];

        $discount_amt = 0;
        $discount_percent = 0;

        if($row->discount_type == 'percentage'){
            $discount_amt = $price* $row->discount/100;
            $discount_percent = $row->discount;
        }else{
            $discount_amt = $row->discount;
            $discount_percent = ($row->discount * 100)/$price;
        }

        return (object)['price' => $price,'dicount_percent' => $discount_percent,'discount_amount' => $discount_amt,'discount_type'=>$row->discount_type,'discount'=>$row->discount];

    }



}
