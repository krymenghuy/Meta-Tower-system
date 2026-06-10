<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use App\Models\Prm\Item;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use Vsd\Vsloquent\VSModel;
class PurchaseOrder extends VSModel
{
    protected $table = 'purchase_orders';
    protected static $purchaseOrderStatusIdMap = null;
    protected $userInfo = null;
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;

    }
    static function getOptionItems(){
      $rows = DB::table('items as i')->selectRaw('id as value, name as label')->get();
        return $rows;
    }
//    public function savePurchaseOrder($arr = [], $id = null, $ss = null)
//     {
//         $id = $id ?? $this->id;
//         $ss = $ss ?? $this->userInfo;

//         $v_rule = [
//             'vendor_id' => '1|number|exists=vendors.id|text=Please select valid Vendor',
//             'po_number' => '0|string|0-25',
//             'po_date' => '1|timestamp|text=PO date is required',
//             'remarks' => '0|string|1-255',
//             'items' => '1|array',
//         ];
//         $po_number = ['-', '_', '.', '#'];
//         $res = DBX::validateObject($arr,$v_rule,1,['po_number' => $po_number],$ss->lang,false,null);
//         if ($res->error) {
//             return DV::error($res->error);
//         }
//         $inputs = $res->values;
//         $items = $inputs['items'] ?? [];
//         $totals = $arr['totals'] ?? [];
//         $po_date = convertDate($inputs['po_date'] ?? null);
//         $today = date('Y-m-d');
//         if (!$po_date || !strtotime($po_date)) {
//             $po_date = $today;
//         }

//         if($po_date < $today){
//             return DV::error('PO date cannot be in the past');
//         }
//         if ($po_date > $today) {
//             return DV::error('PO date cannot be later than today');
//         }

//         $inputs['po_date'] = $po_date;
//         $inputs['sub_total'] = $totals['subtotal'] ?? 0;
//         $inputs['discount_value'] = $totals['discount_value'] ?? 0;
//         $inputs['discount_type'] = in_array(
//         $totals['discount_type'] ?? 'percent',['percent', 'amount']) ? $totals['discount_type'] : 'percent';
//         $inputs['tax_total'] = $totals['tax_total'] ?? 0;
//         $inputs['total_amount'] = $totals['grand_total'] ?? 0;
//         $inputs['currency_code'] = $totals['currency_code'] ?? 'USD';

//         unset($inputs['items']);
//         $create = empty($id);
//         // \Log::info(json_encode($inputs));
//         \Log::info(json_encode($items));
//         DB::beginTransaction();
//         try {

//             $po_id = DBX::saveData($ss,'purchase_orders',['id' => $id],$inputs,[],1,false);
//             if (!$po_id) {
//                 DB::rollBack();
//                 return DV::error('Cannot save purchase order');
//             }
//            self::setPONumber($ss->branch_id, $po_id, 'PO', $inputs['po_date'], 5, 'PO');
//             $items = array_map(fn($i) => (object) $i, $items);
//             $valid_items = array_values(array_filter($items, function ($item) {
//                 return !empty($item->item_id);
//             }));
//             $success_count = 0;
//             $incoming_ids = [];
//              if (!$create) {
//                 DB::table('purchase_order_items')
//                     ->where('po_id', $po_id)
//                     ->when(!empty($incoming_ids), function ($q) use ($incoming_ids) {
//                         $q->whereNotIn('id', $incoming_ids);
//                     })
//                     ->delete();
//             }
//             foreach ($valid_items as $item) {
//                 $trx_id = $item->trx_id ?? $item->id ?? null;
//                 if (!$create && $trx_id) {
//                     $exists = DB::table('purchase_order_items')
//                         ->where('id', $trx_id)
//                         ->where('po_id', $po_id)
//                         ->exists();
//                     if (!$exists) {
//                         $trx_id = null;
//                     }
//                 }

              
//                 $input_item = [
//                     'trx_id' => $trx_id,
//                     'item_id' => $item->item_id,
//                     'unit' => $item->unit ?? null,
//                     'qty' => $item->qty,
//                     'unit_price' => $item->unit_price,
//                     'total_price' => $item->total_price,
//                     'po_id' => $po_id
//                 ];

//                 $saved = self::savePoItem($ss, $input_item, $po_id);
//                 if ($saved) {
//                     $success_count++;
//                     if ($trx_id) {
//                         $incoming_ids[] = $trx_id;
//                     }
//                 }
//             }
           
//             DB::commit();
//             return DV::success([
//                 'data' => [
//                     'po_id' => $po_id,
//                     'success_count' => $success_count,
//                     'count' => count($valid_items)
//                 ]
//             ]);

//         } catch (\Exception $e) {
//             DB::rollBack();
//             return DV::error($e->getMessage());
//         }
//     }

    public function savePurchaseOrder($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;


        $v_rule = [
            'vendor_id' => '1|number|exists=vendors.id|text=Please select a valid vendor',
            'building_id' => '1|number|exists=buildings.id|text=Please select a valid building',
            'po_number' => '0|string|0-25',
            'po_date' => '1|timestamp|text=PO date is required',
            'remarks' => '0|string|1-255',
            'items' => '1|array',
        ];
        $res = DBX::validateObject($arr, $v_rule, 1, [], $ss->lang, false, null);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $items = $inputs['items'] ?? [];
        $totals = $arr['totals'] ?? [];

        $po_date = convertDate($inputs['po_date'] ?? null);
        $today = date('Y-m-d');

        if (!$po_date || !strtotime($po_date)) {
            $po_date = $today;
        }

        $inputs['po_date'] = $po_date;
        $inputs['building_id'] = $inputs['building_id'] ?? null;
        $inputs['sub_total'] = $totals['subtotal'] ?? 0;
        $inputs['discount_value'] = $totals['discount_value'] ?? 0;
        $inputs['discount_type'] = in_array($totals['discount_type'] ?? 'percent',['percent', 'amount']) ? $totals['discount_type'] : 'percent';
        $inputs['tax_total'] = $totals['tax_total'] ?? 0;
        $inputs['total_amount'] = $totals['grand_total'] ?? 0;
        $inputs['currency_code'] = $totals['currency_code'] ?? 'USD';

        unset($inputs['items']);

        $create = empty($id);

        DB::beginTransaction();

        try {

            $po_id = DBX::saveData($ss, 'purchase_orders', ['id' => $id], $inputs, [], 1, false);

            if (!$po_id) {
                DB::rollBack();
                return DV::error('Cannot save purchase order');
            }

            self::setPONumber($ss->branch_id, $po_id, 'PO', $inputs['po_date'], 4, 'PO');

            $items = array_map(fn($i) => (object) $i, $items);

            $valid_items = array_values(array_filter($items, fn($i) => !empty($i->item_id)));

            $itemIds = array_column($valid_items, 'item_id');

            if (count($itemIds) !== count(array_unique($itemIds))) {
                return DV::error('Duplicate items are not allowed in a single purchase order.');
            }
            // 🔥 STEP 1: collect incoming IDs first
            $incoming_ids = [];

            foreach ($valid_items as $item) {
                if (!empty($item->id)) {
                    $incoming_ids[] = $item->id;
                }
            }

            // 🔥 STEP 2: delete safely
            if (!$create) {
                DB::table('purchase_order_items')
                    ->where('po_id', $po_id)
                    ->when(!empty($incoming_ids), function ($q) use ($incoming_ids) {
                        $q->whereNotIn('id', $incoming_ids);
                    })
                    ->delete();
            }

            $success_count = 0;
            if (empty($valid_items)) {
                return DV::error('Please select at least one item before saving the purchase order.');
            }
            foreach ($valid_items as $item) {

                $trx_id = $item->id ?? null;
                $input_item = [
                    'id' => $trx_id,
                    'item_id' => $item->item_id,
                    'unit' => $item->unit ?? null,
                    'qty' => $item->qty,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'po_id' => $po_id
                ];
                
                $saved = self::savePoItem($ss, $input_item, $po_id);

                if ($saved) {
                    $success_count++;
                }
            }

            DB::commit();

            return DV::success([
                'data' => [
                    'po_id' => $po_id,
                    'success_count' => $success_count,
                    'count' => count($valid_items)
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return DV::error($e->getMessage());
        }
    }


    public static function savePoItem($ss, $item, $po_id)
    {
        $item = (object) $item;
        $id = $item->trx_id ?? null;
        $inputs = [
            'po_id' => $po_id,
            'item_id' => $item->item_id ?? null,
            'qty' => $item->qty ?? 0,
            'unit_price' => $item->unit_price ?? 0,
            'total_price' => ($item->qty ?? 0) * ($item->unit_price ?? 0),
        ];

        $id = DBX::saveData(
            $ss,
            'purchase_order_items',
            ['id' => $id],
            $inputs,
            [],
            1,
            false
        );

        if ($id > 0) {
            $inputs['id'] = $id;
            return (object) $inputs;
        }

        return null;
    }
    public function getPurchaseOrderList($filter, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $filter;
        $search_value = $d->search_value ?? null;
        $vendor_id = $d->vendor_id ?? null;
        $building_id = $d->building_id ?? null;
        $status_id = $d->status_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page))
            $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_where = '2=2';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(po.po_number Like '%" .$search_value ."%')";
        }
        if ($vendor_id) {
            $str_where .= ' AND po.vendor_id = ' . $vendor_id;
        }
        if ($building_id) {
            $str_where .= ' AND po.building_id = ' . $building_id;
        }
        if ($status_id) {
            $str_where .= ' AND po.status_id = ' . $status_id;
        }

        $cols = 'po.id,po.po_number,po.vendor_id,po.building_id,po.po_date,po.authorized,po.status_id,ps.name as status,po.total_authorizers,po.auth_count,po.remarks,po.discount_value,po.discount_type,po.sub_total,po.total_amount,po.updated_at,po.update_user,v.name as vendor_name,v.phone_number,b.name as building_name';
        $query = DB::table('purchase_orders as po')
            // ->join('purchase_order_authorizations as au','au.po_id','=','po.id')
            ->join('vendors as v', 'v.id', '=', 'po.vendor_id')
            ->join('buildings as b', 'b.id', '=', 'po.building_id')
            ->join('purchase_order_statuses as ps', 'ps.id', '=', 'po.status_id')
            ->whereRaw($str_where)
            ->whereRaw($str_search)
            ->selectRaw($cols)
            ->orderByRaw('po.status_id ASC')
            ->orderByRaw('po.id DESC');

        $count_query = clone $query;
        $count = $count_query->count('po.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $auth = DB::table('purchase_order_authorizations')->where('po_id', $row->id)->first();
            $row->authorizer = $auth->auth_user ?? null;
            $row->auth_date = $auth->auth_date ?? null;
            setOfficialDates($row, ['auth_date', 'po_date'], ['updated_at'], []);

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    public static function purchaseOrderDetails($id, $ss = null)
    {
        $row = DB::table('purchase_orders as po')
            ->join('vendors as v', 'v.id', '=', 'po.vendor_id')
            ->join('purchase_order_items as pi', 'pi.po_id', '=', 'po.id')
            ->join('buildings as b', 'b.id', '=', 'po.building_id')
            ->where('po.id', $id)
            ->selectRaw('po.id,po.po_number,po.vendor_id,po.building_id,v.name,v.phone_number,v.address,po.po_date,po.status_id,po.remarks,po.discount_value,po.discount_type,po.sub_total,po.tax_total,po.total_amount,pi.item_id,pi.qty,pi.unit_price,pi.total_price,b.name as building')->first();

            if($row){
                setOfficialDates($row, ['po_date'], [], []);
            }
        return $row;
    }
    public static function getFormOptions($id = null, $ss = null)
    {
        $po_details = $id ? self::purchaseOrderDetails($id, $ss) : null;
        return (object) [
            'po_details' => $po_details,
            'vendors' => GeneralSettings::options_vendor($ss),
            'buildings' => GeneralSettings::options_building($ss),
            'item' =>DB::table('items')->selectRaw('id as value, name as label')->get(),
            'po_statuses' => GeneralSettings::options_po_status($ss),
        ];
    }
   public function deletePurchaseOrder($id = null, $ss = null)
    {
        $id = $id ?? $this->id;

        $po = DB::table('purchase_orders')
            ->select('id', 'status_id')
            ->where('id', $id)
            ->first();

        if (!$po) {
            return DV::error('Purchase order not found.');
        }

        if ($po->status_id == 3) {
            return DV::error('This purchase order cannot be deleted because it has already been ordered.');
        }

        if ($po->status_id == 4) {
            return DV::error('This purchase order cannot be deleted because it has been partially received.');
        }

        if ($po->status_id == 5) {
            return DV::error('This purchase order cannot be deleted because it has already been received.');
        }

        DB::beginTransaction();

        try {

            DB::table('purchase_order_items')
                ->where('po_id', $id)
                ->delete();

            DB::table('purchase_orders')
                ->where('id', $id)
                ->delete();

            DB::commit();

            return DV::success([
                'message' => 'Purchase order has been deleted.'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return DV::error('Failed to delete purchase order.');
        }
    }
    public function getItemsByPO($data,$ss){

        $id = $data['po_id'] ?? $data['id'] ?? null ;
        $rows = DB::table('purchase_order_items as pi')
            ->join('items as i','i.id','=','pi.item_id')
            ->where('pi.po_id',$id)
            ->selectRaw("pi.item_id,pi.qty,i.unit,pi.unit_price,pi.total_price,pi.received_qty")->get();


        return $rows;
    }
//     public function getItemsByPO($data, $ss)
// {
//     $id = $data['po_id'] ?? $data['id'] ?? null;

//     $rows = DB::table('purchase_order_items as pi')
//         ->join('items as i', 'i.id', '=', 'pi.item_id')
//         ->where('pi.po_id', $id)
//         ->selectRaw("
//             pi.id,
//             pi.item_id,
//             i.name as item,
//             pi.qty,
//             pi.unit,
//             pi.unit_price as price,
//             pi.total_price,
//             pi.tax_amount,
//             pi.currency_code
//         ")
//         ->get();

//     foreach ($rows as $r) {
//         $r->qty = (float) $r->qty;
//         $r->price = (float) $r->price;
//         $r->total_price = (float) $r->total_price;
//         $r->tax_amount = (float) $r->tax_amount;
//     }

//     return $rows;
// }
    static function getItemsByPurchaseOrder($id = null, $ss = null)
    {
        $po_id = $id ?? null;
        $rows = DB::table('purchase_order_items as pi')
            ->join('items as i', 'i.id', '=', 'pi.item_id')
            ->where('pi.po_id', $po_id)
            ->selectRaw("pi.id, pi.qty,pi.unit_price, pi.total_price,pi.received_qty,pi.received_user,pi.received_date,pi.remarks, pi.status_id, i.code,pi.item_id, i.name as item_name,i.unit")
            ->orderByRaw('pi.id ASC')
            ->get();

        foreach($rows as $row){
            setOfficialDates($row,['received_date'],[],[]);
        }

        return $rows;
    }
    function rejectPurchaseOrder($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->ss;
        $d = (object) $arr;

        $po_id = $d->po_id ?? null;
        $remarks = trim($d->remarks ?? '');

        if (!$po_id) {
            return DV::error('Invalid PO ID.');
        }

        $po = DB::table('purchase_orders')
            ->where('id', $po_id)
            ->first();

        if (!$po) {
            return DV::error('Purchase Order not found.');
        }

        if ($po->status_id == 7) {
            return DV::error('Purchase Order is already rejected.');
        }

        if (in_array($po->status_id, [5, 6])) {
            return DV::error('Completed or cancelled Purchase Orders cannot be rejected.');
        }

        $reject = DB::table('purchase_orders')
            ->where('id', $po_id)
            ->update([
                'status_id' => 7,
                'remarks' => $remarks,
                'updated_at' => now(),
            ]);

        return DV::depends($reject, ['action' => 'reject']);
    }
    public function authorized($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $po_id = $d->po_id ?? null;

        if (!$po_id) {
            return DV::error('Invalid PO id');
        }
        $po = DB::table('purchase_orders')->select('id', 'status_id')->where('id', $po_id)->first();
        if (!$po) {
            return DV::error('Purchase order not found.');
        }
        if ($po->status_id == 7) {
            return DV::error('Rejected purchase orders cannot be authorized.');
        }
        $exists = DB::table('purchase_order_authorizations')
            ->where('po_id', $po_id)
            ->where('auth_uid', $ss->user_id)
            ->exists();

        if ($exists) {
            return DV::error('you already authorized this PO.');
        }

        DB::table('purchase_order_authorizations')->insert([
            'po_id'  => $po_id,
            'auth_uid'    => $ss->user_id,
            'auth_user'   => $ss->full_name,
            'auth_date'   => getNowTime(),
            'create_user' => $ss->full_name,
            'update_user' => $ss->full_name,
            'create_uid'  => $ss->user_id,
            'update_uid'  => $ss->user_id
        ]);

        $authorized_count = DB::table('purchase_order_authorizations')
            ->where('po_id', $po_id)
            ->count();

        $total_authorizers = DB::table('purchase_order_authorizers')
            ->where('inactive', 0)
            ->count();
        $authorized = $authorized_count >= $total_authorizers ? 1 : 0;

        DB::table('purchase_orders')
            ->where('id', $po_id)
            ->update([
                'auth_count' => $authorized_count,
                'total_authorizers' => $total_authorizers,
                'authorized' => $authorized,
                'status_id' => 3, // set status to "Authorized"
            ]);

        return DV::success();
    }
    public function receivePurchaseOrder($arr = [], $id = null, $ss = null)
{
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;

    $d = (object) $arr;

    $po = DB::table('purchase_orders')->where('id', $id)->first();

    if (!$po) return DV::error('Purchase order not found.');
    if ($po->status_id == 6) return DV::error('Cannot receive a cancelled purchase order.');

    $items = $d->items ?? [];
    if (empty($items)) return DV::error('No items to receive.');

    DB::beginTransaction();

    try {
        $allFullyReceived = true;

        foreach ($items as $item) {

            $poItem = DB::table('purchase_order_items')
                ->where('po_id', $id)
                ->where('item_id', $item['item_id'])
                ->first();

            if (!$poItem) {
                return DV::error('PO item not found');
            }

            $receiveQty = $item['received_qty'] ?? 0;

            if ($receiveQty > $poItem->qty) {
                return DV::error('Receive quantity exceeds ordered quantity.');
            }

            $statusId = $receiveQty > 0 ? 5 : 4;

            DB::table('purchase_order_items')
                ->where('id', $poItem->id)
                ->update([
                    'received_qty' => $receiveQty,
                    'accepted_qty' => $receiveQty,
                    'received_date' => $receiveQty > 0 ? now() : null,
                    'received_uid' => $ss->user_id ?? null,
                    'received_user' => $ss->login_name ?? null,
                    'status_id' => $statusId,
                ]);

            if ($receiveQty <= 0) {
                $allFullyReceived = false;
            }
        }

        DB::table('purchase_orders')
            ->where('id', $id)
            ->update([
                'status_id' => $allFullyReceived ? 5 : 4,
                'update_uid' => $ss->user_id ?? null,
                'update_user' => $ss->login_name ?? null,
                'updated_at' => now(),
            ]);

        DB::commit();

        return DV::success(['message' => 'Purchase order received successfully.']);

    } catch (\Exception $e) {
        DB::rollBack();
        return DV::error($e->getMessage());
    }
}
    // Receive selected lines; $arr mirrors Request::all() (po_item_ids, receive_qty, break_amount, …).
    public function receivePurchaseOrder1($arr = [], $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $d = (object) $arr;

        $po = DB::table('purchase_orders po')->where('po.id', $id)->select('po.id','po.vendor_id','po.po_number','po.po_date','po.status_id','po.authorized')->first();
        if (!$po) {
            return DV::error('Purchase order not found.');
        }
        if ((int) $po->status_id === self::poStatusId('received')) {
            return DV::error('This purchase order is already fully received.');
        }
        $itemCount = DB::table('purchase_order_items')->where('po_id', $id)->count();
        if ($itemCount === 0) {
            return DV::error('Purchase order has no line items to receive.');
        }

        $rawIds = $arr['po_item_ids'] ?? $arr['items'] ?? [];
        $lineIds = is_array($rawIds)
            ? array_values(array_unique(array_filter(array_map('intval', $rawIds))))
            : [];
        if (count($lineIds) === 0) {
            return DV::error('Select at least one line to receive.');
        }

        $validIds = DB::table('purchase_order_items')
            ->where('po_id', $id)
            ->whereIn('id', $lineIds)
            ->pluck('id')
            ->all();
        if (count($validIds) !== count($lineIds)) {
            return DV::error('Invalid purchase order line selection.');
        }

        $receiveQtyColumn = self::purchaseOrderItemReceiveQtyColumnName();
        $hasBreakAmount = Schema::hasColumn('purchase_order_items', 'break_amount');
        $receiveQtyInput = null;
        if (isset($arr['receive_qty'])) {
            $receiveQtyInput = (float) $arr['receive_qty'];
        } elseif (isset($arr['recieve_amount'])) {
            $receiveQtyInput = (float) $arr['recieve_amount'];
        }
        $breakAmountInput = isset($arr['break_amount']) ? (float) $arr['break_amount'] : null;

        $selectedRows = DB::table('purchase_order_items')
            ->where('po_id', $id)
            ->whereIn('id', $lineIds)
            ->selectRaw('id, qty')
            ->get();
        foreach ($selectedRows as $row) {
            $orderedQty = (float) ($row->qty ?? 0);
            $receiveQty = $receiveQtyInput !== null ? $receiveQtyInput : $orderedQty;
            $breakAmount = $breakAmountInput !== null ? $breakAmountInput : 0;
            if ($receiveQty < 0 || $breakAmount < 0) {
                return DV::error('Receive qty and break amount must be 0 or greater.');
            }
            if (($receiveQty + $breakAmount) > $orderedQty) {
                return DV::error('Receive qty + break amount cannot exceed ordered qty.');
            }

            $updateData = ['status_id' => 2];
            if ($receiveQtyColumn) {
                $updateData[$receiveQtyColumn] = $receiveQty;
            }
            if ($hasBreakAmount) {
                $updateData['break_amount'] = $breakAmount;
            }
            DB::table('purchase_order_items')->where('id', $row->id)->update($updateData);
        }

        $this->syncPurchaseOrderHeaderStatusFromLines($id, $ss);

        return DV::success(['message' => 'Selected lines were received successfully.']);
    }
    public function receiveVPO($data, $ss)
    {
        $branch_id = $ss->branch_id;
        $validate_rule = [
            "type" => "1|choice|MI,RM,FG",
            "warehouse_id" => "1|number|default=1|exists=warehouses.id|default=1|text=Warehouse identity does not exist",
            //"block"=>"1|exists=inv_blocks.code|default=A",
            "stockclass_code" => "1|string|exists=inv_stock_classes.code|default=A",
            "po_number" => "0|string|0-25",
            "trx_date" => "0|timestamp",
            "vendor_id" => "0|number|exists=vendors.id",//supplyer_id
            "items" => "1|object"
        ];

        $check_unique = null;
        $res = validateObject($data, $validate_rule, true, [], $ss->lang, false, $check_unique);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;
        $items = $inputs['items'];
        $x_res = $this->validateItems($items);
        if ($x_res->error)
            return DV::error($x_res->error);
        $items = $x_res->items;

        $trx_date = convertDate($inputs['trx_date']);
        if ($trx_date > date('Y-m-d'))
            return DV::error('Transaction date cannot be later than today');
        if (!(bool) strtotime($trx_date))
            $trx_date = getNowTime();

        //before it was called "stockclass_code", not "stock_class"
        //$default_stock_class = $inputs['stock_class'];
        $warehouse_id = $inputs["warehouse_id"]; //default to 1

        if (!(bool) strtotime($trx_date))
            $trx_date = $inputs['trx_date'];
        //return DV::result($items);
        $item = null;
        $i = 0;
        $success_items = [];
        $success_count = 0;
        //$errors = [];
        do {
            if (!isset($items[$i]))
                break;
            $item = $items[$i];
            //$uom = $item->uom;

            //begin:: task to process each $item in $items array
            $item_id = isset($item->id) ? $item->id : null;
            $trx_id = 0;
            $item_id = $item->id;
            //Expiration is input by user on Item View
            $expiration_date = isset($item->expiration_date) ? $item->expiration_date : null;
            $new_sku = self::createSKU($branch_id, $item_id, $expiration_date, $item->group_name, $item->category);
            //$stock_item = $this->getStockRecord($branch_id,$warehouse_id,$stockclass_code,$item_id,$trx_date);
            $input_item = ['id' => $item->id, 'sku' => $new_sku, 'code' => $item->code, 'uom' => $item->uom, 'purchase_qty' => $item->qty];
            //NOTE: Item::prepareDailyStockRecord() will ensure that there is one record in table "inv_daily_stock" for the (item_id,begin_qty,purchase_qty,avail_qty, ...)
            $stock_class = $item->stock_class;
            $stock_item = Item::prepareDailyStockRecord($ss, $warehouse_id, $stock_class, $input_item, $trx_date);
            $update_qty = 0;
            if ($stock_item) {
                $trx_id = $stock_item->trx_id;
                $uom = $stock_item->uom;
                $update_qty = $stock_item->purchase_qty + $item->qty;
                $x = DB::table('inv_daily_stocks')->where('id', $stock_item->trx_id)->where('branch_id', $branch_id)->where('warehouse_id', $warehouse_id)->where('stockclass_code', $stock_class)->update([
                    'purchase_qty' => $update_qty,
                    'update_uid' => $ss->user_id,
                    'updated_at' => getNowTime(),
                    'update_user' => $ss->login_name
                ]);
                if (!$x)
                    return DV::error("Failed to udpate daily stock status");
                $trx_id = $stock_item->trx_id;
            }
            //$item_stockclass = isset($item->stockclass_code)?$item->stockclass_code:$stockclass_code;
            $success_count++;
            $success_items[] = (object) ['id' => $item_id, 'code' => $item->code, 'qty' => $item->qty, 'uom' => $uom, 'sku' => $new_sku, 'stock_class' => $stock_class, 'target_qty' => 'purchase_qty'];
            StockLog::log($ss, ['action' => 'receive', 'qty' => $item->qty, 'uom' => $uom, 'trx_id' => $trx_id, 'sku' => $new_sku], 'inv');

            //end:: task to process each $item in $items array
            $i++;
        } while ($item);
        if ($success_count === 0)
            return DV::error("0 items were received in the purchase order");
        QTYChanged::dispatch(['user' => $ss, 'target_qty' => 'purchase_qty', 'warehouse_id' => $warehouse_id, 'stockclass_code' => $stock_class, 'items' => $success_items]);
        return DV::success(['data' => ['success_count' => $success_count, 'count' => $i]]);
    }

    public static function setPONumber($branch_id,$po_id,$doc_class = 'PO',$po_date = null,$len = 4,$prefix = 'PO',$onSuccess = null) {
    if (!$po_id) return null;
    $year = date('Y', strtotime($po_date ?? now()));
    return DB::transaction(function () use (
        $branch_id,
        $po_id,
        $doc_class,
        $year,
        $len,
        $prefix,
        $onSuccess
    ) {

        $row = DB::table('purchase_order_code_control')
        ->where('branch_id', $branch_id)
        ->where('issue_year', $year)
        ->where('doc_class', $doc_class)
        ->where('prefix', $prefix)
        ->first();

        if ($row) {
            $next_num = $row->last_id + 1;

            DB::table('purchase_order_code_control')
                ->where('id', $row->id)
                ->update(['last_id' => $next_num]);
        } else {
            $next_num = 1;

            DB::table('purchase_order_code_control')->insert([
                'branch_id' => $branch_id,
                'doc_class' => $doc_class,
                'issue_year' => $year,
                'prefix' => $prefix,
                'last_id' => $next_num,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $new_code = $prefix . '-' . substr($year, -2) . str_pad($next_num, $len, '0', STR_PAD_LEFT);

        DB::table('purchase_orders')
            ->where('id', $po_id)
            ->update(['po_number' => $new_code]);

        if ($onSuccess) $onSuccess();

        return (object)[
            'status_code' => 200,
            'status' => 'OK',
            'code' => $new_code
        ];
    });
}
}
