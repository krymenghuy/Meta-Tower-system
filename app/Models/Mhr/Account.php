<?php

namespace App\Models\Mhr;
use DV;
use DBX;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Vsd\Vsloquent\VSModel;
use Vsd\Money\Models\VSMoney;
use App\Models\CompanyProfile;
use App\Models\Prm\GeneralSettings;


class Account extends VSModel
{
    protected $userInfo = null;

    protected static $fk_tables = [
        'transactions' => 'account_id',
    ];

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $id = null, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;
        //$branch_id = $ss->branch_id;
        $base_currency =  VSMoney::$base_currency;
        $v_rule = [
            'emp_id' => '0|number|exists=employees.id',
            'account_number' => '0|string|0-30',
            'balance' => '0|number|default=0',
            'currency_code' => "1|choice|$base_currency|default=" . $base_currency,
            'account_type' => '1|choice|Payroll,Wallet',
        ];
        $res = DBX::validateObject($arr, $v_rule, true, ['balance' => ['.'], 'account_number' => ['-']], $ss->lang);
        if ($res->error) return DV::error($res->error);

        $inputs = $res->values;
        $d = (object)$inputs;
        $account_type = $d->account_type;
        $emp_id = $d->emp_id;
        $emp = Employee::getProps($emp_id, 'id,code,name');
        // if(!$emp) return DV::error('Employee ID deos not exist');
        $inputs['balance'] = (float) str_replace(',', '', $inputs['balance']);

        $account_number = null;
        $created = !$id;
        if ($created) {
            if (strtolower($account_type) === 'payroll') {
                $account_number = $emp->code . '-P';
            } elseif (strtolower($account_type) === 'wallet') {
                $account_number = $emp->code . '-W';
            } else {
                $account_number = $emp->code;
            }
            if (self::employeeHasAccount($emp_id, $account_type)) {
                $emp = Employee::getProps($emp_id, 'name');
                return DV::error("Employee ?? already has ?? account!::$emp->name; $account_type");
            }
            $inputs['account_number'] = $account_number;
        } else {
            unset($inputs['balance'], $inputs['emp_id'], $inputs['currency_code'], $inputs['account_number']);
        }
        if (self::accountNumberExists($account_number, $id)) {
            return DV::error('Account number ?? already exists::' . $account_number);
        }

        $id = DBX::saveData($ss, 'accounts', ['id' => $id], $inputs, [], 1);
        return DV::depends($id, ['id' => $id], 'Failed to save account information');
    }

    static function accountNumberExists($account_number, $account_type, $id = null)
    {
        $str_id = $id > 0 ? 'id <> ' . $id : '1=1';

        $exists = DB::table('accounts')
            ->where('account_number', $account_number)->whereNotNull('account_number')
            ->whereRaw($str_id)
            ->exists();

        return $exists;
    }

    static function employeeHasAccount($emp_id, $account_type)
    {
        $row = DB::table('accounts')->where('emp_id', $emp_id)->where('account_type', $account_type)->selectRaw('id')->first();
        return $row ? true : false;
    }

    //$account_type = {'Payroll','Wallet'}
    function bulkCreateAccounts($account_type, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $bin_subs_id = hex2bin($ss->subs_id);
        if (!in_array(strtolower($account_type), ['payroll', 'wallet'])) return DV::error('The account type must be Payroll or Wallet');
        $emps = DB::table('employees as e')
            ->where('e.subs_id', $bin_subs_id)
            ->select('e.id', 'e.code', 'e.name')
            ->get();
        if ($emps->isEmpty()) return DV::error('It looks like all employees already have a ?? account!::' . $account_type);

        $success_count = 0;
        $emp_count = 0;
        $lowerAccountType = strtolower($account_type);
        foreach ($emps as $emp) {
            $inputs = [
                'emp_id' => $emp->id,
                'account_number' => $emp->code . ($lowerAccountType === 'payroll' ? '-P' : '-W'),
                'balance' => 0.00,
                'currency_code' => VSMoney::$national_currency,
                'account_type' => $account_type
            ];

            if (!self::employeeHasAccount($emp->id, $account_type)) {
                $acc_id = DBX::saveData($ss, 'accounts', ['id' => null], $inputs, [], 1, false);
                if ($acc_id) $success_count++;
            }
            // else{
            //      //account number based on Employee ID already exist
            // }
            $emp_count++;
        }
        return DV::depends(1, ['success_count' => $success_count, 'emp_count' => $emp_count], 'Failed to bulk create accounts');
    }

    public function getList($arr, $ss)
    {
        $d = (object) $arr;

        $is_master_account = $d->is_master_account ?? 0;
        $branch_id       = $d->branch_id ?? null;
        $department_id   = $d->department_id ?? null;
        $account_type    = $d->account_type ?? 'Standard';
        $search_value    = $d->search_value ?? null;

        $current_page = $d->current_page ?? 1;
        $per_page     = $d->per_page ?? 10;
        $skip_rows    = ($current_page - 1) * $per_page;

        $balance_date = DBX::formatDate('a.last_balance_date', 'last_balance_date');

        if ($is_master_account) {

            $query = DB::table('accounts as a')
                ->selectRaw("
                a.id,
                a.emp_id,
                'Master Account' AS emp_name,
                NULL AS position,
                'Payroll' AS account_type,
                a.account_number,
                a.balance,
                a.currency_code,
                {$balance_date},
                NULL AS emp_photo
            ")
                ->where('a.id', 1);

        } else {

            $query = DB::table('accounts as a')
                ->join('employees as e', 'e.id', '=', 'a.emp_id')
                ->leftJoin('positions as p', 'p.id', '=', 'e.position_id')
                ->selectRaw("
                a.id,
                a.emp_id,
                e.name AS emp_name,
                p.name AS position,
                a.account_type,
                a.account_number,
                a.balance,
                a.currency_code,
                {$balance_date},
                e.photo_file_name AS emp_photo
            ")
                ->where('a.account_type', $account_type);

            // Search
            if ($search_value !== '') {

                $search_value = escape_like_str($search_value);

                $query->where(function ($q) use ($search_value) {
                    $q->where('e.name', 'LIKE', "%{$search_value}%")
                        ->orWhere('a.account_number', 'LIKE', "%{$search_value}%");
                });

            } else {

                if (!empty($branch_id)) {
                    $query->where('e.branch_id', $branch_id);
                }
                
                if (!empty($department_id)) {
                    $query->where('p.department_id', $department_id);
                }
            }
        }

        $count = $query->count('a.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            if ($is_master_account == 1) {
                //$subs_id = $row->subs_id ? bin2hex($row->subs_id) : null;
                $c_id = getCurrentSubs(true)->subscriber_id;
                $subs_id = $ss->subs_id;
                $row->image_url = CompanyProfile::logoUrl((object)['subscriber_id' => $c_id, 'subs_id' => $subs_id]);
                unset($row->emp_photo);
            } else {
                $row->image_url = $row->emp_photo ? Employee::profilePicture($row->emp_id) : '';
                unset($row->emp_photo);
            }
        }
        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    function getDetails($id)
    {
        $row = null;
        if ($id == 1) {
            return $row = DB::table('accounts as a')
                ->selectRaw(
                    'a.id,
               a.emp_id,
               \'Master Account\' as account_name,
               \'Payroll\' as account_type,
               a.account_number,
               a.currency_code,
               a.balance'
                )
                ->where('a.id', 1)->first();
        } else {
            $row = DB::table('accounts as a')
                ->join('employees as e', 'e.id', '=', 'a.emp_id')
                //->join('positions as pos', 'pos.id', '=', 'e.position_id')
                ->selectRaw(
                    'a.id,
               a.emp_id,
               e.name as account_name,
               a.account_type,
               a.account_number,
               a.currency_code,
               a.balance'
                )->where('a.id', $id)->first();
        }

        if ($row) {
            if ($id > 1) $row->image_url = Employee::profilePicture($row->emp_id);
            else $row->image_url = '';
            // $otherAccount = DB::table('accounts as a')
            //     ->select('id', 'account_type', 'account_number', 'currency_code', 'balance')
            //     ->where('a.emp_id', $row->emp_id)
            //     ->where('a.id', '<>', $id)
            //     ->first();

            // if ($otherAccount) {
            //     $row->w_id = $otherAccount->id;
            //     $row->w_account_type = $otherAccount->account_type;
            //     $row->w_account_number = $otherAccount->account_number;
            //     $row->w_currency_code = $otherAccount->currency_code;
            //     $row->w_balance = $otherAccount->balance;
            // }
            return $row;
        }

        return $row;
    }


    function delete($id = null)
    {
        $id = $id ?? $this->id;
        if ($id == 1) {
            return DV::error('cannot_delete_master_account');
        }
        foreach (self::$fk_tables as $table => $field) {
            DB::table($table)->where($field, $id)->delete();
        }
        $x = DB::table('accounts')->where('id', $id)->delete();
        return DV::depends($x, null, 'failed_delete_account');
    }

    function getFormOptions($id, $ss)
    {
       
        $account = $id ? self::getDetails($id) : null;
        return (object) [
            'account' => $account,
            'departments' => GeneralSettings::options_department($ss),
            'currency_codes' => VSMoney::options_currency($ss),
            'employees' => GeneralSettings::options_employee_with_account($ss),
            'accounts' => [
                ['id' => 1, 'name' => 'Master Account'],
                ['id' => 0, 'name' => 'Staff Account'],
            ],
        ];
    }

    function confirmTransfer($arr, $ss)
    {
        $d = (object) $arr;

        $from_account_id = DB::table('accounts')->where('account_type', $d->account_type)->where('account_number', $d->account_number)->value('id');
        $emp_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('emp_id');
        $emp_name = DB::table('employees')->where('id', $emp_id)->value('name');
        $to_account_id = DB::table('accounts')->where('account_type', $d->to_account_type)->where('account_number', $d->to_account_number)->value('id');

        if (!$from_account_id || !$to_account_id) {
            return DV::error('Account not found');
        }

        if ($d->balance < $d->amount) {
            return DV::error('Insufficient balance');
        }
        return DV::depends(1, [
            'emp_name' => $emp_name,
            'from_account_type' => $d->account_type,
            'from_account_number' => $d->account_number,
            'to_account_type' => $d->to_account_type,
            'to_account_number' => $d->to_account_number,
            'amount' => $d->amount
        ]);
    }

    static function getProps($id, $cols = 'id,account_number,currency_code,balance')
    {
        return DB::table('accounts')->where('id', $id)->selectRaw($cols)->first();
    }

    static function getMasterAccount()
    {
        return DB::table('accounts as a')->where('id', 1)->selectRaw('a.id, \'Company accounts\' as name, a.balance, a.currency_code, a.account_number')->first();
    }

    //transfer money out $arr = [$to_account, $from_account,$amount , $currency,exchange_rate, $remarks]
    function transfer($arr, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $from_account_id = $from_account_id ?? $this->id;
        $d = (object) $arr;
        $from_account_id = $d->from_account_id ?? null;
        $to_account_id = $d->to_account_id ?? null;
        $from_account = (object)($d->from_account ?? null);
        $to_account = (object)($d->to_account ?? null);
        $exchange_rate = $d->exchange_rate ?? 1;
        $payroll_id = $d->payroll_id ?? null;
        $disburse_id = $d->disburse_id ?? null;
        if (!$from_account_id) {
            //check if know only account number / don't know account id
            if ($from_account->account_number == 1) {
                $from_account = self::getMasterAccount();
            } else {
                $from_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('account_number', $from_account->account_number)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            }
            if (!$from_account) return DV::error('Source account id not found!');
            $from_account_id = $from_account->id;
        } else {
            if ($from_account_id == 1) {
                $from_account = self::getMasterAccount();
            } else {
                $from_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('a.id', $from_account_id)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            }
            if (!$from_account) return DV::error('Source account id not found!');
        }
        if (!$to_account_id) {
            if ($to_account->account_number == 1) {
                $to_account = self::getMasterAccount();
            } else {
                $to_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('account_number', $to_account->account_number)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            }
            if (!$to_account) return DV::error('Destination account id not found!');
            $to_account_id = $to_account->id;
        } else {
            if ($to_account_id == 1) {
                $to_account = self::getMasterAccount();
            } else {
                $to_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('a.id', $to_account_id)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            }
            if (!$to_account) return DV::error('Destination account id not found!');
        }
        if (!$from_account_id && !$to_account_id) {
            return DV::error('Both accounts do not exist!');
        }
        $converted_amount = $d->amount;
        if ($from_account->currency_code != $to_account->currency_code) {
            $converted_amount = VSMoney::convert($ss, $d->amount, $from_account->currency_code, $to_account->currency_code, $exchange_rate);
        }
        if ($from_account->balance < $d->amount) {
            return DV::error('Insufficient balance');
        }
        $remarks = null;
        if ($payroll_id) {
            $remarks = DB::table('payrolls')->where('id', $payroll_id)->selectRaw('name')->first()->name;
        }
        $inputs = ['amount' => $d->amount, 'currency_code' => $from_account->currency_code, 'exchange_rate' => $exchange_rate, 'remarks' => $remarks, 'trx_type' => 3, 'status' => 'out', 'to_account_id' => $to_account->id, 'payroll_id' => $payroll_id, 'disburse_id' => $disburse_id];
        self::createTransaction($inputs, true, $from_account_id, $ss);
        $inputs = ['amount' => $converted_amount, 'currency_code' => $to_account->currency_code, 'exchange_rate' => $exchange_rate, 'remarks' => $remarks, 'trx_type' => 3, 'status' => 'in', 'from_account_id' => $from_account->id, 'payroll_id' => $payroll_id, 'disburse_id' => $disburse_id];
        self::createTransaction($inputs, true, $to_account_id, $ss);
        return DV::depends(1,(object)[
            'from_account_number' => $from_account->account_number,
            'to_account_number' => $to_account->account_number
        ]);
        //rollback amount when one of the transactions fails
    }

    function transferTo($arr, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $v_rule = [
            'amount' => '1|positive',
            'payroll_id' => '0|number',
            'exchange_rate' => '0|number|default=1',
            'remarks' => '0|string|250',
            'to_account_id' => '0|number|exists=accounts.id',
            'to_account' => '0|array',
            'disburse_id' => '0|string|0-128'
        ];

        $res = DBX::validateObject($arr, $v_rule, false, ['remarks' => ['-'], 'account_number' => ['-']], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $inputs = $res->values;
        $d = (object)$inputs;
        $to_account = null;
        if (!$d->to_account_id) {
            $to_account = (object)$d->to_account;
            if ($to_account->account_number == 1) {
                $to_account = self::getMasterAccount();
            } else {
                $to_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('account_number', $to_account->account_number)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            }
            // $to_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('account_number', $to_account->account_number)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            if (!$to_account) return DV::error('Destination account id not found!');
            $d->to_account_id = $to_account->id;
        } else {
            if ($d->to_account_id == 1) {
                $to_account = self::getMasterAccount();
            } else {
                $to_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('a.id', $d->to_account_id)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            }
            // $to_account = DB::table('accounts as a')->join('employees as emp', 'emp.id', '=', 'a.emp_id')->where('a.id', $d->to_account_id)->selectRaw('a.id, emp.name, a.balance, a.currency_code, a.account_number')->first();
            if (!$to_account) return DV::error('Destination account id not found!');
        }
        $inputs['to_account_id'] = $d->to_account_id;
        $inputs['from_account_id'] = $id;
        return $this->transfer($inputs, $ss);
    }

    function createTransaction($arr, $update_balance = true, $id = null, $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $v_rule = [
            'amount' => '1|positive',
            'payroll_id' => '0|number',
            'exchange_rate' => '0|number|default=1',
            'remarks' => '0|string|250',
            'trx_type' => '1|choice|1,2,3',
            'status' => '0|choice|in,out',
            'to_account_id' => '0|number|exists=accounts.id',
            'from_account_id' => '0|number|exists=accounts.id',
            'disburse_id' => '0|string|0-128',
        ];

        $res = DBX::validateObject($arr, $v_rule, true, ['remarks' => ['-'], 'account_number' => ['-']], $ss->lang);
        if ($res->error) return DV::error($res->error);
        $from_account = null;
        $to_account = null;
        $inputs = $res->values;
        $d = (object) $inputs;
        unset($inputs['exchange_rate']);
        $inputs['account_id'] = $id;
        $this_account = self::getProps($id, 'id,balance, currency_code');
        // if (!$this_account) {
        //     return DV::error('Source account information does not exist');
        // }
        if ($d->trx_type == 1) {
            $inputs['to_account_id'] = $id;
        } else if ($d->trx_type == 2) {
            $inputs['from_account_id'] = $id;
        } else {
            if ($d->status === 'out') {
                $inputs['from_account_id'] = $id;
                $to_account = self::getProps($d->to_account_id, 'id, currency_code');
                $from_account = $this_account;
                if (!$to_account) {
                    return DV::error('In case of transfer out, you must spectify destination account');
                }
                if ($to_account->id === $id) {
                    return DV::error('The source and desintation accounts cannot be the same!');
                }
            } else if ($d->status === 'in') {
                $inputs['to_account_id'] = $id;
                $to_account = $this_account;
                $from_account = self::getProps($d->from_account_id, 'id,balance, currency_code');
                if (!$from_account) {
                    return DV::error('In case of transfer in, you must spectify source account');
                }
                if ($from_account->id === $id) {
                    return DV::error('The source and desintation accounts cannot be the same!');
                }
            } else return DV::error('Invalid status. NOTE: it must be in or out');
        }
        $inputs['currency_code'] = $this_account->currency_code;
        $trx_id = DBX::saveData($ss, 'transactions', ['id' => null], $inputs, [], 1, false, 'binary');
        if ($trx_id) {
            if ($update_balance) {
                $x = Account::updateBalance($d->amount, $d->status, null, $id, $ss);
            }
            return DV::depends(1, ['transaction' => $inputs, 'trx_id' => bin2hex($trx_id)]);
        }
        return DV::error('Error saving transaction');
    }

    function getAccountInfo1($arr, $ss)
    {
        $d = (object) $arr;
        $account_type = DB::table('accounts')->where('account_number', $d->account_number)->value('account_type');
        $emp_id = DB::table('accounts')->where('account_number', $d->account_number)->value('emp_id');
        $emp_name = DB::table('employees')->where('id', $emp_id)->value('name');
        $currency_code = DB::table('accounts')->where('account_number', $d->account_number)->value('currency_code');
        return DV::depends(1, [
            'account_type' => $account_type,
            'emp_name' => $emp_name,
            'currency_code' => $currency_code

        ]);
    }
    function getAccountInfo($arr, $ss)
    {
        $d = (object) $arr;

        $account = DB::table('accounts as a')
            ->join('employees as e', 'e.id', '=', 'a.emp_id')
            ->where('a.account_number', $d->account_number)
            ->select(
                'a.account_type',
                'a.currency_code',
                'e.name as emp_name'
            )
            ->first();

        return DV::depends(1, [
            'account_type'  => $account->account_type ?? null,
            'emp_name'      => $account->emp_name ?? null,
            'currency_code' => $account->currency_code ?? null,
        ]);
    }

    // Assuming that the $amount is in the same currency as the account's currency
    static function updateBalance($amount, $status, $trx_id, $account_id, $ss)
    {
        if (!$account_id) {
            return 'Invalid account id';
        }
        $amount = $amount ?? 0;
        if (!$amount) {
            return null;
        }
        if ($trx_id) {
            $trx = DB::table('transactions as t')->where('id', $trx_id)->where('status', $status)->selectRaw('amount')->first();
            if (!$trx)
                return 'Transaction is not found!';
            if (abs($trx->amount) != abs($amount)) {
                return 'The amount provided is not correct!';
            }
        }

        $amount = abs($amount);
        if ($status === 'out') $amount = -$amount;
        $nowTime = getNowTime();
        $x = DB::statement(DB::raw("Update accounts set balance = balance + ($amount), last_balance_date = '$nowTime' WHERE id = $account_id"));
        return $x;
    }

    function withdraw($amount, $currency_code, $remarks = null, $id = null, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $inputs = [
            'amount' => $amount,
            'currency' => $currency_code,
            'trx_type' => 2,
            'status' => 'out',
            'account_id' => $id,
            'from_account_id' => $id,
            'remarks' => $remarks
        ];
        $transaction = new Account($id, $ss);
        $res = $transaction->createTransaction($inputs, $ss);
        return $res;
    }

    function deposit($amount,$balance, $currency_code, $account_number, $account_name, $remarks, $id = null, $ss)
    {
        $ss = $ss ?? $this->userInfo;
        $id = $id ?? $this->id;
        $inputs = [
            'amount' => $amount,
            'currency_code' => $currency_code,
            'trx_type' => 1,
            'status' => 'in',
            'account_id' => $id,
            'to_account_id' => $id,
            'balance' => $balance,
            'remarks' => $remarks,
            'account_number' => $account_number,
            'account_name' => $account_name,
        ];
        $transaction = new Account($id, $ss);
        unset($res->currency_code);
        $res = $transaction->createTransaction($inputs, $ss);
        return $res;
    }

    function printTransaction($arr, $ss)
    {
        $d = (object) $arr;
        //$branch_id = $ss->branch_id;
        $last_balance_date = DBX::formatDate('a.last_balance_date', 'last_balance_date');
        $date = DBX::formatDate('t.created_at', 'created_at');
        $str_emp_id = '1=1';
        $emp_id = $d->emp_id ?? null;

        if ($emp_id) {
            $str_emp_id = 'e.id=' . $emp_id;
        }

        $account_id = $d->account_id ?? null;
        $str_account_id = '2=2';

        if ($account_id) {
            $str_account_id = 'a.id=' . $account_id;
        }

        if ($account_id == 1) {
            $query = DB::table('accounts as a')
                ->selectRaw('a.id as account_id, a.account_number,a.balance, ' . $last_balance_date . ',a.currency_code')
                ->first();
            $query->account_type = 'Payroll';
            $query->emp_name = 'Master Account';

            if ($query) {
                $query = [$query];
            } else {
                $query = [];
            }

            foreach ($query as $row) {
                $threeMonthsAgo = now()->subMonths(3);
                $row->trx = DB::table('transactions as t')
                    ->leftJoin('accounts as fa', 'fa.id', '=', 't.from_account_id')
                    ->leftJoin('accounts as ta', 'ta.id', '=', 't.to_account_id')
                    ->where('t.account_id', $row->account_id)
                    ->where('t.created_at', '>=', $threeMonthsAgo)
                    ->selectRaw('
                        t.trx_type,
                        t.from_account_id,
                        t.to_account_id,
                        fa.account_number as from_account_number,
                        ta.account_number as to_account_number,
                        t.amount,
                        ' . $date . ',
                        t.status,
                        t.remarks
                    ')
                    ->orderBy('t.created_at', 'desc')
                    ->get();
                $c_id = getCurrentSubs(true)->subscriber_id;
                $subs_id = $ss->subs_id;
                $row->image_url = CompanyProfile::logoUrl((object)['subscriber_id' => $c_id, 'subs_id' => $subs_id]);
                unset($row->emp_photo);
            }

            return [
                'status' => 'OK',
                'status_code' => 200,
                'data' => $query,
            ];
        } else {
            $query = DB::table('accounts as a')
                ->join('employees as e', 'e.id', '=', 'a.emp_id')
                ->whereRaw($str_emp_id)
                ->whereRaw($str_account_id)
                ->selectRaw('
                a.id as account_id,
                a.account_number,
                a.account_type,
                a.currency_code,
                a.balance,
                ' . $last_balance_date . ',
                e.id as emp_id,
                e.name as emp_name,
                e.photo_file_name as emp_photo
            ')
                ->orderBy('e.id');

            $rows = $query->get();

            foreach ($rows as $row) {
                $threeMonthsAgo = now()->subMonths(3);
                $row->trx = DB::table('transactions as t')
                    ->leftJoin('accounts as fa', 'fa.id', '=', 't.from_account_id')
                    ->leftJoin('accounts as ta', 'ta.id', '=', 't.to_account_id')
                    ->where('t.account_id', $row->account_id)
                    ->where('t.created_at', '>=', $threeMonthsAgo)
                    ->selectRaw('
                        t.trx_type,
                        t.from_account_id,
                        t.to_account_id,
                        fa.account_number as from_account_number,
                        ta.account_number as to_account_number,
                        t.amount,
                        ' . $date . ',
                        t.status,
                        t.remarks
                    ')
                    ->orderBy('t.created_at', 'desc')
                    ->get();

                $row->image_url = $row->emp_photo
                    ? Employee::profilePicture($row->emp_id)
                    : '';

                unset($row->emp_photo);
            }
            return [
                'status' => 'OK',
                'status_code' => 200,
                'data' => $rows,
            ];
        }
    }

    function getFormOptions_deposit($id, $ss)
    {
        $target_account = null;
        if ($id) {
            $acc = new Account($id, $ss);
            $target_account = $acc->getDetails($id);
        }
        return (object)[
            'account' => $target_account
        ];
    }
}
