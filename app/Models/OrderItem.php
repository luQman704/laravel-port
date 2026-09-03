<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    public $timestamps = false;
    protected $guarded = ['id'];
    protected $casts = [
        'unit_price_excl' => 'float',
        'unit_price_incl' => 'float',
        'line_total_incl' => 'float',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
