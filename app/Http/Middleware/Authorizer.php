<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\UM;
use JDV;

class Authorizer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param String $prn_code
     * @param String $module_code
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next,$prn_code =-1,$module_code=null)
    {
        $ss = UM::getUserInfoByToken($request,$prn_code);
        if($ss->status_code !==200){
            $ss->data="";
            return response()->json($ss);
        }
        else{
            //$request->ss = $ss;
            return $next($request);
        }
    }
}
