<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DV;
use DB;

class PolicyDiscount //extends Model
{
    //use HasFactory;
    protected $id = null, $user_info = null;

    function __construct($id=null,$user_info=null){
        $this->id = $id;
        $this->user_info = $user_info;
    }

    function save($arr = [],$id = null, $ss = null){
        $ss =$ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $v_rule = [
            //'pol_discount_id'=>'0|number|identity=1',
            'price_list_id'=>'1|number',
            'pmt_option_id'=>'1|choice|1,2,3',
            'discount'=>'1|number',
            'session_id'=>'1|number|choice|1,2',
            'discount_type'=>'1|choice|percentage,amount'
        ];

        $res = validateObject($arr,$v_rule,true,[],$ss->lang,false,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $price_list_id = $inputs['price_list_id'];
        $priceInfo = DB::table('price_list')->where('id',$price_list_id)->selectRaw('id,start_date,end_date')->get()->first();
        if(!$priceInfo) return Dv::error('Price List ID is not valid');
        $inputs['start_date'] = $priceInfo->start_date;
        $inputs['end_date'] = $priceInfo->end_date;

        $pol_discount_id = $id;
        $pol_discount_id = saveData($ss,'policy_discounts',['id'=>$pol_discount_id],$inputs,[],1,true);
        return DV::depends($pol_discount_id,['id'=>$pol_discount_id],'Failed to save policy discount');
    }

    function delete($id=null){
        //$ss =$ss?$ss:$this->user_info;
        $id = $id?$id:$this->id;
        $x = DB::table('policy_discounts')->where('id',$id)->delete();
        return DV::depends($x,null,'Failed to delete policy discount');
    }

    static function details($id){
        $cols = 's.id as session_id,d.id,d.discount,d.discount_type,d.pmt_option_id,op.name as pmt_option,s.`name` as `session`, l.id as price_list_id,l.name as price_list_name,l.academic_year,formatDate(l.start_date) AS start_date, formatDate(l.end_date) AS end_date,d.create_user,formatDate(d.created_at) as created_at,d.auth_user,d.auth_date';
        return DB::table('policy_discounts as d')->join('price_list as l','l.id','=','d.price_list_id')->join('pmt_options as op','op.id','=','d.pmt_option_id')->join('sessions as s','s.id','=','d.session_id')->where('d.id',$id)->selectRaw($cols)->get()->first();
    }
    function getDetails($id=null){
        $id = $id?$id:$this->id;
        return self::details(($id));
    }

    static function select_options($ss){
        $res = [
            'price_list'=>Setting::price_list_options($ss),
            'sessions' => Setting::session_options($ss),
            'pmt_options' => Setting::pmt_options($ss)
        ];
        return $res;

    }

    function list_paginate($arr=[],$ss=null){
        $ss =$ss?$ss:$this->user_info;
        $branch_id =$ss->branch_id;
        $d = (object)$arr;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)? $$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;
        $str_search="1=1";

        $search_value = isset($d->search_value)?$d->search_value:null;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $pmt_option_id = isset($d->pmt_option_id)?$d->pmt_option_id:null;
        $academic_year = isset($d->academic_year)?$d->academic_year:null;
        if ($pmt_option_id >0) $str_search = ' d.pmt_option_id ='.$pmt_option_id;
        if ($price_list_id >0) $str_search = ($str_search? ' AND ':'').' d.price_list_id ='.$price_list_id;
        if ($academic_year >0) $str_search = ($str_search? ' AND ':'').' d.academic_year =\''.$academic_year.'\'';
        if ($search_value >0) $str_search = ($str_search? ' AND ':'').' (d.discount ='.$search_value.')';

        $cols = 'd.id,d.discount,d.discount_type,d.pmt_option_id,op.name as pmt_option,s.`name` as `session`, l.id as price_list_id,l.name as price_list_name,l.academic_year,formatDate(l.start_date) AS start_date, formatDate(l.end_date) AS end_date,d.create_user,formatDate(d.created_at) as created_at,d.auth_user,d.auth_date';
        $query = DB::table('policy_discounts as d')->join('price_list as l','l.id','=','d.price_list_id')->join('pmt_options as op','op.id','=','d.pmt_option_id')->join('sessions as s','s.id','=','d.session_id')->where('d.branch_id',$branch_id)->whereRaw($str_search)->selectRaw($cols);

        $count_query = clone $query;
        $count = $count_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
}
