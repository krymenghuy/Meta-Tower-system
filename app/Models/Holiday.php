<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class Holiday //extends Model
{
    // use HasFactory;
    protected $id = null,$ss = null;
    function __construct($id = null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }

    function save($arr=[],$id=null,$ss=null){
        // $
    }
}
