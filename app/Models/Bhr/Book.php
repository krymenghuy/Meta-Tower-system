<?php

namespace App\Models\Bhr;

use App\Models\DV;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Book
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr,$ss = null){
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'type' => '1|string|0-100',
            'price' => '1|number',
            'qty' => '1|number',
        ];
        $checkUnque = ["$branch_id|books|name|id=id|text=Book already exists."];
        $res = validateObject($arr, $v_rule, true, [], $ss->lang, false, $checkUnque);
        if ($res->error) {
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;

        $inputs['total'] = $inputs['price'] * $inputs['qty'];

        $id = saveData($ss,'books', ['id' => $id], $inputs, [], 1);
        if ($id > 0) {
            return DV::depends(1, ['sender' => $inputs, 'id' => $id]);
        }

        return DV::error('Error saving book');
    }

    function getBooks($ss ){
        return DB::table('books')->selectRaw('id,name,type,price,qty,total')->get();

    }

    function getBookListPaginate($arr, $ss){


        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = isset($d->current_page) ? $d->current_page : 1;
        $per_page = isset($d->per_page) ? $d->per_page : 10;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $status = isset($d->status_code) ? $d->status_code : 'active';

        $search_value = isset($d->search_value) ? $d->search_value : null;

        $str_status = '3=3'; // Active, Inactive
        $str_search = '2=2';


        if ($search_value) {
            $str_search = "name like '%" . $search_value . "%'" . " or type like '%" . $search_value . "%'";
        }


        $query = DB::table('books as b')
            ->selectRaw('id,name,type,price,qty,total')
            ->whereRaw($str_status)
            ->whereRaw($str_search)
            ->orderBy('id', 'asc')
            ->skip($skip_rows)
            ->take($per_page)
            ->get();
        $count = DB::table('books as b')
            ->selectRaw('id,name,type,price,qty,total')
            ->whereRaw($str_status)
            ->whereRaw($str_search)
            ->count();
        return (new LengthAwarePaginator($query, $count, $per_page, $current_page));

    }

    function getDetails($id, $ss){

        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('books as b')
            ->selectRaw('id,name,type,price,qty,total')
            ->where('id', $id)
            ->first();
        if (!$query) {
            return DV::error('Book not found');
        }
        // Return the query result
        return $query;
    }

    function deleteBook($id, $ss){

        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Assuming $ss contains branch_id or other necessary info
        $branch_id = $ss->branch_id;

        // Build and execute the query
        $query = DB::table('books')
            ->where('id', $id)
            ->delete();
        if (!$query) {
            return DV::error('Book not found');
        }
        // Return the query result
        return DV::depends(1, ['id' => $id]);
    }

}
