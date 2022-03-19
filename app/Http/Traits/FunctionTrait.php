<?php

namespace App\Http\Traits;

trait FunctionTrait {
    public function pen($num = ""){
        return $num * 22041992;
    }

    public function pde($num = ""){
        return $num / 22041992;
    }
}