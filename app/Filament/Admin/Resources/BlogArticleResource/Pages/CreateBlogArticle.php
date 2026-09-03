<?php

namespace App\Filament\Admin\Resources\BlogArticleResource\Pages;

use App\Filament\Admin\Resources\BlogArticleResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBlogArticle extends CreateRecord
{
    protected static string $resource = BlogArticleResource::class;
}
