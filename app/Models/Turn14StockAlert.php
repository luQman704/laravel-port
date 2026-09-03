<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14StockAlert extends Model
{
    protected $table = 'new902_turn14_stock_alerts';
    protected $primaryKey = 'id_alert';
    public $timestamps = false;

    protected $fillable = [
        'turn14_product_id', 'ps_product_id', 'email',
        'watch_local', 'watch_usa', 'watch_mfr',
        'token', 'date_add', 'date_notified',
    ];

    protected $casts = [
        'watch_local' => 'boolean',
        'watch_usa'   => 'boolean',
        'watch_mfr'   => 'boolean',
        'date_add'    => 'datetime',
        'date_notified' => 'datetime',
    ];
}
