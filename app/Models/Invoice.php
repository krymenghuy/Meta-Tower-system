<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;
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
            'enrollment_id' => '1|number|exists=enrollments.id',
            'qty' => '0|number',
            'fee_types' => '0|array',
            'note' => '0|string|1,300',
            'invoice_id' => '0|number|exists=invoices.id',
            'currency_code' => '0|string|default=USD',
            'referrer_id' => '0|number|exists=students.id',
            'commission' => '0|number',
            'referrer_type' => '0|string|default=student'
        ];
        $res = validateObject($arr,$v_rule,1,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $inv_id = $inputs['invoice_id'];
        $referrer_type = $inputs['referrer_type'];
        $commission = isset($inputs['commission'])?$inputs['commission']:null;
        $referrer_id = isset($inputs['referrer_id'])?$inputs['referrer_id']:null;
        unset($inputs['referrer_id'],$inputs['commission'],$inputs['referrer_type']);
        unset($inputs['invoice_id']);
        $enrollment_id = $inputs['enrollment_id'];
        $enr_info = DB::table('enrollments as e')->where('e.id',$enrollment_id)
                    ->join('payments as p','p.enrollment_id','=','e.id')
                    ->selectRaw('p.pmt_option_id,e.level_id,e.session_id,p.pmt_status,e.id as enr_id,p.tuition,e.start_date,e.tuition_end_date,e.academic_year,p.policy_discount,e.status_id,e.student_id')
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
        $invoiceItemID =[];
        $amount = 0;
        //$last_id = DB::table('invoices')->selectRaw('id')->orderBy('id','desc')->first();
        $is_tuition_fee = 0;
        $getTuitionFeeType = null;
        $invoice_type = 'non_tuition_fee';
        $save_inv = saveData($ss,'invoices',["id" => $inv_id],$inputs,[],1);
        if($save_inv){
            self::setInvoiceNumber($ss->branch_id,$save_inv,'no-tax',$issue_date,5);
            foreach($fee_types as $fee){

                $fee['invoice_id'] = $save_inv;
                $fee['qty'] = $qty || 1;

                if(strtolower($fee['fee_type']) == 'tuition_fee'){
                    if($tuition_end_date){
                        if($tuition_end_date > date('Y-m-d') && $enr_info->status_id == 3){
                            $enr_info->pmt_status = 'paid';
                            return DV::error('Tuition Fee is paid');
                        }
                        else if($tuition_end_date < date('Y-m-d') && $enr_info->status_id == 3){
                            $x = new PriceList(null,$ss);
                            //** session ,academic year,  */
                            if($enr_info->pmt_option_id == 1){
                                $months = 3;//isset($d->months) ? $d->months:3;
                            }else if($enr_info->pmt_option_id == 2){
                                $months = 6;//isset($d->months) ? $d->months:6;
                            }else if($enr_info->pmt_option_id == 3){
                                $months = 12;//isset($d->months) ? $d->months:12;
                            }
                            $arr = [
                                "level_id" => $enr_info->level_id,
                                "academic_year" => $enr_info->academic_year,
                                "session_id" => $enr_info->session_id,
                                "prev_level_id" => "0",
                                "start_date" => date('Y-m-d'),
                                "months" => $months,
                                // "weeks" => $weeks,
                                // "days" => $days,
                                "pmt_option_id"=> $enr_info->pmt_option_id
                            ];
                            $newPaymentInfo = $x->previewPendingPaymentDetails($arr,$enr_info->enr_id,$ss);
                            $updateEnrollment = saveData($ss,'enrollments',['id' => $enrollment_id],[
                                'tuition_end_date' => $newPaymentInfo->payment_info->end_date
                            ],[],1);
                            $updatePayment = saveData($ss,'enrollments',['id' => null],[
                                'tuition_end_date' => $newPaymentInfo->payment_info->end_date
                            ],[],1);

                            // $enr_info->pmt_status = 'expired';
                            // $p_info =
                            return DV::result($newPaymentInfo);
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
                    $is_tuition_fee = self::getTuitionDueByEnrollmentID($enrollment_id);
                    $getTuitionFeeType = 'tuition_type';
                    $invoice_type = 'tuition_fee';
                }

                $data_rows = DB::table('other_fees')->where('academic_year',$enr_info->academic_year)->where('name',$fee['fee_type'])->selectRaw('amount,start_date,end_date,description')->get();
                foreach($data_rows as $row){
                    $fee['price'] = $row->amount;
                    $fee['net_amount'] = $row->amount;
                    $fee['date_range'] = isset($row->start_date)?$row->start_date . ' to ' . $row->end_date:null;
                    $fee['description'] = $row->description;
                    $fee['net_amount'] = $row->amount;
                    $keep_amount[] = $row->amount;
                }
                $invoice_items = saveData($ss,'invoice_items',["id"=>isset($fee["id"])?$fee["id"]:null],$fee,[],1);
                $invoiceItemID ['inv_item_id'] = $invoice_items;
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

            // $referrer = DB::table('referals')->where('student_id',$enr_info->student_id)->where('is_paid',0)->first();
            // $referrer_comission = 0;
            $doposite_amt = 0;
            // if($referrer || $matchedStudents && $getTuitionFeeType){
            //     $doposite_amt = $matchedStudents->deposite_amount;
            //     $referrer_comission = $referrer->commission;
            // }

            $due_amount = $is_tuition_fee + array_sum($keep_amount);
            // if($referrer_comission>0){
            //     $dis = ($due_amount * $referrer_comission / 100);
            //     $due_amount = $due_amount - $dis;
            // }

            $inv = DB::table('invoices')->where('id',$save_inv)->update([
                'due_amount'=>$due_amount - $doposite_amt,
                'amount'=>$amount,
                'invoice_type' => $invoice_type
            ]);
            if($inv){
                DB::table('invoice_items')->where('invoice_id',$save_inv)->where('fee_type',$invoice_type)->update([
                    'net_amount' => $due_amount - $doposite_amt
                ]);

                DB::table('students as s')
                    ->join('deposite as d', 's.name', '=', 'd.student_name')
                    ->where('s.date_of_birth', '=', DB::raw('d.date_of_birth'))
                    ->update([
                            'is_used' => 1
                    ]);
            }
            //**save referrer */
            if($commission && $referrer_id){
                $save = saveData($ss,'referals',['id' => null],[
                    'commission' => $commission,
                    'commission_type' => 'percentage',
                    'referrer_id' => $referrer_id,
                    'student_id' => $enr_info->student_id,
                    'invoice_id' => $save_inv,
                    'is_paid' => 0,
                    'referrer_type' => $referrer_type
                ]);
                DB::table('students')->where('id', $enr_info->student_id)->update(['referrer_id' => $referrer_id]);
                DB::table('enrollments')->where('id', $enrollment_id)->update(['referrer_id' => $referrer_id]);
                // DB::table('payments')->where('student_id', $referrer_id)->update(['referral_discount' => $commission]);
            }
        }
        return DV::depends($save_inv,['action'=>'Generated']);
    }

    function studentInvoice($filter=[],$ss=null){
        $ss = $ss?$ss:$this->ss;
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        $academic_year = isset($d->academic_year) ? $d->academic_year:null;
        $search_value =isset($d->search_value)?$d->search_value:null;
        $campus_id =isset($d->campus_id)?$d->campus_id:null;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search ='(st.code =\''.$search_value.'\' OR st.name LIKE \'%'.$search_value.'%\')';
        }
        if($campus_id > 0)  $str_search .=' AND e.campus_id ='.$campus_id;
        $get_level = ',(SELECT l.`name` FROM program_levels AS l WHERE l.id = e.level_id LIMIT 1) AS level';
        $selectCols = 'e.id as enrollment_id,s.id as student_id,inv.invoice_type,inv.due_amount,inv.paid_amount,inv.is_paid,inv.id,e.session_id,s.code as student_code,formatDate(inv.invoice_date) AS invoice_date,e.program_id,m.name AS program,e.level_id,s.name as student_name,p.status_id as pstatus_id,e.academic_year'.$get_level.',e.start_date,formatDate(e.tuition_end_date) AS tuition_end_date,formatDate(inv.due_date) AS due_date,inv.invoice_number,inv.amount,inv.update_user,formatDate(inv.pmt_date) AS pmt_date,formatTime(inv.updated_at) AS updated_at';
        $query = DB::table('invoices as inv')
                ->join('students as s','s.id','=','inv.student_id')
                ->join('enrollments as e','e.id','=','inv.enrollment_id')
                ->join('programs as m','m.id','=','e.program_id')
                ->join('terms as t','e.term_id','=','t.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->selectRaw($selectCols)
                ->where('inv.branch_id',$branch_id)
                // ->where('e.status_id',2)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->orderBy('inv.id','desc');
                if($academic_year){
                    $query->where('e.academic_year',$academic_year);
                }
        $count_query = clone $query;
        $count = $count_query->count('inv.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        $session_list =  DB::table('sessions')->where('branch_id',$branch_id)->selectRaw('id,name')->get();
        foreach($rows as $row) {
            //$row->level = Student::getProgramLevel($row->level_id);
            $row->status = $row->is_paid == 1? 'paid' : 'unpaid';
            //$row->program = $program->details($row->program_id,$ss)->name;
            $this_session = $session_list->filter(function ($c) use($row) {
                return $c->id === $row->session_id;
            })->first();

            $row->session = $this_session? $this_session->name:'NA';
            unset($row->session_id);
            unset($row->paid);

        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function generateInvoiceDetails($arr,$ss=null){
        $d = (object)$arr;
        $ss = $ss?$ss:$this->ss;
        $id = isset($d->id)?$d->id:null;
        $invItemID = isset($d->inv_item_id)?$d->inv_item_id:null;
        $campus = new Campus();
        $q = DB::table('students as s')
                // ->where('s.id',$id)
                ->join('enrollments as e','e.student_id','=','s.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->selectRaw('s.id as student_id,p.second_child_discount,p.special_discount,e.academic_year,p.tuition_due,p.policy_discount,e.start_date,e.tuition_end_date,p.tuition,s.code as student_code,s.name as student_name,e.campus_id,e.level_id,e.status_id');
                if($id){
                    $q->where('e.id',$id);
                }
        $row = $q->get()->first();
        if(!$row) return DV::error('Not Found');
        $tuition_end_date = convertDate($row->tuition_end_date);
        $row->pmt_status = 'Unpaid';
        if($tuition_end_date){
            if($tuition_end_date > date('Y-m-d') && $row->status_id == 3){
                $row->pmt_status = 'paid';
            }
            else if($tuition_end_date < date('Y-m-d') && $row->status_id == 3){
                $row->pmt_status = 'expired';
            }
            else $row->pmt_status = 'unpaid';
        }
        $student_id = $row->student_id;
        $invoice_id = self::getInvoiceInfo($student_id);
        $invoice_number =isset( $d->invoice_number)?$d->invoice_number:null;
        $row->campus = $campus->details($row->campus_id,$ss)->name;
        $row->date_range = $row->start_date.' to '.$row->tuition_end_date;
        $row->discount = $row->policy_discount;
        $row->level = Student::getProgramLevel($row->level_id);
        $row->amount = $row->tuition;
        $row->total = $row->tuition_due;
        $row->fee_type = 'tuition_fee';
        $row->due_date = self::getInvoiceInfo($student_id)->due_date;
        $row->invoice_number = self::getInvoiceInfo($student_id)->invoice_number;
        if($invoice_id){
            $row->invoice_id = $invoice_id->id;
        }
        $row->other_fees = self::getOtherFeeTypes($student_id,$invoice_number);
        unset($row->tuition);
        unset($row->tuition_due);
        unset($row->policy_discount);
        $row->deposite_amount = self::studentDeposite($student_id);
        $row->referal = self::getReferrerCommission($student_id,$ss);

        return $row;
    }

    function schoolFeePay($arr,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $instance = new PriceList(null,$ss);
        $v_rule = [
            'enrollment_id' => '1|number|exists=enrollments.id',
            'inv_id' => '1|number|exists=invoices.id'
        ];
        $res = validateObject($arr,$v_rule,0,[],$ss->lang,0,null);
        if($res->error) return DV::error($res->error);
        $d = (object)$arr;
        // $student_id = isset($d->student_id) ? $d->student_id : $d->id;
        $enrollment_id = $d->enrollment_id;
        $inv_id =$d->inv_id;
        $getInvoiceInfo = self::getRelatedInvoice($enrollment_id,$inv_id);
        $row = DB::table('enrollments as e')
                ->where('e.id',$enrollment_id)
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->selectRaw('e.student_id,p.tuition_due,e.id as enr_id,e.start_date,e.term_id,e.program_id,e.level_id,e.session_id,e.campus_id,p.pmt_option_id,e.academic_year')
                ->get()->first();
        $current_level = GeneralSettings::getLevel($row->level_id,$ss);
        $last_level = DB::table('program_levels')->where('program_id',$current_level->program_id)->selectRaw('id,name')->orderBy('id','desc')->first();
        // $current_program = GeneralSettings::getProgramByLevel($row->level_id,$ss);
        // $next_program = GeneralSettings::getNextProgram($current_program->program_id,$ss);
        $next_level = GeneralSettings::getNextLevelByCurrentLevel($row->level_id,$ss);
        $referrer = self::getReferrerCommission($row->student_id,$ss);
        $pmt_option_id = $row->pmt_option_id;
        $next_payment_info = null;
        $current_payment_info=null;
        $pre_enr = null;
        $tuition_due = $row->tuition_due;

        //** add commission to student (Referal Fee (%)) */
        if($referrer->commission>0){
            $x = ($tuition_due * $referrer->commission /100);
            $tuition_due = $tuition_due - $x;
            DB::table('referals')->where('referrer_id',$row->student_id)->update([
                'is_paid' => 1
            ]);
        }

        if($current_level->id != $last_level->id){
            $current_payment_info = $instance->getMonthlyFee([
                    'academic_year' => $row->academic_year,
                    'level_id' => $row->level_id,
                    'session_id' => $row->session_id,
                    'start_date' => $row->start_date,
                ]);

            if($current_payment_info){
                $pre_enr = [
                    'term_id' => $row->term_id,
                    'student_id' => $row->student_id,
                    'level_id' => $row->level_id,
                    'session_id' => $row->session_id,
                    'campus_id' => $row->campus_id,
                    'tuition_due' => $tuition_due,
                    'price_list_id' => $current_payment_info->price_list_id
                ];

                saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
                saveData($ss,'enrollments',['id' => $row->enr_id],[
                    'status_id' => 3,//* paid
                ],[],1);

                if($getInvoiceInfo->invoice_type == 'tuition_fee'){
                    saveData($ss,'payments',['enrollment_id' => $row->enr_id],[
                        'pmt_status'=>'paid',
                        'status_id' => 2, //* 'paid'
                        'tuition_paid' => $tuition_due,
                    ],[],1);

                    saveData($ss,'invoices',['enrollment_id' => $row->enr_id,'id'=>$inv_id],[
                        'is_paid' => 1,//* paid
                        'paid_amount' => $getInvoiceInfo->due_amount,
                        'pmt_date' => date('Y-m-d H:i:s'),
                        'receiver_uid' => $ss->id,
                        'receiver' => $ss->full_name
                    ],[],1);
                }else{
                    saveData($ss,'invoices',['enrollment_id' => $row->enr_id,'id'=>$inv_id],[
                        'is_paid' => 1,//* paid
                        'paid_amount' => $getInvoiceInfo->due_amount,
                        'pmt_date' => date('Y-m-d H:i:s'),
                        'receiver_uid' => $ss->id,
                        'receiver' => $ss->full_name
                    ],[],1);
                }

            }
            if(isset($current_payment_info->status) == 'Error') return DV::error($current_payment_info->error_message);

            $next_payment_info = $instance->getMonthlyFee([
                'academic_year' => $row->academic_year,
                'level_id' => $next_level->id,
                'session_id' => $row->session_id,
                'start_date' => $row->start_date,
            ]);
            if($next_payment_info){
                $pre_enr = [
                    'term_id' => null,
                    'student_id' => $row->student_id,
                    'level_id' => $next_level->id,
                    'session_id' => $row->session_id,
                    'campus_id' => $row->campus_id,
                    'tuition_due' => $next_payment_info->price,
                    'price_list_id' => $next_payment_info->price_list_id
                ];
                saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
            }
        }
        if($last_level->id == $current_level->id){
            $current_payment_info = $instance->getMonthlyFee([
                'academic_year' => $row->academic_year,
                'level_id' => $row->level_id,
                'session_id' => $row->session_id,
                'start_date' => $row->start_date,

            ]);

            if(isset($current_payment_info->status) == 'Error') return DV::error($current_payment_info->error_message);
            if($current_payment_info){
                $pre_enr = [
                    'term_id' => $row->term_id,
                    'student_id' => $row->student_id,
                    'level_id' => $row->level_id,
                    'session_id' => $row->session_id,
                    'campus_id' => $row->campus_id,
                    'tuition_due' => $tuition_due,
                    'price_list_id' => $current_payment_info->price_list_id
                ];

                saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
                saveData($ss,'enrollments',['id' => $row->enr_id],[
                    'status_id' => 3,//* paid
                ],[],1);
                if($getInvoiceInfo){
                    if($getInvoiceInfo->invoice_type == 'tuition_fee'){
                        saveData($ss,'payments',['enrollment_id' => $row->enr_id],[
                            'pmt_status'=>'paid',
                            'status_id' => 2, //* 'paid'
                            'tuition_paid' => $tuition_due,
                        ],[],1);
                        saveData($ss,'invoices',['enrollment_id' => $row->enr_id,'id'=>$inv_id],[
                            'is_paid' => 1,//* paid
                            'paid_amount' => $getInvoiceInfo->due_amount,
                            'pmt_date' => date('Y-m-d H:i:s'),
                            'receiver_uid' => $ss->id,
                            'receiver' => $ss->full_name
                        ],[],1);
                    }else{
                        saveData($ss,'invoices',['enrollment_id' => $row->enr_id,'id'=>$inv_id],[
                            'is_paid' => 1,//* paid
                            'paid_amount' => $getInvoiceInfo->due_amount,
                            'pmt_date' => date('Y-m-d H:i:s'),
                            'receiver_uid' => $ss->id,
                            'receiver' => $ss->full_name
                        ],[],1);
                    }
                }

            }

            if($next_level){
                $next_payment_info = $instance->getMonthlyFee([
                    'academic_year' => $row->academic_year,
                    'level_id' => $next_level->id,
                    'session_id' => $row->session_id,
                    'start_date' => $row->start_date,
                ]);

                if($next_payment_info){
                    $pre_enr = [
                        'term_id' => null,
                        'student_id' => $row->student_id,
                        'level_id' => $next_level->id,
                        'session_id' => $row->session_id,
                        'campus_id' => $row->campus_id,
                        'tuition_due' => $next_payment_info->price,
                        'price_list_id' => $next_payment_info->price_list_id
                    ];
                    saveData($ss,'pre_enrollments',[],$pre_enr,[],1);
                }
            }
        }

        return [
            'enrollment'=>$pre_enr,
            'current_payment_info' => $current_payment_info,
            'next_payment_info' =>$next_payment_info,
            'last_level_next_level' =>$next_level
        ];
    }

    static function studentDeposite($id){
        $matchedStudents =DB::table('students as s')
            ->join('deposite as d', 's.name', '=', 'd.student_name')
            ->where('s.date_of_birth', '=', DB::raw('d.date_of_birth'))
            ->where('s.id',$id)
            ->where('d.is_used',0)
            ->selectRaw('s.name,d.deposite_amount') // Select columns from the students table
            ->get()->first();
        if(!$matchedStudents) return 0;
        return $matchedStudents->deposite_amount;
    }

    static function getOtherFeeTypes($id,$inv_number){
        $rows = DB::table('invoices as i')->where('student_id',$id)
                ->join('invoice_items as it','i.id','=','it.invoice_id')
                ->where('it.fee_type','!=','tuition_fee')
                ->where('i.invoice_number',$inv_number)
                ->selectRaw('it.id as invoice_item_id,it.fee_type,it.price as amount,it.description,price as total')->get();
        return $rows;
    }

    static function getInvoiceInfo($student_id){
        $row = DB::table('invoices as i')->where('i.student_id',$student_id)
                ->join('invoice_items as it','it.invoice_id','=','i.id')
                ->selectRaw('i.due_date,i.invoice_number,i.id')
                ->first();

        if(!$row) return (object)['due_date'=>null, 'invoice_number'=>null,'id'=>null];

        return $row;
    }

    static function setInvoiceNumber($branch_id, $invoice_id = 0, $doc_class = null, $issue_date = null, $len = 5, $onSuccess = null){
        if (!$len) $len = 5;
        $def_prefix = "V";
        $table_name = "invoice_code_control";
        $target_table = "invoices";
        $target_column = "invoice_number";
        $com_branch_id = null;
        $str_company_branch='1=1';
        if($com_branch_id > 0) $str_company_branch ='com_branch_id ='.$com_branch_id;
        if (!$invoice_id) return null;

        //if ($def_prefix) $where_branch .=" AND prefix ='$def_prefix'";
        $year = date('Y', strtotime($issue_date));
        $row = DB::table($table_name . " as c")->where('branch_id', $branch_id)->where('c.issue_year', $year)->where('c.doc_class', $doc_class)->whereRaw($str_company_branch)->selectRaw("last_id,prefix")->take(1)->get()->first();

        $next_num = 0;
        $prefix = null;
            if ($row){
                $next_num = $row->last_id;
                $prefix = $row->prefix;
            }
            if (!$prefix) $prefix = $def_prefix;
            if (!$prefix) $prefix = "I";
            $next_num++;
            //example invoice number => I12023-00003
            $new_code = $prefix . $branch_id . $year . "-" . formatNumber($next_num, $len);

            $x = DB::table($target_table)->where('id', $invoice_id)->update([$target_column => $new_code]);
            if ($x || $x === 1) {
            $updated = DB::table($table_name)->where('branch_id', $branch_id)->where('issue_year', $year)->where('doc_class', $doc_class)->whereRaw($str_company_branch)->update(['last_id' => $next_num]);
            if (!$updated) DB::table($table_name)->insert(['branch_id' => $branch_id, 'com_branch_id' => $com_branch_id, 'doc_class' => $doc_class, 'issue_year' => $year, 'prefix' => $prefix, 'last_id' => $next_num]);
            if ($onSuccess) $onSuccess();
            return (object)['status_code' => 200, 'status' => 'OK', 'code' => $new_code];
        }
    }

    function findStudent($filter=[],$ss){
        $campus = new Campus();
        $branch_id = $ss->branch_id;
        $d = (object)$filter;
        $academic_year = isset($d->academic_year) ? $d->academic_year:null;
        $search_value =isset($d->search_value)?$d->search_value:null;
        $terms_id = isset($d->terms_id)?$d->terms_id:null;
        $pmt_options_id = isset($d->pmt_options_id)?$d->pmt_options_id:null;
        $sessions_id = isset($d->sessions_id)?$d->sessions_id:null;
        $current_page =isset($d->current_page)?$d->current_page:1;
        $per_page =isset($d->per_page)?$d->per_page:10;
        if(!is_numeric($current_page)) $current_page=1;
        $skip_rows = ($current_page -1) * $per_page;

        $str_search ="1=1";
        $str_moreWhere="1=1";
        if($search_value){
            $skip_rows =0;
            $search_value = escape_like_str($search_value);
            $str_search ="(st.code ='$search_value' OR st.name LIKE '%$search_value%'";
        }
        if($terms_id) $str_search .= ' AND e.term_id = '. $terms_id;
        if($sessions_id) $str_search .= ' AND e.session_id = '. $sessions_id;
        if($pmt_options_id) $str_search .= ' AND p.pmt_option_id = '. $pmt_options_id;

        $selectCols = 'e.id as enrollment_id,p.tuition_paid,p.tuition_due,e.tuition_end_date,st.id as student_id,st.file_name,p.status_id as pstatus_id,s.name as session,e.level_id,e.campus_id,e.academic_year,st.id,st.code as student_code,st.name,st.sex,st.date_of_birth,st.file_name,e.prev_school_id,e.status_id';
        $query = DB::table('students as st')
                ->join('enrollments as e','e.student_id','=','st.id')
                ->join('payments as p','p.enrollment_id','=','e.id')
                ->join('sessions as s','s.id','=','e.session_id')
                ->selectRaw($selectCols)
                ->where('st.branch_id',$branch_id)
                ->whereRaw($str_moreWhere)->whereRaw($str_search)
                ->where('p.status_id','!=','NULL') //* for paid and unpaid
                ->where('e.status_id','!=',1) //* for verified up to paid
                ->orderBy('id','desc');
                if($academic_year){
                    $query->where('e.academic_year',$academic_year);
                }
        $count_query = clone $query;
        $count = $count_query->count('st.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();
        foreach($rows as $row) {

            $status = rand(0,1)?'New':'Old';
            $status = 'New';
            $row->image_url = PublicStorage::getUrl($branch_id,'students','image').$row->file_name;
            $row->parent_info = Student::getParentInfo($row->student_id);
            unset($row->file_name);
            $row->campus = $campus->details($row->campus_id,$ss)->name;
            $row->level = Student::getProgramLevel($row->level_id);
            $row->student_type = $status;
            // $row->status = $row->pstatus_id == 1? 'unpaid' : 'paid';
            $row->previous_school = Student::getPrevSchool($row->prev_school_id)->name;
            $tuition_end_date = convertDate($row->tuition_end_date);
            $row->pmt_status = 'unpaid';
            if($tuition_end_date){
                if($tuition_end_date > date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'paid';
                }
                else if($tuition_end_date < date('Y-m-d') && $row->status_id == 3){
                    $row->pmt_status = 'expired';
                }
                else $row->pmt_status = 'unpaid';
            }
            // unset($row->pstatus_id);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function updateInvoice($arr,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $branch_id = $ss->branch_id;
        if(!isset($d->id)) return DV::error('ID is required');
        $id = $d->id;
        if(!is_numeric($id)) return DV::error('ID must be a number');
        $exists_invoice = DB::table('invoices')->where('id',$id)->where('branch_id',$branch_id)->selectRaw('student_id')->first();
        if(!$exists_invoice) return DV::error('ID does not exist');
        //$due_date = isset($d->due_date)?$d->due_date:null;
        $insert_info = isset($d->insert_info)?$d->insert_info:null;
        $delete_info = isset($d->delete_info)?$d->delete_info:null;
        $amount_keeper = [];
        $success = 0;
        $delete = 0;
        foreach($insert_info as $ins_info){
            $other_fee = DB::table('other_fees')->where('name',$ins_info['fee_type'])->selectRaw('name,amount,description')->first();
            $updateOrInsert = [
                "invoice_id" => $id,
                "fee_type" => $ins_info['fee_type'],
                'price' => $other_fee->amount,
                'description' => $other_fee->description
            ];
            $inv_item_id = isset($ins_info['invoice_item_id'])?$ins_info['invoice_item_id']:null;
            $newID = saveData($ss,'invoice_items',['id'=>$inv_item_id],$updateOrInsert);
            $amount_keeper[] = $other_fee->amount;
            $success ++;
        }

        if(isset($delete_info)){
            foreach($delete_info as $del_info){
                DB::table('invoice_items')->where('id',$del_info['invoice_item_id'])->delete();
                $delete ++;
            }
        }
        DB::table('invoices')->where('id',$id)->update(['amount'=>array_sum($amount_keeper),'due_amount'=>array_sum($amount_keeper)]);
        return DV::depends($success || $delete,$amount_keeper);
    }

    static function getTuitionDueByEnrollmentID($enrollment_id){
        $row = DB::table('enrollments as e')->where('e.id',$enrollment_id)
        ->join('payments as p','p.enrollment_id','=','e.id')
        ->selectRaw('p.tuition_due')
        ->get()->first();
        return $row->tuition_due;
    }

    static function getRelatedInvoice($enrollment_id,$inv_id){
        $row = DB::table('invoices as i')->where('enrollment_id',$enrollment_id)
                // ->where('i.invoice_number',$inv_num)
                ->where('i.id',$inv_id)
                ->join('invoice_items as it','i.id','=','it.invoice_id')
                ->selectRaw('i.invoice_number,i.invoice_type,i.due_amount')
                ->get()->first();
        if(!$row) return $row=null;
        return $row;
    }

    // function reviveInActiveInvoice($d,$ss=null){
    //     $ss = $ss?$ss:$this->ss;
    //     $id = $d->id;
    //     $purpose = $d->purpose;

    //     $revive = DB::table('invoices')->where('id',$id)
    //             ->where('branch_id',$ss->branch_id)
    //             ->where('inactive',1)
    //             ->update([
    //                 'inactive' => 0,
    //                 'purpose' => $purpose,
    //             ]);
    //     return DV::depends($revive,['action' => 'Invoices is active now'],'Could not find invoice to revive');
    // }

    function deleteInvoice($d,$ss){ //** only delete upaid invoice  */
        $id = $d->id;
        $is_paid = DB::table('invoices')->where('id',$id)->where('is_paid',1)->where('branch_id',$ss->branch_id)->exists();
        if($is_paid) return DV::error('Can not delete, Invoice is already paid');
        $delete = DB::table('invoices')->where('id',$id)->delete();
        if($delete){
            DB::table('invoice_items')->where('invoice_id',$id)->delete();
        }
        return DV::depends($delete,'Delete');
        // $purpose = isset($d->purpose)?$d->purpose:$d->remarks;
        // $delete = DB::table('invoices')->where('id',$id)->update([
        //     'inactive' => 1,
        //     'purpose' => $purpose
        // ]);
        // $inactive = DB::table('invoices')->where('id',$id)->where('branch_id',$ss->branch_id)->take(1)->value('inactive');
        // if($inactive == 1){
        //     $delete = DB::table('invoices')->where('id',$id)->where('branch_id',$ss->branch_id)->delete();
        // }
        // return DV::depends($delete,['action'=>'Deleted','status'=>'Status change to in active']);
    }

    function getInvoiceItems($invoice_id,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $discount_type =',\'percentage\' AS discount_type';
        return DB::table('invoice_items AS i')->where('invoice_id',$invoice_id)->selectRaw('i.id,i.invoice_id,i.fee_type,i.description,i.qty,i.price,i.date_range,i.discount,i.discount_amount,i.discount_percent,i.discount_type,i.net_amount,i.start_date,i.end_date')->get();
    }

    function getReferrerCommission($referr_id,$ss){
        $branch_id = $ss->branch_id;
        $row = DB::table('referals')->where('referrer_id',$referr_id)->where('is_paid',0)->selectRaw('commission,commission_type')->first();
        if(!$row) return $row=(object)['commission'=>0,'commission_type'=>'percentage'];
        return $row;
    }
}
