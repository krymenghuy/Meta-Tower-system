<?php

namespace App\Models\Bhr;

use App\Models\DV;
use App\Models\DBX;
use App\Models\PublicStorage;
use Sanitizer;
use DB;
use App\Models\Bhr\GeneralSettings;
use Illuminate\Pagination\LengthAwarePaginator;
class PromoteEmployee //extends Model
{
    protected $id=null,$userInfo=null;
    protected static $img_dir = 'promotions';

    function __construct($id=null,$userInfo=null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function promoteEmployee($arr=[],$ss){
        

    }
    
}
