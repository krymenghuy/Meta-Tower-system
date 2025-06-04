<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
//use Illuminate\Cache\RateLimiter;
//custom: added line for forcing https url
use Illuminate\Support\Facades\URL;
use Config;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (Config::get('app.enforce_ssl') == true) {
            URL::forceScheme('https');
        }
        // // Custom rate limiter based on user ID
        // $this->app->booted(function (){
        //     // $request = app('request'); // Capture the request from the container
        //     // $user = $request->user();
        //     // if(!$user) return null;
        //     // $this->app->make(RateLimiter::class)->for('user', function ($request) {
        //     //   return $request->user()->id;
        //     // });
        // });
    }
}
