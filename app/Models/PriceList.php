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

    static function getAcademicYearID($academic_year){
      return DB::table('academic_years as y')->where('y.academic_year',$academic_year)->take(1)->value('id');
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

       $action = 'Updated';
       if ($id) $action = 'Created';
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

       $academic_year = $inputs['academic_year'];
       $inputs['ac_year_id'] = self::getAcademicYearID($academic_year);
       $id = saveData($ss,'price_list',['id'=>$id],$inputs,[],1,false);
       return DV::depends($id,['action'=>$action,'price_list'=>$this->list_price_list()],'Failed to save price list');
    }

    function delete($id=null){
        $id = $id?$id:$this->id;
        DB::table('price_list_items')->where('id',$id)->delete();
        $x = DB::table('price_list')->where('id',$id)->delete();
        return Dv::depends($x,null,'Failed to delete price list');
    }

    static function details($id = null){
       $row = DB::table('price_list as l')->where('id',$id)
       ->selectRaw('l.id,l.name,l.description,l.start_date,l.end_date,l.academic_year,l.ac_year_id,l.update_user AS create_user,formatTime(l.updated_at) As created_at')
       ->get()->first();
       if(!$row) return null;
       $row->items = self::items($id);
       return $row;
    }

    function list_price_list(){
        return DB::table('price_list')->selectRaw('start_date,end_date,description,academic_year')->get();
    }

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
     * $arr = ['program_id','session_id','price','currency_code']
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
                ->join('price_list as l','l.id','=','i.list_id')
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

        $cols = 'l.id, l.name,l.academic_year, formatDate(l.start_date) as start_date,formatDate(l.end_date) as end_date,l.description,l.update_user AS create_user,formatTime(l.updated_at) as created_at, l.auth_user, formatTime(l.auth_date) AS auth_date';
        $query = DB::table('price_list as l')->where('l.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw($cols);

        $count_query = clone $query;
        $count = $count_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    /**
     * $arr ['start_date','acadmic_year','level_id','session_id','semester_number'] // pmt_option_id (optional)
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
        if(!$level_info)   return (object)['error_message'=>'Level ID does not exist','dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];

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

        if(!$row) return (object)['error_message'=>'There is no matched Price List','dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];

        $nl_price = 0;
        if($pmt_option_id>0){
            if($pmt_option_id == 3 && $semester_number == 2){
                if($prev_level_id != $level_id && $prev_level_id > 0){
                    $next_pmt_info = $this->getTuitionDue(['level_id' => $prev_level_id,'pmt_option_id' => 2,'start_date'=>$start_date,'academic_year'=>$academic_year,'semester_number'=>1]);
                    if($next_pmt_info->error_message){
                        return (object)['error_message'=>'There is no matched Price list for Next Level','dicount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0,'tuition'=>0,'tuition_due'=>0];
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

    function getPolicyDiscount($pmt_option_id,$price_list_id=null) {
        $id = $price_list_id;
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

        return (object)['error_message'=>null,'status'=>'OK','end_date'=>$end_date,'price_list_id' => $monthly_fee_info->price_list_id,'tuition' => $total,'tuition_due' => $total,'per_day' => $per_day,'days'=>$x];
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
        // if($pmt_option == 1){
        //     $d->months = $d->months ? $d->months:3;
        // }else if($pmt_option == 2){
        //     $d->months = $d->months ? $d->months:6;
        // }else if($pmt_option == 3){
        //     $d->months = $d->months ? $d->months:12;
        // }
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
            $endingInfo = findFutureMonths($d->start_date,$d->months-1); //** */
            $end_date =$endingInfo->end_date;
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
                    $monthly_tuition_due = $price * $pay_month;

                    $discount_amt = (($base_amount + $monthly_tuition_due) * $discount_info->discount) / 100;
                    $after_discount = ($base_amount + $monthly_tuition_due) - $discount_amt;
                    $total_tuition_due = $after_discount + $weekly_tuition_due;
                    $endingInfo = findFutureMonths($d->start_date,$d->months-1);//** */
                    $end_date =$endingInfo->end_date;
                    $tuition = $base_amount + $monthly_tuition_due + $weekly_tuition_due;

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

                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$endinfInfo->end_date;
                $pay_month = $pay_month - 1;// ** minus first month
                if($pay_month !=0 ) $pay_month = $pay_month * $price;
                $discount_amt = (($semester_tuition + $pay_month) * $discount_info->discount) / 100;
                $after_discount = ($semester_tuition + $pay_month) - $discount_amt;
                $total_tuition_due = $after_discount + $weekly_tuition_due;
                $tuition = $semester_tuition + $pay_month + $total_weekly_Fee->tuition_due;
            }else {
                $week ="full month no week count";
                $semester_tuition = $d->months * $price;
                $discount_amt = ($semester_tuition  * $discount_info->discount) / 100;
                $after_discount = $semester_tuition - $discount_amt;
                $total_tuition_due = $after_discount;
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$endinfInfo->end_date;
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
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//**  */
                $end_date =$endinfInfo->end_date;
                $discount_amt = $annual_tuition * $discount_info->discount / 100;

                $total_tuition_due = ($annual_tuition - $discount_amt) + $total_weekly_Fee->tuition_due;
                // return $discount_info;
            }else if($current_day != 1 && $d->months >12){
                $annual = 12-1;
                $pay_month = $d->months - $annual;
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//**  */
                $end_date =$endinfInfo->end_date;
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
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$endinfInfo->end_date;
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
        $academic_year = isset($d->academin_year)?$d->academic_year:null;
        $session_id = $d->session_id;
        $level_info = DB::table('program_levels as l')->where('id',$level_id)->selectRaw('program_id,id,prev_level_id')->first();
        $start_date = convertDate($start_date);
        // $prev_level_id = $level_info->prev_level_id;
        $str_date = 'Date(l.start_date)<=\''.$start_date.'\' AND Date(l.end_date)>=\''.$start_date.'\'';
        $query = DB::table('price_list as l')
                ->join('price_list_items as i','i.list_id','=','l.id')
                ->whereRaw($str_date)
                ->where('i.program_id',$level_info->program_id)
                ->where('i.session_id',$session_id);
                if($academic_year){
                    $query->where('l.academic_year',$academic_year);
                }
                $query->selectRaw('l.id as price_list_id,i.price,i.program_id');
                $row = $query->first();
        if(!$row) return DV::error('Could not find price list');
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
        $selectCols = 'e.id as enrollment_id,s.id,e.status_id,st.name as status,s.name,s.name_kh,ep.tuition,ep.tuition_due,ep.tuition_paid';
        $query = DB::table('payments as ep')
                ->join('enrollments as e','e.id','=','ep.enrollment_id')
                ->join('students as s','s.id','=','e.student_id')
                ->join('terms as t','t.id','=','e.term_id')
                ->join('pmt_status as st','st.id','=','e.status_id')
                ->selectRaw($selectCols)
                ->where('ep.branch_id',$branch_id);
                if ($status_id !== null && strtolower($status_id) != '4') {
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
                // ->where('s.id',$id)
                ->where('e.id',$id)
                ->selectRaw('e.id as enrollment_id,e.level_id,e.session_id,e.campus_id,e.start_date,ep.pmt_option_id')
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


    //* for preview like calculator function
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
        $academic_year = isset($d->academic_year)?$d->academic_year:$row->academic_year;
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
            "academic_year" => $academic_year,
            "session_id" => $session,
            "prev_level_id" => "0",
            "start_date" => $start_date,
            "months" => $months,
            "weeks" => $weeks,
            "days" => $days,
            "pmt_option_id"=> $pmt_option_id
        ];

        $row->payment_info = $this->payment_processing($arr);

        unset($row->level_id);
        unset($row->pmt_option_id);
        unset($row->name);
        unset($row->program_id);
        unset($row->session_id);
        return $row;
    }


    static function verifyPendingStudent($arr,$ss){
        $d = (object)$arr;
        $instance = new PriceList(null,$ss);
        $v_rule = [
            'id' => '0|number|exists=enrollments.id',
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
        $academic_year = isset($inputs['academic_year'])? convertDate($inputs['academic_year']):null;
        unset($inputs['pmt_option_id']);
        if($pmt_option_id == 4 && !isset($weeks)) return DV::error('weeks must be input');
        else if($pmt_option_id == 5 && !isset($days)) return DV::error('days must be input');

        $arr = [
            'level_id' => $inputs['level_id'],
            'session_id' => $inputs['session_id'],
            'start_date' => $inputs['start_date'],
            'status_id' => 2,
        ];
        if($academic_year) $arr = ['academic_year' => $academic_year];
        $months=null;
        $paid_student = DB::table('enrollments as e')->where('e.id',$id)->join('payments as p','e.id','=','p.enrollment_id')->where('tuition_paid','!=','null')->get()->first();
        if($paid_student){ return DV::error('Student already paid');}
        $id = saveData($ss,'enrollments',['id' => $id],$arr,[],1);
        $enr = DB::table('enrollments as e')->where('id',$id)->selectRaw('e.student_id,e.id,e.level_id,e.academic_year,e.session_id,e.start_date')->first();
        $student_id = $enr->student_id;
        if($pmt_option_id){

            if($pmt_option_id == 1){
                $months = isset($d->months) ? $d->months:3;
            }else if($pmt_option_id == 2){
                $months = isset($d->months) ? $d->months:6;
            }else if($pmt_option_id == 3){
                $months = isset($d->months) ? $d->months:12;
            }
            $arr = [
                "level_id" => $enr->level_id,
                "academic_year" => $enr->academic_year,
                "session_id" => $enr->session_id,
                // "prev_level_id" => "0",
                "start_date" => $enr->start_date,
                "months" => $months,
                "weeks" => $weeks,
                "days" => $days,
                "pmt_option_id"=> $pmt_option_id
            ];
            $preview = $instance->previewPendingPaymentDetails($arr,$student_id,$ss);
            $payment_info = $preview->payment_info;

            $discount_info = $instance->getPolicyDiscount($pmt_option_id,$payment_info->price_list_id);
            $pmt_arr = [
                'pmt_option_id'=>$pmt_option_id,
                'tuition' => $payment_info->tuition,
                'tuition_due' => $payment_info->tuition_due,
                'status_id' => 1,
                'program_id' => $program->program_id,
                'level_id' => $inputs['level_id'],
                'session_id' =>  $inputs['session_id'],
                'price_list_id' => $payment_info->price_list_id,
                'policy_discount' => $discount_info->discount,
            ];
            $set_pmt_option = saveData($ss,'payments',['enrollment_id' => $enr->id],$pmt_arr,[],1);
            DB::table('enrollments')->where('student_id',$id)->where('branch_id',$ss->branch_id)->update([
                "tuition_end_date" => $payment_info->end_date,
            ]);
        }

        return DV::depends($id,$payment_info->end_date);
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
        $row = DB::table('programs')->where('prev_program_id',$prev->id)->selectRaw('id as program_id,id,name as prgram_name,name')->get()->first();
        return $row;
    }
    static function getCurrentLevel($id,$ss){
        $row = DB::table('program_levels as pl')->where('pl.branch_id',$ss->branch_id)
                ->where('pl.id',$id)
                ->join('programs as p','p.id','=','pl.program_id')
                ->selectRaw('pl.name as level,pl.id,p.id as program_id,p.name as program_name')
                ->first();
        return $row;
    }

    static function getNextLevel($id,$ss){
        $prev = self::getCurrentLevel($id,$ss);
        $row = DB::table('program_levels')->where('prev_level_id',$prev->id)->selectRaw('name,name as level,id')->get()->first();
        return $row;
    }


    static function studentInvoice($filter=[],$ss){
        // $campus = new Campus();
        $program = new Program();
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
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%')";
        }

        $selectCols = 'e.id as enrollment_id,s.id as student_id,inv.due_amount,inv.paid_amount,inv.is_paid,inv.id,inv.updated_at as paid,e.session_id,s.code as student_code,inv.invoice_date,inv.due_date,e.program_id,e.level_id,s.name as student_name,p.status_id as pstatus_id,e.academic_year,e.start_date,e.tuition_end_date,inv.due_date,inv.invoice_number,inv.amount';
        $query = DB::table('invoices as inv')
                ->join('students as s','s.id','=','inv.student_id')
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('terms as t','e.term_id','=','t.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->selectRaw($selectCols)
                ->where('inv.branch_id',$branch_id)
                ->where('e.status_id',2)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->orderBy('inv.id','desc');
                if($academic_year){
                    $query->where('e.academic_year',$academic_year);
                }
        $count_query = clone $query;
        $count = $count_query->count('inv.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach($rows as $row) {
            $row->level = Student::getProgramLevel($row->level_id);
            $row->status = $row->is_paid == 1? 'paid' : 'unpaid';
            $row->program = $program->details($row->program_id,$ss)->name;
            $row->session = DB::table('sessions')->where('id',$row->session_id)->selectRaw('name')->first()->name;
            $row->paid_date = date('Y-m-d',strtotime($row->paid));
            unset($row->session_id);
            unset($row->paid);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    static function studentDeposite($id){
        $matchedStudents =DB::table('students as s')
            ->join('deposite as d', 's.name', '=', 'd.student_name')
            ->where('s.date_of_birth', '=', DB::raw('d.date_of_birth'))
            ->where('s.id',$id)
            ->selectRaw('s.name,d.deposite_amount') // Select columns from the students table
            ->get()->first();
        if(!$matchedStudents) return 0;
        return $matchedStudents->deposite_amount;
    }

    static function getTuitionEndDate($student_id){
        $row = DB::table('enrollments')->where('student_id',$student_id)->selectRaw('tuition_end_date')->first();
        if(!$row)return (object)['tuition_end_date' => null];
        return $row->tuition_end_date;
    }

    static function findStudent($filter=[],$ss){
        $campus = new Campus();
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        $academic_year = isset($d->academic_year) ? $d->academic_year:null;
        $search_value =isset($d->search_value)?$d->search_value:null;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%')";
        }

        $selectCols = 'e.id as enrollment_id,p.tuition_paid,p.tuition_due,e.tuition_end_date,st.id,st.file_name,p.status_id as pstatus_id,s.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.school_id,e.status_id';
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
            $status = 'New';
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->parent_info = Student::getChildParent($row->id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = Student::getProgramLevel($row->level_id);
            $row->student_type = $status;
            // $row->status = $row->pstatus_id == 1? 'unpaid' : 'paid';
            $row->previous_school = Student::getPrevSchool($row->school_id)->name;
            $tuition_end_date = convertDate($row->tuition_end_date);
            $row->pmt_status = 'unpaid';
            if($tuition_end_date){
                if($tuition_end_date > date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'paid';
                }
                else if($tuition_end_date < date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'expired';
                }
                else $row->pmt_status = 'unpaid';
            }
            // unset($row->pstatus_id);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    static function generateInvoiceDetails($arr,$ss){
        $d = (object)$arr;
        $id = $d->id;
        $campus = new Campus();
        $row = DB::table('students as s')
                // ->where('s.id',$id)
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->where('e.id',$id)
                ->selectRaw('s.id as student_id,p.second_child_discount,p.special_discount,e.academic_year,p.tuition_due,p.policy_discount,e.start_date,e.tuition_end_date,p.tuition,s.code as student_code,s.name as student_name,e.campus_id,e.level_id,e.status_id')
                ->get()->first();
        if(!$row) return DV::error('Not Found');
        $tuition_end_date = convertDate($row->tuition_end_date);
        $row->pmt_status = 'Unpaid';
        if($tuition_end_date){
            if($tuition_end_date > date('Y-m-d') && $row->status_id == 3){
                $row->pmt_status = 'paid';
            }
            else if($tuition_end_date < date('Y-m-d') && $row->status_id == 3){
                $row->pmt_status = 'expired';
            }
            else $row->pmt_status = 'unpaid';
        }
        $student_id = $row->student_id;

        $invoice_number =isset( $d->invoice_number)?$d->invoice_number:null;
        $row->campus = $campus->details($row->campus_id,$ss)->name;
        $row->date_range = $row->start_date.' to '.$row->tuition_end_date;
        $row->discount = $row->policy_discount;
        $row->level = Student::getProgramLevel($row->level_id);
        $row->amount = $row->tuition;
        $row->total = $row->tuition_due;
        $row->fee_type = 'tuition_fee';
        $row->due_date = self::getInvoiceInfo($student_id)->due_date;
        $row->invoice_number = self::getInvoiceInfo($student_id)->invoice_number;
        $row->other_fees = self::getOtherFeeTypes($student_id,$invoice_number);
        unset($row->tuition);
        unset($row->tuition_due);
        unset($row->policy_discount);
        $row->deposite_amount = self::studentDeposite($student_id);

        return $row;
    }

    static function getInvoiceInfo($student_id){
        $row = DB::table('invoices as i')->where('i.student_id',$student_id)
                ->join('invoice_item as it','it.invoice_id','=','i.id')
                ->selectRaw('i.due_date,i.invoice_number')
                ->first();

        if(!$row) return (object)['due_date'=>null, 'invoice_number'=>null];

        return $row;
    }

    static function updateInvoice($arr,$ss){
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        if(!isset($d->id)) return DV::error('ID is required');
        $id = $d->id;
        if(!is_numeric($id)) return DV::error('ID must be a number');
        $exists_invoice = DB::table('invoices')->where('id',$id)->where('branch_id',$branch_id)->selectRaw('student_id')->first();
        if(!$exists_invoice) return DV::error('ID does not exist');
        $due_date = isset($d->due_date)?$d->due_date:null;
        $insert_info = isset($d->insert_info)?$d->insert_info:null;
        // for
        // $delete_info = isset($d->delete_info)?$d->delete_info:null;
        // $insert_info = isset($d->insert_info)?$d->insert_info:null;

        // $insert_amt = [];


        // $delete_amt = [];
        // $deduct_amt = 0;
        // $new_amt = 0;
        // $total_due_amt = 0;
        // $total_amt = 0;
        // $exist_tuitionFee = DB::table('invoice_item')->where('invoice_id',$id)->where('fee_type','tuition_fee')->exists();
        // $enr_info = DB::table('enrollments as e')->where('student_id',$exists_invoice->student_id)
        //             ->join('payments as p','p.enrollment_id','=','e.id')
        //             ->selectRaw('p.tuition_due,e.id as enr_id,p.tuition,e.start_date,e.tuition_end_date,e.academic_year,p.policy_discount')
        //             ->first();
        //     $total_amt = $enr_info->tuition_due;
        // if($exist_tuitionFee) {
        //     $invoice =  DB::table('invoices')->where('id',$id)->selectRaw('student_id,due_amount,amount')->first();

        //     $total_due_amt = $invoice->due_amount;
        //     $total_amt = $invoice->amount;

        // }else{
        //     $invoice =  DB::table('invoices')->where('id',$id)->where('fee_type','!=','tuition_fee')->selectRaw('student_id,due_amount,amount')->first();
        //     $total_due_amt =  DB::table('invoice_item')->where('invoice_id',$id)->where('fee_type','!=','tuition_fee')->sum('price');
        //     $total_amt = $invoice->amount;
        // }

        // if($insert_info){
        //     foreach($insert_info as $fee){
        //         $data_rows = DB::table('other_fees')->where('academic_year',$enr_info->academic_year)->where('name',$fee['fee_type'])->selectRaw('amount,start_date,end_date,description')->get();
        //         foreach($data_rows as $row){
        //             $fee['price'] = $row->amount;
        //             $fee['date_range'] = isset($row->start_date)?$row->start_date . ' to ' . $row->end_date:null;
        //             $fee['description'] = $row->description;
        //             $insert_amt[] = $row->amount;
        //         }
        //         // $invoice_item = saveData($ss,'invoice_item',["id"=>null],$fee,[],1);
        //     }
        // }

        // if($delete_info){
        //     foreach($delete_info as $info){
        //         $delete_amt[] = $info['amount'];
        //         DB::table('invoice_item')->where('id',$info['invoice_item_id'])->where('fee_type','!=','tuition_fee')->where('branch_id',$branch_id)->delete();
        //     }
        //     $deduct_amt = array_sum($delete_amt);
        //     $new_amt = $total_due_amt - $deduct_amt;

        // }
        // $inputs = [
        //     'due_date' => $due_date
        // ];

        // if($new_amt>0){
        //     $inputs['due_amount'] = $new_amt;
        //     $inputs['amount'] =  $total_amt - $deduct_amt;
        // }
        // $id = saveData($ss,'invoices',['id' => $id],$inputs,[],1);
        // return DV::depends($id,['action'=>'Updated']);

    }

    static function getOtherFeeTypes($id,$inv_number){
        $rows = DB::table('invoices as i')->where('student_id',$id)
                ->join('invoice_item as it','i.id','=','it.invoice_id')
                ->where('it.fee_type','!=','tuition_fee')
                ->where('i.invoice_number',$inv_number)
                ->selectRaw('it.id as invoice_item_id,it.fee_type,it.price as amount,it.description,price as total')->get();
        return $rows;
    }


      /**
       * $doc_class is invlice line. It is invoice line based on which to issue invoice for different Tax processing or tax treatment
      */
        static function setInvoiceNumber($branch_id, $invoice_id = 0, $doc_class = null, $issue_date = null, $len = 5, $onSuccess = null)
        {
            if (!$len) $len = 5;
            $def_prefix = "V";
            $table_name = "invoice_code_control";
            $target_table = "invoices";
            $target_column = "invoice_number";
             $com_branch_id = null;
             $str_company_branch='1=1';
             if($com_branch_id > 0) $str_company_branch ='com_branch_id ='.$com_branch_id;
            if (!$invoice_id) return null;

            //if ($def_prefix) $where_branch .=" AND prefix ='$def_prefix'";
            $year = date('Y', strtotime($issue_date));
            $row = DB::table($table_name . " as c")->where('branch_id', $branch_id)->where('c.issue_year', $year)->where('c.doc_class', $doc_class)->whereRaw($str_company_branch)->selectRaw("last_id,prefix")->take(1)->get()->first();

            $next_num = 0;
            $prefix = null;
                if ($row){
                    $next_num = $row->last_id;
                    $prefix = $row->prefix;
                }
                if (!$prefix) $prefix = $def_prefix;
                if (!$prefix) $prefix = "I";
                $next_num++;
                //example invoice number => I12023-00003
                $new_code = $prefix . $branch_id . $year . "-" . formatNumber($next_num, $len);

                $x = DB::table($target_table)->where('id', $invoice_id)->update([$target_column => $new_code]);
                if ($x || $x === 1) {
                $updated = DB::table($table_name)->where('branch_id', $branch_id)->where('issue_year', $year)->where('doc_class', $doc_class)->whereRaw($str_company_branch)->update(['last_id' => $next_num]);
                if (!$updated) DB::table($table_name)->insert(['branch_id' => $branch_id, 'com_branch_id' => $com_branch_id, 'doc_class' => $doc_class, 'issue_year' => $year, 'prefix' => $prefix, 'last_id' => $next_num]);
                if ($onSuccess) $onSuccess();
                return (object)['status_code' => 200, 'status' => 'OK', 'code' => $new_code];
            }
            return null;
        }

    // static function
    static function generateInvoice($arr=[],$ss){
        $v_rule = [
            'due_date' => '1|string',
            // 'student_id' => '0|number|exists=students.id',
            'enrollment_id' => '1|number|exists=enrollments.id',
            'qty' => '0|number',
            'fee_types' => '0|array',
            'note' => '0|string|1,300',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        // $student_id = $inputs['student_id'];
        $enrollment_id = $inputs['enrollment_id'];
        unset($inputs['enrollment_id']);
        // $student = DB::table('students')->where('branch_id',$ss->branch_id)->where('id',$student_id)->selectRaw('id')->first();
        $enr_info = DB::table('enrollments as e')->where('e.id',$enrollment_id)
                    ->join('payments as p','p.enrollment_id','=','e.id')
                    ->selectRaw('e.id as enr_id,p.tuition,e.start_date,e.tuition_end_date,e.academic_year,p.policy_discount,e.status_id,e.student_id')
                    ->first();
        $tuition_end_date = convertDate($enr_info->tuition_end_date);
        $enr_info->pmt_status = 'Unpaid';
        $inputs['student_id'] = $enr_info->student_id;
        $inputs['due_date'] = convertDate($inputs['due_date']);
        $qty = $inputs['qty'];
        unset($inputs['qty']);
        $fee_types = $inputs['fee_types'];
        $issue_date = date('Y-m-d');

        unset($inputs['fee_types']);
        $inputs['invoice_date'] = date('Y-m-d');
        $keep_amount = [];
        $amount = 0;
        //$last_id = DB::table('invoices')->selectRaw('id')->orderBy('id','desc')->first();
        $is_tuition_fee = 0;
        $getTuitionFeeType = null;
        $invoice_type = 'non_tuition_fee';
        $save_inv = saveData($ss,'invoices',["id" => null],$inputs,[],1);
        if($save_inv){
            self::setInvoiceNumber($ss->branch_id,$save_inv,'no-tax',$issue_date,5);
            foreach($fee_types as $fee){
                // $not_nontutition = DB::table('other_fees')->where('academic_year',$enr_info->academic_year)->where('name',$fee['fee_type'])->exists();
                $fee['invoice_id'] = $save_inv;
                $fee['qty'] = $qty || 1;

                if(strtolower($fee['fee_type']) == 'tuition_fee'){
                    if($tuition_end_date){
                        if($tuition_end_date > date('Y-m-d') && $enr_info->status_id == 3){
                            $row->pmt_status = 'paid';
                            return DV::error('Tuition Fee is paid');
                        }
                        else if($tuition_end_date < date('Y-m-d') && $enr_info->status_id == 3){
                            $row->pmt_status = 'expired';
                            return DV::error('Tuition Fee is expired');
                        }
                        // else $row->pmt_status = 'unpaid';
                    }
                    // if($tuition_end_date){
                    //     if($tuition_end_date > date('Y-m-d')){
                    //         $enr_info->pmt_status = 'paid';
                    //         return DV::error('Tuition Fee is paid');
                    //     }else $enr_info->pmt_status = 'expired';
                    // }
                    $fee['price'] = $enr_info->tuition;
                    $fee['date_range'] = $enr_info->start_date . ' to ' . $enr_info->tuition_end_date;
                    $fee['fee_type'] = 'tuition_fee';
                    $fee['discount'] = $enr_info->policy_discount;
                    $fee['start_date'] = $enr_info->start_date;
                    $fee['end_date'] = $enr_info->tuition_end_date;
                    $is_tuition_fee = self::getTuitionDueByStudent($enr_info->student_id);
                    $getTuitionFeeType = 'tuition_type';
                    $invoice_type = 'tuition_fee';
                }

                $data_rows = DB::table('other_fees')->where('academic_year',$enr_info->academic_year)->where('name',$fee['fee_type'])->selectRaw('amount,start_date,end_date,description')->get();
                foreach($data_rows as $row){
                    $fee['price'] = $row->amount;
                    $fee['date_range'] = isset($row->start_date)?$row->start_date . ' to ' . $row->end_date:null;
                    $fee['description'] = $row->description;
                    $keep_amount[] = $row->amount;
                }
                $invoice_item = saveData($ss,'invoice_item',["id"=>null],$fee,[],1);
            }
            if($getTuitionFeeType){
                $amount = array_sum($keep_amount) + $enr_info->tuition;
            }else{
                $amount = array_sum($keep_amount);
            }


            $matchedStudents = DB::table('students as s')
                    ->join('deposite as d', 's.name', '=', 'd.student_name')
                    ->where('s.date_of_birth', '=', DB::raw('d.date_of_birth'))
                    ->selectRaw('s.name,d.deposite_amount') // Select columns from the students table
                    ->get()->first();
            $doposite_amt = 0;
            if($matchedStudents && $getTuitionFeeType){
                $doposite_amt = $matchedStudents->deposite_amount;
            }

            $due_amount = $is_tuition_fee + array_sum($keep_amount);

            DB::table('invoices')->where('id',$save_inv)->update([
                'due_amount'=>$due_amount - $doposite_amt,
                'amount'=>$amount,
                'invoice_type' => $invoice_type
            ]);
            // saveData($ss,'payments',['enrollment_id' => $enr_info->enr_id],['tuition_due' => $due_amount]);
        }
        return DV::depends($save_inv,['action'=>'Generated','match'=>$enr_info->student_id]);
    }

    static function setInvoiceCode($ss,$newID){
        $branch_id = $ss->branch_id;
        $prefix = 'INV';
        $year = date('Y');
        $new_code = $prefix.$branch_id.$year.'-'.formatNumber($newID,5);
        return $new_code;
        // DB::table('students')->where('id',$newID)->update(['code' => $new_code]);
    }

    static function getTuitionDueByStudent($student_id){
        $row = DB::table('enrollments as e')->where('e.student_id',$student_id)
        ->join('payments as p','p.enrollment_id','=','e.id')
        ->selectRaw('p.tuition_due')
        ->get()->first();
        return $row->tuition_due;
    }

    static function getRelatedInvoice($student_id,$inv_num){
        $row = DB::table('invoices as i')->where('student_id',$student_id)
                ->where('i.invoice_number',$inv_num)
                ->join('invoice_item as it','i.id','=','it.invoice_id')
                ->selectRaw('i.invoice_number,i.invoice_type,i.due_amount')
                ->get()->first();
        if(!$row) return $row=null;
        return $row;
    }


    /**
     *Given an existing invoice => pay by student and invoice number
     **/
    static function schoolFeePay($arr,$ss){
        $instance = new PriceList(null,$ss);
        $d = (object)$arr;
        $student_id = isset($d->student_id) ? $d->student_id : $d->id;
        $invoice_number = $d->invoice_number;
        $getInvoiceInfo = self::getRelatedInvoice($student_id,$invoice_number);
        $row = DB::table('students as s')
                ->where('s.id',$student_id)
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->selectRaw('p.tuition_due,e.id as enr_id,e.start_date,e.term_id,e.program_id,e.level_id,e.session_id,e.campus_id,p.pmt_option_id,e.academic_year')
                ->get()->first();
        $current_level = self::getCurrentLevel($row->level_id,$ss);
        $last_level = DB::table('program_levels')->where('program_id',$current_level->program_id)->selectRaw('id,name')->orderBy('id','desc')->first();
        $current_program = self::getProgramByLevel($row->level_id,$ss);
        $next_program = self::getNextProgram($current_program->program_id,$ss);
        $next_level = self::getNextLevel($row->level_id,$ss);
        $pmt_option_id = $row->pmt_option_id;
        $next_payment_info = null;
        $current_payment_info=null;
        $pre_enr = null;
        if($current_level->id != $last_level->id){
            $current_payment_info = $instance->getMonthlyFee([
                    'academic_year' => $row->academic_year,
                    'level_id' => $row->level_id,
                    'session_id' => $row->session_id,
                    'start_date' => $row->start_date,
                ]);
            if($current_payment_info){
                $pre_enr = [
                    'term_id' => $row->term_id,
                    'student_id' => $student_id,
                    'level_id' => $row->level_id,
                    'session_id' => $row->session_id,
                    'campus_id' => $row->campus_id,
                    'tuition_due' => $row->tuition_due,
                    'price_list_id' => $current_payment_info->price_list_id
                ];

                saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
                saveData($ss,'enrollments',['id' => $row->enr_id],[
                    'status_id' => 3,//* paid
                ],[],1);

                if($getInvoiceInfo->invoice_type == 'tuition_fee'){
                    saveData($ss,'payments',['enrollment_id' => $row->enr_id],[
                        'pmt_status'=>'paid',
                        'status_id' => 2, //* 'paid'
                        'tuition_paid' => $row->tuition_due,
                    ],[],1);
                    saveData($ss,'invoices',['student_id' => $student_id,'invoice_number'=>$invoice_number],[
                        'is_paid' => 1,//* paid
                        'paid_amount' => $getInvoiceInfo->due_amount
                    ],[],1);
                }else{
                    saveData($ss,'invoices',['student_id' => $student_id,'invoice_number'=>$invoice_number],[
                        'is_paid' => 1,//* paid
                        'paid_amount' => $getInvoiceInfo->due_amount
                    ],[],1);
                }

            }
            if(isset($current_payment_info->status) == 'Error') return DV::error($current_payment_info->error_message);

            $next_payment_info = $instance->getMonthlyFee([
                'academic_year' => $row->academic_year,
                'level_id' => $next_level->id,
                'session_id' => $row->session_id,
                'start_date' => $row->start_date,
            ]);
            if($next_payment_info){
                $pre_enr = [
                    'term_id' => null,
                    'student_id' => $student_id,
                    'level_id' => $next_level->id,
                    'session_id' => $row->session_id,
                    'campus_id' => $row->campus_id,
                    'tuition_due' => $next_payment_info->price,
                    'price_list_id' => $next_payment_info->price_list_id
                ];
                saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
            }

        }
        if($last_level->id == $current_level->id){

            $current_payment_info = $instance->getMonthlyFee([
                'academic_year' => $row->academic_year,
                'level_id' => $row->level_id,
                'session_id' => $row->session_id,
                'start_date' => $row->start_date,

            ]);

            if(isset($current_payment_info->status) == 'Error') return DV::error($current_payment_info->error_message);
            if($current_payment_info){
                $pre_enr = [
                    'term_id' => $row->term_id,
                    'student_id' => $student_id,
                    'level_id' => $row->level_id,
                    'session_id' => $row->session_id,
                    'campus_id' => $row->campus_id,
                    'tuition_due' => $row->tuition_due,
                    'price_list_id' => $current_payment_info->price_list_id
                ];

                saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
                saveData($ss,'enrollments',['id' => $row->enr_id],[
                    'status_id' => 3,//* paid
                ],[],1);
                if($getInvoiceInfo){
                    if($getInvoiceInfo->invoice_type == 'tuition_fee'){
                        saveData($ss,'payments',['enrollment_id' => $row->enr_id],[
                            'pmt_status'=>'paid',
                            'status_id' => 2, //* 'paid'
                            'tuition_paid' => $row->tuition_due,
                        ],[],1);
                        saveData($ss,'invoices',['student_id' => $student_id,'invoice_number'=>$d->invoice_number],[
                            'is_paid' => 1,//* paid
                            'paid_amount' => $getInvoiceInfo->due_amount
                        ],[],1);
                    }else{
                        saveData($ss,'invoices',['student_id' => $student_id,'invoice_number'=>$d->invoice_number],[
                            'is_paid' => 1,//* paid
                            'paid_amount' => $getInvoiceInfo->due_amount
                        ],[],1);
                    }
                }

            }

            if($next_level){
                $next_payment_info = $instance->getMonthlyFee([
                    'academic_year' => $row->academic_year,
                    'level_id' => $next_level->id,
                    'session_id' => $row->session_id,
                    'start_date' => $row->start_date,
                ]);

                if($next_payment_info){
                    $pre_enr = [
                        'term_id' => null,
                        'student_id' => $student_id,
                        'level_id' => $next_level->id,
                        'session_id' => $row->session_id,
                        'campus_id' => $row->campus_id,
                        'tuition_due' => $next_payment_info->price,
                        'price_list_id' => $next_payment_info->price_list_id
                    ];
                    saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
                }

            }
        }

        return [
            'enrollment'=>$pre_enr,
            'current_payment_info' => $current_payment_info,
            'next_payment_info' =>$next_payment_info,
            'last_level_next_level' =>$next_level
        ];

    }


    static function reviveInActiveInvoice($d,$ss){
        $id = $d->id;
        $purpose = $d->purpose;

        $revive = DB::table('invoices')->where('id',$id)
                ->where('branch_id',$ss->branch_id)
                ->where('in_active',1)
                ->update([
                    'in_active' => 0,
                    'purpose' => $purpose,
                ]);
        if(!$revive) return DV::error('Could not find invoice to revive');
        return DV::depends($revive,['action' => 'Invoices is active now']);
    }

    static function deleteInvoice($d,$ss){
        $id = $d->id;
        $purpose = isset($d->purpose)?$d->purpose:$d->remarks;
        $delete = DB::table('invoices')->where('id',$id)->update([
            'in_active' => 1,
            'purpose' => $purpose
        ]);
        $in_active = DB::table('invoices')->where('id',$id)->where('branch_id',$ss->branch_id)->take(1)->value('in_active');
        if($in_active == 1){
            $delete = DB::table('invoices')->where('id',$id)->where('branch_id',$ss->branch_id)->delete();
        }
        return DV::depends($delete,['action'=>'Deleted','status'=>'Status change to in active']);
    }

    static function getPaymentInfo($enr_id,$ss){
        return DB::table('payments')->where('enrollment_id',$enr_id)
                ->where('branch_id',$ss->branch_id)
                ->selectRaw('tuition,tuition_due,tuition_paid')->first();
    }

    static function previewRequestPayment($arr=[],$ss){
        $v_rule = [
            'student_id' => '1|number|exists=students.id',
            'request_type_id' => '1|number|exists=request_types.id',
            'to_level_id' => '0|number|exists=program_levels.id',
            'to_session_id' => '0|number|exists=sessions.id',
            'start_date' => '0|string',
            'academic_year' => '0|string',
        ];
        $res = validateObject($arr,$v_rule,1,['academic_year'=>['-']],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $student_id = $d->student_id;
        $return_fee = 0 ;

        $payment_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->join('payments as p','p.enrollment_id','=','e.id')->join('terms as t','t.id','=','e.term_id')->selectRaw('e.id as enr_id,p.tuition_paid,e.tuition_end_date,e.start_date,e.session_id,e.level_id,e.campus_id,e.academic_year')->get()->first();
        $start_date = isset($d->start_date) ? $d->start_date :$payment_info->start_date;
        $studied_days = date('d') - date('d',strtotime($start_date));
        $academic_year = isset($d->academic_year)?$d->academic_year:$payment_info->academic_year;
        if($d->request_type_id == 1){


            $end_date = $payment_info->tuition_end_date;

            $x = dateDiff_days($start_date,$end_date);
            if(!$x) $x=1;
            $per_day = $payment_info->tuition_paid / $x;
            $deduct_day_fee = number_format($per_day * $studied_days,2);
            $fee_left = $payment_info->tuition_paid - $deduct_day_fee;

            $level_pmt_arr = [
                'student_id' => $d->student_id,
                'start_date' => $start_date,
                'session_id' => $payment_info->session_id,
                'level_id' => $d->to_level_id,
                'academic_year' => $academic_year,
            ];
            $new_level_fee = self::findLevelPayFee($level_pmt_arr,$ss);
            $amount = $new_level_fee - $fee_left;
            if($amount>0){
                $surcharge = $amount;
            }else{
                $return_fee = number_format($amount,2);
            }

            return (object)['old_days_fee' => $deduct_day_fee,'fee_left' => $fee_left,'new_level' => $new_level_fee,'surcharge'=>$surcharge,'return_fee' => $return_fee,'academic_year'=>$academic_year];

        }else if($d->request_type_id == 3){

            $end_date = $payment_info->tuition_end_date;

            $x = dateDiff_days($start_date,$end_date);
            if(!$x) $x=1;
            $per_day = $payment_info->tuition_paid / $x;
            $deduct_day_fee = number_format($per_day * $studied_days,2);
            $fee_left = $payment_info->tuition_paid - $deduct_day_fee;


            $arr_new_fee = [
                'student_id' => $d->student_id,
                'session_id' => $d->to_session_id,
                'start_date' => $start_date,
                'academic_year' => $academic_year,
            ];

            $new_fee = self::findLevelPayFee($arr_new_fee,$ss);
            $amount = $new_fee - $fee_left;
            if($amount>0){
                $surcharge = $amount;

            }else{
                $return_fee = number_format($amount,2);

            }

            return (object)['old_days_fee' => 0,'fee_left' => $fee_left,'new_level' => $new_fee,'surcharge'=>$surcharge,'return_fee' => $return_fee,'academic_year' => $academic_year];
        }
    }

    static function findRequestPayment($arr=[],$ss){
        $d = (object)$arr;
        $student_id = $d->student_id;
        $surcharge = 0;
        $return_fee = 0;

        $payment_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->join('payments as p','p.enrollment_id','=','e.id')->join('terms as t','t.id','=','e.term_id')->selectRaw('e.id as enr_id,p.tuition_paid,e.tuition_end_date,e.start_date,e.session_id,e.level_id,e.campus_id')->get()->first();
        $studied_days = date('d') - date('d',strtotime($payment_info->start_date));
        $parent_info = DB::table('student_guardians as sg')
                    ->where('sg.student_id',$student_id)
                    ->join('students as s','s.id','=','sg.student_id')
                    ->join('guardians as g','g.id','=','sg.guardian_id')
                    ->selectRaw('g.name,g.phone_number')
                    ->get()->first();
        $start_date = isset($d->start_date) ? $d->start_date :$payment_info->start_date;
        $studied_days = date('d') - date('d',strtotime($start_date));
        if($d->request_type_id == 1){

            $end_date = $payment_info->tuition_end_date;

            $x = dateDiff_days($start_date,$end_date);
            if(!$x) $x=1;
            $per_day = $payment_info->tuition_paid / $x;
            $deduct_day_fee = number_format($per_day * $studied_days,2);
            $fee_left = $payment_info->tuition_paid - $deduct_day_fee;

            $level_pmt_arr = [
                'student_id' => $d->student_id,
                'start_date' => $start_date,
                'session_id' => $d->session_id,
                'level_id' => $d->to_level_id
            ];
            $new_level_fee = self::findLevelPayFee($level_pmt_arr,$ss);
            $amount = $new_level_fee - $fee_left;
            if($amount>0){
                $surcharge = $amount;
                DB::table('request_changes')->where('request_id',$d->request_id)->update([
                    'calculated_fee' => $surcharge
                ]);
                DB::table('enrollments')->where('student_id',$student_id)->update([
                    'level_id' => $d->to_level_id,
                    'status_id' => 4, // status_id 4 additional fee
                ]);
                DB::table('payments')->where('enrollment_id',$payment_info->enr_id)->update([
                    'tuition_due' => $fee_left + $surcharge,
                    'pmt_status' => 'unpaid',
                    'status_id' => '1',
                    'level_id' => $d->to_level_id,
                ]);
            }else{
                $return_fee = number_format($amount,2);
                saveData($ss,'deposite',['id' => null],[
                    'level_id' => $payment_info->level_id,
                    'student_id' => $student_id,
                    'campus_id' => $payment_info->campus_id,
                    'deposite_amount' => abs($return_fee),
                    'session_id' => $payment_info->session_id,
                    'parent_phone' => $parent_info->phone_number,
                    'note' => 'Ramaining money will be set into deposite'
                ]
                ,[],1);
                DB::table('request_changes')->where('request_id',$d->request_id)->update([
                    'calculated_fee' => $return_fee
                ]);
            }

            return (object)['old_days_fee' => $deduct_day_fee,'fee_left' => $fee_left,'new_level' => $new_level_fee,'surcharge'=>$surcharge,'return_fee' => $return_fee];

        }else if($d->request_type_id == 3){

            $end_date = $payment_info->tuition_end_date;

            $x = dateDiff_days($start_date,$end_date);
            if(!$x) $x=1;
            $per_day = $payment_info->tuition_paid / $x;
            $deduct_day_fee = number_format($per_day * $studied_days,2);
            $fee_left = $payment_info->tuition_paid - $deduct_day_fee;

            $arr_new_fee = [
                'student_id' => $d->student_id,
                'session_id' => $d->to_session_id,
                'start_date' => $start_date,
            ];

            $new_fee = self::findLevelPayFee($arr_new_fee,$ss);
            $amount = $new_fee - $fee_left;
            if($amount>0){
                $surcharge = $amount;
                DB::table('request_changes')->where('request_id',$d->request_id)->update([
                    'calculated_fee' => $surcharge
                ]);
                DB::table('enrollments')->where('student_id',$student_id)->update([
                    'session_id' => $d->to_session_id,
                    'status_id' => 4, // status_id 4 additional fee
                ]);
                DB::table('payments')->where('enrollment_id',$payment_info->enr_id)->update([
                    'tuition_due' => $fee_left + $surcharge,
                    'pmt_status' => 'unpaid',
                    'status_id' => '1',
                    'session_id' => $d->to_session_id,
                    // 'tuition_paid' => 0,
                ]);
            }else{
                $return_fee = number_format($amount,2);
                saveData($ss,'deposite',['id' => null],[
                    'level_id' => $payment_info->level_id,
                    'student_id' => $student_id,
                    'campus_id' => $payment_info->campus_id,
                    'deposite_amount' => abs($return_fee),
                    'session_id' => $payment_info->session_id,
                    'parent_phone' => $parent_info->phone_number,
                    'note' => 'Ramaining money will be set into deposite'
                ]
                ,[],1);
                DB::table('request_changes')->where('request_id',$d->request_id)->update([
                    'calculated_fee' => $return_fee
                ]);
            }

            return (object)['old_days_fee' => 0,'fee_left' => $fee_left,'new_level' => $new_fee,'surcharge'=>$surcharge,'return_fee' => $return_fee];
        }
    }

    static function findStudiedDaysFee($arr,$ss){
        $instance = new PriceList(null,$ss);
        $d = (object)$arr;
        $days = $d->days;
        $student_id = $d->student_id;
        $payment_info = DB::table('enrollments as e')->where('e.student_id',$student_id)->join('payments as p','p.enrollment_id','=','e.id')->selectRaw('p.tuition_paid,e.tuition_end_date,e.start_date')->get()->first();
        $start_date = $payment_info->start_date;

        $end_date = $payment_info->tuition_end_date;

        $x = dateDiff_days($start_date,$end_date);
        if(!$x) $x=1;
        $per_day = $payment_info->tuition_paid / $x;
        $deduct_day_fee = number_format($per_day * $days,2);
        $fee_left = $payment_info->tuition_paid - $deduct_day_fee;

        return (object)['old_days_fee' => $deduct_day_fee,'remain_fee' => $fee_left];
    }


    // session_id , level_id, pmt_option_id, start_date
    static function findLevelPayFee($arr,$ss){
        $d = (object)$arr;
        $instance = new PriceList(null,$ss);
        $row = $instance->previewPendingPaymentDetails($arr,$d->student_id,$ss);

        return $row->payment_info->tuition_due;
    }

}
