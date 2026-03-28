<?php

namespace App\Models\Prm;

use App\Models\Prm\GeneralSettings;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;
use XPublicStorage;

class PurchaseOrder //extends Model
{
    protected $id = null;
    protected $userInfo = null;
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    //Receive PO items and increase Inventory items
    function receiveVPO($data, $ss)
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

    static function validPOQty($po_id, $arr, $ss)
    {
        $d = (object) $arr;
        $item_id = $d->item_id;
        $qty = $d->qty;
        $to_skip = (object) ['item_id' => 0];
        $skip_count = 0;
        $skip_msg = null;
        $row = DB::table('purchase_orders_mi')->where('id', $po_id)->first();
        $items = DB::table('po_items_mi')->selectRaw('id,item_id,price,uom,po_id,qty,ifnull(accepted_qty,0) as accepted_qty,update_user,ifnull(delivered_qty,0) as delivered_qty,ifnull(rejected_qty,0) as rejected_qty')->get();
        // foreach($rows as $row){
        if ($row) {
            $poItem = self::getPOItemsMIInfo($items, $po_id, $item_id);
            if ($poItem->error)
                return DV::error($poItem->message);
            $poQTY = $poItem->qty;
            $accepted_qty = $poItem->accepted_qty;
            $validQty = $poQTY >= $accepted_qty ? ($poQTY - $accepted_qty) : ($accepted_qty - $poItem);

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
                    $ud = DBX::saveData($ss, self::$po_table, ['id' => $po_id], ['status_id' => 3], [], 1);
                }
            }
        }
        if (count($items) == $skip_count) {
            //* update Po status
            $ud = DBX::saveData($ss, self::$po_table, ['id' => $po_id], ['status_id' => 3], [], 1);
            return DV::error('All items were received, also remarks can not be changed');
        }
        return DV::success(['skip_row_msg' => $skip_msg, 'to_skip' => $to_skip]);
    }

    static function savePoOrderItem($ss, $po_id, $item, $id)
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


    static function getProps($id, $cols = 'id,code,name')
    {
        return DB::table('items as i')->where('i.id', $id)->selectRaw($cols)->first();
    }


    function savePurchaseOrder1($arr = [], $id = null, $ss = null)
    {

        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            "vendor_id" => "1|number|exists=vendors.id|Vendor identity is not correct",
            "po_number" => "0|string|0-50",
            "po_date" => "0|timestamp",
            "remarks" => "0|string|1-255",
            "items" => "1|array"
        ];

        $po_number = ['-', '_', '.', '#'];

        $res = DBX::validateObject($arr, $v_rule, 1, ['po_number' => $po_number], $ss->lang, false, null);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;
        $items = $inputs['items'];

        $po_date = convertDate($inputs['po_date']);
        if ($po_date > date('Y-m-d'))
            return DV::error('PO date cannot be later than today');
        if (!(bool) strtotime($po_date))
            $po_date = getNowTime();
        unset($inputs['items']);
        $create = !$id;
        $po_id = DBX::saveData($ss, 'purchase_orders', ['id' => $id], $inputs, [], 1, false);
        $success_count = 0;
        $item = null;
        $i = 0;
        if ($po_id) {
            do {
                if (!isset($items[$i]))
                    break;
                $item = $items[$i];


                $trx_id = 0;
                $item_id = $item->item_id;
                $input_item = ['item_id' => $item_id, 'unit' => $item->unit, 'unit_price' => $item->unit_price, 'qty' => $item->qty, 'po_id' => $po_id];
                //NOTE: Item::prepareDailyStockRecord() will ensure that there is one record in table "inv_daily_stock" for the (item_id,begin_qty,refield_qty,avail_qty, ...)
                $po_item = self::savePoItem($ss, $input_item, $po_id);

                $i++;
            } while ($item);

        }





        return DV::success(['data' => ['success_count' => $success_count, 'count' => $i]]);

    }
    function savePurchaseOrder($arr = [], $id = null, $ss = null)
    {

        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $v_rule = [
            "vendor_id" => "1|number|exists=vendors.id|Vendor identity is not correct",
            "po_number" => "0|string|0-50",
            "po_date" => "1|timestamp",
            "remarks" => "0|string|1-255",
            "discount_value" => "0|number|min=0",
            "discount_type" => "0|choice|percent,amount",
            "items" => "1|array"
        ];

        $po_number = ['-', '_', '.', '#'];

        $res = DBX::validateObject($arr, $v_rule, 1, ['po_number' => $po_number], $ss->lang, false, null);
        if ($res->error)
            return DV::error($res->error);

        $inputs = $res->values;
        $items = $inputs['items'];

        $po_date = convertDate($inputs['po_date']);
        if ($po_date > date('Y-m-d'))
            return DV::error('PO date cannot be later than today');
        if (!(bool) strtotime($po_date))
            $po_date = getNowTime();

        $inputs['po_date'] = $po_date;
        $inputs['discount_value'] = (float) ($inputs['discount_value'] ?? 0);
        $discount_type = $inputs['discount_type'] ?? 'percent';
        $inputs['discount_type'] = in_array($discount_type, ['percent', 'amount']) ? $discount_type : 'percent';
        // Save PO first, then compute summary totals from persisted line items.
        $inputs['total_amount'] = 0;
        $inputs['sub_total'] = 0;

        unset($inputs['items']);

        $create = !$id;

        $po_id = DBX::saveData($ss, 'purchase_orders', ['id' => $id], $inputs, [], 1, false);

        $valid_items = array_values(array_filter($items ?? [], function ($item) {
            $item = (object) $item;
            $item_id = isset($item->item_id) ? (int) $item->item_id : 0;
            $trx_id = isset($item->trx_id) ? (int) $item->trx_id : (isset($item->id) ? (int) $item->id : 0);
            return $item_id > 0 || $trx_id > 0;
        }));

        $success_count = 0;
        $count = count($valid_items);

        if ($po_id) {
            $existing_line_ids_by_item = [];
            if (!$create) {
                $existing_lines = DB::table('purchase_order_items')
                    ->where('po_id', $po_id)
                    ->orderBy('id', 'asc')
                    ->get(['id', 'item_id']);
                foreach ($existing_lines as $line) {
                    $key = (int) ($line->item_id ?? 0);
                    if ($key <= 0) {
                        continue;
                    }
                    if (!isset($existing_line_ids_by_item[$key])) {
                        $existing_line_ids_by_item[$key] = [];
                    }
                    $existing_line_ids_by_item[$key][] = (int) $line->id;
                }
            }

            foreach ($valid_items as $item) {

                $item = (object) $item;
                $trx_id = $item->trx_id ?? $item->id ?? null;
                if (!$create && $trx_id) {
                    $is_valid_trx = DB::table('purchase_order_items')
                        ->where('id', $trx_id)
                        ->where('po_id', $po_id)
                        ->exists();
                    if (!$is_valid_trx) {
                        $trx_id = null;
                    }
                }
                if (!$create && !$trx_id && !empty($item->item_id)) {
                    $item_key = (int) $item->item_id;
                    if ($item_key > 0 && !empty($existing_line_ids_by_item[$item_key])) {
                        $trx_id = array_shift($existing_line_ids_by_item[$item_key]);
                    }
                }
                // In modify mode, update only when explicit line id (trx_id) is provided.
                // If trx_id is missing, treat as a new line item.
                if (!$create && empty($item->item_id) && $trx_id) {
                    $existing_row_by_trx = DB::table('purchase_order_items')
                        ->where('po_id', $po_id)
                        ->where('id', $trx_id)
                        ->select('item_id')
                        ->first();
                    if ($existing_row_by_trx && !empty($existing_row_by_trx->item_id)) {
                        $item->item_id = $existing_row_by_trx->item_id;
                    }
                }
                if (empty($item->item_id)) {
                    return DV::error('Item ID is required to save purchase order item');
                }

                $input_item = [
                    'trx_id' => $trx_id,
                    'item_id' => $item->item_id ?? null,
                    'unit' => $item->unit ?? null,
                    'unit_price' => $item->unit_price ?? 0,
                    'qty' => $item->qty ?? 0,
                    'po_id' => $po_id
                ];


                $po_item = self::savePoItem($ss, $input_item, $po_id);

                if ($po_item) {
                    $success_count++;
                }
            }

            $sub_total = (float) DB::table('purchase_order_items')->where('po_id', $po_id)->sum('total_price');
            $discount_amount = $inputs['discount_type'] === 'percent'
                ? ($sub_total * $inputs['discount_value'] / 100)
                : $inputs['discount_value'];
            $total_amount = max(0, $sub_total - $discount_amount);
            DB::table('purchase_orders')->where('id', $po_id)->update([
                'sub_total' => $sub_total,
                'total_amount' => $total_amount
            ]);
        }

        return DV::success([
            'data' => [
                'po_id' => $po_id,
                'success_count' => $success_count,
                'count' => $count
            ]
        ]);
    }
    static function savePoItem($ss, $item, $po_id)
    {

        $item = (object) $item;
        $trx_id = $item->trx_id ?? null;
        if (!is_numeric($trx_id) || (int) $trx_id <= 0) {
            $trx_id = null;
        }

        $inputs = [
            "po_id" => $po_id,
            "item_id" => $item->item_id ?? $item->id ?? null,
            "qty" => $item->qty ?? 0,
            "unit_price" => $item->unit_price ?? 0,
            "total_price" => ($item->qty ?? 0) * ($item->unit_price ?? 0)
        ];
        // Omit unit from insert if purchase_order_items has no unit column; getItemsByPurchaseOrder uses i.unit for display

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

    /**
     * PO line / item unit to numeric id (1–4) for UI selects (pcs, kg, box, meter).
     */
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

    /**
     * Presentation fields for purchase order list rows (status badge + formatted money).
     *
     * @param  object  $row  Query row (mutated in place; same fields returned for clarity)
     */
   

    /**
     * Optional formatted display fields on PO header (numeric fields unchanged for forms).
     */
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

    function getPurchaseOrderList($filter, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $str_search = "1=1";
        $d = (object) $filter;
        $search_value = $d->search_value ?? null;
        $vendor_id = $d->vendor_id ?? null;
        $status_id = $d->status_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page))
            $current_page = 1;
        $skip_rows = ($current_page - 1) * $per_page;
        $str_where = '2=2';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(po.po_number Like '%" .$search_value ."%' OR v.name Like '%" . $search_value . "%')";
        }
        if ($vendor_id) {
            $str_where .= ' AND po.vendor_id = ' . $vendor_id;
        }

        if ($status_id) {
            $str_where .= ' AND po.status_id = ' . $status_id;
        }
        // $updated_at = DBX::formatTime('po.updated_at', 'updated_at');
        // $po_date = DBX::formatDate('po.po_date', 'po_date');
        $item_total = '(SELECT COALESCE(SUM(pi.total_price), 0) FROM purchase_order_items as pi WHERE pi.po_id = po.id)';
        $sub_total = 'COALESCE(po.sub_total, ' . $item_total . ')';
        $discount_amount = "CASE WHEN po.discount_type = 'percent' THEN (" . $item_total . " * COALESCE(po.discount_value, 0) / 100) ELSE COALESCE(po.discount_value, 0) END";
        $computed_total_amount = 'GREATEST(0, (' . $item_total . ') - (' . $discount_amount . '))';
        $total_amount = 'COALESCE(po.total_amount, ' . $computed_total_amount . ')';
        // status_id 2 = all lines received, status_id 3 = partial receive.
        // For this UI we want both to show "Received".
        // $statusLabel = "CASE WHEN po.status_id IN (2,3) THEN 'Received' ELSE ps.name END";
        $cols = 'po.id,po.po_number,po.vendor_id,po.po_date,po.authorized,po.status_id,ps.name as status,po.total_authorizers,po.auth_count,po.remarks,po.discount_value,po.discount_type,po.sub_total as stored_sub_total,po.total_amount as stored_total_amount,po.updated_at,po.update_user,v.id as vendor_id,v.name as vendor_name,v.phone_number,'. $sub_total . ' as sub_total,' . $total_amount . ' as total_amount';
        $query = DB::table('purchase_orders as po')
            // ->join('purchase_order_authorizations as au','au.po_id','=','po.id')
            ->join('vendors as v', 'v.id', '=', 'po.vendor_id')
            ->join('purchase_order_statuses as ps', 'ps.id', '=', 'po.status_id')
            ->whereRaw($str_where)
            ->whereRaw($str_search)
            ->selectRaw($cols)
            ->orderByRaw('po.id DESC');

        $count_query = clone $query;
        $count = $count_query->count('po.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach ($rows as $row) {
            $auth = DB::table('purchase_order_authorizations')
                ->where('po_id', $row->id)
                ->first();
                $row->authorizer = $auth->auth_user ?? null;
            $row->auth_date = $auth->auth_date ?? null;
            //au.auth_user as authorizer,au.auth_date,
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
            $row = setOfficialDates($row, ['auth_date','po_date'], ['updated_at'], []);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }
    public static function purchaseOrderDetails($id, $ss = null)
    {
        $row = DB::table('purchase_orders as po')
            ->where('po.id', $id)
            ->selectRaw('po.id,po.po_number,po.vendor_id,po.po_date,po.status_id,po.remarks,po.discount_value,po.discount_type,po.sub_total,po.total_amount')->first();
        if ($row) {
            self::decoratePurchaseOrderHeaderRow($row);
        }

        return $row;
    }
    public static function getFormOptions($id = null, $ss = null)
    {

        $po_details = $id ? self::purchaseOrderDetails($id, $ss) : null;

        return (object) [
            'po_details' => $po_details,
            'vendors' => GeneralSettings::options_vendor($ss),
            'po_statuses' => GeneralSettings::options_po_status($ss),
        ];
    }

    /**
     * Column on purchase_order_items that stores received quantity.
     * Supports receive_qty (preferred) or legacy DB typo recieve_amount.
     */
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

    function getItemsByPurchaseOrder($data, $ss)
    {
        $po_id = $data['po_id'] ?? $data['id'] ?? null;
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
            $row->status = $row->status_id == 1 ? 'Panding' : ($row->status_id == 2 ? 'Resived' : null);
            $row->unit_id = self::normalizePoUnitId($row->unit ?? null);
            $row->unit_price_formatted = '$ ' . number_format((float) ($row->unit_price ?? 0), 2, '.', '');
            $row->total_price_formatted = '$ ' . number_format((float) ($row->total_price ?? 0), 2, '.', '');
        }

        return $rows;
    }

    /**
     * Align purchase_orders.status_id with line receive progress after line-level receives:
     * 2 = every real line has Receive Qty + Break Amount = Ordered Qty; 3 = some receipt progress but not complete; 1 = no progress.
     * Matches the rules used in confirmPurchaseOrderReceived so the PO list shows "Received" when appropriate.
     */
    protected function syncPurchaseOrderHeaderStatusFromLines(int $poId, $ss = null): void
    {
        $ss = $ss ?? $this->userInfo;
        $receiveCol = self::purchaseOrderItemReceiveQtyColumnName();
        $hasBreak = Schema::hasColumn('purchase_order_items', 'break_amount');

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
        if ((int) $header->status_id === 2) {
            return;
        }

        $anyReceived = false;
        $allComplete = true;

        foreach ($lines as $line) {
            $ordered = (float) ($line->qty ?? 0);
            $recv = 0.0;
            if ($receiveCol) {
                $recv = (float) ($line->{$receiveCol} ?? 0);
            }
            $brk = $hasBreak ? (float) ($line->break_amount ?? 0) : 0.0;
            $lineStatus = (int) ($line->status_id ?? 0);

            if ($recv > 0 || $brk > 0 || $lineStatus === 2) {
                $anyReceived = true;
            }
            if (abs(($recv + $brk) - $ordered) > 0.02) {
                $allComplete = false;
            }
        }

        $newStatus = (int) $header->status_id;
        if ($allComplete && $anyReceived) {
            $newStatus = 2;
        } elseif ($anyReceived) {
            $newStatus = 3;
        }

        if ($newStatus !== (int) $header->status_id) {
            $now = getNowTime();
            $updateUser = $ss->login_name ?? $ss->user_name ?? 'User';
            DB::table('purchase_orders')->where('id', $poId)->update([
                'status_id' => $newStatus,
                'updated_at' => $now,
                'update_user' => $updateUser,
            ]);
        }
    }

    /**
     * Save Receive Qty / Break Amount on selected line items and mark those lines received (status_id = 2).
     * Updates purchase_orders header status when lines are fully received (2) or partially (3).
     *
     * @param array $payload Expects po_item_ids: int[] (purchase_order_items.id)
     */
    public function receivePurchaseOrder($id, $ss = null, $payload = [])
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
        if ((int) $po->status_id === 2) {
            return DV::error('This purchase order is already fully received.');
        }
        $itemCount = DB::table('purchase_order_items')->where('po_id', $id)->count();
        if ($itemCount === 0) {
            return DV::error('Purchase order has no line items to receive.');
        }

        $rawIds = $payload['po_item_ids'] ?? $payload['items'] ?? [];
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
        $payloadReceiveQty = null;
        if (isset($payload['receive_qty'])) {
            $payloadReceiveQty = (float) $payload['receive_qty'];
        } elseif (isset($payload['recieve_amount'])) {
            $payloadReceiveQty = (float) $payload['recieve_amount'];
        }
        $payloadBreakAmount = isset($payload['break_amount']) ? (float) $payload['break_amount'] : null;

        $selectedRows = DB::table('purchase_order_items')
            ->where('po_id', $id)
            ->whereIn('id', $lineIds)
            ->selectRaw('id, qty')
            ->get();
        foreach ($selectedRows as $row) {
            $orderedQty = (float) ($row->qty ?? 0);
            $receiveQty = $payloadReceiveQty !== null ? $payloadReceiveQty : $orderedQty;
            $breakAmount = $payloadBreakAmount !== null ? $payloadBreakAmount : 0;
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

    /**
     * Confirm PO as fully received: every real line must have Receive Qty + Break Amount = Ordered Qty (stored on items).
     * Use after user saved each line via Receive Line Item. Sets header and line status to received.
     */
    public function confirmPurchaseOrderReceived($id, $ss = null, $payload = [])
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
        if ((int) $po->status_id === 2) {
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
            $recv = 0.0;
            if ($receiveCol) {
                $recv = (float) ($line->{$receiveCol} ?? 0);
            }
            $brk = $hasBreak ? (float) ($line->break_amount ?? 0) : 0.0;
            if (abs(($recv + $brk) - $ordered) > 0.02) {
                $hasIncomplete = true;
                break;
            }
        }

        $allowPartial = !empty($payload['allow_partial']);
        if ($hasIncomplete) {
            if (!$allowPartial) {
                return DV::error('Not all items are fully received. For each line, Receive amount + Break Amount must equal Ordered Qty (save each line first).');
            }
            $remarks = trim((string) ($payload['remarks'] ?? $payload['remark'] ?? ''));
            if ($remarks === '') {
                return DV::error('Please enter remarks.');
            }
            $now = getNowTime();
            $updateUser = $ss->login_name ?? $ss->user_name ?? 'User';
            // Partial receive status for header (id:3 in this project)
            DB::table('purchase_orders')->where('id', $id)->update([
                'status_id' => 3,
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
            'status_id' => 2,
            'updated_at' => $now,
            'update_user' => $updateUser,
        ]);

        return DV::success(['message' => 'Purchase order confirmed as received.']);
    }

    /**
     * Delete a purchase order and its line items.
     */
    public function deletePurchaseOrder($id, $ss = null)
    {
        if (!$id) {
            return DV::error('Invalid purchase order ID.');
        }
        $po = DB::table('purchase_orders')->where('id', $id)->first();
        if (!$po) {
            return DV::error('Purchase order not found.');
        }
        DB::table('purchase_order_items')->where('po_id', $id)->delete();
        DB::table('purchase_orders')->where('id', $id)->delete();
        return DV::success(['message' => 'Purchase order has been deleted.']);
    }


    public function authorized($arr = [], $ss){
        $d = (object)$arr;
        $po_id = $d->po_id ?? null;

        if(!$po_id){
            return DV::error('Invalid PO id');
        }

        $exists = DB::table('purchase_order_authorizations')
            ->where('po_id', $po_id)
            ->where('auth_uid', $ss->user_id)
            ->exists();

        if($exists){
            return DV::error('you already authorized this PO.');
        }

        // Save authorization
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
            ->where('po_id',$po_id)
            ->count();

        $total_authorizers = DB::table('purchase_order_authorizers')
            ->where('inactive',0)
            ->count();
        $authorized = $authorized_count >= $total_authorizers ? 1 : 0;

        $updated = DB::table('purchase_orders')
            ->where('id',$po_id)
            ->update([
                'auth_count' => $authorized_count,
                'total_authorizers' => $total_authorizers,
                'authorized' => $authorized,
                'status_id' => $authorized ? 3 : 1
            ]);

        return DV::success();
    }
}
