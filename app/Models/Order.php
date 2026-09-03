<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $guarded = ['id'];
    protected $casts = [
        'subtotal_excl' => 'float',
        'vat_amount'    => 'float',
        'shipping_cost' => 'float',
        'total_incl'    => 'float',
    ];

    public function items(): HasMany { return $this->hasMany(OrderItem::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
