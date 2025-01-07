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
    static function convertToKhmerWords($number) {
        $khmerDigits = ['0' => 'សូន្យ', '1' => 'មួយ', '2' => 'ពីរ', '3' => 'បី', '4' => 'បួន', '5' => 'ប្រាំ', '6' => 'ប្រាំមួយ', '7' => 'ប្រាំពីរ', '8' => 'ប្រាំបី', '9' => 'ប្រាំបួន'];
        $khmerUnits = ['', 'ម៉ឺន', 'សែន', 'លាន', 'កោដិ'];
    
        // Convert the number to an integer if it ends with .00
        if (strpos($number, '.') !== false) {
            $number = rtrim(rtrim($number, '0'), '.'); // Remove trailing .00 or .0
        }
    
        // Split the number into integer and decimal parts
        $parts = explode('.', strval($number));
        $integerPart = $parts[0];
    
        // Convert the integer part
        $integerInWords = '';
        $length = strlen($integerPart);
    
        for ($i = 0; $i < $length; $i++) {
            $digit = $integerPart[$i];
            $position = $length - $i - 1;
    
            if ($digit !== '0') {
                $integerInWords .= $khmerDigits[$digit] . ' ' . ($khmerUnits[$position % 4] ?? '') . ' ';
            }
    
            if ($position % 4 === 0 && $position !== 0) {
                $integerInWords .= 'លាន ';
            }
        }
    
        return trim($integerInWords);
    }
    
    
    static function createContract($arr,$emp_id)
    {
        $d = (object)$arr;
        $com_rep_branch = $d->id ?? null;
        if (!$com_rep_branch) {
            return DV::error('Please, Select branch.');
        }
        if (!$emp_id) {
            return DV::error('Please, Select Employee.');
        }
        $emp = DB::table('employees as e')
            ->join('positions as p','p.id','=','e.position_id')
            ->where('e.id', $emp_id)
            ->selectRaw('e.id,e.code,e.name, e.name_kh, e.nid, e.marital_status, e.sex, e.date_of_birth, e.phone_number, e.address,p.title as position,p.salary,e.joining_date ')
            ->first();
      
        
        $branch = self::getBranchInfo($com_rep_branch);
        $director =$d->branch_name ?? $branch->director;
        $com_rep_name = $d->com_rep_name ?? $director->name ?? '<Director Name>';
        $com_rep_nid = $d->com_rep_nid ?? $director->nid;
        $com_rep_sex = $branch->director->sex;
        $com_rep_phone = $d->com_rep_phone ?? $director->phone_number;
        $com_address = $d->branch_address ?? $branch->address_kh;

        $emp_branch = $d->branch_name ?? $emp->branch; 
        $emp_name = $d->name_kh ?? $emp->name_kh;
        $emp_sex = $emp->sex;
        $emp_position = $d->emp_position ?? $emp->position;
        $emp_salary = $emp->salary;
        $emp_nid = $d->emp_nid ?? $emp->nid;
        $emp_phone = $d->emp_phone ?? $emp->phone_number;
        $emp_address = $d->emp_address ?? $emp->address;
        // Fetch employee data from the database
        
        
        
        // Define placeholders and default values
        $data = [
            'com_address' => $com_address,
            'com_city' => $branch->city,
            'com_rep_branch' => $com_rep_name,
            'com_rep_name' => $director,
            'com_rep_sex' => self::getSex($com_rep_sex),
            'com_rep_dob' => getKhmerDate($branch->director->date_of_birth),
            'com_rep_nid' =>  $com_rep_nid,
            'com_rep_phone' => $com_rep_phone,
            'emp_name' => $emp_name,
            'emp_code' => $emp->code,
            'emp_sex' => self::getSex($emp_sex),
            'emp_phone' => $emp_phone,
            'emp_nid' => $emp_nid,
            'start_date' => getKhmerDate($emp->joining_date),
            'end_date' => getKhmerDate(self::calculateEndDate($emp->joining_date)),
            'position' => $emp_position,
            'salary_level' => $emp_salary,
            'khr_amount' => $emp_salary,
            'khr_amount_in_word' => self::convertToKhmerWords($emp_salary),
            'khr_salary' => $emp_salary,
            'khr_salary_in_word' => self::convertToKhmerWords($emp_salary),
            'emp_address' => $emp_address,
            'branch' => $emp_branch,
            'emp_dob' => getKhmerDate($emp->date_of_birth),
            'signature_date' => getKhmerDate(null),
        ];

        // Define the template path
        $base_path = base_path();
        // $base_path = str_replace('\\',"/",$base_path);
        // $templatePath = $base_path . '/storage/doc_templates/staff_contract_unlimited.docx';
        $templatePath = base_path('/storage/doc_templates/staff_contract_unlimited.docx');
        if (!file_exists($templatePath)) {
            \Log::info("Contract Template file not found at {$templatePath}");
            return;
        }
        
        
        // Load the template
        $templateProcessor = new TemplateProcessor($templatePath);
 
        // Replace placeholders with actual values
        foreach ($data as $key => $value) {
            $templateProcessor->setValue($key, $value);
          
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