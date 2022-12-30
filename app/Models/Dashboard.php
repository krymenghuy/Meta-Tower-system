<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Session;
use Carbon\Carbon;
use App\Models\UM;
use DB;
class Dashboard extends Model
{
    use HasFactory;
     
    //return all data for whole databoard (Student Loan System)
    function getDashboardData($d){
        $ss = UM::getUserInfoByToken($d,500);
        if($ss->status_code !=200) return DV::emptyResult($ss->status_code,null);
        
        $branch_id = $ss->branch_id;
        $months_ago = -12;
        $start_date = Carbon::now()->addMonths($months_ago);  
        $start_date  = convertDate($start_date);
        //$cols = "l.id,l.status_id,l.code as loan_code, IFNULL(l.principal,0) AS principal, IFNULL(l.discount_principal,0) AS discount_principal,l.principal -  IFNULL(l.discount_principal,0) AS net_principal, IFNULL(l.penalty_fee,0) as penalty_fee, IFNULL(l.interest_paid,0) as interest_paid, l.principal_paid,IFNULL(interest_due,0) as interest_due, IFNULL(penalty_due,0) as penalty_due";
        //$rows = DB::table('loans as l')->join('persons as p','p.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->whereRaw("IFNULL(l.inactive,0) = 0 AND DATE(l.auth_date) >='$start_date'")->selectRaw($cols)->get();
        //$x = $this->getSummary_data($rows);

        $borrower_count =0;
        //$rows1 = DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->whereRaw("DATE(l.auth_date) >='$start_date'")->selectRaw("COUNT(DISTINCT l.borrower_id) as cnt")->get(); 
        //foreach($rows1 as $row) $borrower_count = $row->cnt;
        //$x->borrower_count = $borrower_count;

        $finished_loan_count =0;
        //$rows1 = DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->whereRaw("DATE(l.auth_date) >='$start_date' AND l.status_id =2")->selectRaw("COUNT(l.id) as cnt")->get(); 
        //foreach($rows1 as $row) $finished_loan_count = $row->cnt;
        //$x->finished_loan_count = $finished_loan_count;

        return (object)[
                'summary'=>(object)['borrower_count'=>0,'finished_loan_count'=>0],
                //'barchart_data'=>$this->getBarchart_data($branch_id),
                //'piechart_data'=>$this->getPiechart_data1($branch_id),
                //'table_data_monthly'=>$this->getTableData_monthly($branch_id),
                //'table_data_daily'=>$this->getTableData_apps($branch_id),
                //'table_data_apps'=>$this->getTableData_apps($branch_id)
        ];  
    } 

    //Get count, and total
    function getSummary_data($rows){
        $principal = 0;
        $principal_paid = 0;
        $discount_principal= 0;
        $interest_paid =0;
        $earnings =0;
        $total_penalty =0;
        $other_due = 0;

        foreach($rows as $row){
            $principal += $row->principal;
            $principal_paid += $row->principal_paid;
            $discount_principal += $row->discount_principal; 
            $interest_paid += $row->interest_paid;
            $total_penalty += $row->penalty_fee;
            $other_due += $row->interest_due + $row->penalty_due;
            $earnings += $row->interest_paid + $row->penalty_fee;
        }
       
        $paid_percent = 0;
        $net_principal =$principal - $discount_principal;
        $paid_percent = number_format($principal_paid *100 / $net_principal,2);
       return (object)[
           'principal'=>$principal,
           'discount_principal'=>number_format($discount_principal,2),
           'net_principal'=>$net_principal,
           'principal_paid_percent'=>$paid_percent,
           'principal_paid'=>number_format($principal_paid,2),
           'interest_paid'=>number_format($interest_paid,2),
           'earnings'=>number_format($earnings,2),
           'other_due'=>$other_due,
           'total_penalty'=>number_format($total_penalty,2),
           'card_period'=>'Since last 12 months',
           'currency'=>'USD'

       ];
    }   
   
    //return data for PolarArea chart or Pie chart
    function getPiechart_data1($branch_id){
        $sql ="SELECT COUNT(c.id) AS cnt, SUM(IFNULL(c.net_amount,0)) AS amount, c.pmt_method_id, m.`name` as pmt_method from loan_collections as c INNER JOIN custom_pipeline_stages AS m ON m.id = c.pmt_method_id WHERE IFNULL(c.inactive,0) = 0 AND c.branch_id ='$branch_id' AND c.pmt_type ='installment' GROUP BY pmt_method_id, m.name";
        $rows = DB::select(DB::raw($sql));
        $labels = [];
        $dataset1_counts = [];
        $dataset2_amounts = [];
        $back_colors_amounts = [];
        $back_colors_counts = []; 

        foreach($rows as $row){
          $labels[] = $row->pmt_method;
          $dataset1_counts[] = $row->cnt;
          $dataset1_amounts[] = $row->amount;
          $back_colors_amounts[] = $this->randomColour();
          $back_colors_counts[] = $this->randomColour();
        } 
       return (object)[
           'labels'=>$labels,
           'amounts'=>$dataset1_amounts,
           'counts'=>$dataset1_counts,
           'back_colors_amount'=>$back_colors_amounts,
           'back_colors_count'=>$back_colors_counts
       ];
    }

    //return data for PolarArea chart or Pie chart
    function getPiechart_data($branch_id){
        $sql ="SELECT COUNT(c.id) AS cnt, SUM(IFNULL(c.net_amount,0)) AS amount, c.pmt_method_id, m.`name` as pmt_method from loan_collections as c INNER JOIN pmt_methods AS m ON m.id = c.pmt_method_id WHERE IFNULL(c.inactive,0) = 0 AND c.branch_id ='$branch_id' AND c.pmt_type ='installment' GROUP BY pmt_method_id, m.name";
        $rows = DB::select(DB::raw($sql));
        $labels = [];
        $dataset1_counts = [];
        $dataset2_amounts = [];
        $back_colors_amounts = [];
        $back_colors_counts = []; 

        foreach($rows as $row){
          $labels[] = $row->pmt_method;
          $dataset1_counts[] = $row->cnt;
          $dataset1_amounts[] = $row->amount;
          $back_colors_amounts[] = $this->randomColour();
          $back_colors_counts[] = $this->randomColour();
        } 
       return (object)[
           'labels'=>$labels,
           'amounts'=>$dataset1_amounts,
           'counts'=>$dataset1_counts,
           'back_colors_amount'=>$back_colors_amounts,
           'back_colors_count'=>$back_colors_counts
       ];
    }

   function getDashboardData_barchart($d){
       $ss = UM::getUserInfoByToken($d,-1);
       if($ss->status_code !=200) return $ss;

        $branch_id = $ss->branch_id;
        return getBarchart_data($branch_id);
   }
 
   function getBarchart_data($branch_id){
    $back_months= -12;
    $start_date = convertDate(Carbon::now()->addMonths($back_months));

        $sql ="SELECT SUM(CASE lower(c.pmt_type) WHEN 'installment' THEN 1 ELSE 0  END) AS payer_count".
        ",SUM(IFNULL(c.principal_amount,0)) AS total_principal".
        ",SUM(IFNULL(c.interest_amount,0)) AS total_interest".
        ",SUM(IFNULL(c.interest_amount,0) + IFNULL(c.penalty_fee,0)) AS total_earnings".
        ",AVG(IFNULL(c.net_amount,0)) AS avg_amount".
        ",MONTH(c.payment_date) AS op_month 
        FROM `loan_collections` as `c` where IFNULL(c.inactive,0) =0 AND `c`.`branch_id` = '$branch_id' and DATE(c.payment_date) >='$start_date' GROUP BY op_month ORDER BY op_month";
        $rows = DB::select(DB::raw($sql));
        $months = [];
        $payer_counts = [];
        $principal_totals =[];
        $interest_totals =[];
        $earnings_totals =[];
        $average_amounts =[];

        $first_collected_amount = 0;
        $last_collected_amount =0;
        $change_in_collection =0;
        $i=0;
        foreach($rows as $row){
            $months[] = $this->getMonthName($row->op_month,false);
            $earnings = number_format($row->total_earnings,2);
            $earnings_totals[] =  $earnings;
            $principal_totals[] = $row->total_principal;
            $interest_totals[] = $row->total_interest;
            $payer_counts[] = $row->payer_count;

            if($i==0) $first_collected_amount = $row->total_principal + $row->total_interest;
            $last_collected_amount = $row->total_principal + $row->total_interest; 
            $i++;
        }
        $change_in_collection = 0;
        $first_collected_amount =(double)$first_collected_amount;
        if ($first_collected_amount ==0) $change_in_collection = $last_collected_amount; 
        else $change_in_collection =(abs($last_collected_amount) - abs($first_collected_amount)) *100/ $first_collected_amount;

        return (object)[
         'months'=>$months,   
         'payer_counts'=>$payer_counts,
         'earnings_totals'=>$earnings_totals,
         'principal_totals'=>$principal_totals,
         'interest_totals'=>$interest_totals,
         'change_in_collection'=>number_format($change_in_collection,2),
         'first_collected_amount'=>$first_collected_amount,
         'last_collected_amount'=>number_format($last_collected_amount,2),
         'change_info_text'=>"Since last $i months"
        ];
   }

   function getMonthName($num,$full_name=false){
    switch($num){
        case 1:{
            return 'Jan';
        }
        case 2:{
            return 'Feb';
        }
        case 3:{
         return 'Mar';
     }
     case 4:{
         return 'Apr';
     }
     case 5:{
         return 'May';
     }
     case 6:{
         return 'Jun';
     }
     case 7:{
         return 'Jul';
     }
     case 8:{
         return 'Aug';
     }
     case 9:{
         return 'Sep';
     } 
     case 10:{
         return 'Oct';
     }
     case 11:{
         return 'Nov';
     }
     case 12:{
         return 'Dec';
     }
    }
 }

  //return formatted data fit for Donut chart / Pie chart
  /***
    % of each "failed" reason  
  ***/
  function getDashboardData_piechart($d){
    $ss = UM::getUserInfoByToken($d,-1);
    if($ss->status_code !=200) return $ss;
     if (!prn_allowed(-1)) return '@'; //need permission to do this task
     $branch_id = $ss->branch_id;

     $back_days = -90;
     $start_date = convertDate(Carbon::now()->addDays($back_days));
     $rows = DB::table('package AS p')->where('p.branch_id',$branch_id)->whereRaw("DATE(p.create_date)>='$start_date'")->selectRaw("COUNT(p.id) AS cnt,p.sender_id")->groupByRaw('p.sender_id')->get();
     
     $cats = $this->processMerchantCategories($rows);

     $labels = [];
     $values = [];
     $colors = [];
     $g = 99;
     $b = 132;
     $i = 0;
     foreach($cats as $cat) {
       $labels[] = $cat->category;
       $values[] = $cat->count;
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

  foreach($rows as $row){
     if($row->cnt >= 70) 
     {
         $cat_count_a++;  
     } else if ($row->cnt >=35){
         $cat_count_b++;
     }else if($row->cnt >= 10)
     {
         $cat_count_c++;
     }else if($row->cnt > 0) {
         $cat_count_d++;
     } else{
         $cat_count_e++;
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

//return monthly summary payments
function getTableData_monthly($branch_id){
    $start_date = carbon::now()->addMonths(-12);
    $start_date = convertDate($start_date);

    $sql ="SELECT '$' as currency, YEAR(c.payment_date) AS op_year, MONTH(c.payment_date) AS op_month, COUNT(c.id) AS  pmt_count,
    SUM(IFNULL(c.principal_amount,0)) AS principal_amount,
    SUM(IFNULL(c.interest_amount,0)) AS interest_amount,
    SUM(IFNULL(c.net_amount,0)) AS amount,
    SUM(IFNULL(c.penalty_fee,0)) AS penalty_fee
    FROM loan_collections AS c INNER JOIN pmt_methods AS m ON m.id = c.pmt_method_id WHERE c.branch_id ='$branch_id' AND IFNULL(c.inactive,0) =0 AND DATE(c.payment_date) >='$start_date' GROUP BY op_year, op_month ORDER BY op_year DESC, op_month DESC";
    //$sql ="SELECT COUNT(p.id) AS package_count,SUM(p.base_fee + p.delivery_fee + p.cod_fee) AS total_fees, SUM(IFNULL(p.price,0)) AS total_price, SUM(IFNULL(p.cod_fee,0)) AS total_cod_fee, DATE(p.arrival_time) AS arrival_date FROM package AS p WHERE p.branch_id ='$branch_id' AND p.status_id =8 GROUP BY arrival_date";

   $rows = DB::select(DB::raw($sql));
   $prev_amt = null;
   $i = 0;
   foreach($rows as $row){
        $increase_percent =0;
        if ($i>0){
            if ($row->amount>0){
                $increase_percent =  number_format(($prev_amt - $row->amount)*100/$row->amount,2);    
            }else if($row->amount == 0) $increase_percent =100;
            $rows[$i-1]->increase_percent = $increase_percent;
        }
    
        $row->month_name = $this->getMonthName($row->op_month).", $row->op_year"; 
        $prev_amt = $row->amount;
        $i++;
   }
   $rows[$i-1]->increase_percent =0;
   return $rows;
}

function getTableData_apps($branch_id){
    $cols ="a.id,a.person_id,DATE_FORMAT(a.create_date,'%d %b %Y') AS create_date, a.create_date AS create_date1,a.request_amount AS principal,a.monthly_interest_rate, CONCAT(p.last_name,' ',p.first_name) AS name,p.sex,p.phone_number,a.status_id, CASE a.status_id WHEN 1 THEN 'Pending' WHEN 2 THEN 'Approved' ELSE 'Disbursed' END AS status";
    $rows = DB::table('loan_applications as a')->join('persons as p','p.id','=','a.person_id')->join('student_details as d','d.person_id','=','p.id')->where('a.branch_id',$branch_id)->whereRaw('IFNULL(a.inactive,0) = 0 AND (a.status_id =1 OR a.status_id =2)')->selectRaw($cols)->orderByRaw('create_date1 DESC')->get();
    return $rows;
}  

function getTableData_daily($branch_id){    
    $month = date('m');
    $day = date('d');
    $year = date('Y');
    $start_date ="$year-$month-01";
    $end_date = date('Y-m-d');

    $sql ="SELECT DATE_FORMAT(c.payment_date,'%d %b') AS payment_date,c.payment_date AS payment_date1,
    m.name as pmt_method,
    l.code as loan_code,
    IFNULL(c.interest_amount,0) AS interest_amount,
    IFNULL(c.principal_amount,0) AS principal_amount,
    IFNULL(c.discount_percent,0) AS discount_percent,
    IFNULL(c.net_amount,0) AS net_amount,
    IFNULL(c.penalty_fee,0) AS penalty_fee,
    CONCAT(b.last_name,' ',b.first_name) as borrower_name,
    b.phone_number
    FROM loan_collections AS c INNER JOIN loans as l ON l.id = c.loan_id INNER JOIN pmt_methods AS m ON m.id = c.pmt_method_id INNER JOIN persons AS b ON b.id = l.borrower_id WHERE c.branch_id ='$branch_id' AND IFNULL(c.inactive,0) =0 AND c.pmt_type ='installment' AND DATE(c.payment_date) >='$start_date' AND DATE(c.payment_date) <='$end_date' ORDER BY payment_date1 DESC LIMIT 12";
    //$sql ="SELECT COUNT(p.id) AS package_count,SUM(p.base_fee + p.delivery_fee + p.cod_fee) AS total_fees, SUM(IFNULL(p.price,0)) AS total_price, SUM(IFNULL(p.cod_fee,0)) AS total_cod_fee, DATE(p.arrival_time) AS arrival_date FROM package AS p WHERE p.branch_id ='$branch_id' AND p.status_id =8 GROUP BY arrival_date";

    return DB::select(DB::raw($sql));
 
}
 
    
}
