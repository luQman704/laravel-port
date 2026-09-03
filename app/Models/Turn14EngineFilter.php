<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14EngineFilter extends Model
{
    protected $table = 'new902_turn14_engine_filter';
    protected $primaryKey = 'id_engine_filter';
    public $timestamps = false;

    protected $casts = ['active' => 'boolean'];
}
