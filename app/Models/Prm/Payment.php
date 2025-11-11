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

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function savePayment($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'id' => '0|number',
            'payment_no' => '0|string',
            'payment_date' => '1|date',
            'tenant_id' => '1|number|exists=tenants.id',
            'invoice_id' => '0|number|exists=invoices.id',
            'building_id' => '0|number|exists=buildings.id',
            'room_id' => '0|number|exists=rooms.id',       
            'branch_id' => '0|number|exists=branches.id',
            'subs_id' => '0|number|exists=subscriptions.id',
            'payment_methods' => '0|number|exists=payment_methods.id', 
            'reference_no' => '0|string',
            'note' => '0|string',
            'amount' => '0|number',
            'discount' => '0|number',
            'total_paid' => '0|number',
            'status_id' => '0|string',
        ];

        $tenant_char = ['@','.','-','_'];
        $description_char = ['@',',','.','#'];
        $res = DBX::validateObject($arr,$v_rule,1,['tenant'=>$tenant_char,'description'=> $name_char],$ss->lang,0,null);
        if ($res->error) return DV::error($res->error);        
    
        $inputs = $res->values;
        $d = (object) $inputs;

        $duplicateId = self::checkDuplicatePaymentId(
            $d->invoice_id,
            // $d->building_space_code,
            $id
        );
         if ($duplicateId) {
            return DV::error("Cannot create Payment: this space code is already occupied by another Payment. ");
        }
        
       $created = !$id;
        
        $id = DBX::saveData($ss, 'payments', ['id' => $id], $inputs, [], 1);


        if ($id > 0) {
            return DV::depends(1, ['payments' => $inputs, 'id' => $id]);
        }

        return DV::error($isCreate ? 'Create failed.' : 'Update failed.');
    }

   static function checkDuplicatePaymentId($invoice_id, $payment_id = null){
        $query = DB::table('payments as p')
            ->where('p.invoice_id', $invoice_id);
            // ->where('c.floor_number', $floor)
            // ->where('c.space_code', $space_code);

        if (!empty($payment_id)) {
            $query->where('p.id', '<>', $payment_id);
        }

        $id = $query->value('id');
        return $id ?: null;
    }
    public function getListPayment($arr, $ss = null){

        $d = (object) $arr;
        $search_value = $d->search_value ?? null;
        $tenant_id = $d->tenant_id ?? null;
        $space_id = $d->space_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;  
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        $str_moreWhere = '2=2';
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(t.name LIKE '%".$search_value."%')";
        }
        if($tenant_id){
            $str_moreWhere .= ' AND p.tenant_id = ' . $tenant_id;
        }
        if($space_id){
            $str_moreWhere .= ' AND p.space_id = ' . $space_id;
        }
        
        $payment_date = DBX::formatDate("p.payment_date", 'payment_date' );
        $updated_at = DBX::formatTime("p.updated_at", 'updated_at' );

        $selectCols = 'p.id,p.tenant_id,t.name as tenant_name,'. $payment_date.',p.payment_no,p.payment_methods,p.invoice_id, p.building_id,p.room_id,p.branch_id,p.subs_id,st.name as space_type,bs.code as space_code, p.total_paid,p.amount,p.discount,p.updated_user,'.$updated_at;

        $query = DB::table('payments as p')
            ->join('tenants as t', 't.id', '=', 'p.tenant_id')
            ->join('building_spaces as bs', 'bs.id', '=', 'p.room_id')      
            ->join('space_types as st', 'st.id', '=', 'bs.space_type_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw($selectCols)
            ->orderByRaw('p.id desc');
        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows  = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    
    public static function paymentDetails($id)
{
    return DB::table('payments as p')
        ->where('p.id', $id)
        ->selectRaw('p.id,p.tenant_id,p.room_id as space_id,p.payment_no,p.payment_methods,p.invoice_id,bs.space_type_id,p.amount,p.total_paid,p.payment_date,p.discount')
        ->first();
}

    public static function getFormOptions($id,$ss)
    {
        $payment_details = self::paymentDetails($id) ?? null;
        return (object) [
            'payment_details' => $payment_details,
        ];
    }
    public static function deletePayment($id = null){
        $id = $id ?? $this->id;
        $deleted = DB::table('payments')->where('id',$id)->delete();
        return $deleted ? DV::depends($deleted,['action'=>'deleted']) : DV::error('Deleted failed.');
    }
    


}
        