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
   public function savePurchaseOrder($arr = [], $id = null, $ss = null)
{
    $id = $id ?? $this->id;
    $ss = $ss ?? $this->userInfo;

    $v_rule = [
        'vendor_id' => '1|number|exists=vendors.id|Vendor identity is not correct',
        'po_number' => '0|string|0-50',
        'po_date' => '0|timestamp',
        'remarks' => '0|string|1-255',
        'items' => '1|array',
    ];
    $po_number = ['-', '_', '.', '#'];
    $res = DBX::validateObject($arr,$v_rule,1,['po_number' => $po_number],$ss->lang,false,null);
    if ($res->error) {
        return DV::error($res->error);
    }
    $inputs = $res->values;
    $items = $inputs['items'] ?? [];
    $totals = $arr['totals'] ?? [];
    $po_date = convertDate($inputs['po_date'] ?? null);
    if (!$po_date || !strtotime($po_date)) {
        $po_date = date('Y-m-d');
    }
    if ($po_date > date('Y-m-d')) {
        return DV::error('PO date cannot be later than today');
    }
    $inputs['po_date'] = $po_date;
    $inputs['sub_total'] = $totals['subtotal'] ?? 0;
    $inputs['discount_value'] = $totals['discount_value'] ?? 0;
    $inputs['discount_type'] = in_array(
    $totals['discount_type'] ?? 'percent',['percent', 'amount']) ? $totals['discount_type'] : 'percent';
    $inputs['tax_total'] = $totals['tax_total'] ?? 0;
    $inputs['total_amount'] = $totals['grand_total'] ?? 0;
    $inputs['currency_code'] = $totals['currency_code'] ?? 'USD';

    unset($inputs['items']);
    $create = empty($id);
    DB::beginTransaction();
    try {

        $po_id = DBX::saveData($ss,'purchase_orders',['id' => $id],$inputs,[],1,false);
        if (!$po_id) {
            DB::rollBack();
            return DV::error('Cannot save purchase order');
        }
        $items = array_map(fn($i) => (object) $i, $items);
        $valid_items = array_values(array_filter($items, function ($item) {
            return !empty($item->item_id);
        }));
        $success_count = 0;
        $incoming_ids = [];
        foreach ($valid_items as $item) {
            $trx_id = $item->trx_id ?? $item->id ?? null;
            if (!$create && $trx_id) {
                $exists = DB::table('purchase_order_items')
                    ->where('id', $trx_id)
                    ->where('po_id', $po_id)
                    ->exists();
                if (!$exists) {
                    $trx_id = null;
                }
            }

            $qty = $item->qty ?? 0;
            $unit_price = $item->unit_price ?? 0;
            $input_item = [
                'trx_id' => $trx_id,
                'item_id' => $item->item_id,
                'unit' => $item->unit ?? null,
                'qty' => $qty,
                'unit_price' => $unit_price,
                'total_price' => $qty * $unit_price,
                'po_id' => $po_id
            ];
            $saved = self::savePoItem($ss, $input_item, $po_id);
            if ($saved) {
                $success_count++;
                if ($trx_id) {
                    $incoming_ids[] = $trx_id;
                }
            }
        }
        if (!$create) {
            DB::table('purchase_order_items')
                ->where('po_id', $po_id)
                ->when(!empty($incoming_ids), function ($q) use ($incoming_ids) {
                    $q->whereNotIn('id', $incoming_ids);
                })
                ->delete();
        }
        $db_sub = DB::table('purchase_order_items')
            ->where('po_id', $po_id)
            ->sum('total_price');

        if (abs($db_sub - ($inputs['sub_total'] ?? 0)) > 0.01) {
            DB::rollBack();
            return DV::error('Subtotal mismatch with items');
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
        $trx_id = $item->trx_id ?? null;
        if (!is_numeric($trx_id) || (int) $trx_id <= 0) {
            $trx_id = null;
        }

        $inputs = [
            'po_id' => $po_id,
            'item_id' => $item->item_id ?? $item->id ?? null,
            'qty' => $item->qty ?? 0,
            'unit_price' => $item->unit_price ?? 0,
            'total_price' => ($item->qty ?? 0) * ($item->unit_price ?? 0),
        ];

        $id = DBX::saveData(
            $ss,
            'purchase_order_items',
            ['id' => $trx_id],
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

    public static function poStatusId(string $key): int
    {
        $map = self::purchaseOrderStatusIdsFromTable();
        if (!isset($map[$key])) {
            throw new \InvalidArgumentException('Unknown PO status key "' . $key . '".');
        }

        return $map[$key];
    }

    private static function purchaseOrderStatusIdsFromTable(): array
    {
        if (self::$purchaseOrderStatusIdMap !== null) {
            return self::$purchaseOrderStatusIdMap;
        }

        $rows = DB::table('purchase_order_statuses')->select('id', 'name')->orderBy('id')->get();
        $byName = [];
        foreach ($rows as $row) {
            $byName[strtolower(trim((string) ($row->name ?? '')))] = (int) $row->id;
        }

        $aliases = [
            'pending' => ['pending'],
            'approved' => ['approved'],
            'ordered' => ['ordered'],
            'partially_received' => ['partially received', 'partially_received'],
            'received' => ['received'],
            'cancelled' => ['cancelled', 'canceled'],
        ];

        $map = [];
        foreach ($aliases as $logical => $names) {
            foreach ($names as $name) {
                if (isset($byName[$name])) {
                    $map[$logical] = $byName[$name];
                    break;
                }
            }
        }

        $missing = array_diff(array_keys($aliases), array_keys($map));
        if ($missing !== []) {
            $present = $byName === [] ? '(none)' : implode(', ', array_keys($byName));
            throw new \RuntimeException(
                'purchase_order_statuses is missing name row(s) for: '
                . implode(', ', $missing)
                . '. DB has: ' . $present
            );
        }

        self::$purchaseOrderStatusIdMap = $map;

        return self::$purchaseOrderStatusIdMap;
    }

    public function getPurchaseOrderList($filter, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $d = (object) $filter;
        $search_value = $d->search_value ?? null;
        $vendor_id = $d->vendor_id ?? null;
        $status_id = $d->status_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = '1=1';
        $str_where = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(po.po_number Like '%" . $search_value . "%' OR v.name Like '%" . $search_value . "%')";
        }
        if ($vendor_id) {
            $str_where .= ' AND po.vendor_id = ' . $vendor_id;
        }

        if ($status_id) {
            $str_where .= ' AND po.status_id = ' . $status_id;
        }

        $item_total = '(SELECT COALESCE(SUM(pi.total_price), 0) FROM purchase_order_items as pi WHERE pi.po_id = po.id)';
        $sub_total = 'COALESCE(po.sub_total, ' . $item_total . ')';
        $discount_amount = "CASE WHEN po.discount_type = 'percent' THEN (" . $item_total . " * COALESCE(po.discount_value, 0) / 100) ELSE COALESCE(po.discount_value, 0) END";
        $computed_total_amount = 'GREATEST(0, (' . $item_total . ') - (' . $discount_amount . '))';
        $total_amount = 'COALESCE(po.total_amount, ' . $computed_total_amount . ')';
        $cols = 'po.id,po.po_number,po.vendor_id,po.po_date,po.authorized,po.status_id,ps.name as status,po.total_authorizers,po.auth_count,po.remarks,po.discount_value,po.discount_type,po.sub_total as stored_sub_total,po.total_amount as stored_total_amount,po.updated_at,po.update_user,v.id as vendor_id,v.name as vendor_name,v.phone_number,' . $sub_total . ' as sub_total,' . $total_amount . ' as total_amount';
        $query = DB::table('purchase_orders as po')
            ->join('vendors as v', 'v.id', '=', 'po.vendor_id')
            ->join('purchase_order_statuses as ps', 'ps.id', '=', 'po.status_id')
            ->whereRaw($str_where)
            ->whereRaw($str_search)
            ->selectRaw($cols)
            ->orderByRaw('po.id DESC');

        $clone_query = clone $query;
        $count = $clone_query->count('po.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        $poIds = $rows->pluck('id')->map(function ($id) {
            return (int) $id;
        })->all();
        $linesByPo = [];
        if ($poIds !== []) {
            $allLines = DB::table('purchase_order_items')
                ->whereIn('po_id', $poIds)
                ->whereNotNull('item_id')
                ->where('item_id', '>', 0)
                ->get();
            foreach ($allLines as $line) {
                $pid = (int) $line->po_id;
                if (!isset($linesByPo[$pid])) {
                    $linesByPo[$pid] = [];
                }
                $linesByPo[$pid][] = $line;
            }
        }
        foreach ($rows as $row) {
            $auth = DB::table('purchase_order_authorizations')
                ->where('po_id', $row->id)
                ->first();
            $row->authorizer = $auth?->auth_user ?? null;
            $row->auth_date = $auth?->auth_date ?? null;
            $row->sub_total_formatted = '$ ' . number_format((float) ($row->sub_total ?? 0), 2, '.', '');
            $row->total_amount_formatted = '$ ' . number_format((float) ($row->total_amount ?? 0), 2, '.', '');
            $dv = (float) ($row->discount_value ?? 0);
            $dt = (string) ($row->discount_type ?? 'percent');
            if ($dt === 'amount') {
                $row->discount_formatted = '$ ' . number_format($dv, 2, '.', '');
            } else {
                $isInt = abs($dv - round($dv)) < 0.00001;
                $v = $isInt ? (string) (int) round($dv) : rtrim(rtrim(number_format($dv, 2, '.', ''), '0'), '.');
                $row->discount_formatted = $v . ' %';
            }
            setOfficialDates($row, ['auth_date', 'po_date'], ['updated_at'], []);
            if ((int) $row->status_id !== self::poStatusId('cancelled')) {
                $pid = (int) $row->id;
                $lines = $linesByPo[$pid] ?? [];
                $state = self::receiveProgressStateFromLines($lines);
                // Badge override only when something is received; else keep ps.name from DB.
                if ($state === 'partial' || $state === 'complete') {
                    $badge = self::receiveProgressBadgePresentation($state);
                    $row->status_label = $badge['label'];
                    $row->status_class = $badge['class'];
                    $row->status_badge_style = $badge['style'];
                }
            }
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function purchaseOrderDetails($id, $ss = null)
    {
        $row = DB::table('purchase_orders as po')
            ->join('vendors as v', 'v.id', '=', 'po.vendor_id')
            ->join('purchase_order_items as pi', 'pi.po_id', '=', 'po.id')
            ->where('po.id', $id)
            ->selectRaw('po.id,po.po_number,po.vendor_id,v.name,v.phone_number,v.address,po.po_date,po.status_id,po.remarks,po.discount_value,po.discount_type,po.sub_total,po.tax_total,po.total_amount,pi.item_id,pi.qty,pi.unit_price,pi.total_price')->first();
        // if ($row) {
        //     self::decoratePurchaseOrderHeaderRow($row);
        // }

        return $row;
    }

    public static function getFormOptions($id = null, $ss = null)
    {
        $po_details = $id ? self::purchaseOrderDetails($id, $ss) : null;

        return (object) [
            'po_details' => $po_details,
            'vendors' => GeneralSettings::options_vendor($ss),
            'item' =>DB::table('items')->selectRaw('id as value, name as label')->get(),
            'po_statuses' => GeneralSettings::options_po_status($ss),
        ];
    }

    public function deletePurchaseOrder($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $po = DB::table('purchase_orders')->select('id','status_id')->where('id', $id)->first();
        if (!$po) {
            return DV::error('Purchase order not found.');
        }
        if (!empty($po->status_id) && $po->status_id > 1) {
            return DV::error('This purchase order cannot be deleted because it is already processed.');
        }
        $deleted = DB::table('purchase_orders')->where('id', $id)->delete();
        if ($deleted) {
            DB::table('purchase_order_items')->where('po_id', $id)->delete();

        }
        return DV::success(['message' => 'Purchase order has been deleted.']);
    }

 function getItemsByTrx($data,$ss){
      
      $id = $data['po_id'] ?? $data['id'] ?? null ;
      $rows = DB::table('purchase_order_items as pi')
        ->join('items as i','i.id','=','pi.item_id')
        ->where('pi.po_id',$id)
        ->selectRaw("i.id as item_id,pi.qty,pi.unit_price")->get();
     
      
      return $rows;
  }
    static function getItemsByPurchaseOrder($po_id, $ss = null)
    {

        $receiveQtyColumn = self::purchaseOrderItemReceiveQtyColumnName();
        $hasBreakAmount = Schema::hasColumn('purchase_order_items', 'break_amount');
        $hasLineUnit = Schema::hasColumn('purchase_order_items', 'unit');
        $receiveQtyCol = $receiveQtyColumn ? ('IFNULL(pi.' . $receiveQtyColumn . ',0)') : '0';
        $breakAmountCol = $hasBreakAmount ? 'IFNULL(pi.break_amount,0)' : '0';
        $unitExpr = $hasLineUnit ? 'COALESCE(pi.unit, i.unit)' : 'i.unit';

        $rows = DB::table('purchase_order_items as pi')
            ->join('items as i', 'i.id', '=', 'pi.item_id')
            ->where('pi.po_id', $po_id)
            ->selectRaw("pi.id, pi.qty, $unitExpr as unit, pi.remarks, pi.status_id, pi.unit_price, pi.total_price, $receiveQtyCol as receive_qty, $breakAmountCol as break_amount, i.code, i.id as item_id, i.name as item_name, pi.update_user, " . DBX::formatDate('i.updated_at') . ' as updated_at')
            ->orderByRaw('i.name ASC')
            ->get();
        foreach ($rows as $row) {
            $row->status = $row->status_id == 1 ? 'Pending' : ($row->status_id == 2 ? 'Received' : null);
            $row->unit_id = self::normalizePoUnitId($row->unit ?? null);
            $row->unit_price_formatted = '$ ' . number_format((float) ($row->unit_price ?? 0), 2, '.', '');
            $row->total_price_formatted = '$ ' . number_format((float) ($row->total_price ?? 0), 2, '.', '');
        }

        return $rows;
    }


    public function authorized($arr = [], $ss = null)
    {
        $d = (object) $arr;
        $po_id = $d->po_id ?? null;

        if (!$po_id) {
            return DV::error('Invalid PO id');
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
                'status_id' => $authorized ? self::poStatusId('ordered') : self::poStatusId('pending')
            ]);

        return DV::success();
    }

    // Keep purchase_orders.status_id in sync with line receive totals (after receivePurchaseOrder).
    protected function syncPurchaseOrderHeaderStatusFromLines(int $poId, $ss = null): void
    {
        $ss = $ss ?? $this->userInfo;
        $idReceived = self::poStatusId('received');
        $idPartiallyReceived = self::poStatusId('partially_received');

        $lines = DB::table('purchase_order_items')
            ->where('po_id', $poId)
            ->whereNotNull('item_id')
            ->where('item_id', '>', 0)
            ->get();

        if ($lines->isEmpty()) {
            return;
        }

        $header = DB::table('purchase_orders')->where('id', $poId)->first();
        if (!$header) {
            return;
        }
        if ((int) $header->status_id === $idReceived) {
            return;
        }

        $state = self::receiveProgressStateFromLines($lines);
        $cur = (int) $header->status_id;
        $newStatus = $cur;
        if ($state === 'complete') {
            $newStatus = $idReceived;
        } elseif ($state === 'partial') {
            $newStatus = $idPartiallyReceived;
        } elseif ($state === 'none' && in_array($cur, [$idPartiallyReceived, $idReceived], true)) {
            $newStatus = (int) ($header->authorized ?? 0) === 1 ? self::poStatusId('ordered') : self::poStatusId('approved');
        }

        if ($newStatus !== $cur) {
            $now = getNowTime();
            $updateUser = $ss->login_name ?? $ss->user_name ?? 'User';
            DB::table('purchase_orders')->where('id', $poId)->update([
                'status_id' => $newStatus,
                'updated_at' => $now,
                'update_user' => $updateUser,
            ]);
        }
    }
public function receivePurchaseOrder($arr = [], $id = null, $ss = null)
{
    $ss = $ss ?? $this->userInfo;
    $id = $id ?? $this->id;
    $d = (object) $arr;
    $po = DB::table('purchase_orders')
        ->where('id', $id)
        ->first();
    if (!$po) {
        return DV::error('Purchase order not found.');
    }
    if ($po->status_id == 6) {
        return DV::error('Cannot receive a cancelled purchase order.');
    }
    if ($po->status_id < 3) {
        return DV::error('Purchase order must be in Ordered status.');
    }
    $items = $d->items ?? [];
    if (empty($items)) {
        return DV::error('No items to receive.');
    }

    DB::beginTransaction();

    try {

        $allFullyReceived = true;

        foreach ($items as $item) {

            $poItem = DB::table('purchase_order_items')
                ->where('po_id', $id)
                ->where('item_id', $item['item_id'])
                ->first();

            if (!$poItem) {
                DB::rollBack();
                return DV::error('PO item not found: ' . $item['item_id']);
            }

            $receiveQty = (float) ($item['received_qty'] ?? 0);

            if ($receiveQty <= 0) {
                continue;
            }

            $newReceivedQty = $poItem->received_qty + $receiveQty;

            if ($newReceivedQty > $poItem->qty) {
                DB::rollBack();
                return DV::error('Receive quantity exceeds ordered quantity.');
            }

            $acceptQty = $newReceivedQty;

            DB::table('purchase_order_items')
                ->where('id', $poItem->id)
                ->update([
                    'received_qty' => $newReceivedQty,
                    'accept_qty' => $acceptQty,
                    'accept_date' => now(),
                    'accept_uid' => $ss->user_id ?? null,
                    'accept_user' => $ss->user_name ?? null,
                    'status_id' => ($newReceivedQty == $poItem->qty) ? 5 : 4,
                ]);

            if ($newReceivedQty < $poItem->qty) {
                $allFullyReceived = false;
            }
        }

        $newStatus = $allFullyReceived ? 5 : 4;

        DB::table('purchase_orders')
            ->where('id', $id)
            ->update([
                'status_id' => $newStatus,
                'update_uid' => $ss->user_id ?? null,
                'update_user' => $ss->user_name ?? null,
                'updated_at' => now(),
            ]);

        DB::commit();

        return DV::success('Purchase order received successfully.');

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

    // Mark PO received when every line is complete; allow_partial + remarks for partial close.
    public function confirmPurchaseOrderReceived($id, $ss = null, $arr = [])
    {
        $ss = $ss ?? $this->userInfo;
        $id = (int) $id;
        if ($id <= 0) {
            return DV::error('Invalid purchase order ID.');
        }
        $po = DB::table('purchase_orders')->where('id', $id)->first();
        if (!$po) {
            return DV::error('Purchase order not found.');
        }
        if ((int) $po->status_id === self::poStatusId('received')) {
            return DV::error('This purchase order is already fully received.');
        }

        $receiveCol = self::purchaseOrderItemReceiveQtyColumnName();
        $hasBreak = Schema::hasColumn('purchase_order_items', 'break_amount');

        $lines = DB::table('purchase_order_items')
            ->where('po_id', $id)
            ->whereNotNull('item_id')
            ->where('item_id', '>', 0)
            ->get();

        if ($lines->isEmpty()) {
            return DV::error('Purchase order has no line items to receive.');
        }

        $hasIncomplete = false;
        foreach ($lines as $line) {
            $ordered = (float) ($line->qty ?? 0);
            if ($ordered <= 0) {
                continue;
            }
            $recv = 0.0;
            if ($receiveCol) {
                $recv = (float) ($line->{$receiveCol} ?? 0);
            }
            $brk = $hasBreak ? (float) ($line->break_amount ?? 0) : 0.0;
            $lineMarkedReceived = (int) ($line->status_id ?? 0) === 2;
            if (!$lineMarkedReceived && ($recv + $brk) + 1e-6 < $ordered) {
                $hasIncomplete = true;
                break;
            }
        }

        $allowPartial = !empty($arr['allow_partial']);
        if ($hasIncomplete) {
            if (!$allowPartial) {
                return DV::error('Not all items are fully received. For each line, Receive amount + Break Amount must equal Ordered Qty (save each line first).');
            }
            $remarks = trim((string) ($arr['remarks'] ?? $arr['remark'] ?? ''));
            if ($remarks === '') {
                return DV::error('Please enter remarks.');
            }
            $now = getNowTime();
            $updateUser = $ss->login_name ?? $ss->user_name ?? 'User';
            DB::table('purchase_orders')->where('id', $id)->update([
                'status_id' => self::poStatusId('partially_received'),
                'remarks' => $remarks,
                'updated_at' => $now,
                'update_user' => $updateUser,
            ]);
            return DV::success(['message' => 'Remarks saved. Purchase order marked as partially received.']);
        }

        $now = getNowTime();
        $updateUser = $ss->login_name ?? $ss->user_name ?? 'User';

        foreach ($lines as $line) {
            DB::table('purchase_order_items')->where('id', $line->id)->update(['status_id' => 2]);
        }

        DB::table('purchase_orders')->where('id', $id)->update([
            'status_id' => self::poStatusId('received'),
            'updated_at' => $now,
            'update_user' => $updateUser,
        ]);

        return DV::success(['message' => 'Purchase order confirmed as received.']);
    }


    // List / dialog helpers (receive badges, money format on header, line unit id).

    public static function normalizePoUnitId($unit): int
    {
        $n = (int) $unit;
        if ($n >= 1 && $n <= 4) {
            return $n;
        }
        $map = ['pcs' => 1, 'kg' => 2, 'box' => 3, 'meter' => 4];
        $key = strtolower(trim((string) $unit));

        return (int) ($map[$key] ?? ($n > 0 ? $n : 1));
    }

    public static function decoratePurchaseOrderHeaderRow(?object $row): ?object
    {
        if (!$row) {
            return null;
        }
        $row->sub_total_formatted = '$ ' . number_format((float) ($row->sub_total ?? 0), 2, '.', '');
        $row->total_amount_formatted = '$ ' . number_format((float) ($row->total_amount ?? 0), 2, '.', '');
        $dv = (float) ($row->discount_value ?? 0);
        $dt = (string) ($row->discount_type ?? 'percent');
        if ($dt === 'amount') {
            $row->discount_formatted = '$ ' . number_format($dv, 2, '.', '');
        } else {
            $isInt = abs($dv - round($dv)) < 0.00001;
            $v = $isInt ? (string) (int) round($dv) : rtrim(rtrim(number_format($dv, 2, '.', ''), '0'), '.');
            $row->discount_formatted = $v . ' %';
        }

        return $row;
    }

    // none | partial | complete — from line qty, receive col, break_amount, line status_id.
    public static function receiveProgressStateFromLines($lines): string
    {
        $receiveCol = self::purchaseOrderItemReceiveQtyColumnName();
        $hasBreak = Schema::hasColumn('purchase_order_items', 'break_amount');
        $meaningful = [];
        foreach ($lines as $line) {
            $ordered = (float) ($line->qty ?? 0);
            if ($ordered <= 0) {
                continue;
            }
            $recv = $receiveCol ? (float) ($line->{$receiveCol} ?? 0) : 0.0;
            $brk = $hasBreak ? (float) ($line->break_amount ?? 0) : 0.0;
            $lineReceived = (int) ($line->status_id ?? 0) === 2;
            $meaningful[] = ['ordered' => $ordered, 'eff' => $recv + $brk, 'line_received' => $lineReceived];
        }
        if ($meaningful === []) {
            return 'none';
        }
        $anyReceived = false;
        $allSatisfied = true;
        foreach ($meaningful as $m) {
            $lineMarkedReceived = !empty($m['line_received']);
            if ($lineMarkedReceived || $m['eff'] > 0.02) {
                $anyReceived = true;
            }
            if (!$lineMarkedReceived && ($m['eff'] + 1e-6) < $m['ordered']) {
                $allSatisfied = false;
            }
        }
        if (!$anyReceived) {
            return 'none';
        }
        if ($allSatisfied) {
            return 'complete';
        }

        return 'partial';
    }

    public static function receiveProgressBadgePresentation(string $state): array
    {
        if ($state === 'complete') {
            return [
                'label' => 'Received',
                'class' => 'badge border',
                'style' => 'min-width:90px;background:#dff3ea;color:#37b07f;border-color:#70c39f !important;font-weight:500;',
            ];
        }
        if ($state === 'partial') {
            return [
                'label' => 'Partially Received',
                'class' => 'badge text-dark border',
                'style' => 'min-width:90px;background:#fff3e0;color:#e65100;border-color:#ffb74d !important;font-weight:500;',
            ];
        }

        return [
            'label' => 'Pending',
            'class' => 'badge text-gray border',
            'style' => 'min-width:90px;background:#fff3cd;color:#664d03;border-color:#ffc107 !important;font-weight:600;',
        ];
    }

    // receive_qty or legacy recieve_amount column name.
    public static function purchaseOrderItemReceiveQtyColumnName(): ?string
    {
        if (Schema::hasColumn('purchase_order_items', 'receive_qty')) {
            return 'receive_qty';
        }
        if (Schema::hasColumn('purchase_order_items', 'recieve_amount')) {
            return 'recieve_amount';
        }

        return null;
    }

    // Legacy — MI / inventory (not used by PRM list UI).

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

    public static function validPOQty($po_id, $arr, $ss)
    {
        $d = (object) $arr;
        $item_id = $d->item_id;
        $qty = $d->qty;
        $to_skip = (object) ['item_id' => 0];
        $skip_count = 0;
        $skip_msg = null;
        $row = DB::table('purchase_orders_mi')->where('id', $po_id)->first();
        $items = DB::table('po_items_mi')->selectRaw('id,item_id,price,uom,po_id,qty,ifnull(accepted_qty,0) as accepted_qty,update_user,ifnull(delivered_qty,0) as delivered_qty,ifnull(rejected_qty,0) as rejected_qty')->where('po_id', $po_id)->get();
        // foreach($rows as $row){
        if ($row) {
            $poItem = self::getPOItemsMIInfo($items, $po_id, $item_id);
            if ($poItem->error)
                return DV::error($poItem->message);
            $poQTY = $poItem->qty;
            $accepted_qty = $poItem->accepted_qty;
            $validQty = $poQTY >= $accepted_qty ? ($poQTY - $accepted_qty) : max(0, $accepted_qty - $poQTY);

            // $validQty = $poQTY - $accepted_qty - $poItem->delivered_qty - $poItem->rejected_qty;
            if ($validQty == 0) {
                $skip_msg = 'Cannot change remarks on full purchased order item quantity received';
                $skip_count++;
                $to_skip = (object) ['item_id' => $poItem->item_id];
                // continue;
            }
            if ($qty > $validQty) {
                $xitem = Item::getProps($item_id, 'code,name') ?? (object) ['name' => ''];
                $msg = $validQty > 0 ? $xitem->name . ' was already received ' . $accepted_qty . ' item' . ($accepted_qty > 1 ? 's' : '') . '. There ' . ($validQty > 1 ? 'are ' : 'is ') . $validQty . ' less'
                    : 'Receving qty must be equal or less than order qty on ' . $xitem->name;
                return DV::error($msg);
            }
            if ($poItem->id > 0) {
                DBX::saveData($ss, 'po_items_mi', ['id' => $poItem->id], [
                    'accepted_qty' => $accepted_qty + $qty,
                    'remarks' => isset($d->remarks) ? $d->remarks : null,
                    'expire_date' => $d->expire_date
                ], [], 1);
                if ($qty == $validQty) {
                    $ud = DBX::saveData($ss, 'purchase_orders_mi', ['id' => $po_id], ['status_id' => 3], [], 1);
                }
            }
        }
        if (count($items) == $skip_count) {
            //* update Po status
            $ud = DBX::saveData($ss, 'purchase_orders_mi', ['id' => $po_id], ['status_id' => 3], [], 1);
            return DV::error('All items were received, also remarks can not be changed');
        }
        return DV::success(['skip_row_msg' => $skip_msg, 'to_skip' => $to_skip]);
    }

    public static function savePoOrderItem($ss, $po_id, $item, $id)
    {

        $item = is_object($item) ? $item : (object) $item;

        // Calculate total price if not provided
        $total_price = $item->total ?? ($item->qty * ($item->unit_price ?? 0));

        $inputs = [
            "po_id" => $po_id,
            "item_id" => $item->item_id ?? $item->id ?? null,
            "qty" => $item->qty ?? 0,
            "unit" => $item->unit ?? null,
            "unit_price" => $item->unit_price ?? 0,
            "total_price" => $total_price,
        ];

        $saved_id = DBX::saveData($ss, 'purchase_order_items', ['id' => $id], $inputs, [], 1, false);

        if ($saved_id > 0) {
            $inputs['id'] = $saved_id;
            return (object) $inputs;
        }

        return null; // Failed to save
    }

    public static function getProps($id, $cols = 'id,code,name')
    {
        return DB::table('items as i')->where('i.id', $id)->selectRaw($cols)->first();
    }
}
