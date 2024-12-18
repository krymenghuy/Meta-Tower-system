<?php
use Illuminate\Support\Facades\Route;
//use app\Http\Middleware\CustomRateLimiter;
  use App\Services\Umt\AuthService;
  use App\Http\Controllers\Bhr\ExcelReportController;
  use App\Http\Controllers\Bhr\ContractController;
  
// use App\Http\Controllers\Category\CategoryController;
// use App\Http\Controllers\Slide\SlideController;

// use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Bhr\WebReportController;
// use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Login\LoginController;
//use App\Http\Controllers\DbExportController;
// use Illuminate\Http\Request;
use App\Models\Notifier;
// use App\Models\Package;
use Carbon\Carbon; //for testing only

//use App\Models\UM;

// Route::get('/getlogin', function(){
//     $email = 'admin@gmail.com';
//     $password = '123456';
//     $data = (object ) array('email'=>$email, 'password'=>$password);
//     return response()->json($data);
// });

Route::get('/reset-user-role',function (){
    $selectCols = 'role_id,module_id';
    $user_role = DB::table('um_role_modules')->selectRaw($selectCols)->get();
    foreach($user_role as $ur){
        $users = DB::table('um_user_roles')->where('role_id',$ur->role_id)->selectRaw('user_id')->get();
        foreach($users as $u){
            $exist =  DB::table('um_user_modules')->where('user_id',$u->user_id)->where('module_id',$ur->module_id)->take(1)->value('id');
            if(!$exist){
                DB::table('um_user_modules')->insert([
                    'user_id' => $u->user_id,
                    'role_id' => $ur->role_id,
                    'module_id' => $ur->module_id
                ]);
            }
        }
    }
});

Route::get('/get-enc-data/{q}', function ($q) {
    $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
    $m_str = $encrypter->encrypt($q,false); //FALSE => to avoid serialization issue in decryption
    return response()->json($m_str);
});

Route::get('create-contract', [ContractController::class, 'createContract']);
  
Route::get('test-event',function(){
    $d = (object)['branch_id'=>1,'sender_id'=>1,'message'=>"some message for testing event here","channel"=>Config::get('app.pusher_channel_prefix')];
    $res = Notifier::notify_admin('message_received',$d);
    return response()->json($d);
});

Route::get('tell-driver/{user_id}',function($user_id=null){
    $branch_id =1;
    $general="Private to $user_id";
    if($user_id==0){
        $user_id =null;
        $general ="General";
    }
    $cdata =[
        ['user_class'=>'driver','target_user_id'=>$user_id,'title'=>"Hello Driver $general ".getNowTime(),'message'=>'Testing notification from Vectorasoft','data'=>null,'persist'=>0]
    ];
    $res = Notifier::notify_mobile($branch_id,$cdata);
    return response()->json($res);
});

Route::get('tell-merchant/{user_id}',function($user_id=null){
    $branch_id =1;
    //user_id is official_id
    $general="Private to id $user_id";
    if($user_id==0){
        $user_id =null;
        $general ="General";
    }
    $cdata =[
        ['user_class'=>'merchant','target_user_id'=>$user_id,'title'=>"Hello Merchant $general at ".getNowTime(),'message'=>'Testing notification from Vectorasoft','data'=>null,'persist'=>0]
    ];
    $res = Notifier::notify_mobile($branch_id,$cdata);
    return response()->json($res);
});

Route::get('excel-report/{q}', [ExcelReportController::class, 'index']);

Route::get('privacy',function(){
    return view('privacy');
});

Route::get('privacy',function(){
   return view('privacy');
});

Route::get('houconnect/privacy',function(){
    return view('hou_connect_privacy');
});

Route::get('test-count',function(){
    $branch_id =1;
    $sender_id=74;
    $last_10_days = convertDate(Carbon::now()->addDay(-3));
    $sql ="SELECT COUNT(p.id) AS cnt,p.status_id, ps.name AS `status` from `package` AS `p`
    INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
    WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND (p.status_id=5 OR p.status_id=6) AND DATE(p.arrival_time) >= '$last_10_days'
    GROUP BY p.status_id,ps.`name`";
    $rows = DB::select(\DB::raw($sql));
    return response()->json($rows);
});

// Route::get('reset-merchant-code',function(){
//    $res = \App\Models\Dms\Sender::resetCodes(1,'HM');
//    echo response()->json($res);
// });

// Route::get('reset-driver-code',function(){
//     $res = \App\Models\Dms\Driver::resetCodes(1,'HD');
//     echo response()->json($res);
// });

Route::get('/', function () {
    return view('login.hr_login');
});

Route::get('logout',function(){
    return view('login.hr_login');
});

Route::get('package_barcode/{id}', [WebReportController::class, 'package_barcode']);
Route::get('dms-gen-report/{q}', [WebReportController::class, 'general_report']);
// Route::get('sales-module-report/{q}', [SalesModuleReportController::class, 'showReport']);
Route::get('hs-merchant-invoice/{q}', [WebReportController::class, 'hs_merchant_invoice']);
Route::get('hs-merchant-invoice-v2/{q}', [WebReportController::class, 'hs_merchant_invoice_v2']);
Route::get('merchant-invoice/{q}', [WebReportController::class, 'merchant_invoice']);

Route::post('processLogin', [LoginController::class, 'processLogin']);
// Route::post('process_mac_login', [LoginController::class, 'process_mac_login']);

//route 'dms' or Delivery Management System(DMS) routing to default Home View on firt log in
Route::get('login', [LoginController::class , 'login']);

// //Todo: set authentication and authorization
// Route::get('/export-db031181', [DbExportController::class, 'exportDatabase']);
// Route::get('/export-dbbydate031181/{date?}', [DbExportController::class, 'exportDataByDate']);

Route::get('landingpoint',function(){
    if(!AuthService::user()){
       $base_url =url('/');
       echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
       return;
    };
    return view('landing_page');
});

Route::get('bhr/{componentName?}',function($componentName= null){
    if(!AuthService::user()){
       // return redirect('/')
       $base_url =url('/');
       echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
       return;
    };
    $data = ['defaultComponent' => $componentName];
    return view('bhr',$data);
});

Route::get('umt/{componentName?}',function($componentName= null){
    if(!AuthService::user()){
       // return redirect('/')
       $base_url =url('/');
       echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
       return;
    };
    $componentName = $componentName ?? 'RoleManagementComponent';
    $data = ['defaultComponent' => $componentName];
    return view('umt',$data);
});

// Route::get('acc/{componentName?}',function($componentName= null){
//     if(!AuthService::user()){
//        // return redirect('/')
//        $base_url =url('/');
//        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
//        return;
//     };
//     $data = ['defaultComponent' => $componentName];
//     return view('acc',$data);
// });

// Route::get('/mac-login',function(){
//     return view('login.mac_login',[]);
// });

// Route::get('mac/{componentName?}',function($componentName= null){
//     $user = AuthService::user();
//     $data = ['defaultComponent' => $componentName];
//     if(!$user){
//        // return redirect('/')
//        $base_url =url('/mac-login');
//        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
//        return;
//     } else if($user->user_class !=='merchant' || !$user->official_id){
//         $result = AuthService::getLinkedUser($user->id, ($user->subs_id ?? null));
//         if ($result->error){
//             echo '<p>'.$result->error."</p><a href='/mac' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
//             return;
//         }
//         $linked_user = $result->user;
//         if($linked_user && $linked_user->user_class ==='merchant'){
//             AuthService::login($linked_user);
//             return view('mac',$data);
//         }
//         return view('login.mac_login',[]);
//     }
//     return view('mac',$data);
// });

// Route::get('gmt/{componentName?}',function($componentName= null){
//     if(!AuthService::user()){
//        // return redirect('/')
//        $base_url =url('/');
//        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
//        return;
//     };
//     $data = ['defaultComponent' => $componentName];
//     return view('gmt',$data);
// });

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

//Clear Cache facade value:
Route::get('/clear-cache', function() {
    $exitCode = Artisan::call('cache:clear');
    return '<h1>Cache facade value cleared</h1>';
});

//Reoptimized class loader:
Route::get('/optimize', function() {
    $exitCode = Artisan::call('optimize');
    return '<h1>Reoptimized class loader</h1>';
});

//Route cache:
Route::get('/route-cache', function() {
    $exitCode = Artisan::call('route:cache');
    return '<h1>Routes cached</h1>';
});

//Clear Route cache:
Route::get('/route-clear', function() {
    $exitCode = Artisan::call('route:clear');
    return '<h1>Route cache cleared</h1>';
});

//Clear View cache:
Route::get('/view-clear', function() {
    $exitCode = Artisan::call('view:clear');
    return '<h1>View cache cleared</h1>';
});

//Clear Config cache:
Route::get('/config-cache', function() {
    $exitCode = Artisan::call('config:cache');
    return '<h1>Clear Config cleared</h1>';
});
