<?php

namespace App\Models\Dms;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SenderType extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'branch_id', 'name'];
    protected $table = 'sender_type';

    public function umBranch() {
        return $this->belongsTo(UmBranch::class);
    }

    public function order() {
        return $this->hasMany(Order::class);
    }

    public function sender() {
        return $this->hasMany(Sender::class);
    }
}
