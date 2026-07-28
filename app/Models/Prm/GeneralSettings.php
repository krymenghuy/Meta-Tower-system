<?php

namespace App\Models\Prm;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
//use Session;
use DBX;
use Illuminate\Support\Facades\DB;
//use Illuminate\Support\Collection;
use XBranch;

class GeneralSettings //extends Model
{
    //use HasFactory;
    public static $email_chars = ['@', '-', '.', '_'],
        $remark_chars = [':', '-', '.', '?', '$', '\'', '@'],
        $time_chars = [':', '-'],
        $address_chars = ['.', '#'],
        $mime_type_chars = ['.', '-'],
        $image_chars = ['+', ':', ',', ';', '=', '/', '\\', '?'],
        $address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%', '-', '.', '_', '#'];

    public static $upload_dirs = [
        "package" => "package", //Package's photos directory
        "default" => "default",
        /** default user's photo '*/
        "mobile-slides" => "mobile-slides",
        /** Mobile App banner photo files '*/
        "partner" => "partner",
        "driver" => "driver",
        "lead" => "lead",
        "merchant" => "merchant",
        "member" => "member",
        "products" => "products",
        "profiles" => "profiles",
        "sales_agent" => "sales_agent",
        "supplier_bills" => "supplier_bills",
        "sender" => "merchant",
        "staff" => "staff",
        "employee" => "staff",
        "general" => "general",
        "person" => "person",
        "admin" => "general",
        "identity" => "identity"
    ];

    /** Return a warehouse object {"id","name","address", "location":{"lat","lng"} } */
    static function getDefaultWarehouse($ss)
    {
        $row = DB::table('warehouses as w')
            ->join('com_branch_warehouses as l', 'l.warehouse_id', '=', 'w.id')
            ->join('com_branches as b', 'b.id', '=', 'l.branch_id')
            ->where('l.branch_id', $ss->branch_id)
            ->where('l.is_default', 1) // Assuming it's is_default, not is_defaul
            ->select('w.id', 'w.name', 'w.address', 'w.lat', 'w.lng')
            ->first();
        return $row;
    }


    static function getExchangeRate($end_date = null, $ss = null)
    {
        $str_branch_id = $ss ? $ss->branch_id : '1=1';
        if (!$end_date)
            $end_date = date('Y-m-d');
        $row = DB::table('exchange_rates AS r')->whereRaw($str_branch_id)->whereRaw('DATE(r.x_date) <=\'' . $end_date . '\'')->selectRaw('formatDate(r.x_date) AS x_date,r.currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->take(1)->first();
        if ($row)
            return $row;
        return (object) ['x_date' => date('d M Y'), 'currency_pair' => null, 'buy_rate' => 1, 'sell_rate' => 1];
    }

    static function homeCountry($branch_id = null)
    {
        //Todo: set Home country setting for each subscriber or branch_id
        $rows = DB::table('loc_countries')->where('name', 'Cambodia')->select('id', 'name_kh', 'name', 'nationality')->take(1)->get();
        return isset($rows[0]) ? $rows[0] : null;
    }
    static function options_department($ss)
    {
        return DB::table('departments')->selectRaw('id,name')->get();
    }


    static function options_mobile_app($ss)
    {
        return DB::table('um_applications AS l')->where('l.is_mobile_app', 1)->selectRaw('l.app_id, l.name AS app_name,is_mobile_app')->get();
    }

    static function options_merchant($ss)
    {
        $str_status_code = "l.status_code ='Active'";
        return DB::table('sender as l')->whereRaw($str_status_code)->where('l.branch_id', $ss->branch_id)->select('l.id', 'l.name as sender_name')->orderBy('l.name', 'ASC')->get();
    }
    static function options_merchant_active($ss)
    {
        $str_status_code = "l.status_code ='Active'";
        return DB::table('sender as l')->whereRaw($str_status_code)->where('l.branch_id', $ss->branch_id)->select('l.id', 'l.name as sender_name')->orderBy('l.name', 'ASC')->get();
    }
    static function options_merchant_mobile($ss)
    {
        //for Mobile app, => field name is "name", not "sender_name"
        $str_status_code = "l.status_code ='Active'";
        return DB::table('sender as l')->whereRaw($str_status_code)->where('l.branch_id', $ss->branch_id)->select('l.id', 'l.name')->orderBy('l.name', 'ASC')->get();
    }
    static function options_warehouse($ss)
    {
        return DB::table('warehouses')->where('branch_id', $ss->branch_id)->selectRaw('name as warehouse_name,id')->orderBy('name', 'ASC')->get();
    }
    static function options_trx_type($ss)
    {
        return [
            (object) ['trx_type' => 'disbursement', 'name' => 'Money Out'],
            (object) ['trx_type' => 'receipt', 'name' => 'Money In'],
        ];
    }
    static function options_exit_form($ss)
    {
        return DB::table('forms as f')->selectRaw('id,name')->get();
    }
    // static function options_service_types($ss){
    //     return DB:: table('service_types')->selectRaw('id,name,code')->get();
    // }
    static function options_pmt_status($ss = null)
    {
        return [
            (object)['id' => -1, 'pmt_status' => '(All)', 'status' => '(All)'],
            (object)['id' => 0, 'pmt_status' => 'Unpaid', 'status' => 'Unpaid'],
            (object)['id' => 1, 'pmt_status' => 'Paid', 'status' => 'Paid']
        ];
    }

    static function options_calendar_month($ss = null)
    {
        $months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        $monthObjects = collect($months)->map(function ($month, $i) {
            return (object) ['month' => $i + 1, 'month_name' => $month];
        });

        return $monthObjects;
    }

    static function options_calendar_year($ss = null)
    {
        $currentYear = now()->year;
        $years = range($currentYear, $currentYear - 19);

        $yearObjects = collect($years)->map(function ($year) {
            return (object) ['year' => $year];
        });

        return $yearObjects;
    }

    static function options_customer($ss = null)
    {
        return DB::table('sender as s')->join('sender_classes as sc', 'sc.sender_id', '=', 's.id')->where('sc.sender_class', 'oversea')->selectRaw('s.id ,s.name as customer_name')->get();
    }

    static function options_calendar_month_year($ss = null)
    {
        $currentYear = now()->year;
        $months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        $monthYearObjects = collect(range(0, 23))->map(function ($index) use ($currentYear, $months) {
            $year = $currentYear - intval($index / 12);
            $month = $months[$index % 12];
            $month_num = ($index % 12) + 1;
            return (object) ['month' => $month_num . '_' . $year, 'month_year' => "{$month} {$year}"];
        })->sortByDesc(function ($item) {
            // Sort by year first, then by month_num
            [$month_num, $year] = explode('_', $item->month);
            return [$year, $month_num];
        });

        return $monthYearObjects->values()->toArray();
    }


    static function options_country($ss)
    {
        //$branch_id = $ss->branch_id;
        return DB::table('loc_countries as c')->select('id', 'name as country')->orderBy('c.name', 'ASC')->get();
    }
    static function options_city($country_id = null, $ss)
    {
        //$branch_id = $ss->branch_id;
        $str_country = "1=1";
        if ($country_id)
            $str_country = "c.country_id =$country_id";
        return DB::table('loc_cities as c')->whereRaw($str_country)->select('id', 'name as city')->orderBy('c.name', 'ASC')->get();
    }
    static function options_district($city_id = null, $ss)
    {
        //$branch_id = $ss->branch_id;
        $str_city = "1=1";
        if ($city_id)
            $str_city = "c.city_id =$city_id";
        return DB::table('loc_districts as c')->whereRaw($str_city)->select('id', 'name as district')->orderBy('c.name', 'ASC')->get();
    }

    static function options_commune($district_id = null, $ss)
    {
        //$branch_id = $ss->branch_id;
        $str_where = "1=1";
        if ($district_id)
            $str_where = "c.district_id =$district_id";
        return DB::table('loc_communes as c')->whereRaw($str_where)->select('id', 'name as commune')->orderBy('c.name', 'ASC')->get();
    }

    static function options_leave_status($ss)
    {
        return DB::table('leave_statuses')->selectRaw('id,name as leave_status')->get();
    }

    static function options_session($ss)
    {
        return [
            (object) ['id' => 'm', 'session' => 'Morning'],
            (object) ['id' => 'a', 'session' => 'Afternoon'],
        ];
    }

    static function options_leave_type($ss)
    {
        return DB::table('leave_types')->selectRaw('id,name AS leave_type')->get();
    }

    static function options_organization($ss)
    {
        return DB::table('organizations')->where('subs_id', hex2bin($ss->subs_id))->selectRaw('id,name AS organization')->get();
    }


    static function options_nationality($ss)
    {
        $rows = DB::table('loc_countries')->selectRaw('id,nationality')->orderByRaw('nationality ASC')->get();
        $new_row = [];
        $new_row[] = (object) [
            // 'nationality' => 'Select Nationality',
            'id' => '',

        ];
        foreach ($rows as $row) {
            $new_row[] = (object) [
                'nationality' => $row->nationality,
                'id' => $row->id
            ];
        }
        return $new_row;
    }
    static function loc_options_city($ss)
    {
        return DB::table('loc_cities')->selectRaw('id as birth_city_id,name as city_name')->orderByRaw('name ASC')->get();
    }

    static function options_branch($ss)
    {
        // return DB::table('um_branches')->where('subs_id', hex2bin($ss->subs_id))->selectRaw('id,name AS branch_name')->get();
        return $campus_map = XBranch::query()->alias('b')->whereRaw(DBX::whereBinary('subs_id', $ss->subs_id))->selectRaw('id,name')->get();
    }

    static function select_options($arr, $ss)
    {
        $res = [
            'statuses' => self::options_tenant_status($ss),
            'buildings' => self::options_building($ss),
            'vendors' => self::options_vendor($ss),


        ];
        return $res;
    }

    static function options_status($ss)
    {
        return DB::table('statuses')->selectRaw('id,name AS status')->get();
    }

    static function options_member_status($ss)
    {
        return DB::table('member_statuses')->selectRaw('id,name AS member_status')->get();
    }
    static function options_acc_staff_status($ss)
    {
        return DB::table('staff_statuses')->selectRaw('id,name AS staff_status')->get();
    }

    static function options_grave_status($ss)
    {
        return DB::table('grave_statuses')->selectRaw('id,name AS grave_status')->get();
    }
    static function options_recommender($ss)
    {
        return DB::table('members')->selectRaw('id,name AS recommender')->get();
    }
    static function options_contract_status($ss)
    {
        return DB::table('contract_statuses')->selectRaw('id,name as status_name')->get();
    }

    // Add a new method for tenants with active contracts
    public static function options_tenant_with_active_contract($ss)
    {
        return DB::table('tenants as t')
            ->join('contracts as c', 'c.tenant_id', '=', 't.id')
            ->where('t.status_id', '=', 2)
            // ->where('t.branch_id', '=', $ss->branch_id)
            ->select('t.id', 't.name as tenant', 't.phone_number', 'c.id as contract_id')
            ->distinct()  // In case tenant has multiple active contracts
            ->orderBy('t.name')
            ->get();
    }

    static function options_document_type($ss)
    {
        return DB::table('document_types')->selectRaw('id,name as document_type')->get();
    }

    static function options_service_status($ss)
    {
        return DB::table('service_statuses')->selectRaw('id,name as status_name')->get();
    }
    static function options_amenity_status($ss)
    {
        return DB::table('amenity_statuses')->selectRaw('id,name as amenity_status')->get();
    }
    static function options_amenity($ss)
    {
        return DB::table('amenities')
            ->where('status_id', 1)
            // ->where('requires_booking',1)
            ->selectRaw('id, name AS amenity, code as amenity_code, max_capacity,category_id')
            ->orderBy('name')
            ->get();
    }

    static function options_maintenance_amenity($ss)
    {
        return DB::table('amenities')
            ->where('status_id', 1)
            ->selectRaw('id, building_id, name AS amenity, code as amenity_code, max_capacity,category_id')
            ->orderBy('name')
            ->get();
    }

    // static function options_amenity($ss, $requires_booking_only = true)
    // {
    //     $query = DB::table('amenities')
    //         ->where('status_id', 1);

    //     if ($requires_booking_only) {
    //         $query->where('requires_booking', 1);
    //     }

    //     return $query
    //         ->selectRaw('id, name AS amenity, code as amenity_code, max_capacity,category_id')
    //         ->orderBy('name')
    //         ->get();
    // }

    static function options_reservation_status($ss)
    {
        return DB::table('reservation_statuses')->selectRaw('id,name as reservation_status')->get();
    }

    // public static function options_service_status($ss)
    // {
    //     return DB::table('service_statuses')
    //         ->select('id', 'name')
    //         ->orderBy('id')
    //         ->get();
    // }

    static function options_member($ss)
    {
        $row = DB::table('members')->selectRaw('id,name AS member_name')->get();
        $new_row = [];
        $new_row[] = (object) [
            'member_name' => 'Select Member',
            'id' => '',
        ];
        foreach ($row as $r) {
            $new_row[] = (object) [
                'member_name' => $r->member_name,
                'id' => $r->id
            ];
        }
        return $new_row;
    }





    static function options_task_type($ss)
    {
        return DB::table('task_types')->selectRaw('id,title AS task_type_title')->get();
    }

    static function options_deceased($ss)
    {
        $row = DB::table('deceased_registrations')->selectRaw('id,name AS deceased_name')->get();
        $new_row = [];
        $new_row[] = (object) [
            'deceased_name' => 'Select Deceased',
            'id' => '',
        ];
        foreach ($row as $r) {
            $new_row[] = (object) [
                'deceased_name' => $r->deceased_name,
                'id' => $r->id
            ];
        }
        return $new_row;
    }

    static function options_space_type($ss)
    {
        return DB::table('space_types')->selectRaw('id,name AS space_type')->get();
    }
    static function options_building($ss)
    {
        return DB::table('buildings')->selectRaw('id,name AS building,prefix')->get();
    }
    static function options_floor($ss)
    {
        return DB::table('floors')->selectRaw('id,name')->get();
    }
    static function options_tenant($ss)
    {
        return DB::table('tenants')->selectRaw('id,code,name AS tenant,phone_number,legal_name')->get();
    }
    static function options_tenant_status($ss)
    {
        return DB::table('tenant_statuses')->selectRaw('id,name')->get();
    }

    static function options_service($ss)
    {
        return DB::table('services')
            ->selectRaw('id,name AS service, price, charge_as, type_id')
            ->get();
    }


    static function options_service_types($ss)
    {
        return DB::table('service_types')
            ->selectRaw('id,name as service_type')
            ->get();
    }
    static function options_service_categories($ss)
    {
        return DB::table('service_categories')
            ->selectRaw('id,name as service_category')
            ->get();
    }



    static function options_service_type_request($ss)
    {
        return DB::table('service_types')
            ->selectRaw('id, name as service_type')
            // ->whereIn('id', [1,4])
            // ->whereIn('id', [1, 4])
            ->orderBy('id')
            ->get();
    }
    static function options_bank($ss)
    {
        return DB::table('banks')->selectRaw('id,name')->get();
    }
    static function options_service_request_type($category_id = null)
    {
        $category_id = $category_id ?? -1;
        $str_where = '1=1';
        if ($category_id > 0) {
            $str_where = 's.category_id = ' . $category_id;
        }
        $rows = DB::table('services as s')
            ->join('service_categories as sc', 'sc.id', '=', 's.category_id')
            ->whereRaw($str_where)
            ->where('s.type_id', 1)
            ->where('s.status_id', 1)
            ->selectRaw('s.id, s.name as service_name, s.category_id, s.price, s.charge_as, sc.name as service_category')
            ->orderBy('sc.name')
            ->orderBy('s.name')
            ->get();
        foreach ($rows as $row) {
            $charge_as = ucwords(str_replace('_', ' ', strtolower($row->charge_as ?? '')));
            $row->service_name = $row->service_name . ' (' . $charge_as . ')';
        }
        return $rows;
    }


    static function options_legal($ss)
    {
        return DB::table('tenants')->selectRaw('id,legal_name')->get();
    }

    static function options_business_type($ss)
    {
        return DB::table('business_types')->selectRaw('id,name AS business_type')->get();
    }

    /** Join + columns shared by options_building_space and options_building_space_rows_by_ids. */
    private static function buildingSpaceOptionRowsBaseQuery()
    {
        return DB::table('building_spaces as bs')
            ->join('space_types as st', 'st.id', '=', 'bs.space_type_id')
            ->selectRaw('
                bs.id,
                bs.code,
                bs.code as floor_id,
                bs.building_id,
                bs.space_type_id,
                st.name as space_type,
                bs.sqm_size,
                bs.price_type,
                bs.price
            ');
    }

    static function options_building_space($ss, $include_space_id = null, $exclude_under_maintenance = false)
    {
        $query = self::buildingSpaceOptionRowsBaseQuery()
            ->where(function ($q) use ($include_space_id) {
                $q->where('bs.status_id', 1); // available
                if (!empty($include_space_id)) {
                    $q->orWhere('bs.id', $include_space_id);
                }
            });
        if ($exclude_under_maintenance) {
            $query->where(function ($q) use ($include_space_id) {
                $q->where('bs.maintenance_status_id', 0)
                    ->orWhereNull('bs.maintenance_status_id');
                if (!empty($include_space_id)) {
                    $q->orWhere('bs.id', $include_space_id);
                }
            });
        }

        return $query->orderBy('bs.code')->get();
    }

    /**
     * Same columns as options_building_space for dropdowns, but only the given ids and no status filter
     * (so occupied / booked spaces can still appear when editing contracts).
     */
    static function options_building_space_rows_by_ids(array $ids)
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids))));
        if ($ids === []) {
            return collect();
        }

        return self::buildingSpaceOptionRowsBaseQuery()
            ->whereIn('bs.id', $ids)
            ->orderBy('bs.code')
            ->get();
    }

    static function options_request_status($ss)
    {
        return DB::table('request_statuses')->selectRaw('id,name')->get();
    }

    static function options_receipt_status($ss)
    {
        return DB::table('receipt_statuses')->selectRaw('id,name')->get();
    }

    static function options_vendor_types($ss)
    {
        return DB::table('vendor_types')->selectRaw('id,name as vendor_type')->get();
    }

    static function options_vendor_categories($ss)
    {
        return DB::table('vendor_categories')->selectRaw('id,name as vendor_category')->get();
    }
    static function options_vendor_statuses($ss)
    {
        return DB::table('vendor_statuses')->selectRaw('id,name as vendor_status')->get();
    }
    static function options_bill_statuses($ss)
    {
        return DB::table('bill_statuses')->selectRaw('id,name as bill_status')->get();
    }
    static function options_contracts($ss)
    {
        return DB::table('contracts')->selectRaw('id,name as contract')->get();
    }

    static function options_space_status($ss)
    {
        $rows = DB::table('space_statuses')->selectRaw('id,name as space_status')->get();
        // if($rows){
        //     $rows[] = (object) ['id' => 4, 'space_status' => 'Maintenance'];
        // }
        return $rows;
    }
    static function options_payment_status($ss)
    {
        return DB::table('payment_statuses')->selectRaw('id,name as payment_status')->get();
    }

    static function options_payment_method($ss)
    {
        return DB::table('payment_methods')->selectRaw('id,name as payment_method')->get();
    }
    static function options_floors($building_id = null)
    {
        //$branch_id = $ss->branch_id;
        $building_id = $building_id ?? null;
        $str_where = "1=1";
        if ($building_id > 0) {
            $str_where = 'bf.building_id = ' . $building_id;
            $rows = DB::table(table: 'building_floors as bf')
                ->join('floors as f', 'f.id', '=', 'bf.floor_id')
                ->join('buildings as b', 'b.id', '=', 'bf.building_id')
                ->whereRaw($str_where)
                ->selectRaw('bf.floor_id as id,f.name')->get();
        } else {
            $rows = DB::table(table: 'floors as f')
                ->selectRaw('f.id,f.name')->get();
        }

        return $rows;
    }

    static function options_amenity_category($ss)
    {
        return DB::table('amenity_categories')->selectRaw('id,name as amenity_category')->get();
    }

    static function options_maintenance_type($ss)
    {
        return DB::table('maintenance_types')->selectRaw('id,name as maintenance_type')->get();
    }

    static function options_maintenance_status($ss)
    {
        return DB::table('maintenance_statuses')->selectRaw('id,name as maintenance_status')->get();
    }

    static function options_staff($ss)
    {
        $branch_id = $ss->branch_id ?? null;
        $query = DB::table('um_users')->selectRaw('id, login_name as staff_name');
        if ($branch_id > 0) {
            $query->where('branch_id', $branch_id);
        }
        return $query->orderBy('login_name')->get();
    }
    static function options_vendor($ss)
    {
        return DB::table('vendors')
            // ->where('status_id', 1)
            ->selectRaw('id, name AS vendor, phone_number')
            ->get();
    }
    static function options_po_status($ss)
    {
        return DB::table('purchase_order_statuses')->selectRaw('id,name')->whereIn('id', [1, 3, 4, 5, 7])->get();
    }
    static function options_expense_categories($ss)
    {
        return DB::table('expense_categories')->selectRaw('id,name as expense_category')->get();
    }


    static function options_expense_statuses($ss)
    {
        return DB::table('expense_statuses')->selectRaw('id,name as expense_status')->get();
    }
    public static function options_period($ss)
    {
        $months = [];

        $year = Carbon::today()->year;

        for ($m = 1; $m <= 12; $m++) {
            $date = Carbon::createFromDate($year, $m, 1);

            $months[] = [
                'value' => $date->format('Y-m'),
                'label' => $date->format('M Y')
            ];
        }

        return $months;
    }
    static function options_position($ss)
    {
        $q = DB::table('positions')
            ->selectRaw('id, name as position_name');

        return $q->get();
    }
    static function options_work_shift($ss)
    {
        $q = DB::table('work_shifts')
            ->where('subs_id', hex2bin($ss->subs_id))
            ->selectRaw('id, name');

        return $q->get();
    }
    static function options_payroll($ss)
    {
        return DB::table('payrolls')->selectRaw('id,name AS payroll_name,month,year')->get();
    }
    static function options_employee($emp_status_ids, $ss)
    {
        $q = DB::table('employees as e')
            // ->where('e.subs_id', hex2bin($ss->subs_id))
            ->selectRaw('id, name, code, sex, name_kh, phone_number, email, position_id, photo_file_name');

        if (!empty($emp_status_ids)) {
            $q->whereIn('e.status_id', (array) $emp_status_ids);
        }

        $rows = $q->get();

        foreach ($rows as $row) {
            $position_title = DB::table('positions')->where('id', $row->position_id)->value('name');
            $row->position = $position_title;
            unset($row->photo_file_name);
        }

        return $rows;
    }
}
