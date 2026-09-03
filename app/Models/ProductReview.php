<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ProductReview extends Model
{
    protected $fillable = [
        'turn14_product_id',
        'user_id',
        'reviewer_name',
        'reviewer_email',
        'title',
        'body',
        'rating',
        'status',
        'verified_purchase',
    ];

    protected $casts = [
        'rating'            => 'integer',
        'verified_purchase' => 'boolean',
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }
}
