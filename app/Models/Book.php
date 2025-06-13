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
    $inputs = $res->values;
    $d = (object)$inputs;

    $id = DBX::saveData($ss, 'books', ['id' => $id], $inputs, [], 1);
    if ($id > 0) {
        return DV::depends($id, ['books' => $inputs, 'id' => $id]);
    }

    return DV::error('Error saving book');
}

 public function deleteBook($id)
    {
        $id = $id ?? $this->id;
       
        $deleted = DB::table('books')->where('id', $id)->delete();
        return DV::depends($deleted, "deleted", 'Error deleting book');
        
    }

    public function getListBook($arr, $ss = null)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;
        $current_page = $d->current_page ?? 1;
        $per_page = $d ->per_page ?? 10;
        if(!is_numeric( $current_page)) {
            $current_page = 1;
        }
        $skip_rows = ($current_page -  1)* $per_page;
        $search_value = $d->search_value ?? null;

        $str_search = '1=1';

        if ($search_value){
            $skip_rows = 0;
            $search_value = escape_like_str($search_value);
            $str_search = "(b.book_title LIKE '%" . $search_value . "%' OR b.description LIKE '%" . $search_value . "%')"; 

        }
        $update_date = DBX::formatDate("b.updated_at", 'updated_date');
        $query = DB::table('books as b')
            ->whereRaw($str_search)
            ->selectRaw('b.id,b.code, b.description, b.book_title,'.$update_date.',b.update_user')
            ->orderBy('b.id', 'asc');

        $clone_query = clone $query;
        $count = $clone_query->count('b.id');
        $rows = $query->skip ($skip_rows)->take($per_page)->get();
        return new LengthAwarePaginator($rows, $count,$per_page, $current_page);        
    }
    
    public function DetailsBook($id, $ss = null)
    {
        $id = $id ?? $this->id;
        $ss = $ss ?? $this->userInfo;

        $rows = DB::table('books')
            ->where('id', $id)
            ->selectRaw('id,code,book_title,description')->first();
        return $rows;
        
    }
    public function getFormOptions($id,$ss)
    {
        $books_id = $ss->subs_id;
        $books = self::DetailsBook($id) ?? null;

        return (object) [
            'books' => $books,
            
        ];

    }
}
