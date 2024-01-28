<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'image', 'price', 'disabled', 'store_id'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
