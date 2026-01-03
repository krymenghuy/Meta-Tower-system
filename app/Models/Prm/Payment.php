<?php

namespace App\Models\Prm;
use App\Models\Ypg\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class Payment 
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'payments';
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    public function savePayment($arr = [], $id = null, $ss = null){
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'id' => '0|number',
            'payment_no' => '0|string',
            'payment_date' => '1|date',
            'tenant_id' => '1|number|exists=tenants.id',
            'invoice_no' => '0|string',
            'building_id'   => '1|number|exists=buildings.id',
            'space_id' => '0|number|exists=building_spaces.id',       
            'payment_method_id' => '0|number|exists=payment_methods.id', 
            'reference_no' => '0|number|0-25',
            'note' => '0|string|0-350',
            'amount' => '0|number|0-25',
            'discount' => '0|number|0-25',
            'total_paid' => '0|number|0-25',
            'status_id' => '0|number||default=2',
        ];
        $note_char = ['@','.','-','_'];
        $res = DBX::validateObject($arr,$v_rule,1,['note'=>$note_char],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
         $inputs = $res->values;
        $d = (object) $arr;

        $duplicateId = self::checkDuplicatePaymentId(
            $d->invoice_no,
            // $d->invoice_id,
            $id
        );
         if ($duplicateId) {
            return DV::error("Cannot create payment: this invoice code is exists. ");
        }
        $created = !$id;

        $id = DBX::saveData($ss,'payments',['id'=>$id],$inputs,[],1);
        if($id > 0){
            return DV::depends(1,['payments'=>$inputs, 'id'=>$id]);

        }
        return DV::error($isCreate ? 'Create failed.' : 'Update failed.');
    }

    static function checkDuplicateInvoiceId($invoice_no, $payment_id = null){
        $query = DB::table('payments as p')
            ->where('p.invoice_no', $invoice_no);
            // ->where('c.floor_number', $floor)
            // ->where('c.space_code', $space_code);

        if (!empty($payment_id)) {
            $query->where('c.id', '<>', $payment_id);  
        }

        $id = $query->value('id');
        return $id ?: null;
    }

    public function getListPayment($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $search_value = $d->search_value ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $building_id = $d->building_id ?? null;
        $status_id = $d->status_id ?? null;
        $space_id = $d->space_id ?? null;
        $payment_method_id = $d->payment_method_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if(!is_numeric($current_page)){
            $current_page = 1;  
        }
        $skip_rows = ($current_page -1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%" .$search_value ."%')";
        }
        if($tenant_id){
            $str_moreWhere .= ' AND p.tenant_id = ' . $tenant_id;
        }
        if($building_id){
            $str_moreWhere .= ' AND p.building_id = ' . $building_id;
        }
        if($status_id){
            $str_moreWhere .= ' AND p.status_id = ' . $status_id;
        } 
        if($payment_method_id){
            $str_moreWhere .= ' AND p.payment_method_id = ' . $payment_method_id;
        }
        if($space_id){
            $str_moreWhere .= ' AND c.space_id = ' . $space_id;
        }
        $payment_date = DBX::formatDate("p.payment_date", 'payment_date' );
        $updated_at = DBX::formatTime("p.updated_at", 'updated_at');
        $selectCols = 'p.id,p.space_id,bs.code as space_code,p.building_id,b.name as building_name,p.payment_no,'.$payment_date.',p.tenant_id,t.name as tenant_name,p.invoice_no,p.building_id,p.payment_method_id,pm.name as payment_method,p.reference_no,p.note,p.amount,p.discount,p.total_paid,p.status_id,ps.name as status,'.$updated_at.',p.updated_user';
         $query = DB::table('payments as p')
            ->join('tenants as t', 't.id', '=', 'p.tenant_id')
            ->join('buildings as b','b.id','=','p.building_id')
            ->join('payment_statuses as ps','ps.id','=','p.status_id')
            ->join('payment_methods as pm','pm.id','=','p.payment_method_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'p.space_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols)
            ->orderByRaw('p.id desc');
            $clone_query = clone $query;
            $count = $clone_query->count('p.id');
            $rows = $query->skip($skip_rows)->take($per_page)->get();
            return new LengthAwarePaginator($rows,$count,$per_page,$current_page);
    }

    public static function paymentDetails($id){
        return DB::table('payments as p')
        ->where('p.id',$id)
        ->selectRaw('p.id,p.space_id,p.payment_no,p.payment_date,p.tenant_id,p.invoice_no,p.building_id,p.payment_method_id,p.reference_no,p.note,p.amount,p.discount,p.total_paid,p.status_id')
        ->first();
    }
    public static function getFormOptions($id,$ss){
        $payment_details = $id ? self::paymentDetails($id) : null;
        return (object) [
            'payment_details' => $payment_details,
            'tenants'  => GeneralSettings::options_tenant($ss),
            'buildings' =>GeneralSettings::options_building($ss),
            'building_spaces' => GeneralSettings::options_building_space($ss),
            'statuses' => GeneralSettings::options_payment_status($ss),
            'payment_methods' => GeneralSettings::options_payment_method($ss)
        ];
    }
    
    public function deletePayment($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('payments')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Delete failed.');
    }

    function updatePaymentStatus($status_id, $id = null, $ss = null)
    {

        $ss = $ss ? $ss : $this->userInfo;
        $currentStatus = DB::table('payments')->where('id', $id)->value('status_id');

        if ($currentStatus == $status_id) {
            return DV::error('It is the same current status');
        }
        $x = DB::table('payments')->where('id', $id)->update([
            'status_id' => $status_id,
            'updated_user'=>$ss->full_name,
            'updated_at'=>getNowTime(),
            
        ]);
        return DV::depends($x, ['payment status', 'updated']);
    }
}
        