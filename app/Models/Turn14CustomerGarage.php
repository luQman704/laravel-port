<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14CustomerGarage extends Model
{
    protected $table = 'new902_turn14_customer_garage';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['id_customer', 'id_vehicle_filter', 'secure_key', 'stage', 'date_add'];
}
