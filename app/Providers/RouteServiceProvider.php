<?php

namespace App\Providers;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/driver_app_api.php'));

            Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/merchant_app_api.php'));

            Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/sales_app_api.php'));

            Route::prefix('dms')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/dms_api.php'));
            Route::prefix('abm')
            ->middleware('api')
            ->namespace($this->namespace)
            ->group(base_path('routes/abm_api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
                
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/location_api.php'));    
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/um_api.php'));
            
            Route::prefix('utils')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/util_api.php'));
             Route::prefix('test')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/test_api.php'));

           });
 
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(100)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
