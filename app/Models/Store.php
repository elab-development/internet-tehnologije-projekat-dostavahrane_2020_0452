<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;
    protected $fillable = ['lat', 'lng', 'name', 'address'];

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
