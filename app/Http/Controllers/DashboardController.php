<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Session;
class DashboardController extends Controller
{
    //
    // public function index() {
    //     return view('dashboard');
    // }
    public function view_default() {
        if (!Session::has('login_name')) return view('login.index');
        if (!Session::get('login_name',null)) return view('login.index');
        return view('master');
    }
}
