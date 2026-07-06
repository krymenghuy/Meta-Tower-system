<?php

use Illuminate\Support\Facades\Route;
//use app\Http\Middleware\CustomRateLimiter;
use App\Http\Controllers\Bhr\ExcelReportController;
use App\Http\Controllers\Prm\ContractController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Register\RegisterController; 

//use App\Http\Controllers\DbExportController;
// use Illuminate\Http\Request;
use App\Models\Notifier;
// use App\Models\Package;
use Illuminate\Support\Carbon; //for testing only
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

use function Ramsey\Uuid\v1;

//use App\Models\UM;
 
// Route::get('/reset-user-role', function () {
//     $selectCols = 'role_id,module_id';
//     $user_role = DB::table('um_role_modules')->selectRaw($selectCols)->get();
//     foreach ($user_role as $ur) {
//         $users = DB::table('um_user_roles')->where('role_id', $ur->role_id)->selectRaw('user_id')->get();
//         foreach ($users as $u) {
//             $exist =  DB::table('um_user_modules')->where('user_id', $u->user_id)->where('module_id', $ur->module_id)->take(1)->value('id');
//             if (!$exist) {
//                 DB::table('um_user_modules')->insert([
//                     'user_id' => $u->user_id,
//                     'role_id' => $ur->role_id,
//                     'module_id' => $ur->module_id
//                 ]);
//             }
//         }
//     }
// });

Route::get('/get-enc-data/{q}', function ($q) {
    $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
    $m_str = $encrypter->encrypt($q, false); //FALSE => to avoid serialization issue in decryption
    return response()->json($m_str);
});

Route::get('create-contract/{q}', [ContractController::class, 'createContract']);
 
Route::get('excel-report/{q}', [ExcelReportController::class, 'index']);

Route::get('privacy', function () {
    return view('privacy');
});

Route::get('privacy', function () {
    return view('privacy');
});

Route::get('houconnect/privacy', function () {
    return view('hou_connect_privacy');
});

Route::get('test-count', function () {
    $branch_id = 1;
    $sender_id = 74;
    $last_10_days = convertDate(Carbon::now()->addDay(-3));
    $sql = "SELECT COUNT(p.id) AS cnt,p.status_id, ps.name AS `status` from `package` AS `p`
    INNER JOIN  package_statuses AS ps ON ps.id = p.status_id
    WHERE p.branch_id =$branch_id AND p.sender_id ='$sender_id' AND (p.status_id=5 OR p.status_id=6) AND DATE(p.arrival_time) >= '$last_10_days'
    GROUP BY p.status_id,ps.`name`";
    $rows = DB::select(DB::raw($sql));
    return response()->json($rows);
});
 

// Also ensure you have a login route for the "Already have an account?" link
Route::get('/login', function () {
    return view('auth.login'); // Assuming you have a login view
})->name('login');

Route::get('/', fn () => view('login.prm_login'));
Route::get('/login', fn () => view('login.prm_login'));
//Login Web Admin
Route::post('/processLogin', [AuthController::class, 'processLogin']);
//Logout for web
Route::get('/logout', [AuthController::class, 'logout']);

//Route::post('processRegister', [RegisterController::class, 'processRegister']);
Route::get('attendance', function () {
    $data = [];
    return view('attendance', $data);
});

// //Todo: set authentication and authorization
// Route::get('/export-db031181', [DbExportController::class, 'exportDatabase']);
// Route::get('/export-dbbydate031181/{date?}', [DbExportController::class, 'exportDataByDate']);
  
Route::get('landingpoint', function () {
    if (!XAuthService::user()) {
        $base_url = url('/');
        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    };
    return view('landing_page');
});
//  Route::get('prm/{componentName?}', function ($componentName = null) {
//     if (!XAuthService::user()) {
//         // return redirect('/')
//         $base_url = url('/');
//         echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
//         return;
//     };
//     $data = ['defaultComponent' => 'HomeComponent'];
//     return view('prm', $data);
// });
Route::get('mhr/{componentName?}', function ($componentName = null) {
     $user = XAuthService::user();
    if (!$user) {
        // return redirect('/')
        $base_url = url('/');
        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    };
    if($user->user_class != 'admin'){
        $base_url = url('/');
        echo "You are not admin staff !<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    }
    $data = ['defaultComponent' => 'HomeComponent'];
    return view('mhr', $data);
});
Route::get('prm/{componentName?}', function ($componentName = null) {
     $user = XAuthService::user();
    if (!$user) {
        // return redirect('/')
        $base_url = url('/');
        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    };
    if($user->user_class != 'admin'){
        $base_url = url('/');
        echo "You are not admin staff !<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    }
    $data = ['defaultComponent' => 'HomeComponent'];
    return view('prm', $data);
});
Route::get('tenant/{componentName?}', function ($componentName = null) {
    $user = XAuthService::user();

    if (!$user) {
        $base_url = url('/');
        echo "There was a problem processing your user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    }
    if (!in_array($user->user_class, ['tenant', 'tenant_member'])) {
        $base_url = url('/');
        echo "You are not authorized to access this page!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    }
    return view('tenant', [
        'defaultComponent' => 'HomeComponent'
    ]);
});

Route::get('umt/{componentName?}', function ($componentName = null) {
    if (!XAuthService::user()) {
        // return redirect('/')
        $base_url = url('/');
        echo "There was a problem processing you user identity!<div style='margin-left:10px'><a href='$base_url' style=\"color:green;font-size:1.2em;font-weight:bold\">Login Again</a></div>";
        return;
    };
    $data = ['defaultComponent' => 'RoleManagementComponent'];
    return view('umt', $data);
});

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

//Clear Cache facade value:
Route::get('/clear-cache', function () {
    $exitCode = Artisan::call('cache:clear');
    return '<h1>Cache facade value cleared</h1>';
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
