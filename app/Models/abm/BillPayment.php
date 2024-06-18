<?php

namespace App\Models\Abm;
use DB;
use App\Models\DV;
use App\Models\Dms\PublicStorage;
use Illuminate\Pagination\LengthAwarePaginator;
use DateTime;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use Sanitizer;

class BillPayment //extends Model
{   
    protected $id = null;
    protected $userInfo = null;
    // protected static $img_dir = 'os_supplier';
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo =$userInfo;
    }
    function save($arr, $id=null,$ss=null){
        // $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        
        $v_rule = [
            'id'=>'0|identity=1',
            'payee_id'=>'1|string',
            'payee_type'=>'0|number',
            'payment_date'=>'1|date',
            'amount'=>'1|number|default =0.00',        
            'currency_code'=>'1|string',
            'pmt_method'=>'1|number',
            'reshape_number'=>'0|number',       
            'remarks'=>'0|string|0-150'       
        ];

    
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id; 
        $d = (object)$arr;
        
        // return $d->shipment_id;
        $check = DB::table('os_shipments as os')->where('os.id',$d->shipment_id)->select('os.code','paid_status_id','status_id')->first();
        // return $check;
        if($check->paid_status_id == 2)
            return (object)['status'=>'error','status_code'=>405,'error_message'=>'Shipment('.$check->code.') already paid!','data'=>$check->code];
        if($check->status_id == 2)
            return (object)['status'=>'error','status_code'=>405,'error_message'=>'Shipment('.$check->code.') Validate unacceptable!','data'=>$check->code];
        $supplier_created = !$id; 
        // return JDV::result($inputs);
        $id = saveData($ss,'os_bill_payments',['id'=>$id],$inputs,[],1,0);   
        $trx_id = DB::table('os_bill_payments')->count('id');
        if($id > 0){
            DB::table('os_shipments')->where('id',$d->shipment_id)->update(['paid_status_id'=>2,'trx_id'=>$trx_id]);
            $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$d->shipment_id)->first();
            $arr = [
                'payment_id' => $trx_id,
                'code'=>$shipmentInfo->code,
                'qr_code'=>$shipmentInfo->qr_code,
                'supplier_id'=>$shipmentInfo->supplier_id,
                'item_type'=>$shipmentInfo->item_type,        
                'total_weight'=>$shipmentInfo->total_weight,
                'carrier_total_weight'=>$shipmentInfo->carrier_total_weight,
                'total_price'=>$shipmentInfo->total_price,
                'total_carrier_cost'=>$shipmentInfo->total_carrier_cost,    
                'total_special_charge'=>$shipmentInfo->total_special_charge,    
                'remarks'=>$shipmentInfo->remarks     
            ]; 
            $v_rule = [
                'id'=>'0|identity=1',
                'payment_id' => '1|number',
                'code'=>'1|string',
                'qr_code'=>'0|number',
                'supplier_id'=>'1|number',
                'item_type'=>'1|string',        
                'total_weight'=>'1|number',
                'carrier_total_weight'=>'1|number',
                'total_price'=>'0|number',  
                'total_carrier_cost'=>'0|number',    
                'total_special_charge'=>'0|number',    
                'remarks'=>'0|string|0-150'       
            ];
    
            $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
            // return $res;
            if($res->error) return DV::error($res->error);
            $inputs = $res->values;
            $id = $res->id; 
            $supplier_created = !$id;
            // return JDV::result($inputs);
            $id = saveData($ss,'os_bill_payments',['id'=>$id],$inputs,[],1,0);  
        // return $shipmentInfo;
        }
    //return DV::error('Something went wrong in saving sender profile');
        return DV::depends($id,['action'=>'saved']);
    }

    function saveMany($filter, $id=null,$ss=null){
        // $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return $d;
        $payee_id = isset($d->payee_id) ? $d->payee_id : null;
        $to_date = isset($d->to_date) ? $d->to_date : null;
        $from_date = isset($d->from_date) ? $d->from_date : null;
        $str_dates = '2=2';
        $str_payee = '1=1';
        if($payee_id){
            $str_payee = 'os.supplier_id = '.$payee_id;
        }
        if($from_date && $to_date){
            $to_date = convertDate($to_date);
            $from_date = convertDate($from_date);
            if ((bool)strtotime($from_date) && (bool)strtotime($to_date)) {
                $str_dates = "DATE(os.create_date) >= '$from_date' AND DATE(os.create_date) <= '$to_date'";
            // return $start_date;
            }
            // elseif($end_date){
            //    $start_date = date('Y-m-d', strtotime(date('Y-m-d') . ' -90 days'));
            //    $str_dates = "DATE(os.create_date) >= '$start_date' AND DATE(os.create_date) <= '$end_date'";
            //     // return $str_dates;
            // }
        }else return (object)['status'=>'error','status_code'=>405,'error_message'=>'Requier from date and to date! Please Enter from date and to date.'];

        $queryShipments = DB::table('os_shipments as os')
            // ->join('affiliates as sa','os.primary_cp_id','=','sa.id') // Perform an inner join
            // ->join('loc_countries as lc', 'lc.id', '=', 'os.to_country_id')
            ->join('os_bill_validation as bv', 'bv.waybill_no', '=', 'os.qr_code')
            // ->join('price_list_details as p', 'p.country_id', '=', 'os.to_country_id')
            // ->join('os_package_statuses as st', 'st.id', '=', 'os.status_id')
            // ->join('sender as sd', 'sd.id', '=', 'os.sender_id')
            ->whereRaw($str_dates)
            ->whereRaw($str_payee)
            // ->select('r.id','r.name','r.project_id','p.name as project','s.name as status ' , 'r.description' );
            ->selectRaw('os.id,os.code, bv.session_id ,os.paid_status_id ,os.status_id, os.total_price as amount, bv.carrier_amount as carrier_amount , formatDate(os.create_date) as create_date')
            ->get();
        
        $unique_id = $this->getUnique_id($queryShipments);
        $ret_rows = [];
        $shipment_count = 0;
        foreach($unique_id as $id){
            $m = $this->getShipmentList($id,$queryShipments);  
            $ret_rows[] = $m;  
        }
        if($ret_rows == null) return (object)['status'=>'error','status_code'=>405,'error_message'=>'From '.$from_date.' to '.$to_date.' Don\'t have shipment to pay!'];
        
        $total_amount = 0;
        $paid = 0;
        $unValidate = 0;
        $data = [];
        $amount = 0;
        foreach ($ret_rows as $i=>$row){
            // return $row->status_id;
            $check['paid_status_id'] = $row->paid_status_id;
            $check['status_id'] = $row->status_id;
            if($check['status_id'] == 3 && $check['paid_status_id'] == 2) {
                $paid ++;
                $data ['paid '.$paid] = $row->code;
            }
            else if($check['status_id'] < 3 ) {
                $unValidate ++;
                $data ['unValidate '.$unValidate] = $row->code;
            }
            $shipment_count++;
            $amount += $row->carrier_amount;
        }
        // return $amount;
        if($paid > 0 || $unValidate > 0) return (object)['status'=>'error','status_code'=>405,'error_message'=>'Shipment already paid: '.$paid.' , <br>and Shipment UnValidate: '.$unValidate,'data'=>$data];   
        // if($paunValidateid > 0) return (object)['status'=>'error','status_code'=>405,'error_message'=>$paid.' Shipment already paid:','data'=>$data];   
        // return $data;
        $payment_date = isset($d->payment_date) ? $d->payment_date : null;
        // $amount = isset($d->amount) ? $d->amount : null;
        $currency_code = isset($d->currency_code) ? $d->currency_code : null;
        $pmt_method = isset($d->pmt_method) ? $d->pmt_method : null;
        $remarks = isset($d->remarks) ? $d->remarks : null;
        $reshape_number = isset($d->reshape_number) ? $d->reshape_number : null;
        $arr = [
            'payee_id'=>$payee_id,
            'payee_type'=>'',
            'payment_date'=>$payment_date,
            'amount'=>$amount,        
            'currency_code'=>$currency_code,
            'pmt_method'=>$pmt_method,
            'reshape_number'=>$reshape_number,
            'shipment_count'=>$shipment_count,    
            'remarks'=>$remarks      
        ]; 
        $v_rule = [
            'id'=>'0|identity=1',
            'payee_id'=>'1|string',
            'payee_type'=>'0|number',
            'payment_date'=>'1|date',
            'amount'=>'1|number|default =0.00',        
            'currency_code'=>'1|string',
            'pmt_method'=>'1|number',
            'reshape_number'=>'0|number',  
            'shipment_count'=>'0|number',    
            'remarks'=>'0|string|0-150'       
        ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        // return $res;
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id; 
        $supplier_created = !$id;
        // return JDV::result($inputs);
        $id = saveData($ss,'os_bill_payments',['id'=>$id],$inputs,[],1,0);   
        $trx_id = DB::table('os_bill_payments')->count('id');
        if($id > 0){
            foreach ($ret_rows as $row){
                DB::table('os_shipments')->where('id',$row->id)->update(['paid_status_id'=>2,'trx_id'=>$trx_id]);

                $shipmentInfo = DB::table('os_shipments as os')->where('os.id',$row->shipment_id)->first();
                $arr = [
                    'payment_id' => $trx_id,
                    'code'=>$shipmentInfo->code,
                    'qr_code'=>$shipmentInfo->qr_code,
                    'supplier_id'=>$shipmentInfo->supplier_id,
                    'item_type'=>$shipmentInfo->item_type,        
                    'total_weight'=>$shipmentInfo->total_weight,
                    'carrier_total_weight'=>$shipmentInfo->carrier_total_weight,
                    'total_price'=>$shipmentInfo->total_price,
                    'total_carrier_cost'=>$shipmentInfo->total_carrier_cost,    
                    'total_special_charge'=>$shipmentInfo->total_special_charge,    
                    'remarks'=>$shipmentInfo->remarks     
                ]; 
                $v_rule = [
                    'id'=>'0|identity=1',
                    'payment_id' => '1|number',
                    'code'=>'1|string',
                    'qr_code'=>'0|number',
                    'supplier_id'=>'1|number',
                    'item_type'=>'1|string',        
                    'total_weight'=>'1|number',
                    'carrier_total_weight'=>'1|number',
                    'total_price'=>'0|number',  
                    'total_carrier_cost'=>'0|number',    
                    'total_special_charge'=>'0|number',    
                    'remarks'=>'0|string|0-150'       
                ];
        
                $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
                // return $res;
                if($res->error) return DV::error($res->error);
                $inputs = $res->values;
                $id = $res->id; 
                $supplier_created = !$id;
                // return JDV::result($inputs);
                $id = saveData($ss,'os_bill_payments',['id'=>$id],$inputs,[],1,0); 
            }
        }
    //return DV::error('Something went wrong in saving sender profile');
        return DV::depends($id,['action'=>'saved']);
    }


    function getUnique_id($rows){
        // return $rows;
        $unique_id = [];
        foreach($rows as $row){
            if(!in_array($row->id,$unique_id)){
                $unique_id[] = $row->id;
            }    
        }
        return $unique_id;
    }
    function getShipmentList($id,$rows){
        $i=0;
        $c=0;
        $data = [];
        do{
           if(!isset($rows[$i])) break;
           $c = $rows[$i];
    //     $item_type = strtolower($c->item_type); 
            if($c->id == $id) {  
                $data = $c;
            } 
           $i++;
        }while($c);
        return $data;
    }

    function getSuplierList(){
        // return JDV::result(DB::table('shipments')->selectRaw('zone_code,sender_id')->get());
        return DB::table('os_bill_payments')->selectRaw('id,name, phone_number, email, address,status_code,price_list_id,formatDate(create_date) as create_date,DATE_FORMAT(create_date,\'%r\') AS request_time')->get();
    }

    function checkUniquePerson($branch_id,$phone_number,$id=null){
        $str_id ="1=1";
        if(!$phone_number) return 'Phone number cannot be empty';
        if ($id>0) $str_id="s.id <> $id";
        $x = DB::table('os_bill_payments as s')->where('s.branch_id',$branch_id)->where("s.phone_number",$phone_number)->whereRaw($str_id)->select('id')->take(1)->exists();
        if ($x) return 'Phone number "'.$phone_number.'" is already save...';
        return null;
      }

      function detailsForPayment($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        $to_date = isset($d->to_date) ? $d->to_date : null;
        $from_date = isset($d->from_date) ? $d->from_date : null;
        $payee_id = isset($d->payee_id) ? $d->payee_id : null;
        $str_dates = '2=2';
        $str_payee = '1=1';
        // return $filter;
        if($from_date && $to_date){
            if($payee_id){
                $str_payee = 'os.supplier_id = '.$payee_id;
            }
            $to_date = convertDate($to_date);
            $from_date = convertDate($from_date);
            if ((bool)strtotime($from_date) && (bool)strtotime($to_date)) {
                $str_dates = "DATE(os.create_date) >= '$from_date' AND DATE(os.create_date) <= '$to_date'";
            // return $start_date; 
            }
            
            $rows = DB::table('os_shipments as os')->join('os_suppliers as sp','sp.id','=','os.supplier_id')
            ->where('os.branch_id',$branch_id)
            ->whereRaw($str_dates)
            ->whereRaw($str_payee)
            ->selectRaw('os.id, os.code,os.supplier_id as payee_id ,os.qr_code, os.item_type , os.remarks , os.sender_id as payer_id, os.zone_code, os.status_id, os.to_country_id, os.from_country_id, os.primary_cp_id , os.secondary_cp_id , os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.carrier_total_weight , os.total_price as amount ,os.carrier_cost , os.carrier_special_charge , os.total_carrier_cost , os.total_special_charge , os.receiver_name , os.receiver_address , package_qty , formatDate(os.create_date) as create_date , DATE_FORMAT(os.create_date,\'%r\') AS request_time')
            ->get();
            // $unique_id = $this->getUnique_id($rows);
            // $ret_rows = [];
            // $shipment_count = 0;
            // foreach($unique_id as $id){
            //     $m = $this->getShipmentList($id,$rows);  
            //     $ret_rows[] = $m;  
            // }
            $total_amount = 0;
            $shipment_count = 0;
            foreach($rows as $row){
                 $total_amount += $row->amount;
                 $shipment_count++;
            }
            $from_date = new DateTime($from_date);
            $to_date = new DateTime($to_date);
            // return $total_amount;
            return (object)[
                'from_date'=>$from_date->format('d-M-Y'),
                'to_date'=>$to_date->format('d-M-Y'),
                'payee_id'=>$payee_id,
                'payment_date'=>'',
                'amount'=>$total_amount,        
                'currency_code'=>'',
                'pmt_method'=>'',
                'reshape_number'=>'',
                'shipment_count'=>$shipment_count,    
                'remarks'=>''     
            ];
        }
        // $row = DB::table('os_shipments as os')->join('os_suppliers as sp','sp.id','=','os.supplier_id')
        // ->where('os.id',$id)
        // ->where('os.branch_id',$branch_id)
        // ->selectRaw('os.id, os.code,os.supplier_id as payee_id ,os.qr_code, os.item_type , os.remarks , os.sender_id as payer_id, os.zone_code, os.status_id, os.to_country_id, os.from_country_id, os.primary_cp_id , os.secondary_cp_id , os.effective_weight , os.actual_weight , os.markup_weight , os.total_weight , os.carrier_total_weight , os.total_price as amount ,os.carrier_cost , os.carrier_special_charge , os.total_carrier_cost , os.total_special_charge , os.receiver_name , os.receiver_address , package_qty , formatDate(os.create_date) as create_date , DATE_FORMAT(os.create_date,\'%r\') AS request_time')
        // ->take(1)->first();
        return (object)[];
    }

    function getSuplierListPaginate($filter,$ss){
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        // return JDV::result($filter->page);

        $current_page = isset($d->current_page)?$d->current_page:1;
        $per_page = isset($d->per_page)?$d->per_page:10;
        $search_value = isset($d->search_value)?$d->search_value:null;
        
        $status_code = isset($d->status_code)?$d->status_code:null;
        $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
        $str_srch = '1=1';
        $str_where = '2=2';
        if($search_value){
            $skip_row = 0;
            $str_srch = '(s.name LIKE \'%'.$search_value.'%\')';
        }
        if($status_code){
            $str_where = 's.status_code = \''.$status_code.'\'';
        }
        // if($price_list_id){
        //     $str_where = 's.price_list_id = '.$price_list_id;
        // }
        $skip_row = ($current_page - 1) * $per_page;
        //$projectName = ',(SELECT p.name FROM projects as p WHERE p.id = r.project_id) as project';
       // $query = DB::table('requirements as r')->whereRaw($str_srch)->selectRaw('r.id,r.description,r.status_id'.$projectName);
        $query = DB::table('os_bill_payments as s')
                ->join('os_affiliates as sa','sa.id','=','s.sales_agent_id')
                ->whereRaw($str_srch)
                ->whereRaw($str_where)
                ->selectRaw('s.id ,s.code, s.name, s.phone_number,s.photo_file_name, s.email, s.address, s.status_code,s.branch_id, s.price_list_id,getPriceListName(s.price_list_id) AS price_list_name,s.sales_agent_id,sa.type_from_affilliate_type,sa.name as sales_agent,s.create_user,formatDate(s.create_date) as created_at,DATE_FORMAT(s.create_date,\'%r\') AS request_time' )->orderBy('s.id', 'DESC');;
       
        // return $query;
        $clone_query = clone $query;
        $count = $clone_query->count('s.id');
        // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
        $rows = $query->skip($skip_row)->take($per_page)->get();
        foreach($rows as $row){
            $row->image_url = '';
            if($row->photo_file_name) $row->image_url = PublicStorage::getUrl($row->branch_id,'general','image').$row->photo_file_name;
            unset($row->photo_file_name);
            if(!$row->image_url) $row->image_url =self::defaultImage($ss->branch_id);
        }
        return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
        // return $rows;

    }

    static function defaultImage($branch_id){
        return PublicStorage::getUrl($branch_id,'default','image').'mr3.jpg';
    }

    function setPriceList($price_list_id,$id=null,$ss =null){
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $p = getDataRow('price_list_names',["id"=>$price_list_id],"id,name");
        if(!$p) return DV::error("Price list ID is not valid");
        $p_name = $p->name;
        DB::table('os_bill_payments')->where('id',$id)->update(array(
        'price_list_id'=>$price_list_id));
        // return JDV::result($price_list_id );
        return DV::success(['list_name'=>$p_name,'list_id'=>$price_list_id]);
    }

    // function details($id,$ss){
    //     $id = $id ?? $this->id;
    //     $branch_id = $ss->branch_id;

    //     $row = DB::table('requirements as r')->where('r.id',$id)->where('r.branch_id',$branch_id)->selectRaw('r.id,r.project_id,r.description,r.status_id')->first();
    //     return $row;
    // }
    
    function delete($id){

        $id = $id ?? $this->id;

        $delete = DB::table('os_bill_payments')->where('id',$id)->delete();
        return DV::depends($delete,['action','deleted']);
    }

    function getNextSenderCode($uss,$len =4){
        $branch_id = $uss->branch_id;
        $prefix ='SP';
        $str_prefix = $prefix? 'prefix =\''.$prefix.'\'' : '2=2';
        $row = DB::table('sender_code_control AS c')->where('branch_id',$branch_id)->whereRaw($str_prefix)->selectRaw('TRIM(c.prefix) AS prefix,c.last_id')->take(1)->first();
        if($row) {
            $num = $row->last_id;
            $prefix = trim($row->prefix);
            $num +=1;
            DB::table('sender_code_control')->where('branch_id',$branch_id)->whereRaw($str_prefix)->update(['last_id'=>$num]);
            return $prefix.$branch_id.formatNumber($num,$len);
        }
        DB::table('sender_code_control')->insert(array('branch_id'=>$branch_id,'last_id'=>1,'prefix'=>$prefix));
        return $prefix.$branch_id.formatNumber(1,$len);
    }
    
    function updateStatus($status_code,$id=null,$ss=null){
        $ss = $ss?$ss:$this->userInfo;
        $id = $id?$id:$this->id;
        if(in_array(strtolower($status_code),['inactive','locked','disabled'])){
            $err = self::getOutstandingBalanceError($id);
            if($err) return DV::error($err);
            }
        $x = DB::table('os_bill_payments')->where('id',$id)->update([
            'status_code'=>$status_code
        ]);
        return DV::depends($x,['Supplier status','updated']);
        //if(!$x) return DV::error('It seems that provided merchant identity does not exist');
        // $um = new \App\Models\UM();
        // $user_id = DB::table('um_users')->where('official_id',$id)->take(1)->value('id');
        // $res = $um->setUserStatus($status_code,$user_id);
        // return $res;
    }
    static function getOutstandingBalanceError($id){
     $row = DB::table('package as p')->join('sender as s','s.id','=','p.sender_id')->where('p.status_id',8)->where('s.id',$id)->whereRaw('IFNULL(p.sender_pmt_status_id,0) =0')->selectRaw('COUNT(p.id) AS item_count,SUM(IFNULL(p.sender_total,0)) AS amount')->get()->first();
     if(!$row) return null;
     if ($row->item_count > 0 ) return 'មិន​អាច​លុប ឬ​បិទ​គណនី​នេះ​បាន​ទេ ព្រោះ​មាន​កញ្ចប់ '.$row->item_count.' ដែល​មិន​ទាន់​បាន​ទូទាត់​ប្រាក់';
     return null;
  }
    static function getFormOptions($id,$ss){   
        $branch_id = $ss->branch_id;
        $supplier_details = null;
        if($id>0) $supplier_details = self::details($id,$ss);
        $data= (object)[];
        $data->supplier = $supplier_details;
        // $data->branches = [(object)['id'=>1,'branch_name'=>'Head Quarter']];
        // $data->sender_types = DB::table('sender_type')->where('branch_id',$branch_id)->selectRaw('id,name AS sender_type')->get();
        $data->business_types = DB::table('sender_business_types')->selectRaw('business_type AS code,business_type')->get();
        $data->sender_statuses = DB::table('sender_statuses')->selectRaw('code as status_code, name AS status_name')->get();
        $data->sales_agents = DB::table('os_affiliates AS sa')->where('branch_id',$branch_id)->selectRaw('sa.id,sa.name AS agent_name')->get();
        $data->price_list = DB::table('price_list_names AS l')->where('branch_id',$branch_id)->selectRaw('l.id,l.name')->get();
        return $data;
    }
    static function details($id,$ss,$includeProfilePicture=false,$includeBankAccount=true){
        $branch_id = $ss->branch_id;    
        $row = DB::table('os_bill_payments')->selectRaw('id,name,code, phone_number, email,sales_agent_id,photo_file_name, address,status_code,price_list_id,formatDate(create_date) as create_date,DATE_FORMAT(create_date,\'%r\') AS request_time')->where('branch_id',$branch_id)->where('id',$id)->take(1)->first();
        if (!$row) return null;
            //$accounts = self::bankAccounts($id,1);
            // if($row->loc_lat ==0) $row->loc_lat = null;
            // if($row->loc_lng ==0) $row->loc_lng = null;
            // if ($includeBankAccount) $row->bank_accounts = self::bankAccounts($id);
            // if($includeProfilePicture) $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
            $url = $row->photo_file_name? PublicStorage::getUrl($branch_id,'general' ,'image').$row->photo_file_name: null;
            $url = validateUrl($url,self::defaultImage($branch_id));
            $row->photo = $url;
            $row->image_url = $url;

            if ($includeProfilePicture)
            $row->image_url = PublicStorage::getProfilePhoto_url($ss->user_id);
        return $row;
     }

     function saveProfilePicture($photo_data,$file_type = null,$id=null,$ss=null){
        $id = $id?$id:$this->id;
        $ss = $ss?$ss:$this->userInfo;
        $supplier = DB::table('os_bill_payments')->where('id',$id)->selectRaw('id,branch_id,photo_file_name')->first();
        $delete_image = (!$photo_data || isImage($photo_data));
        if(!$supplier)return DV::error('Supplier identity is not correct!');
        if($delete_image){
          PublicStorage::delete($ss->branch_id,'general','image',$supplier->photo_file_name);
          DB::table('os_bill_payments')->where('id',$id)->update(['photo_file_name'=>null]);
        }
        return PublicStorage::saveImage($ss->branch_id,self::$img_dir, null,$photo_data,null,['id'=>$id,'store'=>'os_bill_payments.photo_file_name']);  
        
      }
      static function getProfilePicture($id)
  {
    $row = DB::table('os_bill_payments ')->where('id', $id)->selectRaw('branch_id,photo_file_name')->first();
    if (!$row) {
      return self::defaultImage(1);
    }
    $url = PublicStorage::getUrl($row->branch_id, 'os_supplier', 'image') . $row->photo_file_name;
    return validateUrl($url, '');
  }

      function deleteProfilePicture($id = null, $ss = null)
      {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $supplier = DB::table('os_bill_payments')->where('id', $id)->selectRaw('id,branch_id,photo_file_name')->first();
        if (!$supplier)
          return DV::error('Supplier identity is not correct!');
        PublicStorage::delete($ss->branch_id, 'os_supplier', 'image', $supplier->photo_file_name);
        DB::table('os_bill_payments')->where('id', $id)->update(['photo_file_name' => null]);
        return DV::depends($id,['Supplier are','update']);
      }
}
