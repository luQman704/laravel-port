<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14WeightRange extends Model
{
    protected $table = 'new902_turn14_weight_range';
    protected $primaryKey = 'id_turn14_weight_range';
    public $timestamps = false;

    protected $casts = [
        'from'  => 'float',
        'to'    => 'float',
        'price' => 'float',
    ];
}
