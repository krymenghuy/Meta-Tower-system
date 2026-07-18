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
    $base_url = url('/');
    $appName = 'Meta HR';
    if ($user && isset($user->apps)) {
        foreach ($user->apps as $app) {
            if ($app->home_route == 'tenant_member') {
                $appName = $app->app_name;
                break;
            }
        }
    }
    if (!$user) {

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>🔐</div>
                <h2 style='margin:0;color:#dc3545;'>Session Expired</h2>
                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    Your session has expired or we could not verify your identity.
                    <br>
                    Please sign in again to continue.
                </p>
                <a href='$base_url'
                   style='display:inline-block;padding:12px 28px;background:#1A1647;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Login Again
                </a>

            </div>
        </div>";

        return;
    }


    if (!in_array($user->user_class, ['tenant', 'tenant_member'])) {

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px+30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>⛔</div>
                <h2 style='margin:0;color:#dc3545;'>Access Denied</h2>
                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    Your account login does not have permission to access
                    <strong>{$appName}</strong>.
                    <br>
                    Please sign in with an authorized tenant account
                    or contact your system administrator.
                </p>
                <a href='$base_url'
                   style='display:inline-block;padding:12px 28px;background:#1A1647;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Back to Login
                </a>

            </div>
        </div>";

        return;
    }
    $data = ['defaultComponent' => 'HomeComponent'];
    return view('mhr', $data);
});
Route::get('prm/{componentName?}', function ($componentName = null) {

    $user = XAuthService::user();
    if (!$user) {
        $base_url = url('/');

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>🔐</div>

                <h2 style='margin:0;color:#dc3545;'>Session Expired</h2>

                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    We couldn't verify your identity because your session has expired or is invalid.
                    Please sign in again to continue.
                </p>

                <a href='$base_url'
                   style='display:inline-block;padding:12px 28px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Login Again
                </a>
            </div>
        </div>";
        return;
    }

    if ($user->user_class != 'admin') {
        $base_url = url('/');
        $appName = 'this application';

        foreach ($user->apps as $app) {
            if ($app->home_route == 'prm') {
                $appName = $app->app_name;
                break;
            }
        }

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>⛔</div>
                <h2 style='margin:0;color:#dc3545;'>Access Denied</h2>
                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    Your account login does not have permission to access
                    <strong>{$appName}</strong>.

                    <br>
                    If you believe this is an error, please contact your system administrator
                    or sign in with an account that has the required permissions.
                </p>

                <a href='".url('/')."'
                style='display:inline-block;padding:12px 28px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Back to Login
                </a>
            </div>
        </div>";
        return;
    }

    return view('prm', [
        'defaultComponent' => 'HomeComponent'
    ]);
});
Route::get('tenant/{componentName?}', function ($componentName = null) {

    $user = XAuthService::user();
    $base_url = url('/');
    $appName = 'Tenant Portal';
    if ($user && isset($user->apps)) {
        foreach ($user->apps as $app) {
            if ($app->home_route == 'tenant') {
                $appName = $app->app_name;
                break;
            }
        }
    }
    if (!$user) {

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>🔐</div>
                <h2 style='margin:0;color:#dc3545;'>Session Expired</h2>
                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    Your session has expired or we could not verify your identity.
                    <br>
                    Please sign in again to continue.
                </p>
                <a href='$base_url'
                   style='display:inline-block;padding:12px 28px;background:#1A1647;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Login Again
                </a>

            </div>
        </div>";

        return;
    }


    if (!in_array($user->user_class, ['tenant', 'tenant_member'])) {

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px+30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>⛔</div>
                <h2 style='margin:0;color:#dc3545;'>Access Denied</h2>
                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    Your account login does not have permission to access
                    <strong>{$appName}</strong>.
                    <br>
                    Please sign in with an authorized tenant account
                    or contact your system administrator.
                </p>
                <a href='$base_url'
                   style='display:inline-block;padding:12px 28px;background:#1A1647;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Back to Login
                </a>

            </div>
        </div>";

        return;
    }


    return view('tenant', [
        'defaultComponent' => 'HomeComponent'
    ]);

});

Route::get('umt/{componentName?}', function ($componentName = null) {
     $user = XAuthService::user();
    if (!$user) {
        $base_url = url('/');

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>🔐</div>

                <h2 style='margin:0;color:#dc3545;'>Session Expired</h2>

                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    We couldn't verify your identity because your session has expired or is invalid.
                    Please sign in again to continue.
                </p>

                <a href='$base_url'
                   style='display:inline-block;padding:12px 28px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Login Again
                </a>
            </div>
        </div>";
        return;
    }
    if ($user->user_class != 'admin') {
        $base_url = url('/');
        $appName = 'this application';

        foreach ($user->apps as $app) {
            if ($app->home_route == 'umt') {
                $appName = $app->app_name;
                break;
            }
        }

        echo "
        <div style='display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f7fa;font-family:Arial,sans-serif;'>
            <div style='max-width:420px;background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.12);text-align:center;'>
                <div style='font-size:60px;margin-bottom:15px;'>⛔</div>
                <h2 style='margin:0;color:#dc3545;'>Access Denied</h2>
                <p style='margin:20px 0;color:#6c757d;line-height:1.6;'>
                    Your account login does not have permission to access
                    <strong>{$appName}</strong>.

                    <br>
                    If you believe this is an error, please contact your system administrator
                    or sign in with an account that has the required permissions.
                </p>

                <a href='".url('/')."'
                style='display:inline-block;padding:12px 28px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;'>
                    Back to Login
                </a>
            </div>
        </div>";
        return;
    }
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
