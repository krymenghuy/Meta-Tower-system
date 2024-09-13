<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use App\Models\Bhr\Book;
use App\Models\JDV;
use App\Services\Umt\AuthService;
use Illuminate\Http\Request;

class BookController extends Controller
{
    protected $bookModel;

    public function __construct(Book $book)
    {
        $this->bookModel = $book;
    }

    public function saveBook(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        $id = $req->book_id ?? $req->id;
        $book = new Book($id, $ss);
        $res = $book->save($req->all());
        return JDV::raw($res);
    }

    public function getBookList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bookModel->getBooks( $ss));
    }

    public function getBookListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bookModel->getBookListPaginate($req->all(), $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Assuming id is passed in the request (POST body), access it like this
        if (!isset($req->id) || !is_numeric($req->id)) {
            return JDV::error('Invalid ID');
        }
        return JDV::result($this->bookModel->getDetails($req->id, $ss));
    }

    public function deleteBook(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->bookModel->deleteBook($req->id, $ss));
    }
}
