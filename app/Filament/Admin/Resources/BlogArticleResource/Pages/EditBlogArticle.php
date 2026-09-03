<?php

namespace App\Filament\Admin\Resources\BlogArticleResource\Pages;

use App\Filament\Admin\Resources\BlogArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditBlogArticle extends EditRecord
{
    protected static string $resource = BlogArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
