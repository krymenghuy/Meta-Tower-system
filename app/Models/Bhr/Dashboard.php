<?php

namespace App\Models\Bhr;
use DB;
// use App\Models\DV;
// use App\Models\Dms\PublicStorage;
// use Illuminate\Pagination\LengthAwarePaginator;
 
// use DateTime;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
// use Sanitizer;
//use Localization;
class Dashboard //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
     
    static function getCircleColor($status_id){
 
        $colors = [1=>'#EDD507',2=>'#07D1ED',3=>'#14A121'];
        return $colors[$status_id];
    }

    static function getCards($ss){   
        $branch_id = $ss->branch_id;
        $circle_cards=[];
        $normal_cards =[];
        $status_ids = [1,2,3];
        $statuses = [1=>'Pending',2=>'Shipping',3=>'Validated'];
        
        //$str_branch = 'branch_id = '.$branch_id ?? 0;
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
                    'colorSlice'=> self::getCircleColor($row->status_id)
                ];
           }else{
            $item= (object)[
                'value'=>0,
                'status'=> $statuses[$status_id],
                'colorSlice'=> self::getCircleColor($status_id)
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
            'title'=>'Total Customer',
            'value'=>$customer_cnt,
            'icon'=> '<i class="fas fa-user-plus text-info mb-2" style="font-size: 2rem;width: 100px;"></i>',
            'color'=>'#0000'

        ];

        $normal_cards [] = (object)[
            'title'=>'Active Customer',
            'value'=>$active_cnt,
            'icon'=> ' <i class="fas fa-user text-success mb-2"  style="font-size: 2rem;width: 100px;"></i>',
            'color'=>'#0000'

        ];
        
        $active_agent = DB::table('os_affiliates as f')->join('os_sales_agents as a','a.affiliate_id','=','f.id')->where('f.status_code','Active')->count('f.id');
        $normal_cards [] = (object)[
            'title'=>'Active Sales Agent',
            'value'=>$active_agent,
            'icon'=> ' <i class="fa fa-users text-success mb-2"  style="font-size: 2rem;width: 100px;"></i>',
            'color'=>'#0000'

        ];
        
        return (object)[
            'circle_cards' => $circle_cards,
            'normal_cards' => $normal_cards
        ];
    }

    static function getShipmentsByCustomer($ss){
        $branch_id = $ss->branch_id;
        $str_branch = 's.branch_id = '.($branch_id ?? 0);
        $start_date = date('Y-m-d', strtotime('-90 days'));
        $str_dates = 'DATE(s.create_date) >=  \''.$start_date.'\'';
        $cols = 's.customer_id, sd.name AS customer_name, COUNT(s.id) AS cnt, s.status_id, s.pmt_status_id, st.name AS status';
        $rows = DB::table('os_shipments as s')
            ->join('os_shipment_statuses as st','st.id','=','s.status_id')
            ->join('sender as sd','sd.id','=','s.customer_id')
            ->whereRaw($str_dates)->whereRaw($str_branch)
            ->selectRaw($cols)
            ->groupByRaw('s.customer_id,s.status_id,s.pmt_status_id, st.name, sd.name')->get();
        $countByStatus = [];
        $countByPmtStatus = [];

        $checkDuplicates = [];
        $suctomer_list = [];
        foreach($rows as $row){
            $customer_id = $row->customer_id;
            $shipment_status = strtolower($row->status);
            // if($shipment_status === 'validsted') $shipment_status ='success';
            $shipment_status = $shipment_status.'_count';

            $pmt_status = $row->pmt_status_id ==1? 'paid': 'unpaid';
            $pmt_status =   $pmt_status.'_count';
            if (!isset($countByStatus[$customer_id])) $countByStatus[$customer_id] = [];
            if (!isset($countByStatus[$customer_id][ $shipment_status])) $countByStatus[$customer_id][ $shipment_status] = 0;
            $countByStatus[$customer_id][ $shipment_status] += $row->cnt;
 
           if(!isset($countByPmtStatus[$customer_id])) $countByPmtStatus[$customer_id] = [];
           if(!isset($countByPmtStatus[$customer_id][$pmt_status])) $countByPmtStatus[$customer_id][$pmt_status] = 0;
           $countByPmtStatus[$customer_id][$pmt_status] += $row->cnt;
           
           //Collect the list of unique Supplier List (supplier_id, supplier_name)
           if(!in_array($customer_id,$checkDuplicates)){
            $suctomer_list[] =[
                'customer_id'=>$customer_id,
                'customer_name'=>$row->customer_name
              ];
              $checkDuplicates[] = $customer_id;
           }
           
        }
        
        foreach($suctomer_list as &$cus){
            $cus['total_shipment'] = 0;  
            $customer_id = $cus['customer_id'];
            \Log::info(json_encode($customer_id));
            $x = $countByStatus[$customer_id];
            \Log::info(json_encode($x));
            foreach($x as $shipment_status =>$count){
                $cus[$shipment_status] = $count; 
                $cus['total_shipment'] += $count;
            }
            $x = $countByPmtStatus[$customer_id];
                foreach($x as $pmt_status =>$count){
                $cus[$pmt_status] = $count; 
            }
        }
        return $suctomer_list;
    }

    static function getShipmentsBySupplier($ss){
        $branch_id = $ss->branch_id;
        $str_branch = 's.branch_id = '.($branch_id ?? 0);
        $start_date = date('Y-m-d', strtotime('-90 days'));
        $str_dates = 'DATE(s.create_date) >=  \''.$start_date.'\'';
        $cols = 's.supplier_id, sp.name AS supplier_name, COUNT(s.id) AS cnt, s.status_id, s.pmt_status_id, st.name AS status';
        $rows = DB::table('os_shipments as s')
        ->join('os_shipment_statuses as st','st.id','=','s.status_id')
        ->join('os_suppliers as sp','sp.id','=','s.supplier_id')
        ->whereRaw($str_dates)
        ->whereRaw($str_branch)
        ->selectRaw($cols)
        ->groupByRaw('s.supplier_id,s.status_id,s.pmt_status_id, st.name, sp.name')->get();
        $countByStatus = [];
        $countByPmtStatus = [];

        $checkDuplicates = [];
        $supplier_list = [];
        foreach($rows as $row){
            $supplier_id = $row->supplier_id;
            $shipment_status = strtolower($row->status);
            // if($shipment_status === 'validsted') $shipment_status ='success';
            $shipment_status = $shipment_status.'_count';

            $pmt_status = $row->pmt_status_id ==1? 'paid': 'unpaid';
            $pmt_status =   $pmt_status.'_count';
            if (!isset($countByStatus[$supplier_id])) $countByStatus[$supplier_id] = [];
            if (!isset($countByStatus[$supplier_id][ $shipment_status])) $countByStatus[$supplier_id][ $shipment_status] = 0;
            $countByStatus[$supplier_id][ $shipment_status] += $row->cnt;
 
           if(!isset($countByPmtStatus[$supplier_id])) $countByPmtStatus[$supplier_id] = [];
           if(!isset($countByPmtStatus[$supplier_id][$pmt_status])) $countByPmtStatus[$supplier_id][$pmt_status] = 0;
           $countByPmtStatus[$supplier_id][$pmt_status] += $row->cnt;
           
           //Collect the list of unique Supplier List (supplier_id, supplier_name)
           if(!in_array($supplier_id,$checkDuplicates)){
            $supplier_list[] =[
                'supplier_id'=>$supplier_id,
                'supplier_name'=>$row->supplier_name
              ];
              $checkDuplicates[] = $supplier_id;
           }
        }

        foreach($supplier_list as  &$sp){
            $supplier_id = $sp['supplier_id'];
            $x = $countByStatus[$supplier_id];
            foreach($x as $shipment_status =>$count){
                $sp[$shipment_status] = $count; 
            }
            $x = $countByPmtStatus[$supplier_id];
                foreach($x as $pmt_status =>$count){
                $sp[$pmt_status] = $count; 
            }
        }
        return $supplier_list;
    }

    static function getPaymentOverview($ss){
        $branch_id = $ss->branch_id;
        $str_branch = 'inv.branch_id = '.($branch_id ?? 0);
        $start_date = date('Y-m-d', strtotime('-90 days'));
        $str_invoice_dates = 'DATE(inv.create_date) >=  \''.$start_date.'\'';
        
        $paid_count = ', SUM(CASE inv.amount_paid >= inv.total_amount WHEN 1 THEN 1 ELSE 0 END) AS paid_count';
        $unpaid_count = ', SUM(CASE inv.amount_paid < inv.total_amount WHEN 1 THEN 1 ELSE 0 END) AS unpaid_count';
        $invoiceInfo = DB::table('os_invoices as inv')->whereRaw($str_invoice_dates)->whereRaw($str_branch)->selectRaw('COUNT(inv.id) AS invoice_count, SUM(inv.total_amount) AS total_amount, SUM(IFNULL(inv.amount_paid,0)) As amount_paid, SUM(IFNULL(inv.total_amount,0) - IFNULL(inv.amount_paid,0) ) AS amount_unpaid'.$paid_count.$unpaid_count)->get()->first();
          
        $total_invoice_amount = $invoiceInfo->total_amount;
        $total_invoice_amount_unpaid = $invoiceInfo->amount_unpaid;
        $invoice_count =  $invoiceInfo->invoice_count;
       
        $str_shipment_dates = 'DATE(s.create_date) >= \''.$start_date.'\'';
        $shipmentInfo = DB::table('os_shipments as s')->whereRaw($str_shipment_dates)->where('s.status_id',3)->selectRaw('COUNT(s.id) AS shipment_count, SUM(IFNULL(s.total_carrier_cost, 0)) AS total_bill_amount, SUM(CASE IFNULL(s.pmt_status_id,0) = 0 WHEN 1 THEN s.total_carrier_cost ELSE 0 END) AS total_bill_unpaid')->get()->first();
         
        $total_bill_amount =   $shipmentInfo->total_bill_amount;
        $total_bill_amount_unpaid = $shipmentInfo->total_bill_unpaid;
        $shipment_count =  $shipmentInfo->shipment_count;

        if($total_invoice_amount ==0) $total_invoice_amount =1; 
        $total_bill_amount = $total_bill_amount ?? 1;
        
        $non_invoiced_shipments = [];
        $rows = DB::table('os_shipments as s')->whereRaw($str_shipment_dates)->whereRaw('s.invoice_id is NULL')->join('os_shipment_statuses as st','st.id','=','s.status_id')->selectRaw('COUNT(s.id) As cnt, s.status_id, st.name AS status')->groupByRaw('s.status_id, st.name')->get();
        foreach($rows as $row){
            $shipment_status = strtolower($row->status);
            if(!isset($non_invoiced_shipments[$shipment_status])) $non_invoiced_shipments[$shipment_status] = 0;
            $non_invoiced_shipments[$shipment_status] += $row->cnt;
        }
 
        return [
            'invoice'=>[
                'background_color'=>'#17B915',
                'alt_color'=>'red',
                'alt_text_color'=>'white',
                'alt_percent'=> number_format( $total_invoice_amount_unpaid *100 / $total_invoice_amount,2),
                'alt_amount'=> number_format($total_invoice_amount_unpaid,2),
                'total_amount'=>$total_invoice_amount,
                'invoice_count'=>$invoice_count,
                'non_invoiced_shipments'=>$non_invoiced_shipments,
                'alt_notes'=>'Unpaid invoices $'.number_format($total_invoice_amount_unpaid,2).' of total $'.$total_invoice_amount.'    ('.$invoice_count.' invoices)'
             ],
             'bill'=>[
                'background_color'=>'#1884E3',
                'alt_color'=>'red',
                'alt_text_color'=>'white',
                'alt_percent'=> number_format($total_bill_amount_unpaid *100 / $total_bill_amount,2),
                'alt_amount'=> number_format($total_bill_amount_unpaid,2) ,
                'total_amount'=>$total_bill_amount,
                'shipment_count'=>$shipment_count,
                'alt_notes'=>  'Unpaid bill $'.number_format($total_bill_amount_unpaid,2).' of total $'.$total_bill_amount.'    ('.$shipment_count.' shipments)'
             ]
        ];
    }

    /** getOverviewData() is the second API for dashboard. It returns second halft of data for dashboard */
    static function getOverviewData($ss){   
        return (object)[
            'period'=>'Over last 90 days',
            'progress_bars' =>self::getPaymentOverview($ss),
            'customer_table' => self::getShipmentsByCustomer($ss),
            'supplier_table' => self::getShipmentsBySupplier($ss)
 
        ];
    }

}
