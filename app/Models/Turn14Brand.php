<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14Brand extends Model
{
    protected $table = 'new902_turn14_brand';
    protected $primaryKey = 'id_turn14_brand';
    public $timestamps = false;

    protected $casts = [
        'sync_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(Turn14Product::class, 'brand_id', 'brand_id');
    }
}
