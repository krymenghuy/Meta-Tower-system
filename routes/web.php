<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Branch\BranchController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Slide\SlideController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoanAppController;
use App\Http\Controllers\WebReportController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Login\LoginController;
use Illuminate\Http\Request;

use App\Models\Notifier;
use App\Http\Controllers\MailController;
use App\Http\Controllers\PdfController;
use App\Models\PrivateStorage;

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

// Route::get('view-pdf', [PdfController::class, 'previewPdf']);

Route::get('view-pdf', function(){
    $datas = \DB::SELECT('SELECT * FROM package');
        $fileName = 'UserList.pdf';
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'UTF-8',
            'format' => 'A4-L',
            'autoScriptToLang' => true,
            'autoLangToFont' => true,
            'margin-left' => 10,
            'margin-right' => 10,
            'margin-top' => 15,
            'margin-bottom' => 20,
            'margin_header' => 10,
            'margin_footer' => 10
        ]);

        $html = \View::make('preview_pdf')->with('datas', $datas);
        $html = $html->render();

        $mpdf->SetHeader('Chapter 1 | Package list |ទំព័រទី{PAGENO}');
        $mpdf->SetFooter('This is footer');


        $mpdf->WriteHTML($html);
        $mpdf->Output($fileName, 'I');
});

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

Route::get('/student', function () {
    return view('borrower.login');
});

Route::get('/', function () {
    return view('login.index');
});

Route::get('logout',function(){
    return view('login.index');
});

Route::get('logout-borrower',function(){
    return view('borrower.login');
});

Route::get('private-storage',function(){
    echo PrivateStorage::path(1,'loan','document');
});

Route::get('test',function(){
   $paths = [
    'public_path'=>public_path(),// Path of public/
    'base_path'=>base_path(),// Path of application root
    'storage_path'=>storage_path(),// Path of storage/
    'app_path'=>app_path(),// Path of app/
    'cwd'=>getCwd()
   ];
   $file_path = base_path().'/storage/locales/en.json';
   $data = readFileContent($file_path);
    echo $data;
//    foreach($paths as $key=>$value){
//     echo $key.' = '.env('ASSET_URL').' =  |   ';
//    } 

});

Route::get('package_barcode/{id}', [WebReportController::class, 'package_barcode']);
Route::get('genreport/{q}', [WebReportController::class, 'general_report']);
Route::get('pawncontract/{q}', [WebReportController::class, 'pawn_contract']);
Route::get('loancontract/{q}', [WebReportController::class, 'loan_contract']);

// Route::get('view-receipt/{q}',[MailController::class, 'view_receipt']);
Route::get('receipt/{q}', [WebReportController::class, 'receipt']);
Route::get('mail-receipt/{q}', [MailController::class, 'receipt']);

// Route::get('clearcache', function () {
//    $exitCode = Artisan::call('cache:clear');
//    $exitCode = Artisan::call('config:cache');
//    return null;
// });
 
 Route::post('processLogin', [LoginController::class, 'processLogin']); 
//route 'dms' or Delivery Management System(DMS) routing to default Home View on firt log in
Route::get('login', [LoginController::class , 'login']);

Route::get('mclinic',function(){
    if(!Session::get('login_name')){
       // return redirect('/')
       $base_url =url('/');
       echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
       return;
    };
    return view('master');
});

Route::get('email/send', [MailController::class, 'html_email']);

Route::get('download-doc/{doc_type}/{loan_app_id}/{file_id}', [LoanAppController::class, 'downloadFile']);
Route::get('bor',function(Request $request){
    if(!Session::get('login_name')) return redirect('/student'); // view('login.index');
    return view('borrower.home');
});

Route::get('bor',function(Request $request){
        if(!Session::get('login_name')) return redirect('/student'); // view('login.index');
        return view('borrower.home');
});

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
//Clear Cache facade value:
Route::get('/config-cache', function() {
    $exitCode = Artisan::call('cache:config');
    return '<h1>Cache configed</h1>';
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



