<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14Stock extends Model
{
    protected $table = 'new902_turn14_stock';
    protected $primaryKey = 'id_turn14_stock';
    public $timestamps = false;

    protected $casts = [
        'warehouse_stock' => 'array',
        'mfr_esd'         => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Turn14Product::class, 'turn14_product_id', 'id');
    }
}
