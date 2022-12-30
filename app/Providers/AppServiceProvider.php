<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
//custom: added line for forcing https url
//use Illuminate\Support\Facades\URL;

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
        // //Added as custom line. The default is no code here
        // if (env('ENFORCE_SSL', false)) {
        //     $url->forceScheme('https');
        //    //  \URL::forceScheme('https');
        // }
    }
}
