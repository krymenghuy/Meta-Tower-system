<?php

namespace App\Models\Mhr;

use DBX;
use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\MhrEmployee;
use Vsd\Vsloquent\VSModel;
use XPublicStorage;
use App\Models\Prm\GeneralSettings;
use Vsd\Money\Models\VSMoney;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Exception;

class EmployeeBenefit extends VSModel
{
    protected $userInfo = null;
    protected static $emp_benefit = 'emp_benefit';
    protected static $xlsx_keys = [
        'emp_id',
        'name',
        'benefit_id',
        'effective_date',
        'amount',
        'currency',
        'tax_option_id',
        'remarks',
    ];
    public function __construct($id = null, $userInfo = null){
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function upsert($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $v_rule = [
            'emp_id' => '1|number|exists=employees.id',
            'benefit_id' => '1|number|exists=benefits.id',
            'tax_option_id' => '1|choice|1,2,3|default=1',
            'flat_tax_rate' => '0|number',
            'effective_date' => '0|date',
            // 'balance' => '0|number|default=0',
            'amount' => '1|number',
            'currency_code' => '1|choice|KHR,USD|default=' . VSMoney::$base_currency,
            'remarks' => '0|string|1-250',
        ];

        $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];

        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }
        $inputs = $res->values;
        $d = (object)$inputs;
        $inputs['effective_date'] = convertDate($d->effective_date);
        if(!$id){
        //     $id = self::getEmpBenefitID($d->emp_id,$d->benefit_id,$d->effective_date);
        //     if($id){
        //         return DV::error('Duplicate Benefit id');
        //     }
            $inputs['balance'] = $d->amount;

        }else {
            $row = DB::table('emp_benefits')->where('id', $id)->selectRaw('balance,currency_code')->first();
            if ($row->balance > $d->amount) {
                return DV::error('Amount cannot be less than previous balance ' . VSMoney::formatAmount($row->balance, $row->currency_code, false) . ' ' );
            }
        }

        $id = DBX::saveData($ss, 'emp_benefits', ['id' => $id], $inputs, [], 1);
        if ($id) {
            return DV::depends(1, ['emp_benefits' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving Employee Benefit.');
    }

    static function getEmpBenefitID($emp_id, $benefit_id, $date)
    {
        $date = convertDate($date);
        return DB::table('emp_benefits')->where('emp_id', $emp_id)->where('benefit_id', $benefit_id)->where('effective_date', $date)->value('id');
    }
    static function convertImportedEmployeeBenefit($rows)
    {
        $result = [];
        foreach ($rows as $index => $row) {
            if ($index >= 0) {
                $keeper = [];
                $key = 0;
                foreach ($row as $index => $value) {
                    if ($key <= count(self::$xlsx_keys)) {
                        if ($index >= 0) {
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
    static function readExcel($ss, $file_name, $start_index = null)
    {
        $fullPath = XPublicStorage::getDiskPath(['subs_id' => $ss->subs_id, 'dir' => self::$emp_benefit], 'document') . $file_name;
        $reader = IOFactory::createReader('Xlsx');
        $spreadsheet = $reader->load($fullPath);
        $worksheet = $spreadsheet->getActiveSheet();
        $_data = $worksheet->toArray();
        $_data = array_filter($_data, function ($record) {
            return array_filter($record, function ($value) {
                return $value !== null && $value !== '' && $value !== false;
            }) !== [];
        });
        $i = $start_index ? $start_index : 1;
        $c = null;
        do {
            if (!isset($_data[$i])) break;
            $c = $_data[$i];
            $data_tracking[] = $c;
            $i++;
        } while ($c);
        return $data_tracking;
    }
    static function validateData($rows)
    {
        $duplicate_benefit = [];
        foreach ($rows as &$row) {
            $row = (object) $row;
            $row = (object) $row;

            $name = $row->name;
            $emp_benefit = $row->emp_id . $row->benefit_id . convertDate($row->effective_date);
            if ($emp_benefit && in_array($emp_benefit, $duplicate_benefit)) {
                return (object)['error' => "បុគ្គលិកឈ្មោះ​ $name ដែលមានលេខសំគាល់ខ្លួន $row->emp_id នៅថ្ងៃទី $row->effective_date ត្រូវបានទទួល​ $row->benefit_id រួចម្តងហើយ "];
            } else {
                $duplicate_benefit[] = $emp_benefit;
            }

            $employee = $row->emp_id;
            $row->emp_id = DB::table('employees')->where('code', $employee)->value('id');
            if (!$row->emp_id) {
                return (object)['error' => "សូមពិនិត្យព័ត៌មានសម្រាប់បុគ្គលិក $name : លេខសំគាល់ខ្លួន " . ($employee ?: 'មិនបានបញ្ជាក់') . " រកមិនឃើញនៅក្នុងប្រព័ន្ធ"];
            }
            $benefit = $row->benefit_id;
            $row->benefit_id = DB::table('benefits')->where('name', $benefit)->value('id');
            if (!$row->benefit_id) {
                return (object)['error' => "សូមពិនិត្យព័ត៌មានសម្រាប់បុគ្គលិក $name : Benefit '" . ($benefit ?: 'មិនបានបញ្ជាក់') . "' មិនត្រឺមត្រូវទេ"];
            }
        }
        return $rows;
    }


    public function importBenefits($arr, $ss, $id = null)
    {
        $v_rule = [
            'file' => '1|string',
        ];
        $res = DBX::validateObject($arr, $v_rule, 0, [], $ss->lang, 0, null);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;

        $base64 = str_replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '', $inputs['file']);
        $x = XPublicStorage::savefile(['subs_id' => $ss->subs_id, 'dir' => self::$emp_benefit], 'xlsx', $base64, 'document');

        if ($x->status == 'OK') {
            $import_id = DBX::saveData($ss, 'imported_files', ['id' => null], [
                'type' => $x->file_type,
                'file_name' => 'Imported from Excel by ' . $ss->full_name . ' on ' . date('d M Y H:i', time()),
                'imported_date' => date('Y-m-d H:i:s'),
                'title' => 'Import Employee Benefit',
            ], [], 1);

            $file_name = $x->file_name;
            $rows = self::readExcel($ss, $x->file_name, 2);
            $data = self::convertImportedEmployeeBenefit($rows);
            $data = self::validateData($data);
            if(isset($data->error)) return DV::error($data->error);

            $success = 0;
            DB::beginTransaction();
            try {
                foreach ($data as $row) {
                    $arr = (array) $row;
                    $name = $arr['name'];

                    $v_rule = [
                        'emp_id' => '1|number|exists=employees.id',
                        'benefit_id' => '1|number|exists=benefits.id',
                        'tax_option_id' => '1|choice|1,2,3|default=1',
                        'flat_tax_rate' => '0|number',
                        'balance' => '0|number|default=0',
                        'effective_date' => '1|date',
                        'amount' => '1|number',
                        'currency_code' => '1|choice|KHR,USD|default=' . VSMoney::$base_currency,
                        'remarks' => '0|string|1-250',
                    ];
                    $remarks = ['$', "'", '#', '@', '!', '&', '.', '-', '_', '=', '?', ','];



                    $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => $remarks], $ss->lang);

                    $inputs = $res->values;
                    $duplicate = DB::table('emp_benefits')
                        ->where('emp_id', $inputs['emp_id'])
                        ->where('benefit_id', $inputs['benefit_id'])
                        ->where('effective_date', $inputs['effective_date'])
                        ->exists();

                    if ($duplicate) {
                        DB::rollback();
                        return DV::error("បុគ្គលិកឈ្មោះ​ $name បានទទួល Benefit រួចម្តង់ហើយនៅក្នុងថ្ងៃទី​ $row->effective_date");
                    }
                    $inputs['balance'] = $inputs['amount'];
                    $id = DBX::saveData($ss, 'emp_benefits', ['id' => null], $inputs, [], 1);

                    if ($id > 0) {
                        $success++;
                    }
                }

                if ($success > 0) {
                    DB::commit();
                    return DV::depends($success, 'Successfully imported.');
                } else {
                    DB::rollback();
                    return DV::error('It seems there are no valid data to import.');
                }
            } catch (Exception $e) {
                DB::rollback();
                $file_name = basename($x->file_name);
                XPublicStorage::delete(['subs_id' => $ss->subs_id, 'dir' => self::$emp_benefit], 'documents', $file_name);
                \Log::error($e->getMessage() . "\n" . $e->getTraceAsString());
                return DV::error('There were some problems during importing. This is likely due to incorrect data format in Excel.');
            }
        }
    }


    function getAllBenefitList($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        
        $search_value = $d->search_value ?? null;
        $benefit_id = $d->benefit_id ?? null;
        $tax_option_id = $d->tax_option_id ?? null;
        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        $skip_rows = ($current_page - 1) * $per_page;
        if(!is_numeric($current_page)){
            $current_page = 1;
        }
        $skip_rows = ($current_page - 1) * $per_page;
        $str_search = "1=1";
        $str_moreWhere = '2=2';
        if ($search_value) {
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(emp.name LIKE '%" . $search_value . "%')";
        }
         if ($benefit_id) {
            $str_moreWhere .= ' AND eb.benefit_id = ' . $benefit_id;
        }
        if ($tax_option_id) {
            $str_moreWhere .= ' AND eb.tax_option_id = ' . $tax_option_id;
        }
        $query = DB::table('emp_benefits as eb')
            ->join('employees as emp', 'emp.id', '=', 'eb.emp_id')
            ->join('benefits as b', 'b.id', '=', 'eb.benefit_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->whereRaw($str_search)
            ->whereRaw($str_moreWhere)
            ->selectRaw('
                eb.id,
                emp.id as emp_id,
                emp.name as emp_name,
                p.name as position,
                b.name as benefit_name,
                b.type_id as benefit_type_id,
                eb.benefit_id,
                eb.effective_date,
                eb.tax_option_id,
                eb.flat_tax_rate,
                eb.balance,
                eb.amount,
                eb.currency_code,
                eb.remarks,
                emp.photo_file_name as emp_photo
            ')
            ->orderBy('id', 'DESC');
            $clone_query = clone $query;
            $count = $clone_query->count('eb.id');
            $rows = $query->skip($skip_rows)->take($per_page)->get();
            foreach ($rows as $row) {
                $row->image_url = '';
                $row = setOfficialDates($row,['effective_date'],[''],['']);
                if (isset($row->emp_id) && $row->emp_photo) {
                    $row->image_url = Employee::profilePicture($row->emp_id);
                }
                unset($row->emp_photo);
            }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    static function getDetails($id, $ss)
    {
        $row = DB::table('emp_benefits as eb')
            ->join('employees as emp', 'emp.id', '=', 'eb.emp_id')
            ->join('benefits as b', 'b.id', '=', 'eb.benefit_id')
            ->join('positions as p', 'p.id', '=', 'emp.position_id')
            ->selectRaw('
            eb.id,
            emp.id as emp_id,
            emp.name as emp_name,
            p.name as position,
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
        ->where('eb.id', $id)->first();
        if(!$row) return null;
        return $row;
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
            'benefit_disburse_policies'=>DB::table('benefit_disburse_policies as bdp')->where('bdp.target_month', 0)->selectRaw('bdp.id,bdp.benefit_id')->get(),
            'currency_codes' => VSMoney::options_currency($ss),
            'emp_benefits' => $emp_benefits,
            'tax_options' => [
                ['id' => '1', 'name' => 'taxable'],
                ['id' => '2', 'name' => 'none taxable'],
                ['id' => '3', 'name' => 'flat rate'],
            ],
        ];
    }
}
