<?php

namespace App\Models\Abm;
use DB;
use App\Models\DV;
use App\Models\JDV;
use App\Models\Dms\PublicStorage;
use Illuminate\Pagination\LengthAwarePaginator;
use DateTime;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Sanitizer;
use Localization;
class Dashboard //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    
    
    static function getSliceCircle($status_id){
        $colors = [1=>'#E3EA00',2=>'#6200EA',3=>'#33EA00'];
        return $colors[$status_id];
    }

    static function getHeaderCards($ss){   
        $branch_id = $ss->branch_id;
        $circle_cards=[];
        $normal_cards =[];
        $status_ids = [1,2,3];
        $statuses = [1=>'Pending',2=>'Shipping',3=>'Validated'];

        $str_dates = '1=1';
        $rows = DB::table('os_shipments as s')->join('os_shipment_statuses as n', 'n.id','=','s.status_id')->whereIn('s.status_id',$status_ids)->whereRaw($str_dates)->selectRaw('COUNT(s.id) as cnt, s.status_id, n.name as `status`')->groupByRaw('s.status_id, n.name')->get();
        $total = 0;
        
        foreach($statuses as $status_id => $value){
           $founds = $rows->filter(function($x) use($status_id){
               return $x->status_id == $status_id; 
           });
           $row = $founds ? $founds->first():null;
           $item = null; 
           if($row){
                $total += $row->cnt;
                $item= (object)[
                    'value'=>$row->cnt,
                    'status'=>$row->status,
                    'colorSlice'=> self::getSliceCircle($row->status_id)
                ];
           }else{
            $item= (object)[
                'value'=>0,
                'status'=> $statuses[$status_id],
                'colorSlice'=> self::getSliceCircle($status_id)
            ];
           }

           $circle_cards[] = $item; 

        }
 
        foreach($circle_cards as $card){
            if($total==0)$total=1;
            $card->percentage= number_format($card->value *100 / $total,2);
            $card->total = $total;
        }
 
        $rows = DB::table('sender as s')->join('sender_classes as c','c.sender_id','=','s.id')->where('c.sender_class','oversea')->whereRaw($str_dates)->selectRaw('COUNT(s.id) as cnt,s.status_code as `status`')->groupByRaw('s.status_code')->get();
        $active_cnt =0;
        $customer_cnt = 0;
        foreach($rows as $row){
            if(strtolower($row->status) === 'active')
            $active_cnt = $row->cnt;
            $customer_cnt += $row->cnt;
        }
        $normal_cards [] = (object)[
            'title'=>Localization::translate('titles','Total Customer',$ss->lang),
            'value'=>$customer_cnt,
            'icon'=> '<i class="fas fa-user-plus text-info" style="font-size: 3rem;width: 100px;"></i>',
            'color'=>'#0000'

        ];

        $normal_cards [] = (object)[
            'title'=>'Active Customer',
            'value'=>$active_cnt,
            'icon'=> ' <i class="fas fa-user text-success"  style="font-size: 3rem;width: 100px;"></i>',
            'color'=>'#0000'

        ];
        
        $active_agent = DB::table('os_affiliates as f')->join('os_sales_agents as a','a.affiliate_id','=','f.id')->where('f.status_code','Active')->count('f.id');
        $normal_cards [] = (object)[
            'title'=>'Active Sales Agent',
            'value'=>$active_agent,
            'icon'=> ' <i class="fa fa-users text-success"  style="font-size: 3rem;width: 100px;"></i>',
            'color'=>'#0000'

        ];
        

        return (object)[
            'circle_cards' => $circle_cards,
            'normal_cards' => $normal_cards
        ];
        
        
        // $total_customer = DB::table('sender as s')->join('sender_classes as sc','sc.sender_id','=','s.id')->where('sc.sender_class','oversea')->count('s.id');
        // $active_customer = DB::table('sender as s')->join('sender_classes as sc','sc.sender_id','=','s.id')->where('sc.sender_class','oversea')->where('s.status_code','active')->count('s.id');
        // $active_seles_agent = DB::table('os_affiliates as a')->join('os_sales_agents as sa','sa.affiliate_id','=','a.id')->where('a.status_code','Active')->count('a.id');
        // // return [$total_customer , $active_customer ,$active_seles_agent];
        
        // $data->shipments_panding = (object)[$panding, number_format(($panding/$total)*100, 2)];
        // $data->shipments_shipping = (object)[$shipping, number_format(($shipping/$total)*100, 2)];
        // $data->shipments_validated = (object)[$validated, number_format(($validated/$total)*100, 2)];
        // $data->shipments_total = $total;

        $data->total_customer = $total_customer;
        $data->active_customer = $active_customer;
        $data->active_seles_agent = $active_seles_agent;
        // return $data;
    }

    static function getBodyCards($ss){   

        $branch_id = $ss->branch_id;
        $progress_cards=[];
        $country_cards =[];
        $supplier_cards =[];

        $str_dates = '1=1';
        $start_date = date('Y-m-d', strtotime('-90 days'));
        $end_date = new DateTime();
        $end_date = $end_date->format('Y-m-d'); 
        $str_dates = "DATE(i.create_date) >= '$start_date' AND DATE(i.create_date) <= '$end_date'";
        // $total_shipment = DB::table('os_shipments as i')->where('i.status_id',3)->whereRaw($str_dates)->count('i.id');
        $status_ids = [1,2];
        // return $rows = DB::table('os_customer_invoices as i')->whereIn('i.status_id',$status_ids)->whereRaw($str_dates)->selectRaw('COUNT(i.id) as cnt, i.status_id, i.amount_due')->groupByRaw('i.status_id')->get();

        $cnt_invoice = DB::table('os_customer_invoices as i')->whereRaw($str_dates)->count('i.id');
        $cnt_invoice_paid =  DB::table('os_customer_invoices as i')->where('i.status_id',2)->whereRaw($str_dates)->count('i.id');
        $invoce_amount =  DB::table('os_customer_invoices as i')->whereRaw($str_dates)->selectRaw('i.amount_due')->get();
        $invoce_amount_paid =  DB::table('os_customer_invoices as i')->where('i.status_id',2)->whereRaw($str_dates)->selectRaw('i.amount_due')->get();
        
        $total_invoce_amount = 0;
        foreach($invoce_amount as $amount){
            $total_invoce_amount += $amount->amount_due; 
        }
        $total_invoce_amount_paid =0;
        foreach($invoce_amount_paid as $amount_paid){
            $total_invoce_amount_paid += $amount_paid->amount_due; 
        }

        $cnt_bill_payment = DB::table('os_payments as i')->whereRaw($str_dates)->count('i.id');
        $cnt_bill_payment_paid =  DB::table('os_payments as i')->join('os_bill_payments as b','b.payment_id','=','i.id')->whereRaw($str_dates)->count('i.id');
        $bill_payment_amount =  DB::table('os_payments as i')->whereRaw($str_dates)->selectRaw('i.amount')->get();
        $bill_payment_amount_paid =  DB::table('os_payments as i')->join('os_bill_payments as b','b.payment_id','=','i.id')->whereRaw($str_dates)->selectRaw('b.total_price')->get();
        
        $total_bill_payment_amount = 0;
        foreach($bill_payment_amount as $payment){
            $total_bill_payment_amount += $payment->amount; 
        }
        $total_bill_payment_amount_paid = 0;
        foreach($bill_payment_amount_paid as $payment_paid){
            $total_bill_payment_amount_paid += $payment_paid->total_price; 
        }

        // if($total_shipment ==0) $total_shipment =1;
        $progress_cards [] = (object)[
            'cnt_invoice'=> $cnt_invoice,
            'invoce_paid_percent'=> number_format($cnt_invoice_paid *100 / $cnt_invoice,2),
            'total_invoce_amount'=> number_format($total_invoce_amount,2),
            'invoce_amount_paid '=> number_format($total_invoce_amount_paid,2),
            'invoice_color'=> '',

            'cnt_bill_payment'=> $cnt_bill_payment,
            'bill_payment_paid_percent'=> number_format($cnt_bill_payment_paid *100 / $cnt_bill_payment,2),
            'total_bill_payment_amount'=> number_format($total_bill_payment_amount,2),
            'total_bill_payment_amount_paid'=> number_format($total_bill_payment_amount_paid,2),
            'payment_color'=> '',
        ];

        //country_cards
        $rows = DB::table('os_shipments as s')->join('loc_countries as c', 'c.id','=','s.to_country_id')->selectRaw('COUNT(c.id) as count_shipment_by_country_id ,c.name as country_name ,c.id as country_id')->groupByRaw('c.id,c.name')->get();

        
        foreach($rows as $row){
            $shipment_by_country = null;
            $shipment_by_country = (object)[   
                'shipment_by_country'=> $row->count_shipment_by_country_id,
                'country_name'=>$row->country_name
            ];
            $country_cards [] = $shipment_by_country;
        }

        // supplier card
        $statuses = [1=>'Pending',2=>'Shipping',3=>'Validated'];
        return $rows = DB::table('os_shipments as s')->join('os_suppliers as sp', 'sp.id','=','s.supplier_id')->whereIn('s.status_id',$status_ids)->selectRaw('COUNT(sp.id) as count_by_status ,sp.name as supplier_name')->groupByRaw('sp.id,sp.name')->get();

        foreach($rows as $row){
            $shipment_by_country = null;
            $shipment_by_country = (object)[   
                'shipment_by_country'=> $row->count_shipment_by_country_id,
                'country_name'=>$row->country_name
            ];
            $country_cards [] = $shipment_by_country;
        }
        
        return (object)[
            'period'=>'Over last 90 days',
            'progress_cards' => $progress_cards,
            'country_cards' => $country_cards,
            'supplier_cards' => $supplier_cards
        ];
        

    }

}
