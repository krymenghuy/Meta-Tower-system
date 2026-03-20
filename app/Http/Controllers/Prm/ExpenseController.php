<?php

namespace App\Http\Controllers\Prm;

use App\Http\Controllers\Controller;
use App\Models\Prm\Expense;
use Illuminate\Http\Request;
use JDV;
use XAuthService;

class ExpenseController extends Controller
{
    protected $expenses;
    public function __construct(){
        $this->expenses = new Expense();
    }
    
    public function saveExpense(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->expense_id;
        $expense = new Expense($id, $ss);
        $res = $expense->saveExpense($req->all());
        return JDV::raw($res);
    }
    public function getListPaginate(Request $req){
        $ss = XAuthService::verifyAuth($req,1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->expenses->getListPaginate($req->all(),$ss));
    }
    public function expenseDetails(Request $req){
        $ss = XAuthService::verifyAuth($req,1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->expenses->expenseDetails($req->id));
    }

    public function getFormOptions(Request $req){
        $ss = XAuthService::verifyAuth($req,-1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        return JDV::result($this->expenses->getFormOptions($req->id,$ss));
    }

    public function deleteExpense(Request $req){
        $ss = XAuthService::verifyAuth($req, -1);
        if($ss->status_code !==200){
            return JDV::raw($ss);
        }
        if(!isset($req->id) || !is_numeric($req->id)){
            return JDV::error('Invalid ID');
        }
        return JDV::raw($this->expenses->deleteExpense($req->id,$ss));
    }
}
