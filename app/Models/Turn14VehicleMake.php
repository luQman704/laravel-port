<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14VehicleMake extends Model
{
    protected $table = 'new902_turn14_vehicle_make';
    protected $primaryKey = 'id_make';
    public $timestamps = false;

    protected $casts = ['active' => 'boolean'];
}
