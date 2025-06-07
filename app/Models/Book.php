<?php

namespace App\Models;

use DV;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use DBX;

class Book //extends Model
{
    protected $id = null;
    protected $userInfo = null;

    public function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }
    public function save($arr, $id = null)
{
    $id = $id ?? $this->id;
    $ss = $this->userInfo;
    $branch_id = $ss->branch_id;

    $v_rule = [
        'book_title' => '1|string|0-150',
        'description' => '0|string|0-30',
        'code' => '1|number',
    ];

    $res = DBX::validateObject($arr, $v_rule, true, [], $ss->lang, false);
    if ($res->error) {
        return DV::error($res->error);
    }

    $inputs = $res->values;
    $d = (object)$inputs;

        if(!$id){
            $exist = DB::table('books')
                ->where('book_title', $arr['book_title'])
                ->exists();
            if ($exist) {
                return DV::error('Book already exist');
            }
        }
    $id = DBX::saveData($ss, 'books', ['id' => $id], $inputs, [], 1);
    if ($id > 0) {
        return DV::depends($id, ['books' => $inputs, 'id' => $id]);
    }

    return DV::error('Error saving book');
}

 public function delete($id)
    {
        $id = $id ?? $this->id;
       
        $deleted = DB::table('books')->where('id', $id)->delete();
        return DV::depends($deleted, "deleted", 'Error deleting holiday');
        
    }
    
}
