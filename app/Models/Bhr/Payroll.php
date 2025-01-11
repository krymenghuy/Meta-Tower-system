<?php

namespace App\Models\Bhr;

use App\Models\DV;
use Illuminate\Support\Facades\DB;
use App\Models\DBX;
use Illuminate\Pagination\LengthAwarePaginator;
use DateTime;

class Payroll
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    function save($arr = [],$id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        $v_rule = [
            'name' => '1|string',
            'month' => '1|number',
            'year' => '1|number',
            'start_date' => '1|date',
            'end_date' => '1|date',
            'p_number' => '1|number',
            'total' => '0|number',
            'authorized' => '1|number|default = 0',
            'disbursed' => '1|number|default = 0',
            'currency_code' => '0|number',
            'exchange_rate' => '0|number',

        ];

        $res = validateObject($arr, $v_rule, true, [], $ss->lang);
        if ($res->error) {
            return DV::error($res->error);
        }

        $inputs = $res->values;
        $inputs['start_date'] = convertDate($inputs['start_date']);
        $inputs['end_date'] = convertDate($inputs['end_date']);
        $d = (object)$inputs;



        $err = self::checkDuplicateName($d->name,$id);
        if($err) return DV::error($err);

        if(!$id)
        {
            $err = self::validatePayrollDates($d->start_date,$d->end_date,$id);
            if($err) return DV::error($err);

            $checkExist = DB::table('payrolls')->where('month',$inputs['month'])->where('year',$inputs['year'])->where('start_date',$inputs['start_date'])->where('end_date',$inputs['end_date'])->take(1)->value('id');
            if($checkExist){
                return DV::error($inputs['name'].' is already exist!');
            }
        }


        $id = saveData($ss, 'payrolls', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['payrolls' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving payroll');
    }

    static function validatePayrollDates($start_date, $end_date, $id) {
        $str_id = '1 = 1';
        if ($id) {
            $str_id = "p.id <> $id";
        }

        if (new DateTime($start_date) > new DateTime($end_date)) {
            return 'Start Date and End Date is not correct!';
        }

        $test = DB::table('payrolls as p')
            ->whereRaw("date(p.start_date) >= '$start_date'")
            ->whereRaw($str_id)
            ->select('id')
            ->first();
        if ($test) {
            return 'Start Date is not correct!';
        }

        $test = DB::table('payrolls as p')
            ->whereRaw("date(p.end_date) >= '$end_date'")
            ->whereRaw($str_id)
            ->select('id')
            ->first();
        if ($test) {
            return 'End Date is not correct!';
        }

        $start = new DateTime($start_date);
        $end = new DateTime($end_date);
        $interval = $start->diff($end);

        $test = $interval->days;
        if ($test > 31) {
            return 'The difference between Start Date and End Date cannot be longer than 31 days!';
        }

        return null;
    }


    static function checkDuplicateName($name,$id){
        $str_id = '1 = 1';
        if($id){
            $str_id = "p.id <> $id";
        }
        $test = DB::table('payrolls as p')->where('p.name',$name)->whereRaw($str_id)->select('id')->first();
        if($test)
            return 'Payrll name ?? already exist::'.$name;
            // return DV::error('Payrll name ?? ??already exist::'.$name .';'.$name);

        return null;
    }

    function getList($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;
        $search_authorized = $d->authorized ?? null;
        $search_disbursed = $d->disbursed ?? null;

        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');
        $updated_date = DBX::formatTime('p.update_date', 'update_date');


        $query = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.month, p.year,
                        ' . $start_date . ', ' . $end_date . ',
                         p.p_number,p.head_count ,p.total, p.authorized, p.disbursed,
                         p.currency_code, p.exchange_rate,'.$updated_date.',p.update_user')
            ->where('p.branch_id', $branch_id);

        if ($search_id) {
            $query->where('p.id', $search_id);
        }
        if ($search_value) {
            $query->where('p.name', 'like', '%' . $search_value . '%');
        }
        if ($search_authorized) {
            $query->where('p.authorized', $search_authorized);
        }
        if ($search_disbursed) {
            $query->where('p.disbursed', $search_disbursed);
        }

        $clone_query = clone $query;
        $count = $clone_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }


    function getDetails($id, $ss)
    {
        $start_date = DBX::formatDate('p.start_date', 'start_date');
        $end_date = DBX::formatDate('p.end_date', 'end_date');
        $row = DB::table('payrolls as p')
            ->selectRaw('p.id, p.name, p.month, p.year,' . $start_date . ', ' . $end_date . ', p.p_number, p.head_count,p.total, p.authorized, p.disbursed, p.currency_code, p.exchange_rate')
            ->where('p.branch_id', $ss->branch_id)
            ->where('p.id', $id)
            ->first();
        // $row->p_number = 1;
        return $row;
    }

    function getEndDate($ss)
    {
        $end_date = DBX::formatDate('p.end_date', 'end_date');
        $row = DB::table('payrolls as p')
            ->selectRaw($end_date)
            ->where('p.branch_id', $ss->branch_id)
            ->orderBy('id', 'DESC')
            ->first();

        return $row;
    }

    function delete($id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        if(!is_numeric($id)){
            return DV::error('Invalid ID');
        }

        $branch_id = $ss->branch_id;
        $query = DB::table('payrolls')
            ->where('id', $id)
            ->delete();
        if(!$query){
            return DV::error('Payroll not found');
        }
        return DV::depends($query, null, 'Error deleting payroll');
    }

    function getFormOptions($id, $ss)
    {
        $payroll = null;
        if ($id) {
            $payroll = self::getDetails($id, $ss);
        }
        return (object) [
            'sort_by' => [

                ['id' => 'p.name', 'name' => 'By Name'],
            ],

            'authorized' => [
                ['id' => '1', 'name' => 'Approved'],
                ['id' => '0', 'name' => 'Pending'],

            ],
            'disbursed' => [
                ['id' => '1', 'name' => 'Success'],
                ['id' => '0', 'name' => 'Pending'],

            ],
            'payrolls' => $payroll,
        ];

    }
    function updateAuthorize($id = null, $ss = null)
    {

            $branch_id = $ss->branch_id;
            $ss = $ss ?? $this->userInfo;
            $check = DB::table('payrolls')->where('id', $id)->value('authorized');
            if($check){
                return DV::error('Already Authorized');
            }

            $total = DB::table('payrolls as p')
                ->where('id', $id)
                ->selectRaw('total as amount')
                ->first();

            if (!$total || $total->amount <= 0) {
                return DV::error('Invalid Total');
            }

            $default_account = DB::table('accounts as a')
                ->where('a.id', 1)
                ->selectRaw('balance as amount, a.id as account_id')->first();
            if($total){

                $total->trx_type = "1";
                $total->account_id =1;
                $total->from_account_id = 1;
            }

            $total = Transaction::deposit((array)$total, $ss)->data;
            $new_balance = $total['transaction']['amount'] + $default_account->amount;
            $query = DB::table('accounts')
            ->where('id', 1)->update(['balance'=> $new_balance, 'trx_id' => hex2bin($total['trx_id'])]);

            $x = DB::table('payrolls')->where('id', $id)->update([
                'authorized' => 1,
                'update_user'=>$ss->full_name,
                'update_date'=>getNowTime(),
                'update_uid'=>$ss->user_id
            ]);
            return DV::depends($x, ['Payroll  authorize', 'updated']);

    }
    function updateDisburse($id = null, $ss = null)
    {

        $check = DB::table('payrolls')->where('id', $id)->value('authorized');
        if(!$check){
            return DV::error('Not Authorized');
        }
        $ss = $ss ? $ss : $this->userInfo;
        $x = DB::table('payrolls')->where('id', $id)->update([
            'disbursed' => 1,
            'update_user'=>$ss->full_name,
            'update_date'=>getNowTime(),
            'update_uid'=>$ss->user_id
        ]);
        return DV::depends($x, ['Payroll  disbursed', 'updated']);
    }

}
