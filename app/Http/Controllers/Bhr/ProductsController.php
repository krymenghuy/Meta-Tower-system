<?php

namespace App\Http\Controllers\Bhr;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bhr\Products;
use App\Models\JDV;
use App\Services\Umt\AuthService;

class ProductsController extends Controller
{
    protected $productModel;
    public function __construct(Products $productModel)
    {
        $this->productModel = $productModel;
    }
    public function saveProduct(Request $req)
    {
        $ss = AuthService::verifyAuth($req,-1);
        if($ss->status_code !==200) return JDV::raw($ss);

         $id = $req->product_id ?? $req->id;
         $product = new Products($id,$ss);
         $res = $product->save($req->all());
         return JDV::raw($res);
    }

    public function getProductList(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return JDV::result($this->productModel->getProducts( $ss));
    }

    public function getProductListPaginate(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        // Assuming 'perPage' is the second argument
        // $perPage = $req->input('perPage', 10);  // Default to 10 if not provided
        return JDV::result($this->productModel->getProductsPaginate( $req->all(),$ss));
    }

    public function deleteProduct(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }


        return JDV::result($this->productModel->delete($req->id, $ss));
    }

    public function getDetails(Request $req)
    {
        $ss = AuthService::verifyAuth($req, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }

        return JDV::result($this->productModel->getDetails($req->id, $ss));

    }
}
