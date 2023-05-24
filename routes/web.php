<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebReportController;
use App\Http\Controllers\Login\LoginController;
 
use App\Models\Notifier;
use App\Http\Controllers\MailController;
//use App\Http\Controllers\PdfController;
//use App\Models\PrivateStorage;
//use Illuminate\Contracts\Session\Session;

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

Route::get('view-pdf', function () {
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
    $m_str = $encrypter->encrypt($q, false); //FALSE => to avoid serialization issue in decryption
    return response()->json($m_str);
});

Route::get('test-event', function () {
    $d = (object)['branch_id' => 1, 'sender_id' => 1, 'message' => "some message for testing event here"];
    $res = Notifier::notify_admin('message_received', $d);
    return response()->json($res);
});

Route::get('tell-driver/{user_id}', function ($user_id) {
    $branch_id = 1;
    $user_class = "driver";
    $data = ['order_id' => 228, 'merchant_name' => 'Shop Name'];
    $eventInfo = (object)['branch_id' => 1, 'event_name' => 'announcement', 'target_user_id' => $user_id, 'message' => 'This is general announcement to all drivers', 'title' => "Announcement", 'image_url' => null];
    $res = Notifier::notify_driver($eventInfo, $data);
    return response()->json($res);
});

Route::get('tell-merchant/{user_id}', function ($user_id) {
    $branch_id = 1;
    $user_class = "merchant";
    $event = (object)["name" => "driver_accepts_order", "title" => "Order Accepted", "message" => "A driver has accepted your order", "image_url" => "https://dms.vectorasoft.com/images/test.png"];
    $payload = (object)["driver_id" => 256, "name" => "Mr Road Hit", "pickup_address" => "pick up at st.309, BKK1, Phnom Penh"];
    $res = Notifier::notify_app_users($branch_id, $user_class, $user_id, $event, $payload);
    return response()->json($res);
});

Route::get('/student', function () {
    return view('borrower.login');
});

Route::get('/', function () {
    return view('login.index');
});

Route::get('logout', function () {
    return view('login.index');
});

Route::get('logout-borrower', function () {
    return view('borrower.login');
});
 
// Route::get('test', function () {
//     $paths = [
//         'public_path' => public_path(), // Path of public/
//         'base_path' => base_path(), // Path of application root
//         'storage_path' => storage_path(), // Path of storage/
//         'app_path' => app_path(), // Path of app/
//         'cwd' => getCwd()
//     ];
//     $file_path = base_path() . '/storage/locales/en.json';
//     $data = readFileContent($file_path);
//     echo $data;
// });

//Route::get('package_barcode/{id}', [WebReportController::class, 'package_barcode']);
Route::get('genreport/{q}', [WebReportController::class, 'general_report']);
Route::get('geninvoice/{q}', [WebReportController::class, 'general_invoice']);
Route::get('person-profile/{q}', [WebReportController::class, 'person_profile']);
Route::get('receipt/{q}', [WebReportController::class, 'receipt']);
Route::get('receipt_service/{q}', [WebReportController::class, 'receipt_service']);
Route::get('mail-receipt/{q}', [MailController::class, 'receipt']);
Route::get('mclinic-report/{q}', [WebReportController::class, 'general_report_center']);
Route::get('prescription-report/{q}', [WebReportController::class, 'prescription']);

Route::post('processLogin', [LoginController::class, 'processLogin']);
//route 'dms' or Delivery Management System(DMS) routing to default Home View on firt log in
Route::get('login', [LoginController::class, 'login']);

Route::get('ksm', function () {
    if (!Session('login_name')) {
        // return redirect('/')
        $base_url = url('/');
        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    };
    return view('master');
});

Route::get('email/send', [MailController::class, 'html_email']);
 
//Clear Cache facade value:
Route::get('/clear-cache', function () {
    $exitCode = Artisan::call('cache:clear');
    return '<h1>Cache facade value cleared</h1>';
});
//Clear Cache facade value:
Route::get('/config-cache', function () {
    $exitCode = Artisan::call('cache:config');
    return '<h1>Cache configed</h1>';
});

//Reoptimized class loader:
Route::get('/optimize', function () {
    $exitCode = Artisan::call('optimize');
    return '<h1>Reoptimized class loader</h1>';
});

//Route cache:
Route::get('/route-cache', function () {
    $exitCode = Artisan::call('route:cache');
    return '<h1>Routes cached</h1>';
});

//Clear Route cache:
Route::get('/route-clear', function () {
    $exitCode = Artisan::call('route:clear');
    return '<h1>Route cache cleared</h1>';
});

//Clear View cache:
Route::get('/view-clear', function () {
    $exitCode = Artisan::call('view:clear');
    return '<h1>View cache cleared</h1>';
});

//Clear Config cache:
Route::get('/config-cache', function () {
    $exitCode = Artisan::call('config:cache');
    return '<h1>Clear Config cleared</h1>';
});
