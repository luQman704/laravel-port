<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeDeal extends Model
{
    protected $fillable = [
        'turn14_product_id', 'deal_price_incl', 'deal_price_excl',
        'ends_at', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'ends_at'   => 'datetime',
    ];

    public function product()
    {
        // Turn14Product PK is id_turn14_product (int), but 'id' is the Turn14 string item ID
        // home_deals.turn14_product_id stores the string id value
        return $this->belongsTo(Turn14Product::class, 'turn14_product_id', 'id');
    }
}
