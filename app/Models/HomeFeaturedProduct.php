<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeFeaturedProduct extends Model
{
    protected $fillable = [
        'turn14_product_id', 'section', 'category_tab', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Turn14Product::class, 'turn14_product_id', 'id');
    }
}
