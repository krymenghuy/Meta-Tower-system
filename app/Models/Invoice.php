<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
class Invoice //extends Model
{
    // use HasFactory;
    protected $id=null,$ss=null;
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }
    function generateInvoice($arr=[],$ss){
        $v_rule = [
            'due_date' => '1|string',
            // 'student_id' => '0|number|exists=students.id',
            'enrollment_id' => '1|number|exists=enrollments.id',
            'qty' => '0|number',
            'fee_types' => '0|array',
            'note' => '0|string|1,300',
            'invoice_id' => '0|number|exists=invoices.id',
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inv_id = $inputs['invoice_id'];
        unset($inputs['invoice_id']);
        // $student_id = $inputs['student_id'];
        $enrollment_id = $inputs['enrollment_id'];
        // unset($inputs['enrollment_id']);
        // $student = DB::table('students')->where('branch_id',$ss->branch_id)->where('id',$student_id)->selectRaw('id')->first();
        $enr_info = DB::table('enrollments as e')->where('e.id',$enrollment_id)
                    ->join('payments as p','p.enrollment_id','=','e.id')
                    ->selectRaw('e.id as enr_id,p.tuition,e.start_date,e.tuition_end_date,e.academic_year,p.policy_discount,e.status_id,e.student_id')
                    ->first();
        $tuition_end_date = convertDate($enr_info->tuition_end_date);
        $enr_info->pmt_status = 'Unpaid';
        $inputs['student_id'] = $enr_info->student_id;
        $inputs['due_date'] = convertDate($inputs['due_date']);
        $qty = $inputs['qty'];
        unset($inputs['qty']);
        $fee_types = $inputs['fee_types'];
        $issue_date = date('Y-m-d');

        unset($inputs['fee_types']);
        $inputs['invoice_date'] =  $issue_date;
        $keep_amount = [];
        $amount = 0;
        //$last_id = DB::table('invoices')->selectRaw('id')->orderBy('id','desc')->first();
        $is_tuition_fee = 0;
        $getTuitionFeeType = null;
        $invoice_type = 'non_tuition_fee';
        $save_inv = saveData($ss,'invoices',["id" => $inv_id],$inputs,[],1);
        if($save_inv){
            self::setInvoiceNumber($ss->branch_id,$save_inv,'no-tax',$issue_date,5);
            foreach($fee_types as $fee){
                // $not_nontutition = DB::table('other_fees')->where('academic_year',$enr_info->academic_year)->where('name',$fee['fee_type'])->exists();
                $fee['invoice_id'] = $save_inv;
                $fee['qty'] = $qty || 1;

                if(strtolower($fee['fee_type']) == 'tuition_fee'){
                    if($tuition_end_date){
                        if($tuition_end_date > date('Y-m-d') && $enr_info->status_id == 3){
                            $row->pmt_status = 'paid';
                            return DV::error('Tuition Fee is paid');
                        }
                        else if($tuition_end_date < date('Y-m-d') && $enr_info->status_id == 3){
                            $row->pmt_status = 'expired';
                            return DV::error('Tuition Fee is expired');
                        }
                        // else $row->pmt_status = 'unpaid';
                    }
                    // if($tuition_end_date){
                    //     if($tuition_end_date > date('Y-m-d')){
                    //         $enr_info->pmt_status = 'paid';
                    //         return DV::error('Tuition Fee is paid');
                    //     }else $enr_info->pmt_status = 'expired';
                    // }
                    $fee['price'] = $enr_info->tuition;
                    $fee['date_range'] = date('d M Y',strtotime($enr_info->start_date)) . ' to ' . date('d M Y',strtotime($enr_info->tuition_end_date));
                    $fee['fee_type'] = 'tuition_fee';
                    $fee['discount'] = $enr_info->policy_discount;
                    $fee['start_date'] = $enr_info->start_date;
                    $fee['end_date'] = $enr_info->tuition_end_date;
                    $is_tuition_fee = self::getTuitionDueByStudent($enr_info->student_id);
                    $getTuitionFeeType = 'tuition_type';
                    $invoice_type = 'tuition_fee';
                }

                $data_rows = DB::table('other_fees')->where('academic_year',$enr_info->academic_year)->where('name',$fee['fee_type'])->selectRaw('amount,start_date,end_date,description')->get();
                foreach($data_rows as $row){
                    $fee['price'] = $row->amount;
                    $fee['date_range'] = isset($row->start_date)?$row->start_date . ' to ' . $row->end_date:null;
                    $fee['description'] = $row->description;
                    $keep_amount[] = $row->amount;
                }
                $invoice_items = saveData($ss,'invoice_items',["id"=>isset($fee["id"])?$fee["id"]:null],$fee,[],1);
            }
            if($getTuitionFeeType){
                $amount = array_sum($keep_amount) + $enr_info->tuition;
            }else{
                $amount = array_sum($keep_amount);
            }


            $matchedStudents = DB::table('students as s')
                    ->join('deposite as d', 's.name', '=', 'd.student_name')
                    ->where('s.date_of_birth', '=', DB::raw('d.date_of_birth'))
                    ->selectRaw('s.name,d.deposite_amount') // Select columns from the students table
                    ->where('d.is_used',0)
                    ->get()->first();
            $doposite_amt = 0;
            if($matchedStudents && $getTuitionFeeType){
                $doposite_amt = $matchedStudents->deposite_amount;
            }

            $due_amount = $is_tuition_fee + array_sum($keep_amount);

            $inv = DB::table('invoices')->where('id',$save_inv)->update([
                'due_amount'=>$due_amount - $doposite_amt,
                'amount'=>$amount,
                'invoice_type' => $invoice_type
            ]);
            if($inv){
                DB::table('students as s')
                    ->join('deposite as d', 's.name', '=', 'd.student_name')
                    ->where('s.date_of_birth', '=', DB::raw('d.date_of_birth'))
                    ->update([
                            'is_used' => 1
                    ]);
            }
            // saveData($ss,'payments',['enrollment_id' => $enr_info->enr_id],['tuition_due' => $due_amount]);
        }
        return DV::depends($save_inv,['action'=>'Generated']);
    }
}
