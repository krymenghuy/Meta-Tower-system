<?php

namespace App\Models\Bhr;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\DB;
use App\Models\Location\City;
use App\Models\Bhr\Employee;

use Carbon\Carbon;
Use App\Models\DV;
Use App\Models\DBX;
class Contract
{
    static function getBranchInfo($branch_id){
        $row = DB::table('um_branches as b')->where('id',$branch_id)->selectRaw('b.id,b.name,b.name_kh,b.address_kh,b.city_id, b.director_id')->first();
        // if(!$row) return null;
        if (!$row) return DV::error('Please, Select Branch.');
        $city = City::getById($row->city_id);
        $row->city = $city ? $city->name : '';
        $row->director = self::getBranchDirector($row->director_id);
        return $row; 
    }

    static function getBranchDirector($director_id){
        if(!$director_id) return null;
      return DB::table('employees as e')->where('e.id',$director_id)->selectRaw('e.id,e.name,e.name_kh,sex,date_of_birth,phone_number,nid')->first();
    }

    static function getSex($sex){
       if($sex ==='M') return 'ប្រុស';
       else if ($sex ==='F') return 'ស្រី';
       else 'មិនប្រាប់';  
    }
    static function calculateEndDate($startDate)
    {
        if (!$startDate) {
            return null;
        }
        return Carbon::parse($startDate)->addMonths(3)->format('Y-m-d');
    }
    
    static function createContract($arr,$emp_id)
    {
        $d = (object)$arr;

        $com_rep_branch = $d->branch_id ?? null;
        $com_rep_name = $d->director_id ?? null;
        $com_rep_nid = $d->nid ?? null;
        $com_rep_sex  = $d->sex ?? null;
        $com_rep_phone = $d->phone_number ?? null;
        $com_address = $d->address_kh ?? null;

        $emp_branch = $d->branch_id ?? null;
        $emp_name = $d->emp_name ?? null;
        $emp_sex  = $d->sex ?? null;
        $emp_position = $d->position ?? null;
        $emp_nid = $d->nid ?? null;
        $emp_phone = $d->phone ?? null;
        $emp_address = $d->address ?? null;
        
        
        $branch = self::getBranchInfo($com_rep_branch);
        if(!$branch) return DV::error('Pleases, Select branch.');
        if(!$emp_id) return DV::error('Pleases, Select Employee.');
        $director = $branch->director;
        // Fetch employee data from the database
        
        $emp = DB::table('employees as e')
            ->join('positions as p','p.id','=','e.position_id')
            ->where('e.id', $emp_id)
            ->selectRaw('e.id,e.code,e.name, e.name_kh, e.nid, e.marital_status, e.sex, e.date_of_birth, e.phone_number, e.address,p.title as position,e.joining_date ')
            ->first();
        
        // Define placeholders and default values
        $data = [
            'com_address' => $com_address ? $com_address: $branch->address_kh,
            'com_city' => $branch->city,
            'com_rep_branch' => $branch->name,
            'com_rep_name'=> $director->name ?? '<Director Name>',
            'com_rep_sex' => self::getSex($director->sex),
            'com_rep_dob' => getKhmerDate($director->date_of_birth),
            'com_rep_nid' => $director->nid,
            'com_rep_phone' => $director->phone_number,
            'emp_name' => $emp->name_kh ?? $emp->name,
            'emp_code' => $emp->code,
            'emp_sex' => self::getSex($emp->sex),
            'emp_phone' => $emp->phone_number ?? '',
            'emp_nid' => $emp->nid ?? '',
            'start_date' => getKhmerDate($emp->joining_date),
            'end_date' => getKhmerDate(self::calculateEndDate($emp->joining_date)),
            'position' => $emp->position ?? '',
            'emp_address' => $emp->address ?? '',
            'branch' => $branch->name,
            'emp_dob' => getKhmerDate($emp->date_of_birth),
            'signature_date'=>getKhmerDate(null)
        ];

        // Define the template path
        $base_path = base_path();
        $templatePath = $base_path . '/storage/doc_templates/staff_contract_unlimited.docx';

        if (!file_exists($templatePath)) {
            \Log::info("Contract Template file not found at {$templatePath}");
            return;
        }

        // Load the template
        $templateProcessor = new TemplateProcessor($templatePath);
        //$templateContent = file_get_contents($templatePath); // Log raw content
        //\Log::info("Template Content: " . $templateContent);
        //$placeholders = $templateProcessor->getVariables();
 
        // $zip = new ZipArchive;
        // if ($zip->open($templatePath) === TRUE) {
        //     $xmlContent = $zip->getFromName('word/document.xml');
        //     \Log::info("Template XML Content: " . $xmlContent);
        //     $zip->close();
        // } else {
        //     \Log::info("Failed to open DOCX file.");
        // }
 
        // Replace placeholders with actual values
        foreach ($data as $key => $value) {
            $templateProcessor->setValue($key, $value);
            // if ($templateProcessor->setValue($key, $value)) {
            //     \Log::info ( "Successfully replaced {$key} with {$value}\n");
            // } else {
            //     \Log::info( "Failed to replace {$key}\n");
            // }
        }

        // Create a temporary file in memory
        $tempFile = tempnam(sys_get_temp_dir(), 'contract');
        $templateProcessor->saveAs($tempFile);

        // Set headers for force download
        $fileName = 'contract_' . $data['emp_code'] . '.docx';
        header('Content-Description: File Transfer');
        header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($tempFile));

        // Output the file and delete it afterward
        readfile($tempFile);
        unlink($tempFile);
        exit;
    }
    
    
 
}