<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    use HasFactory;
    protected $fillable = ['id', 'store_id'];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'id', 'id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
