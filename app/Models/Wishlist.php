<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    public $timestamps = false;

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'turn14_product_id',
    ];
}
