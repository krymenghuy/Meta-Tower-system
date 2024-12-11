<?php

namespace App\Models\Bhr;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use App\Models\UM;
//use Carbon\Carbon;
//use Session;
use Illuminate\Support\Facades\DB;
use App\Security\Sanitizer;
//use Illuminate\Support\Collection;

class GeneralSettings //extends Model
{
    //use HasFactory;
    public static $email_chars = ['@','-','.','_'],
    $remark_chars = [':','-','.','?','$','\'','@'],
    $time_chars = [':','-'],
    $address_chars = ['.','#'],
    $image_chars = ['+',':',',',';','=','/','\\','?'],
    $address_map_chars = ['/', ':', ',', '!', '@', '?', '=', '&', '[', ']', '(', ')', '!', '.', '/', ':', '?', '=', '&', '#', '[', ']', '@', '!', '$', "'", '(', ')', '*', '+', ',', ';', '%'];

    public static $upload_dirs =[
        "package"=>"package", //Package's photos directory
        "default"=>"default",/** default user's photo '*/
        "mobile-slides"=>"mobile-slides",/** Mobile App banner photo files '*/
        "partner"=>"partner",
        "driver"=>"driver",
        "lead"=>"lead",
        "merchant"=>"merchant",
        "member"=>"member",
        "products"=>"products",
        "profiles"=>"profiles",
        "sales_agent"=>"sales_agent",
        "supplier_bills"=>"supplier_bills",
        "sender"=>"merchant",
        "staff"=>"staff",
        "employee"=>"staff",
        "general"=>"general",
        "person"=>"person",
        "admin"=>"general",
        "identity"=>"identity"
    ];

    /** Return a warehouse object {"id","name","address", "location":{"lat","lng"} } */
    static function getDefaultWarehouse($ss){
        $row = DB::table('warehouses as w')
        ->join('com_branch_warehouses as l', 'l.warehouse_id', '=', 'w.id')
        ->join('com_branches as b', 'b.id', '=', 'l.branch_id')
        ->where('l.branch_id', $ss->branch_id)
        ->where('l.is_default', 1) // Assuming it's is_default, not is_defaul
        ->select('w.id', 'w.name', 'w.address', 'w.lat', 'w.lng')
        ->first();
       return $row;
    }


    static function getExchangeRate($end_date = null,$ss=null){
        $str_branch_id = $ss? $ss->branch_id:'1=1';
        if(!$end_date) $end_date = date('Y-m-d');
        $row = DB::table('exchange_rates AS r')->whereRaw($str_branch_id)->whereRaw('DATE(r.x_date) <=\''.$end_date.'\'')->selectRaw('formatDate(r.x_date) AS x_date,r.currency_pair,ROUND(r.buy_rate,2) AS buy_rate,ROUND(r.buy_rate,2) AS rate,ROUND(r.sell_rate,2) AS sell_rate')->orderByRaw('r.x_date DESC')->take(1)->first();
        if($row) return $row;
        return (object)['x_date'=>date('d M Y'),'currency_pair'=>null,'buy_rate'=>1,'sell_rate'=>1];
    }

    static function homeCountry($branch_id=null){
        //Todo: set Home country setting for each subscriber or branch_id
        $rows = DB::table('loc_countries')->where('name','Cambodia')->select('id','name_kh','name','nationality')->take(1)->get();
        return isset($rows[0])?$rows[0]:null;
    }



    static function options_mobile_app($ss){
      return DB::table('um_applications AS l')->where('l.is_mobile_app',1)->selectRaw('l.app_id, l.name AS app_name,is_mobile_app')->get();
    }

    static function options_merchant($ss){
        $str_status_code ="l.status_code ='Active'";
        return  DB::table('sender as l')->whereRaw($str_status_code)->where('l.branch_id',$ss->branch_id)->select('l.id','l.name as sender_name')->orderBy('l.name','ASC')->get();
    }
    static function options_merchant_active($ss){
        $str_status_code ="l.status_code ='Active'";
        return  DB::table('sender as l')->whereRaw($str_status_code)->where('l.branch_id',$ss->branch_id)->select('l.id','l.name as sender_name')->orderBy('l.name','ASC')->get();
    }
    static function options_merchant_mobile($ss){
        //for Mobile app, => field name is "name", not "sender_name"
        $str_status_code ="l.status_code ='Active'";
        return  DB::table('sender as l')->whereRaw($str_status_code)->where('l.branch_id',$ss->branch_id)->select('l.id','l.name')->orderBy('l.name','ASC')->get();
    }
    static function options_warehouse($ss){
     return  DB::table('warehouses')->where('branch_id',$ss->branch_id)->selectRaw('name as warehouse_name,id')->orderBy('name','ASC')->get();
    }
    static function options_trx_type($ss){
        return [
          (object)['trx_type'=>'disbursement','name'=>'Money Out'],
          (object)['trx_type'=>'receipt','name'=>'Money In'],
        ];
    }
    static function options_sender($ss){
        return  DB::table('sender as s')->join('sender_classes as sc','s.id','=','sc.sender_id')->where('sc.sender_class','oversea')->where('s.branch_id',$ss->branch_id)->whereRaw('s.status_code =\'active\'')->selectRaw('CONCAT(s.name,\': \',code) AS sender_name,s.id')->orderBy('s.name','ASC')->get();
    }
    static function options_zone_type($ss){
        return [
           (object)['zone_type'=>'Local'],
           (object)['zone_type'=>'International']
        ];
    }
    static function options_vehicle_type($ss){
        return  DB::table('vehicle_type')->where('branch_id',$ss->branch_id)->selectRaw('id,code,name as vehicle_type')->get();
    }

    static function options_zone($ss){
        return  DB::table('zones')->where('branch_id',$ss->branch_id)->select('zone_code','zone_name')->orderBy('zone_name','ASC')->get();
    }

    //For report filter => so need to include (All) option.
    //Used in backend ReportCenter component
    static function options_delivery_status($ss){
       $rows = DB::table('package_statuses as ps')->whereIn('id',[6,8,9,11])->select('name as delivery_status','id')->orderBy('id','ASC')->get();
       $rows->prepend((object)['id'=>null,'delivery_status'=>'(All)']); // ("{'id':'','delivery_status':'(All)'}");
       return $rows;
    }

    //Used by Mobile apps (Merchant and Driver). NOTE that "status_id" must be of type string so that dart/flutter will process it correctly in mobile app
    static function options_package_status($ss=null){
        $rows[] = (object)['status'=>'All','status_id'=>null];
        $rows =DB::table("package_statuses AS ps")->whereRaw("ps.id IN (6,8,9,11)")->selectRaw('ps.name AS status, CONCAT(ps.id,\'\') as status_id')->orderBy("ps.id","ASC")->get();
        $rows[] = (object)['status'=>'(All)','status_id'=>''];
        //array_unshift($rows,(object)['status'=>'(All)','status_id'=>null]);
        return $rows;
    }

   static function options_driver_remark($ss=null){
     $branch_id = $ss?$ss->branch_id:1;
     return DB::table('remarks AS r')->where('r.branch_id',$branch_id)->selectRaw('r.remarks AS code,r.remarks')->get();
   }

   static function options_delivery_remark($category,$ss){
     $branch_id = $ss?$ss->branch_id:1;
     return DB::table('remarks AS r')->where('r.branch_id',$branch_id)->where('r.category',$category)->selectRaw('r.remarks AS code,r.remarks')->get();
   }
    static function options_product_type($ss){
      $branch_id =$ss?$ss->branch_id:1;
      return DB::table('product_types as p')->where('p.branch_id',$branch_id)->selectRaw('p.id,p.name AS product_type,p.name as code')->orderBy('p.name','ASC')->get();
    }

    static function options_pmt_status($ss=null){
       return [
        (object)['id'=>-1,'pmt_status'=>'(All)','status'=>'(All)'],
        (object)['id'=>0,'pmt_status'=>'Unpaid','status'=>'Unpaid'],
        (object)['id'=>1,'pmt_status'=>'Paid','status'=>'Paid']
       ];
    }
    static function options_driver($ss){
       $branch_id = $ss->branch_id;
       $str_status_code ="d.status_code ='Active'";
       $rows = DB::table('driver as d')->whereRaw($str_status_code)->where('branch_id',$branch_id)->select('id','name AS driver_name')->orderBy('d.name','ASC')->get();
       $rows->prepend((object)['id'=>null,'driver_name'=>'(All Drivers)']);
       return $rows;
     }

    static function options_driver_active($ss){
        $branch_id = $ss->branch_id;
        $str_status_code ="d.status_code ='Active'";
        $rows = DB::table('driver as d')->whereRaw($str_status_code)->where('branch_id',$branch_id)->select('id','name AS driver_name')->orderBy('d.name','ASC')->get();
        $rows->prepend((object)['id'=>null,'driver_name'=>'(All Drivers)']);
        return $rows;
    }


    //getReportFilterOptions_abm
    static function getReportFilterOptions_abm($ss){
        //$sender_statuses = [(object)['sender_status'=>'Active'], (object)['sender_status'=>'Inactive']];
        return (object)[
          //'users'=>DB::select("SELECT id as `user_id`,  full_name As `user_name` FROM um_users AS u WHERE u.branch_id = '$branch_id' ORDER BY u.full_name asc"),
          'customers'=>GeneralSettings::options_customer($ss),
          'suppliers'=>GeneralSettings::options_supplier($ss),
          'pmt_statuses'=>GeneralSettings::options_pmt_status($ss),
          'primary_cps'=>GeneralSettings::options_primary_cp($ss),
          'secondary_cps'=>GeneralSettings::options_secondary_cp($ss),
        ];
    }

    static function options_complete_status($ss){
        return [
            (object)['id'=>'-1','c_status'=>'(All)'],
            (object)['id'=>'1','c_status'=>'Completed'],
            (object)['id'=>'0','c_status'=>'Outstanding']
        ];
    }

    static function options_sales_affiliate($ss,$include_all =false,$active_only=true){
        $str_active = $active_only? 'a.status_code =\'active\'':'2=2';
        $rows = DB::table("os_affiliates as a")->where('branch_id',$ss->branch_id)->whereRaw($str_active)->selectRaw('a.id,CONCAT(a.name,\'(\',a.code,\')\') AS agent_name,a.code')->get();
        if($include_all){
           $rows->prepend((object)['id'=>null,'agent_name'=>'(All Agents)']);
        }
        return $rows;
    }

    static function options_shipment_code($ss,$include_all =false,$shipping_only=true){
        $str_status = $shipping_only? 's.status_id =\'2\'':'2=2';
        $rows = DB::table("os_shipments as s")->where('branch_id',$ss->branch_id)->whereRaw($str_status)->selectRaw('s.id, s.code AS shipment_code')->get();
        if($include_all){
           $rows->prepend((object)['id'=>null,'shipment_code'=>'(Select JTO shipment No.)']);
        }
        return $rows;
    }
    static function options_primary_cp($ss,$include_all =false,$active_only=true){
        $str_active = $active_only? 'a.status_code =\'active\'':'2=2';
        $rows = DB::table("os_affiliates as a")
        ->join('os_contact_persons as cp','cp.affiliate_id','=','a.id')
        ->where('a.branch_id',$ss->branch_id)
        ->where('cp.cp_type_id',1)
        ->whereRaw($str_active)
        ->selectRaw('cp.id,CONCAT(a.name,\' (\',a.code,\')\') AS primary_cp_name,a.code')->get();
        if($include_all){
           $rows->prepend((object)['id'=>null,'primary_cp_name'=>'(Select Contact Person)']);
        }
        return $rows;
    }
    static function options_secondary_cp($ss,$include_all =false,$active_only=true){
        $str_active = $active_only? 'a.status_code =\'active\'':'2=2';
        $rows = DB::table("os_affiliates as a")
        ->join('os_contact_persons as cp','cp.affiliate_id','=','a.id')
        ->where('a.branch_id',$ss->branch_id)
        ->where('cp.cp_type_id',2)
        ->whereRaw($str_active)
        ->selectRaw('cp.id,CONCAT(a.name,\' (\',a.code,\')\') AS secondary_cp_name,a.code')->get();
        if($include_all){
           $rows->prepend((object)['id'=>null,'secondary_cp_name'=>'(Select Contact Person)']);
        }
        return $rows;
    }
    static function options_supplier($ss,$include_all =false,$active_only=true){
        $str_active = $active_only? 's.status_code =\'active\'':'2=2';
        $rows = DB::table("os_suppliers as s")
        ->where('s.branch_id',$ss->branch_id)
        ->whereRaw($str_active)
        ->selectRaw('s.id,CONCAT(s.name,\' (\',s.code,\')\') AS supplier_name,s.code')->get();
        if($include_all){
           $rows->prepend((object)['id'=>null,'supplier_name'=>'(Select Supplier)']);
        }
        return $rows;
    }
    static function options_country_zone($ss){
        $rows = DB::table('loc_countries as c')
        ->join('os_zone_countries as zc','zc.country_id','=','c.id')
        ->where('c.branch_id',$ss->branch_id)
        // ->select('c.id','c.standard_zone',DB::raw("CONCAT(c.name,' (',c.standard_zone,')') as country_name"))
        ->selectRaw('c.id,CONCAT(c.name,\'(\',zc.zone_code,\')\') As country_name')
        ->get();

        return $rows;
    }

    static function options_calendar_month($ss=null)
    {
        $months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        $monthObjects = collect($months)->map(function ($month, $i) {
            return (object)['month' => $i + 1, 'month_name' => $month];
        });

        return $monthObjects;
    }

    static function options_calendar_year($ss = null)
    {
        $currentYear = now()->year;
        $years = range($currentYear, $currentYear - 19);

        $yearObjects = collect($years)->map(function ($year) {
            return (object)['year' => $year];
        });

        return $yearObjects;
    }

    static function options_customer($ss = null)
    {
        return DB::table('sender as s')->join('sender_classes as sc','sc.sender_id','=','s.id')->where('sc.sender_class','oversea')->selectRaw('s.id ,s.name as customer_name')->get();
    }

    static function options_calendar_month_year($ss = null)
    {
        $currentYear = now()->year;
        $months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        $monthYearObjects = collect(range(0, 23))->map(function ($index) use ($currentYear, $months) {
            $year = $currentYear - intval($index / 12);
            $month = $months[$index % 12];
            $month_num = ($index % 12) + 1;
            return (object)['month' => $month_num . '_' . $year, 'month_year' => "{$month} {$year}"];
        })->sortByDesc(function ($item) {
            // Sort by year first, then by month_num
            [$month_num, $year] = explode('_', $item->month);
            return [$year, $month_num];
        });

        return $monthYearObjects->values()->toArray();
    }


    static function options_country($ss){
        //$branch_id = $ss->branch_id;
        return DB::table('loc_countries as c')->select('id','name as country')->orderBy('c.name','ASC')->get();
    }
    static function options_city($country_id=null, $ss){
        //$branch_id = $ss->branch_id;
        $str_country ="1=1";
        if($country_id) $str_country ="c.country_id =$country_id";
        return DB::table('loc_cities as c')->whereRaw($str_country)->select('id','name as city')->orderBy('c.name','ASC')->get();
    }
    static function options_district($city_id=null, $ss){
        //$branch_id = $ss->branch_id;
        $str_city ="1=1";
        if($city_id) $str_city ="c.city_id =$city_id";
        return DB::table('loc_districts as c')->whereRaw($str_city)->select('id','name as district')->orderBy('c.name','ASC')->get();
    }

    static function options_commune($district_id=null, $ss){
        //$branch_id = $ss->branch_id;
        $str_where ="1=1";
        if($district_id) $str_where ="c.district_id =$district_id";
        return DB::table('loc_communes as c')->whereRaw($str_where)->select('id','name as commune')->orderBy('c.name','ASC')->get();
    }

    static function options_leave_status($ss){
        return DB::table('leave_statuses')->selectRaw('id,name as leave_status')->get();
    }

    static function options_leave_type($ss){
        return DB::table('leave_types')->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name AS leave_type')->get();
    }
    static function options_position($ss){
        return DB::table('positions')->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,title AS position')->get();
    }
    static function options_emp_type($ss){
        return DB::table('emp_types')->selectRaw('id,name AS emp_type')->get();
    }
    static function options_organization($ss){
        return DB::table('organizations')->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name AS organization')->get();
    }

    /** $emp_status_id = {1o: Active, 20: Resigned, 21: Terminiated}*/
    static function options_employee($emp_status_id, $ss){
       $q = DB::table('employees as e')->where('e.subs_id',hex2bin($ss->subs_id))->selectRaw('id,name, sex, name_kh,phone_number,email,position_id,photo_file_name');
       if($emp_status_id) $q->where('e.status_id',$emp_status_id);
       $rows = $q->get();
       foreach($rows as $row){
         $row->image_url = Employee::profilePicture($row->id);
         $position_title = DB::table('positions')->where('id',$row->position_id)->value('title');
         $row->position = $position_title;
         unset($row->photo_file_name);
       }
       return $rows;
    }

    static function options_nationality($ss){
        return DB::table('loc_countries')->selectRaw('id,nationality')->orderByRaw('nationality ASC')->get();
    }
    static function loc_options_city($ss){
        return DB::table('loc_cities')->selectRaw('country_id,name')->orderByRaw('name ASC')->get();

    }

    static function options_branch($ss){
        return DB::table('um_branches')->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name AS branch_name')->get();
    }

    static function options_payroll($ss){
        return DB::table('payrolls')->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,name AS payroll_name')->get();
    }

<<<<<<< HEAD
    static function options_employees($ss,$emp_status_id = null){
        $q = DB::table('employees as e')->where('e.subs_id',hex2bin($ss->subs_id))->selectRaw('id,name as employee_name');
       if($emp_status_id) $q->where('e.status_id',$emp_status_id);
       $rows = $q->get();
        return $rows;
    }
    
=======
    static function options_skill($ss){
        return DB::table('skills')->where('subs_id',hex2bin($ss->subs_id))->selectRaw('id,title AS skill')->get();
    }
>>>>>>> 46e32072776819e8cbf5d8e340fac4c436471450

    function deleteProductType($d){
        $ss = UM::getUserInfoByToken($d);
        if($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $id = isset($d->id)?Sanitizer::sanitize($d->id):null;
        $id =isset($d->id)?Sanitizer::sanitize($d->id):0;
        DB::table('product_types')->where('branch_id',$branch_id)->where('id',$id)->delete();
        return null;
    }

    function sendMessage($d){
        $ss = UM::getUserInfoByToken($d);
        if($ss->status_code !==200) return $ss; //user not authenticated
         //need permission to do this task
        $branch_id = Sanitizer::sanitize($ss->branch_id);
        $phone_number = isset($d->phone_number)?Sanitizer::sanitize($d->phone_number):null;
        $text = isset($d->text)?Sanitizer::sanitize($d->text):null;

                $fields = array(
                    //'app_id' => "5eb5a37e-b458-11e3-ac11-000c2940e62c",
                    'gw-username'=>'xperasoft',
                    'gw-password'=>'bchsd',
                    'gw-to'=>$phone_number,
                    'gw-from'=>'Dolgoal',
                    'gw-text'=>$text
                    //'token' =>'di5B9xXcZeULyNAFSsdv9COWOzBPWE',
                );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "http://sms.plasgate.com:29062/cgi-bin/sendsms");
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json; charset=utf-8',
                'Authorization: Basic di5B9xXcZeULyNAFSsdv9COWOzBPWE'
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

            $response = curl_exec($ch);
            curl_close($ch);

            return $response;
    }

//     function getProductTypes($d){
//         $ss = UM::getUserInfoByToken($d);
//         if($ss->status_code !==200) return $ss; //user not authenticated
//          //need permission to do this task
//         $branch_id = Sanitizer::sanitize($ss->branch_id);
//         $sender_id = isset($d->sender_id)?Sanitizer::sanitize($d->sender_id):null;
//         $id =isset($d->id)?Sanitizer::sanitize($d->id):0;
//         DB::table('sender_base_price')->where('id',$id)->where('branch_id',$branch_id)->delete();
//         return null;
//     }

//    static function options_lead_status($ss =null){
//      $branch_id =1;
//      return DB::table('lead_statuses as ls')->selectRaw('id,`name` as status')->get();
//    }
//    static function options_lead_category($ss =null){
//     $branch_id =1;
//     return DB::table('lead_categories as c')->selectRaw('c.id,c.`name` as category')->get();
//   }
//   static function options_business_type($ss =null){
//     $branch_id =1;
//     return DB::table('sender_business_types as b')->selectRaw('b.`business_type` AS code, b.`business_type`, b.allow_register')->get();
//   }

  //warning
  static function options_warning_types($ss =null){
    return DB::table('warning_types as t')->selectRaw('id, name as warning_types')->get();
  }
  static function select_options($arr,$ss){
    $d = (object)$arr;
    $str_where = '1=1';

    $res = [
        'branches' => self::options_branch($ss),
        'leave_types' => self::options_leave_type($ss),
        'emp_types' => self::options_emp_type($ss),
        'payrolls' => self::options_payroll($ss),
        'employees' => self::options_employees($ss),
    ];
    return $res;
}

}
