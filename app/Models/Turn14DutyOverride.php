<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14DutyOverride extends Model
{
    protected $table = 'new902_turn14_duty_override';
    protected $primaryKey = 'id_override';
    public $timestamps = false;

    protected $casts = [
        'duty_rate' => 'float',
    ];
}
