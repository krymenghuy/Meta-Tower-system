<?php

namespace App\Exceptions;

use Throwable;
use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Illuminate\Http\Request;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        //
    }

public function render($request, Throwable $exception)
{
    // --------------------------------------------------
    // 404 — NOT FOUND
    // --------------------------------------------------
    if ($exception instanceof NotFoundHttpException) {

        // Skip pure noise
        if (!$this->isNoisy404($request)) {
            Log::warning('404 Not Found', [
                'url'     => $request->fullUrl(),
                'method'  => $request->method(),
                'ip'      => $request->ip(),
                'user_id' => optional($request->user())->id,
            ]);
        }

        return response()->view('errors.404', [
            'error' => 'The page you are looking for could not be found. (404)'
        ], 404);
    }

    // --------------------------------------------------
    // REAL ERRORS (log as ERROR)
    // --------------------------------------------------
    $this->logException($request, $exception);

    // --------------------------------------------------
    // RESPONSES
    // --------------------------------------------------

    if ($exception instanceof \PDOException) {
        return response()->view('errors.error', [
            'error' => 'This is not supposed to happen. We are checking and resolving the issue. (1001)'
        ], 500);
    }

    if ($exception instanceof CustomException) {
        return response()->view('errors.custom', [
            'error' => 'Something went wrong with your request. (1003)'
        ], 500);
    }

    if ($exception instanceof HttpExceptionInterface) {
        return response()->view('errors.error', [
            'error' => 'This is not supposed to happen. We are checking and resolving the issue. (1004)'
        ], $exception->getStatusCode());
    }

    return response()->view('errors.error', [
        'error' => 'This is not supposed to happen. We are checking and resolving the issue. (1002)'
    ], 500);
}


    /**
     * Decide whether an exception is just noise.
     */
    protected function isIgnorableException(Request $request, Throwable $e): bool
    {
        if ($e instanceof NotFoundHttpException) {

            $path = '/' . ltrim($request->path(), '/');

            // Chrome / browser probes
            if (str_starts_with($path, '/.well-known/')) {
                return true;
            }

            // Static assets
            if (preg_match('#\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|woff2?|ttf|eot|map)$#i', $path)) {
                return true;
            }

            // Local dev tools
            if (str_contains($path, 'chrome.devtools')) {
                return true;
            }

            // Normal user 404 → not an error
            return true;
        }

        return false;
    }

    /**
     * Log only real failures.
     */
    protected function logException(Request $request, Throwable $exception): void
    {
        Log::error('Unhandled Exception', [
            'url'       => $request->fullUrl(),
            'method'    => $request->method(),
            'ip'        => $request->ip(),
            'user_id'   => optional($request->user())->id,
            'exception' => get_class($exception),
            'message'   => $exception->getMessage(),
            'file'      => $exception->getFile(),
            'line'      => $exception->getLine(),
            'trace'     => $exception->getTraceAsString(),
        ]);
    }

    protected function isNoisy404(Request $request): bool
    {
        $path = '/' . ltrim($request->path(), '/');

        // Chrome / browser probes
        if (str_starts_with($path, '/.well-known/')) {
            return true;
        }

        if (str_contains($path, 'chrome.devtools')) {
            return true;
        }

        // Static assets
        return (bool) preg_match(
            '#\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|woff2?|ttf|eot|map)$#i',
            $path
        );
    }

}