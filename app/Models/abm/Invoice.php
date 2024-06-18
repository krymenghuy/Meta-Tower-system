<?php

namespace App\Models\Abm;

use DB;
use Sanitizer;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Dms\PublicStorage;



class Invoice //extends Model
{


    protected $id = null;
    protected $userInfo = null;

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function save($filter, $id = null, $ss = null)
    {
        // $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $d = (object) $filter;
        // return $d;
        $end_date = isset($d->end_date) ? $d->end_date : null;
        $start_date = isset($d->start_date) ? $d->start_date : null;
        $customer = isset($d->customer) ? $d->customer : null;
        $discount_percent = isset($d->discount_percent) ? $d->discount_percent : 0;
        $str_cus = '1=1';
        if ($customer) {
            $str_cus = 'os.sender_id=' . $customer;

        } else
            return (object) ['status' => 'error', 'status_code' => 405, 'error_message' => 'For Customer can not be empty. Please Select Customer'];
        if ($start_date && $end_date) {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);
            if ((bool) strtotime($start_date) && (bool) strtotime($end_date)) {
                $str_dates = "DATE(os.create_date) >= '$start_date' AND DATE(os.create_date) <= '$end_date'";
                // return $start_date;
            }
            // elseif($end_date){
            //    $start_date = date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days'));
            //    $str_dates = "DATE(os.create_date) >= '$start_date' AND DATE(os.create_date) <= '$end_date'";
            //     // return $str_dates;
            // }
        } else
            return (object) ['status' => 'error', 'status_code' => 405, 'error_message' => 'Requier start date and end date! Please Enter start date and end date.'];


        $queryShipments = DB::table('os_shipments as os')
            // ->join('affiliates as sa','os.primary_cp_id','=','sa.id') // Perform an inner join
            // ->join('loc_countries as lc', 'lc.id', '=', 'os.to_country_id')
            ->join('os_bill_validation as bv', 'bv.waybill_no', '=', 'os.qr_code')
            // ->join('price_list_details as p', 'p.country_id', '=', 'os.to_country_id')
            // ->join('os_package_statuses as st', 'st.id', '=', 'os.status_id')
            // ->join('sender as sd', 'sd.id', '=', 'os.sender_id')
            ->whereRaw($str_dates)
            ->whereRaw($str_cus)


            // ->select('r.id','r.name','r.project_id','p.name as project','s.name as status ' , 'r.description' );
            ->selectRaw('os.id,os.code, bv.session_id ,os.paid_status_id ,os.status_id, os.total_price as amount, bv.carrier_amount as carrier_amount , formatDate(os.create_date) as create_date')
            ->get();
        $unique_id = $this->getUnique_id($queryShipments);
        $ret_rows = [];
        $shipment_count = 0;
        foreach ($unique_id as $id) {
            $m = $this->getShipmentList($id, $queryShipments);
            $ret_rows[] = $m;
        }
        if ($ret_rows == null)
            return (object) ['status' => 'error', 'status_code' => 405, 'error_message' => 'This Customer doesn`t have Shipment for Create Invoice'];

        $total_amount = 0;
        $unvalidate = 0;
        $created_invoice = 0;
        $data = [];
        foreach ($ret_rows as $i => $row) {
            // return $row->status_id;
            $shipment_count++;
            $total_amount += $row->amount;
            $check['paid_status_id'] = $row->paid_status_id;
            $check['status_id'] = $row->status_id;
            if ($check['status_id'] < 3) {
                $unvalidate++;
                $data[] = $row->code;
            }
            if ($check['status_id'] == 4) {
                $created_invoice++;
                $data[] = $row->code;

            }

            // if(!$check) {
            //     $shipment_un_Waybill_no [$i+3] = $Waybill_no;
            //     $non ++;
            // }
        }
        if ($unvalidate > 0)
                return (object) ['status' => 'error', 'status_code' => 405, 'error_message' =>  ' This Shipment Can`t Create Invoice. You must validate shipment', 'data' => $data];
            else if ($created_invoice > 0)
                return (object) ['status' => 'error', 'status_code' => 405, 'error_message' =>  ' This ('.$customer.') is already Create Invoice for Customer', 'data' => $data];
        $discount_amount = 0;
        if ($discount_percent) {
                $discount_amount = ($total_amount * $discount_percent) / 100;
        }
        $amount_due = $total_amount - $discount_amount;
        $arr = [
            'sender_id' => $customer,
            'amount' => $total_amount,
            'amount_due'=>$amount_due,
            'discount_percent'=>$discount_percent,
            'discount_amount'=>$discount_amount,
            'shipment_count' => $shipment_count,
        ];
        $v_rule = [
            'id' => '0|identity=1',
            'sender_id' => '0|number|exists=sender.id',
            'invoice_type_id' => '0|number|default = 2',
            'amount' => '0|number|default = 0',
            'discount_percent' => '0|number|default = 0',
            'discount_amount' => '0|number|default = 0',
            'amount_due' => '0|number|default = 0',
            'pmt_terms' => '0|string|35',
            'public_remarks' => '0|string|255',
            'private_remarks' => '0|string|255',
            'status_id' => '1|number|default =1',
            'shipment_count' => '0|number|default = 0',

        ];

        $res = validateObject($arr, $v_rule, 1, [], $ss->lang, 0, null);
        if ($res->error)
            return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id;
        $supplier_created = !$id;
        // return JDV::result($inputs);
        $id = saveData($ss, 'os_invoices', ['id' => $id], $inputs, [], 1, 0);
        $created_invoice = DB::table('os_invoice_payments')->count('id');
        // if ($id > 0) {
        //     DB::table('os_shipments')->where('id', $d->shipment_id)->update(['paid_status_id' => 2, 'trx_id' => $trx_id]);
        // }
        // return DV::error('Something went wrong in saving sender profile');
        if ($id > 0) {
            $new_code = null;

            if ($supplier_created) {
                $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
                //$inputs['code'] = $new_code;
                DB::table('os_invoices')->where('id', $id)->update(['code' => $new_code]);
            }
            foreach ($ret_rows as $i => $row) {
                DB::table('os_shipments')->where('id', $row->id)->update(['status_id' => 4, 'customer_trx_id' => $created_invoice]);
            }

        }


        return DV::depends($id, ['action' => 'saved']);
    }



    // function save($arr, $id=null,$ss=null){
    //     // $id = $id ?? $this->id;
    //     $ss = $ss ?? $this->userInfo;
    //     $branch_id = $ss->branch_id;
    //     $d = (object)$arr;

    //     $v_rule = [
    //         'id'=>'0|identity=1',
    //         'sender_id' => '0|number|exists=sender.id',
    //         'shipment_id'=>'0|number|exists=shipment_id',
    //         'invoice_type'=>'0|choice|informal,commercial,tax',
    //         'amount'=>'0|number|default = 0.00',
    //         'discount_percent'=>'0|number',
    //         'discount_amount'=>'0|number|default = 0.00',
    //         'amount_due'=>'0|number|default = 0.00',
    //         'pmt_terms'=>'0|string|35',
    //         'public_remarks'=>'0|string|255',
    //         'private_remarks'=>'0|string|255',
    //         'status_id'=>'1|number|default =1',

    // ];

    //     $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
    //     if($res->error) return DV::error($res->error);
    //     $inputs = $res->values;
    //     $id = $res->id; 
    //     $d = (object)$inputs;

    //     $supplier_created = !$id;

    //     $id = saveData($ss,'os_invoices',['id'=>$id],$inputs,[],1,0);   
    //     if($id > 0){
    //         $new_code = null;


    //         if ($supplier_created){
    //             $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
    //             //$inputs['code'] = $new_code;
    //             DB::table('os_invoices')->where('id',$id)->update(['code'=>$new_code]);
    //          }a

    //     }
    // //return DV::error('Something went wrong in saving sender profile');
    //     return DV::depends($id,['action'=>'saved']);

    // }
    function getNextSenderCode($uss, $len = 5)
    {
        $branch_id = $uss->branch_id;
        $prefix = 'IVN-';
        $str_prefix = $prefix ? 'prefix =\'' . $prefix . '\'' : '2=2';
        $row = DB::table('sender_code_control AS c')->where('branch_id', $branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
        if ($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num += 1;
            DB::table('sender_code_control')->where('branch_id', $branch_id)->whereRaw($str_prefix)->update(['last_id' => $num]);
            return $prefix . $branch_id . formatNumber($num, $len);
        }
        DB::table('sender_code_control')->insert(array('branch_id' => $branch_id, 'last_id' => 1, 'prefix' => $prefix));
        return $prefix . $branch_id . formatNumber(1, $len);
    }
    function getInvoiceList()
    {
        return DB::table('os_invoices')
            // ->join('sender as s','s.id',"=","ci.sender_id")
            // ->join('os_shipments as sh','sh.id','=','ci.shipment_id')
            ->selectRaw('id,sender_id,invoice_type,amount,discount_percent,discount_amount,discount_type,amount_due,issue_date,due_date,pmt_terms,create_date')->get();

    }

    function getShipmentList($id, $rows)
    {
        $i = 0;
        $c = 0;

        $data = [];
        // return JDV::result($rows);

        do {
            if (!isset($rows[$i]))
                break;
            $c = $rows[$i];
            //     $item_type = strtolower($c->item_type); 
            if ($c->id == $id) {
                $data = $c;
            }
            $i++;
        } while ($c);


        // $data = (object)['data'=>$data];
        // return JDV::result($data);

        return $data;
    }
    function getUnique_id($rows)
    {
        // return $rows;
        $unique_id = [];
        foreach ($rows as $row) {
            if (!in_array($row->id, $unique_id)) {
                $unique_id[] = $row->id;
            }
        }
        return $unique_id;
    }
    function getInvoiceListPaginate($filter, $ss)
    {
        $branch_id = $ss->branch_id;
        $d = (object) $filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        $search_value = isset($d->search_value) ? $d->search_value : null;
        $end_date = isset($d->end_date) ? $d->end_date : null;
        $start_date = isset($d->start_date) ? $d->start_date : null;

        $status_code = isset($d->status_code) ? $d->status_code : null;
        // $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $str_srch = '1=1';
        $str_where = '2=2';
        $str_dates = '3=3';

        if ($search_value) {
            $skip_row = 0;
            $str_srch = "(s.name LIKE '%" . $search_value . "%' OR ci.code ='" . $search_value . "' )";

        }
        if ($status_code) {
            $str_where = 'ci.status_id = \'' . $status_code . '\'';
        } else {
            $end_date = convertDate($end_date);
            $start_date = convertDate($start_date);
            if ((bool) strtotime($start_date) && (bool) strtotime($end_date)) {
                $str_dates = "DATE(ci.create_date) >= '$start_date' AND DATE(ci.create_date) <= '$end_date'";
                // return $start_date;
            } else if ($end_date) {
                $start_date = date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days'));
                $str_dates = "DATE(ci.create_date) >= '$start_date' AND DATE(ci.create_date) <= '$end_date'";
                // return $str_dates;

            }
        }
        // if($price_list_id){
        //     $str_where = 's.price_list_id = '.$price_list_id;
        // }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
        // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('os_invoices as ci')
            ->join('os_invoice_types as oit', 'oit.id', '=', 'ci.invoice_type_id')
            ->join('sender as s', 's.id', '=', 'ci.sender_id')
            ->join('os_invoice_statuses as ois', 'ois.id', '=', 'ci.status_id')

            ->whereRaw($str_srch)
            ->whereRaw($str_where)
            ->whereRaw($str_dates)

            ->selectRaw('ci.id,ci.code,ci.shipment_count,ci.update_user,formatDate(ci.due_date) as due_date,ci.discount_percent,ci.amount_due,formatDate(ci.create_date) as create_date,ci.update_date,oit.name as invoice_type,ois.name as status,s.name,s.email,s.address,s.phone_number,ci.amount,discount_type,ci.pmt_terms')->orderBy('ci.id', 'DESC');
        ;

        // return $query;eeeee
        $clone_query = clone $query;
        $count = $clone_query->count('ci.id');
        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        $rows = $query->skip($skip_row)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
        // return $rows;

    }
    static function getFormOptions($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $invoice_details = null;
        if ($id > 0)
            $invoice_details = self::details($id, $ss);
        $data = (object) [];
        $data->invoice = $invoice_details;
        // $data->branches = [(object)['id'=>1,'branch_name'=>'Head Quarter']];
        // $data->sender_types = DB::table('sender_type')->where('branch_id',$branch_id)->selectRaw('id,name AS sender_type')->get();
        // $data->business_types = DB::table('sender_business_types')->selectRaw('business_type AS code,business_type')->get();
        $data->invoice_statuses = DB::table('os_invoice_statuses')->selectRaw('code as status_code, name AS status_name')->get();
        // $data->sales_agents = DB::table('os_affiliates AS sa')->where('branch_id', $branch_id)->selectRaw('sa.id,sa.name AS agent_name')->get();
        // $data->price_list = DB::table('price_list_names AS l')->where('branch_id', $branch_id)->selectRaw('l.id,l.name')->get();
        $data->customer = DB::table('sender as s')->where('branch_id', $branch_id)->selectRaw('s.id,s.name as sender')->get();
        $data->invoice_type = DB::table('os_invoice_types as oit')->selectRaw('oit.id,oit.name as invoice_type')->get();

        return $data;
    }

    static function details($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $row = DB::table('os_invoices')->selectRaw('id,sender_id,invoice_type_id,amount,discount_percent,discount_amount,discount_type,amount_due,issue_date,due_date,pmt_terms,create_date')->where('branch_id', $branch_id)->where('id', $id)->take(1)->first();

        return $row;
    }
    function deleteInvoice($id)
    {

        $id = $id ?? $this->id;

        $delete = DB::table('os_invoices')->where('id', $id)->delete();
        return DV::depends($delete, ['action', 'deleted']);
    }

}
