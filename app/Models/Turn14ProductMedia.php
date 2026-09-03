<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Turn14ProductMedia extends Model
{
    protected $table = 'new902_turn14_product_media';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['turn14_product_id', 'image_url', 'position', 'date_added'];
}
