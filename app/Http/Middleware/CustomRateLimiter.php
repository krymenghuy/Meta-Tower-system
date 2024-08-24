<?php
namespace App\Http\Middleware;

use Closure;
class CustomRateLimiter
{
    public function handle($request, Closure $next)
    {
        return $next($request);
    } 
}
 