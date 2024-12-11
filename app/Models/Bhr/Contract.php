<?php

namespace App\Models\Bhr;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\DB;

class Contract
{
    static function getBranchInfo($branch_id){
        $row = DB::table('um_branches as b')->where('id',$branch_id)->selectRaw('b.id,b.name,b.name_kh,b.address_kh, b.director_id')->first();
        if(!$row) return null;
        $row->director = self::getBranchDirector($row->director_id);
        return $row; 
    }

    static function getBranchDirector($director_id){
        if(!$director_id) return null;
      return DB::table('employees as e')->where('e.id',$director_id)->selectRaw('e.id,e.name,e.name_kh,sex, phone_number,nid')->first();
    }

    static function getSex($sex){
       if($sex ==='M') return 'ប្រុស';
       else if ($sex ==='F') return 'ស្រី';
       else 'មិនប្រាប់';  
    }
    static function createContract($branch_id,$emp_id)
    {
        $branch = self::getBranchInfo($branch_id);
        if(!$branch) return;
        $director = $branch->director;

        // Fetch employee data from the database
        $emp = DB::table('employees as e')
            ->where('e.id', $emp_id)
            ->selectRaw('e.id, e.code,e.name, e.name_kh, e.nid, e.marital_status, e.sex, e.date_of_birth, e.phone_number, e.address')
            ->first();

        // Define placeholders and default values
        $data = [
            'com_address' => $branch->address_kh,
            'com_rep_name'=> $director->name ?? '<Director Name>',
            'com_rep_sex' => self::getSex($director->sex),
            'com_rep_dob' => getKhmerDate($director->date_of_birth),
            'com_rep_nid' =>$director->nid,
            'com_rep_phone' => $director->phone_number,
            'emp_name' => $emp->name_kh ?? $emp->name,
            'emp_code' => $emp->code,
            'emp_sex' => self::getSex($emp->sex),
            'emp_nid' => $emp->nid ?? '',
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