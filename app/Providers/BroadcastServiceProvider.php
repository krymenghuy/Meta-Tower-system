<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //Broadcast::routes();
        Broadcast::routes(['middleware' => ['api']]);
        // /** broadcast on Private channel **/
        // Broadcast::routes(['middleware' => ['auth:api']]);
        require base_path('routes/channels.php');
    }
}
