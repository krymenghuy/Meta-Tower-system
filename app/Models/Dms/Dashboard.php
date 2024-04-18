<?php

namespace App\Models\Dms;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use DB;
use Sanitizer;
//use Illuminate\Pagination\LengthAwarePaginator;
class Dashboard //extends Model
{
    //use HasFactory;
    protected $id = null, $userInfo = null;
    public function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
   
    function getData($arr, $ss=null){
       $ss =$ss?$ss:$this->userInfo;
       //$d = (object)$arr;
       $cards = self::getCards($arr,$ss);
       return (object)[
        'cards'=>$cards,
        'revenuesByCategory'=>self::getRevenuesByCategory(null,$ss),
        'merchantByCategory'=>self::createData_piechart($ss)
       ];
    }

    function createData_piechart($ss) {
        $marchants = [];
        $fees = [];
        $rows = self::getTopMerchants(10,12,$ss);
        foreach($rows as $row){
            $marchants[] = $row->merchant;
            $fees[] = $row->fees;
        }
        $colors = [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4CAF50',
            '#FF8C00',
            '#9966CC',
            '#FFD700',
            '#7CFC00',
            '#FF4500',
            '#00BFFF'
        ];
    
        $chartData = [
            'title'=>'Top 10 Merchants',
            'subTitle'=>'(Over 12 months)',
            'labels' => $marchants,
            'datasets' => [
                [
                    'label'=>'Amount',
                    'data' => $fees,
                    'backgroundColor' =>$colors
                ]
            ]
        ];
        return (object)$chartData;
    }

    static function getTopMerchants($top_count =10,$back_months=12,$ss){
      $start_date = date('Y-m-d', strtotime("-$back_months months"));   
      $sql = 'SELECT COUNT(p.id) as package_count,SUM(CASE p.status_id =8 and p.sender_pmt_status_id =1 WHEN 1 THEN (p.base_fee + p.delivery_fee) ELSE 0 END) AS fees, SUM(CASE p.status_id=11 WHEN 1 THEN 1 ELSE 0 END) as returned_count, sender_id, s.name as merchant, YEAR(arrival_time) as mYear FROM package as p INNER JOIN sender as s ON s.id = p.sender_id WHERE DATE(p.arrival_time) >= \''.$start_date.'\' group by p.sender_id, merchant, mYear order by fees DESC,returned_count DESC, mYear ASC LIMIT '.$top_count;
      $rows = DB::select(DB::raw($sql));
      return $rows;
    }

    //return object {total_earnings,avg_daily_earning,package_count,delivered_count,failed_count,merchant_count}
    static function getCards($arr,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$arr;
        $back_days = isset($d->back_days)?$d->back_days:-90;

        $from_date = convertDate(Carbon::now()->addDays($back_days));
        $moreWahres ='DATE(p.arrival_time) >= \''.$from_date.'\''; 
        $rows = DB::table('package AS p')->where('branch_id',$branch_id)->whereRaw($moreWahres)->selectRaw("p.sender_id,p.driver_id,p.sender_pmt_status_id,p.status_id,p.driver_pmt_status_id,p.base_fee,p.delivery_fee,p.cod_fee,p.arrival_time")->orderByRaw("p.arrival_time ASC")->get();
        $total_earning =0;
        $package_cnt =0;
        $failed_cnt =0;
        $delivered_cnt=0;
        $returned_cnt=0;
        $merchant_cnt =0;
        $driver_cnt =0;

        $merchants = [];
        $drivers = [];
        $days_count = 0;
        
        $first_date = isset($rows[0])?$rows[0]->arrival_time:$from_date;
        foreach($rows as $row){
          $fees = 0;
          if($row->status_id ==8)
          {
            $fees = $row->base_fee + $row->delivery_fee + $row->cod_fee;
            $total_earning+=$fees;
            $delivered_cnt++;
          }else if($row->status_id ==9){
              $failed_cnt++;
          }else if($row->status_id ==11)
          {
              $returned_cnt++;
          }

          if(!in_array($row->sender_id,$merchants)) 
          {
                $merchant_cnt++;
                $merchants[] = $row->sender_id;
          } 
          
          if(!in_array($row->driver_id,$drivers)) 
          {
                $driver_cnt++;
                $drivers[] = $row->driver_id;
          } 

          $package_cnt++; 
        }
       
        $days_count = dateDiff_days(convertDate($first_date),date('Y-m-d'));
        if ($days_count !=0)
          $avg_daily_earnings = $total_earning/abs($days_count);
        else $avg_daily_earnings =$total_earning;

        if($total_earning==0) $avg_daily_earnings=0;
        //Get Count of merchants who register in mobile app by themselves
        $self_reg_merchants = DB::table('um_users as u')->where('branch_id',$branch_id)->where('user_class','merchant')->whereIn('create_user',['self','self register'])->distinct()->count('u.official_id');
        return (object)[
            'total_earnings'=> (object)[
                'currency_code'=>'USD',
                'amount'=>number_format($total_earning,2,'.',''),
                'title'=>'Total Earnings',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],

            'avg_daily_earnings' => (object)[
                'currency_code'=>'USD',
                'amount'=>number_format($avg_daily_earnings,2,'.',''),
                'title'=>'Average Daily Earnings',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],

           'package_count' => (object)[
                'currency_code'=>'USD',
                'count'=>$package_cnt,
                'title'=>'Total Packages',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],

           'delivered_count' => (object)[
               'currency_code'=>'USD',
                'count'=>$delivered_cnt,
                'title'=>'Delivered Count',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],
            'returned_count' => (object)[
                'currency_code'=>'USD',
                'count'=>$returned_cnt,
                'title'=>'Returned Count',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],
            'merchant_count' => (object)[
                'currency_code'=>'USD',
                'count'=>$merchant_cnt,
                'title'=>'Active Merchants',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],

            'driver_count' => (object)[
                'currency_code'=>'USD',
                'count'=>$driver_cnt,
                'title'=>'Active Drivers',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],
            'daily_collection'=> (object)[
                'currency_code'=>'USD',
                'amount'=>0,
                'title'=>'Average Daily Collection',
                'subTitle' =>'Last '.abs($back_days).' days'
            ],
            'payable'=> (object)[
                'currency_code'=>'USD',
                'amount'=>0,
                'title'=>'Payable',
                'subTitle' =>'Up to now'
            ],
            'receivable'=> (object)[
                'currency_code'=>'USD',
                'amount'=>0,
                'title'=>'Receivable',
                'subTitle' =>'Up to now'
            ],
            'appDownload'=> (object)[
                'count'=>$self_reg_merchants,
                'title'=>'Mobile Registration',
                'subTitle' =>'Merchants'
            ]
        ];
    }
   
 /** Revenues by category by month => Revenues|Category by months for one chosen academic_year
   *  Return data for linechart, barchart, and two cards : "Total Tuition", "Total Non tuition"
  */
  static function getRevenuesByCategory($back_days=null, $ss){
    $branch_id = $ss->branch_id;
    
    $back_days = $back_days > 0? $back_days:-365;
    $from_date = convertDate(Carbon::now()->addDays($back_days));
    $period_name = 'Last '.abs($back_days).' days';

    $str_base ='p.branch_id = '.$branch_id;
    $rows = DB::table('package as p')->whereRaw($str_base)->whereRaw('DATE(delivery_time) >=\''.$from_date.'\'')->selectRaw('YEAR(p.delivery_time) AS `year`,MONTH(p.delivery_time) AS `month`,SUM(CASE (p.status_id =11 and p.collectible=0) WHEN 1 THEN (IFNULL(p.delivery_fee,0) + p.base_fee + IFNULL(p.cod_fee,0)) ELSE 0 END) AS returned_loss,SUM(CASE (p.status_id =8) WHEN 1 THEN (p.delivery_fee + p.base_fee + IFNULL(p.cod_fee,0)) ELSE 0 END) AS earning_amount,COUNT(distinct p.sender_id) AS merchant_count,COUNT(p.id) AS package_count')->groupByRaw('`year`,`month`')->get();

    $data = ['merchant_counts'=>[],'package_counts'=>[],'earnings'=>[],'returned_loss'];
    //$categories = ['tuition','non-tuition','enrollment'];
    $month_names = []; //labels
 
    foreach($rows as $row){
        $month_name = getMonthName($row->month,true);
        $month_names[] = $month_name;
        $data['merchant_counts'][] = $row->merchant_count;
        $data['package_counts'][] = $row->package_count;
        $data['earnings'][] = $row->earning_amount;
        $data['returned_loss'][] = $row->returned_loss;
    }

    $list_dataset = [
        (object)[
            'data'=>$data['merchant_counts'],
            'label'=>'Merchants',
            'fill'=>false,
            'borderColor'=>'#2B90D6',
            'backgroundColor'=>'#2B90D6',
            'tension'=>0.1,
            'cubicInterpolationMode'=>'monotone'
        ],
        (object)[
            'data'=>$data['package_counts'],
            'label'=>'Packages',
            'fill'=>false,
            'borderColor'=>'#0CD9B4',
             'backgroundColor'=>'#0CD9B4',
            'tension'=>0.1,
            'cubicInterpolationMode'=>'monotone'
        ],
        (object)[
            'data'=>$data['earnings'],
            'label'=>'Earnings',
            'fill'=>true,
            'backgroundColor'=>'#D6CD0E',
            'borderColor'=>'#D6CD0E',
            'tension'=>0.1,
            'cubicInterpolationMode'=>'monotone'
        ],
        // (object)[
        //     'data'=>$data['returned_loss'],
        //     'label'=>'Loss',
        //     'fill'=>true,
        //     'backgroundColor'=>'#D6CD0E',
        //     'borderColor'=>'#D6CD0E',
        //     'tension'=>0.1,
        //     'cubicInterpolationMode'=>'monotone'
        // ],
    ];
    return (object)[
        'title'=>'Earnings by month',
        'subTitle'=>$period_name,
        'labels'=>$month_names,
        'datasets'=>$list_dataset
    ];
  }

  static function generateRandomColor() {
    $themeColors = ['#00008B', '#3498DB', '#95A5A6', '#E74C3C']; // Dark Blue, Blue, Grey, Red
    return $themeColors[array_rand($themeColors)];
  }


   function getDashboardData_barchart($d,$ss){
    $branch_id = $ss->branch_id;
    $back_months= -12;
    $start_date = convertDate(Carbon::now()->addMonths($back_months));
    $back_months= -6;
    $start_date = convertDate(Carbon::now()->addMonths($back_months));
        $sql ="SELECT COUNT(distinct p.sender_id) AS sender_count".
        ",COUNT(p.id) AS package_count".
        ",SUM(CASE p.status_id WHEN 8 THEN 1 ELSE 0 END) AS delivered_count".
        ",SUM(CASE p.status_id WHEN 8 THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0)) ELSE 0 END) AS earnings".
        ",SUM(CASE p.status_id WHEN 11 THEN (IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0)) ELSE 0 END) AS missed_earnings_returned".
        ",MONTH(create_date) AS op_month 
        FROM `package` as `p` where `p`.`branch_id` = '$branch_id' and DATE(p.create_date) >='$start_date' GROUP BY op_month ORDER BY op_month";
        $rows = DB::select(DB::raw($sql));
        $months = [];
        $earnings_totals =[];
        $merchant_counts = [];
        $delivered_counts =[];
        $package_counts =[];

        $first_earnings = 0;
        $last_earnings =0;
        $change_in_earnings =0;
        $i=0;
        foreach($rows as $row){
            $months[] = $this->getMonthName($row->op_month,false);
            $earnings = number_format($row->earnings,2,'.','');
            $earnings_totals[] = $earnings;
            $merchant_counts[] = $row->sender_count;
            $package_counts[] = $row->package_count;
            $delivered_counts[] = $row->delivered_count;
            if($i===0) $first_earnings = $earnings;
            $last_earnings = $earnings; 
            $i++;
        }
        $change_in_earnings=0;
        $first_earnings =(float)$first_earnings;
        if ($first_earnings ==0) $change_in_earnings = $last_earnings; 
        if(!is_numeric($first_earnings)) 
            $first_earnings =0;
        else if ($first_earnings ==0) 
            $change_in_earnings =100;  
        else {
            //$first_earnings = ($first_earnings == 0)? 1:$first_earnings;
            $change_in_earnings =(abs(is_numeric($last_earnings)?$last_earnings:0) - abs(is_numeric($first_earnings)?$first_earnings:0)) *100/ $first_earnings;
        } 

        $last_earnings = is_numeric($last_earnings)?$last_earnings:0;
        $change_in_earnings = is_numeric($change_in_earnings)?$change_in_earnings:0;
        
        return (object)[
         'months'=>$months,   
         'merchant_counts'=>$merchant_counts,
         'earnings_totals'=>$earnings_totals,
         'package_counts'=>$package_counts,
         'delivered_counts'=>$delivered_counts,
         'change_in_earnings'=>number_format($change_in_earnings,2,'.',''),
         'first_earnings'=>$first_earnings,
         'last_earnings'=>number_format($last_earnings,2),
         'change_info_text'=>'Since last quarter'
        ];
   }
  
     //return formatted data fit for Donut chart / Pie chart
     /***
       % of each "failed" reason  
     ***/
     function getDashboardData_piechart($d,$ss){
        // $ss = getSessionInfo($d);
        // if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;

        $back_days = -90;
        $start_date = convertDate(Carbon::now()->addDays($back_days));
        $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->whereRaw("DATE(p.create_date)>='$start_date'")->selectRaw("COUNT(p.id) AS cnt, SUM(p.base_fee + IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0)) AS fees,p.sender_id")->groupByRaw('p.sender_id')->get();
        
        //returned_count_by_sender_rows
        $returned_counts = DB::table('package AS p')->where('p.branch_id',$branch_id)->whereRaw("DATE(p.create_date)>='$start_date' AND p.status_id =11")->selectRaw("COUNT(p.id) AS cnt, SUM(p.base_fee + IFNULL(p.delivery_fee,0) + IFNULL(p.cod_fee,0)) AS fees,p.sender_id")->groupByRaw('p.sender_id')->get();

        $cats = $this->processMerchantCategories($rows,$returned_counts);

        $labels = [];
        $values = [];
        $colors = [];

        // $labels1 = [];
        // $values1 = [];
        // $colors1 = [];

        $g = 99;
        $b = 132;
        $i = 0;
        foreach($cats as $cat) {
          $labels[] = $cat->category;
          $values[] = $cat->count;

        //   //get return_info that is object {'returned_count','missed_ernings','currency_code'=>'$'}
        //   $ret = $this->getReturned_info($cat->sender_id,$returned_counts)->returned_count;
        //   $labels1[] = "Returned"; //$cat->category;
        //   $values1[] = $ret->returned_count;
        
          $g += 10;
          $b += 10; 
          //$colors[] = $this->randomColour();
          //if($i ==5)  return (object)array('labels'=>$labels,'values'=>$values,'colors'=>$colors);
          $i++;
        }

        $colors[0] ='#4CBB21';
        $colors[1] ='#4CB68D';
        $colors[2] ='#32BCD3';
        $colors[3] ='#3795E0';
        $colors[4] ='#ECF140';
        return (object)array('labels'=>$labels,'values'=>$values,'colors'=>$colors);
  }
 
  //return object {'returned_count','missed_earnings'}
  function getReturned_info($sender_id,$rows=[]){
    $i=0;
    $c= null;
    do{
       if(!isset($rows[$i])) break; 
       $c = $rows[$i];
        if($c->sender_id ===$sender_id) {
            return (object)['returned_count'=>$c->cnt,'missed_earnings'=>$c->fees];
        }
       $i++;
    }while($c);
    return (object)['returned_count'=>0,'missed_earnings'=>0,'currency_code'=>'$'];
  }

  function randomColour() {
    $rand = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
    $color = '#'.$rand[rand(0,15)].$rand[rand(0,15)].$rand[rand(0,15)].$rand[rand(0,15)].$rand[rand(0,15)].$rand[rand(0,15)];
    return $color;
  }

  //return array object [{'count','category'}]
  function processMerchantCategories($rows){
     $cat_count_a= 0; 
     $cat_count_b= 0; 
     $cat_count_c= 0;
     $cat_count_d= 0;
     $cat_count_e=0;
     
     $earnings_a =0;
     $earnings_b =0;
     $earnings_c =0;
     $earnings_d =0;
     $earnings_e =0;
 
     foreach($rows as $row){
        if($row->cnt >= 70) 
        {
            $cat_count_a++; 
            $earnings_a += $row->fees; 
        } else if ($row->cnt >=35){
            $cat_count_b++;
            $earnings_b += $row->fees; 
        }else if($row->cnt >= 10)
        {
            $cat_count_c++;
            $earnings_c += $row->fees; 
        }else if($row->cnt > 0) {
            $cat_count_d++;
            $earnings_d += $row->fees; 
        } else{
            $cat_count_e++;
            $earnings_e += $row->fees; 
        }
     }
     $data = [];
     $data[] = (object)['category'=>'A (70pcs or more)','count'=>$cat_count_a];
     $data[] = (object)['category'=>'B (35 to 69pcs)','count'=>$cat_count_b];
     $data[] = (object)['category'=>'C (10 to 34pcs)','count'=>$cat_count_c];
     $data[] = (object)['category'=>'D (Less than 10 pcs)','count'=>$cat_count_d];
     $data[] = (object)['category'=>'E (0 pcs)','count'=>$cat_count_e];
     return $data;

  }

  //Daily incomes DailyIncomes
  function getDashboardData_table($d,$ss){
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $month = date('m');
        $day = date('d');
        $year = date('Y');
        $start_date ="$year-$month-01";
        $end_date = date('Y-m-d'); 
        $sql ="SELECT COUNT(p.id) AS package_count, 
        SUM(CASE (lower(p.df_payer) ='sender' AND p.cod =0) WHEN 1 THEN IFNULL(p.base_fee,0) + IFNULL(p.delivery_fee,0) + IFNULL(p.forwarding_cost,0) ELSE IFNULL(p.forwarding_cost,0) + IFNULL(p.cod_fee,0) END) AS total_fee_paid_by_sender,
        SUM(p.base_fee) AS total_base_fee, SUM(IFNULL(p.delivery_fee,0)) AS total_delivery_fee, 
        SUM(IFNULL(p.cod_fee,0)) AS total_cod_fee, SUM(IFNULL(p.forwarding_cost,0)) as total_taxi,
        SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) -IFNULL(p.cod_fee,0) ELSE 0 END) AS total_cod_amount, 
        SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS total_price,DATE(p.arrival_time) AS arrival_date FROM package AS p WHERE p.branch_id ='$branch_id' AND p.status_id =8 AND (DATE(p.arrival_time) >='$start_date' AND DATE(p.arrival_time) <='$end_date') GROUP BY arrival_date";
        //$sql ="SELECT COUNT(p.id) AS package_count,SUM(p.base_fee + p.delivery_fee + p.cod_fee) AS total_fees, SUM(IFNULL(p.price,0)) AS total_price, SUM(IFNULL(p.cod_fee,0)) AS total_cod_fee, DATE(p.arrival_time) AS arrival_date FROM package AS p WHERE p.branch_id ='$branch_id' AND p.status_id =8 GROUP BY arrival_date";

        $rows = DB::select(DB::raw($sql));
       //foreach($rows as $row) $row->amount_to_sender = $row->total_price - $row->total_fees; 
       return $rows;
    }
 
    function getDailyCollection_packageCount($payment_date){
       $branch_id = Session('branch_id',0); 
       $payment_date = convertDate($payment_date);
       $rows = DB::table("cash_receipts as r")->join('package as p','p.driver_settlement_id','=','r.settlement_id')->selectRaw("COUNT(p.id) AS package_count")->groupByRaw("DATE(r.payment_date)")->whereRaw("r.branch_id ='$branch_id' AND DATE(r.payment_date)='$payment_date'")->get();
       foreach($rows as $row) return $row->package_count;
       return 0;
    }

    //getDailyCashCollection() | getPayments| getDailyPayments from drivers | Daily Collection
    //returns table with columns: "payment_date,cash_amount,bank_amount,total,driver_count,sender_count"
    function getDailyCollections($d,$ss){
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $branch_id =$branch_id?$branch_id:0;
        $start_date = isset($d['start_date'])? convertDate($d['start_date']):null;
        if (!$start_date || !(bool)strtotime($start_date)){
            $month = date('m');
            $day = date('d');
            $year = date('Y');
            $start_date ="$year-$month-01";
        }
       
        $driver_id = isset($d['driver_id'])?$d['driver_id']:null;
        $end_date = isset($d['end_date'])? convertDate($d['end_date']):null;
        if (!$end_date || !(bool)strtotime($end_date)) $end_date = date('Y-m-d');
         $str_driver ="";
         if($driver_id>0) $str_driver =" AND r.payer_id =$driver_id";
         $sql ="SELECT CASE r.pmt_method ='Cash' WHEN 1 THEN 'Cash' ELSE 'Bank' END AS pmt_method, DATE_FORMAT(r.payment_date,'%d %b %Y') AS payment_date, r.payer_type, SUM(r.amount) AS amount FROM cash_receipts AS r WHERE r.branch_id =$branch_id AND date(r.payment_date) >='$start_date' AND date(r.payment_date) <='$end_date' AND ABS(r.amount) >0 AND r.payer_type='driver' $str_driver GROUP BY DATE_FORMAT(payment_date,'%d %b %Y'), pmt_method, r.payer_type ORDER BY payment_date DESC";
         $rows = DB::select(DB::raw($sql));
         $new_rows = [];
         //return $rows;
         $daily_total = 0;
         $daily_cash=0;
         $daily_bank=0;

        //  $daily_bank_sender_count = 0;
        //  $daily_bank_driver_count = 0;

         $prev_date =null;

         $i=0;
        foreach($rows as $row){
            $is_last_row = isset($rows[$i+1])?false:true;
            $on_date_changed = ($prev_date != $row->payment_date);
 
            //If it is the very first row and the very last row too
            if(!$prev_date && $is_last_row){
                  //Increment Total_Cash, total_bank, and Total
                    $pmt_method = strtolower($row->pmt_method);
                    if($pmt_method === 'cash')
                        $daily_cash += $row->amount;
                    else 
                        $daily_bank += $row->amount;
        
                    $daily_total += $row->amount;

                  return [(object)[
                    'payment_date'=>$row->payment_date,
                    'package_count'=>$this->getDailyCollection_packageCount($row->payment_date),
                    'cash'=>number_format($daily_cash,2,'.',''),
                    'bank'=>number_format($daily_bank,2,'.',''),
                    'total'=>number_format($daily_total,2,'.',''),
                    'driver_count'=>$this->getDriverCount($branch_id,$row->payment_date),
                    'sender_count'=>0
                   ]];
            }else{
                if ($on_date_changed && $prev_date){
                  $new_rows[] = (object)[
                    'payment_date'=>$prev_date,
                    'package_count'=>$this->getDailyCollection_packageCount($prev_date),
                    'cash'=>number_format($daily_cash,2,'.',''),
                    'bank'=>number_format($daily_bank,2,'.',''),
                    'total'=>number_format($daily_total,2,'.',''),
                    'driver_count'=>$this->getDriverCount($branch_id,$prev_date),
                    'sender_count'=>0
                  ];
                  
                  $daily_cash=0;
                  $daily_bank=0;
                  $daily_total = 0;
                }else if(!$on_date_changed){
                    //If is some row in middle, and this $row->payment_date is same as $prev_date
                    $pmt_method = strtolower($row->pmt_method);
                    if($pmt_method === 'cash')
                        $daily_cash += $row->amount;
                    else 
                        $daily_bank += $row->amount;
         
                    $daily_total += $row->amount;
                }else{
                    $pmt_method = strtolower($row->pmt_method);
                    if($pmt_method === 'cash')
                        $daily_cash += $row->amount;
                    else 
                        $daily_bank += $row->amount;
        
                    $daily_total += $row->amount;
                }

                //If it is very Last row
                if($is_last_row){
                    if($on_date_changed){
                        $pmt_method = strtolower($row->pmt_method);
                        if($pmt_method === 'cash')
                            $daily_cash += $row->amount;
                        else 
                            $daily_bank += $row->amount;
             
                        $daily_total += $row->amount;
                    }
                    
                    $tmp_date = $row->payment_date;
                    $new_rows[] = (object)[
                        'payment_date'=>$tmp_date,
                        'package_count'=>$this->getDailyCollection_packageCount($tmp_date),
                        'cash'=>number_format($daily_cash,2,'.',''),
                        'bank'=>number_format($daily_bank,2,'.',''),
                        'total'=>number_format($daily_total,2,'.',''),
                        'driver_count'=>$this->getDriverCount($branch_id,$tmp_date),
                        'sender_count'=>0
                      ];
                }
            }
            $prev_date = $row->payment_date;
            $i++;
        }
         return $new_rows;
    }

    function getDriverCount($branch_id,$payment_date){
       $branch_id =$branch_id?$branch_id:0;
       $payment_date= convertDate($payment_date);
       $rows = DB::table('cash_receipts as r')->where('branch_id',$branch_id)->whereRaw("r.payer_type ='driver' AND DATE(r.payment_date) ='$payment_date' AND (amount >0 OR amount <0)")->selectRaw("COUNT(distinct r.payer_id) AS driver_count")->get();
       foreach($rows as $row) return $row->driver_count;
       return 0;
    }

    function getPayableVendors_table($arr,$ss){
       $branch_id = Sanitizer::sanitize($ss->branch_id);
       return $this->getPayableVendors_internal($arr,$branch_id,$ss);
    }

    function getPayableVendors_internal($arr,$branch_id){
        $branch_id = Sanitizer::sanitize($branch_id);
        $d = (object)$arr;
        $sender_id = isset($d->sender_id)?$d->sender_id:null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null;
        
        $str_dates ='';
        if((bool)strtotime($start_date) && (bool)strtotime($end_date)){
            $start_date = convertDate($start_date);
            $end_date = convertDate($end_date);
            $str_dates = ' AND (DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\')';
        }else{
            $days_ago =-31;
            if((bool)strtotime($start_date) && !(bool)strtotime($end_date))
            {
                $end_date = date('Y-m-d');
                $str_dates = ' AND ( DATE(p.arrival_time) >=\''.$start_date.'\' AND DATE(p.arrival_time) <=\''.$end_date.'\')'; 
            }
            else{
                $start_date = Carbon::now()->addDay($days_ago);
                $str_dates =' AND DATE(p.arrival_time) >=\''.$start_date.'\'';
            }
        }
      
        $str_sender = '';
        if($sender_id > 0) $str_sender =' AND sender_id ='.$sender_id;
        if(!$branch_id) $branch_id=0; 
        $sql ='SELECT DATE_FORMAT(p.arrival_time,\'%d %b %Y\') AS `date`, SUM(CASE lower(p.df_payer) WHEN \'sender\' THEN (IFNULL(p.delivery_fee,0) + IFNULL(p.base_fee,0)) ELSE 0 END) AS fees, SUM(IFNULL(p.forwarding_cost,0)) AS forwarding_cost, SUM(IFNULL(p.cod_fee,0)) AS cod_fee, SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS price, DATE(p.arrival_time) AS arrival_date, COUNT(p.id) AS package_count, s.name as sender_name,'. 
        "(SELECT CONCAT(acc.account_number,'|',acc.account_name,'|',acc.bank_name) as account_info ". 
        ' FROM sender_bank_accounts AS acc WHERE acc.is_primary =1 AND acc.sender_id = s.id LIMIT 1) AS account_info FROM package as p INNER JOIN sender AS s ON s.id = p.sender_id WHERE p.branch_id ='.$branch_id.' AND p.status_id =8 AND IFNULL(p.sender_pmt_status_id,0) =0 '
        .$str_dates.$str_sender. ' GROUP BY date,arrival_date, s.id, s.name ORDER BY arrival_date DESC';
        $rows = DB::select(DB::raw($sql));
        foreach($rows as $row){
           $row->cod_amount = $row->price - $row->cod_fee;
           $row->amount = $row->cod_amount - $row->fees - $row->forwarding_cost;
           $row->amount = number_format(floatval($row->amount),2,'.');
           $row->total_fees = $row->fees; //- $row->cod_fee;
           $row->total_fees = number_format(floatval($row->total_fees),2,'.');
           $sts = explode('|',$row->account_info?$row->account_info:'');

           $row->account_number = $sts[0];
           $row->account_name = isset($sts[1])?$sts[1]:'';
           $row->bank_name = isset($sts[2])?$sts[2]:'';
        }
        return (object)[
            'currency'=>'$', 
            'items'=>$rows,
            'period_name'=>'Since '.date('M d Y',strtotime($start_date))
        ];
     }
    
     //     function getPayableVendors_internal_paginate($branch_id){
    //         $branch_id = Sanitizer::sanitize($branch_id);
    //         $days_ago =-31;
    //         $start_date = Carbon::now()->addDay($days_ago);
    //         $sql ="SELECT DATE_FORMAT(p.arrival_time,'%d %b %Y') AS date, SUM(CASE lower(p.df_payer) WHEN 'sender' THEN (IFNULL(p.delivery_fee,0) + IFNULL(p.base_fee,0)) ELSE 0 END) AS fees, SUM(IFNULL(p.forwarding_cost,0)) AS forwarding_cost, SUM(IFNULL(p.cod_fee,0)) AS cod_fee, SUM(CASE p.cod WHEN 1 THEN IFNULL(p.price,0) ELSE 0 END) AS price, DATE(p.arrival_time) AS arrival_date, COUNT(p.id) AS package_count, s.name as sender_name, (SELECT CONCAT(acc.account_number,'|',acc.account_name,'|',acc.bank_name) as account_info FROM sender_bank_accounts AS acc WHERE acc.is_primary =1 AND acc.sender_id = s.id LIMIT 1) AS account_info FROM package as p INNER JOIN sender AS s ON s.id = p.sender_id WHERE p.branch_id ='$branch_id' AND p.status_id =8 AND p.arrival_time >='$start_date' AND IFNULL(p.sender_pmt_status_id,0) =0 GROUP BY date,arrival_date, s.id, s.name ORDER BY arrival_date DESC";
    //         $rows = DB::select(DB::raw($sql));
    //         $count=0;
    //         foreach($rows as $row){
    //            $row->cod_amount = $row->price - $row->cod_fee;
    //            $row->amount = $row->cod_amount - $row->fees - $row->forwarding_cost;
    //            $row->total_fees = $row->fees - $row->cod_fee;
    //            $sts = explode('|',$row->account_info?$row->account_info:'');
               
    //            $row->account_number = $sts[0];
    //            $row->account_name = isset($sts[1])?$sts[1]:'';
    //            $row->bank_name = isset($sts[2])?$sts[2]:'';

    //            $count++;
    //     }
    //     $rows = $query->skip($skip_rows)->take($per_page)->get();
    //     return new LengthAwarePaginator($rows, $count, $per_page, $current_page);

    //     return (object)[
    //         'currency'=>'$', 
    //         'items'=>new LengthAwarePaginator($rows, $count, $per_page, $current_page),
    //         'period_name'=>'Since '.date('M d Y',strtotime($start_date))
    //     ];
    //}
    
}