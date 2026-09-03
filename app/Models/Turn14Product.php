<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Turn14Product extends Model
{
    protected $table = 'new902_turn14_product';
    protected $primaryKey = 'id_turn14_product';
    public $timestamps = false;

    protected $casts = [
        'dimensions'           => 'array',
        'sync_active'          => 'boolean',
        'discontinued'         => 'boolean',
        'ltl_freight_required' => 'boolean',
        'special_order'        => 'boolean',
        'is_kit'               => 'boolean',
        'air_freight_prohibited' => 'boolean',
        'clearance_item'       => 'boolean',
        'can_purchase'         => 'boolean',
        'usd_price'            => 'float',
        'weight'               => 'float',
        'length'               => 'float',
        'width'                => 'float',
        'height'               => 'float',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Turn14Brand::class, 'brand_id', 'brand_id');
    }

    public function stock(): HasOne
    {
        return $this->hasOne(Turn14Stock::class, 'turn14_product_id', 'id');
    }

    public function productMap(): HasOne
    {
        return $this->hasOne(Turn14ProductMap::class, 'turn14_product_id', 'id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(Turn14ProductMedia::class, 'turn14_product_id', 'id')
                    ->orderBy('position');
    }

    public function scopeActive($query)
    {
        return $query->where('sync_active', 1)->where('discontinued', 0);
    }

    public function scopeForVehicle($query, int $idVehicleFilter)
    {
        return $query->join('new902_turn14_vehicle_product as tvp', 'tvp.part_number', '=', 'new902_turn14_product.part_number')
            ->where('tvp.id_vehicle_filter', $idVehicleFilter);
    }
}
