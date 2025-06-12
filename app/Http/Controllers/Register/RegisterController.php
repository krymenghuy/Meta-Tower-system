<?php
namespace App\Http\Controllers\Register;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function showRegisterForm()
    {
        return view('register'); 
    }



public function processRegister(Request $request)
{
    return redirect('/ypg/HomeComponent');
}

}
