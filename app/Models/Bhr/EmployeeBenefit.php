<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\DBX;
use App\Models\Bhr\Employee;
use App\Models\Money;
use App\Models\PublicStorage;
use PhpOffice\PhpSpreadsheet\IOFactory;

class EmployeeBenefit
{
    protected $id = null;
    protected $userInfo = null;
    protected static $emp_benefit ='emp_benefit';
    protected static $xlsx_keys = [
        'code','name','benefit','effective_date','amount','currency','tax_option_id','remarks',
    ];
    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
   
    public function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [

            'emp_id' => '1|number|exists=employees.id',
            'benefit_id' => '1|number|exists=benefits.id',
            'tax_option_id' => '1|choice|1,2,3|default=1',
            'flat_tax_rate' => '0|number',
            'effective_date' => '1|date',
            'balance' => '0|number|default=0',
            'amount' => '1|number',
            'currency_code' => '1|choice|KHR,USD|default=' . Money::$base_currency,
            'remarks' => '0|string|1-250',
        ];

        $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $d = (object)$inputs;
        if(!$id){
            $id = self::getEmpBenefitID($d->emp_id,$d->benefit_id,$d->effective_date);
            if($id){
                return DV::error('Duplicate Benefit id');
            }
        }
    
        $id = saveData($ss, 'emp_benefits', ['id' => $id], $inputs, [], 1);
        if ($id) {
            return DV::depends(1, ['emp_benefits' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving Employee Benefit.');
    }
    static function getEmpBenefitID($emp_id,$benefit_id,$date){
        $date = convertDate($date);
        return DB::table('emp_benefits')->where('emp_id',$emp_id)->where('benefit_id',$benefit_id)->where('effective_date',$date)->value('id');

    }
    static function convertImportedEmployeeBenefit($rows){
        $result = [];
        foreach($rows as $index=>$row){
            if($index>=0){
                $keeper=[];
                $key=0;
                foreach($row as $index=>$value){
                    if($key<=count(self::$xlsx_keys)){
                        if($index>=0){
                            $keeper[self::$xlsx_keys[$key]] = strNoSpace($value);
                        }
                    }
                    $key++;
                }
                $result[] = $keeper;
            }
        }
        return $result;
    }
    static function readExcel($ss,$file_name,$start_index=null){
        $fullPath = PublicStorage::getDiskPath(['subs_id'=>$ss->subs_id,'dir'=>self::$emp_benefit],'document').$file_name ;
        $reader = IOFactory::createReader('Xlsx');
        $spreadsheet = $reader->load($fullPath);
        $worksheet = $spreadsheet->getActiveSheet();
        $_data = $worksheet->toArray();
        $_data = array_filter($_data, function ($record) {
            return array_filter($record, function ($value) {
                return $value !== null && $value !== '' && $value !== false;
            }) !== [];
        });
        $i=$start_index?$start_index:1;
        $c = null;
        do {
            if (!isset($_data[$i])) break;
            $c = $_data[$i];
            $data_tracking[] = $c;
            $i++;
        } while ($c);
        return $data_tracking;
    }
    static function validateData($rows) {
        $duplicates = [];
        foreach ($rows as $row) {
            $row = (object) $row; 
            $key = $row->code . $row->benefit . convertDate($row->effective_date);
            if (isset($duplicates[$key])) {
                return "Employee ID {$row->code} is already has Benefit {$row->benefit} on {$row->effective_date}";
            }
            $duplicates[$key] = true;
        }
        return null;
    }
    
    
    public function importBenefits($arr, $ss,$id=null)
    {
        $v_rule = [
            'file' => '1|string',
        ];
        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $base64 = str_replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,','',$inputs['file']);
        $x = PublicStorage::savefile(['subs_id'=>$ss->subs_id,'dir'=>self::$emp_benefit],'xlsx',$base64,'document');//(object)['status'=>'OK']; //
        if($x->status =='OK'){
            $import_id = saveData($ss,'imported_files',['id' => null],[
                'type' =>$x->file_type,
                'file_name' => 'Imported from Excel by '.$ss->full_name.' on '. date('d M Y H:i', time()), //$file_name,
                'imported_date' => date('Y-m-d H:i:s'),
                'title' => 'Import Employee Benefit',
                // 'status_id'=> 1
            ],[],1);
            $file_name = $x->file_name;
            $rows = self::readExcel($ss,$x->file_name,2);
            $data = self::convertImportedEmployeeBenefit($rows);
            $error = self::validateData($data);
            if($error) return DV::error($error);
            
            $success = 0;
            DB::beginTransaction();
            try {
                foreach ($data as $row) {
                    $arr = (array) $row;

                   $emp_id = DB::table('employees')->where('code', $arr['code'])->value('id');
                   $benefit_id = DB::table('benefits')->where('name', $arr['benefit'])->value('id');
                    $v_rule = [
                        'emp_id' => '1|number|exists=employees.id',
                        'benefit_id' => '1|number|exists=benefits.id',
                        'tax_option_id' => '1|choice|1,2,3|default=1',
                        'flat_tax_rate' => '0|number',
                        'balance' => '0|number|default=0',
                        'effective_date' => '1|date',
                        'amount' => '1|number',
                        'currency_code'=> '1|choice|KHR,USD|default='.Money::$base_currency,
                        'remarks' => '0|string|1-250',
                    ];
                    $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

                    $arr['emp_id'] = $emp_id;
                    $arr['benefit_id'] = $benefit_id;

                    $res = validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang);
                    if ($res->error) {
                        DB::rollback();
                        return DV::error("Validation failed for employee {$arr['code']}. Import failed!");
                    }
                    $inputs = $res->values;
                    $duplicate = DB::table('emp_benefits')
                        ->where('emp_id', $emp_id)
                        ->where('benefit_id', $benefit_id)
                        ->where('effective_date', $inputs['effective_date'])
                        ->exists();

                    if ($duplicate) {
                        DB::rollback();
                        return DV::error("Duplicate record found for employee {$arr['code']} with benefit {$arr['benefit']} on {$inputs['effective_date']}!");
                    }
                    $id = saveData($ss, 'emp_benefits', ['id' => null], $inputs, [], 1);
                    if ($id > 0) {
                        $success++;
                    } 
                }
               
                if ($success > 0) {
                    DB::commit();
                    return DV::depends($success, 'Successfully import');
                } else {
                    DB::rollback();
                    return DV::error('It seem there are no valid data to import.');
                }
            }
            catch (\Exception $e) {
                DB::rollback();
                $file_name = basename($x->file_name);
                PublicStorage::delete(['subs_id'=>$ss->subs_id,'dir'=>self::$emp_benefit],'documents',$file_name);
                \Log::error($e->getMessage() . "\n" . $e->getTraceAsString());
                return DV::error('There were some problem during importing. This is likely due to incorrect data format in Excel.');
            }
        }
    }

    function getAllBenefitList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_benefit_id = $d->benefit_id ?? null;
        $search_tax_option = $d->tax_option_id ?? null;
        $str_srch = '1=1';
        if ($search_value) {
            $skip_rows = 0;
            $str_srch = "(emp.name LIKE '%" . $search_value . "%'  OR eb.amount LIKE '%" . $search_value . "%')";
        }
        $date = DBX::formatDate('effective_date','effective_date');
        $query = DB::table('emp_benefits as eb')
            ->join('employees as emp', 'emp.id', '=', 'eb.emp_id')
            ->join('benefits as b', 'b.id', '=', 'eb.benefit_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->selectRaw('
                eb.id,
                emp.id as emp_id,
                emp.name as emp_name,
                p.title as position,
                b.name as benefit_name,
                b.type_id as benefit_type_id,
                eb.benefit_id,
                '.$date.',
                eb.tax_option_id,
                eb.flat_tax_rate,
                eb.balance,
                eb.amount,
                eb.currency_code,
                eb.remarks,
                emp.photo_file_name as emp_photo
            ')
            ->orderBy('id', 'DESC')
            ->where('eb.branch_id', $branch_id)
            ->whereRaw($str_srch);

        if ($search_benefit_id) {
            $query->where('eb.benefit_id', $search_benefit_id);
        }
        if ($search_tax_option) {
            $query->where('eb.tax_option_id', $search_tax_option);
        }
        $clone_query = clone $query;

        $count = $clone_query->count('eb.id');

        $rows = $query->skip($skip_rows)
            ->take($per_page)
            ->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if (isset($row->emp_id) && $row->emp_photo) {
                $row->image_url = Employee::profilePicture($row->emp_id);
            }
            unset($row->emp_photo);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    static function getDetails($id, $ss)
    {
        $branch_id = $ss->branch_id;
        $query =DB::table('emp_benefits as eb')
        ->join('employees as emp', 'emp.id', '=', 'eb.emp_id')
        ->join('benefits as b', 'b.id', '=', 'eb.benefit_id')
        ->join('positions as p', 'p.id', '=', 'emp.position_id')
        ->selectRaw('
            eb.id,
            emp.id as emp_id,
            emp.name as emp_name,
            p.title as position,
            b.name as benefit_name,
            b.type_id as benefit_type_id,
            eb.benefit_id,
            eb.effective_date,
            eb.tax_option_id,
            eb.flat_tax_rate,
            eb.balance,
            eb.amount,
            eb.remarks,
            eb.currency_code,
            emp.photo_file_name as emp_photo
        ')
            ->where('eb.branch_id', $branch_id)->where('eb.id', $id)->take(1)->first();
        return $query;
    }


    function deleteBenefit($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;

        $delete = DB::table('emp_benefits')->where('id', $id)->delete();
        return DV::depends($delete, null, 'Error deleting employee benefit');
    }

    static function getFormOptions($id, $ss)
    {
        $emp_benefits = null;
        if ($id) {
            $emp_benefits = self::getDetails($id, $ss);
        }
        return (object) [
            'employees' => GeneralSettings::options_employee(10, $ss),
            'benefits' => DB::table('benefits')->selectRaw('id,name')->get(),
            'currency_codes' => Money::options_currency($ss),
            'emp_benefits' => $emp_benefits,
            'tax_options' => [
                ['id' => '1', 'name' => 'taxable'],
                ['id' => '2', 'name' => 'none taxable'],
                ['id' => '3', 'name' => 'flat rate'],
            ],
        ];
    }

}
