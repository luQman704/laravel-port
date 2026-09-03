<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogArticle extends Model
{
    protected $fillable = [
        'title', 'slug', 'category', 'cover_image', 'excerpt', 'body',
        'read_minutes', 'is_published', 'published_at', 'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
}
