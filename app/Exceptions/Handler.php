<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database;
use League\Flysystem\Exception;
use Throwable;

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
            } 
            else if ($exception instanceof  \PDOException){
                //405: Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException
                $data['error'] ="Something went wrong with Database Connection!"; 
                return response()->view('errors.error',$data);
            }
            else {
                 //other type of exception
                 return parent::render($request, $exception);
            }  
    }
 
    // public function render($request, Exception $exception)
    // {
        
    //     // Render well-known exceptions here
    
    //     // Otherwise display internal error message
    //     if(app()->environment() === 'production') {
    //         return view('errors.500');
    //     } else {
    //         return view('errors.500');
    //         //return parent::render($request, $exception);
    //     }
    // }
}
 