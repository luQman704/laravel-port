<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14ProductOverride extends Model
{
    protected $fillable = [
        'turn14_product_id', 'product_name', 'weight', 'length', 'width', 'height',
        'category', 'subcategory', 'notes',
    ];
}
