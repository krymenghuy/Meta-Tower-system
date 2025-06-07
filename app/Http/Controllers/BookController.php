<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use JDV;
use XAuthService;

class BookController extends Controller
{
     public function saveBook(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? $req->book_id;
        $book = new Book($id, $ss);
        $res = $book->save($req->all());
        return JDV::raw($res);
    }
    public function delete(Request $req)
    {
        $ss = XAuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        $id = $req->id ?? null;
        $book = new Book();
        $res = $book->delete($id);
        return JDV::raw($res);
    }
}
