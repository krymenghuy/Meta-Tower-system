<?php
namespace App\Http\Controllers\Dms;
use App\Http\Controllers\Controller;
use App\Services\Umt\AuthService;
//use Illuminate\Http\Request;

//use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
//use PhpOffice\PhpSpreadsheet\Style;
use PhpOffice\PhpSpreadsheet\Style\Border;
//use PhpOffice\PhpSpreadsheet\Style\Color;
use DB; 
 
class ExcelReportController extends Controller
{
    function index($query_string){
        $user = AuthService::user();
        if (!$user){
             return view('error.403');
        }
        //$ss = AuthService::getUserInfoByToken($token);
        if (!$user) return redirect('/');
        $branch_id = $user->branch_id;
        if (!$branch_id) return redirect('/');
        //$data['branch'] = $this->reportModel->getBranchInfo($branch_id);
        $p = processQueryString($query_string); 
        if(!$p) {
            //error invalid parameters provided
            return view('errors.500');
        } 
        $rtype = strtolower(isset($p->rtype)?$p->rtype:null);
        switch($rtype){
            case 'merchant_disbursements':
                $warehouse_id = isset($p->wid)?$p->wid:1; 
                $start_date = isset($p->startdate)?$p->startdate:null;
                $end_date = isset($p->enddate)?$p->enddate:null;
                $start_date = (bool)strtotime($start_date)? $start_date: date('Y-m-d');
                $end_date = (bool)strtotime($end_date)? $end_date : $start_date;
                return $this->create_merchant_disbursements_report($branch_id,$warehouse_id, $start_date,$end_date);
                break;
            // case 'other_excel_report_name':
            //     break;    
            default:
             break;

        }  
     
    }

    function create_merchant_disbursements_report($branch_id, $warehouse_id,$start_date,$end_date){
        $user = AuthService::user();
        if (!$user) return redirect('/');
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load( base_path('/storage/excel_report_templates/merchant_disbursements.xlsx'));
        $sheet = $spreadsheet->getActiveSheet();
        $start_date = date('d M Y ',strtotime($start_date)) ?? date('d M Y');
        $end_date = $end_date ?? $start_date;
        $end_date = date('d M Y ',strtotime($end_date));

        $spreadsheet->setActiveSheetIndex(0);
        $date = date('d_M_Y',strtotime($start_date));
        $spreadsheet->getActiveSheet()->setTitle('cod_disbursements_'.$date);

        $rows = $this->getDisbursementList($branch_id, $warehouse_id,$start_date, $end_date);
         
        //cell's style
        $styleArray = array(
            'borders' => array(
                'outline' => array(
                    'borderStyle' =>Border::BORDER_THIN,
                    'color' => array('argb' => '000'),
                ),
            ),
        );

        $i=6;
        $x =0;
        $end_date = date('d M Y ',strtotime($end_date)) ?? $start_date;
        $date_range = $start_date.' to '.$end_date;
        $sheet->setCellValue('A2', $date_range);
        $sheet->setCellValue('A3', 'AS OF: '. $end_date);
        foreach($rows as $row) {
            $x++;
            //$sheet->setCellValue('A'.$i,$x);
            $sheet->setCellValue('A'.$i, $row->merchant_name);
            
            // Remove leading spaces and encode data in UTF-8
            $clean_bank_name = mb_convert_encoding(preg_replace('/^\s+|\s+$/u', '', $row->bank_name), 'UTF-8');
            $clean_account_name = mb_convert_encoding(preg_replace('/^\s+|\s+$/u', '', $row->account_name), 'UTF-8');
            $clean_account_number = mb_convert_encoding(preg_replace('/^\s+|\s+$/u', '', $row->account_number), 'UTF-8');
        
            // Set cell values
            $sheet->setCellValueExplicit('B'.$i, $clean_bank_name, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
            //ToSalaryAccount
            $sheet->setCellValueExplicit('C'.$i, $clean_account_number, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
            //ToSalaryAccountName
            $sheet->setCellValueExplicit('D'.$i, $clean_account_name, \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);
            //SalaryAmount
            $sheet->setCellValue('E'.$i, $row->total_amount);
            $sheet->setCellValue('F'.$i, $row->currency_code);

            $range = "A$i:F$i";
            $sheet->getStyle($range)->applyFromArray($styleArray);
        
            $i++;
        }
        
          
        $writer = new Xlsx($spreadsheet);
        //$writer->save('uploads/hell_world.xlsx'); //Save file locally
        $fileName = "cod_disbursement.xlsx";
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="'. urlencode($fileName).'"');
        $writer->save('php://output');
    }

   function getDisbursementList($branch_id, $warehouse_id, $start_date, $end_date)
    {
        $start_date = convertDate($start_date) ?? date('Y-m-d');
        $end_date = convertDate($end_date) ?? date('Y-m-d');

        $rows = DB::table('cash_disbursements as d')
            ->join('sender as s', 's.id', '=', 'd.payee_id')
            ->leftJoin('sender_bank_accounts as acc', function ($join) {
                $join->on('acc.sender_id', '=', 's.id')->where('acc.is_primary', 1);
            })
            ->where('s.branch_id', $branch_id)
            ->whereBetween(DB::raw('DATE(d.payment_date)'), [$start_date, $end_date])
            ->where('d.payee_type', 'merchant')
            ->groupBy('d.trx_id', 'd.payment_date', 's.id', 's.name', 'd.currency_code') // Group by required fields
            ->selectRaw('HEX(d.trx_id) AS trx_id, s.id AS payee_id, d.payment_date, MAX(s.name) AS merchant_name, SUM(d.amount) AS total_amount, d.currency_code, MAX(COALESCE(acc.bank_name, "")) AS bank_name, MAX(COALESCE(acc.account_name, "")) AS account_name, MAX(COALESCE(acc.account_number, "")) AS account_number')
            ->get();

        return $rows;
    }
}
