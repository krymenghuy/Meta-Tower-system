<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\TenantProfile;
use JDV;
use XAuthService;
use Illuminate\Http\Request;

class TenantProfileController extends Controller
{
    protected $tenants;
    public function __construct()
    {
        $this->tenants = new TenantProfile();
    }

 

 

   
}
