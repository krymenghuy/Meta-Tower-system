<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Support\Facades\Log;
//use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
//use Symfony\Component\HttpKernel\Exception\FileNotFoundException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
    
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof CustomException) {
            return response()->view('errors.custom', [], 500);
        } elseif ($exception instanceof \PDOException) {
            // Log the error for further investigation without exposing sensitive information
            Log::error("Database Connection Error: " . $exception->getMessage());
            Log::error("Stack Trace: " . $exception->getTraceAsString());

            // Return a generic error message without revealing details
            $data['error'] = 'This is not supposed to happen. We are checking and resolving the issue.'.'(1001)';
            return response()->view('errors.error', $data);
        } elseif ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
            // Let Laravel handle the 404 response for file not found
            return parent::render($request, $exception);
        } else {
            // For unhandled cases (error 500) that are caught ofguard => Log other types of exceptions for further investigation without exposing sensitive information
            Log::error("Unhandled Exception: " . $exception->getMessage());
            Log::error("Request Url: " . $request->fullUrl());
            Log::error("Stack Trace: " . $exception->getTraceAsString());

            // Return a generic error message without revealing details
            $data['error'] = 'This is not supposed to happen. We are checking and resolving the issue.'.'(1002)';
            return response()->view('errors.error', $data);
        }
    }
    
}
