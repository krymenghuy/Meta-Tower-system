<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Absence;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    protected $absenceModel;
    public function __construct(Absence $absence){
        $this->absenceModel = $absence; 
    }
    
}
