<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
class CustomRateLimiter
{
    public function handle($request, Closure $next, $maxAttempts = 3, $decayMinutes = 1, $delayMilliseconds = 350, $maxTry = 12)
    {
        $key = $this->resolveRequestSignature($request);
        $limiter = app(RateLimiter::class);

        // Retry up to $maxTry times
        for ($try = 1; $try <= $maxTry; $try++) {
            // Check if rate limit is exceeded
            if (!$limiter->tooManyAttempts($key, $maxAttempts, $decayMinutes)) {
                // Increment the rate limiter count
                $limiter->hit($key, $decayMinutes);

                $user = $request->user;
                $user_info = $user ? 'user_class: ' . $user->user_class . '  login_name: ' . $user->login_name . '    user_id: ' . $user->user_id . '    IP: ' . $request->ip() : null;
                if ($try > 1) {
                    $elapse_time = $delayMilliseconds * $try;
                    Log::info('Wait for ' . $elapse_time . ' ms and tried ' . $try . ' times   url: ' . $request->fullUrl() . "  \n" . $user_info);
                }

                return $next($request);
            }

            // Incremental delay before retrying
            usleep($delayMilliseconds * $try * 1000); // Convert milliseconds to microseconds
        }

        // If all retries fail, return a response indicating too many attempts
        return $this->buildRateLimitResponse($maxAttempts, $decayMinutes);
    }
 
    protected function resolveRequestSignature($request)
    {
        // Customize this method if you need a unique key for each endpoint
        $user_id = null;
        if(isset($request->user)) $user_id = $request->user->id;  
        $user_id = $user_id ?? $request->ip();
        return sha1($request->method() . '|' . $request->path() . '|' . $user_id);
    }

    protected function buildRateLimitResponse($maxAttempts, $decayMinutes)
    {
        $response = new Response('Too Many Attempts -customer rate limiter.', 429);

        // Optionally add headers or customize the response further
        // $response->header('Retry-After', app(RateLimiter::class)->availableIn($key, $maxAttempts, $decayMinutes));

        return $response;
    }
}
 