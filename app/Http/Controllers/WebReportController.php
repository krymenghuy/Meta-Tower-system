<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\UM;
use App\Models\JDV;
use App\Models\CompanyProfile;
use Session;
use Carbon\Carbon;
use DB;

class WebReportController extends Controller
{
  protected $reportModel;
  public function __construct()
  {
    $this->reportModel = new Report();
  }

  //api getReportList, not for Web Get
  function getReportList(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    $branch_id = $ss->branch_id;

    $rows = DB::select("SELECT id, `name`, `hidden`, code,category,rpt.module_id,rpt.params,rpt.display_order,rpt.hidden FROM reports AS rpt WHERE IFNULL(rpt.hidden,0) = 0 ORDER BY rpt.display_order ASC");
    return JDV::json($rows);
  }

  //api getReportFilterOptions()| not web get
  function getReportFilterOptions(Request $req)
  {
    $ss = UM::getUserInfoByToken($req, -1);
    if ($ss->status_code != 200) return $ss; //user not authenticated
    $branch_id = $ss->branch_id;
    $data = (object)[];
    $data->users = DB::select("SELECT id as `user_id`,  full_name As `user_name` FROM um_users AS u WHERE u.branch_id = '$branch_id' ORDER BY u.full_name asc");
    return JDV::json($data);
  }

  public function receipt($query_string)
  {
    $branch_id = Session::get('branch_id', 0);

    $p = processQueryString($query_string);
    $pmt_id = $p->id;
    $ss = (object)['branch_id' => $branch_id];
    $payment = new \App\Models\Invoice\Payment($pmt_id, $ss);
    $data['receipt'] = $payment->getDetails();
    // echo dd($data);
    return view('reports.receipt', $data);
  }

  //generalReport()| genral report
  public function general_report($query_string = null)
  {
    if (!Session::get('login_name', null)) return redirect('/');
    $branch_id = Session::get('branch_id', 0);
    if (!$branch_id) return redirect('/');
    $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
    $p = processQueryString($query_string);

    if (!$p) {
      return view('errors.500');
    }

    $rtype = isset($p->rtype) ? $p->rtype : null;
    $ticket_id = isset($p->id) ? $p->id : null;
    $patient_id = isset($p->patientid) ? $p->patientid : null;
    $ss = (object)['branch_id' => $branch_id];
    $consultation = new \App\Models\Consultation($ticket_id, $ss);
    $data['rtype'] = $rtype;

    switch ($rtype) {
      case 'medical_report': {
          $data['title'] = "Medical Report";
          $data['consult'] = $consultation->getDetails();
          break;
        }
      case 'general_report': {
          $data["title"] = "Client Report";
          $data["client"] = "";
          break;
        }
      case 'medical_certificate': {
          $data['title'] = "Medical Certificate";
          $data['consult'] = $consultation->getDetails();
          break;
        }
      case "patient_profile": {
          $data['title'] = "Patient Profile";
          $d = \App\Models\Patient::profileInfo($patient_id, true, true);
          $data['patient'] = $d;
          break;
        }
      default: {
          $data['title'] = "Title Report";
          return view('reports.genreport', $data);
          break;
        }
    }
    return view('reports.genreport', $data);
  }

  public function general_invoice($query_string = null)
  {
    if (!Session::get('login_name', null)) return redirect('/');
    $branch_id = Session::get('branch_id', 0);
    if (!$branch_id) return redirect('/');
    $data['branch'] = \App\Models\CompanyProfile::details($branch_id);
    $p = processQueryString($query_string);
    if (!$p) {
      return view('errors.500');
    }

    $invoice_id = isset($p->id) ? $p->id : 0;
    $ss = (object)['branch_id' => $branch_id];
    $invoice = new \App\Models\Invoice\MedicalInvoice($invoice_id, $ss);
    $data['invoice'] = $invoice->getDetails();
    $data['title'] = "ESTHEDERM Aesthetic & Dermatology";
    $data['rtype'] = $p->rtype;
    return view('reports.invoice', $data);
  }

  public function person_profile($query_string = null)
  {
    if (!Session::get('login_name', null)) return redirect('/');
    $branch_id = Session::get('branch_id', 0);
    if (!$branch_id) return redirect('/');
    $data['branch'] = \App\Models\CompanyProfile::details($branch_id);
    $p = processQueryString($query_string);

    if (!$p) {
      return view('errors.500');
    }

    $rtype = $p->rtype;
    $data['rtype'] = $rtype;
    $id = isset($p->id) ? $p->id : 0;
    $ss = (object)['branch_id' => $branch_id];

    switch ($rtype) {
      case 'patient_profile': {
          $data["title"] = "Patient Profile";
          $data["patient"] = \App\Models\Patient::profileInfo($id);
          break;
        }
      case 'employee_profile': {
          $data["title"] = "Employee Profile";
          $data["employee"] = \App\Models\CompanyProfile::details($branch_id);
          break;
        }
      default: {
          return view("reports.no_report");
        }
    }
    return view("reports.person_profile", $data);
  }

  public function general_report_center($query_string = null)
  {
    if (!Session::get('login_name', null)) return redirect('/');
    $branch_id = Session::get('branch_id', 0);
    if (!$branch_id) return redirect('/');
    $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
    $p = processQueryString($query_string);

    if (!$p) {
      return view('errors.500');
    }

    $rtype = isset($p->rtype) ? $p->rtype : null;
    $data['rtype'] = $rtype;
    $start_date = isset($p->startdate) ? $p->startdate : null;
    $end_date = isset($p->enddate) ? $p->enddate : null;
    $data['date'] = (object)["start_date" => $start_date, "end_date" => $end_date];

    switch ($rtype) {
      case 'revenues': {
          $data['title'] = "Revenue List";
          $data['revenue_list'] = (object)[];
          break;
        }
      case 'rev_by_category': {
          $data['title'] = "Revenue List";
          $data['department_name'] = "Dermatology";
          if(isset($p->department_id)){
            $department_name = "Dermatology"; //get Department Name from Modal with $department_id
            $data['department_name'] = "of ".$department_name;
          }
          $data['revenue_by_category'] = (object)[];
          break;
        }
      case 'rev_by_client': {
          $data['title'] = "Revenue List";
          $data['customer_name'] = "Customer";
          if(isset($p->customer_id)){
            $customer_name = "Customer"; //get Department Name from Modal with $customer_id
            $data['customer_name'] = "of ".$customer_name;
          }
          $data['revenue_by_client'] = (object)[];
          break;
        }
      case 'invoice_list': {
          $data['title'] = "Invoice Lists";
          $data['invoice_list'] = (object)[];
          break;
        }
      case 'profit_and_losss': {
          break;
        }
      case 'product_list': {
          $data['title'] = "Product List";
          $data['product_list'] = (object)[];
          break;
        }
      case 'staff_list': {
          $data['title'] = "Staff List";
          $data['staff_list'] = (object)[];
          break;
        }
      case 'client_list': {
          $data['title'] = "Patient List";
          $data['client_list'] = (object)[];
          break;
        }
      case 'on_hand_stocks': {
          break;
        }
      case 'labo_tests': {
          $data['title'] = "Labo Test Lists";
          $data['labo_list'] = (object)[];
          break;
        }
      case 'services': {
          $data['title'] = "Service List";
          $data['staff_name'] = "";
          if(isset($p->emp_id)){
            $staff_name = "";
            $data['staff_name'] = "of ".$staff_name;
          }
          $data['service_list'] = (object)[];
          break;
        }
      default: {
          break;
        }
    }
    // echo dd($data);
    return view('reports.gen_report_center', $data);
  }

  public function prescription($query_string = null){
    if (!Session::get('login_name', null)) return redirect('/');
    $branch_id = Session::get('branch_id', 0);
    if (!$branch_id) return redirect('/');
    $data['branch'] = $this->reportModel->getBranchInfo($branch_id);
    $p = processQueryString($query_string);

    if (!$p) {
      return view('errors.500');
    }
    
    $data['patient_info'] = (object)[];
    $data['prescription_list'] = (object)[];

    return view('reports.prescription_form',$data);
  }
}