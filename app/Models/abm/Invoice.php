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

    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo=$userInfo;
    }
    function save($arr, $id=null,$ss=null){
        // $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id'=>'0|identity=1',
            'sender_id' => '0|number|exists=sender.id',
            'shipment_id'=>'1|number|exists=os_shipments',
            'invoice_type'=>'1|choice|informal,commercial,tax,',
            'amount'=>'1|number',
            'status_id'=>'0|number|default =1',

    ];

        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $id = $res->id; 
        $d = (object)$inputs;
        $supplier_created = !$id;
     
        $id = saveData($ss,'os_customer_invoices',['id'=>$id],$inputs,[],1,0);   
        if($id > 0){
            $new_code = null;
            // if($delete_prev_image){
            //     $file_name = DB::table('os_suppliers as s')->where('s.id',$id)->take(1)->value('s.photo_file_name');
            //     if($file_name) PublicStorage::delete($branch_id,self::$img_dir,'image',$file_name);
            //     DB::table('os_suppliers as s')->where('s.id',$id)->update(['photo_file_name'=>null]);
            // }
            // PublicStorage::saveImage($branch_id,self::$img_dir,null,$photo,null,['id'=>$id,'store'=>'os_suppliers.photo_file_name']);  
            
            if ($supplier_created){
                $new_code = $this->getNextSenderCode($ss); // formatNumber($sender_id,5);
                //$inputs['code'] = $new_code;
                DB::table('os_customer_invoices')->where('id',$id)->update(['code'=>$new_code]);
             }

        }
    //return DV::error('Something went wrong in saving sender profile');
        return DV::depends($id,['action'=>'saved']);

    }
    function getNextSenderCode($uss,$len =4){
        $branch_id = $uss->branch_id;
        $prefix ='No';
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
   function getInvoiceList(){
    return DB::table('os_customer_invoices')
        // ->join('sender as s','s.id',"=","ci.sender_id")
        // ->join('os_shipments as sh','sh.id','=','ci.shipment_id')
        ->selectRaw('id,sender_id,shipment_id,invoice_type,amount,discount_percent,discount_amount,discount_type,amount_due,issue_date,due_date,pmt_terms,create_date')->get();

   }
   function getInvoiceListPaginate($filter,$ss){
    $branch_id = $ss->branch_id;
    $d = (object)$filter;
    // return JDV::result($filter->page);

    $current_page = isset($d->current_page)?$d->current_page:1;
    $per_page = isset($d->per_page)?$d->per_page:10;
    $search_value = isset($d->search_value)?$d->search_value:null;
    $end_date = isset($d->end_date) ? $d->end_date : null;
    $start_date = isset($d->start_date) ? $d->start_date : null;
    
    $status_code = isset($d->status_code)?$d->status_code:null;
    // $price_list_id = isset($d->price_list_id)?$d->price_list_id:null;
    $str_srch = '1=1';
    $str_where = '2=2';
    $str_dates = '3=3';

    if($search_value){
        $skip_row = 0;
        $str_srch = '(ci.code LIKE \'%'.$search_value.'%\')';
    }
    if($status_code){
        $str_where = 'ci.status_id = \''.$status_code.'\'';
    }else{
        $end_date = convertDate($end_date);
        $start_date = convertDate($start_date);
        if ((bool)strtotime($start_date) && (bool)strtotime($end_date)) {
            $str_dates = "DATE(ci.create_date) >= '$start_date' AND DATE(ci.create_date) <= '$end_date'";
        // return $start_date;
        }else if($end_date){
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
    $query = DB::table('os_customer_invoices as ci')
            ->join('sender as s','s.id','=','ci.sender_id')
            ->join('os_invoice_statuses as ois','ois.id','=','ci.status_id')
            ->join('os_shipments as sh','sh.id','=','ci.shipment_id')
            ->join('loc_countries as lc', 'lc.id', '=', 'sh.to_country_id')

            ->whereRaw($str_srch)
            ->whereRaw($str_where)
            ->whereRaw($str_dates)

            ->selectRaw('ci.id,ci.code,ci.update_user,formatDate(ci.create_date) as create_date,ci.update_date,ois.name as status,s.name,ci.amount,sh.item_type,sh.to_country_id,lc.name as country,sh.total_weight,sh.total_special_charge,sh.receiver_name,sh.receiver_address,sh.remarks,sh.package_qty,sh.status_id,sh.total_price')->orderBy('ci.id', 'DESC');;
   
    // return $query;
    $clone_query = clone $query;
    $count = $clone_query->count('ci.id');
    // $login_accounts = DB::table('um_users')->selectRaw('official_id')->get();
    $rows = $query->skip($skip_row)->take($per_page)->get();
  
    return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    // return $rows;

}
static function getFormOptions($id,$ss){   
    $branch_id = $ss->branch_id;
    $invoice_details = null;
    if($id>0) $invoice_details = self::details($id,$ss);
    $data= (object)[];
    $data->invoice = $invoice_details;
    // $data->branches = [(object)['id'=>1,'branch_name'=>'Head Quarter']];
    // $data->sender_types = DB::table('sender_type')->where('branch_id',$branch_id)->selectRaw('id,name AS sender_type')->get();
    // $data->business_types = DB::table('sender_business_types')->selectRaw('business_type AS code,business_type')->get();
    $data->sender_statuses = DB::table('sender_statuses')->selectRaw('code as status_code, name AS status_name')->get();
    $data->sales_agents = DB::table('os_affiliates AS sa')->where('branch_id',$branch_id)->selectRaw('sa.id,sa.name AS agent_name')->get();
    $data->price_list = DB::table('price_list_names AS l')->where('branch_id',$branch_id)->selectRaw('l.id,l.name')->get();
    $data->sender = DB::table('sender as s')->where('branch_id',$branch_id)->selectRaw('s.id,s.name as sender')->get();
    $data->os_shipments = DB::table('os_shipments as oss')->where('branch_id',$branch_id)->selectRaw('oss.id,oss.name as sender')->get();

    return $data;
}

static function details($id,$ss){
    $branch_id = $ss->branch_id;    
    $row = DB::table('os_customer_invoices')->selectRaw('id,sender_id,shipment_id,invoice_type,amount,discount_percent,discount_amount,discount_type,amount_due,issue_date,due_date,pmt_terms,create_date')->where('branch_id',$branch_id)->where('id',$id)->take(1)->first();
    
    return $row;
 }
 function deleteInvoice($id){

    $id = $id ?? $this->id;

    $delete = DB::table('os_customer_invoices')->where('id',$id)->delete();
    return DV::depends($delete,['action','deleted']);
}
   
}
