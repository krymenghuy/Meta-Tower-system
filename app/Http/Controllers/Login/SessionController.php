<?php

namespace App\Http\Controllers\Login;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
//use App\Session;
use App\Models\UM;
use DB;

class SessionController extends Controller
{
    protected $UMModel;
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->UMModel = new UM();   
    }

}
