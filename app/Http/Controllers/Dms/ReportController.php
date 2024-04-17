<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\UM;
use App\Models\JDV;

class ReportController extends Controller
{
    protected $reportModel;
    public function __construct(){
        $this->reportModel = new Report(); 
    }
    
    function delivery_qrcode($id) { 
      $html =" HELLO"; //DNS2D::getBarcodeHTML('4445645656', 'QRCODE');
      $data['html_qrcode'] = $html;
      return view('reports.delivery_barcode',$data);
    }

    function getSummaryData(Request $request){
        $r = $this->reportModel->getSummaryData($request); 
          if($r =='#350') 
            return makeJsonResponse($r,350); // user not authenticated
          else if ($r =='@') return makeJsonResponse($r,360); // need permision to access or do this task
        return makeJsonResponse($r);
    }

    function getPackageList_export(Request $req){
      $ss = UM::getUserInfoByToken($req,-1);
      if($ss->status_code !==200) return JDV::raw($ss);
      $warehouse = \App\Models\GeneralSettings::getDefaultWarehouse($ss);
      $warehouse_id = $warehouse->id;
      $rows = $this->reportModel->getPackageList($warehouse_id,-1,$req->start_date,$req->end_date,null,$req->sender_id,null,null,null,null,$req->sender_pmt_status_id);
      return JDV::result($rows);
    }
}