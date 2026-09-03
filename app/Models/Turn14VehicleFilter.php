<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14VehicleFilter extends Model
{
    protected $table = 'new902_turn14_vehicle_filter';
    protected $primaryKey = 'id_vehicle_filter';
    public $timestamps = false;

    protected $casts = ['active' => 'boolean'];
}
