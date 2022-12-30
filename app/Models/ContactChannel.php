<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactChannel extends Model
{
    use HasFactory;

    protected $table = 'contact_channels';
    protected $guarded = ['id'];
    protected $fillable = [];
     
    protected $primaryKey = 'id';
    public $incrementing = true;
    //protected $keyType = 'string';
    public $timestamps = true;
}
