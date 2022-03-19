<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Branch\BranchController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Slide\SlideController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WebReportController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Login\LoginController;
use Illuminate\Http\Request;
use App\Models\Notifier;
//use App\Models\UM;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/getlogin', function(){
//     $email = 'admin@gmail.com';
//     $password = '123456';
//     $data = (object ) array('email'=>$email, 'password'=>$password);
//     return response()->json($data);
// });

Route::get('/get-enc-data/{q}', function ($q) {
    $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
    $m_str = $encrypter->encrypt($q,false); //FALSE => to avoid serialization issue in decryption
    return response()->json($m_str);
});
 
Route::get('test-event',function(){
      $d = (object)['branch_id'=>1,'sender_id'=>1,'message'=>"some message for testing event here"];
      $res = Notifier::notify_admin('message_received',$d);
      return response()->json($res);
});

Route::get('tell-driver/{user_id}',function($user_id){
    $branch_id =1;
    $user_class="driver";
    $data =['order_id'=>228,'merchant_name'=>'Shop Name'];
    $eventInfo = (object)['branch_id'=>1,'event_name'=>'announcement','target_user_id'=>$user_id,'message'=>'This is general announcement to all drivers','title'=>"Announcement",'image_url'=>null];
    $res = Notifier::notify_driver($eventInfo,$data);
    return response()->json($res);
});

/** test if broadcast(new event1)->toOthers() works correcly**/
// Route::get('change-driver',function(){
//     $message = "Order numbered 262 changed status to \"New Status\"";
//     $event_data = (object)['branch_id'=>1,'order_id'=>262,'order_code'=>262,'sender_id'=>1,'status'=>'New Status','status_id'=>3,'completed'=>0,'driver_id'=>27,'driver_name'=>'Puthea','message'=>$message];
//     Notifier::notify_admin('order_status_changed',$event_data); 
// });

Route::get('tell-merchant/{user_id}',function($user_id){
    $branch_id =1;
    $user_class="merchant";
    $event = (object)["name"=>"driver_accepts_order","title"=>"Order Accepted","message"=>"A driver has accepted your order","image_url"=>"https://dms.vectorasoft.com/images/test.png"];
    $payload = (object)["driver_id"=>256,"name"=>"Mr Road Hit","pickup_address"=>"pick up at st.309, BKK1, Phnom Penh"];
    $res = Notifier::notify_app_users($branch_id,$user_class,$user_id,$event,$payload);
    return response()->json($res);
});

Route::get('/', function () {
    return view('login.index');
});

Route::get('logout',function(){
    return view('login.index');
});
  
Route::get('package_barcode/{id}', [WebReportController::class, 'package_barcode']);
Route::get('dms_gen_report/{q}', [WebReportController::class, 'general_report']);

// Route::get('clearcache', function () {
//    $exitCode = Artisan::call('cache:clear');
//    $exitCode = Artisan::call('config:cache');
//    return null;
// });
 
 Route::post('processLogin', [LoginController::class, 'processLogin']); 
//route 'dms' or Delivery Management System(DMS) routing to default Home View on firt log in
Route::get('login', [LoginController::class , 'login']);
Route::get('dms', [LoginController::class , 'default_view']);
 
// Route::post('/pem-login/{q}', function(Request $request, $email, $password){
//     $email = $request->email;
//     $password = $request->password;
//     return redirect('http://127.0.0.1:8000/pem/pem-login'.$email.'/'.$password);
// });
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
 

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