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
     * $arr [,'start_date','acadmic_year','level_id','session_id','semester_number'] // pmt_option_id (optional)
    */
    function getTuitionDue($arr){
        $d = (object)$arr;
        $discount_info = null;
        $session_id = $d->session_id;
        $semester_number = $d->semester_number;
        $level_id = $d->level_id;
        $academic_year = $d->academic_year;
        $pmt_option_id = isset($d->pmt_option_id) ? $d->pmt_option_id : 2;
        $level_info = DB::table('program_levels as l')->where('id',$level_id)->selectRaw('program_id,id,prev_level_id')->first();
        $start_date = convertDate($d->start_date);
        $prev_level_id = $level_info->prev_level_id;
        $str_date = 'Date(l.start_date)<=\''.$start_date.'\' AND Date(l.end_date)>=\''.$start_date.'\'';
        $row = DB::table('price_list as l')
                ->join('price_list_items as i','i.list_id','=','l.id')
                ->whereRaw($str_date)
                ->where('i.program_id',$level_info->program_id)
                ->where('l.academic_year',$academic_year)
                ->where('i.session_id',$session_id)
                ->selectRaw('l.id as price_list_id,i.price,i.program_id')
                ->first();

        if(!$row){
            return (object)['error_message'=>'Price List not defined','dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];
        }

        $nl_price = 0;
        if($pmt_option_id>0){
            if($pmt_option_id == 3 && $semester_number == 2){
                if($prev_level_id != $level_id && $prev_level_id > 0){
                    $next_pmt_info = $this->getTuitionDue(['level_id' => $prev_level_id,'pmt_option_id' => 2,'start_date'=>$start_date,'academic_year'=>$academic_year,'semester_number'=>1]);
                    if($next_pmt_info->error_message){
                        return (object)['error_message'=>'Price list for next level not defined','dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];
                    }else{
                        $nl_price = $next_pmt_info->price;
                        //$nl_discount_percent = $next_pmt_info->dicount_percent;
                        //$nl_tuition_due = $next_pmt_info->tuition_due;
                    }
                }
            }
            $discount_info = $this->getPolicyDiscount($pmt_option_id,$row->price_list_id);
        }

        if($nl_price>0){
            $row->price = ($row->price/2) + $nl_price;
            $dis_amt = ($row->price * $discount_info->discount_percent)/100;
            $net_price = $row->price - $dis_amt;
            return (object)['error_message'=>'','dicount_percent' => $discount_info->discount_percent,'discount_amount' => $dis_amt,'discount_type'=>'percentage','discount'=>$discount_info->discount_percent,'tuition'=>$row->price,'tuition_due'=>$net_price];
        }


        $tuition_due = $row->price - $discount_info->discount_amount;
        $discount_info->tuition = $row->price;
        $discount_info->tuition_due = $tuition_due;
        $discount_info->error_message = '';
        return $discount_info;
        // return (object)[dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];
    }

    function getPolicyDiscount($pmt_option_id,$id=null) {
        $id = $id?$id:$this->id;
        $row = DB::table('policy_discounts')
                ->where('pmt_option_id',$pmt_option_id)
                ->where('price_list_id',$id)
                ->selectRaw('discount,discount_type')
                ->get()->first();
        if(!$row)  return (object)['dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0];

        $discount_percent = $row->discount;

        return (object)['discount_percent' => $discount_percent,'discount_type'=>$row->discount_type,'discount'=>$row->discount];
    }



    /**
        * $arr [start_date','end_date','level_id','session_id'] // pmt_option_id (optional)
    */
    function getDailyTuition($arr=[]){

        $d = (object)$arr;
        $days = $d->days;
        $end_date = isset($d->end_date) ? $d->end_date : null;
        if(!(bool)strtotime($end_date)){
            if(!$days) return DV::error('Invalid end date');
            $end_date = dateAdd('day',$days,$d->start_date,'Y-m-d');
        }
        $monthly_fee_info = self::getMonthlyFee($arr);
        $price = $monthly_fee_info->price;
        $month = date('m',strtotime($d->start_date));
        $year = date('Y',strtotime($d->start_date));
        $dayInMonth = days_in_month($month,$year);
        $daily_fee = $price / $dayInMonth;
        $x = dateDiff_days($d->start_date,$end_date);
        $total = number_format($x * $daily_fee,2);
        $per_day = number_format($total/$x,2);

        return (object)['price_list_id' => $monthly_fee_info->price_list_id,'tuition' => $total,'tuition_due' => $total,'per_day' => $per_day,'days'=>$x];
    }

     /**
        * $arr ['start_date','months','acadmic_year','level_id','session_id'] // pmt_option_id (optional)
    */
    function getMonthlyTuition($arr){
        $d = (object)$arr;
        //*
            $month = date('m',strtotime($d->start_date)); //* get month
            $year = date('Y',strtotime($d->start_date)); //* get year
            $current_day = date('d',strtotime($d->start_date)); //* get day
            $dayInMonth = days_in_month($month,$year); //* get day in month
            $pay_week = ($dayInMonth - round($current_day,0)) / 7; //* get week(s) of payment
            $week = round($pay_week,0); //** round up week of payment */
            $pmt_option = isset($d->pmt_option_id)?$d->pmt_option_id:null; //** payment option // ;
        //*

        $last_day_in_month = getLastDayOfMonth($d->start_date);

        $monthly_fee_info = $this->getMonthlyFee($arr);
        $price = $monthly_fee_info->price;
        if($pmt_option == 1){
            $d->months = $d->months ? $d->months:3;
        }else if($pmt_option == 2){
            $d->months = $d->months ? $d->months:6;
        }else if($pmt_option == 3){
            $d->months = $d->months ? $d->months:12;
        }
        if($d->months<3){
            $weekly_tuition_due = null;

            if($current_day != 1){
                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year
                ]);
                $weekly_tuition_due = $total_weekly_Fee->tuition_due;
            }

            $monthly_fee = $monthly_fee_info->price;
            $total_tuition_due = null;
            if($weekly_tuition_due){
                $total_tuition_due = $monthly_fee + $weekly_tuition_due;
            }else{
                $total_tuition_due = $monthly_fee * $d->months;
            }

            return (object)['price_list_id' => $monthly_fee_info->price_list_id,'first_month_end_date'=>$last_day_in_month,'tuition' => $total_tuition_due,'tuition_due'=>$total_tuition_due];
        }else if($d->months < 6){
            $end_date = findFutureMonths($d->start_date,$d->months-1);//** */
            $end_date =$end_date->end_date;
            $weekly_tuition_due = 0;
            $base_amount = 0;//** base amount equal to term (3months) */
            $price_list_id = $monthly_fee_info->price_list_id;
            $monthly_tuition_due = 0;
            if($current_day != 1 && $d->months == 3){
                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);
                $weekly_tuition_due = $total_weekly_Fee->tuition_due;
                $base_amount = $price * ($d->months-1); //** minus 1 = first is not a full */
            }else{
                $term = 3;
                $pay_month = 0;
                // ** months > 3(term) totalMonth - term
                //* find term
                if($d->months > $term){
                    $pay_month = $d->months - $term;
                    $total_weekly_Fee = self::getWeeklyTuitionDue([
                        'start_date' => $d->start_date,
                        'level_id' => $d->level_id,
                        'session_id' => $d->session_id,
                        'weeks' => $week,
                        'academic_year' => $d->academic_year,
                    ]);
                    $weekly_tuition_due = $total_weekly_Fee->tuition_due;
                    $base_amount = $price * $term;
                    $monthly_tuition_due = $price * $pay_month;
                }
            }

            $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);

            $discount_amt = $base_amount * $discount_info->discount_percent / 100;
            $term_tuition_due = $base_amount - $discount_amt;
            $total_tuition_due = $term_tuition_due + $weekly_tuition_due + $monthly_tuition_due;
            $tuition = $monthly_tuition_due + $base_amount + $weekly_tuition_due;
            return (object)['price_list_id' => $monthly_fee_info->price_list_id,'end_date' => $end_date,'tuition'=>$tuition,'tuition_due'=>$total_tuition_due,'term_tuition_due' => $base_amount,'discount'=>$discount_info,'weekly_tuition'=>$weekly_tuition_due,'monthly_tuition'=>$monthly_tuition_due];
        }else if($d->months <12){
            $weekly_tuition_due = 0;
            $months = isset($d->months) ? $d->months :$d->months=6;
            $base_amount = 0;//** base amount equal to term (3months) */
            $price_list_id = $monthly_fee_info->price_list_id;
            $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);
            $monthly_tuition_due = 0;
            $tuition = 0;
            if($current_day != 1 && $d->months == 6){
                $term = 3;
                $pay_month = $months - 1;

                    $pay_month = $pay_month - $term;
                    $total_weekly_Fee = self::getWeeklyTuitionDue([
                        'start_date' => $d->start_date,
                        'level_id' => $d->level_id,
                        'session_id' => $d->session_id,
                        'weeks' => $week,
                        'academic_year' => $d->academic_year,
                    ]);

                    $weekly_tuition_due = $total_weekly_Fee->tuition_due;
                    $base_amount = $price * $term; //** base amount refer to term (3 months) */
                    $monthly_tuition_due = $monthly_fee_info->price * $pay_month;

                    $discount_amt = (($base_amount + $monthly_tuition_due) * $discount_info->discount) / 100;
                    $after_discount = ($base_amount + $monthly_tuition_due) - $discount_amt;
                    $total_tuition_due = $after_discount + $weekly_tuition_due;
                    $end_date = findFutureMonths($d->start_date,$d->months-1);//** */
                    $end_date =$end_date->end_date;
                    $tuition = $base_amount + $monthly_tuition_due + $after_discount + $weekly_tuition_due;

            }else if($current_day != 1 && $d->months > 6){
                $semester = 6-1; //* minus one because of the first months is not start on first
                $pay_month = $d->months - $semester;

                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);

                $semester_tuition = $price * $semester;

                $weekly_tuition_due = $total_weekly_Fee->tuition_due;

                $end_date = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$end_date->end_date;
                $pay_month = $pay_month - 1;// ** minus first month
                if($pay_month !=0 ) $pay_month = $pay_month * $price;
                $discount_amt = (($semester_tuition + $pay_month) * $discount_info->discount) / 100;
                $after_discount = ($semester_tuition + $pay_month) - $discount_amt;
                $total_tuition_due = $after_discount + $weekly_tuition_due;
                $tuition = $after_discount + $total_weekly_Fee->tuition_due + $pay_month;
            }else {
                $week ="full month no week count";
                $semester_tuition = $d->months * $price;
                $discount_amt = ($semester_tuition  * $discount_info->discount) / 100;
                $after_discount = $semester_tuition - $discount_amt;
                $total_tuition_due = $after_discount;
                $end_date = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$end_date->end_date;
                $tuition = $semester_tuition;
            }

            return (object)['price_list_id' => $monthly_fee_info->price_list_id,'end_date'=> $end_date,'tuition'=>$tuition,'tuition_due'=>$total_tuition_due,'term_tuition_due' => $base_amount,'weekly_tuition_due' => $weekly_tuition_due,'weeks' => $week,'monthly_tuition_due' => $monthly_tuition_due,'discount'=>$discount_info,'after_discount' => $after_discount,'discount_amount' => $discount_amt];
        }else{
            $price_list_id = $monthly_fee_info->price_list_id;
            $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);
            $total_tuition_due = 0;
            $discount_amt = 0;
            if($current_day != 1 && $d->months == 12){
                $annual = 12-1; //* because the first month is not a full month

                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);
                $annual_tuition = $price * $annual;
                $end_date = findFutureMonths($d->start_date,$d->months-1);//**  */
                $end_date =$end_date->end_date;
                $discount_amt = $annual_tuition * $discount_info->discount / 100;

                $total_tuition_due = ($annual_tuition - $discount_amt) + $total_weekly_Fee->tuition_due;
                // return $discount_info;
            }else if($current_day != 1 && $d->months >12){
                $annual = 12-1;
                $pay_month = $d->months - $annual;
                $end_date = findFutureMonths($d->start_date,$d->months-1);//**  */
                $end_date =$end_date->end_date;
                $price_list_id = $monthly_fee_info->price_list_id;
                $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);

                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);
                $pay_month = $pay_month - 1; // ** minus first month
                $annual_tuition = $annual * $price;
                $monthly_fee_tuition = $pay_month * $price;
                $discount_amt = (($annual_tuition + $monthly_fee_tuition) * $discount_info->discount) / 100 ;
                $annual_tuition = $annual_tuition - $discount_amt;
                $total_tuition_due = $total_weekly_Fee->tuition_due + $annual_tuition;
            }else{
                $annual_tuition = $d->months * $price;
                $discount_amt = ( $annual_tuition * $discount_info->discount) / 100 ;
                $annual_tuition = $annual_tuition - $discount_amt;
                $total_tuition_due = $annual_tuition;
                $week ="full month no week count";
                $end_date = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$end_date->end_date;
            }

            return (object)['price_list_id' => $monthly_fee_info->price_list_id,'end_date'=>$end_date,'tuition_due' => $total_tuition_due,'discount_amount' => $discount_amt,'weekly_tuition'=>$total_weekly_Fee->tuition_due];
        }
    }

    /**
        * $arr ['start_date','weeks','acadmic_year','level_id','session_id'] // pmt_option_id (optional)
    */
    function getWeeklyTuitionDue($arr=[]){
        $d = (object)$arr;
        $monthly_fee_info = $this->getMonthlyFee($arr);
        $weekly_fee = $monthly_fee_info->price/4;
        $x = $weekly_fee * $d->weeks;
        $days = $d->weeks * 7;
        $end_date = dateAdd('day',$days,$d->start_date);
        return (object)['price_list_id'=>$monthly_fee_info->price_list_id,'end_date' => $end_date,'tuition'=>$x,'tuition_due'=> $x==0?$weekly_fee:$x];
    }

    /**
        * $arr ['acadmic_year','level_id','session_id'] // pmt_option_id (optional)
    */
    function getMonthlyFee($arr){
        $d = (object)$arr;
        $level_id = $d->level_id;
        $start_date = isset($d->start_date)?$d->start_date:getNowTime();
        $academic_year = $d->academic_year;
        $session_id = $d->session_id;
        $level_info = DB::table('program_levels as l')->where('id',$level_id)->selectRaw('program_id,id,prev_level_id')->first();
        $start_date = convertDate($start_date);
        // $prev_level_id = $level_info->prev_level_id;
        $str_date = 'Date(l.start_date)<=\''.$start_date.'\' AND Date(l.end_date)>=\''.$start_date.'\'';
        $row = DB::table('price_list as l')
                ->join('price_list_items as i','i.list_id','=','l.id')
                ->whereRaw($str_date)
                ->where('i.program_id',$level_info->program_id)
                ->where('l.academic_year',$academic_year)
                ->where('i.session_id',$session_id)
                ->selectRaw('l.id as price_list_id,i.price,i.program_id')
                ->first();
        return (object)['price' => $row->price,'price_list_id'=>$row->price_list_id];
    }

    function payment_processing($arr=[]){
        $d = (object)$arr;
        $pmt_option_id = $d->pmt_option_id;
        if($pmt_option_id == 4){
            return $this->getWeeklyTuitionDue($arr);
        }else if($pmt_option_id == 5){
            return $this->getDailyTuition($arr);
        }else {
            return $this->getMonthlyTuition($arr);
        }
    }

    static function pendingPayment($filter=[],$ss){
        $branch_id = $ss->branch_id;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $pmt_status = isset($filter['pmt_status'])?$filter['pmt_status']:null;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $status_id = isset($filter['status_id'])?$filter['status_id']:null;
        $skip_rows = ($current_page -1) * $per_page;


        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }
        $selectCols = 'e.status_id,st.name as status,s.name,s.name_kh,ep.id,ep.tuition,ep.tuition_due,ep.tuition_paid';
        $query = DB::table('payments as ep')
                ->join('enrollments as e','e.id','=','ep.enrollment_id')
                ->join('students as s','s.id','=','e.student_id')
                ->join('status as st','st.id','=','e.status_id')
                ->selectRaw($selectCols)
                ->where('ep.branch_id',$branch_id);
                if ($status_id !== null) {
                    $query->where('e.status_id',$status_id);
                }
                // ->whereRaw($str_moreWhere)->whereRaw($str_search);
        $count_query = clone $query;
        $count = $count_query->count('ep.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function studentPendingPaymentDetails($id){
        $row = DB::table('enrollments as e')
                ->join('students as s','s.id','=','e.student_id')
                ->join('payments as ep','ep.enrollment_id','=','e.id')
                ->where('s.id',$id)
                ->selectRaw('e.level_id,e.session_id,e.campus_id,e.start_date,ep.pmt_option_id')
                ->first();
                if($row->pmt_option_id == 1){
                    $row->months = 3;
                }else if($row->pmt_option_id == 2){
                    $row->months = 6;
                }else if($row->pmt_option_id == 3){
                    $row->months = 12;
                }
        if(!$row) return $row = null;
        return $row;
    }

    function previewPendingPaymentDetails($arr=[],$id=null,$ss){
        $d = (object)$arr;
        $weeks = isset($d->weeks) ? $d->weeks :null;
        $days = isset($d->days) ? $d->days :null;

        $selectCols = 'ep.pmt_option_id,s.name,e.campus_id,e.program_id,e.level_id,e.session_id,e.academic_year,e.start_date';

        $row = DB::table('enrollments as e')
                ->join('students as s','s.id','=','e.student_id')
                ->join('payments as ep','ep.enrollment_id','=','e.id')
                ->where('s.id',$id)
                ->selectRaw($selectCols)
                ->get()->first();
        if(!$row) return null;
        $start_date = isset($d->start_date)?$d->start_date:$row->start_date;
        unset($row->start_date);
        $session = isset($d->session_id) ? $d->session_id : $row->session_id;
        $pmt_option_id = isset($d->pmt_option_id) ? $d->pmt_option_id: $row->pmt_option_id;
        $level_id = isset($d->level_id) ? $d->level_id:$row->level_id;
        $months = null;
        if($pmt_option_id == 1){
            $months = isset($d->months) ? $d->months:3;
        }else if($pmt_option_id == 2){
            $months = isset($d->months) ? $d->months:6;
        }else if($pmt_option_id == 3){
            $months = isset($d->months) ? $d->months:12;
        }
        $arr = [
            "level_id" => $level_id,
            "academic_year" => "2023-2024",
            "session_id" => $session,
            "prev_level_id" => "0",
            "start_date" => $start_date,
            "months" => $months,
            "weeks" => $weeks,
            "days" => $days,
            "pmt_option_id"=> $pmt_option_id
        ];

        $row->payment_info = $this->payment_processing($arr);
        return $row;
    }


    static function verifyPendingStudent($arr,$ss){
        $d = (object)$arr;
        $instance = new PriceList(null,$ss);
        $v_rule = [
            'id' => '0|number|exists=students.id',
            'level_id' => '0|number|exists=program_levels.id',
            'session_id' => '0|number|exists=sessions.id',
            'start_date' => '0|date',
            'academic_year' => '0|string|exists=academic_years.academic_year',
            'pmt_option_id' => '0|number|exists=pmt_options.id',
            "weeks" => "0|string",
            "days" => '0|string',
        ];
        $res = validateObject($arr,$v_rule,1,['academic_year'=>['-'],'start_date'=>['-']],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $inputs['id'];
        $program = self::getProgramByLevel($inputs['level_id'],$ss);
        $inputs['start_date'] = convertDate($inputs['start_date']);
        $pmt_option_id = isset($inputs['pmt_option_id'])? $inputs['pmt_option_id']:null;
        $weeks = $inputs['weeks'];
        $days = $inputs['days'];
        unset($inputs['pmt_option_id']);
        if($pmt_option_id == 4 && !isset($weeks)) return DV::error('weeks must be input');
        else if($pmt_option_id == 5 && !isset($days)) return DV::error('days must be input');

        $arr = [
            'level_id' => $inputs['level_id'],
            'session_id' => $inputs['session_id'],
            'start_date' => $inputs['start_date'],
            'academic_year' => $inputs['academic_year'],
            'status_id' => 2
        ];

        $id = saveData($ss,'enrollments',['student_id' => $id],$arr,[],1);
        if($pmt_option_id){
            $enr = DB::table('enrollments')->where('student_id',$id)->selectRaw('id')->first();
            $arr = [
                "level_id" => 24,
                "academic_year" => "2023-2024",
                "session_id" => 1,
                "prev_level_id" => "0",
                "start_date" => '2023-08-4',
                "months" => '',
                "weeks" => $weeks,
                "days" => $days,
                "pmt_option_id"=> $pmt_option_id
            ];
            $preview = $instance->previewPendingPaymentDetails($arr,$id,$ss);
            $payment_info = $preview->payment_info;


            $pmt_arr = [
                'pmt_option_id'=>$pmt_option_id,
                'tuition' => $payment_info->tuition,
                'tuition_due' => $payment_info->tuition_due,
                'status_id' => 1,
                'program_id' => $program->program_id,
                'level_id' => $inputs['level_id'],
                'session_id' =>  $inputs['session_id'],
                'price_list_id' => $payment_info->price_list_id,
            ];
            $set_pmt_option = saveData($ss,'payments',['enrollment_id' => $enr->id],$pmt_arr,[],1);
        }

        return DV::depends($id,$payment_info);

    }



    static function getProgramByLevel($id,$ss){
        return DB::table('programs as p')
                ->join('program_levels as pl','pl.program_id','=','p.id')
                ->selectRaw('p.name as program,p.id as program_id')
                ->where('pl.id',$id)
                ->get()->first();
    }

    static function getCurrentProgram($id,$ss){
        $row = DB::table('programs')->where('branch_id',$ss->branch_id)->where('id',$id)->selectRaw('name as program,id')->first();
        return $row;
    }
    static function getNextProgram($id,$ss){
        $prev = self::getCurrentProgram($id,$ss);
        $row = DB::table('programs')->where('prev_program_id',$prev->id)->get()->first();
        return $row;
    }


    static function studentInvoice($filter=[],$ss){
        $campus = new Campus();
        $branch_id = $ss->branch_id;
        $academic_year = isset($filter['academic_year']) ? $filter['academic_year']:null;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%')";
        }

        $selectCols = 'p.status_id as pstatus_id,s.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.school_id';
        $query = DB::table('students as st')
                ->join('enrollments as e','e.student_id','=','st.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->join('sessions as s','s.id','=','e.session_id')
                ->selectRaw($selectCols)
                ->where('st.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->where('p.status_id','!=','NULL')
                ->orderBy('id','desc');
                if($academic_year){
                    $query->where('academic_year',$academic_year);
                }
        $count_query = clone $query;
        $count = $count_query->count('st.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $status = rand(0,1)?'New':'Old';
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->parent_info = Student::getChildParent($row->id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = Student::getProgramLevel($row->level_id);
            $row->student_type = $status;
            $row->status = $row->pstatus_id == 1? 'unpaid' : 'paid';
            $row->previous_school = Student::getPrevSchool($row->school_id)->name;
            unset($row->pstatus_id);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function findStudent($filter=[],$ss){
        $campus = new Campus();
        $branch_id = $ss->branch_id;
        $academic_year = isset($filter['academic_year']) ? $filter['academic_year']:null;
        $search_value =isset($filter['search_value'])?$filter['search_value']:null;
        $current_page =isset($filter['current_page'])?$filter['current_page']:1;
        $per_page =isset($filter['per_page'])?$filter['per_page']:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%')";
        }

        $selectCols = 'p.status_id as pstatus_id,s.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.school_id';
        $query = DB::table('students as st')
                ->join('enrollments as e','e.student_id','=','st.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->join('sessions as s','s.id','=','e.session_id')
                ->selectRaw($selectCols)
                ->where('st.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->where('p.status_id','!=','NULL') //* for paid and unpaid
                ->where('e.status_id','!=',1) //* for verified up to paid
                ->orderBy('id','desc');
                if($academic_year){
                    $query->where('academic_year',$academic_year);
                }
        $count_query = clone $query;
        $count = $count_query->count('st.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {
            $status = rand(0,1)?'New':'Old';
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->parent_info = Student::getChildParent($row->id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = Student::getProgramLevel($row->level_id);
            $row->student_type = $status;
            $row->status = $row->pstatus_id == 1? 'unpaid' : 'paid';
            $row->previous_school = Student::getPrevSchool($row->school_id)->name;
            unset($row->pstatus_id);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    static function generateInvoiceDetails($id,$ss){
        $campus = new Campus();
        $row = DB::table('students as s')->where('s.id',$id)
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->selectRaw('p.tuition,s.code as student_code,s.name as student_name,e.campus_id,e.level_id')
                ->get()->first();
        if(!$row) return DV::error('Not Found');
        $row->campus = $campus->details($row->campus_id,$ss)->name;
        $row->level = Student::getProgramLevel($row->level_id);
        $row->amount = $row->tuition;
        return $row;

    }
}
