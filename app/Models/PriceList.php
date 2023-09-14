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
    function __construct($id=null,$user_info=null){
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

    static function priceListExits($name,$id=null){
        $str_id ='1=1';
        if($id>0) $str_id ='id <> '.$id;
        $test_id = DB::table('price_list')->where('name',$name)->whereRaw($str_id)->take(1)->value('id');
        return $test_id > 0? true:false;
    }

    /** Create or Update Price List */
    function save($arr=[],$id=null,$ss=null){
       $id = $id? $id : $this->id;
       $ss =$ss? $ss: $this->user_info;

       $v_rule = [
         'name'=>'1|string|1-200|text=Price list name cannot be empty',
         'start_date'=>'1|date',
         'end_date'=>'1|date',
         'academic_year'=>'1|string|1-35',
         'description'=>'0|string|0-250'
       ];

       $action = $id> 0? 'Updated':'Created';
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
        $pl_exists = self::priceListExits($inputs['name'],$id);

        if($pl_exists)  return DV::error('Name is already used');


       $academic_year = $inputs['academic_year'];
       $inputs['ac_year_id'] = self::getAcademicYearID($academic_year);
       $created = $id>0? false:true;
       $id = saveData($ss,'price_list',['id'=>$id],$inputs,[],1,false);
       if($id > 0 &&   $created ){
         self::authorize($id,$ss);
       }
       return DV::depends($id,['action'=>$action,'price_list'=>$this->list_price_list()],'Failed to save price list');
    }

    /** authorize price list authorizePriceList() */
    static function authorize($id,$ss){
       DB::table('price_list')->where('id',$id)->update([
        'authorized'=>1,
        'auth_user'=>$ss->full_name,
        'auth_date'=>getNowTime(),
        'auth_uid'=>$ss->user_id
       ]);
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
        $d = (object)$arr;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;
        $str_moreWhere ="1=1";
        $str_search="1=1";

        $academic_year = isset($d->academic_year)?$d->academic_year:null;
        $search_value = isset($d->search_value)?$d->search_value:null;
        if($academic_year && $academic_year !==0) $str_search ='l.academic_year =\''.$academic_year.'\'';
        if($search_value){
            $search_value = escape_like_str($search_value);
            $str_search .=" AND (l.academic_year LIKE '%$search_value%' OR l.name LIKE '%$search_value%')";
        }
        $cols = 'l.id, l.name,l.academic_year, formatDate(l.start_date) as start_date,formatDate(l.end_date) as end_date,l.description,l.update_user AS update_user,formatTime(l.updated_at) as updated_at, l.auth_user, l.authorized, formatTime(l.auth_date) AS auth_date';
        $query = DB::table('price_list as l')->where('l.branch_id',$branch_id)->whereRaw($str_moreWhere)->whereRaw($str_search)->selectRaw($cols);

        $count_query = clone $query;
        $count = $count_query->count('l.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) $row->use_case_count = self::useCaseCount($row->id);
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    /** count that this price_list is being used or assigned to how many students currently */
    static function useCaseCount($id){
       return DB::table('student_pricelist as l')->where('l.price_list_id',$id)->whereRaw('IFNULL(l.inactive,0) =0')->count('id');
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
        if(!$row)  return (object)['discount_percent' => 0,'discount_amount' => 0,'discount_type'=>0,'discount'=>0];
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

        return (object)['status_code' => 200,'error_message'=>null,'status'=>'OK','end_date'=>$end_date,'price_list_id' => $monthly_fee_info->price_list_id,'tuition' => $total,'tuition_due' => $total,'per_day' => $per_day,'days'=>$x];
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
        $price_list_id = $monthly_fee_info->price_list_id;
        $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);


        $note =null;
        if(isset($d->discount)){
            $discount_info = $d->discount;
        }

        //** weekly payment processing */
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

            $note = 'Weekly fee';

            return (object)['note'=>$note,'price_list_id' => $monthly_fee_info->price_list_id,'first_month_end_date'=>$last_day_in_month,'tuition' => $total_tuition_due,'tuition_due'=>$total_tuition_due,'status_code' => 200,'error_message' =>null];
        }
        //** Term payment processing */
        else if($d->months < 6){
            $endingInfo = findFutureMonths($d->start_date,$d->months-1); //** */
            $end_date =$endingInfo->end_date;
            $weekly_tuition_due = 0;
            $base_amount = 0;//** base amount equal to term (3months) */
            $price_list_id = $monthly_fee_info->price_list_id;
            $monthly_tuition_due = 0;
            if($current_day != 1 && $d->months == 3){
                $terms = 3;
                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);
                $weekly_tuition_due = $total_weekly_Fee->tuition_due;
                $base_amount = $price * ($d->months-1); //** minus 1 = first is not a full */
                $original_price = $price * $terms;

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
                }else{
                    $base_amount = $price * $term;
                    $monthly_tuition_due = $price * $pay_month;
                }
            }

            // $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);

            $discount_amt = $base_amount * $discount_info->discount_percent / 100;
            $term_tuition_due = $base_amount - $discount_amt;
            $total_tuition_due = $term_tuition_due + $weekly_tuition_due + $monthly_tuition_due;
            $tuition = $monthly_tuition_due + $base_amount + $weekly_tuition_due;

           if(isset($original_price) && !isset($d->is_pricelist)){
                $minus_weekly_fee = $original_price - $total_tuition_due;
                $note = 'Tuition('.$original_price.') - '.$minus_weekly_fee.' because Start Date is not the first day of the month.';
           }
            return (object)['note'=>$note,'price_list_id' => $monthly_fee_info->price_list_id,'end_date' => $end_date,'tuition'=>$tuition,'tuition_due'=>$total_tuition_due,'term_tuition_due' => $base_amount,'discount'=>$discount_info,'weekly_tuition_due'=>$weekly_tuition_due,'monthly_tuition'=>$monthly_tuition_due,'status_code' => 200,'error_message' =>null];
        }
        //** Semester Payment Processing */
        else if($d->months <12){
            $weekly_tuition_due = 0;
            $months = isset($d->months) ? $d->months :6;
            $base_amount = 0;//** base amount equal to term (3months) */
            // $price_list_id = $monthly_fee_info->price_list_id;
            // $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);
            $monthly_tuition_due = 0;
            $tuition = 0;

            //** not the first day of months as semester payment  and months equal 6 */
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
                    // $minus_weekly_fee = $total_weekly_Fee->weekly_fee;
                    // $note = 'Tuition due('.$tuition.') - '.$minus_weekly_fee.' because Start Date is not the first day of the month.';
                    $original_price = $price * $months;
                    $minus_weekly_fee = $original_price - $total_tuition_due;
                    if(!isset($d->is_pricelist)){
                        $note = 'Tuition('.$original_price.') - '.$minus_weekly_fee.' because Start Date is not the first day of the month.';
                    }

            }
            //** if not the first day of months as semester payment  and months greater than 6 */
            else if($current_day != 1 && $d->months > 6){
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
                $monthly_tuition_due = 0;//**************** */

                $original_price = $price * $months;
                $minus_weekly_fee = $original_price - $total_tuition_due;
                if(!isset($d->is_pricelist)){
                    $note = 'Tuition('.$original_price.') - '.$minus_weekly_fee.' because Start Date is not the first day of the month.';
                }

            }else {
                $week ="full month no week count";
                $semester_tuition = $d->months * $price;
                $discount_amt = ($semester_tuition  * $discount_info->discount) / 100;
                $after_discount = $semester_tuition - $discount_amt;
                $total_tuition_due = $after_discount;
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$endinfInfo->end_date;
                $tuition = $semester_tuition;
                $monthly_tuition_due = 0;//**************** */
            }

            return (object)['note'=>$note,'price_list_id' => $monthly_fee_info->price_list_id,'end_date'=> $end_date,'tuition'=>$tuition,'tuition_due'=>$total_tuition_due,'term_tuition_due' => $base_amount,'weekly_tuition_due' => $weekly_tuition_due,'weeks' => $week,'monthly_tuition_due' => $monthly_tuition_due,'discount'=>$discount_info,'after_discount' => $after_discount,'discount_amount' => $discount_amt,'status_code' => 200,'error_message' =>null];
        }else{
            // $price_list_id = $monthly_fee_info->price_list_id;
            // $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);
            $total_tuition_due = 0;
            $discount_amt = 0;
            if($current_day != 1 && $d->months == 12){
                $annual = 12; //* because the first month is not a full month
                $pay_month = 12-1;

                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);
                // $annual_tuition = $price * $annual;
                $pay_month = $price * $pay_month;
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//**  */
                $end_date =$endinfInfo->end_date;
                $discount_amt = $pay_month * $discount_info->discount / 100;
                $weekly_tuition_due = $total_weekly_Fee->tuition_due;
                $total_tuition_due = ($pay_month - $discount_amt) + $total_weekly_Fee->tuition_due;
                // return $discount_info;
                $monthly_tuition_due = 0;//**************** */

                //** note */
                $after_discount = $pay_month - $discount_amt;
                $original_price = $price * $annual;
                $tuition = $original_price;
                $minus_weekly_fee = $original_price - $total_tuition_due;
                if(!isset($d->is_pricelist)){
                    $note = 'Tuition('.$original_price.') - '.$minus_weekly_fee.' because Start Date is not the first day of the month.';
                }
                //     $note = 'Tuition('.$original_price.') because Start Date is not the first day of the month.';
                // }

            }else if($current_day != 1 && $d->months >12){
                $annual = 12-1;
                $pay_month = 12 - $annual;
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//**  */
                $end_date =$endinfInfo->end_date;
                // $price_list_id = $monthly_fee_info->price_list_id;
                // $discount_info = $this->getPolicyDiscount($pmt_option,$price_list_id);

                $total_weekly_Fee = self::getWeeklyTuitionDue([
                    'start_date' => $d->start_date,
                    'level_id' => $d->level_id,
                    'session_id' => $d->session_id,
                    'weeks' => $week,
                    'academic_year' => $d->academic_year,
                ]);
                $pay_month = $pay_month - 1; // ** minus first month
                // $annual_tuition = $annual * $price;
                $tuition = $d->months * $price;
                $monthly_fee_tuition = $pay_month * $price;
                $discount_amt = (($tuition + $monthly_fee_tuition) * $discount_info->discount) / 100 ;
                $annual_tuition = $tuition - $discount_amt;
                $total_tuition_due = $total_weekly_Fee->tuition_due + $annual_tuition;
                $weekly_tuition_due = $total_weekly_Fee->tuition_due;
                $after_discount = $tuition - $discount_amt;
                $monthly_tuition_due = 0;//**************** */

                //** note */
                $after_discount = $tuition - $discount_amt;
                $original_price = $price * $annual;
                $minus_weekly_fee = $original_price - $total_tuition_due;
                if(!isset($d->is_pricelist)){
                    $note = 'Tuition('.$original_price.') - '.$minus_weekly_fee.' because Start Date is not the first day of the month.';
                }
            }else{
                // $annual_tuition = $d->months * $price;
                $tuition = $d->months * $price;
                $discount_amt = ( $tuition * $discount_info->discount) / 100 ;
                $annual_tuition = $tuition - $discount_amt;
                $after_discount = $tuition - $discount_amt;
                $total_tuition_due = $annual_tuition;
                $week ="full month no week count";
                $endinfInfo = findFutureMonths($d->start_date,$d->months-1);//** */
                $end_date =$endinfInfo->end_date;
                $weekly_tuition_due = 0;
                $monthly_tuition_due = 0;
            }

            return (object)['note'=>$note,'price_list_id' => $monthly_fee_info->price_list_id,'end_date'=> $end_date,'tuition'=>$tuition,'tuition_due'=>$total_tuition_due,'weekly_tuition_due' => $weekly_tuition_due,'weeks' => $week,'monthly_tuition_due' => $monthly_tuition_due,'discount'=>$discount_info,'after_discount' => $after_discount,'discount_amount' => $discount_amt,'status_code' => 200,'error_message' =>null];
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
        // return (object)['price_list_id'=>$monthly_fee_info->price_list_id,'end_date' => $end_date,'tuition'=>$x,'tuition_due'=> $x==0?$weekly_fee:$x,'status_code' => 200,'error_message' =>null];
        return (object)['price_list_id'=>$monthly_fee_info->price_list_id,'end_date' => $end_date,'weekly_fee'=>$x,'tuition_due'=> $x==0?$weekly_fee:$x,'status_code' => 200,'error_message' =>null,''];
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
        $program_id = isset($d->program_id)?$d->program_id:$level_info->program_id;
        // $prev_level_id = $level_info->prev_level_id;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $str_date = 'Date(l.start_date)<=\''.$start_date.'\' AND Date(l.end_date)>=\''.$start_date.'\'';
        $query = DB::table('price_list as l')
                ->join('price_list_items as i','i.list_id','=','l.id')
                // ->whereRaw($str_date)
                ->where('i.program_id',$program_id)
                ->where('i.session_id',$session_id);
                if($academic_year){
                    $query->where('l.academic_year',$academic_year);
                }
                if($price_list_id){
                    $query->where('l.id',$price_list_id);
                }else{
                    $query->whereRaw($str_date);
                }
                $query->selectRaw('l.id as price_list_id,i.price,i.program_id');
                $row = $query->first();
        if(!$row) return (object)['price' => 0,'price_list_id' => null];
        return (object)['price' => $row->price,'price_list_id'=>$row->price_list_id];
    }

    function payment_processing($arr=[],$ss=null){
        //** sample arr */
        // $arr = [
        //     "level_id" => $level_id,
        //     "academic_year" => $academic_year,
        //     "session_id" => $session,
        //     "prev_level_id" => "0",
        //     "start_date" => $start_date,
        //     "months" => $months,
        //     "weeks" => $weeks,
        //     "days" => $days,
        //     "pmt_option_id"=> $pmt_option_id
        // ];
        //** */
        $d = (object)$arr;
        $program = GeneralSettings::getProgramByLevel($d->level_id,$ss);
        $str_search = 'pli.program_id = '.$program->program_id;
        if(isset($d->session_id)) $str_search .= ' AND pli.session_id = '.$d->session_id;
        if(isset($d->start_date)) $str_search .= " AND DATE(pl.start_date) <= '{$d->start_date}' AND '{$d->start_date}' <= DATE(pl.end_date)";
        $exists = DB::table('price_list_items as pli')->join('price_list as pl','pl.id','=','pli.list_id')->whereRaw($str_search)->exists();
        if(!$exists) return DV::error('Price list not found');
        $pmt_option_id = $d->pmt_option_id;
        if($pmt_option_id == 4){
            return $this->getWeeklyTuitionDue($arr);
        }else if($pmt_option_id == 5){
            return $this->getDailyTuition($arr);
        }else {
            return $this->getMonthlyTuition($arr);
        }
    }

    /**
     * pendingPayment() or tuitionReviewList() returns list of tuition payments that can be "pending" or "verified", "paid", "expired" tuitions
     * */
    static function tuitionReviewList($filter=[],$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;

        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        //Search filter
        $search_value =isset($d->search_value)?$d->search_value:null;
        $status_id = isset($d->status_id)?$d->status_id:null;
        $term_id = isset($d->term_id)?$d->term_id:null;
        $campus_id = isset($d->campus_id)?$d->campus_id:null;
        //$academic_year = isset($d->academic_year)?$d->academic_year:null;

        $str_search ='1=1';
        $str_moreWhere = $term_id>0? ' e.term_id ='.$term_id : '1=1';
        if($campus_id > 0) $str_moreWhere .= ' AND e.campus_id ='.$campus_id;

        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(i.code ='$search_value' OR i.name LIKE '%$search_value%' OR g.name LIKE '%$search_value%')";
        }
        $selectCols = 'e.id,s.id AS student_id,t.`name` as term_name,lev.`name` AS level_name, e.is_new_student, formatDate(e.start_date) As start_date,e.status_id,st.name as status,s.name,s.name_kh,ep.tuition,ep.tuition_due,ep.tuition_paid,\'USD\' AS currency_code,e.tuition_end_date';
        $query = DB::table('payments as ep')
                ->join('enrollments as e','e.id','=','ep.enrollment_id')
                ->join('program_levels as lev','lev.id','=','e.level_id')
                ->join('students as s','s.id','=','e.student_id')
                ->join('terms as t','t.id','=','e.term_id')
                ->join('pmt_status as st','st.id','=','e.status_id')
                ->selectRaw($selectCols)
                ->where('e.branch_id',$branch_id)
                ->whereRaw($str_search)
                ->whereRaw($str_moreWhere)
                ->where('enroll_finalized',1);

                // if ($status_id !== null && strtolower($status_id) != '4') {
                //     $query->where('e.status_id',$status_id);
                // }
                // ->whereRaw($str_moreWhere)->whereRaw($str_search);

        $count_query = clone $query;
        $count = $count_query->count('ep.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        $today = date('Y-m-d');
        foreach ($rows as $row) {
            $tuition_end_date = convertDate($row->tuition_end_date);
            $row->pmt_status = 'unpaid';
            if($tuition_end_date){
                if($tuition_end_date > $today && $row->status_id == 3){
                    $row->status = 'paid';
                }
                else if($tuition_end_date < $today && $row->status_id == 3){
                    $row->status = 'expired';
                }
                // if($tuition_end_date > date('Y-m-d') && $row->status_id <=2) $row->status = 'unpaid';
            }
            $row->tuition_end_date = date( $tuition_end_date, strtotime( $tuition_end_date));
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function studentPendingPaymentDetails($id){
        $row = DB::table('enrollments as e')
                ->join('students as s','s.id','=','e.student_id')
                ->join('payments as ep','ep.enrollment_id','=','e.id')
                ->where('e.id',$id)
                ->selectRaw('e.id as enrollment_id,e.level_id,e.session_id,e.campus_id,formatDate(e.start_date) as start_date,ep.pmt_option_id')
                ->first();
        // findExists is to check req key match in table
        $exists = findExists('enrollments',['id' => $id]);
        if(!$exists) return DV::error('Enrollment not found');
        if(!$row) return $row = null;
        // if($row->pmt_option_id == 1){
        //     $row->months = 3;
        // }else if($row->pmt_option_id == 2){
        //     $row->months = 6;
        // }else if($row->pmt_option_id == 3){
        //     $row->months = 12;
        // }
        return $row;
    }

    function previewPendingPaymentDetails($arr=[],$id,$ss=null){
        $org_price_list = $this->getOriginalPriceList($id);
        $is_old_student = $org_price_list>0;
        $d = (object)$arr;
        $student_id =isset($d->student_id)?$d->student_id:DB::table('enrollments')->where('id',$id)->take(1)->value('student_id');
        $program_id = GeneralSettings::getProgramByLevel($d->level_id,$ss)->program_id;
        // if($program_id){
        //     $program_id->program_id;
        // }
        $str_pmt_option_id='1=1';
        if(isset($d->pmt_option_id)){
            $str_pmt_option_id = 'pmt_option_id = '.$d->pmt_option_id;
        }
        if($is_old_student){
            // $priceList = DB::table('student_pricelist')->where('inactive',0)->where('student_id',$student_id)->first();
            $studentDiscount = DB::table('student_discounts')->where('student_id',$student_id)
                ->whereRaw($str_pmt_option_id)
                ->where('session_id',$d->session_id)
                ->where('program_id',$program_id)
                ->selectRaw('policy_discount,student_id,pmt_option_id,price_list_id,special_discount,other_discount,program_id')
                ->get()->first();
            $discount = $studentDiscount->policy_discount + $studentDiscount->special_discount + $studentDiscount->other_discount;

            $old = [
                "program_id" => $studentDiscount->program_id,
                "academic_year" => isset($d->academic_year) ? $d->academic_year:null,
                "session_id" => $d->session_id,
                "prev_level_id" => "0",
                "start_date" => $d->start_date?$d->start_date:date('Y-m-d'),
                "months" => GeneralSettings::getPmtOptionMonths($studentDiscount->pmt_option_id),

                //** original_discount from student_discount return as object to replace discount if old student */
                //** can be customize */
                'original_discount' => (object)['discount' => $discount,'discount_percent' => $studentDiscount->policy_discount],
                "pmt_option_id"=> $studentDiscount->pmt_option_id
            ];
            return $this->preview_old_student($old,$id,$ss);
            // return $is_old_student;
        }else{
            return $this->preview_new_student($arr,$id,$ss);
        }
    }

    //* for preview like calculator function
    function preview_old_student($arr=[],$id=null,$ss){
        $d = (object)$arr;
        $weeks = isset($d->weeks) ? $d->weeks :null;
        $days = isset($d->days) ? $d->days :null;
        $selectCols = 'ep.pmt_option_id,s.name,e.campus_id,e.program_id,e.level_id,e.session_id,e.academic_year,e.start_date';
        $exists = findExists('enrollments',['id'=>$id]);
        if(!$exists) return DV::error('Enrollment not found');

        // $row = DB::table('enrollments as e')
        //         ->join('students as s','s.id','=','e.student_id')
        //         ->join('payments as ep','ep.enrollment_id','=','e.id')
        //         ->where('e.id',$id)
        //         ->selectRaw($selectCols)
        //         ->get()->first();

        // if(!$row) return null;
        $start_date = isset($d->start_date)?$d->start_date:null;//$row->start_date;
        unset($row->start_date);
        $session = isset($d->session_id) ? $d->session_id : null;//$row->session_id;
        $pmt_option_id = isset($d->pmt_option_id) ? $d->pmt_option_id: null;//$row->pmt_option_id;
        $level_id = isset($d->level_id) ? $d->level_id:DB::table('program_levels')->where('program_id',$d->program_id)->first()->id;//;$row->level_id;
        $academic_year = isset($d->academic_year)?$d->academic_year:null;
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
            "program_id" => isset($d->program_id)?$d->program_id:null,
            "academic_year" => $academic_year,
            "session_id" => $session,
            "prev_level_id" => "0",
            "start_date" => $start_date,
            "months" => $months,
            "weeks" => $weeks,
            "days" => $days,
            'discount' => $d->original_discount,
            "pmt_option_id"=> $pmt_option_id,
            "price_list_id" => isset($d->price_list_id)?$d->price_list_id:null,
            'is_pricelist' => 1,
        ];
        $priceListInfo =$this->payment_processing($arr,$ss);
        if($priceListInfo->status_code !=200) return DV::error($priceListInfo->error_message);
        // $row->payment_info = $priceListInfo;
        // $row->status_code = $priceListInfo->status_code;
        // $row->error_message = $priceListInfo->error_message;
        // unset($row->level_id);
        // unset($row->pmt_option_id);
        // unset($row->name);
        // unset($row->program_id);
        // unset($row->session_id);
        // return $row;
        return (object)[
            'payment_info' => $priceListInfo,
            'status_code' => $priceListInfo->status_code,
            'error_message' => $priceListInfo->error_message
        ];
    }

    function preview_new_student($arr=[],$id=null,$ss){
        $d = (object)$arr;
        $weeks = isset($d->weeks) ? $d->weeks :null;
        $days = isset($d->days) ? $d->days :null;
        $selectCols = 'ep.pmt_option_id,s.name,e.campus_id,e.program_id,e.level_id,e.session_id,e.academic_year,e.start_date';
        $exists = findExists('enrollments',['id'=>$id]);
        if(!$exists) return DV::error('Enrollment not found');
        $row = DB::table('enrollments as e')
                ->join('students as s','s.id','=','e.student_id')
                ->join('payments as ep','ep.enrollment_id','=','e.id')
                ->where('e.id',$id)
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
            // "program_id" => isset($d->program_id)?$d->program_id:null,
            "academic_year" => $academic_year,
            "session_id" => $session,
            "prev_level_id" => "0",
            "start_date" => $start_date,
            "months" => $months,
            // "weeks" => $weeks,
            // "days" => $days,
            "pmt_option_id"=> $pmt_option_id,
            "price_list_id" => isset($d->price_list_id)?$d->price_list_id:null,
        ];
        $priceListInfo =$this->payment_processing($arr,$ss);
        if($priceListInfo->status_code !=200) return DV::error($priceListInfo->error_message);
        $row->payment_info = $priceListInfo;
        $row->status_code = $priceListInfo->status_code;
        $row->error_message = $priceListInfo->error_message;
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
            "months" => "0|number",
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

        $arr = [
            'level_id' => $inputs['level_id'],
            'session_id' => $inputs['session_id'],
            'start_date' => $inputs['start_date'],
            'status_id' => 2,
        ];

        if($academic_year) $arr = ['academic_year' => $academic_year];
        $months=isset($inputs['months'])?$inputs['months']:null;
        $paid_student = DB::table('enrollments as e')->where('e.id',$id)->join('payments as p','e.id','=','p.enrollment_id')->where('p.tuition_paid','>',0)->where('e.status_id','>=',3)->get()->first();
        if($paid_student){ return DV::error('Student is already paid');}
        $enr = DB::table('enrollments as e')->where('id',$id)->selectRaw('e.program_id,e.student_id,e.id,e.level_id,e.academic_year,e.session_id,e.start_date')->first();
        $student_id = $enr->student_id;
        if($pmt_option_id == 4 && !isset($weeks)) return DV::error('weeks must be input');
        else if($pmt_option_id == 5 && !isset($days)) return DV::error('days must be input');
        if($pmt_option_id == 1){
            $months = $months? $months:3;
        }else if($pmt_option_id == 2){
            $months = $months? $months:6;
        }else if($pmt_option_id == 3){
            $months = $months? $months:12;
        }

        //** create student discount if not exists */
        // $discountHistory = DB::table('student_discounts')->where('student_id',$student_id)->get();
        // $keeps = [];
        $program = GeneralSettings::getProgramByLevel($inputs['level_id'],$ss);

        $pmt_arr = [
            "level_id" => $inputs['level_id'],
            // "program_id" => 1,
            "academic_year" => $enr->academic_year,
            "session_id" => $inputs['session_id'],
            // "prev_level_id" => "0",
            "start_date" => convertDate($inputs['start_date']),
            "months" => $months,
            "weeks" => $weeks,
            "days" => $days,
            //** if old pricelist payment found and is active */
            "student_id" => $student_id,
            "pmt_option_id"=> $pmt_option_id
        ];

        $preview = $instance->previewPendingPaymentDetails($pmt_arr,$id,$ss);
        if($preview->status_code !=200) return DV::error($preview->error_message);
        // return $preview;
        unset($inputs['months']);
        $id = saveData($ss,'enrollments',['id' => $id],$arr,[],1);

        if($preview->status_code == 200){
            $student = new Student();
            $payment_info = $preview->payment_info;
            $discount_info=null;
            $price_list_id = $payment_info->price_list_id;

            $discount_info = $instance->getPolicyDiscount($pmt_option_id,$payment_info->price_list_id);
            $existsPricelist = findExists('student_pricelist',['student_id'=>$student_id,'inactive'=>0]);
            $tuition_due = $payment_info->tuition_due;
            if($existsPricelist){
                $discountPriceList = $student->getDiscount($enr->program_id,$pmt_option_id,$student_id);
                $discount_info = $discountPriceList;
            }else{
                $more_discount = DB::table('payments')->where('enrollment_id',$id)->selectRaw('special_discount,second_child_discount')->first();
                $dis = $more_discount->special_discount + $more_discount->second_child_discount;
                $tuition_due = $payment_info->tuition_due;
                $dis_amount = ($tuition_due * $dis)/100;
                $tuition_due = $tuition_due - $dis_amount;
            }

            $pmt_arr = [
                'pmt_option_id'=>$pmt_option_id,
                'tuition' => $payment_info->tuition,
                'tuition_due' => $tuition_due,
                'status_id' => 1,
                'program_id' => $program->program_id,
                'level_id' => $inputs['level_id'],
                'session_id' =>  $inputs['session_id'],
                'price_list_id' => $price_list_id,
                'policy_discount' => $discount_info->discount,
            ];

            $inv = new Activity();
            // params = enrollment_id,tuition_due,additional_discount = 0 because it has already updated in approve discount;
            $inv->resetUnpaidInvoice($id,$tuition_due,0,$payment_info->tuition);
            $set_pmt_option = saveData($ss,'payments',['enrollment_id' => $enr->id],$pmt_arr,[],1);
            DB::table('enrollments')->where('student_id',$student_id)->where('branch_id',$ss->branch_id)->update([
                "tuition_end_date" => findFutureMonths(convertDate($inputs['start_date']),$months)->end_date,
            ]);
        }

        return DV::depends($id,$preview);
    }

    static function getProgramByLevel($id,$ss){
        return DB::table('programs as p')
                ->join('program_levels as pl','pl.program_id','=','p.id')
                ->selectRaw('p.name as program,p.id as program_id')
                ->where('pl.id',$id)
                ->get()->first();
    }



    static function getOtherFeeTypes($id,$inv_number){
        $rows = DB::table('invoices as i')->where('student_id',$id)
                ->join('invoice_items as it','i.id','=','it.invoice_id')
                ->where('it.fee_type','!=','tuition_fee')
                ->where('i.invoice_number',$inv_number)
                ->selectRaw('it.id as invoice_item_id,it.fee_type,it.price as amount,it.description,price as total')->get();
        return $rows;
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
        $return_fee = 0;
        $surcharge = 0;

        $requestChange = DB::table('requests as r')->join('request_changes as rc','rc.request_id','=','r.id')->where('r.student_id',$student_id)->where('r.authorized',0)->where('r.status_id',2)->selectRaw('rc.enrollment_id')->first();
        if(!$requestChange) return DV::error('Request not found');
        $enrollment_id = $requestChange->enrollment_id;
        // unset($inputs['enrollment_id']);
        $payment_info = DB::table('enrollments as e')->where('e.id',$enrollment_id)->where('e.student_id',$student_id)->join('payments as p','p.enrollment_id','=','e.id')->join('terms as t','t.id','=','e.term_id')->selectRaw('e.id as enr_id,p.tuition_paid,e.tuition_end_date,e.start_date,e.session_id,e.level_id,e.campus_id,e.academic_year')->get()->first();
        $start_date = isset($d->start_date) ? $d->start_date :$payment_info->start_date;
        $studied_days = date('d') - date('d',strtotime($start_date));
        $academic_year = isset($d->academic_year)?$d->academic_year:$payment_info->academic_year;
        $level_id = isset($d->to_level_id)?$d->to_level_id:$payment_info->level_id;
        if($d->request_type_id == 1){

            $end_date = $payment_info->tuition_end_date;

            $x = dateDiff_days($start_date,$end_date);
            if(!$x) $x=1;
            $per_day = $payment_info->tuition_paid / $x;
            $deduct_day_fee = number_format($per_day * $studied_days,2);
            $fee_left = $payment_info->tuition_paid - $deduct_day_fee;

            $level_pmt_arr = [
                'student_id' => $student_id,
                'enrollment_id' => $enrollment_id,
                'start_date' => $start_date,
                'session_id' => $payment_info->session_id,
                'level_id' => $level_id,
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
                'student_id' => $student_id,
                'enrollment_id' => $enrollment_id,
                'start_date' => $start_date,
                'session_id' => $payment_info->session_id,
                'level_id' => $level_id,
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
        //$instance = new PriceList(null,$ss);
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
        $row = $instance->previewPendingPaymentDetails($arr,$d->enrollment_id,$ss);
        return $row->payment_info->tuition_due;
    }


    function getOriginalPriceList($enrollment_id){
       if(!($enrollment_id>0)) $enrollment_id = 0;
       $row = DB::table('student_pricelist as s')
       ->select('s.price_list_id')
       ->join('enrollments as e', 's.student_id', '=', 'e.student_id')
       ->where('e.id', $enrollment_id)
       ->whereRaw('ifnull(s.inactive,0) = 0')
       ->limit(1)
       ->get()->first();
       if(!$row) return false;
       return true;

    //    return DB::select(DB::raw('SELECT student_id FROM student_pricelist WHERE student_id = (SELECT student_id FROM enrollments WHERE enrollment_id = '.$enrollment_id.' LIMIT 1) LIMIT 1'));
    //    return  DB::select(DB::raw('select price_list_id from student_pricelist where student_id = (select student_id from enrollments where enrollment_id = '.$enrollment_id.' limit 1) limit 1'));
    }

    // function getInvoiceItems($invoice_id,$ss=null){
    //     $ss = $ss?$ss:$this->user_info;
    //     $discount_type =',\'percentage\' AS discount_type';
    //     return DB::table('invoice_items AS i')->where('invoice_id',$invoice_id)->selectRaw('i.id,i.invoice_id,i.fee_type,i.description,i.qty,i.price,i.date_range,i.discount,i.discount_amount,i.discount_percent,i.discount_type,i.net_amount,i.start_date,i.end_date')->get();
    // }

    static function getOriginalPriceListInfo($enrollment_id){
        return DB::table('student_pricelist AS sl')->join('price_list AS pl','pl.id','=','sl.price_list_id')->where('sl.enrollment_id',$enrollment_id)->whereRaw('IFNULL(sl.inactive,0)=0')->selectRaw('pl.id,pl.`name`,pl.start_date,pl.end_date')->get()->first();
    }

    /**
     * For existing student, give a enrollment_id
     * User must provide @pmt_option_id in order to preview or calculate payment amount
     * parameters @program_id and @session_id are optional. their values can be derived from @enrollment_id
     * This function is called when user preview or calculate Tuition fee by providing enrollment_id, pmt_Option_id, session_id
    */
    function getStudentDiscountInfo($pmt_option_id,$enrollment_id,$program_id=null,$session_id=null){
        $e = DB::table('enrollments as e')->where('e.id',$enrollment_id)->take(1)->selectRaw('e.campus_id,e.program_id,e.student_id,e.level_id,e.session_id')->get()->first();
        if(!$e) return DV::error('Failed to retrieve enrollment information based on the given enrollment ID');
        if(!$e->program_id) return DV::error('Enrollment record does not contains valid program ID');
        if(!$e->level_id) return DV::error('Enrollment record does not contains valid level ID');
        $pmt_option_id = $pmt_option_id?$pmt_option_id:$e->pmt_option_id;
        $session_id = $session_id?$session_id:$e->session_id;
        $program_id = $program_id?$program_id:$e->program_id;

        $row = DB::table('student_discounts AS d')->where('d.student_id',$e->student_id)->where('d.program_id',$program_id)->where('d.pmt_option_id',$pmt_option_id)->where('d.session_id',$session_id)->selectRaw('d.id,d.policy_discount,d.special_discount,d.other_discount,d.student_id')->get()->first();

        $price_list = DB::table('student_pricelist as sl')->join('price_list As l','l.id','=','sl.price_list_id')->where('sl.student_id',$e->student_id)->where('enrollment_id',$enrollment_id)->whereRaw('IFNULL(sl.inactive,0) =0')->selectRaw('l.id AS price_list_id,l.name as price_list_name,l.academic_year,formatDate(l.start_date) AS start_date,formatDate(l.end_date) AS end_date')->take(1)->get()->first();
        $pl_name = null;
        $cur ='USD';
        $monthly_tuition = 0 ;
        if($price_list){
           $pl_name = $price_list->price_list_name;
           $pl_id = $price_list->price_list_id;
           $pl_item = DB::table('price_list_items as i')->where('price_list_id',$pl_id)->where('program_id',$program_id)->where('session_id',$session_id)->selectRaw('i.price,i.currency_code')->take(1)->get()->first();
           if($pl_item){
            $monthly_tuition = $pl_item->price;
            $cur = $pl_item->currency_code;
           }
        }
        return (object)[
             'student_id'=>$row? $row->student_id:null,
             'price_list_info'=>$price_list,
             'price_list_name'=>$pl_name,
             'monthly_tuition'=>$monthly_tuition,
             'currency_code'=>$cur,
             'program_id'=>$program_id,
             'session_id'=>$session_id,
             'pmt_option_id'=>$pmt_option_id,
             'special_discount'=>$row?$row->special_discount:0,
             'policy_discount'=>$row?$row->policy_discount:0,
             'other_discount'=>$row?$row->other_discount:0,
             'discount_type'=>'percentage'
        ];
    }

    static function getEnrollmentInfo($enrollment_id){
        $cols = 'e.id,e.level_id,e.campus_id,e.session_id,e.student_id,st.name as student_name,e.is_new_student';
        $row = DB::table('enrollments as e')->join('students as st','st.id','=','e.student_id')->where('e.id',$enrollment_id)->selectRaw($cols)->get()->first();
        if(!$row) return null;
        if($row->is_new_student !==1) {
            $row->price_list = self::getOriginalPriceListInfo($row->id);
        }
        else $row->price_list= null;
        return $row;
    }

    function getPaymentPreviewOptions($enrollment_id,$ss=null){
        $ss = $ss?$ss:$this->user_info;
        $enroll_info = null;
        if($enrollment_id > 0) $enroll_info = self::getEnrollmentInfo($enrollment_id);
        return  (object)[
            'enrollment_info'=>$enroll_info,
            'price_lists'=>GeneralSettings::options_price_list(null,$ss),
            'sessions' => GeneralSettings::options_session($ss),
            'pmt_options' => GeneralSettings::options_pmt($ss),
            'pmt_statuses'=>GeneralSettings::options_pmt_status($ss),
            'programs' => GeneralSettings::options_program($ss),
            'levels' => GeneralSettings::options_level(null,$ss),
            'campuses' => GeneralSettings::options_campus($ss),
            'academic_year' => GeneralSettings::options_academic_year($ss),
            'terms' => GeneralSettings::options_term(null,$ss),
            'groups' => GeneralSettings::options_group(null,[]),
            'discount_type' => DB::table('discount_types')->selectRaw('name,id')->get()
        ];
    }
}
