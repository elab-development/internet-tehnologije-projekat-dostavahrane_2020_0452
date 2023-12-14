<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['status', 'lat', 'lng', 'address', 'rating', 'client_id', 'driver_id', 'driver_status', 'store_id', 'prep_time'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
    public function client()
    {
        return $this->belongsTo(User::class, 'client_id', 'id');
    }
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
