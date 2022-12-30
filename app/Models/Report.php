<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\CompanyProfile;
use Session;
use DB;

class Report extends Model
{
    use HasFactory;
    protected $companyModel;
    
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->companyModel = new CompanyProfile();
    }

     
    function getBranchInfo($branch_id=0){ 
         $rows = DB::table('um_branches AS b')->where('b.branch_id',$branch_id)->selectRaw("b.branch_id,b.logo_file_name,b.name, b.name_kh,b.address,b.address_kh,b.phone_number,b.first_cp_name,b.first_cp_phone,b.website")->limit(1)->get();
         foreach($rows as $row) {
             $user_class="general";
             $category="image";
             $dir = PublicStorage::getUrl($branch_id,$user_class,$category);
             $row->logo_url =  $dir.$row->logo_file_name;
             return $row;
         } 
         return (object)array("name"=>'(Company Name)','phone_number'=>'(Unvailaible phone)','website'=>'Unvailable');
    }
 
    function getScalarData_loan($loan_app_id=0,$loan_id=0){
        return (object)[
          'guarantor_name'=>'Mr.Guarntor',
          'guarantor_address'=>'BKK1',
          'guarantor_phone'=>'0124564565',
          'collateral_description'=>'iWatch a great one',
        ];

        // $table="collaterals as c";
        // $str_id="1=2";
        // if($loan_app_id>0){
        //     {
        //       $str_id ="c.loan_app_id = $loan_app_id";
        //       $table ="collaterals as c";
        //     }
        //  }else {
        //      $str_id ="c.loan_id =$loan_id";
        //      $table ="collaterals as c";
        //  }
        // $rows = DB::table($table)->whereRaw($str_id)->selectRaw("c.id,(select name from collateral_types where id = c.collateral_type_id LIMIT 1) AS collateral_type,c.description,c.estimated_value,c.identification_number,c.owner_name,Date_format(c.expiration_date,'%d %b %Y') as expiration_date")->get(); 
        // foreach($rows as $row) return $row;
    }

    function getPawnContract($loan_app_id=0,$loan_id=0){
        $branch_id = Session('branch_id',0);
        $str_id ="1=2";
        $table ="loans as l";
        $select_contract_number =",'NA' AS contract_number";
        $select_maturity_date =",'' As maturity_date";
        if($loan_app_id>0){
           {
            $str_id ="l.id = $loan_app_id";
            $table ="loan_applications as l";
           }
        }else {
            $str_id ="l.id =$loan_id";
            $table ="loans as l";
            $select_contract_number =",l.code as contract_number";
            $select_maturity_date = ",date_format(l.maturity_date,'%d-%b-%Y') As maturity_date";
        }
        $res = $this->getScalarData_loan($loan_app_id=0,$loan_id=0);
        $guarantor_name =$res->guarantor_name;
        $guarantor_address =$res->guarantor_address;
        $collateral_des=$res->collateral_description;

        //borrower_phone, expiration date, interest_rate
        $select_cols ="p.national_id as borrower_nid, CONCAT(p.last_name,' ',p.first_name) as borrower_name,p.sex,p.address as borrower_address, p.phone_number as borrower_phone,
        l.id,l.code$select_contract_number,getCurSymbol(l.currency_code,'$') as cur_symbol,l.currency_code,l.loan_type_id, '$guarantor_name' AS guarantor_name, '$guarantor_address' AS guarantor_address, '$collateral_des' AS collateral_description, l.principal,l.loan_tenure,l.loan_tenure_unit,l.compound_cycle,l.period_interest_rate,l.payback_method_id, (Select name from payback_options where id = l.payback_method_id LIMIT 1) AS payback_method,date_format(l.start_date,'%d-%b-%Y') As start_date, date_format(l.first_pmt_date,'%d-%b-%Y') As first_pmt_date,date_format(l.maturity_date,'%d-%b-%Y') As maturity_date$select_maturity_date";        
        $rows = DB::table($table)->join('persons as p','p.id','=','l.borrower_id')->whereRaw($str_id)->where('l.branch_id',$branch_id)->selectRaw($select_cols)->take(1)->get();
        foreach($rows as $row) return $row;

        return (object)[
            'cur_symbol'=>'$',
            'contract_number'=>'102567',
            'start_date'=>'02-Nov-2022',
            'maturity_date'=>'02-Dec-2022',
            'principal'=>2500,
            'loan_tenure'=>0,
            'loan_tenure_unit'=>'months',
            'period_interest_rate'=>'1.5',
            'compound_cycle'=>'monthly',
            'payback_method'=>'',
            'borrower_name'=>'some one there',
            'borrower_phone'=>'02464565',
            'borrower_address'=>'dfdfgfdg',
            'borrower_nid'=>'023345345',
            'collateral_description'=>'This is desc about collateral',
            "guarantor_address"=>"addrsss of guarantor",
            "guarantor_name"=>"Mr. Guarantor", 
         ];
    }

    function getDays($compound_cycle){
     switch($compound_cycle){
        case 'monthly':{
            return 30;
        }case 'day':{
            return 1;
        }
        case 'week':{
            return 7;
        }
        default:
        return 30;
     }
    }

    //$d = ['principal','number_of_periods','compound_cycle','period_interest_rate','start_date','first_pmt_date','currency_code']
    function getLoanSchedule_anuity($d){
        $loan_app_id = isset($d['loan_app_id'])?$d['loan_app_id']:null;
        $loan_id = isset($d['loan_id'])?$d['loan_id']:null;

        $principal = $d['principal'];
        $number_of_periods = $d['loan_tenure']; //loan_tenure // number of days, weeks, or months
        $tenure_unit = $d['loan_tenure_unit'];
        $compound_cycle = isset($d['compound_cycle'])?$d['compound_cycle']:'monthly';
        $period_interest_rate = isset($d['period_interest_rate'])?$d['period_interest_rate']:0;
        $start_date=isset($d['start_date'])?convertDate($d['start_date']):date('Y-m-d');
        $first_pmt_date=isset($d['first_pmt_date'])?convertDate($d['first_pmt_date']):null;
        $currency_code =isset($d['currency_code'])?$d['currency_code']:'USD';
        $currency_symbol = ($currency_code ==='USD')?'$':'KHR';
        
        $items =[];
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        $cur_symbol =$currency_code =='USD'?'$':'KHR';
        $period_interest_rate = $period_interest_rate/100;
        $pmt_amount = 0 ; //$principal * $period_interest_rate/ (1- pow(1+$period_interest_rate,-$number_of_periods));
        $n = 0;
       
        $days = $this->getDays($compound_cycle);
        if (!(bool)strtotime($first_pmt_date)) $first_pmt_date= dateAdd('day',$days,$start_date);
        $first_days = dateDiff_days($start_date,$first_pmt_date);
        $payment_date = date('d-M-Y',strtotime($first_pmt_date));
 
        $special_start = 0;
        if ($first_days < $days)
            {
                $period_num =$number_of_periods-1;
                if ($period_num<0) $period_num =0;
                $pmt_amount = $principal * $period_interest_rate/ (1- pow(1+$period_interest_rate,- $period_num));

                $first_amount = $principal * $period_interest_rate * $first_days/ $days; 
                $special_start =1;
            }
        else{
            $pmt_amount = $principal * $period_interest_rate/ (1- pow(1+$period_interest_rate,-$number_of_periods));
            $first_amount = $pmt_amount;
        }

        $remain_principal = $principal;
        
        do{
            $n++;
            $princ_pmt = 0;
            $amount =0;
            $interest = 0;
            if ($n===1 && $special_start===1){
                $amount = $first_amount;
                $interest = $first_amount;
                $princ_pmt = 0;
            }else{
                $amount =  $pmt_amount;
                $interest = $remain_principal * $period_interest_rate;
                $princ_pmt = $pmt_amount - $interest;
                $remain_principal -= $princ_pmt;   
            }
           
            $item = [
                'currency_code'=>$currency_code,
                'currency_symbol'=>$currency_symbol,
                'payment_date'=>$payment_date,
                'principal'=>ROUND($princ_pmt,2),
                'interest'=>$interest,
                'amount'=>$amount,
                'remaining_principal'=>$remain_principal,
                'remarks'=>''
            ];
            $items[] = (object)$item;
            $payment_date =dateAdd('day',$days,$payment_date,'d-M-Y');
           
        }while($n<$number_of_periods);

        $d['start_date'] = $start_date;
        $d['first_pmt_date'] = $first_pmt_date;

        //get additional loan details:
        $this->setLoanDetails($d,$loan_app_id,$loan_id);         
        $d['payments']= $items;
        return (object)$d;
    }
    
    function setLoanDetails(&$d,$loan_app_id=null,$loan_id=null){
        $branch_id = Session('branch_id',0);
        $table ="loan_applications as l";
        $select_contract_number =",'NA' AS contract_number"; //In case of "loan application", => $select_contract_number ="";

       $str_id ="1=2";
       if($loan_app_id){
         $str_id ="l.id =$loan_app_id";
         $table ="loan_applications as l";
       }
       else if($loan_id > 0) {
        $str_id="l.id =$loan_id";
        $table ="loans as l";
        $select_contract_number =",l.code as contract_number";
      }

       $rows = DB::table($table)->join('persons as p','p.id','l.borrower_id')->whereRaw($str_id)->where('l.branch_id',$branch_id)->selectRaw("l.id,l.code$select_contract_number, getCurSymbol(l.currency_code,'$') AS cur_symbol, CONCAT(p.last_name,' ',p.first_name) as borrower_name, p.sex, p.phone_number as borrower_phone,p.address as borrower_address,p.national_id,p.email,l.principal,l.period_interest_rate,l.compound_cycle,l.loan_tenure,l.loan_tenure_unit,l.payback_method_id, (select name from payback_options where id =l.payback_method_id LIMIT 1) as payback_method,l.remarks")->take(1)->get();    
       foreach($rows as $row){
         foreach($row as $col=>$value) $d[$col] = $value;
         return $d;
       }

        if (!isset($d['borrower_name'])) $d['borrower_name'] = "NA";
        $d['borrower_phone']= isset($d['borrower_phone'])?$d['borrower_phone']:'NA';
        $d['borrower_address'] = isset($d['borrower_address'])?$d['borrower_address']:'NA';
        $d['payback_method'] = isset($d['payback_method'])?$d['payback_method']:'NA';

        $d['period_interest_rate'] = isset($d['period_interest_rate'])?$d['period_interest_rate']:'0';
        $d['loan_tenure'] = isset($d['loan_tenure'])?$d['loan_tenure']:'0';
        $d['loan_tenure_unit'] = isset($d['loan_tenure_unit'])?$d['loan_tenure_unit']:'0';
        $d['cur_symbol'] =isset($d['cur_symbol'])?$d['cur_symbol']:'$';  
        $d['contract_number'] = isset($d['contract_number'])?$d['contract_number']:'NA';
        $d['code']=isset($d['code'])?$d['code']:'NA';
        $d['remarks']=isset($d['remarks'])?$d['remarks']:'NA';
        return $d;
    }

    //pay only interest, and pay (interest _ principal) at last
    function getLoanSchedule_balloon($d){
        $loan_app_id = isset($d['loan_app_id'])?$d['loan_app_id']:null;
        $loan_id = isset($d['loan_id'])?$d['loan_id']:null;

        $principal = $d['principal'];
        $number_of_periods = $d['loan_tenure']; //loan_tenure
        $tenure_unit = $d['loan_tenure_unit'];
        $compound_cycle = isset($d['compound_cycle'])?$d['compound_cycle']:'unknown';
        $period_interest_rate = isset($d['period_interest_rate'])?$d['period_interest_rate']:0;
        $start_date=isset($d['start_date'])?convertDate($d['start_date']):date('Y-m-d');
        $first_pmt_date=isset($d['first_pmt_date'])?convertDate($d['first_pmt_date']):null;
        $currency_code =isset($d['currency_code'])?$d['currency_code']:'USD';
        $currency_symbol = ($currency_code ==='USD')?'$':'KHR';

        $items =[];
        if (!(bool)strtotime($start_date)) $start_date = date('Y-m-d');
        $cur_symbol =$currency_code =='USD'?'$':'KHR';
        $period_interest_rate = $period_interest_rate/100;
        $pmt_amount = $principal * $period_interest_rate;  
        $n = 0;
       
        $days = $this->getDays($compound_cycle);
        if (!(bool)strtotime($first_pmt_date)) $first_pmt_date= dateAdd('day',$days,$start_date);
        $first_days = dateDiff_days($start_date,$first_pmt_date);
        $special_start = 0;
        if ($first_days < $days){
            $first_amount = $pmt_amount *  $first_days/ $days;
            $special_start =1;
        }
        $payment_date = date('d-M-Y',strtotime($first_pmt_date));
        $remain_principal = $principal;
        do{
            $n++;
            $princ_pmt = 0;
            $amount =0;
            $interest =0;

            $interest = $pmt_amount;
            if ($n===1 && $special_start===1){
               $interest =  $first_amount;
               $princ_pmt = 0;
               $remain_principal -= $princ_pmt;   
            }

            if($n < $number_of_periods) {
                $amount = $interest; //Purely interest
                $princ_pmt =0;
                $remain_principal = $principal;
            }else{
                //last payment = Interest + principal
                $princ_pmt =$principal;
                $amount = $interest + $principal;
                $remain_principal -= $princ_pmt;
            }
             
            $item = [
                'currency_code'=>$currency_code,
                'currency_symbol'=>$currency_symbol,
                'payment_date'=>$payment_date,
                'principal'=>$princ_pmt,
                'interest'=>$interest,
                'amount'=>$amount,
                'remaining_principal'=>$remain_principal,
                'remarks'=>''
            ];
            $items[] = (object)$item;
            $payment_date =dateAdd('day',$days,$payment_date,'d-M-Y');
          
        }while($n<$number_of_periods);

        $d['start_date'] = $start_date;
        $d['first_pmt_date'] = $first_pmt_date;
        $this->setLoanDetails($d,$loan_app_id,$loan_id);         
        $d['payments']= $items;
        return (object)$d;
    }

    function getLoanList($start_date,$end_date, $user_all_dates){
        $branch_id =Session::get('branch_id',0);
        $more_wheres = "1=1";
         
        $start_date = convertDate($start_date);
        $end_date = convertDate($end_date);
        if(($user_all_dates==0 || !$user_all_dates) && ($start_date && $end_date)){
            $more_wheres ="DATE(l.create_date) >='$start_date' AND DATE(l.create_date) <='$end_date'";
        } 
        $cols ="l.id,l.code as loan_code,date_format(l.create_date,'%d %b %Y') AS disburse_date,l.principal,l.principal - IFNULL(l.discount_principal,0) as net_principal,IFNULL(l.discount_principal,0) AS discount_principal, l.monthly_interest_rate,l.principal_paid,l.penalty_fee, l.discount_amount,l.interest_paid,l.create_user as disbursed_by, NULL as remarks,
        l.student_code, CONCAT(b.last_name,' ',b.first_name) as borrower_name,b.sex,b.phone_number,b.email,b.address,
        p.name as program_name,p.major_name";
        $rows = Db::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->join('academic_programs as p','p.id','=','l.program_id')->where('l.branch_id',$branch_id)->whereRaw('IFNULL(l.inactive,0) =0')->whereRaw('(l.status_id =1 OR l.status_id =3)')->whereRaw($more_wheres)->selectRaw($cols)->orderByRaw('l.create_date DESC')->get(); 
        return $rows;
    } 
   
}
