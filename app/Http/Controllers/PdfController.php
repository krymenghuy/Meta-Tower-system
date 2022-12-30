<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;


class PdfController extends Controller
{
    

    public function previewPdf(){
        $datas = DB::SELECT('SELECT * FROM package');
        $fileName = 'UserList.pdf';
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'UTF-8',
            'format' => 'A4-L',
            'autoScriptToLang' => true,
            'autoLangToFont' => true,
            'margin-left' => 10,
            'margin-right' => 10,
            'margin-top' => 15,
            'margin-bottom' => 20,
            'margin_header' => 10,
            'margin_footer' => 10
        ]);

        $html = \View::make('preview_pdf')->with('datas', $datas);
        $html = $html->render();

        $mpdf->SetHeader('Chapter 1 | Package list |ទំព័រទី{PAGENO}');
        $mpdf->SetFooter('This is footer');


        $mpdf->WriteHTML($html);
        $mpdf->Output($fileName, 'I');

        

    }
}
