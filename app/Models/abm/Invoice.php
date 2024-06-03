<?php

namespace App\Models\Abm;
use DB;
use Sanitizer;
use App\Models\DV;
use App\Models\JDV;
use Illuminate\Pagination\LengthAwarePaginator; 
use App\Models\Dms\PublicStorage;
use Carbon\Carbon;
use App\Models\Sender;
use Config;
use Illuminate\Support\Facades\Cache;



class Invoice //extends Model
{


    protected $id = null;
    protected $userInfo = null;
    function __construct($id=null,$userInfo=null){
        $this->id=$id;
        $this->userInfo=$userInfo;
    }
   
}
