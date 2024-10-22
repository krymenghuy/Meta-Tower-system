<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\TaxAllowance;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;


class TaxAllowanceController extends Controller
{
    protected $tax_allowance;

    public function __construct(TaxAllowance $tax_allowance)
    {
        $this->tax_allowance = $tax_allowance;
    }


}
