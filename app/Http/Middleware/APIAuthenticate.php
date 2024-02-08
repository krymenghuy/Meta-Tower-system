<?php
namespace App\Http\Middleware;

use Closure;
use App\Models\JDV; // Assuming JDV is your custom response handler
use App\Models\UM;

class APIAuthenticate
{
    public function handle($request, Closure $next, ...$guards)
    {
        if (UM::useJWT() != 1) return $next($request);

        // Set 'user' to null at the beginning
        $request->user = null;

        $ss = UM::getUserInfoByToken($request);

        // Set $def_lang based on the 'lang' property of $ss
        $def_lang = $ss->lang ?? 'en';

        // Check the status_code from the response
        switch ($ss->status_code) {
            case 200:
                unset($ss->status_code,$ss->status);
                // Update user details in the request
                $request->user = $ss;

                return $next($request);
            case 400:
            case 401:
                return JDV::raw($ss);
            // case 402:
            //     // User does not have permission, 'user' remains null
            //     $prn_error_message ='Some permission is required to continue';
            //     return JDV::error($prn_error_message, $def_lang, 402);

            case 403:
                // Forbidden, 'user' remains null
                return JDV::error('You may need to login to renew your access', $def_lang, 403);

            case 405:
                return JDV::raw($ss);
            default:
                // Handle other status codes if needed, 'user' remains null: Error 500 or something unhandled
                return JDV::error('We tried to get you in, but there was a little hiccup. Our tech team is reviewing this case asap', $def_lang, 500);
        }
    }
}
