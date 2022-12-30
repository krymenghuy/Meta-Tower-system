<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\DV;
use DB;
use Mail;
use Carbon\Carbon;

class Loan extends Model
{
    use HasFactory;

    static function person_id($loan_app_id){
        $rows = DB::table('loan_applications as a')->where('a.id',$loan_app_id)->selectRaw("a.person_id")->limit(1)->get();
        foreach($rows as $row) return $row->person_id;
        return null; 
     }
 
    // function saveLoanInfo($d){
    //     $ss = getSessionInfo($d);
    //     if(!$ss) return '#350'; //user not authenticated
    //     if (!prn_allowed(2)) return '@'; //need permission to do this task
    //     $branch_id = $ss->branch_id;
    // }

       //set_loan_app_code()
       static function set_loan_code($ss,$loan_id){
        $branch_id = $ss->branch_id;
        $rows = DB::table("loan_code_control")->where('branch_id',$ss->branch_id)->selectRaw("last_id,prefix")->limit(1)->get();
        $next_num = 0;
        $prefix=null;
        foreach($rows as $row){
          $next_num = $row->last_id;
          $prefix =$row->prefix;
        }
        $next_num++;
        $new_code = $prefix.$branch_id.formatNumber($next_num,5); 
        $cnt = DB::table('loans')->where('id',$loan_id)->update(array('code'=>$new_code));
        //if($cnt<=0){
           $m = DB::table('loan_code_control AS c')->where('c.branch_id',$branch_id)->update(array('last_id'=>$next_num));
           if($m<=0) DB::table('loan_code_control')->insert(array('branch_id'=>$branch_id,'prefix'=>NULL,'last_id'=>$next_num));
        //} 
        //return $prefix.$branch_id.formatNumber(1,$len);
        return null;
    }

    function getLoanInfo($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;
        $cur = "$";
        $rows =DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->join('loan_types as t','t.id','=','l.loan_type_id')->where('l.branch_id',$branch_id)->where('l.id',$loan_id)->selectRaw("'$cur' AS currency, l.id,l.code as loan_code,(SELECT student_code FROM student_details WHERE person_id = l.borrower_id LIMIT 1) AS student_code,t.name as loan_type,l.minimum_installment,l.monthly_interest_rate, IFNULL(l.principal,0) - IFNULL(l.discount_principal,0) AS net_principal, IFNULL(l.principal,0) as principal, IFNULL(l.discount_principal,0) AS discount_principal, IFNULL(l.principal_paid,0) AS principal_paid,l.period_months,DATE_FORMAT(l.effective_date,'%d %b %Y') AS effective_date,DATE_FORMAT(l.first_pmt_date,'%d %b %Y') AS first_pmt_date,CONCAT(b.last_name,' ',b.first_name) as borrower_name,b.phone_number AS borrower_phone,b.email,b.sex,b.n_id, IFNULL(l.principal,0) - IFNULL(l.discount_principal,0) - IFNULL(l.principal_paid,0) AS outstanding_principal, IFNULL(l.discount_amount,0) AS discount_amount, IFNULL(l.interest_paid,0) AS interest_paid, IFNULL(l.penalty_fee,0) AS penalty_fee, l.interest_due,l.penalty_due, IFNULL(l.interest_due,0) + IFNULL(l.penalty_due,0) AS other_due")->limit(1)->get(); 
        foreach($rows as $row) return $row;
        return null; 
    }
 
    function temp_principal_paid(){
      $rows = DB::table('loans as l')->selectRaw("l.id, l.principal")->get();
      foreach($rows as $row){
           $rs = DB::table('loan_collections as c')->where('loan_id',$row->id)->selectRaw("sum(IFNULL(principal_amount,0)) AS principal_total, SUM(IFNULL(penalty_fee,0)) AS penalty_fee, SUM(IFNULL(interest_amount,0)) AS interest_paid ")->get();
           foreach($rs as $r) DB::table('loans')->where('id',$row->id)->update([
               'principal_paid'=>$r->principal_total,
               'interest_paid'=>$r->interest_paid,
               'penalty_fee'=>$r->penalty_fee,
            ]);
        }
        return null;
    }

    function getUserId($login_name){
        $rows= DB::table('um_users as u')->where('login_name',$login_name)->selectRaw('id')->limit(1)->get();
        foreach($rows as $row) return $row->id;
        return null;
    }

    function temp_create_logins($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(100)) return DV::error('No access to User Management');
        $branch_id = $ss->branch_id;
        //$password = $d->password;

        $rows = DB::table('persons AS p')->join('student_details as st','st.person_id','=','p.id')->where('p.branch_id',$branch_id)->selectRaw("p.id as person_id, CONCAT(p.last_name,' ',p.first_name) AS name, st.student_code, p.email,p.phone_number")->get();
       
        $app_id = getAdminAppId();
        $success_count =0;
        foreach($rows as $row){
            $password = $row->student_code; 
            $hpwd = PASSWORD_HASH($password,PASSWORD_DEFAULT);
            $id = $this->getUserId($row->student_code);
            if($id > 0){
               DB::table('um_users')->where('id',$id)->delete();
               DB::table('um_user_roles')->where('user_id',$id);
            }
             
                DB::table('um_users')->insert([
                    'branch_id'=>$branch_id,
                    'app_id'=>$app_id,
                    'user_class'=>'Borrower',
                    'login_name'=>$row->student_code,
                    'email'=>$row->email,
                    'phone_number'=>$row->phone_number,
                    'full_name'=>$row->name,
                    'official_id'=>$row->person_id,
                    'official_code'=>$row->student_code,
                    'create_user'=>'admin@gmail.com',
                    'create_date'=>getNowTime(),
                    'single_role_name'=>'Borrower',
                    'hpwd'=>$hpwd,
                ]);

                $user_id =DB::getPdo()->lastInsertId();
                   if($user_id >0){
                    DB::table('um_user_roles')->insert([
                        'branch_id'=>$branch_id,
                        'app_id'=>$app_id,
                        'user_id'=>$user_id,
                        'role_id'=>3
                    ]);

                   $success_count++;
                }
            
            
        }
        return DV::success(['success_count'=>$success_count]);
    }

    // function temp_pmts(){
    //     $rows = DB::table('loan_collections as c')->join('loans as l','l.id','=','c.loan_id')->selectRaw("l.id as loan_id,c.id,l.principal,c.payment_date, c.amount")->get();
        
    //     foreach($rows as $row){
    //          $pmt_date = $row->payment_date; 
    //          $rs = DB::table('loan_collections as c')->where('loan_id',$row->id)->whereRaw("c.payment_date <='$pmt_date'")->selectRaw("sum(IFNULL(principal_amount,0)) AS total")->get();
             
    //          foreach($rs as $r) {
    //              $os_amount = $row->principal - $r->total;
    //              DB::table('loan_collections')->where('id',$row->id)->update([
    //              'outstanding_principal'=>$os_amount
    //             ]);
    //         }
    //       }
    //       return null;
    // }

    function getLoanList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,202)) return DV::error('No access to Active Loans module');
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $more_where ="1=1";
        if($search_value){
            $like_name = escape_like_str($search_value);
            $more_where ="(p.n_id = '$search_value' OR l.`code` ='$search_value' OR CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%' OR p.phone_number ='$search_value' OR l.student_code ='$search_value')";
        }
        //$this->temp_principal_paid();
         
        $cols = "l.id,l.`code`,l.borrower_id,DATE_FORMAT(l.effective_date,'%d %b %Y') AS effective_date,IFNULL(l.principal,0) - IFNULL(l.discount_principal,0) as net_principal, l.principal, l.discount_principal,l.principal_discount_percent, l.monthly_interest_rate,l.period_months,l.minimum_installment,IFNULL(l.principal_paid,0) as principal_paid, IFNULL(l.interest_paid,0) as interest_paid,IFNULL(l.interest_due,0) as interest_due, l.create_user,l.create_date,l.auth_user,l.auth_date,l.status_id,ss.name AS status,monthly_interest_rate
        ,l.student_code, CONCAT(p.last_name,' ',p.first_name) As borrower_name,p.phone_number,p.phone_number1,p.n_id";
        $rows = DB::table('loans as l')->join('persons as p','p.id','=','l.borrower_id')->join('loan_statuses AS ss','ss.id','=','l.status_id')->where('l.branch_id',$branch_id)->whereRaw($more_where)->where('inactive',0)->where('l.status_id',1)->selectRaw($cols)->orderByRaw("create_date DESC")->get();
        return $rows;
    } 

    //$d = {'amount','remarks'}
    //NOTE: discountPrincipal() will payOff loan when the the discount_principal causes the outstanding_principal to be zero, regardless of remaining interest_due + penalty_due
    function discountPrincipal($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(211,0)) return DV::error('Permission 211 is required');
        $branch_id = $ss->branch_id;
        $loan_id = $d->loan_id;
        $amount = isset($d->amount)?$d->amount:0;
        $remarks = isset($d->remarks)?$d->remarks:null;

        $loan = $this->getLoanProps($branch_id,$loan_id,"IFNULL(l.discount_principal,0) as discount_principal, IFNULL(l.principal,0) as principal, IFNULL(penalty_due,0) as penalty_due, IFNULL(interest_due,0) AS interest_due, IFNULL(l.principal,0) - IFNULL(l.discount_principal,0) as net_principal, IFNULL(l.principal_paid,0) as principal_paid,monthly_interest_rate",'id');
        //$this->updateLoanData();
        if(!$loan) return DV::error('Loan identity is not valid');
        if ($loan->net_principal < $amount) return DV::error('Principal discount amount cannot exceeds the amount of orginial principal!'); 
        
        $accu_discount_principal = $loan->discount_principal + $amount;
        $status_id =1;
        $diff_amount = 0;

        $inputs = [
            'discount_principal'=>$accu_discount_principal,
            //'diff_amount' => $diff_amount,
            //'status_id'=>$status_id,
            'update_user'=>$ss->login_name,
            'update_date'=>getNowTime()
        ];
        
        if($remarks) $inputs['remarks'] =$remarks;
        //If no more remaining Principal => Assume that it is Payoff transaction => then force Loan's status to "Finished (2)"
        //todo: Now we assume that net_principal - principal_paid - accu_discount_principal <=0 => the loan is finished or Paid Off
        if ($loan->net_principal - $loan->principal_paid - $accu_discount_principal <= 0){
            $status_id =2;
            //amount that is considered as loss or uncollectible due to Discount in Principal
            //This amount must be negative to show that is is a loss, not gain
            //$diff_amount = -$amount; 
            //**  NOTE: column loans.diff_amount is no longer used. It is not relevant **/
            //$diff_amount = -$amount - $loan->penalty_due - $loan->interest_due;
            //$inputs['diff_amount'] = $diff_amount;
            $inputs['status_id'] = $status_id;
        }
        DB::table('loans')->where('branch_id',$branch_id)->where('id',$loan_id)->update($inputs);

        $event_name ="Principal discount";
        if($status_id ===2) $event_name ="Principal discount and Payoff";
        $this->trackLoanStatus($ss,$loan_id,$status_id,$event_name,null,$remarks); 
       return DV::success(['status_id'=>$status_id,'amount'=>$amount,'loan_id'=>$loan_id,'principal'=>($loan->net_principal-$amount),'diff_amount'=>$diff_amount,'monthly_interest_rate'=>$loan->monthly_interest_rate,'principal_paid'=>$loan->principal_paid]);
    }

    function getFinishedLoanList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,204)) return []; //DV::error('No access to Finished Loan module');
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $more_where ="1=1";
        if($search_value){
            $like_name = escape_like_str($search_value);
            $more_where ="(p.n_id = '$search_value' OR l.`code` ='$search_value' OR CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%' OR p.phone_number ='$search_value' OR l.student_code ='$search_value')";
        }

        $cols = "l.id,l.`code`,DATE_FORMAT(l.finish_date,'%d %b %Y') AS finish_date, l.borrower_id,l.principal,l.effective_date,l.principal_paid,l.principal -IFNULL(l.discount_principal,0) as net_principal,IFNULL(l.discount_principal,0) as discount_principal,l.principal_discount_percent, l.monthly_interest_rate,l.period_months,l.minimum_installment,IFNULL(l.interest_paid,0) as interest_paid,l.create_user,l.create_date,l.auth_user,l.auth_date,ss.name AS status,l.remarks
        ,l.student_code,ac.name as program_name, ac.major_name,
        CONCAT(p.last_name,' ',p.first_name) As borrower_name,p.phone_number,p.phone_number1,p.n_id";
        $rows = DB::table('loans as l')->join('persons as p','p.id','=','l.borrower_id')->join('academic_programs as ac','ac.id','=','l.program_id')->join('loan_statuses AS ss','ss.id','=','l.status_id')->where('l.branch_id',$branch_id)->whereRaw($more_where)->whereRaw('IFNULL(l.inactive,0) =0')->where('status_id',2)->selectRaw($cols)->orderByRaw('l.create_date DESC')->get();
        return $rows;
    } 

    //getBorrowerDetails_student() | returns student borrower's details
    function getBorrowerDetails($branch_id,$person_id){
        // $ss = getSessionInfo($d);
        // if(!$ss) return '#350'; //user not authenticated
        // if (!prn_allowed(2)) return '@'; //need permission to do this task
        // $branch_id = $ss->branch_id;
        // $person_id = isset($d->person_id)?$d->person_id:null;
        $rows = DB::table('persons as p')->join('student_details as st','st.person_id','=','p.id')->join('academic_programs AS ac','ac.id','st.program_id')->where('p.branch_id',$branch_id)->where('p.id',$person_id)->selectRaw("p.id,CONCAT(p.last_name,' ',p.first_name) AS name, p.sex,p.date_of_birth,p.occupation_id,p.occupation,p.email,p.phone_number,p.address,p.n_id, st.student_code, st.program_id, st.cgpa,ac.major_name")->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    //return initial data for "Disburse Loan" screen
    //returns object {'borrower_data','loan_data'}
    function getLoanAppInfo_disburse($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@';
        $branch_id = $ss->branch_id;
        $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
        $person_id = isset($d->person_id)? $d->person_id:null;
        if(empty($person_id)) $person_id = self::person_id($loan_app_id);
        
        $borrower_data = $this->getBorrowerDetails($branch_id,$person_id);
        $rows = DB::table('loan_applications as a')->where('branch_id',$branch_id)->where('id',$loan_app_id)->selectRaw("a.id,a.code as loan_app_code,a.request_date,a.request_amount,(CASE IFNULL(a.approved_amount,0) WHEN 0 THEN a.request_amount ELSE a.approved_amount END) AS principal,a.monthly_interest_rate,a.period_months,minimum_installment,a.loan_type_id,a.purpose_id,a.payback_method_id")->limit(1)->get();
        foreach($rows as $row){
            return (object)[
                'borrower_data'=>$borrower_data,
                'loan_data'=>$row
            ];
        }
      
        return (object)[
            'borrower_data'=>$borrower_data,
                'loan_data'=>null
        ];
    }

    function getProps($branch_id,$loan_id, $cols){
        if (!$loan_id) return null;
        if(empty($cols)) $cols = "l.id,l.`code`,l.principal,l.outstanding_principal,l.effective_date, l.first_pmt_date,l.status_id";
        $rows= DB::table::table('loans as l')->where('l.branch_id',$branch_id)->where('l.id',$loan_id)->selectRaw($cols)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;
    }

    function deleteLoan($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(212,0)) return DV::error('Permission 212 is required');
        $branch_id = $ss->branch_id;
        $loan_id = $d->loan_id;
        $p1 = $this->getLoanProps($branch_id,$loan_id,['l.id,l.loan_app_id,l.status_id']);
        if(!$p1) return DV::error('Loan ID is not correct!');
        if ($p1->loan_app_id > 0) DB::table('loan_applications')->where('branch_id',$branch_id)->where('id',$p1->loan_app_id)->update([
            'inactive'=>1,
            'special_remarks'=>"This loan was deleted by $ss->login_name on ".getNowTime()
        ]);
        DB::table('loans')->where('id',$loan_id)->update(['inactive'=>1]);
        DB::table('loan_collections')->where('loan_id',$loan_id)->update(['inactive'=>1]);
        return DV::success();
    }
  
    function getStudentInfo($branch_id,$person_id,$program_id = null){
        //parameter @program_id is not yet used
       $rows = DB::table('student_details')->where('branch_id',$branch_id)->where('person_id',$person_id)->selectRaw("d.person_id,d.student_code")->limit(1)->get();
       foreach($rows as $row) return $row;
       return null;
    }

    //$d = {currency,principal,monthly_interest_rate,effective_date,period_months,first_pmt_date,payback_method_id,extended_details}
    function disburseLoan($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(204,0)) return DV::error('Permission 204 is required');
        $branch_id = $ss->branch_id;
        $loan_app_id = isset($d->loan_app_id)?$d->loan_app_id:null;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;

        $currency = isset($d->currency)?$d->currency:'USD';
        $loan_type_id = isset($d->loan_type_id)?$d->loan_type_id:null;
        $principal = isset($d->principal)?$d->principal:0;
        $monthly_interest_rate = isset($d->monthly_interest_rate)?$d->monthly_interest_rate:0;
        $effective_date = isset($d->effective_date)?$d->effective_date:null;
        $period_months = isset($d->period_months)?$d->period_months:0;
        $maturity_date = isset($d->maturity_date)?$d->maturity_date:null;
        $first_pmt_date=isset($d->first_pmt_date)?$d->first_pmt_date:null;
        $frst_pmt_date = isset($d->frst_pmt_date)?$d->frst_pmt_date:null;
        $minimum_installment = isset($d->minimum_installment)?$d->minimum_installment:0;
        $payback_method_id = isset($d->payback_method_id)?$d->payback_method_id:null;
        $loan_remarks = isset($d->remarks)?$d->remarks:null;
        $purpose_id = isset($d->purpose_id)?$d->purpose_id:null;
        $program_id = isset($d->program_id)?$d->program_id:null;
        $person_id = isset($d->person_id)?$d->person_id:null;

        /** @extended_details contains additional information about the loan. It is object such as {'item_full_price','price_loan_percentage','remarks'} **/
        $extended_details = isset($d->extended_details)? (object)$d->extended_details:null;

        $item_full_price = 0;
        $price_loan_percentage =0;
        if($extended_details) {
            $item_full_price = $extended_details->item_full_price;
            $price_loan_percentage = isset($extended_details->price_loan_percentage)?$extended_details->price_loan_percentage:0;
        }

        $loan = $this->getProps($branch_id,$loan_id,null);
        $err = DV::getErrors($d,['currency'=>['USD','KHR'],'loan_type_id'=>'positive','principal'=>'positive','monthly_interest_rate'=>'number','period_months'=>'positive','effective_date'=>'date','payback_method_id'=>'positive','person_id'=>'positive'],'loan');
        if($err) return DV::error($err);
        
        if(!(bool)strtotime($effective_date)) $effective_date =date('Y-m-d');
        $maturity_date = date('Y-m-d', strtotime("+$period_months months", strtotime($effective_date)));

        /** For example, borrower borrows cash ($500) to my a smart phone with full price ($1000) => there the price_loan_prcentage = 500/1000 that is 50% **/
        $temp_percentage = 0;
        if($item_full_price<=0) $temp_percentage =0;
        else $temp_percentage = number_format($principal *100/$item_full_price,2);
        if ($temp_percentage != number_format($price_loan_percentage,2) && $price_loan_percentage > 0) return DV::error('The price loan percentage calucation does not seem to be right!');  

        $effective_date = convertDate($effective_date);
        $student = $this->getStudentInfo($branch_id,$person_id);
        if(!$student) return DV::error('Student information is not valid');

        $inputs = [
            'loan_type_id'=>$loan_type_id,
            'student_code'=>$student->student_code,
            'program_id'=>$program_id, 
            'borrower_id'=>$person_id,
            'principal'=>$principal,
            'outstanding_principal'=>$principal,
            'monthly_interest_rate'=>$monthly_interest_rate,
            'effective_date'=>$effective_date,
            'period_months'=>$period_months,
            'os_interest_date'=>$effective_date,
            'maturity_date'=>$maturity_date,
            'purpose_id'=>$purpose_id,
            'item_full_price'=>$item_full_price,
            'first_pmt_date'=>$first_pmt_date,
            'minimum_installment'=>$minimum_installment,
            'payback_method_id'=>$payback_method_id,
            'price_loan_percentage'=>$price_loan_percentage,
            'status_id'=>1,  //Active
            'inactive'=>0,
            'create_uid'=>$ss->user_id,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime()
        ];
         
        if($loan){
             $loan_code= $loan->code;
             if ($loan->status_id ==2) return DV::error("Loan $loan_code has already finished!");
             DB::table('loans')->where('branch_id',$branch_id)->where('id',$loan_id)->update($inputs);
        } else{
             $inputs['branch_id'] = $branch_id;
             $inputs['loan_app_id'] = $loan_app_id;
             DB::table('loans')->insert($inputs);
             $loan_id = DB::getPdo()->lastInsertId();
             self::set_loan_code($ss,$loan_id);
             self::set_borrower_code($ss,$loan_id);
             $this->trackLoanStatus($ss,$loan_id,1,"Loan disbursed");
        }
        DB::table('loan_applications')->where('branch_id',$branch_id)->where('id',$loan_app_id)->update(['status_id'=>3,'disburse_user'=>$ss->login_name,'disburse_date'=>getNowTime()]); 
        return DV::success(['loan_id'=>$loan_id]);

    }

    //@cols can be string or array
    function getLoanProps($branch_id=null,$id=null,$cols=null,$by_col ='id'){
       
        if(!$id) return null;
        $fields ="l.id,l.code,DATE_FORMAT(l.effective_date,'%d %b %Y') AS effective_date,l.borrower_id,l.principal,l.monthly_interest_rate,l.outstanding_principal,DATE_FORMAT(l.maturity_date,'%d %b %Y') AS maturity_date";

        if(!is_string($cols)){
                if(!isset($cols[0])) 
                    $cols = ["l.id","l.code","l.borrower_id","l.principal","l.outstanding_principal","DATE_FORMAT(l.effective_date,'%d %b %Y') AS effective_date","l.monthly_interest_rate","l.status_id"];
                else {
                    $i=0;
                    $c;
                    $fields ='';  
                    do{
                       if(!isset($cols[$i])) break;
                       $c = $cols[$i];
                        if ($c=='borrower_name') $c = 'b.name AS `borrower_name`';
                        //else if($c=='guarantor_name') $c ='pg.name AS guarantor_name';
                        $fields .= ($fields?',':'').$c;
                       $i++;
                    }while($c);
                }  
        } else{
            if(!$cols)  $fields ="l.id,l.code,DATE_FORMAT(l.effective_date,'%d %b %Y') AS effective_date,l.borrower_id,l.principal,l.monthly_interest_rate,l.outstanding_principal,DATE_FORMAT(l.maturity_date,'%d %b %Y') AS maturity_date";
            else $fields = $cols;
        }
         
        $more_where ="1=1";
        $where1 ="l.id ='$id'";
        if($by_col !='id') $where1 ="l.code ='$id'";

        if($branch_id >0) $more_where ="l.branch_id =$branch_id"; 
        $rows = DB::table('loans AS l')->whereRaw($more_where)->whereRaw($where1)->join('loan_statuses AS ls','ls.id','=','l.status_id')->join('persons AS b','b.id','=','l.borrower_id')->selectRaw($fields)->limit(1)->get();
        foreach($rows as $row) return $row;
        return null;  
    }
    
    function saveLoanInterest($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(214,0)) return DV::error('Permission 214 is required');
        $branch_id = $ss->branch_id;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;
        $m_interest_rate = $d->monthly_interest_rate;
        $os_interest_date = convertDate($d->os_interest_date);

        DB::table('loans')->where('id',$loan_id)->update([
            'monthly_interest_rate'=>$m_interest_rate,
            'os_interest_date'=>$os_interest_date
        ]);
        return DV::success(['loan_id'=>$loan_id]);
    }

    //return object {principal, outstanding_principal, monthly_interest_rate, os_intererest_date, principal_amount, interest_amount,penalty_amount}
    function calculatePmtAmounts($ss,$loan_id,$amount,$discount_percent,$payment_date){
        
        $branch_id =1; // isset($ss->$branch_id)?$ss->$branch_id:null; 
        if (!(bool)strtotime($payment_date)) $payment_date = date('Y-m-d');
        $loan = $this->getLoanProps($branch_id,$loan_id,"l.id,l.borrower_id,l.minimum_installment,l.first_pmt_date,l.code,DATE_FORMAT(l.os_interest_date,'%d %b %Y') AS os_interest_date,l.monthly_interest_rate,(l.principal - IFNULL(l.discount_principal,0)) AS principal, l.principal_paid,l.interest_due,penalty_due,l.status_id",'id'); 
        if(!$loan) return null;
            $outstanding_principal  =$loan->principal - $loan->principal_paid;
            $m_interest_rate = $loan->monthly_interest_rate;

            $month = date('m',strtotime($payment_date));
            $year =  date('Y',strtotime($payment_date));
            $days_in_months = days_in_month($month, $year);
            if($days_in_months ==0) $days_in_months =1;
            $daily_rate = $m_interest_rate/ $days_in_months;

            $days = dateDiff_days($loan->os_interest_date,$payment_date);

            $interest_amount = number_format($days * ($outstanding_principal * $daily_rate/100),2);
            $principal_amount = $amount - $interest_amount;
            $outstanding_principal -= $principal_amount;
            $discount_amount =  $principal_amount * $discount_percent/100;
            $net_amount  = $amount - $discount_amount;
            $net_principal = $principal_amount - $discount_amount;

            return (object)[
                'loan_id'=>$loan_id,
                'borrower_id'=>$loan->borrower_id,
                //NOTE: $loan->principal is "principal - discount_principal"
                'principal'=>$loan->principal,
                'principal_paid'=>$loan->principal_paid,
                'minimum_installment'=>$loan->minimum_installment,
                //'first_pmt_date'=>$loan->first_pmt_date,
                'amount'=>$amount,
                'net_amount'=>$net_amount,
                'discount_percent'=>$discount_percent,
                'monthly_interest_rate'=>$loan->monthly_interest_rate,
                'principal_amount'=>$net_principal,
                'interest_amount'=>$interest_amount,
                //NOTE that "outstanding_principal" here is the remaining priciple after booking this last payment
                'outstanding_principal'=>$outstanding_principal,
                'os_interest_date'=>$loan->os_interest_date,
                'interest_due'=>$loan->interest_due,
                'penalty_due'=>$loan->penalty_due,
                'status_id'=>$loan->status_id
            ];
    }

    function payment_exists($loan_id,$payment_date,$amount){
       $loan_id = sanitize($loan_id);
       if(!(bool)strtotime($payment_date)) return false;
       $payment_date = convertDate($payment_date);
       if(!is_numeric($amount)) $amount = 0 ; 
       $rows = DB::table('loan_collections as c')->where('c.loan_id',$loan_id)->whereRaw("date(payment_date) ='$payment_date' AND c.amount =$amount")->select('c.id')->limit(1)->get();
        foreach($rows as $row) return true;
        return false;
    }

    //$d = {payment_date,is_payoff_transaction,amount,pmt_type,pmt_method_id,[principal_amount],[interest_amount],remarks}
    //NOTE, if not payoff transaction, it is not clear calc of discount yet, so @discount_percent must be walways be zero if it is not payoff transaction
    function savePayment($d){
        $strict_interest_mode =0; /** strict_interest_mode =1 => interest is always calculated on daily basis **/
        $validate_interest_calc =0; /** $validate_interest_calc = 1 => means that system will always calculate interest amount, and remaining principal amount, Not just following user inputs from Frontend page **/
       
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(205,0)) return DV::error('Permission 205 is required');
        $branch_id = $ss->branch_id;
        $user_full_name = $ss->full_name;

        $auto_auth = isset($d->auto_auth)?$d->auto_auth:0;

        $id = isset($d->id)?$d->id:null;
        $send_email = isset($d->send_email)?$d->send_email:0;

        $d->is_payoff_transaction = isset($d->is_payoff_transaction)?$d->is_payoff_transaction:0;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;
        //NOTE: $pmt_type = {'installment','adjustment'}
        $payment_date = isset($d->payment_date)? convertDate($d->payment_date):null;
        $pmt_type = isset($d->pmt_type)?$d->pmt_type:'installment';
        $pmt_method_id = isset($d->pmt_method_id)?$d->pmt_method_id:null;
        $amount = isset($d->amount)?$d->amount:0;
        $discount_percent = isset($d->discount_percent)?$d->discount_percent:0;
        $remarks = isset($d->remarks)?$d->remarks:null;
        $principal_amount = isset($d->principal_amount)?$d->principal_amount:0;
        $interest_amount = isset($d->interest_amount)?$d->interest_amount:0;
        $penalty_fee = isset($d->penalty_fee)?$d->penalty_fee:0;

        //New monthly interest_rate is to be applied for next month. It is optional
        $new_monthly_interest_rate = isset($d->new_monthly_interest_rate)?$d->new_monthly_interest_rate:-1;

        if (!(bool)strtotime($payment_date)) return DV::error('Payment date is not valid!');

        ////**** $interest_due is interest_carryover. The interest that is still due
        //$loan = $this->getLoanProps($branch_id,$loan_id,"l.id,l.borrower_id,l.code,l.effective_date,l.os_interest_date,l.monthly_interest_rate,l.principal, l.principal_paid,l.interest_due,penalty_due,l.status_id",'id'); 
        //if(!$loan) return DV::error('Loan identity is not valid!');
        //$borrower_id = $loan->borrower_id;

        if(!$pmt_method_id || $pmt_method_id <=0 ) return DV::error('Payment method is not valid');

        $err = DV::getErrors($d,['payment_date'=>'date','pmt_method_id'=>'positive','amount'=>'number'],'repayment');
        if($err) return DV::error($err);
        
        if (strtolower($pmt_type) =='adjustment'){
            $err = DV::getErrors($d,['amount'=>'number','principal_amount'=>'number','interest_amount'=>'number','payment_date'=>'date'],'adjust_pmt');
            if($err) return DV::error($err);
        }

        $borrower_id = null;
        $calc = (object)[];
        if (strtolower($pmt_type) ==='installment'){
            if ($this->payment_exists($loan_id,$payment_date,$amount)) return DV::error('It seems that this payment has been booked already!');
            $calc = $this->calculatePmtAmounts($ss,$loan_id,$amount,$discount_percent,$payment_date);
            if (!$calc) return DV::error('Loan identity is not valid!');
             $borrower_id = $calc->borrower_id;
             if($calc->principal_paid >= $calc->principal && $calc->status_id ==2 ) return DV::error('This loan has been paid off!');
            
            $m_interest_rate = 0;

            if (($calc->outstanding_principal <=0 && $calc->interest_due <= 0 && $calc->penalty_due <=0) || $d->is_payoff_transaction ==1){
                return DV::error('It seems you are tying to pay off loan! If so, please go to Active Loans screen and click on Pay Off menu');
                //return $this->payOffLoan($d);    
            }

        }else {
          $calc->net_amount = $amount;
          $calc->principal_amount = $principal_amount;
          $calc->interest_amount = $interest_amount;
          $loan = $this->getLoanProps($branch_id,$loan_id,"l.id, l.borrower_id, l.principal - IFNULL(l.discount_principal,0)  AS principal,l.principal_paid,monthly_interest_rate",'id');
          if(!$loan) return DV::error('Loan identity is not valid!');
          //$loan->principal is the principal after discount. It is "Principal - discount_principal"
          $calc->outstanding_principal = $loan->principal - $loan->principal_paid - $principal_amount;
          $calc->monthly_interest_rate = $loan->monthly_interest_rate;
          $borrower_id = $loan->borrower_id;

        }
 
        if ($calc->outstanding_principal < 0 ) return DV::error("The payment amount seems to exceed the remaining principal due!");
        if(!$new_monthly_interest_rate || $new_monthly_interest_rate == -1) $new_monthly_interest_rate = $calc->monthly_interest_rate; 
        $inputs=[
           'loan_id'=>$loan_id,
           'borrower_id'=>$borrower_id,
           'payment_date'=>$payment_date,
           'penalty_fee'=>$penalty_fee,
           'monthly_interest_rate'=>$new_monthly_interest_rate,
           'amount'=>$amount,
           'discount_percent'=>$discount_percent,
           'net_amount'=>$calc->net_amount,
           'principal_amount'=>$calc->principal_amount,
           'interest_amount'=>$calc->interest_amount,
           'outstanding_principal'=>$calc->outstanding_principal,
           'pmt_method_id'=>$pmt_method_id,
           'remarks'=>$remarks,
           'pmt_type'=>$pmt_type,
           'create_uid'=>$ss->user_id,
           'create_user'=>$user_full_name?$user_full_name:$ss->login_name,
           'create_date'=>getNowTime()
        ];
        
        if ($auto_auth ==1){
            $inputs['auth_user'] =$ss->login_name;
            $inputs['auth_date'] = getNowTime();
        }
        $is_new_pmt =0;
        $trx_id = null;
        $need_loan_update = false;
        $is_insert = false;

        if(!$id || $id<=0){
            $inputs['branch_id'] =$branch_id;

            DB::table('loan_collections')->insert($inputs);
            $trx_id = DB::getPdo()->lastInsertId();
            $this->set_receipt_number($ss,$trx_id);
            $need_loan_update=true;
            $is_insert = true;
            //$is_new_pmt =1 => so to updateLoanData() by updating the os_interest_date. The date from which incremental interest on the remaining principal is counted
            //updateLoanData() use server's today date (The day of booking payment) as os_interest_date
            $is_new_pmt = 1;
        } else{
            $trx_id = $id;
            if (!$this->can_update_payment($loan_id)) return DV::error('Cannot upda this payment because it is not the lastest payment!');  
            DB::table('loan_collections')->where('branch_id',$branch_id)->where('id',$id)->update($inputs);
            $need_loan_update=true;
        }
       
          //Update loan data
          if($need_loan_update){
             $res = $this->updateLoanData($branch_id,$loan_id,$is_new_pmt,$payment_date);
             //$outstanding_principal = $loan->principal -  $res->principal_paid;
             //DB::table('loan_collections')->where('id',$trx_id)->update(['outstanding_principal'=>$outstanding_principal]);
          }
          
          if ($is_insert && $send_email == 1) {
              $this->mailReceipt($branch_id,$trx_id,$loan_id,null);
          }

          return DV::success(['trx_id'=>$trx_id]);
    }

      //send email to student with a link to view reeceipt as html page
  function mailReceipt($branch_id,$trx_id,$loan_id,$email_message) {
    // $ss = getSessionInfo($d);
    // if(!$ss) return makeJsonResponse('#350'); //user not authenticated
    // if (!prn_allowed(2)) return makeJsonResponse('@'); //need permission to do this task
    // $branch_id = $ss->branch_id; 
 
    //getMailingInfo() return object {'to_email','phone_number','borrower_name'}
    $ms = $this->getMailingInfo($trx_id,$loan_id);
    if(!$ms) return (object)['status'=>'Error','error_message'=>"Failed to identify receipt information!"];
       
    $q ="tid=$trx_id&lid=$loan_id&bid=$branch_id";
    $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
    $encrypted_q = $encrypter->encrypt($q,false); //FALSE => to avoid serialization issue in decryption

    $data = ['receipt_number'=>$ms->receipt_number,'payment_date'=>$ms->payment_date, 'borrower_name'=>$ms->borrower_name,'encrypted_q'=>$encrypted_q,'email_text'=>$email_message];
    Mail::send('mail', $data, function($message) use ($ms){
       //$ms->email is destination email, or receiving email
       $message->to($ms->email, 'Receipt of Payment')->subject
          ('Receipt:');
       $message->from('pucloan@puc.edu.kh','Paññāsāstra University');
    });
    return (object)['status'=>'OK'];
    //echo "HTML Email Sent. Check your inbox.";
 }

  function getMailingInfo($trx_id,$loan_id){
    $rows = DB::table('loan_collections AS c')->join('loans AS l','l.id','=','c.loan_id')->join('persons AS p','p.id','=','l.borrower_id')->where('c.id',$trx_id)->where('l.id',$loan_id)->selectRaw("l.branch_id,l.id,p.email,p.phone_number, CONCAT(p.last_name,' ',p.first_name) AS borrower_name,c.receipt_number, DATE_FORMAT(c.payment_date,'%d %b %Y') AS payment_date")->limit(1)->get();
    foreach($rows as $row) return $row;
    return null;
  }

    //In case of Deleting the payment
    function getLoan_os_interest_date($branch_id,$loan_id){
       $rows = DB::table('loan_collections as l')->where('loan_id',$loan_id)->where('l.branch_id',$branch_id)->selectRaw('l.payment_date')->limit(1)->orderByRaw('l.payment_date DESC')->get();
       foreach($rows as $row) return $row->payment_date;
       return null;
    }

    //loan status = {1:Active, 2: Paid Off, 3: suspected uncollectible, 4: Write-off, 5: Reactivated}
    function writeOffLoan($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,202)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $trx_id = isset($d->trx_id)?$d->trx_id:null;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;
        $amount = isset($d->amount)?$d->amount:0;
        $remarks = isset($d->remarks)?$d->remarks:null;

        DB::table('loans')->where('id',$loan_id)->where('branch_id',$branch_id)->update(['status_id'=>4]);
        $this->trackLoanStatus($ss,$loan_id,4,$remarks?$remarks:"Write off");
        return DV::success(['loan_id'=>$loan_id]);
    }

    //$d = {[payment_date],loan_id,pmt_method_id,amount,discount_percent,[principal_amount],[interest_amount],[remarks]}
    function payOffLoan($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(210,0)) return DV::error('Permission 210 is required');
        $branch_id = $ss->branch_id;

        $loan_id = isset($d->loan_id)?$d->loan_id:null;
        $payment_date = isset($d->payment_date)?$d->payment_date:null;
        $amount = isset($d->amount)?$d->amount:0;
        $discount_percent = isset($d->discount_percent)?$d->discount_percent:0;
        //$net_amount = isset($d->net_amount)?$d->net_amount:0;
        $principal_amount = isset($d->principal_amount)?$d->principal_amount:0;
        $interest_amount = isset($d->interest_amount)?$d->interest_amount:0;
        $penalty_fee = isset($d->penalty_fee)?$d->penalty_fee:0;
        $remarks = isset($d->remarks)?$d->remarks:null;
        $pmt_method_id = isset($d->pmt_method_id)?$d->pmt_method_id:null;

        $payment_date = convertDate($payment_date);
        if(!(bool)strtotime($payment_date)) $payment_date = date('Y-m-d');
        if(!($pmt_method_id >0)) return DV::error('Payment method is not correct!');
        $pmt_type = 'installment'; //paid off installment

        $status_id =2;
        $loan = $this->getLoanProps($branch_id,$loan_id,"l.id,l.status_id,l.borrower_id,l.`currency`,l.monthly_interest_rate,l.os_interest_date,IFNULL(l.discount_principal,0) AS discount_principal, l.principal - IFNULL(l.discount_principal,0) AS net_principal, IFNULL(l.discount_amount,0) AS discount_amount, IFNULL(l.principal_paid,0) AS principal_paid,l.interest_paid,IFNULL(l.interest_due,0) AS interest_due,IFNULL(l.penalty_due,0) AS penalty_due, l.principal, l.monthly_interest_rate",'id');
        if(!$loan) return DV::error('This loan identity does not exist');
        if ($loan->status_id !=1){
            if($status_id ==2) return DV::error("Loan already finsihed");
            else return DV::error("This loan is not active and might have been written off or deleted!");
        } 

        $borrower_id = $loan->borrower_id;
        $outstanding_principal = $loan->net_principal - $loan->principal_paid;
         
            $m_interest_rate = $loan->monthly_interest_rate;
            $principal = $loan->principal;
            $interest_paid = $loan->interest_paid;
            $os_interest_date = $loan->os_interest_date;
            $other_due = $loan->interest_due + $loan->penalty_due;
            if(!(bool)strtotime( $os_interest_date))  $os_interest_date = $this->getLastPaymentDate($branch_id,$loan_id); 
            $interest_amount = $this->calculateInterestAmount($outstanding_principal, $m_interest_rate,$os_interest_date,$payment_date);
            $principal_amount = $outstanding_principal ; //$amount - $interest_amount - $other_due;
            
            $discount_amount = $outstanding_principal * $discount_percent/100;
            $actual_principal = $amount - $interest_amount - $other_due;
            //Sometimes discount given and Total amount paid does not even cover remaining principal, causing the @diff_amount < 0
            //$diff_amount =0; // $principal - $actual_principal;
         
             //$net_amount = $amount - $discount_amount;
             $net_amount = $amount;
             //if ($diff_amount > 0) return DV::error('Ihe principal amount is not settled to zero for payoff operation');
             
        DB::table('loan_collections')->insert(
          [
            'branch_id'=>$branch_id,   
            'loan_id'=>$loan_id,
            'borrower_id'=>$borrower_id,
            'payment_date'=>$payment_date,
            'monthly_interest_rate'=>$m_interest_rate,
            'amount'=>$amount,
            'discount_percent'=>0,
            'net_amount'=>$net_amount,
            'principal_amount'=>$principal_amount,
            'interest_amount'=>$interest_amount,
            'outstanding_principal'=> 0,
            'pmt_method_id'=>$pmt_method_id,
            'create_user'=>$ss->login_name,
            'create_date'=>getNowTime(),
            'remarks'=>$remarks,
            'pmt_type'=>$pmt_type
          ]
        );
        $trx_id = DB::getPdo()->lastInsertId();

        if($trx_id > 0) {
            $this->set_receipt_number($ss,$trx_id);

            $interest_paid += $interest_amount;
            $total_discount = $loan->discount_amount + $discount_amount;
            $total_discount_principal = $loan->discount_principal + $discount_amount;
            $principal_paid = $principal - $total_discount_principal;
            if ($principal != 0 ) 
               $principal_discount_percent = $total_discount_principal*100/$principal; 
            else $principal_discount_percent = $total_discount_principal;

            //Diff_amount is not necessary field, will be deleted because $discount_principal plays the same role
            //$diff_amount = $principal - $principal_paid; 
           //IMPORTANT NOTE =>  $principal here is equal to "l.principal - l.discount_principal"; It is net_principal after discount by Dr. Kol Pheng, etc
            $status_id =2;
            DB::table('loans')->where('id',$loan_id)->where('branch_id',$branch_id)->update([
                'status_id'=>$status_id,'discount_principal'=>$total_discount_principal,'principal_discount_percent'=>$principal_discount_percent,'principal_paid'=>$principal_paid,'interest_paid'=>$interest_paid,'penalty_fee'=>$penalty_fee,'finish_date'=>$payment_date]);
            $this->trackLoanStatus($ss,$loan_id,$status_id,$remarks?$remarks:"Paid off");
            return DV::success(['loan_id'=>$loan_id,'trx_id'=>$trx_id,'status_id'=>$status_id]);
        }
        return DV::error('Unexpected error in paying off loan!');
    }
 
    function getLoanData($branch_id,$loan_id){
            $pmt_count = 0;
            $rows1 = Db::table('loan_collections as c')->where('branch_id',$branch_id)->where('loan_id',$loan_id)->whereRaw("IFNULL(c.inactive,0) =0 AND c.pmt_type = 'installment'")->selectRaw('COUNT(c.id) as pmt_count')->get();
            foreach($rows1 as $row) $pmt_count = $row->pmt_count;
            $rows = Db::table('loan_collections as c')->where('branch_id',$branch_id)->where('loan_id',$loan_id)->whereRaw('IFNULL(c.inactive,0) =0')->selectRaw("'USD' AS `currency`, COUNT(c.id) AS pmt_count, SUM(IFNULL(c.principal_amount,0)) As principal_paid, SUM(IFNULL(c.interest_amount,0)) AS interest_paid, SUM((c.amount - c.interest_amount) * IFNULL(c.discount_percent,0)/100) AS total_discount, SUM(IFNULL(c.penalty_fee,0)) AS penalty_fee")->get();
            foreach($rows as $row) {
                $row->pmt_count = $pmt_count;
                return $row;
            }
            return null;
            //  return (object)[
            //      'pmt_count'=>0,
            //      'principal_paid'=>0,
            //      'interest_paid'=>0,
            //      'currency'=>null
            //  ];
    }

    //trx_id is used for paid off tranaction
    function trackLoanStatus($ss,$loan_id,$status_id,$remarks,$trx_id=null,$description = null){
        $branch_id = $ss->branch_id;
        $loan_app = (object)[
            'loan_app_id'=>null,
            'loan_app_code'=>null,
            'create_date'=>null
        ];

        $rows = Db::table('loans AS l')->join('loan_applications as a','a.id','=','l.loan_app_id')->where('l.branch_id',$branch_id)->where('l.id',$loan_id)->selectRaw('a.id as loan_app_id,a.code as loan_app_code, a.create_date')->limit(1)->get();
        foreach($rows as $row) $loan_app = $row;
        //NOTE: remarks is "event name", "description" is a free writing remarks 
        
        DB::table('loan_status_track')->insert([
            'branch_id'=>$branch_id,
            'create_date'=>getNowTime(),
            'create_user'=>$ss->login_name,
            'loan_id'=>$loan_id,
            'loan_app_id'=>$loan_app->loan_app_id,
            'loan_app_code'=>$loan_app->loan_app_code,
            'status_id'=>$status_id,
            'remarks'=>$remarks,
            'description'=>$description,
            'trx_id'=>$trx_id
        ]);
        return DV::success(['loan_id'=>$loan_id,'trx_id'=>$trx_id]);
    }

    function can_update_payment($loan_id){
        $rows = DB::table('loan_collections')->where('branch_id',$branch_id)->where('loan_id',$loan_id)->whereRaw("l.payment_date >'$pmt->payment_date'")->selectRaw("l.id,l.loan_id")->limit(1)->get();  
        if(isset($rows[0])) return DV::error('Cannot delete this payment because it is not the latest payment for the loan!');
    }

    function deletePayment($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(206,0)) return DV::error('Permission 206 is required');
        $branch_id = $ss->branch_id;
        $trx_id = isset($d->trx_id)?$d->trx_id:null;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;
        $pmt = null;
        $rows = DB::table('loan_collections AS c')->join('loans AS l','l.id','=','c.loan_id')->where('c.branch_id',$branch_id)->where('c.id',$trx_id)->selectRaw("c.id,c.loan_id,c.payment_date,c.amount, c.discount_percent,c.net_amount,c.principal_amount,c.interest_amount,l.status_id")->limit(1)->get();
        $loan_status_id = null;
        foreach($rows as $row){
            $loan_status_id = $row->status_id;
            $pmt = $row;
        }
        if(!$pmt) return DV::error('Transaction ID is not valid');
        // if ($loan_status_id ==2) return DV::error('Cannot delete any payment of finished loan');
        // if ($loan_status_id > 2) return DV::error('Cannot delete this payment because the loan might have been finsihed or written off');

        $rows = DB::table('loan_collections AS l')->where('branch_id',$branch_id)->where('loan_id',$loan_id)->whereRaw("l.payment_date >'$pmt->payment_date'")->selectRaw("l.id,l.loan_id,l.amount,l.principal_amount,l.interest_amount")->limit(1)->get();  
        if(isset($rows[0])) return DV::error('Cannot delete this payment because it is not the latest payment for the loan!');
        
        $loan = $this->getLoanProps($branch_id,$loan_id,"l.id,l.status_id,l.code,l.principal,l.os_interest_date,l.monthly_interest_rate,l.interest_paid,principal_paid",'id'); 
        if(!$loan) return DV::error('Loan identity is not valid!');
 
        if ($loan->status_id ==2) return DV::error('Cannot delete any payment of finished loan');
        if ($loan->status_id > 2) return DV::error('Cannot delete this payment because the loan might have been finsihed or written off');
  
        $res = DB::table('loan_collections')->where('branch_id',$branch_id)->where('id',$trx_id)->where('loan_id',$pmt->loan_id)->update(['inactive'=>1]);
        //$res = DB::table('loan_collections')->where('branch_id',$branch_id)->where('id',$trx_id)->where('loan_id',$pmt->loan_id)->delete();
        
        $loanData = $this->getLoanData($branch_id,$loan_id);
        if(!$loanData) return DV::error('Loan identity is not valid!');
        $os_interest_date = $this->getLoan_os_interest_date($branch_id,$loan_id);

        if ($res || $res > 0) {
            $inputs = [
                'principal_paid'=>$loanData->principal_paid,
                'interest_paid'=>$loanData->interest_paid,
                //"penalty_fee" is total_penalty
                'penalty_fee'=>$loanData->penalty_fee,
                'discount_principal'=>$loanData->total_discount,
                'discount_amount'=>$loanData->total_discount,
                'pmt_count'=>$loanData->pmt_count,
                'os_interest_date'=>$os_interest_date];
               //If After deleting payment, the remaining_principal > 0 = > set the loan back to Active 
               if ($loan->principal <= $loanData->total_discount + $loanData->principal_paid) $inputs['status_id'] =1;
            DB::table('loans')->where('branch_id',$branch_id)->where('id',$loan_id)->update($inputs);
        }
         ////No need call updateLoanData()  
        ////$m = $this->updateLoanData($branch_id,$loan_id,0,null);
        return DV::success(['principal'=>$loan->principal,'principal_paid'=>$loanData->principal_paid,'interest_paid'=>$loanData->interest_paid,'total_discount'=>$loanData->total_discount]);
    }

    function getPaymentList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,203)) return [];
        $branch_id = $ss->branch_id;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;

        $search_value = isset($d->search_value)?$d->search_value:null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null;

        $borrower_id = isset($d->borrower_id)?$d->borrower_id:null;
        $user_id = isset($d->user_id)?$d->user_id:null;

        $cols ="c.payment_date as payment_date1, c.id, c.id as trx_id,c.receipt_number,b.id as borrower_id,c.loan_id, DATE_FORMAT(c.payment_date,'%d %b %Y') AS payment_date,Date_format(c.create_date,'%d %b %Y') AS booking_date,c.amount,c.net_amount,IFNULL(c.net_amount,0),IFNULL(c.discount_percent,0) AS discount_percent, c.principal_amount ,c.pmt_type,c.pmt_method_id, pm.name AS pmt_method,c.interest_amount,c.create_user,c.outstanding_principal,c.remarks,
        l.`code` as loan_code,l.principal_paid,l.principal, 
        CONCAT(b.last_name,' ',b.first_name) AS borrower_name, b.sex,b.phone_number";

        $rows = [];
        if (!$search_value){
            $more_where ='1=1'; 
           if((bool)strtotime($start_date)){
              $start_date = convertDate($start_date);
              $end_date = convertDate($end_date);
              if(!(bool)strtotime($end_date)) $end_date = $start_date;
              $more_where .= " AND (DATE(c.payment_date)<='$start_date' AND DATE(c.payment_date) <='$end_date')";
           }

           //if ($loan_id > 0)
             $rows =DB::table('loan_collections as c')->join('pmt_methods as pm','pm.id','=','c.pmt_method_id')->join('loans as l','l.id','=','c.loan_id')->join('persons as b','b.id','=','l.borrower_id')->where('c.branch_id',$branch_id)->where('c.inactive',0)->where('c.loan_id',$loan_id)->whereRaw($more_where)->selectRaw($cols)->orderByRaw("payment_date1 DESC, c.outstanding_principal ASC")->get();
           //else
             //$rows =DB::table('loan_collections as c2')->join('pmt_methods as pm','pm.id','=','c.pmt_method_id')->join('loans as l','l.id','=','c.loan_id')->join('persons as b','b.id','=','l.borrower_id')->where('c.branch_id',$branch_id)->where('c.inactive',0)->whereRaw($more_where)->selectRaw($cols)->orderByRaw("c.create_date DESC")->limit(300)->get(); 
           return $rows;
        }else{
             $more_where =null;
             if(is_numeric($search_value))
               $more_where ="(l.principal = $search_value OR c.receipt_number ='$search_value')";
             else
                {
                    $search_value = escape_like_str($search_value);
                    $more_where = "(c.receipt_number='$search_value' OR CONCAT(b.last_name,' ',b.first_name) LIKE '%$search_value%' OR b.phone_number ='$search_value' OR l.code ='$search_value')";
                }

             $rows =DB::table('loan_collections as c')->join('pmt_methods as pm','pm.id','=','c.pmt_method_id')->join('loans as l','l.id','=','c.loan_id')->join('persons as b','b.id','=','l.borrower_id')->where('c.branch_id',$branch_id)->where('c.loan_id',$loan_id)->whereRaw('IFNULL(c.inactive,0)=0')->whereRaw($more_where)->selectRaw($cols)->orderByRaw("payment_date1 DESC, c.outstanding_principal ASC")->get();
        }
        return $rows;
       
    }

    function getPromisoryNoteList($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,208)) return [];
        $branch_id = $ss->branch_id;
        $rows = DB::table('delayed_pmts as d')->where('branch_id',$branch_id)->selectRaw("d.id,d.expect_date,d.amount,d.reason,d.create_user,d.status, d.auth_user,d.auth_date")->get();
        return $rows;
    }

    function deletePromisoryNote($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(217,0)) return DV::error('Permission 217 is required to delete this data');
        $branch_id = $ss->branch_id;
        $id = isset($d->id)?$d->id:null;
        DB::table('delayed_pmts')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return DV::success();
    }

    function savePromisoryNote($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,215)) return DV::error('Permission 215 is required to save Payment Delay request');
        $branch_id = $ss->branch_id;

        $id = isset($d->id)?$d->id:null;
        $reason = isset($d->reason)?$d->reason:null;
        $expect_date =isset( $d->expect_date)? $d->expect_date:null;
        $amount = isset($d->amount)?$d->amount:0;
        $penalty = isset($d->penalty_fee)?$d->penalty_fee:0;
        
        $loan_id = $d->loan_id;
        $loan = $this->getLoanProps($branch_id,$loan_id,"l.id,l.last_pmt_date,l.principal - IFNULL(l.discount_principal,0) as principal, l.principal_paid, l.status_id",'id');
        if(!$loan) return DV::error('Loan identity is not valid');

        $outs_principal = $loan->principal - $loan->principal_paid;
        if($loan->status_id ==2) return DV::error('Loan is already paid off');
        if($outs_principal <=0) return DV::error('It seems that this Loan is finished');

        $err = DB::getError($d,['amount'=>'number','expect_date'=>'date','reason'=>'string']);
        if($err) return DV::error($err);
        //Later needs approval
        $status ='Approved';
        
        $inputs = [
            'expect_date'=>$expect_date,
            'amount'=>$amount,
            'reason'=>$reason,
            'penalty_fee'=>$penalty_fee,
            'create_date'=>getNowTime(),
            'create_uid'=>$ss->user_id,
            'create_user'=>$ss->login_name,
            'status_id'=>$status,
            'auth_user'=>$ss->login_name,
            'auth_date'=>getNowTime(),
            'auth_uid'=>$ss->user_id
        ];

        if( $id > 0){
            DB::table('delayed_pmts')->where('branch_id',$branch_id)->where('id',$id)->update($inputs);
        }else {
            $inputs['branch_id'] = $branch_id;
            $inputs['loan_id']= $loan_id;
            DB::table('delayed_pmts')->insert($inputs);
            $id = DB::getPdo()->lastInsertId(); 
        }
       
        return DV::success(['id'=>$id]);
    }

    function getComboItems_loan($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
         //In case of Normal Loan (without joining to student_details table )
        //$rows = DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->selectRaw("l.id, CONCAT(b.last_name,' ',b.first_name, ' (',l.code,')') AS loan_name")->orderByRaw("l.effective_date DESC")->get();
        //In case of Student Loans => join with student_details table for Student Code
        $rows = DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->selectRaw("l.id, CONCAT(l.code,': ',b.last_name,' ',b.first_name, ' (',l.student_code,') ', CASE l.status_id WHEN 2 THEN 'Finished' WHEN 1 THEN 'Active' WHEN 3 THEN 'At Risk' WHEN 4 THEN 'Write-Off' END) AS loan_name")->orderByRaw("l.effective_date DESC")->get(); 
        return $rows;
    }


    //returns list of payment to borrower's page
    function getPaymentList_cu($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $loan_id = isset($d->loan_id)?$d->loan_id:null;

        $search_value = isset($d->search_value)?$d->search_value:null;
        $start_date = isset($d->start_date)?$d->start_date:null;
        $end_date = isset($d->end_date)?$d->end_date:null;

        $borrower_id = isset($ss->official_id)?$ss->official_id:null; //isset($d->borrower_id)?$d->borrower_id:null;
        $user_id = isset($d->user_id)?$d->user_id:null;

        $cols ="c.payment_date as payment_date1, c.id, c.id as trx_id,c.receipt_number,b.id as borrower_id, c.loan_id,c.receipt_number, DATE_FORMAT(c.payment_date,'%d %b %Y') AS payment_date,Date_format(c.create_date,'%d %b %Y') AS issue_date, c.net_amount AS amount,c.discount_percent,c.principal_amount,c.pmt_type,c.pmt_method_id, pm.name AS pmt_method,c.interest_amount,c.create_user,c.outstanding_principal,
        l.`code` as loan_code,
        CONCAT(b.last_name,' ',b.first_name) AS borrower_name, b.sex,b.phone_number";

        $rows = [];
        if (!$search_value){
            $more_where ='1=1'; 
           if((bool)strtotime($start_date)){
              $start_date = convertDate($start_date);
              $end_date = convertDate($end_date);
              if(!(bool)strtotime($end_date)) $end_date = $start_date;
              $more_where .= " AND (DATE(c.create_date)<='$start_date' AND DATE(c.create_date) <='$end_date')";
           }

             $rows =DB::table('loan_collections as c')->join('pmt_methods as pm','pm.id','=','c.pmt_method_id')->join('loans as l','l.id','=','c.loan_id')->join('persons as b','b.id','=','l.borrower_id')->where('c.branch_id',$branch_id)->where('c.inactive',0)->where('b.id',$borrower_id)->where('c.loan_id',$loan_id)->whereRaw($more_where)->selectRaw($cols)->orderByRaw("payment_date1 DESC")->get();
             return $rows;
        }else{
             $more_where =null;
             if(is_numeric($search_value))
               $more_where ="l.id ='$loan_id' AND (c.receipt_number ='$search_value' OR l.principal = $search_value)";
             else if ((bool)strtotime($search_value)) {
                $search_value = convertDate($search_value); 
                $more_where ="l.id ='$loan_id' AND (Date(c.payment_date) ='$search_value')";
             }else
               {
                $search_value = escpe_like_str($search_value);   
                $more_where = "l.id ='$loan_id' AND (c.receipt_number ='$search_value' OR CONCAT(b.last_name,' ',b.first_name) LIKE '%$search_value%' OR b.phone_number ='$search_value' OR l.code ='$search_value')";
               }

             $rows =DB::table('loan_collections as c')->join('pmt_methods as pm','pm.id','=','c.pmt_method_id')->join('loans as l','l.id','=','c.loan_id')->join('persons as b','b.id','=','l.borrower_id')->where('c.branch_id',$branch_id)->where('c.inactive',0)->where('b.id',$borrower_id)->whereRaw($more_where)->selectRaw($cols)->orderByRaw("payment_date1 DESC")->get();
        }
        
        return $rows;
       
    }

    function getReceiptData_print($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $full_name = $ss->full_name;
        $trx_id = isset($d->trx_id)?$d->trx_id:null;
        $cols ="r.id, r.receipt_number,r.pmt_type,IFNULL(r.penalty_fee,0) as penalty_fee, date_format(r.payment_date,'%d %b %Y') as payment_date,date_format(r.create_date,'%d %b %Y') as issue_date, r.discount_principal, r.amount,IFNULL(r.discount_percent,0) AS discount_percent,r.discount_principal,r.net_amount, r.principal_amount,r.interest_amount, 0 AS discount_amount, r.outstanding_principal,(SELECT name FROM pmt_methods WHERE id = r.pmt_method_id LIMIT 1) AS pmt_method,r.create_user,r.create_date,
         st.student_code as payer_code, CONCAT(b.last_name,' ',b.first_name) AS borrower_name, b.phone_number";

        $rows = DB::table('loan_collections As r')->join('loans as l','l.id','=','r.loan_id')->join('persons as b','b.id','=','l.borrower_id')->join('student_details as st','st.person_id','=','l.borrower_id')->where('r.branch_id',$branch_id)->where('r.id',$trx_id)->selectRaw($cols)->limit(1)->get();
 
        foreach($rows as $row){
           $data = [
               'payment_date'=>$row->payment_date,
               'issue_date'=>$row->issue_date,
               'penalty_fee'=>$row->penalty_fee,
               'receipt_number'=>$row->receipt_number,
               'discount_percent'=>$row->discount_percent,
               'discount_amount'=>$row->discount_amount,
               'borrower_code'=>$row->payer_code,
               'payer_code'=>$row->payer_code,
               'payer_name'=>$row->borrower_name,
               'borrower_name'=>$row->borrower_name,
               'pmt_type'=>$row->pmt_type,
               'phone_number'=>$row->phone_number,
               'total'=>number_format($row->amount - $row->discount_amount + $row->penalty_fee,2),
               'currency'=>'$',
               'create_user'=>$row->create_user,
               'items'=>[
                   (object)['description'=>'Principal payment','pmt_method'=>$row->pmt_method,'amount'=>$row->principal_amount],
                   (object)['description'=>'Interest payment','pmt_method'=>$row->pmt_method,'amount'=>$row->interest_amount]
               ]
           ];
           
           $add_other_item = true;
           if($row->penalty_fee > 0){
            $data['items'][] =  (object)['description'=>'Penalty Fee','pmt_method'=>$row->pmt_method,'amount'=>$row->penalty_fee];  
             $add_other_item = false;
          }

           //If there is discount (in case of PayOff)
           if($row->discount_amount > 0){
             $data['items'][] =  (object)['description'=>'Discount Amount','pmt_method'=>$row->pmt_method,'amount'=>$row->discount_amount];  
             $add_other_item = false;
           }
          
           if($add_other_item) {
            $data['items'][] = (object)['description'=>'Others','pmt_method'=>'NA','amount'=>'0'];
           }

           return (object)$data;    
        }
        return null;
        
    }

    function set_receipt_number($ss,$trx_id){
        $branch_id = $ss->branch_id;
        $rows = DB::table("receipt_num_control")->where('branch_id',$ss->branch_id)->selectRaw("last_id,prefix")->limit(1)->get();
        $next_num = 0;
        $prefix=null;
        foreach($rows as $row){
          $next_num = $row->last_id;
          $prefix =$row->prefix;
        }
        $next_num++;
        $new_code = $prefix.$branch_id.formatNumber($next_num,6); 
        $cnt = DB::table('loan_collections')->where('id',$trx_id)->update(array('receipt_number'=>$new_code));
        //if($cnt<=0){
           $m = DB::table('receipt_num_control AS c')->where('c.branch_id',$branch_id)->update(array('last_id'=>$next_num));
           if($m<=0) DB::table('receipt_num_control')->insert(array('branch_id'=>$branch_id,'prefix'=>NULL,'last_id'=>$next_num));
        //} 
        //return $prefix.$branch_id.formatNumber(1,$len);
        return null;
    }
 
    function getBorrowerList ($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(0,205)) return [];
        $branch_id = $ss->branch_id;
        $search_value = isset($d->search_value)?$d->search_value:null;
        $more_where ="1=1";
        if($search_value) {
            $search_value = escape_like_str($search_value);
            $more_where = "(p.n_id ='$search_value' OR CONCAT(p.last_name,' ',p.first_name) LIKE '%$search_value%') OR p.phone_number ='$search_value' OR l.student_code ='$search_value' OR l.`code` ='$search_value'";
        }
         $rows = DB::table('loans AS l')->join('persons AS p','p.id','=','l.borrower_id')->join('loan_statuses as ss','ss.id','=','l.status_id')->where('p.branch_id',$branch_id)->where('l.status_id',1)->whereRaw($more_where)->selectRaw("p.id,p.id as borrower_id, l.student_code as borrower_code, '$' AS currency, CONCAT(p.last_name,' ',p.first_name) AS name, p.sex,p.phone_number, p.email,p.address,l.code AS loan_code,l.principal,l.principal_paid,l.interest_paid,l.status_id, ss.name as status,l.id as loan_id")->get();
         return $rows; 
    }

    function getGuarantorList ($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return [];
        $branch_id = $ss->branch_id;
         $rows = DB::table('loans AS l')->join('persons AS p','p.id','=','l.guarantor_id')->where('p.branch_id',$branch_id)->selectRaw("p.id, CONCAT(p.last_name,' ',p.first_name) AS name,p.n_id, p.sex,p.phone_number, p.email,p.address,l.outstanding_principal,l.status_id")->get();
         return $rows; 
    }


        //set_customer_code()
        static function set_borrower_code($ss,$loan_id){
            $branch_id = $ss->branch_id;
            $rows = DB::table("borrower_code_control")->where('branch_id',$ss->branch_id)->selectRaw("last_id,prefix")->limit(1)->get();
            $next_num = 0;
            $prefix=null;
            foreach($rows as $row){
              $next_num = $row->last_id;
              $prefix =$row->prefix;
            }
            $next_num++;
            $new_code = $prefix.$branch_id.formatNumber($next_num,5); 
            $cnt = DB::table('loans')->where('id',$loan_id)->update(array('borrower_code'=>$new_code));
            //if($cnt<=0){
               $m = DB::table('borrower_code_control AS c')->where('c.branch_id',$branch_id)->update(array('last_id'=>$next_num));
               if($m<=0) DB::table('borrower_code_control')->insert(array('branch_id'=>$branch_id,'prefix'=>NULL,'last_id'=>$next_num));
            //} 
            //return $prefix.$branch_id.formatNumber(1,$len);
            return null;
        }

    //get all active loans for the current user logged in 
    function getLoanList_cu($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if (!prn_allowed(-1)) return '@'; //need permission to do this task
        $branch_id = $ss->branch_id;
        $official_id = isset($ss->official_id)?$ss->official_id:null;
        // $rows1 = DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->where('l.id',$loan_id)->selectRaw("CONCAT(b.last_name,' ',b.first_name) AS borrower_name, (SELECT d.student_code FROM student_details as d WHERE d.person_id = l.borrower_id LIMIT 1) AS student_code")->limit(1)->get(); 
        // $borrower_name = null;
        // $student_code = null;
        // foreach($rows1 as $row) {
        //     $borrower_name = $row->borrower_name;
        //     $student_code = $row->student_code;
        // }
        $rows = DB::table('loans as l')->join('persons as b','b.id','=','l.borrower_id')->where('l.branch_id',$branch_id)->where('l.borrower_id',$official_id)->where('l.status_id',1)->where('l.inactive',0)->selectRaw("l.id,l.borrower_id,l.currency,l.code as loan_code, CONCAT(b.last_name,' ',b.first_name) AS borrower_name , l.student_code, DATE_FORMAT(l.effective_date,'%d %b %Y') as effective_date, DATE_FORMAT(l.first_pmt_date,'%d %b %Y') as first_pmt_date,l.minimum_installment,IFNULL(l.principal,0) as principal, IFNULL(l.principal,0) - IFNULL(l.discount_principal,0) as net_principal,IFNULL(l.principal_paid,0) as principal_paid,l.interest_paid,IFNULL(l.interest_due,0) AS interest_due, IFNULL(l.discount_principal,0) as discount_principal,IFNULL( l.penalty_due,0) AS penalty_due,l.penalty_fee, l.status_id,IFNULL(l.monthly_interest_rate,0) AS monthly_interest_rate")->get();
        return $rows;
    }

    //updateLoanData() updates loans.principal_paid, pmt_count, penalty_fee, interest_paid so far
    //IN Case of DeletePayment() => parameters  $is_new_pmt =0, and $payment_date = null 
    function updateLoanData($branch_id,$loan_id,$is_new_pmt =0,$payment_date=null){
        $pmt_count =0;
        $rows1 = DB::table('loan_collections as c')->where('c.branch_id',$branch_id)->where('c.loan_id',$loan_id)->whereRaw("pmt_type ='installment'")->whereRaw('IFNULL(c.inactive,0) =0')->selectRaw('COUNT(c.id) AS pmt_count')->get();  
        foreach($rows1 as $row) $pmt_count = $row->pmt_count; 
        
        $rows = DB::table('loan_collections as c')->where('c.branch_id',$branch_id)->where('c.loan_id',$loan_id)->whereRaw('IFNULL(c.inactive,0) =0')->selectRaw('SUM(IFNULL(c.penalty_fee,0)) AS total_penalty, SUM(IFNULL(c.principal_amount,0)) AS principal_paid, SUM(IFNULL(c.interest_amount,0)) AS interest_paid, SUM((c.amount - c.interest_amount) * IFNULL(c.discount_percent,0)/100) AS total_discount')->get();
        $principal_paid = 0;
        $interest_paid = 0;
        $inputs = null;
       
        foreach($rows as $row){
            $principal_paid = $row->principal_paid;
            $interest_paid = $row->interest_paid;
            $inputs = [
                'principal_paid'=>$row->principal_paid,
                'interest_paid'=>$row->interest_paid,
                'penalty_fee'=>$row->total_penalty,
                'discount_amount'=>$row->total_discount,
                'pmt_count'=>$pmt_count
            ];
        }
        if (!$inputs) return (object)['principal_paid'=>$principal_paid,'interest_paid'=>$interest_paid,'loan_status_id'=> $loan_status_id];

        if ($is_new_pmt ==1){
             //"$os_interest_date" is outstanding_effective_interest_date. That is the date from which the interest on the Outstanding principal is counted
            if(!(bool)strtotime($payment_date)) $payment_date = date('Y-m-d');
             $os_interest_date =  date('Y-m-d',strtotime($payment_date.'+1day'));
            $inputs['os_interest_date'] = $os_interest_date;
        }

        DB::table('loans')->where('id',$loan_id)->update($inputs);
      
        $loan = $this->getLoanProps($branch_id,$loan_id,"l.id,l.principal,l.principal_paid,l.interest_due,l.penalty_due,l.status_id",'id');
        if(!$loan) (object)['principal_paid'=>$principal_paid,'interest_paid'=>$interest_paid];
        //Update loan status to be "Finished" when these conditions are met
        $loan_status_id = 1;
        if( $loan->principal <= $loan->principal_paid && $loan->interest_due <=0 && $loan->penalty_due <=0){
            $loan_status_id=2;
            DB::table('loans')->where('branch_id',$branch_id)->where('id',$loan_id)->update(['status_id'=> $loan_status_id]); 
        } 
       return (object)['principal_paid'=>$principal_paid,'interest_paid'=>$interest_paid,'loan_status_id'=> $loan_status_id];
    }
  
    function getLastPaymentDate($branch_id,$loan_id){
       $rows = DB::table('loan_collections as c')->where('c.branch_id',$branch_id)->where('c.loan_id',$loan_id)->selectRaw('c.payment_date,c.create_date')->orderByRaw('c.payment_date DESC')->limit(1)->get();
       foreach($rows as $row) return $row->payment_date;
       return date('Y-m-d');
    }

    function calculateInterestAmount($outstanding_principal, $rate, $os_interest_date, $payment_date){
        $month = date('m',strtotime($payment_date));
        $year =  date('Y',strtotime($payment_date));
        $days_in_months = days_in_month($month, $year);
        if($days_in_months ==0) $days_in_months =31;
        $daily_rate = $rate/ $days_in_months;

        $days = dateDiff_days($os_interest_date,$payment_date);
        $x = $outstanding_principal * $daily_rate/100;
        return number_format($x,2);
    }

    //return NULL or Object {'total','total_net','principal_amount','interest_amount','discount_percent'}
    //$d = {'loan_id','payment_date','discount_percent'}

    function getPayOffData($d){
        $ss = getSessionInfo($d);
        if(!$ss) return '#350'; //user not authenticated
        if(!UM::isSuperAdmin_cu()){
            if (!prn_allowed(210)) return '@'; //need permission to do this task
        }
       
        $branch_id = $ss->branch_id;
        $loan_id = $d->loan_id;
        $discount_percent = isset($d->discount_percent)?$d->discount_percent:0;
        $payment_date = $d->payment_date;
        if(!(bool)strtotime($payment_date)) $payment_date = date('Y-m-d');
        $rows = Db::table('loans as l')->where('l.branch_id',$branch_id)->where('l.id',$loan_id)->selectRaw("l.id,l.principal,(l.principal - IFNULL(l.discount_principal,0)) AS net_principal, IFNULL(l.principal_paid,0) AS principal_paid,IFNULL(l.interest_due,0) AS interest_due,IFNULL(l.penalty_due,0) AS penalty_due,l.os_interest_date,l.monthly_interest_rate")->limit(1)->get();
      
        foreach($rows as $row){
            $outstanding_principal = $row->net_principal - $row->principal_paid;
            $discount_amount =  $outstanding_principal * $discount_percent/100;
            $os_interest_date = $row->os_interest_date;
            $monthly_rate = is_numeric($row->monthly_interest_rate)?$row->monthly_interest_rate:0;
            if(!(bool)strtotime($os_interest_date)) $os_interest_date = $this->getLastPaymentDate($branch_id,$loan_id);
            $interest_amt = $this->calculateInterestAmount($outstanding_principal,$monthly_rate, $os_interest_date,$payment_date);

            $total_due = $outstanding_principal + $row->interest_due + $row->penalty_due + $interest_amt - $discount_amount;
            //$total_net = $total_due - $total_due * $discount_percent/100;
            $data = (object)[
                'principal_amount'=>number_format($outstanding_principal - $discount_amount,2,'.',''),
                'monthly_interest_rate'=>$monthly_rate,
                'interest_amount'=>$interest_amt,
                'amount'=>number_format($total_due,2,'.',''),
                'net_amount'=>number_format($total_due,2,'.',''),
                //'net_amount'=>number_format($total_net,2,'.','') 
            ]; 

            return $data;
        }
        return null;
        
    }
 
}
